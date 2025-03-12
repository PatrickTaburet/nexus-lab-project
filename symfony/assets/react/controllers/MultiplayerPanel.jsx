import React, { useState, useEffect, useRef } from 'react';
import socket from '../../../public/js/collective_drawing/socketSingleton.js';
import styles from "/assets/styles/MultiplayerPanel.module.css?module";

const MultiplayerPanel = () => {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const chatContainerRef = useRef(null);

  useEffect(() => {
    console.log("useEffect react - mounting MultiplayerPanel");
    socket.emit("join_session", { sessionId: "session1", username: window.currentUser.username, userId: window.currentUser.id });

    socket.on("update_users", (userList) => {
        console.log("userList react");
        console.log(userList);
        setUsers(userList);
    });
    socket.on("update_chat", (chatMessages) => {
      console.log("chat messages received", chatMessages);
      setMessages(chatMessages);
    });
    socket.emit("get_users", { sessionId: "session1" });
    return () => {
      socket.off("update_users");
    };
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e) => {
    console.log("----------->" + newMessage);
    
    e.preventDefault();
    if (newMessage.trim() === "") return;
    socket.emit("send_chat", {
      sessionId: "session1",
      message: newMessage,
      username: window.currentUser.username,
      userId: window.currentUser.id,
      userColor: users.find(u => u.username === window.currentUser.username)?.userColor
    });
    setNewMessage("");
  }
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
                      user.online &&
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
                  <div className={`${styles.chat}`} ref={chatContainerRef}>
                    <ul>
                      {messages.map((msg, index) => 
                        (
                          <li key={index} >
                            <strong style={{ color: msg.userColor }}>{msg.username} :</strong> {msg.message}
                          </li>
                        ))}
                    </ul>
                  </div>
                  <form onSubmit={handleSendMessage}>
                    <div className={`${styles.sendMessageBox}`}>
                      <div className="text-input-container">
                        <span className="input">
                          <input
                            type="text"
                            placeholder="Write your message here..."
                            className={`${styles.chatInput}`}
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                          />                          
                          <span></span>	
                        </span>
                      </div>
                      <button className={`${styles.sendButton} customButton` } type="submit">Send</button>
                    </div>
                  </form>
              </div> 
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiplayerPanel;
