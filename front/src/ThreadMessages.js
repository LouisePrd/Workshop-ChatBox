import React, {useState, useEffect} from "react";

function ThreadMessages({messages}) {

  
  return (
    <div className="thread-messages">
      <h2>Thread Messages</h2>
      {messages
        .sort((a, b) => a.time - b.time)
        .slice(messages.length - 10, messages.length)
        .map((message) => (
        <div key={message.id} className="message">
            <span className="message-username">{message.user.name}</span>
            <span className="message-text">{message.value}</span>
            <span className="message-timestamp">{new Date(message.time).toLocaleTimeString()}</span>
        </div>
      ))}
    </div>
  );
}

export default ThreadMessages;