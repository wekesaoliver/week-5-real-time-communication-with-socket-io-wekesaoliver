import React from "react";
import { Link } from "react-router-dom";
import { useSocket } from "../context/SocketContext.jsx";

function Header() {
    const { connected } = useSocket();

    return (
        <header className="header">
            <div className="logo">
                <Link to="/">Real-Time Notes</Link>
            </div>
            <div className="connection-status">
                {connected ? (
                    <span className="status-connected">Connected</span>
                ) : (
                    <span className="status-disconnected">Disconnected</span>
                )}
            </div>
        </header>
    );
}

export default Header;
