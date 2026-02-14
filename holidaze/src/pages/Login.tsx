import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import { setAuth } from "../utils/auth";
import type { FormEvent } from "react";
import { getProfile } from "../api/profile";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const data = await login({ email, password });

      const profile = await getProfile(data.name, data.accessToken);

      setAuth({
        ...data,
        venueManager: Boolean(profile.venueManager),
      });

      navigate(profile.venueManager ? "/manager" : "/profile", {
        replace: true,
      });
    } catch (err) {
      console.error("LOGIN ERROR:", err);
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto p-12 space-y-4">
      <h1 className="text-2xl font-bold">Login</h1>

      <form onSubmit={onSubmit} className="space-y-3">
        <input
          className="w-full border rounded p-2"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full border rounded p-2"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-600">{error}</p>}

        <button disabled={loading} className="btn-block btn-primary p-2">
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
