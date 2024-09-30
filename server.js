import express from "express";
import { Server } from "socket.io";
import http from "http";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: "*",
});

const msglist = [];

io.on("connection", (socket) => {
  console.log(socket.id + "들어왔넹");
  socket.emit("msglist", msglist);

  const clientIp = socket.handshake.address;
  console.log(`클라이언트 IP: ${clientIp}`);

  socket.on("msg", (msg) => {
    if (msg.msg == "히든콤보입력뿌슝빠슝푸슝") {
      msglist.length = 0;
    } else {
      msglist.push(msg);
    }

    io.emit("msglist", msglist);
  });
});

server.listen(8080, () => {
  console.log("서버열렸어");
});
