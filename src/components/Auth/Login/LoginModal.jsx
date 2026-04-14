import { useState } from "react";
import Modal from "../../Modal/Modal";
import { authApi } from "../../../api/auth.api";
import { setToken } from "../../../utils/auth";

export default function LoginModal({ onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await authApi.login({ email, password });

      setToken(res.data.token);

      console.log("Logged in:", res.data.user);

      onClose();
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <Modal onClose={onClose}>
      <h2>Login</h2>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>
    </Modal>
  );
}
