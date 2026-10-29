import { useState } from "react";
import "./AdminLogin.css";

function AdminLogin({ onLogin, onBack }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success || !data.token) {
        throw new Error(data.message || "Login failed.");
      }

      onLogin(data.token);
    } catch (err) {
      setError(err.message || "Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-login-page">
      <form className="admin-login-card" onSubmit={handleSubmit}>
        <h1>RoadRescue</h1>
        <h2>Admin Login</h2>
        <p>Sign in to manage roadside assistance bookings.</p>

        <label htmlFor="admin-email">Email address</label>
        <input
          id="admin-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Enter admin email"
          autoComplete="username"
          required
        />

        <label htmlFor="admin-password">Password</label>
        <input
          id="admin-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter admin password"
          autoComplete="current-password"
          required
        />

        {error && <p className="admin-login-error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </button>

        <button
          className="admin-back-button"
          type="button"
          onClick={onBack}
        >
          Back to Customer Page
        </button>
      </form>
    </main>
  );
}

export default AdminLogin;