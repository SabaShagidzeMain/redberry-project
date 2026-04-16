import { useState } from "react";
import Modal from "../../Modal/Modal";
import { authApi } from "../../../api/auth.api";
import styles from "./LoginModal.module.css";
import { useAuth } from "../../../context/AuthContext";

export default function LoginModal({ onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const handleLogin = async () => {
    try {
      const res = await authApi.login({ email, password });

      login(res.data.token, res.data.user);

      console.log("Logged in:", res.data.user);

      window.location.reload();

      onClose();
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <Modal className={styles.modal} onClose={onClose}>
      <div className={styles.modal_inner}>
        <div className={styles.modal_text}>
          <h2>Welcome Back</h2>
          <p>Log in to continue your learning</p>
        </div>
        <div className={styles.input_container}>
          <div className={styles.modal_input}>
            <p>Email</p>
            <input
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className={styles.modal_input}>
            <p>Password</p>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <button onClick={handleLogin}>Login</button>

        <div className={styles.modal_footer}>
          <div className={styles.orContainer}>
            <span />
            <p>or</p>
            <span />
          </div>
          <div>
            <p className={styles.signUp}>
              Dont have an account? <a href="#">Sign Up</a>
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}
