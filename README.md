# 🎵 JaMoveo

JaMoveo is a collaborative music rehearsal web app designed for band leaders and musicians. It enables real-time song sharing and synchronized lyric/chord viewing using WebSockets. Built with **React**, **Firebase Auth/Firestore**, and **Socket.IO**.

## 🔧 Features

### 🔐 Authentication
- Firebase-based signup/login for two roles: **Admin (conductor)** and **Player (musician)**.
- Players must choose an instrument during signup.

### 👨‍🎤 Player View
- See the current song live, with chords and lyrics aligned.
- Auto-scroll toggle for hands-free rehearsal.
- Real-time updates when Admin selects a new song.

### 🎼 Admin View
- Search songs by title or artist.
- Select a song and broadcast it to all players.
- End a session to return all players to the waiting screen.

### 🔗 Real-Time Sync
- Powered by Socket.IO for live updates.
- Late-joining users receive the current song automatically.

---

## 📁 Project Structure

```
├── frontend/                # React App (create-react-app)
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── data/            # Song data in JSON format
│   │   ├── pages/           # Auth + Admin + Player pages
│   │   ├── firebase.js
│   │   └── App.jsx
│   └── public/
├── backend/
│   ├── server.js            # Express + Socket.IO server
│   └── package.json
├── README.md
```

---

## 🚀 Deployment

### Frontend (Firebase Hosting)
1. Run `npm run build` inside `frontend/`
2. Deploy with Firebase CLI:
```bash
firebase init hosting
firebase deploy
```

### Backend (Render.com)
1. Push backend to GitHub (separate folder)
2. Create a new **Web Service** on [Render](https://render.com)
3. Set root directory to `/backend`
4. Set:
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Add environment variable:
   - `FRONTEND_URL=https://your-frontend-url.web.app`

---

## 📦 Setup (Locally)

### Frontend
```bash
cd frontend
npm install
npm start
```

### Backend
```bash
cd backend
npm install
node server.js
```

---

## 📄 Song Format (JSON)
Songs must be formatted as arrays of lines. Each line is an array of words, each with `lyrics` and optional `chords`:

```json
[
  [
    { "lyrics": "Hey", "chords": "F" },
    { "lyrics": "Jude", "chords": "C" },
    ...
  ],
  ...
]
```

---

## 🧪 Tech Stack

- **Frontend**: React + TailwindCSS + Firebase Auth
- **Backend**: Express + Socket.IO
- **Database**: Firebase Firestore

---

## 🧑‍💻 Contributors

- Itay Segal (@IttaySegal)

---

## 📃 License

MIT License. See `LICENSE` for details.