import React, { useState, useEffect } from "react";
import iconUser from "./assets/icon-user.png";

function User({ users }) {

  console.log(users);

  return (
    <div className="user-list">
      <div className="test">
        <img className="icon-user" src={iconUser} alt="icon-user" />
        <h2 className="online">ONLINE</h2>
      </div>
      <div className="users">
      {users.filter(user => user.name !== "Anonymous").sort((a, b) => a.name - b.name).map((user) => (
        <span key={user.id} className="user">
          {user.name}<br /><br />
        </span>
      ))}
      </div>
    </div>
  );
}

export default User;