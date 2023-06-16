const socket = io();
// const messages = document.querySelector(".messages");
// const form = document.querySelector(".form");
// const input = document.querySelector(".input");
// const nameBlock = document.querySelector(".name");
const divPlayer2 = document.querySelector(".player2");
const divPlayer1 = document.querySelector(".player1");
let count1 = 0;
let count2 = 0;

let MainplayerName = "";
let userName1 = "";
let userName2 = "";
let count_ball = { x: 0, y: 0 };
const STEP = 10;
const WIDTH = 600;
const HEIGHT = 800;
const BACKGROUND_COLOR = "silver";
const PLAYER_SIZE = { x: 100, y: 20 };
const P1_COLOR = "red";
const P2_COLOR = "blue";
const ball = {
	size: {
		x: 20,
		y: 20,
	},
	color: "gray",
};

const myCanvas = document.getElementById("my_canvas");
myCanvas.autofocus;
const ctx = myCanvas.getContext("2d");
myCanvas.width = WIDTH;
myCanvas.height = HEIGHT;
myCanvas.style.background = BACKGROUND_COLOR;

const userName = prompt("enter your name:");

socket.emit("pong", { value: count1, name: userName });

socket.on("pong", (data) => {
	if (MainplayerName === "") {
		MainplayerName = data.mainName;
		userName1 = MainplayerName;
	}

	if (data.name === MainplayerName) {
		count1 = +data.value;
	} else {
		count2 = +data.value;
		userName2 = data.name;
	}

	// divPlayer2.innerHTML = `${data.
});
socket.on("ball", (data) => {
	count_ball.x = data.ball.x;
	count_ball.y = data.ball.y;
});

const keyPress = (e) => {
	switch (e.keyCode) {
		case 37:
			if (userName === MainplayerName) {
				if (count1 >= 0) {
					count1 -= STEP;
				}
			} else {
				if (count2 <= WIDTH - PLAYER_SIZE.x) {
					count2 += STEP;
				}
			}
			break;
		case 39:
			if (userName === MainplayerName) {
				if (count1 <= WIDTH - PLAYER_SIZE.x) {
					count1 += STEP;
				}
			} else {
				if (count2 >= 0) {
					count2 -= STEP;
				}
			}
			break;
	}
	if (window.DeviceMotionEvent) {
		window.addEventListener('devicemotion', motion_hook, false);
	}
	else {
		// DeviceMotionEvent не поддерживается
	}
	 
	// Обработчик события DeviceMotionEvent
	function motion_hook(event) {
		console.log(event);
		divPlayer1.innerHTML = `Accelerometer:
		X= ${event.accelerationIncludingGravity.x}
		Y= ${event.accelerationIncludingGravity.y}
		Z= ${event.accelerationIncludingGravity.z}`
		// if (event.accelerationIncludingGravity.x > 90){count1++}
		// if (event.accelerationIncludingGravity.x < 90){count1--}
		// if (event.accelerationIncludingGravity.y > 90){count2++}
		// if (event.accelerationIncludingGravity.y > 90){count2--}	
		
	}
	if (userName === MainplayerName) {
		socket.emit("pong", { value: count1, name: userName });
	} else {
		socket.emit("pong", { value: count2, name: userName });
	}
};
addEventListener("keydown", keyPress);

let drawP = (master, count, y) => {
	if (master) {
		ctx.fillStyle = P1_COLOR;
		ctx.fillRect(
			count,
			HEIGHT - PLAYER_SIZE.y + y,
			PLAYER_SIZE.x,
			PLAYER_SIZE.y
		);
	} else {
		ctx.fillStyle = P2_COLOR;
		ctx.fillRect(count, 0 + y, PLAYER_SIZE.x, PLAYER_SIZE.y);
	}
};
let drawBall = () => {
	ctx.fillStyle = ball.color;
	if (userName === MainplayerName) {
		ctx.fillRect(count_ball.x, count_ball.y, ball.size.x, ball.size.y);
	} else {
		ctx.fillRect(
			WIDTH - count_ball.x - ball.size.x,
			HEIGHT - count_ball.y - ball.size.y,
			ball.size.x,
			ball.size.y
		);
	}
};

let mainLoop = () => {
	ctx.fillStyle = BACKGROUND_COLOR;
	ctx.fillRect(0, 0, myCanvas.width, myCanvas.height);
	if (userName === MainplayerName) {
		drawP(true, count1, 0);
		drawP(false, count2, 0);
		// divPlayer1.innerHTML = `name: ${userName1}`;
		divPlayer2.innerHTML = `name: ${userName2}`;
	} else {
		drawP(true, WIDTH - count1 - PLAYER_SIZE.x, -(HEIGHT - PLAYER_SIZE.y));
		drawP(false, WIDTH - count2 - PLAYER_SIZE.x, HEIGHT - PLAYER_SIZE.y);
		// divPlayer1.innerHTML = `name: ${userName2}`;
		divPlayer2.innerHTML = `name: ${userName1}`;
	}

	drawBall();
	socket.emit("ball", {});

	requestAnimationFrame(mainLoop);
};

mainLoop();
