import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext.jsx";
import { v4 as uuidv4 } from "uuid";

function Home() {
    const navigate = useNavigate();
    const { username, updateUsername } = useUser();
    const [inputUsername, setInputUsername] = useState(username);
    const [roomId, setRoomId] = useState("");
    const [error, setError] = useState("");

    const handleUsernameChange = (e) => {
        setInputUsername(e.target.value);
    };

    const handleRoomIdChange = (e) => {
        setRoomId(e.target.value);
    };

    const createNewRoom = () => {
        if (!inputUsername.trim()) {
            setError("Please enter a username");
            return;
        }

        updateUsername(inputUsername);
        const newRoomId = uuidv4().substring(0, 8);
        navigate(`/room/${newRoomId}`);
    };

    const joinRoom = () => {
        if (!inputUsername.trim()) {
            setError("Please enter a username");
            return;
        }

        if (!roomId.trim()) {
            setError("Please enter a room ID");
            return;
        }

        updateUsername(inputUsername);
        navigate(`/room/${roomId}`);
    };

    return (
        <div className="home-container">
            <h1>Real-Time Collaborative Notes</h1>

            <div className="form-group">
                <label htmlFor="username">Your Name</label>
                <input
                    type="text"
                    id="username"
                    value={inputUsername}
                    onChange={handleUsernameChange}
                    placeholder="Enter your name"
                />
            </div>

            <div className="button-group">
                <button onClick={createNewRoom} className="btn btn-primary">
                    Create New Note
                </button>

                <div className="divider">OR</div>

                <div className="form-group">
                    <label htmlFor="roomId">Join Existing Note</label>
                    <input
                        type="text"
                        id="roomId"
                        value={roomId}
                        onChange={handleRoomIdChange}
                        placeholder="Enter room ID"
                    />
                    <button onClick={joinRoom} className="btn btn-secondary">
                        Join Note
                    </button>
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="info-section">
                <h3>How It Works</h3>
                <ul>
                    <li>
                        Create a new note or join an existing one with a room ID
                    </li>
                    <li>
                        Share the room ID with others to collaborate in
                        real-time
                    </li>
                    <li>
                        All changes will be visible to everyone in the room
                        instantly
                    </li>
                    <li>
                        Your username will be visible to other collaborators
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default Home;
