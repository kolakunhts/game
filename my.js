const name = document.getElementById("name");
const player = document.getElementById("player");
const game = document.getElementById("game");
const status = document.getElementById("status");
const upButton = document.getElementById("up");
const downButton = document.getElementById("down");
const leftButton = document.getElementById("left");
const rightButton = document.getElementById("right");
const jumpButton = document.getElementById("jump");

let nameX = 30;
let nameY = 30;
let playerX = 0;
let playerY = 0;
const step = 12;
const ghostSpeed = 1.35;
const characterSize = 55;
let gameOver = false;
let isJumping = false;
let jumpHeight = 0;
let jumpStartedAt = 0;
const jumpDuration = 600;
const maxJumpHeight = 38;

function keepInside(value, max) {
    return Math.max(0, Math.min(value, max - characterSize));
}

function moveName() {
    nameX = keepInside(nameX, game.clientWidth);
    nameY = keepInside(nameY, game.clientHeight);
    // ເກັບ x/y ໄວ້ໃນ CSS variables ເພື່ອໃຫ້ animation ກະໂດດໃຊ້ຮ່ວມກັນໄດ້.
    name.style.setProperty("--x", `${nameX}px`);
    name.style.setProperty("--y", `${nameY}px`);
    renderName();
}

// ວາດຕົວລະຄອນຕາມຕຳແໜ່ງ ແລະຄວາມສູງຂອງການກະໂດດ.
function renderName() {
    name.style.transform = `translate(${nameX}px, ${nameY - jumpHeight}px)${isJumping ? " scale(1.08)" : ""}`;
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

// ເລີ່ມກະໂດດ; ຖ້າກຳລັງກະໂດດຢູ່ ຈະບໍ່ເລີ່ມຊ້ຳ.
function jump() {
    if (gameOver || isJumping) return;
    isJumping = true;
    jumpStartedAt = performance.now();
    name.classList.add("jumping");
    renderName();
}

// ຄຳນວນຄວາມສູງຂອງຕົວລະຄອນໃຫ້ເປັນໂຄ້ງຂຶ້ນ-ລົງ.
function updateJump(now) {
    if (!isJumping) return;

    const progress = (now - jumpStartedAt) / jumpDuration;
    if (progress >= 1) {
        isJumping = false;
        jumpHeight = 10;
        name.classList.remove("jumping");
        name.style.setProperty("--jump-height", "10px");
        renderName();
        return;
    }

    // sin() ເຮັດໃຫ້ກະໂດດນຸ່ມ: ສູງສຸດຢູ່ກາງຈັງຫວະ.
    jumpHeight = Math.sin(progress * Math.PI) * maxJumpHeight;
    name.style.setProperty("--jump-height", `${jumpHeight}px`);
    renderName();
}

// pointerdown ຮອງຮັບ touch, mouse ແລະ stylus ໂດຍຕອບສະໜອງທັນທີທີ່ແຕະ.
jumpButton.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    jump();
});

// pointerdown ເຮັດໃຫ້ປຸ່ມຕອບສະໜອງໄວ ທັງ touch ແລະ mouse.
function bindTouchButton(button, action) {
    button.addEventListener("pointerdown", (event) => {
        event.preventDefault();
        action();
    });
}

bindTouchButton(upButton, moveTop);
bindTouchButton(downButton, moveBottom);
bindTouchButton(leftButton, moveLeft);
bindTouchButton(rightButton, moveRight);

const keyboardMoves = {
    ArrowUp: moveTop, w: moveTop, W: moveTop,
    ArrowDown: moveBottom, s: moveBottom, S: moveBottom,
    ArrowLeft: moveLeft, a: moveLeft, A: moveLeft,
    ArrowRight: moveRight, d: moveRight, D: moveRight
};

document.addEventListener("keydown", (event) => {
    if (event.key === " " || event.key === "Spacebar") {
        event.preventDefault();
        jump();
        return;
    }
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

    // ໃນຂະນະທີ່ກະໂດດຢູ່ ຜີຈະຈັບບໍ່ໄດ້.
    if (distance < 42 && !isJumping) {
        gameOver = true;
        status.textContent = "ຜີຈັບໄດ້ແລ້ວ!👻";
        game.classList.add("caught");
        return;
    }

    updateJump(performance.now());
    requestAnimationFrame(moveGhost);
}

moveName();
playerX = game.clientWidth - characterSize - 30;
playerY = game.clientHeight - characterSize - 30;
player.style.transform = `translate(${playerX}px, ${playerY}px)`;
requestAnimationFrame(moveGhost);




