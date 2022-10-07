import React, {useState} from "react";

const InputNameForm = ({ socket, spotifyUser }) => {
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
          <input className="input-name"
            autoFocus
            value={value}
            placeholder="New username"
            onChange={(e) => {
              setValue(e.currentTarget.value);
            }}
          />
        </form>
        </>
      );
};

export default InputNameForm;