import React, { useState } from "react";
import { supabase } from "./supabaseClient";
import { Mail, Lock, User, ArrowRight, Loader, AlertCircle, CheckCircle } from "lucide-react";

export default function LoginScreen() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!email || !username || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        if (authError.message.includes("already registered")) {
          setError("This email is already registered. Please sign in instead.");
        } else {
          setError(authError.message);
        }
        setLoading(false);
        return;
      }

      if (authData.user) {
        const { error: profileError } = await supabase
          .from("profiles")
          .insert([
            {
              id: authData.user.id,
              username: username,
              email: email,
              avatar_url: null,
              created_at: new Date().toISOString(),
            },
          ]);

        if (profileError) {
          setError(profileError.message);
        } else {
          setSuccess("✅ Account created! Redirecting to sign in...");
          setTimeout(() => {
            setIsSignUp(false);
            setEmail("");
            setUsername("");
            setPassword("");
            setSuccess("");
          }, 2000);
        }
      }
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        if (signInError.message.includes("Invalid login credentials")) {
          setError("Invalid email or password");
        } else {
          setError(signInError.message);
        }
      } else {
        setSuccess("✅ Sign in successful!");
      }
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!email) {
      setError("Please enter your email address");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess("✅ Password reset link sent to your email! Check your inbox.");
        setTimeout(() => {
          setIsForgotPassword(false);
          setEmail("");
          setSuccess("");
        }, 3000);
      }
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-slideIn">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img src="/logo.png" alt="Montra" className="w-12 h-12" />
            <h1 className="text-3xl font-bold text-[#1E1E1E]">Montra</h1>
          </div>
          <p className="text-gray-600">Manage your finances with ease</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200 animate-scaleIn">
          {isForgotPassword ? (
            <>
              <h2 className="text-2xl font-bold text-[#1E1E1E] mb-2 animate-slideIn">Reset Password</h2>
              <p className="text-gray-600 text-sm mb-6">Enter your email address and we'll send you a link to reset your password.</p>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center gap-2 animate-slideIn">
                  <AlertCircle size={18} /> {error}
                </div>
              )}

              {success && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm flex items-center gap-2 animate-slideIn">
                  <CheckCircle size={18} /> {success}
                </div>
              )}

              <form onSubmit={handleForgotPassword} className="space-y-4 animate-slideIn">
                <div>
                  <label className="block text-sm font-medium text-[#1E1E1E] mb-2">Email Address</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3 top-3 text-gray-400" />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" required />
                  </div>
                </div>

                <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400 transition-all flex items-center justify-center gap-2 active:scale-95">
                  {loading ? <Loader size={18} className="animate-spin" /> : <ArrowRight size={18} />}
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>

              <p className="text-center text-gray-600 mt-6">
                <button onClick={() => { setIsForgotPassword(false); setEmail(""); setError(""); setSuccess(""); }} className="text-indigo-600 font-semibold hover:underline">Back to Sign In</button>
              </p>
            </>
          ) : !isSignUp ? (
            <>
              <h2 className="text-2xl font-bold text-[#1E1E1E] mb-6 animate-slideIn">Sign In</h2>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center gap-2 animate-slideIn">
                  <AlertCircle size={18} /> {error}
                </div>
              )}

              {success && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm flex items-center gap-2 animate-slideIn">
                  <CheckCircle size={18} /> {success}
                </div>
              )}

              <form onSubmit={handleSignIn} className="space-y-4 animate-slideIn">
                <div>
                  <label className="block text-sm font-medium text-[#1E1E1E] mb-2">Email Address</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3 top-3 text-gray-400" />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" required />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1E1E1E] mb-2">Password</label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3 top-3 text-gray-400" />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" required />
                  </div>
                </div>

                <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400 transition-all flex items-center justify-center gap-2 active:scale-95">
                  {loading ? <Loader size={18} className="animate-spin" /> : <ArrowRight size={18} />}
                  {loading ? "Signing in..." : "Sign In"}
                </button>
              </form>

              <div className="text-center text-sm text-gray-600 mt-6 space-y-2">
                <p>
                  Don't have an account? <button onClick={() => { setIsSignUp(true); setError(""); setSuccess(""); }} className="text-indigo-600 font-semibold hover:underline">Sign Up</button>
                </p>
                <p>
                  <button onClick={() => { setIsForgotPassword(true); setError(""); setSuccess(""); }} className="text-indigo-600 font-semibold hover:underline">Forgot Password?</button>
                </p>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-[#1E1E1E] mb-6 animate-slideIn">Create Account</h2>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center gap-2 animate-slideIn">
                  <AlertCircle size={18} /> {error}
                </div>
              )}

              {success && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm flex items-center gap-2 animate-slideIn">
                  <CheckCircle size={18} /> {success}
                </div>
              )}

              <form onSubmit={handleSignUp} className="space-y-4 animate-slideIn">
                <div>
                  <label className="block text-sm font-medium text-[#1E1E1E] mb-2">Email Address</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3 top-3 text-gray-400" />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" required />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1E1E1E] mb-2">Username</label>
                  <div className="relative">
                    <User size={18} className="absolute left-3 top-3 text-gray-400" />
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Choose a username" className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" required />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1E1E1E] mb-2">Password</label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3 top-3 text-gray-400" />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a strong password" className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" required />
                  </div>
                </div>

                <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400 transition-all flex items-center justify-center gap-2 active:scale-95">
                  {loading ? <Loader size={18} className="animate-spin" /> : <ArrowRight size={18} />}
                  {loading ? "Creating account..." : "Create Account"}
                </button>
              </form>

              <p className="text-center text-gray-600 mt-6">
                Already have an account? <button onClick={() => { setIsSignUp(false); setError(""); setSuccess(""); }} className="text-indigo-600 font-semibold hover:underline">Sign In</button>
              </p>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        .animate-slideIn {
          animation: slideIn 0.4s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
