import React, {useState, useEffect} from "react";
import fond1 from './assets/fonds/fond1.jpg';
import fond2 from './assets/fonds/fond2.jpg';
import fond3 from './assets/fonds/fond3.jpg';

function ThreadMessages({messages}) {
  
  const fonds = [fond1, fond2, fond3];
  function randomImg(){
    return fonds[Math.floor(Math.random() * fonds.length)];
  }

  return (
    <div className="thread-messages">
      {messages
        .sort((a, b) => a.time - b.time)
        .slice(messages.length - 8, messages.length)
        .map((message) => (
          
        <div key={message.id} className="message">
          <div>
            <img className="profile-random" src={randomImg()} alt="profile" />
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