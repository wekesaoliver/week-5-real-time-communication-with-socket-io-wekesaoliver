import React from "react";

function UsersList({ users }) {
    return (
        <div className="users-list">
            <h3>Online Users ({users.length})</h3>
            <ul>
                {users.map((user) => (
                    <li key={user.id} className="user-item">
                        {user.username}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default UsersList;
