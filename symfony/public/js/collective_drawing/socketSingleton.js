const socket = typeof io !== 'undefined' ? io("http://localhost:3001") : null;

if (!socket) {
  console.warn("socket.io is not loaded on this page.");
} else {
  console.log('INSTANCE');
  socket.on("connect", () => {
    console.log("Socket connected (singleton) :", socket.id);
    socket.emit("join_session", {
      sessionId: "session1",
      userId: window.currentUser.id,
      username: window.currentUser.username
    });
  });
  window.socket = socket;
}
