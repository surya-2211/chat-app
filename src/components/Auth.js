import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signUp = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) alert(error.message);
    else alert("Check email to confirm!");
  };

  const login = async () => {
    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) alert(error.message);
  };

  return (
  <div style={styles.page}>
    <div style={styles.card}>
      <h2 style={{ marginBottom: 20 }}>Login / Signup</h2>

      <input
        style={styles.input}
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        style={styles.input}
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <div style={{ display: "flex", gap: 10 }}>
        <button style={styles.primaryBtn} onClick={login}>
          Login
        </button>
        <button style={styles.secondaryBtn} onClick={signUp}>
          Signup
        </button>
      </div>
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
    display: "flex",
    flexDirection: "column",
  },
  input: {
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
    border: "1px solid #ddd",
  },
  primaryBtn: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    border: "none",
    background: "#4f46e5",
    color: "white",
    cursor: "pointer",
  },
  secondaryBtn: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    border: "1px solid #4f46e5",
    background: "white",
    color: "#4f46e5",
    cursor: "pointer",
  },
};