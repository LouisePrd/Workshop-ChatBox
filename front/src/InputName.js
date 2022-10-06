import React, {useState} from "react";

const InputName = ({ socket, spotifyUser }) => {
    const [value, setValue] = useState("");
    const [isName, setIsName] = useState(spotifyUser?.display_name);

    const usernameForm = (e) => {
        e.preventDefault();
        socket.emit("setUsername", value);
        setIsName(value);
        setValue("");
      };

    return (
        <>
        <span className="displayName"><b></b>{isName}</span>
        <form onSubmit={usernameForm}>
          <input className="input-name"
            autoFocus
            value={value}
            placeholder="Username"
            onChange={(e) => {
              setValue(e.currentTarget.value);
            }}
          />
        </form>
        </>
      );
};

export default InputName;