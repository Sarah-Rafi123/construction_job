import { io } from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:9000", {
  withCredentials: true,
});

// socket.on("connect", () => {
//   console.log("Socket connected:", socket.id);
// });

// socket.on("connect_error", (err) => {
//   console.error("Connection failed:", err.message);
// });

export default socket;