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
        <form onSubmit={usernameForm}>
          <input
            autoFocus
            value={value}
            placeholder="Username..."
            onChange={(e) => {
              setValue(e.currentTarget.value);
            }}
          />
        </form>
        <span><b>Your username : </b>{isName}</span>
        </>
      );
};

export default InputName;