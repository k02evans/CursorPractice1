"use client";

import { useState } from "react";
import { X, Loader2, Upload } from "lucide-react";
import { db } from "@/lib/instant";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

export function EditProfileModal({ isOpen, onClose, user }: EditProfileModalProps) {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState(user.username || "");
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || "");
  const [socialLinks, setSocialLinks] = useState({
    spotifyUrl: user.spotifyUrl || "",
    instagramUrl: user.instagramUrl || "",
    soundcloudUrl: user.soundcloudUrl || "",
    youtubeUrl: user.youtubeUrl || "",
    tiktokUrl: user.tiktokUrl || "",
    twitterUrl: user.twitterUrl || "",
    bandcampUrl: user.bandcampUrl || "",
    appleMusicUrl: user.appleMusicUrl || "",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    try {
      await db.transact([
        db.tx.users[user.id].update({
          username: username.trim(),
          avatarUrl: avatarUrl.trim() || undefined,
          ...Object.fromEntries(
            Object.entries(socialLinks).map(([key, value]) => [
              key,
              value.trim() || undefined,
            ])
          ),
        }),
      ]);
      onClose();
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm overflow-y-auto p-4">
      <div className="bg-navy-blue border-2 border-beige-dark/30 rounded-2xl p-8 max-w-2xl w-full my-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-beige-dark hover:text-beige transition-colors"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>

        <h2 className="text-3xl font-extrabold text-beige mb-2">Edit Profile</h2>
        <p className="text-beige-dark mb-6">Update your profile information</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-beige text-sm font-semibold mb-2">
              Username *
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-navy-dark border-2 border-beige-dark/30 text-beige placeholder-beige-dark/50 focus:border-beige focus:outline-none transition-colors"
              placeholder="your_artist_name"
              required
            />
          </div>

          {/* Avatar URL */}
          <div>
            <label htmlFor="avatarUrl" className="block text-beige text-sm font-semibold mb-2">
              Profile Image URL
            </label>
            <div className="relative">
              <Upload className="absolute left-3 top-1/2 -translate-y-1/2 text-beige-dark" size={20} />
              <input
                type="url"
                id="avatarUrl"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-navy-dark border-2 border-beige-dark/30 text-beige placeholder-beige-dark/50 focus:border-beige focus:outline-none transition-colors"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
          </div>

          {/* Social Links */}
          <div className="border-t border-beige-dark/30 pt-6">
            <h3 className="text-lg font-bold text-beige mb-4">Social Profiles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(socialLinks).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-beige text-sm font-semibold mb-2 capitalize">
                    {key.replace("Url", "")}
                  </label>
                  <input
                    type="url"
                    value={value}
                    onChange={(e) =>
                      setSocialLinks((prev) => ({ ...prev, [key]: e.target.value }))
                    }
                    className="w-full px-4 py-2 rounded-lg bg-navy-dark border-2 border-beige-dark/30 text-beige text-sm placeholder-beige-dark/50 focus:border-beige focus:outline-none transition-colors"
                    placeholder={`https://${key.replace("Url", "").toLowerCase()}.com/...`}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-lg bg-navy-dark text-beige border-2 border-beige-dark/30 font-semibold hover:border-beige transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !username.trim()}
              className="flex-1 py-3 rounded-lg bg-beige text-navy-blue font-bold hover:bg-beige-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

