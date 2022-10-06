import React, { useState, useEffect } from "react";
import iconUser from "./assets/icon-user.png";

function User({ users }) {

  return (
    <div className="user-list">
      <img className="icon-user" src={iconUser} alt="icon-user" />
      <h2>ONLINE</h2>
      {users.sort((a, b) => a.name - b.name).map((user) => (
        <span key={user.id} className="user">
          {user.name}<br />
        </span>
      ))}
    </div>
  );
}

export default User;