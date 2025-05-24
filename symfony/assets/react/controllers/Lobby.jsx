import React, { useState, useEffect } from 'react';
import styles from "/assets/styles/Lobby.module.css?module";


const Lobby = () => {
    const socket = window.socket;
    const [rooms, setRooms] = useState([]);
    const [newRoomName, setNewRoomName] = useState("");
    const [roomInfo, setRoomInfo] = useState(null);

    // useEffect(() => {
    //     socket.on("join_success", ({ roomId, isFromLobby}) => {
    //         if (isFromLobby) {
    //             window.location.href = `/create/collective-drawing/${roomId}`;
    //         }
    //     });
    //
    //     return () => {
    //         socket.off("join_success");
    //     };
    // }, []);

    useEffect(() => {
        socket.on("room_list", list => setRooms(list));
        socket.on("room_update", (roomData) => {
            console.log("Room updated", roomData);
            setRoomInfo(roomData);
        });
        socket.on("room_started", ({ roomId }) => {
            // redirection vers le canvas
            window.location = `/create/collective-drawing/${roomId}`;
        });
        return () => {
            socket.off("room_list");
            socket.off("room_update");
            socket.off("room_started");
        }
    }, []);

    function handleCreate() {
        if (!window.currentUser) return alert("User not logged in");
        const id = Math.random().toString(36).substr(2, 9);
        socket.emit("create_room", {
            roomId: id,
            name: newRoomName,
            userId: window.currentUser.id,
            username: window.currentUser.username
        });
    }

    function handleJoin(roomId) {
        console.log("hendlejoin - front")
        socket.emit("join_room", {
            roomId,
            userId: window.currentUser.id,
            username: window.currentUser.username,
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
                                    <span>Full</span>
                                )}
                                {window.currentUser.id === r.creator.id && !r.hasStarted && (
                                    <button onClick={() => handleStart(r.roomId)}>Start</button>
                                )}
                                {window.currentUser.id !== r.creator.id && !r.hasStarted && (
                                    <em>Waiting for creator...</em>
                                )}
                            </>
                        )}

                        {r.hasStarted && <em>Occupied</em>}
                    </li>
                ))}

            </ul>

            {roomInfo && (
                <div style={{ marginTop: "2rem" }}>
                    <h2>Room: {roomInfo.name}</h2>
                    <p>Players : {roomInfo.currentPlayers} / {roomInfo.maxPlayers}</p>
                    <p>Status : {roomInfo.hasStarted ? "En cours" : "En attente"}</p>
                    <p>Creator : {roomInfo.creator.username}</p>
                </div>
            )}
        </div>
    );
}

export default Lobby;