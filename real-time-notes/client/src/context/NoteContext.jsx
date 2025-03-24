import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const NoteContext = createContext();

export const useNotes = () => useContext(NoteContext);

export const NoteProvider = ({ children }) => {
  const [currentNote, setCurrentNote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // Get note by room ID
  const getNoteByRoomId = async (roomId) => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/api/notes/${roomId}`);
      setCurrentNote(response.data);
      setError(null);
      return response.data;
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError('Note not found');
        setCurrentNote(null);
        return null;
      }
      setError('Failed to fetch note');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Create a new note
  const createNote = async (title, roomId) => {
    setLoading(true);
    try {
      const response = await axios.post(`${apiUrl}/api/notes`, {
        title,
        roomId,
        content: ''
      });
      setCurrentNote(response.data);
      setError(null);
      return response.data;
    } catch (err) {
      setError('Failed to create note');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update note content
  const updateNoteContent = async (roomId, content) => {
    try {
      const response = await axios.patch(`${apiUrl}/api/notes/${roomId}`, {
        content
      });
      setCurrentNote(response.data);
      return response.data;
    } catch (err) {
      console.error('Failed to update note:', err);
      return null;
    }
  };

  // Update note title
  const updateNoteTitle = async (roomId, title) => {
    try {
      const response = await axios.patch(`${apiUrl}/api/notes/${roomId}`, {
        title
      });
      setCurrentNote(response.data);
      return response.data;
    } catch (err) {
      console.error('Failed to update note title:', err);
      return null;
    }
  };

  return (
    <NoteContext.Provider
      value={{
        currentNote,
        setCurrentNote,
        loading,
        error,
        getNoteByRoomId,
        createNote,
        updateNoteContent,
        updateNoteTitle
      }}
    >
      {children}
    </NoteContext.Provider>
  );
};
