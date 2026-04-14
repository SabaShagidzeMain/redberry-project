import { useState } from "react";
import Modal from "../../Modal/Modal";
import { authApi } from "../../../api/auth.api";
import { setToken } from "../../../utils/auth";

export default function RegisterModal({ onClose }) {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async () => {
    try {
      const res = await authApi.register(form);

      setToken(res.data.token);

      console.log("REGISTER SUCCESS:", res.data.user);

      onClose();
    } catch (err) {
      console.error("REGISTER ERROR:", err.message);
    }
  };

  return (
    <Modal onClose={onClose}>
      <h2>Register</h2>

      <input
        name="fullName"
        placeholder="Full Name"
        value={form.fullName}
        onChange={handleChange}
      />

      <input
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
      />

      <button onClick={handleRegister}>Register</button>
    </Modal>
  );
}
