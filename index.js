const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const PORT = 3001;
let WIDTH = 600;
let HEIGHT = 800;
let player1_count = 0;
let player2_count = 0;
let MainplayerName = "";
let ball = {
	x: WIDTH / 2,
	y: HEIGHT / 2,
	size: 20,
	color: "gray",
	speed: 0.8,
	speedX: 0,
	speedY: 0,
	angle: 45 * (Math.PI / 180),
};
ball.speedX = Math.cos(ball.angle) * ball.speed;
ball.speedY = Math.sin(ball.angle) * ball.speed;

const PLAYER_SIZE = { x: 100, y: 20 };
let updateBall = () => {
	ball.x += ball.speedX;
	ball.y += ball.speedY;
	if (
		ball.x > player1_count &&
		ball.x < player1_count + PLAYER_SIZE.x &&
		ball.y + ball.size > HEIGHT - PLAYER_SIZE.y
	) {
		ball.angle = (Math.random() * (135 - 45) + 45) * (Math.PI / 180);
		ball.speedX = Math.cos(ball.angle) * ball.speed;
		ball.speedY = Math.sin(ball.angle) * ball.speed;
		ball.speedY = -ball.speedY;
	}
	if (
		ball.x > player2_count &&
		ball.x < player2_count + PLAYER_SIZE.x &&
		ball.y < PLAYER_SIZE.y
	) {
		ball.angle = (Math.random() * (315 - 225) + 225) * (Math.PI / 180);
		ball.speedX = Math.cos(ball.angle) * ball.speed;
		ball.speedY = Math.sin(ball.angle) * ball.speed;
		ball.speedY = -ball.speedY;
	}

	if (ball.y >= HEIGHT) {
		ball.y = HEIGHT / 2;
		ball.angle = (Math.random() * (135 - 45) + 45) * (Math.PI / 180);
		ball.speedX = Math.cos(ball.angle) * ball.speed;
		ball.speedY = Math.sin(ball.angle) * ball.speed;
	}
	if (ball.x >= WIDTH - ball.size || ball.x <= 0) {
		ball.speedX *= -1;
	}
	if (ball.y < 0) {
		ball.y = HEIGHT / 2;
		ball.angle = (Math.random() * (315 - 225) + 225) * (Math.PI / 180);
		ball.speedX = Math.cos(ball.angle) * ball.speed;
		ball.speedY = Math.sin(ball.angle) * ball.speed;
	}
};

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/index.html");
});

app.use(express.static(__dirname));

io.on("connection", (socket) => {
	socket.on("pong", (data) => {

		if (MainplayerName === "") {
			MainplayerName = data.name;
		}
		if (data.name === MainplayerName) {
			player1_count = data.value;

			io.emit("pong", {
				value: player1_count,
				name: data.name,
				mainName: MainplayerName,
			});
		} else {
			player2_count = data.value;

			io.emit("pong", {
				value: player2_count,
				name: data.name,
				mainName: MainplayerName,
			});
		}
	});
	socket.on("ball", (data) => {
		updateBall();

		io.emit("ball", {
			ball: { x: ball.x, y: ball.y },
		});
	});
});

http.listen(PORT, () => {
	console.log(`server is started on ${PORT} port`);
});
