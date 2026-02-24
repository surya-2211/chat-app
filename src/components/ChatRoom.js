import { useEffect, useState, useContext, useRef } from "react";
import { supabase } from "../supabaseClient";
import { AuthContext } from "../context/AuthContext";

export default function ChatRoom({ room, leaveRoom }) {
  const { user } = useContext(AuthContext);

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const bottomRef = useRef(null);

  // 🔹 Fetch existing messages
  useEffect(() => {
    if (!room) return;

    const loadMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("room_id", room)
        .order("created_at", { ascending: true });

      if (!error) {
        setMessages(data || []);
      }
    };

    loadMessages();

    // 🔥 Realtime subscription
    const channel = supabase
      .channel(`room-${room}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `room_id=eq.${room}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe((status) => {
        console.log("Realtime status:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [room]);

  // 🔹 Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🔹 Send message
  const sendMessage = async (e) => {
    e.preventDefault();

    if (!text.trim()) return;

    await supabase.from("messages").insert([
      {
        room_id: room,
        user_id: user.id,
        content: text.trim(),
      },
    ]);

    setText("");
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
  <div style={styles.page}>
    <div style={styles.chatContainer}>
      <div style={styles.header}>
        <div>
          <strong>Room:</strong> {room}
        </div>
        <div>
          <button style={styles.smallBtn} onClick={leaveRoom}>
            Leave
          </button>
          <button style={styles.smallBtn} onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      <div style={styles.messages}>
        {messages.map((msg) => {
          const isMine = msg.user_id === user.id;

          return (
            <div
              key={msg.id}
              style={{
                ...styles.messageRow,
                justifyContent: isMine ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  ...styles.bubble,
                  background: isMine ? "#4f46e5" : "#e5e7eb",
                  color: isMine ? "white" : "black",
                }}
              >
                {msg.content}
              </div>
            </div>
          );
        })}

        <div ref={bottomRef}></div>
      </div>

      <form onSubmit={sendMessage} style={styles.inputRow}>
        <input
          style={styles.chatInput}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type message..."
        />
        <button style={styles.sendBtn}>Send</button>
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
  chatContainer: {
    width: 400,
    height: 600,
    background: "white",
    borderRadius: 16,
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  header: {
    padding: 15,
    borderBottom: "1px solid #eee",
    display: "flex",
    justifyContent: "space-between",
  },
  messages: {
    flex: 1,
    padding: 15,
    overflowY: "auto",
    background: "#f9fafb",
  },
  messageRow: {
    display: "flex",
    marginBottom: 10,
  },
  bubble: {
    padding: "8px 12px",
    borderRadius: 16,
    maxWidth: "70%",
    wordBreak: "break-word",
  },
  inputRow: {
    display: "flex",
    padding: 10,
    borderTop: "1px solid #eee",
  },
  chatInput: {
    flex: 1,
    padding: 10,
    borderRadius: 20,
    border: "1px solid #ddd",
  },
  sendBtn: {
    marginLeft: 10,
    padding: "10px 15px",
    borderRadius: 20,
    border: "none",
    background: "#4f46e5",
    color: "white",
    cursor: "pointer",
  },
  smallBtn: {
    marginLeft: 8,
    padding: "5px 10px",
    borderRadius: 6,
    border: "none",
    background: "#ef4444",
    color: "white",
    cursor: "pointer",
  },
};