"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Lock,
  Trash2,
  ChevronLeft,
  Save,
  Bell,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";

export default function SettingsPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userData, setUserData] = useState<{ name: string; email: string } | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
  });
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Fetch current user
  useEffect(() => {
    async function fetchUser() {
      try {
        const user = await api<{ name: string; email: string }>("/habits/me");
        setUserData(user);
        setFormData((f) => ({ ...f, name: user.name, email: user.email }));
      } catch (error: unknown) {
        console.error("Failed to fetch user:", error);
        toast.error("Could not load user data");
      }
    }
    fetchUser();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData) return;
    setIsSaving(true);

    try {
      // Attempt update if endpoint exists
      const body = {
        name: formData.name,
        email: formData.email,
        ...(formData.newPassword ? { currentPassword: formData.currentPassword, newPassword: formData.newPassword } : {}),
      };

      const data = await api("/habits/update", {
        method: "PATCH",
        body: JSON.stringify(body),
      });

      toast.success("Profile updated successfully");
      setFormData((f) => ({ ...f, currentPassword: "", newPassword: "" }));
    } catch (error: unknown) {
      console.error("Profile update error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to update profile";
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await api("/habits/account", { method: "DELETE" });
      toast.success("Account deleted. We're sorry to see you go.");
      router.push("/register");
    } catch (error: unknown) {
      console.error("Delete account error:", error);
      const errorMessage = error instanceof Error ? error.message : "Could not delete account";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium text-sm"
          >
            <ChevronLeft size={18} />
            Back to Dashboard
          </button>
          <h1 className="font-bold text-slate-900">Account Settings</h1>
          <div className="w-20" />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 mt-10 space-y-8">
        {/* Profile Section */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <User size={20} className="text-indigo-600" />
              Public Profile
            </h2>
            <p className="text-slate-500 text-sm mt-1">Manage how you appear on HabitFlow.</p>
          </div>

          <form onSubmit={handleUpdateProfile} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-800" size={18} />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-800" size={18} />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Password Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 mt-4">
                <label className="text-sm font-semibold text-slate-700">Current Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="password"
                    value={formData.currentPassword}
                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <label className="text-sm font-semibold text-slate-700">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="password"
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900"
                  />
                </div>
                <p className="text-xs text-slate-500 italic mt-1">
                  Password must be at least 8 characters long.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                disabled={isSaving}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                Save Changes
              </button>
            </div>
          </form>
        </section>

        {/* Notifications */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-6">
            <Bell size={20} className="text-indigo-600" />
            Notifications
          </h2>
          <div className="flex items-center justify-between py-4 border-b border-slate-50">
            <div>
              <p className="font-semibold text-slate-800">Email Reminders</p>
              <p className="text-sm text-slate-500">Get a daily summary of your habits.</p>
            </div>
            <input
              type="checkbox"
              className="w-5 h-5 accent-indigo-600"
              checked={notificationsEnabled}
              onChange={(e) => setNotificationsEnabled(e.target.checked)}
            />
          </div>
        </section>

        {/* Danger Zone */}
        <section className="bg-red-50/50 rounded-3xl border border-red-100 p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-xl font-bold text-red-600 flex items-center gap-2">
                <Trash2 size={20} />
                Danger Zone
              </h2>
              <p className="text-red-700/70 text-sm mt-1">
                Once you delete your account, all your habit data will be gone forever.
              </p>
            </div>

            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="bg-white border border-red-200 text-red-600 px-6 py-2.5 rounded-xl font-bold hover:bg-red-600 hover:text-white transition-all"
              >
                Delete Account
              </button>
            ) : (
              <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="text-slate-500 font-medium px-4 py-2 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="bg-red-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-red-700 shadow-lg shadow-red-200"
                >
                  Confirm Delete
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}