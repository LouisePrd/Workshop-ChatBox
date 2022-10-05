import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { io } from 'socket.io-client';

import User from './User';
import ThreadMessages from './ThreadMessages';
import InputName from './InputName';
import InputMessage from './InputMessage';

function App() {

  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("https://whispering-chamber-09886.herokuapp.com/");
    setSocket(newSocket);
    return () => newSocket.close();
  }, [setSocket]);

  useEffect(() => {
    if (socket) {
      const getMessages = (messages) => {
        setMessages((messages));
      };

      const getUsers = (users) => {
        setUsers((users));
      };

      const getNewUser = (user) => {
        setUsers(prevUsers => {
          return [...prevUsers, user];
        });
      };

      const updateUser = (user) => {
        setUsers(prevUsers => {
          prevUsers[user.id] = user;
          return prevUsers;
        });
      };

      const deleteUser = (userId) => {
        setUsers(prevUsers => {
          return prevUsers.filter(user => user.id !== userId);
        });
      };

      socket.on("messages", getMessages);
      socket.on("message", message => setMessages(
        prevMessages => [...prevMessages, message]
      ))
      socket.emit("getMessages");

      socket.on('users', getUsers);
      socket.on('userConnection', getNewUser);
      socket.on('updateUsername', updateUser);
      socket.on('deleteUser', deleteUser);
      socket.emit('getUsers');

      // return () => {
      //   socket.off("messages", getMessages);
      //   socket.off("users", getUsers);
      //   socket.off("userConnection", getNewUser);
      //   socket.off("updateUsername", updateUser);
      //   socket.off("deleteUser", deleteUser);
      // };
    }
  }, [socket]);

  console.log(messages);
  console.log(users);

  return (
    <div className="App">
      <InputName socket={socket} />
      <InputMessage socket={socket} />
      {socket ? (
        <>
          <ThreadMessages messages={messages} />
          <User users={users} /></>)
        :
        (<div>Not connected</div>)}
    </div>
  );
}

export default App;
