import React, { useState } from "react";
import { supabase } from "./supabaseClient";
import { AlertCircle, CheckCircle, Loader, ArrowRight, Mail } from "lucide-react";

export default function AccountDeletion() {
  const [step, setStep] = useState("confirm"); // confirm -> email -> final
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRequestDeletion = async (e) => {
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
      // In a real app, you'd call a backend endpoint to send a deletion confirmation email
      // For now, we'll simulate it
      setSuccess("✅ Verification code sent to your email. Check your inbox.");
      setStep("email");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!verificationCode) {
      setError("Please enter the verification code");
      setLoading(false);
      return;
    }

    if (verificationCode !== "123456") {
      setError("Invalid verification code. Please check your email.");
      setLoading(false);
      return;
    }

    try {
      // Delete user account
      const user = (await supabase.auth.getUser()).data.user;
      
      // Delete user data
      await supabase.from("user_data").delete().eq("user_id", user.id);
      
      // Delete profile
      await supabase.from("profiles").delete().eq("id", user.id);
      
      // Delete auth user
      await supabase.auth.admin.deleteUser(user.id);
      
      setSuccess("✅ Your account has been successfully deleted.");
      setStep("final");
      
      setTimeout(() => {
        window.location.href = "/";
      }, 3000);
    } catch (err) {
      setError(err.message || "Failed to delete account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-slideIn">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img src="/logo.png" alt="Montra" className="w-12 h-12" />
            <h1 className="text-3xl font-bold text-[#1E1E1E]">Montra</h1>
          </div>
          <p className="text-gray-600">Account Deletion</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200 animate-scaleIn">
          {step === "confirm" && (
            <>
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle size={24} className="text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-900 mb-1">Are you sure?</h3>
                  <p className="text-sm text-red-700">
                    Deleting your account is permanent and cannot be undone. All your data, wallets, and transactions will be deleted forever.
                  </p>
                </div>
              </div>

              <form onSubmit={handleRequestDeletion} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#1E1E1E] mb-2">Confirm with your email</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:bg-gray-400 transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader size={18} className="animate-spin" /> : <ArrowRight size={18} />}
                    {loading ? "Sending..." : "Continue"}
                  </button>
                </div>
              </form>
            </>
          )}

          {step === "email" && (
            <>
              <h2 className="text-2xl font-bold text-[#1E1E1E] mb-2 animate-slideIn">Verify Your Email</h2>
              <p className="text-gray-600 text-sm mb-6">We've sent a verification code to your email. Enter it below to confirm account deletion.</p>

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

              <form onSubmit={handleVerifyCode} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#1E1E1E] mb-2">Verification Code</label>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="Enter the 6-digit code"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-center text-lg tracking-widest"
                    maxLength="6"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-2">Test code: 123456</p>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setStep("confirm");
                      setVerificationCode("");
                      setError("");
                    }}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:bg-gray-400 transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader size={18} className="animate-spin" /> : <ArrowRight size={18} />}
                    {loading ? "Deleting..." : "Delete Account"}
                  </button>
                </div>
              </form>
            </>
          )}

          {step === "final" && (
            <>
              <div className="text-center space-y-4 animate-slideIn">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-green-100 rounded-full">
                    <CheckCircle size={48} className="text-green-600" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-[#1E1E1E]">Account Deleted</h2>
                <p className="text-gray-600">Your account and all associated data have been permanently deleted.</p>
                <p className="text-sm text-gray-500">Redirecting to home page in a few seconds...</p>
              </div>
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
