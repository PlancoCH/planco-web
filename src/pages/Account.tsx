import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { updateAccount } from "../api/account";
import { ApiError } from "../api/client";
import PageContainer from "../components/ui/PageContainer";
import PageTitle from "../components/ui/PageTitle";
import BackButton from "../components/ui/BackButton";

export default function Account() {
  const { user, setUser, logout, loading } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const handleProfileUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setError(null);
    setSaving(true);

    try {
      const res = await updateAccount({ name, email });
      setUser(res.user);
      setSuccess("Profile updated successfully.");
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.errors) {
          setFieldErrors(err.errors);
        } else {
          setError(err.message);
        }
      } else {
        setError("Failed to update profile. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e: FormEvent) => {
    e.preventDefault();
    if (password !== passwordConfirmation) {
      setError("Passwords do not match.");
      return;
    }
    setFieldErrors({});
    setError(null);
    setSuccess(null);
    setSaving(true);

    try {
      await updateAccount({
        password,
        password_confirmation: passwordConfirmation,
      });
      setPassword("");
      setPasswordConfirmation("");
      setSuccess("Password changed successfully.");
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.errors) {
          setFieldErrors(err.errors);
        } else {
          setError(err.message);
        }
      } else {
        setError("Failed to change password. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      navigate("/", { replace: true });
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <PageContainer>
      <BackButton text="leave account settings"></BackButton>
      <PageTitle
        title="Your Account"
        subtitle="Manage your profile, update your password, or sign out."
      />

      {success && (
        <div className="bg-forest-50 border border-forest-200 rounded-xl px-4 py-3 mb-6">
          <p className="text-sm text-forest-700">{success}</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-6">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="bg-beige-50 rounded-2xl border border-beige-300 p-8 shadow-sm mb-6">
        <h2 className="font-serif text-xl text-forest-800 mb-6">
          Profile Information
        </h2>
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div>
            <label
              htmlFor="account-name"
              className="block text-sm font-medium text-forest-700 mb-1.5"
            >
              Name
            </label>
            <input
              id="account-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Your name"
              className="w-full px-4 py-3 rounded-xl border border-beige-300 bg-white text-forest-700 placeholder:text-forest-500/50 focus:outline-none focus:border-forest-300 focus:ring-2 focus:ring-forest-DEFAULT/20 transition-all text-sm"
            />
            {fieldErrors.name?.map((msg) => (
              <p key={msg} className="text-xs text-red-600 mt-1">
                {msg}
              </p>
            ))}
          </div>

          <div>
            <label
              htmlFor="account-email"
              className="block text-sm font-medium text-forest-700 mb-1.5"
            >
              Email
            </label>
            <input
              id="account-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl border border-beige-300 bg-white text-forest-700 placeholder:text-forest-500/50 focus:outline-none focus:border-forest-300 focus:ring-2 focus:ring-forest-DEFAULT/20 transition-all text-sm"
            />
            {fieldErrors.email?.map((msg) => (
              <p key={msg} className="text-xs text-red-600 mt-1">
                {msg}
              </p>
            ))}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full inline-flex items-center justify-center gap-2 bg-forest-DEFAULT text-beige-100 font-semibold px-7 py-3 rounded-full bg-forest-400 transition-all duration-300 hover:shadow-xl hover:shadow-forest-DEFAULT/25 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </form>
      </div>

      <div className="bg-beige-50 rounded-2xl border border-beige-300 p-8 shadow-sm mb-6">
        <h2 className="font-serif text-xl text-forest-800 mb-6">
          Change Password
        </h2>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label
              htmlFor="account-password"
              className="block text-sm font-medium text-forest-700 mb-1.5"
            >
              New Password
            </label>
            <input
              id="account-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Minimum 8 characters"
              className="w-full px-4 py-3 rounded-xl border border-beige-300 bg-white text-forest-700 placeholder:text-forest-500/50 focus:outline-none focus:border-forest-300 focus:ring-2 focus:ring-forest-DEFAULT/20 transition-all text-sm"
            />
            {fieldErrors.password?.map((msg) => (
              <p key={msg} className="text-xs text-red-600 mt-1">
                {msg}
              </p>
            ))}
          </div>

          <div>
            <label
              htmlFor="account-password-confirmation"
              className="block text-sm font-medium text-forest-700 mb-1.5"
            >
              Confirm New Password
            </label>
            <input
              id="account-password-confirmation"
              type="password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
              placeholder="Re-enter your new password"
              className="w-full px-4 py-3 rounded-xl border border-beige-300 bg-white text-forest-700 placeholder:text-forest-500/50 focus:outline-none focus:border-forest-300 focus:ring-2 focus:ring-forest-DEFAULT/20 transition-all text-sm"
            />
            {fieldErrors.password_confirmation?.map((msg) => (
              <p key={msg} className="text-xs text-red-600 mt-1">
                {msg}
              </p>
            ))}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full inline-flex items-center justify-center gap-2 bg-forest-DEFAULT text-beige-100 font-semibold px-7 py-3 rounded-full bg-forest-400 transition-all duration-300 hover:shadow-xl hover:shadow-forest-DEFAULT/25 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Change Password"
            )}
          </button>
        </form>
      </div>

      <button
        type="button"
        onClick={handleLogout}
        disabled={loggingOut}
        className="w-full inline-flex items-center justify-center gap-2 text-forest-700 font-medium px-7 py-3.5 rounded-full border border-beige-300 hover:border-red-400 hover:text-red-600 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loggingOut ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Signing out...
          </>
        ) : (
          <>
            <LogOut className="w-4 h-4" />
            Sign Out
          </>
        )}
      </button>
    </PageContainer>
  );
}
