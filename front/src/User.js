import React, { useState, useEffect } from "react";
import iconUser from "./assets/icon-user.png";

function User({ users }) {

  return (
    <div className="user-list">
      <div className="test">
        <img className="icon-user" src={iconUser} alt="icon-user" />
        <h2 className="online">ONLINE</h2>
      </div>
      {users.sort((a, b) => a.name - b.name).map((user) => (
        <span key={user.id} className="user">
          {user.name}<br />
        </span>
      ))}
    </div>
  );
}

export default User;