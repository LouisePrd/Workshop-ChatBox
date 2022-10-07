import React, { useEffect, useState, useRef } from 'react';
import cd from './assets/images/cd.png';
import iconPlay from './assets/images/play.png';
import iconPause from './assets/images/stop.png';
import iconMusic from './assets/images/music.png';
import iconNext from './assets/images/next.png';
import iconRandom from './assets/images/random.png';
import iconReplay from './assets/images/replay.png';
import iconBiblio from './assets/images/biblio.png';
import iconList from './assets/images/liste.png';
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

import drake from './assets/tracks/Drake_-_Massive_Official_Audio.mp3';
import Alice from './assets/tracks/Alice_Deejay_-_Better_Off_Alone_Official_Video.mp3';
import cher from './assets/tracks/Cher_-_Believe_Official_Music_Video.mp3';
import daft from './assets/tracks/Daft_Punk_-_One_More_Time_Official_Audio.mp3';
import david from './assets/tracks/David_Guetta_-_Love_Dont_Let_Me_Go_Featuring_Chr.mp3';
import everytime from './assets/tracks/Everytime_We_Touch.mp3';
import freed from './assets/tracks/Freed_from_Desire.mp3';
import no from './assets/tracks/No_Limit.mp3';

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
  const [showPlaylist3, setShowPlaylist3] = useState(false);
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

    const { data } = axios.get("https://api.spotify.com/v1/playlists/3qY0nnhrbBNsX0tQhdiKH8/tracks", {
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

  const tracks = [
    { id: "0oiv4E896TUTTeQU0cmIui", url: "./assets/tracks/Drake_-_Massive_Official_Audio.mp3" },
    { id: "5XVjNRubJUW0iPhhSWpLCj", url: "./assets/tracks/Alice_Deejay_-_Better_Off_Alone_Official_Video.mp3" },
    { id: "2goLsvvODILDzeeiT4dAoR", url: "./assets/tracks/Cher_-_Believe_Official_Music_Video.mp3" },
    { id: "0DiWol3AO6WpXZgp0goxAV", url: "./assets/tracks/Daft_Punk_-_One_More_Time_Official_Audio.mp3" },
    { id: "5lgS45xqkTk2HVm7Jph9ya", url: "./assets/tracks/David_Guetta_-_Love_Dont_Let_Me_Go_Featuring_Chr.mp3" },
    { id: "5aEqcblO0Z6JloFJXtxyhe", url: "./assets/tracks/Everytime_We_Touch.mp3" },
    { id: "3u5N55tHf7hXATSQrjBh2q", url: "./assets/tracks/Freed_from_Desire.mp3" },
    { id: "7voHUmPNDuYZ1SW1mwRu26", url: "./assets/tracks/No_Limit.mp3" },
  ]

  const [currentUrl, setCurrentUrl] = useState(null);
  const [audio] = useState(new Audio(currentUrl));
  const [playing, setPlaying] = useState(false);

  const childToParent = (childdata) => {
    setSelectedItem(childdata);
    console.log(childdata);
    console.log(selectedItem);
  }

  const play = () => {
    setPlaying(true);
    console.log(audio);
    audio.play();
  }

  const pause = () => {
    setPlaying(false);
    audio.pause();
  }

  useEffect(() => {

    if (selectedItem) {
      console.log(selectedItem);
      if (selectedItem === "0oiv4E896TUTTeQU0cmIui") {
        setCurrentUrl(drake);
        console.log(drake);
        console.log(currentUrl);
        play();
      } else if (selectedItem === "5XVjNRubJUW0iPhhSWpLCj") {
        setCurrentUrl(Alice);
        console.log(currentUrl);
        play();
      } else if (selectedItem === "2goLsvvODILDzeeiT4dAoR") {
        setCurrentUrl(tracks[2].url);
        console.log(currentUrl);
      } else if (selectedItem === "0DiWol3AO6WpXZgp0goxAV") {
        setCurrentUrl(tracks[3].url);
        console.log(currentUrl);
      } else if (selectedItem === "5lgS45xqkTk2HVm7Jph9ya") {
        setCurrentUrl(tracks[4].url);
        console.log(currentUrl);
      } else if (selectedItem === "5aEqcblO0Z6JloFJXtxyhe") {
        setCurrentUrl(tracks[5].url);
        console.log(currentUrl);
      } else if (selectedItem === "3u5N55tHf7hXATSQrjBh2q") {
        setCurrentUrl(tracks[6].url);
        console.log(currentUrl);
      } else if (selectedItem === "7voHUmPNDuYZ1SW1mwRu26") {
        setCurrentUrl(tracks[7].url);
        console.log(currentUrl);
      }
    }
  }, [selectedItem]);


  return (
    <div className="App Conteneur">
      <div className='left'>
        <div className='cdContainer'>
          <img className={`cd ${playing ? "App-logo" : ""}`} src={cd} alt="cd" />
          <button className='play hover' onClick={() => { play() }}><img className='iconPlay' src={iconPlay} /></button>
          <button className='pause hover' onClick={() => { pause() }}><img className='iconPause' src={iconPause} /></button>
          <button className='prev hover' onClick={() => { pause() }}><img className='iconPrev' src={iconNext} /></button>
          <button className='next hover' onClick={() => { pause() }}><img className='iconNext' src={iconNext} /></button>
          <button className='random hover' onClick={() => { pause() }}><img className='iconRandom' src={iconRandom} /></button>
          <button className='replay hover' onClick={() => { pause() }}><img className='iconReplay' src={iconReplay} /></button>
          <div className='cdContent'>
            {/* <audio id="player" ref={player} src="http://streaming.tdiradio.com:8000/house.mp3" onTimeUpdate={() => {let duration = player.current.duration; let ct = player.current.currentTime; setProgress(Math.floor((ct * 100) / duration))}}></audio> */}
            <img className='cdContentImg' src={selectedItem ? playlist[0]?.track.album.images[0].url : iconMusic} alt="cd" />
            <div className='cdContentText'>
              <p className='cdContentTextp'>{selectedItem ? playlist[0]?.track.name : "- -"}</p>
              <p className='cdContentTextp'>{selectedItem ? playlist[0]?.track.artists[0].name : "- -"}</p>
              <ProgressBar completed={progress} />
            </div>
          </div>
        </div>
        <div className='playlistContainer'>
          <div className='playlistNbutton'>
            <button className={`playlistButton ${showPlaylist ? "active" : ""}`} onClick={() => { setShowPlaylist(!showPlaylist); setShowPlaylist2(false); setShowPlaylist3(false) }}><img className='icon' src={iconBiblio}/> Playlist</button>
            {showPlaylist && <Playlist playlist={playlist} childToParent={childToParent} setSelectedItem={setSelectedItem} />}
          </div>
          <div className='playlistNbutton'>
            <button className={`playlistButton ${showPlaylist2 ? "active" : ""}`} onClick={() => { setShowPlaylist2(!showPlaylist2); setShowPlaylist(false); setShowPlaylist3(false) }}><img className='icon' src={iconList}/> Découverte</button>
            {showPlaylist2 && <Playlist playlist={playlist} childToParent={childToParent} />}
          </div>
          <div className='playlistNbutton'>
            <button className={`playlistButton ${showPlaylist3 ? "active" : ""}`} onClick={() => { setShowPlaylist3(!showPlaylist3); setShowPlaylist(false); setShowPlaylist2(false) }}><img className='icon' src={iconMusic}/> Ma Playlist</button>
            {showPlaylist3 && <Playlist playlist={playlist} childToParent={childToParent} />}
          </div>
        </div>
        {/* <Player url={"http://streaming.tdiradio.com:8000/house.mp3"} /> */}
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
