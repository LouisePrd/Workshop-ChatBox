import React, {useState, useEffect} from "react";

function User({users}) {

  return (
  <div className="user-list">
  {users.sort((a, b) => a.name - b.name).map((user) => (
      <span key={user.id} className="user">
        {user.name}
      </span>
    ))}
</div>
);
}

export default User;