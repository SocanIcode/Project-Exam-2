import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/auth";
import type { FormEvent } from "react";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // pick role before register
  const [role, setRole] = useState<"customer" | "manager">("customer");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (name.trim().length < 3) {
      return setError("Name must be at least 3 characters");
    }

    if (!email.endsWith("@stud.noroff.no")) {
      return setError("You must use a stud.noroff.no email");
    }

    if (password.length < 8) {
      return setError("Password must be at least 8 characters");
    }

    try {
      setLoading(true);

      const payload = {
        name,
        email,
        password,
        venueManager: role === "manager",
      };

      const _createdUser = await registerUser(payload);

      navigate("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Create account</h1>

      {error && <p className="text-red-600">{error}</p>}

      <form onSubmit={onSubmit} className="space-y-3">
        <input
          className="w-full border rounded-xl p-3"
          placeholder="Username"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full border rounded-xl p-3"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full border rounded-xl p-3"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* register user pick */}
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as "customer" | "manager")}
          className="w-full border rounded-xl p-3"
        >
          <option value="customer">Customer (Book venues)</option>
          <option value="manager">
            Venue Manager (Create & manage venues)
          </option>
        </select>

        <button disabled={loading} className="btn-block btn-primary">
          {loading ? "Creating..." : "Register"}
        </button>
      </form>

      <p className="text-sm">
        Already have an account?{" "}
        <Link className="underline focus-ring" to="/login">
          Login
        </Link>
      </p>
    </div>
  );
}
