import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketContext.jsx";
import { useNotes } from "../context/NoteContext.jsx";
import { useUser } from "../context/UserContext.jsx";
import UsersList from "./UsersList.jsx";

function NoteEditor() {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const { socket } = useSocket();
    const {
        currentNote,
        setCurrentNote,
        getNoteByRoomId,
        createNote,
        updateNoteContent,
        updateNoteTitle,
    } = useNotes();
    const { username, roomUsers, setRoomUsers } = useUser();

    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [notifications, setNotifications] = useState([]);

    const contentRef = useRef(null);
    const titleRef = useRef(null);

    // Add debouncing for content changes
    const debounceTimeoutRef = useRef(null);

    useEffect(() => {
        // Redirect to home if no username
        if (!username) {
            navigate("/");
            return;
        }

        // Load the note
        const loadNote = async () => {
            const note = await getNoteByRoomId(roomId);

            if (note) {
                setContent(note.content);
                setTitle(note.title);
            } else {
                // If note doesn't exist, create a new one
                const newNote = await createNote(
                    `New Note (${roomId})`,
                    roomId
                );
                if (newNote) {
                    setContent(newNote.content);
                    setTitle(newNote.title);
                } else {
                    navigate("/");
                }
            }
        };

        loadNote();

        // Join the room
        if (socket) {
            socket.emit("join-room", { roomId, username });

            // Handle user joined/left notifications
            socket.on("user-joined", ({ message, users }) => {
                addNotification(message);
                setRoomUsers(users);
            });

            socket.on("user-left", ({ message, users }) => {
                addNotification(message);
                setRoomUsers(users);
            });

            // Handle note updates from other users
            socket.on("note-updated", ({ content: newContent }) => {
                setContent(newContent);
                if (currentNote) {
                    setCurrentNote({ ...currentNote, content: newContent });
                }
            });
        }

        return () => {
            if (socket) {
                socket.off("user-joined");
                socket.off("user-left");
                socket.off("note-updated");
            }
        };
    }, [
        socket,
        roomId,
        username,
        navigate,
        getNoteByRoomId,
        createNote,
        setRoomUsers,
        currentNote,
        setCurrentNote,
    ]);

    // Add notification
    const addNotification = (message) => {
        const id = Date.now();
        setNotifications((prev) => [...prev, { id, message }]);

        // Remove notification after 5 seconds
        setTimeout(() => {
            setNotifications((prev) => prev.filter((notif) => notif.id !== id));
        }, 5000);
    };

    // Handle content changes
    const handleContentChange = (e) => {
        const newContent = e.target.value;
        setContent(newContent);

        // Emit changes to socket
        if (socket) {
            socket.emit("note-change", { roomId, content: newContent });
        }

        // Debounce saving to database
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        debounceTimeoutRef.current = setTimeout(() => {
            updateNoteContent(roomId, newContent);
        }, 1000);
    };

    // Handle title changes
    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleTitleBlur = () => {
        updateNoteTitle(roomId, title);
        setIsEditing(false);
    };

    const startEditingTitle = () => {
        setIsEditing(true);
        setTimeout(() => {
            titleRef.current?.focus();
        }, 0);
    };

    // Copy room link to clipboard
    const copyRoomLink = () => {
        const url = window.location.href;
        navigator.clipboard
            .writeText(url)
            .then(() => {
                addNotification("Room link copied to clipboard");
            })
            .catch((err) => {
                console.error("Failed to copy: ", err);
            });
    };

    return (
        <div className="note-editor">
            <div className="editor-header">
                {isEditing ? (
                    <input
                        ref={titleRef}
                        type="text"
                        value={title}
                        onChange={handleTitleChange}
                        onBlur={handleTitleBlur}
                        className="title-input"
                    />
                ) : (
                    <h2 onClick={startEditingTitle}>{title}</h2>
                )}
                <button onClick={copyRoomLink} className="copy-link-btn">
                    Copy Room Link
                </button>
            </div>

            <div className="editor-container">
                <div className="editor-sidebar">
                    <UsersList users={roomUsers} />
                </div>

                <div className="editor-main">
                    <textarea
                        ref={contentRef}
                        value={content}
                        onChange={handleContentChange}
                        placeholder="Start typing your collaborative note here..."
                        className="note-content"
                    />
                </div>
            </div>

            <div className="notifications">
                {notifications.map((notif) => (
                    <div key={notif.id} className="notification">
                        {notif.message}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default NoteEditor;
