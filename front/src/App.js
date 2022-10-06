import React, { useEffect, useState, useRef } from 'react';
import cd from './images/cd.png';
import './App.css';
import { io } from 'socket.io-client';

import User from './User';
import ThreadMessages from './ThreadMessages';
import InputName from './InputName';
import InputMessage from './InputMessage';
import axios from 'axios';
import ProgressBar from './ProgressBar';
import Playlist from './Playlist';
import Player from './Player';

function App() {

  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [spotifyUser, setSpotifyUser] = useState([]);
  const [socket, setSocket] = useState(null);

  const CLIENT_ID = "267dee8acb604afd81a5b1464a34b77a"
  const REDIRECT_URI = "http://localhost:3000"
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  const RESPONSE_TYPE = "token"

  const [token, setToken] = useState("");
  const [playlist, setPlaylist] = useState([]);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [showPlaylist2, setShowPlaylist2] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);

  const player = useRef(null);

  useEffect(() => {
    const newSocket = io("https://whispering-chamber-09886.herokuapp.com/");
    setSocket(newSocket);
    return () => newSocket.close();
  }, [setSocket]);

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    if (!token && hash) {
      token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1];

      window.location.hash = "";
      window.localStorage.setItem("token", token);
    }

    setToken(token);

    const { data } = axios.get("https://api.spotify.com/v1/playlists/2iYIoic1SsHMh4FLM9lEMU/tracks", {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-type': 'application/json'
      },
    })
      .then((response) => {
        console.log(response);
        { response.data.items ? setPlaylist(response.data.items) : console.log("no items") }
      });

    const { userData } = axios.get("https://api.spotify.com/v1/users/31zbcrw3soubvcdiyaljy5zen2wm", {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-type': 'application/json'
      },
    })
      .then((response) => {
        console.log(response);
        { response.data ? setSpotifyUser(response.data) : console.log("no user") };
        { spotifyUser ? console.log(spotifyUser) : console.log("no user") };
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

  const url = "http://streaming.tdiradio.com:8000/house.mp3";
  const [audio] = useState(new Audio(url));
  const [playing, setPlaying] = useState(false);

  const play = () => {
    setPlaying(true);
    console.log(audio);
    audio.play();
  }

  const pause = () => {
    setPlaying(false);
    audio.pause();
  }

  const childToParent = (childdata) => {
    setSelectedItem(childdata);
    console.log(childdata);
  }


  return (
    <div className="App Conteneur">
      <div className='left'>
        <div className='cdContainer'>
          <img className='cd App-logo' src={cd} alt="cd" />
          <div className='cdContent'>
          <audio id="player" ref={player} src="http://streaming.tdiradio.com:8000/house.mp3" onTimeUpdate={() => {let duration = player.current.duration; let ct = player.current.currentTime; setProgress(Math.floor((ct * 100) / duration))}}></audio>
            <img className='cdContentImg' src={playlist[0] ? playlist[0].track.album.images[0].url : ""} alt="cd" />
            <div className='cdContentText'>
              <p className='cdContentTextp'>{playlist[0] ? playlist[0].track.name : ""}</p>
              <p className='cdContentTextp'>{playlist[0] ? playlist[0].track.artists[0].name : ""}</p>
              <ProgressBar completed={progress} />
            </div>
          </div>
        </div>
        <div className='playlistContainer'>
          <div className='playlistNbutton'>
            <button className={`playlistButton ${showPlaylist ? "active" : ""}`} onClick={() => { setShowPlaylist(!showPlaylist); setShowPlaylist2(false) }}>Playlist</button>
            {showPlaylist && <Playlist playlist={playlist} childToParent={childToParent} setSelectedItem={setSelectedItem}/>}
          </div>
          <div className='playlistNbutton'>
            <button className={`playlistButton ${showPlaylist2 ? "active" : ""}`} onClick={() => { setShowPlaylist2(!showPlaylist2); setShowPlaylist(false) }}>Ma Playlist</button>
            {showPlaylist2 && <Playlist playlist={playlist} />}
          </div>
        </div>
        {/* <Player url={"http://streaming.tdiradio.com:8000/house.mp3"} /> */}
        <button onClick={() => {play()}}>Play</button>
        <button onClick={() => {pause()}}>Pause</button>
      </div>
      <div className='center'>
        {socket ? (
          <>
            <ThreadMessages messages={messages} />
          </>)
          :
          (<div>Not connected</div>)}
        <InputMessage socket={socket} />
      </div>
      <div className='right'>
        <InputName socket={socket} spotifyUser={spotifyUser} />
        {socket ? (
          <>
            <User users={users} />
          </>)
          :
          (<div>Not connected</div>)}
      </div>


      {/* {!token ?
        <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>Login
          to Spotify</a>
        : <button onClick={logout}>Logout</button>} */}

    </div>
  );
}

export default App;
