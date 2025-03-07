import React, { useState, useEffect } from 'react';
import socket from '../../../public/js/collective_drawing/socketSingleton.js';
import styles from "/assets/styles/MultiplayerPanel.module.css?module";

const MultiplayerPanel = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    console.log("useEffect react - mounting MultiplayerPanel");
    socket.emit("join_session", { sessionId: "session1", username: window.currentUser.username, userId: window.currentUser.id });

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
    <div className={`${styles.multiplayerContainer}`}>
      <div className={`${styles.cardBorder}`}>
        <div className={`${styles.card} ${styles.multiCard}`}>
          <h2 className={`${styles.cardTitle}`}>
            Multiplayer panel
          </h2>
          <div className={`${styles.separator}`}></div>
          <div className={`${styles.cardContent}`}>
              <div className={`${styles.toolSectionFrame}`} >
                  <h3>Players</h3>
              </div>
                <div className={`${styles.toolSectionFrame} ${styles.players}`}>
                  <div>
                  <ul>
                    {users.map((user, index) => 
                      user.isOnline &&
                        (
                          <li key={index} style={{ color: user.userColor }}>
                            {user.username}
                          </li>
                        )
                    )}
                  </ul>
                  </div>
                  {/* {{ ux_icon('iconamoon:profile-bold', {width: 95, height: 95, class: 'ux-icons img-icon player-icon'}) }} */}
              </div>
            </div>
            <div className={`${styles.separator}`}></div>
            <div className={`${styles.cardContent}`}>
              <div className={`${styles.toolSectionFrame}`}>
                  <h3>Chat</h3>
              </div>
              <div className={`${styles.toolSectionFrame}`}>
                  <div className={`${styles.chat}`}>
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
