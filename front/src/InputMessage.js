import React, { useState } from "react";

const InputMessage = ({ socket }) => {
  const [value, setValue] = useState("");

  const messageForm = (e) => {
    e.preventDefault();
    socket.emit("message", value);
    setValue("");
  };

  return (
    <form onSubmit={messageForm}>
      <div>
        <input className="input-message"
          autoFocus
          value={value}
          placeholder="Ecrivez ici..."
          onChange={(e) => {
            setValue(e.currentTarget.value);
          }}
        />
      </div>
    </form>
  );
};

export default InputMessage;