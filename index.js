

const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const PORT = 3001;

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/index.html");
});

app.use(express.static(__dirname));

io.on("connection", (socket) => {
	socket.on("chat message", (data) => {
		io.emit("chat message", {
			message: data.message,
			name: data.name,
		});
	});
});

http.listen(PORT, () => {
	console.log(`server is started on ${PORT} port`);
});
