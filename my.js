const name = document.getElementById("name");
const player = document.getElementById("player");
const game = document.getElementById("game");
const status = document.getElementById("status");
const upButton = document.getElementById("up");
const downButton = document.getElementById("down");
const leftButton = document.getElementById("left");
const rightButton = document.getElementById("right");

let nameX = 30;
let nameY = 30;
let playerX = 0;
let playerY = 0;
const step = 12;
const ghostSpeed = 1.35;
const characterSize = 55;
let gameOver = false;

function keepInside(value, max) {
    return Math.max(0, Math.min(value, max - characterSize));
}

function moveName() {
    nameX = keepInside(nameX, game.clientWidth);
    nameY = keepInside(nameY, game.clientHeight);
    name.style.transform = `translate(${nameX}px, ${nameY}px)`;
}
function moveTop() {
    if (gameOver) return;
    nameY -= step;
    moveName();
}
function moveBottom() {
    if (gameOver) return;
    nameY += step;
    moveName();
}
function moveLeft() {
    if (gameOver) return;
    nameX -= step;
    moveName();
}
function moveRight() {
    if (gameOver) return;
    nameX += step;
    moveName();
}

upButton.addEventListener("click", moveTop);
downButton.addEventListener("click", moveBottom);
leftButton.addEventListener("click", moveLeft);
rightButton.addEventListener("click", moveRight);   

const keyboardMoves = {
    ArrowUp: moveTop, w: moveTop, W: moveTop,
    ArrowDown: moveBottom, s: moveBottom, S: moveBottom,
    ArrowLeft: moveLeft, a: moveLeft, A: moveLeft,
    ArrowRight: moveRight, d: moveRight, D: moveRight
};

document.addEventListener("keydown", (event) => {
    const move = keyboardMoves[event.key];
    if (!move) return;
    event.preventDefault();
    move();
});

function moveGhost() {
    if (gameOver) return;

    const dx = nameX - playerX;
    const dy = nameY - playerY;
    const distance = Math.hypot(dx, dy);

    if (distance > 0) {
        playerX += (dx / distance) * ghostSpeed;
        playerY += (dy / distance) * ghostSpeed;
    }

    player.style.transform = `translate(${playerX}px, ${playerY}px)`;

    if (distance < 42) {
        gameOver = true;
        status.textContent = "ຜີຈັບໄດ້ແລ້ວ! ກົດ F5 ເພື່ອເລີ່ມໃໝ່ 👻";
        game.classList.add("caught");
        return;
    }

    requestAnimationFrame(moveGhost);
}

moveName();
playerX = game.clientWidth - characterSize - 30;
playerY = game.clientHeight - characterSize - 30;
player.style.transform = `translate(${playerX}px, ${playerY}px)`;
requestAnimationFrame(moveGhost);







