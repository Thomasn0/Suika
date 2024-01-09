import {FRUITS} from './fruits.js';

// matter.js imports 
var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Body = Matter.Body,
    Bodies = Matter.Bodies,
    Events = Matter.Events,
    World = Matter.World;

// create engine
const engine = Engine.create(),
   world = engine.world;

// Creates the main frame rectangle
var render = Render.create({
    element: document.querySelector('#Suika'),
    engine: engine,
    options: {
        wireframes: false,
        background: "#F7F4C8",
        width: 620,
        height: 850,
    }
});

// This walls are the yellow border around the playzone
const leftWall = Bodies.rectangle(15, 395, 30, 790, {
    isStatic: true,
    render: { fillStyle: "#E6B143" }
});

const rightWall = Bodies.rectangle(605, 395, 30, 790, {
    isStatic: true,
    render: { fillStyle: "#E6B143" }
});

const ground = Bodies.rectangle(310, 820, 620, 60, {
    isStatic: true,
    render: { fillStyle: "#E6B143" }
});

const topLine = Bodies.rectangle(310, 150, 620, 2, {
    name: "topLine",
    isStatic: true,
    isSensor: true,
    render: { fillStyle: "#E6B143" }
});

World.add(world, [leftWall, rightWall, ground, topLine]);

Render.run(render);

// create runner
const runner = Runner.create();
Runner.run(runner, engine);

let currentBody = null;
let currentFruit = null;
let disableAction = false;
let interval = null;
let score = 0;

function addFruit() {
    const index = Math.floor(Math.random() * 5);
    const fruit = FRUITS[index];
    const body = Bodies.circle(300, 50, fruit.radius, {
        index: index,
        isSleeping: true,
        render: {
        sprite: { texture: `${fruit.name}.png` }
        },
        restitution: 0.2,
    });

    currentBody = body;
    currentFruit = fruit;

    World.add(world, body);
    checkEntitiesTouchingTopLine();

}

window.onkeydown = (event) => {
    if (disableAction){
        return;
    }

    switch(event.code){
        case "KeyA":
            if (interval)
                return;

            interval = setInterval(() => {
                if(currentBody.position.x - currentFruit.radius > 30)
                Body.setPosition(currentBody,{
                    x: currentBody.position.x - 1,
                    y: currentBody.position.y,
                });
            }, 5);

            break;
        case "KeyD":
            if (interval)
                return;
            interval = setInterval(() => { 
                if(currentBody.position.x + currentFruit.radius < 590)
                Body.setPosition(currentBody,{
                    x: currentBody.position.x + 1,
                    y: currentBody.position.y,
                });
            }, 5)

            break;
        case "KeyS":
            clearInterval(interval);
            interval = null;
            currentBody.isSleeping = false;
            disableAction = true;
            
            setTimeout(() =>{ 
                addFruit(); 
                disableAction = false;
            }, 1000);
            break;
    }
}

window.onkeyup = (event) => {
    switch (event.code) {
        case "KeyA":
        case "KeyD":
            clearInterval(interval);
            interval = null;
    }
}
Events.on(engine, "collisionStart", (event) => {

    // combining two fruits makes the next tier fruit at the collision spot
    event.pairs.forEach((collision) => {
        if (collision.bodyA.index === collision.bodyB.index){
            const index = collision.bodyA.index;

            if (index === FRUITS. length - 1){
                return;
            }
            World.remove(world, [collision.bodyA, collision.bodyB]);
            increaseScore(index);
            if (index === FRUITS. length - 1){
                return;
            }
            const newFruit = FRUITS[index + 1];
            const newBody = Bodies.circle(
                collision.collision.supports[0].x,
                collision.collision.supports[0].y,
                newFruit.radius,
                {
                    index: index + 1,
                    render: {
                        sprite: { texture: `${newFruit.name}.png` }
                    },
                }
            );
            World.add(world, newBody);
        }
        if(!disableAction && (collision.bodyA.name === "topLine" || collision.bodyB.name === "topLine")){
            alert("Game over");
        }
    });
});
function checkEntitiesTouchingTopLine() {
    // Introduce a delay (e.g., 1000 milliseconds) before checking
    setTimeout(() => {
        const entitiesTouchingTopLine = world.bodies.filter(body => (
            !body.isSleeping &&
            (body.position.y - body.circleRadius) < topLine.position.y
        ));

        if (entitiesTouchingTopLine.length > 0) {
            // Display an alert when any entity touches the topLine
            alert("Game over: An entity touched the topLine");
            // Optionally, you can add more logic here, such as resetting the game.
        }
    }, 1000); // Adjust the delay as needed (in milliseconds)
}
function updateScore(){
    document.getElementById('score').textContent = score;
}

function increaseScore(index){
    score = score + FRUITS[index].valueCombine;
    updateScore();
}

updateScore();
addFruit();

