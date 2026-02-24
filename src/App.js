import { useState, useContext } from "react";
import AuthProvider, { AuthContext } from "./context/AuthContext";
import Auth from "./components/Auth";
import RoomJoin from "./components/RoomJoin";
import ChatRoom from "./components/ChatRoom";

function MainApp() {
  const { user } = useContext(AuthContext);
  const [room, setRoom] = useState(null);

  // 🔐 If not logged in → show auth page
  if (!user) {
    return <Auth />;
  }

  // 👥 If logged in but no room → show join room
  if (!room) {
    return (
      <div className="container">
        <RoomJoin setRoom={setRoom} />
      </div>
    );
  }

  // 💬 If logged in + room selected → show chat
  return (
    <div className="container">
      <ChatRoom
        room={room}
        leaveRoom={() => setRoom(null)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}