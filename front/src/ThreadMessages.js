import React, {useState, useEffect} from "react";

function ThreadMessages({messages}) {
  
  return (
    <div className="thread-messages">
      {messages
        .sort((a, b) => a.time - b.time)
        .slice(messages.length - 10, messages.length)
        .map((message) => (
          
        <div key={message.id} className="message">
          
            <span className="message-username">{message.user.name} : </span>
            <br></br>
            <span className="message-text">{message.value} </span>
        </div>
      ))}
    </div>
  );
}

export default ThreadMessages;