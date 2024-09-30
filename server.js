import express from "express";
import { Server } from "socket.io";
import http from "http";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: "*",
});

const msglist = [];
const map = new Map();
let check = true;
io.on("connection", (socket) => {
  if (io.engine.clientsCount > 5) {
    console.log("5명이 이미 접속 중입니다. 연결을 거부합니다.");
    socket.emit("connectionError", "현재 게임이 진행 중입니다.");
    socket.disconnect(); // 연결 종료
    return;
  }
  console.log(socket.id + "들어왔넹");
  io.emit("usercount", io.engine.clientsCount);
  socket.emit("msglist", msglist);
  // @@ 클라이언트 접속하자마자 실행되어야하는 것들

  socket.on("disconnect", () => {
    console.log(socket.id + " 나갔넹");
    io.emit("usercount", io.engine.clientsCount);
  });

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
  const characters = ["멀린", "퍼시멀", "시민", "암살자", "모르가나"];
  socket.on("start", () => {
    if (check) {
      check = false;
      const clients = Array.from(io.sockets.sockets.keys());
      const shuffledNames = characters.sort(() => Math.random() - 0.5);
      for (let i = 0; i < 5; i++) {
        map.set(clients[i], characters[i]);
      }
      io.emit("map", Array.from(map.entries()));
    } else {
    }
  });
});

server.listen(8080, () => {
  console.log("서버열렸어");
});
