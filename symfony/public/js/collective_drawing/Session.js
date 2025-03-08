const usersColors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];

class Session {
  constructor(sessionId) {
    this.sessionId = sessionId;
    this.canvasData = null;
    this.users = {};
  }

  // Add or update user in the session
  addUser(userId, socketId, username) {
      // If user already exist, update his socket id
        if (this.users[userId]) {
            this.users[userId].socketId = socketId;
            this.users[userId].online = true;
        } else {
            // Else, add user and asign him a color
            const userCount = Object.keys(this.users).length;
            const userColor = usersColors[userCount % usersColors.length];
            this.users[userId] = {
                socketId,
                username,
                userId,
                color: userColor,
                pointer: { x: 0, y: 0, isClicking: false },
                online: true
            };
        }
  }

  // Marks a user as offline (instead of deleting him)
  removeUser(userId) {
    if (this.users[userId]) {
      this.users[userId].online = false;
    }
  }

  // Update canvas state
  updateCanvas(data) {
    this.canvasData = data;
  }

  // Returns users list formatted for broadcast
  getUserList() {
    return Object.values(this.users).map(user => ({
      username: user.username,
      userColor: user.color,
      online: user.online
    }));
  }
}

module.exports = Session;