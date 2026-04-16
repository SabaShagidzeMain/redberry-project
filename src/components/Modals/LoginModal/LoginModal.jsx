import { useState } from "react";
import Modal from "../../Modal/Modal";
import { authApi } from "../../../api/auth.api";
import styles from "./LoginModal.module.css";
import { useAuth } from "../../../context/AuthContext";
import LoadingScreen from "../../LoadingScreen/LoadingScreen";

export default function LoginModal({ onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const handleLogin = async () => {
    setLoading(true);

    try {
      const res = await authApi.login({ email, password });

      login(res.data.token, res.data.user);

      onClose();

      window.location.reload(); // optional (you can remove later)
    } catch (err) {
      console.error(err?.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal className={styles.modal} onClose={onClose}>
      {/* {loading && <LoadingScreen text="Logging you in..." />} */}
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
