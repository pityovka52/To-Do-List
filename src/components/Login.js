import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth"; // Імпортуємо функцію для входу
import { auth } from "../services/api"; // Імпортуємо auth з Firebase

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(""); // Для відображення помилок
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Скидаємо попередні помилки
    try {
      // Вхід користувача через Firebase
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      console.log("User logged in:", userCredential.user);

      if (onLogin) onLogin(userCredential.user); // Передача авторизованого користувача
      navigate("/tasks"); // Перехід до завдань
    } catch (error) {
      console.error("Login error:", error.message);
      setError("Invalid email or password"); // Встановлення повідомлення про помилку
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      {error && <p className="error-message">{error}</p>} {/* Відображення помилок */}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Sign in</button>
      </form>
      <p>
        Don't have an account? <a href="/register">Sign up</a>
      </p>
    </div>
  );
};

export default Login;
