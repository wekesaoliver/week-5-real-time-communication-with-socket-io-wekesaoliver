import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SocketProvider } from "./context/SocketContext.jsx";
import { NoteProvider } from "./context/NoteContext.jsx";
import { UserProvider } from "./context/UserContext.jsx";
import Header from "./components/Header.jsx";
import Home from "./components/Home.jsx";
import NoteEditor from "./components/NoteEditor.jsx";
import "./App.css";

function App() {
    return (
        <Router>
            <SocketProvider>
                <UserProvider>
                    <NoteProvider>
                        <div className="app">
                            <Header />
                            <main className="main-content">
                                <Routes>
                                    <Route path="/" element={<Home />} />
                                    <Route
                                        path="/room/:roomId"
                                        element={<NoteEditor />}
                                    />
                                </Routes>
                            </main>
                        </div>
                    </NoteProvider>
                </UserProvider>
            </SocketProvider>
        </Router>
    );
}

export default App;
