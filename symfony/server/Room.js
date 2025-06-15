const Session = require('./Session');

class Room {
    constructor(roomId, { name = roomId, maxPlayers = 5, creator = {} } = {}) {
        this.roomId = roomId;
        this.name = name;
        this.maxPlayers = maxPlayers;
        this.creator = creator;
        this.hasStarted = false;
        this.session = new Session(roomId);
    }
    get currentCount() {
        return Object.keys(this.session.users).length;
    }
    canJoin(userId) {
        const alreadyInRoom = !!this.session.users[userId];
        return alreadyInRoom || (!this.hasStarted && this.currentCount < this.maxPlayers);
    }

    addUser(userId, socketId, username) {
        if (!this.canJoin(userId)) throw new Error('Room full or already started');
        this.session.addUser(userId, socketId, username)
    }
    removeUser(userId) {
        this.session.removeUser(userId);
    }

    start() {
        if (this.currentCount === 0) throw new Error('Impossible to start an empty room');
        this.hasStarted = true;
    }
    updateCanvas(data) {
        this.session.updateCanvas(data);
    }
    addChat(message) {
        this.session.addChat(message);
    }
    serializeLobby() {
        return {
            roomId: this.roomId,
            name: this.name,
            currentPlayers: this.currentCount,
            maxPlayers: this.maxPlayers,
            hasStarted: this.hasStarted,
            creator: this.creator
        };
    }

    serializeSession() {
        return {
            canvasData: this.session.canvasData,
            chatMessages: this.session.chatMessages,
            users: this.session.getUserList()
        };
    }
}

module.exports = Room;