const socket = typeof io !== 'undefined' ? io("http://localhost:3001") : null;

if (!socket) {
  console.warn("socket.io is not loaded on this page.");
} else {
  console.log('INSTANCE');
  socket.on("connect", () => {
    console.log("Socket connected (singleton) :", socket.id);
  });
  window.socket = socket;
}

//
// let socket = null;
//
// export function getSocket() {
//   if (!socket && typeof io !== 'undefined') {
//     socket = io("http://localhost:3001", {
//       reconnectionAttempts: 5,    // Essaie 5 fois de se reconnecter
//       reconnectionDelay: 1000,    // 1 sec entre chaque tentative
//       timeout: 5000               // Timeout si pas de réponse
//     });
//
//     console.log("✅ Socket.io singleton created");
//
//     socket.on("connect", () => {
//       console.log("🔌 Socket connected:", socket.id);
//     });
//
//     socket.on("disconnect", (reason) => {
//       console.warn("⚠️ Socket disconnected:", reason);
//     });
//
//     socket.on("reconnect_attempt", (attempt) => {
//       console.log(`🔄 Reconnection attempt ${attempt}...`);
//     });
//
//     socket.on("reconnect_failed", () => {
//       console.error("❌ Reconnection failed");
//     });
//
//     window.socket = socket; // Facultatif mais pratique pour du debug global
//   }
//
//   return socket;
// }
// import { getSocket } from "./socketSingleton";
// const socket = getSocket();
