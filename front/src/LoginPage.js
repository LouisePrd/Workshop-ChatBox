import React from "react";
import './LoginPage.css';
import logoutIcon from './assets/logoutImg.png';

const LoginPage = (token, setToken) => {

    const CLIENT_ID = "267dee8acb604afd81a5b1464a34b77a"
    const REDIRECT_URI = "http://localhost:3000"
    const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
    const RESPONSE_TYPE = "token"

    const logout = () => {
        setToken("")
        window.localStorage.removeItem("token")
      }

    return (
        <div className="login-page">
        <div className="login-container">
            <h1>Spotify</h1>
            {!token ?
              <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>
                <img className="logout-icon" onClick={logout} src={logoutIcon}></img>
              </a>
              : <img className="logout-icon" onClick={logout} src={logoutIcon}></img>}
        </div>
        </div>
    );
};

export default LoginPage;