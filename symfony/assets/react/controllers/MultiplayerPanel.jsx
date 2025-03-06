import React, { useState, useEffect } from 'react';
import { socket } from '../../../public/js/collective_drawing/socketManager';
// import io from 'socket.io-client';
import styles from "/assets/styles/MultiplayerPanel.module.css?module";

// Créez une instance de socket. Adaptez l'URL si besoin.
// const socket = io("http://localhost:3001");

const MultiplayerPanel = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    console.log("useEffect react - mounting MultiplayerPanel");

    socket.on("update_users", (userList) => {
        console.log("userList react");
        console.log(userList);
        setUsers(userList);
    });
    socket.emit("get_users", { sessionId: "session1" });

    return () => {
      socket.off("update_users");
    };
  }, []);

  return (
    <div className="multiplayer-container">
      <div className="card-border">
        <div className="card multi-card">
          <h2 className="card-title">
            Multiplayer panel
          </h2>
          <div className="separator"></div>
          <div className="card-content">
              <div className="tool-section-frame">
                  <h3>Players</h3>
              </div>
                <div className="tool-section-frame players">
                  <div>
                  <ul>
                    {users.map((user, index) => (
                      <li key={index} style={{ color: user.userColor }}>
                        {user.username}
                      </li>
                    ))}
                  </ul>
                  </div>
                  {/* {{ ux_icon('iconamoon:profile-bold', {width: 95, height: 95, class: 'ux-icons img-icon player-icon'}) }} */}
              </div>
            </div>
            <div className="separator"></div>
            <div className="card-content">
              <div className="tool-section-frame">
                  <h3>Chat</h3>
              </div>
              <div className="tool-section-frame">
                  <div className="chat">
                    <p>- Player 1 : Lorem ipsum !</p>
                    <p>- Player 2 : Ipsum lorem ?</p>
                    <p>- ...</p>
                  </div>
              </div> 
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiplayerPanel;
