 # Real-Time Collaborative Notes

A real-time collaborative note-taking application built with React, Express, Socket.io, and MongoDB.

## Features

- Real-time text editing with multiple users
- Room-based collaboration
- User presence and notifications when users join/leave
- Persistent note storage
- Simple and intuitive UI

## Technologies Used

- **Frontend**: React, Socket.io-client, Axios
- **Backend**: Express.js, Socket.io, Mongoose
- **Database**: MongoDB
- **Deployment**: Render (backend), Vercel (frontend)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/real-time-notes.git
   cd real-time-notes
   ```

2. Install server dependencies:
   ```bash
   cd server
   npm install
   ```

3. Install client dependencies:
   ```bash
   cd ../client
   npm install
   ```

4. Create `.env` files:

   Server (.env in server directory):
   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   CLIENT_URL=http://localhost:3000
   ```

   Client (.env in client directory):
   ```
   REACT_APP_API_URL=http://localhost:5000
   ```

5. Start the development servers:

   Start the server:
   ```bash
   cd server
   npm start
   ```

   Start the client:
   ```bash
   cd client
   npm start
   ```

6. Open your browser and navigate to `http://localhost:3000`

## How It Works

### Real-Time Communication

This application uses Socket.io to establish WebSocket connections between clients and the server. When a user makes changes to a note, the changes are:

1. Reflected locally for immediate feedback
2. Emitted to the server via Socket.io
3. Broadcasted by the server to all other clients in the same room
4. Applied by the receiving clients to their local state

This creates a seamless collaborative experience where all users see changes in real-time.

### Room-Based Collaboration

Each note has a unique room ID. Users can join a room by:
- Creating a new note (generates a random room ID)
- Entering an existing room ID
- Following a shared link

All users in the same room can edit the note simultaneously and see who else is currently online.

## Deployment

The application is deployed using:
- Backend: Render
- Frontend: Vercel
- Database: MongoDB Atlas

## License

This project is licensed under the MIT License - see the LICENSE file for details.
