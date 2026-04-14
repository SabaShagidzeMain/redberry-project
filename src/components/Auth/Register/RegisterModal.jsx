import { useState } from "react";
import Modal from "../../Modal/Modal";
import { authApi } from "../../../api/auth.api";
import { setToken } from "../../../utils/auth";

export default function RegisterModal({ onClose }) {
  const [form, setForm] = useState({
    email: "",
    password: "",
    password_confirmation: "",
    username: "",
    avatar: null,
  });

  const handleFileChange = (e) => {
    setForm({
      ...form,
      avatar: e.target.files[0],
    });
  };

  const [step, setStep] = useState(1);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async () => {
    try {
      if (form.password !== form.password_confirmation) {
        console.error("Passwords do not match");
        return;
      }

      const formData = new FormData();

      formData.append("email", form.email);
      formData.append("password", form.password);
      formData.append("password_confirmation", form.password_confirmation);
      formData.append("username", form.username);

      if (form.avatar) {
        formData.append("avatar", form.avatar);
      }

      const res = await authApi.register(formData);

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

      {/* STEP 1 */}
      {step === 1 && (
        <>
          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />

          <button onClick={() => setStep(2)}>Next</button>
        </>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password_confirmation"
            placeholder="Confirm Password"
            value={form.password_confirmation}
            onChange={handleChange}
          />

          <button onClick={() => setStep(1)}>Back</button>
          <button onClick={() => setStep(3)}>Next</button>
        </>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <>
          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
          />

          <input type="file" onChange={handleFileChange} />

          <button onClick={() => setStep(2)}>Back</button>
          <button onClick={handleRegister}>Register</button>
        </>
      )}
    </Modal>
  );
}
