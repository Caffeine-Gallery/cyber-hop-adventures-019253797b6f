import { backend } from 'declarations/backend';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 400;

const GRAVITY = 0.5;
const JUMP_FORCE = -10;
const MOVE_SPEED = 5;

let score = 0;
let level = 1;

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;
        this.velocityY = 0;
        this.isJumping = false;
    }

    draw() {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        this.velocityY += GRAVITY;
        this.y += this.velocityY;

        if (this.y + this.height > canvas.height) {
            this.y = canvas.height - this.height;
            this.velocityY = 0;
            this.isJumping = false;
        }
    }

    jump() {
        if (!this.isJumping) {
            this.velocityY = JUMP_FORCE;
            this.isJumping = true;
        }
    }
}

class Platform {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    draw() {
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;
        this.speed = 2;
    }

    draw() {
        ctx.fillStyle = 'blue';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        this.x += this.speed;
        if (this.x + this.width > canvas.width || this.x < 0) {
            this.speed *= -1;
        }
    }
}

class Powerup {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
    }

    draw() {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

const player = new Player(50, canvas.height - 30);
const platforms = [
    new Platform(0, canvas.height - 20, canvas.width, 20),
    new Platform(200, 300, 100, 20),
    new Platform(400, 200, 100, 20),
    new Platform(600, 300, 100, 20)
];
const enemies = [
    new Enemy(300, canvas.height - 50),
    new Enemy(500, canvas.height - 50)
];
const powerups = [
    new Powerup(350, 180),
    new Powerup(650, 280)
];

let keys = {};

document.addEventListener('keydown', (e) => {
    keys[e.code] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.code] = false;
});

function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (keys['ArrowLeft']) {
        player.x -= MOVE_SPEED;
    }
    if (keys['ArrowRight']) {
        player.x += MOVE_SPEED;
    }
    if (keys['Space']) {
        player.jump();
    }

    player.update();

    for (let platform of platforms) {
        platform.draw();
        if (checkCollision(player, platform)) {
            player.y = platform.y - player.height;
            player.velocityY = 0;
            player.isJumping = false;
        }
    }

    for (let enemy of enemies) {
        enemy.update();
        enemy.draw();
        if (checkCollision(player, enemy)) {
            alert('Game Over! Your score: ' + score);
            resetGame();
            return;
        }
    }

    for (let i = powerups.length - 1; i >= 0; i--) {
        powerups[i].draw();
        if (checkCollision(player, powerups[i])) {
            score += 10;
            powerups.splice(i, 1);
            updateScore();
        }
    }

    player.draw();

    if (player.x > canvas.width - player.width) {
        level++;
        updateLevel();
        resetLevel();
    }

    requestAnimationFrame(gameLoop);
}

function resetGame() {
    player.x = 50;
    player.y = canvas.height - 30;
    score = 0;
    level = 1;
    updateScore();
    updateLevel();
    resetLevel();
}

function resetLevel() {
    player.x = 50;
    player.y = canvas.height - 30;
    powerups.push(new Powerup(350, 180), new Powerup(650, 280));
}

function updateScore() {
    document.getElementById('scoreValue').textContent = score;
}

function updateLevel() {
    document.getElementById('levelValue').textContent = level;
}

async function saveHighScore() {
    const playerName = prompt('Enter your name for the high score:');
    if (playerName) {
        await backend.addHighScore(playerName, score);
    }
}

async function displayHighScores() {
    const highScores = await backend.getHighScores();
    let highScoreText = 'High Scores:\n';
    highScores.forEach((score, index) => {
        highScoreText += `${index + 1}. ${score[0]}: ${score[1]}\n`;
    });
    alert(highScoreText);
}

gameLoop();
