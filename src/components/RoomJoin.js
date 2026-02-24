import { useState } from "react";

export default function RoomJoin({ setRoom }) {
  const [roomInput, setRoomInput] = useState("");

  const joinRoom = (e) => {
    e.preventDefault();
    if (!roomInput) return;
    setRoom(roomInput.toString());
  };

  return (
  <div style={styles.page}>
    <div style={styles.card}>
      <h2>Join Chat Room</h2>

      <form onSubmit={joinRoom} style={{ marginTop: 20 }}>
        <input
          style={styles.input}
          placeholder="Enter room key"
          value={roomInput}
          onChange={(e) => setRoomInput(e.target.value)}
        />
        <button style={styles.button}>Join</button>
      </form>
    </div>
  </div>
);
}
const styles = {
  page: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f7fa",
  },
  card: {
    background: "white",
    padding: 30,
    borderRadius: 12,
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    width: 320,
  },
  input: {
    padding: 10,
    borderRadius: 8,
    border: "1px solid #ddd",
    width: "100%",
    marginBottom: 10,
  },
  button: {
    width: "100%",
    padding: 10,
    borderRadius: 8,
    border: "none",
    background: "#4f46e5",
    color: "white",
    cursor: "pointer",
  },
};