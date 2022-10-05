import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { io } from 'socket.io-client';

import User from './User';
import ThreadMessages from './ThreadMessages';
import InputName from './InputName';
import InputMessage from './InputMessage';
import axios from 'axios';


function App() {

  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  const CLIENT_ID = "267dee8acb604afd81a5b1464a34b77a"
  const REDIRECT_URI = "http://localhost:3000"
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  const RESPONSE_TYPE = "token"

  const [token, setToken] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    const newSocket = io("https://whispering-chamber-09886.herokuapp.com/");
    setSocket(newSocket);
    return () => newSocket.close();
  }, [setSocket]);

  useEffect(() => {
    const hash = window.location.hash
    let token = window.localStorage.getItem("token")

    if (!token && hash) {
      token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

      window.location.hash = ""
      window.localStorage.setItem("token", token)
    }

    setToken(token)

    const { data } = axios.get("https://api.spotify.com/v1/playlists/1RZtOFKYBUajvP0bbBNb7a/tracks", {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-type': 'application/json'
      },
    })
    .then((response) => {
      console.log(response);
    })
  }, []);
  

  const logout = () => {
    setToken("")
    window.localStorage.removeItem("token")
  }

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
      {!token ?
        <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>Login
          to Spotify</a>
        : <button onClick={logout}>Logout</button>}
      {/* {artists.map(artist => (
      <div key={artist.id}>
        {artist.images.length ? <img width={"100%"} src={artist.images[0].url} alt="" /> : <div>No Image</div>}
        {artist.name}
      </div>
      ))} */}
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
