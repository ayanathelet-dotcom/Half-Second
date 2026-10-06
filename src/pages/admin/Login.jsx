import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { CircleAlert, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { getErrorMessage } from "../../lib/api.js";
import Button from "../../components/ui/Button.jsx";
import Logo from "../../components/ui/Logo.jsx";
import { Field, inputClass } from "../../components/ui/Field.jsx";
import { PageLoader } from "../../components/ui/Spinner.jsx";
import useTitle from "../../hooks/useTitle.js";

export default function Login() {
  useTitle("Admin login");
  const { admin, loading, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const from = location.state?.from || "/admin/dashboard";

  if (loading) return <PageLoader />;
  if (admin) return <Navigate to={from} replace />; // already logged in

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, "Couldn't log in. Please try again."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="on-dark grid min-h-screen place-items-center bg-ink px-5 py-10 text-paper">
      <div className="w-full max-w-md">
        <Logo className="mb-8" />
        <div className="rounded-xl bg-panel p-6 text-ink shadow-2xl sm:p-8">
          <h1 className="display text-4xl">Welcome back</h1>
          <p className="mt-2 text-mute">Log in to manage your videos and enquiries.</p>

          <form onSubmit={submit} className="mt-7 space-y-5">
            <Field label="Email" htmlFor="email">
              <input id="email" type="email" required autoComplete="email" className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} />
            </Field>
            <Field label="Password" htmlFor="password">
              <div className="relative">
                <input
                  id="password"
                  type={show ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  className={`${inputClass} pr-11`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  aria-label={show ? "Hide password" : "Show password"}
                  className="absolute right-1 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-[4px] text-mute hover:text-ink"
                >
                  {show ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>
            </Field>

            {error && (
              <p role="alert" className="flex items-start gap-2 rounded-[4px] bg-danger/10 px-3.5 py-3 text-sm font-semibold text-danger">
                <CircleAlert className="mt-0.5 size-4 shrink-0" /> {error}
              </p>
            )}

            <Button type="submit" size="lg" loading={busy} className="w-full">
              Log in
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
