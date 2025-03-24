import React, { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [username, setUsername] = useState(() => {
        // Try to get username from local storage
        const savedUsername = localStorage.getItem("username");
        return savedUsername || "";
    });

    const [roomUsers, setRoomUsers] = useState([]);

    const updateUsername = (name) => {
        setUsername(name);
        localStorage.setItem("username", name);
    };

    return (
        <UserContext.Provider
            value={{ username, updateUsername, roomUsers, setRoomUsers }}
        >
            {children}
        </UserContext.Provider>
    );
};
