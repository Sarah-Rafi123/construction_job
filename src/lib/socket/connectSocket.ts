import { io } from "socket.io-client";

const socket = io("http://localhost:9000", {
  withCredentials: true,
});

socket.on("connect", () => {
  console.log("Socket connected:", socket.id);
});

socket.on("connect_error", (err) => {
  console.error("Connection failed:", err.message);
});

export default socket;
