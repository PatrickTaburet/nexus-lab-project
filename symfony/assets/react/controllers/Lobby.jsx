import React, { useState, useEffect } from 'react';
import styles from "/assets/styles/Lobby.module.css?module";


const Lobby = () => {
    const socket = window.socket;
    const [rooms, setRooms] = useState([]);
    const [newRoomName, setNewRoomName] = useState("");

    useEffect(() => {
        socket.on("room_list", list => setRooms(list));
        socket.on("room_update", () => {
            /* on peut rafraîchir la liste ou pus */
        });
        socket.on("room_started", ({ roomId }) => {
            // redirection vers le canvas
            window.location = `/collective-drawing/${roomId}`;
        });
        return () => {
            socket.off("room_list");
            socket.off("room_update");
            socket.off("room_started");
        }
    }, []);

    function handleCreate() {
        const id = Math.random().toString(36).substr(2, 9);
        socket.emit("create_room", { roomId: id, name: newRoomName });
        socket.emit("join_room", {
            roomId: id,
            userId: window.currentUser.id,
            username: window.currentUser.username
        });
    }

    function handleJoin(roomId) {
        socket.emit("join_room", {
            roomId,
            userId: window.currentUser.id,
            username: window.currentUser.username
        });
    }

    function handleStart(roomId) {
        socket.emit("start_room", { roomId });
    }

    return (
        <div>
            <h1>Lobby</h1>
            <input
                value={newRoomName}
                onChange={e => setNewRoomName(e.target.value)}
                placeholder="Room name"
            />
            <button onClick={handleCreate}>Create</button>

            <ul>
                {rooms.map(r => (
                    <li key={r.roomId}>
                        <strong>{r.name}</strong> ({r.currentPlayers}/{r.maxPlayers})
                        {!r.hasStarted && (
                            <>
                                {r.currentPlayers < r.maxPlayers ? (
                                    <button onClick={() => handleJoin(r.roomId)}>Join</button>
                                ) : (
                                    <span>Pleine</span>
                                )}
                                { /* Seul le créateur ou premier arrivé peut lancer ?
                   tu peux passer l’info de qui a créé via le payload */}
                                <button onClick={() => handleStart(r.roomId)}>Start</button>
                            </>
                        )}
                        {r.hasStarted && <em>Occupied</em>}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Lobby;