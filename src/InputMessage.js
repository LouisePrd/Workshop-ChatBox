import React, {useState} from "react";

const InputMessage = ({ socket }) => {
    const [value, setValue] = useState("");

  const messageForm = (e) => {
    e.preventDefault();
    socket.emit("message", value);
    setValue("");
  };

  return (
    <form onSubmit={messageForm}>
      <input
        autoFocus
        value={value}
        placeholder="Type your message"
        onChange={(e) => {
          setValue(e.currentTarget.value);
        }}
      />
    </form>
  );
};

export default InputMessage;