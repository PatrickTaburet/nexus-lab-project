const socket = typeof io !== 'undefined' ? io("http://localhost:3001") : null;

if (!socket) {
  console.warn("socket.io is not loaded on this page.");
}
console.log('INSTANCE'); 

export default socket;