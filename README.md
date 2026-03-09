# 🎬 YouTube Watch Party

A real-time **Watch Party system** where multiple users can watch YouTube videos together in sync.

Users in the same room see the **same video, playback state, and seek position** in real time.

🌐 **Live Demo:**  
https://web3-task-assignment-686y.vercel.app/

---

# 🚀 Features

### 👥 Room System
- Create a watch party room
- Join room using a room code
- Real-time participant list
- Host automatically assigned

---

### 🎥 YouTube Video Sync
- Paste any YouTube link
- Video loads for **all participants in the room**
- Real-time playback synchronization

Supported actions:

- Play
- Pause
- Seek
- Change video

All participants stay **perfectly synchronized**.

---

### ⚡ Real-time Communication

Uses **WebSockets (Socket.IO)** for real-time updates.

Events handled:

- `play`
- `pause`
- `seek`
- `change_video`
- `join_room`
- `leave_room`
- `participants_list`

---

### 👑 Role System

| Role | Permissions |
|-----|-------------|
Host | Full control (play/pause/change video) |
Participant | Watch synced video |

The room creator automatically becomes the **Host**.

---

# 🏗 Tech Stack

### Frontend
- React
- Vite
- TailwindCSS
- React Router
- React YouTube
- Socket.IO Client

### Backend
- Node.js
- Express
- Socket.IO

### Deployment
- **Frontend:** Vercel  
- **Backend:** Node.js server

---

# 📡 Architecture Overview
User Browser
│
│ WebSocket
▼
Socket.IO Server
│
│ Broadcast events
▼
All users in same room

---

# 📦 Installation

## 1️⃣ Clone Repository
git clone https://github.com/your-username/watch-party.git


---

## 2️⃣ Backend Setup


cd backend
npm install
npm run dev


Server runs on:


http://localhost:3000


---

## 3️⃣ Frontend Setup


cd frontend
npm install
npm run dev


Frontend runs on:


http://localhost:5173


---

# 🌍 Deployment

### Frontend (Vercel)

Deployed using **Vercel**

Live URL:


https://web3-task-assignment-686y.vercel.app/


Build settings:


Framework: Vite
Build Command: npm run build
Output Directory: dist


---

### Backend

Backend runs using:


Node.js + Socket.IO server


Recommended deployment platforms:

- Render
- Railway
- VPS

---

# 🔌 WebSocket Events

| Event | Direction | Description |
|------|----------|-------------|
join_room | Client → Server | Join a watch room |
play | Client → Server | Play video |
pause | Client → Server | Pause video |
seek | Client → Server | Seek video |
change_video | Client → Server | Change YouTube video |
participants_list | Server → Client | Update participants |
sync_state | Server → Client | Sync video state |

---

# 📈 Future Improvements

- Role-based permissions (Host / Moderator)
- Chat system
- Persistent rooms with database
- Authentication
- Redis for WebSocket scaling
- Horizontal scaling support

---

# 🧠 Key Concepts Used

- WebSocket real-time communication
- Room-based architecture
- State synchronization
- YouTube IFrame API
- Event broadcasting with Socket.IO

---

# 👨‍💻 Author

**Utkarsh Barnwal**

BTech Student | Full Stack Developer
