import React, { useState, useEffect } from "react";
import defaultImg from './assets/images/default.jpg';



function ThreadMessages({ messages }) {
  var classType = "message";

  const renderElement = (idUser, idUserMessage) => {
    if (idUser === idUserMessage) {
      classType = 'message-user';
    } else {
      classType = 'message-other';
    }
  };

    return (
      <div className="thread-messages">
        {messages
          .sort((a, b) => a.time - b.time)
          .slice(messages.length - 8, messages.length)
          .map((message) => (
            <div key={message.id} class="message" className={renderElement(message.user.id, message.id)}>
              <div>
                <img className="profile-random" src={defaultImg} alt="profile" />
              </div>
              <div className="message-content">
                <div className="message-username">{message.user.name} : </div>
                <div className="message-text">{message.value} </div>
              </div>
            </div>
          ))}
      </div>
    );
  }

  export default ThreadMessages;