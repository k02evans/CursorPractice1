"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/instant";
import { User, Upload, Loader2 } from "lucide-react";

interface ProfileSetupProps {
  userId: string;
  email: string;
}

export function ProfileSetup({ userId, email }: ProfileSetupProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [socialLinks, setSocialLinks] = useState({
    spotifyUrl: "",
    instagramUrl: "",
    soundcloudUrl: "",
    youtubeUrl: "",
    tiktokUrl: "",
    twitterUrl: "",
    bandcampUrl: "",
    appleMusicUrl: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    try {
      await db.transact([
        db.tx.users[userId].update({
          email,
          username: username.trim(),
          avatarUrl: avatarUrl || undefined,
          ...Object.fromEntries(
            Object.entries(socialLinks).filter(([_, value]) => value.trim())
          ),
          createdAt: Date.now(),
        }),
      ]);
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Failed to create profile:", error);
      alert("Failed to create profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full bg-navy-blue/80 backdrop-blur-lg border-2 border-beige-dark/30 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-beige/20 mb-4">
            <User size={32} className="text-beige" />
          </div>
          <h2 className="text-3xl font-extrabold text-beige mb-2">Complete Your Profile</h2>
          <p className="text-beige-dark">Let's set up your IndieLab account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
            <p className="text-xs text-beige-dark mt-1">Optional: Add a profile image</p>
          </div>

          {/* Social Links */}
          <div className="border-t border-beige-dark/30 pt-6">
            <h3 className="text-lg font-bold text-beige mb-4">Connect Your Profiles (Optional)</h3>
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

          <button
            type="submit"
            disabled={loading || !username.trim()}
            className="w-full py-3 rounded-lg bg-beige text-navy-blue font-bold hover:bg-beige-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Creating Profile...
              </>
            ) : (
              "Complete Setup"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

