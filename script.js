const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreElement = document.getElementById("score");
const highScoreElement = document.getElementById("highScore");
const gameOverScreen = document.getElementById("gameOver");
const finalScoreElement = document.getElementById("finalScore");
const restartBtn = document.getElementById("restartBtn");

const box = 20;
const canvasSize = 400;

let snake;
let food;
let direction;
let nextDirection;
let score;
let gameLoop;
let speed;

let highScore = localStorage.getItem("snakeHighScore") || 0;

highScoreElement.textContent = highScore;


// Start game
function startGame() {

    snake = [
        { x: 200, y: 200 },
        { x: 180, y: 200 },
        { x: 160, y: 200 }
    ];

    food = createFood();

    direction = "RIGHT";
    nextDirection = "RIGHT";

    score = 0;
    speed = 120;

    scoreElement.textContent = score;

    gameOverScreen.style.display = "none";

    clearInterval(gameLoop);
    gameLoop = setInterval(updateGame, speed);
}


// Create random food
function createFood() {

    let newFood;

    do {

        newFood = {
            x: Math.floor(Math.random() * (canvasSize / box)) * box,
            y: Math.floor(Math.random() * (canvasSize / box)) * box
        };

    } while (
        snake &&
        snake.some(segment =>
            segment.x === newFood.x &&
            segment.y === newFood.y
        )
    );

    return newFood;
}


// Draw everything
function draw() {

    // Background
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, canvas.width, canvas.height);


    // Grid
    ctx.strokeStyle = "#222";

    for (let x = 0; x <= canvas.width; x += box) {

        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }

    for (let y = 0; y <= canvas.height; y += box) {

        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }


    // Food
    ctx.fillStyle = "#ff1744";

    ctx.beginPath();
    ctx.arc(
        food.x + box / 2,
        food.y + box / 2,
        box / 2 - 2,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // Snake
    snake.forEach((segment, index) => {

        if (index === 0) {
            ctx.fillStyle = "#00e676";
        } else {
            ctx.fillStyle = "#00c853";
        }

        ctx.fillRect(
            segment.x + 1,
            segment.y + 1,
            box - 2,
            box - 2
        );
    });


    // Snake eyes
    drawEyes();
}


// Draw snake eyes
function drawEyes() {

    const head = snake[0];

    ctx.fillStyle = "white";

    let eye1;
    let eye2;

    if (direction === "RIGHT") {

        eye1 = { x: head.x + 14, y: head.y + 5 };
        eye2 = { x: head.x + 14, y: head.y + 13 };

    } else if (direction === "LEFT") {

        eye1 = { x: head.x + 4, y: head.y + 5 };
        eye2 = { x: head.x + 4, y: head.y + 13 };

    } else if (direction === "UP") {

        eye1 = { x: head.x + 5, y: head.y + 4 };
        eye2 = { x: head.x + 13, y: head.y + 4 };

    } else {

        eye1 = { x: head.x + 5, y: head.y + 14 };
        eye2 = { x: head.x + 13, y: head.y + 14 };
    }

    ctx.fillRect(eye1.x, eye1.y, 3, 3);
    ctx.fillRect(eye2.x, eye2.y, 3, 3);
}


// Game update
function updateGame() {

    direction = nextDirection;

    const head = {
        x: snake[0].x,
        y: snake[0].y
    };


    // Move snake
    if (direction === "UP") {
        head.y -= box;
    }

    if (direction === "DOWN") {
        head.y += box;
    }

    if (direction === "LEFT") {
        head.x -= box;
    }

    if (direction === "RIGHT") {
        head.x += box;
    }


    // Check wall collision
    if (
        head.x < 0 ||
        head.x >= canvasSize ||
        head.y < 0 ||
        head.y >= canvasSize
    ) {

        endGame();
        return;
    }


    // Check body collision
    if (snake.some(segment =>
        segment.x === head.x &&
        segment.y === head.y
    )) {

        endGame();
        return;
    }


    snake.unshift(head);


    // Check food
    if (
        head.x === food.x &&
        head.y === food.y
    ) {

        score++;

        scoreElement.textContent = score;

        if (score > highScore) {

            highScore = score;

            localStorage.setItem(
                "snakeHighScore",
                highScore
            );

            highScoreElement.textContent = highScore;
        }

        food = createFood();

        // Increase speed
        if (speed > 50) {

            speed -= 5;

            clearInterval(gameLoop);

            gameLoop = setInterval(
                updateGame,
                speed
            );
        }

    } else {

        snake.pop();
    }


    draw();
}


// Game over
function endGame() {

    clearInterval(gameLoop);

    finalScoreElement.textContent = score;

    gameOverScreen.style.display = "block";
}


// Keyboard controls
document.addEventListener("keydown", function(event) {

    const key = event.key.toLowerCase();

    if (
        (key === "arrowup" || key === "w") &&
        direction !== "DOWN"
    ) {

        nextDirection = "UP";
    }

    else if (
        (key === "arrowdown" || key === "s") &&
        direction !== "UP"
    ) {

        nextDirection = "DOWN";
    }

    else if (
        (key === "arrowleft" || key === "a") &&
        direction !== "RIGHT"
    ) {

        nextDirection = "LEFT";
    }

    else if (
        (key === "arrowright" || key === "d") &&
        direction !== "LEFT"
    ) {

        nextDirection = "RIGHT";
    }
});


// Mobile controls
document.querySelectorAll(".controls button").forEach(button => {

    button.addEventListener("click", function() {

        const newDirection = this.dataset.key;

        if (
            newDirection === "ArrowUp" &&
            direction !== "DOWN"
        ) {
            nextDirection = "UP";
        }

        else if (
            newDirection === "ArrowDown" &&
            direction !== "UP"
        ) {
            nextDirection = "DOWN";
        }

        else if (
            newDirection === "ArrowLeft" &&
            direction !== "RIGHT"
        ) {
            nextDirection = "LEFT";
        }

        else if (
            newDirection === "ArrowRight" &&
            direction !== "LEFT"
        ) {
            nextDirection = "RIGHT";
        }
    });

});


// Restart
restartBtn.addEventListener("click", startGame);


// Start
startGame();