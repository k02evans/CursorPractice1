"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  Edit,
  ExternalLink,
  Calendar,
  Award,
  MessageCircle,
  ThumbsUp,
  Star,
} from "lucide-react";
import { db } from "@/lib/instant";
import { formatDate, getInitials } from "@/lib/utils";
import { EditProfileModal } from "@/components/profile/EditProfileModal";

export default function ProfilePage() {
  const params = useParams();
  const userId = params.userId as string;
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"recommendations" | "comments">("recommendations");

  const { isLoading: authLoading, user: currentUser } = db.useAuth();

  const { isLoading, error, data } = db.useQuery({
    users: {
      $: {
        where: {
          id: userId,
        },
      },
    },
    recommendations: {
      $: {
        where: {
          userId: userId,
        },
      },
    },
    comments: {
      $: {
        where: {
          userId: userId,
        },
      },
    },
    ratings: {},
    recommends: {},
  });

  if (isLoading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-beige/20 animate-pulse mx-auto mb-4" />
          <p className="text-beige-dark">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !data?.users || data.users.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-beige mb-4">User Not Found</h1>
          <Link href="/" className="text-beige-dark hover:text-beige">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  const user = data.users[0];
  const recommendations = data.recommendations || [];
  const comments = data.comments || [];
  const allRatings = data.ratings || [];
  const allRecommends = data.recommends || [];

  const isOwnProfile = currentUser?.id === userId;

  // Calculate stats
  const totalRecommendations = recommendations.length;
  const totalComments = comments.length;
  const totalRecommendsReceived = allRecommends.filter((r) =>
    recommendations.some((rec) => rec.id === r.recommendationId)
  ).length;
  const avgRating =
    allRatings.length > 0
      ? allRatings
          .filter((r) => recommendations.some((rec) => rec.id === r.recommendationId))
          .reduce((acc, r) => acc + r.stars, 0) / allRatings.length
      : 0;

  const socialLinks = [
    { key: "spotifyUrl", label: "Spotify", url: user.spotifyUrl },
    { key: "instagramUrl", label: "Instagram", url: user.instagramUrl },
    { key: "soundcloudUrl", label: "SoundCloud", url: user.soundcloudUrl },
    { key: "youtubeUrl", label: "YouTube", url: user.youtubeUrl },
    { key: "tiktokUrl", label: "TikTok", url: user.tiktokUrl },
    { key: "twitterUrl", label: "Twitter", url: user.twitterUrl },
    { key: "bandcampUrl", label: "Bandcamp", url: user.bandcampUrl },
    { key: "appleMusicUrl", label: "Apple Music", url: user.appleMusicUrl },
  ].filter((link) => link.url);

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-[1200px] mx-auto px-5">
        {/* Profile Header */}
        <div className="bg-navy-blue/70 backdrop-blur-lg rounded-2xl p-8 border border-beige-dark/30 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.username}
                className="w-24 h-24 rounded-full object-cover border-4 border-beige-dark/30"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-beige/20 flex items-center justify-center text-beige text-3xl font-bold border-4 border-beige-dark/30">
                {getInitials(user.username)}
              </div>
            )}

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-extrabold text-beige">
                  {user.username}
                </h1>
                {isOwnProfile && (
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="p-2 rounded-full bg-beige/10 hover:bg-beige/20 text-beige transition-all"
                    title="Edit profile"
                  >
                    <Edit size={20} />
                  </button>
                )}
              </div>
              <p className="text-beige-dark mb-4">{user.email}</p>
              <div className="flex items-center gap-2 text-sm text-beige-dark">
                <Calendar size={16} />
                <span>Joined {formatDate(user.createdAt)}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-auto">
              <div className="text-center p-3 bg-navy-dark/50 rounded-lg border border-beige-dark/30">
                <div className="text-2xl font-bold text-beige">{totalRecommendations}</div>
                <div className="text-xs text-beige-dark">Insights</div>
              </div>
              <div className="text-center p-3 bg-navy-dark/50 rounded-lg border border-beige-dark/30">
                <div className="text-2xl font-bold text-beige">{totalRecommendsReceived}</div>
                <div className="text-xs text-beige-dark">Recommends</div>
              </div>
              <div className="text-center p-3 bg-navy-dark/50 rounded-lg border border-beige-dark/30">
                <div className="text-2xl font-bold text-beige">{totalComments}</div>
                <div className="text-xs text-beige-dark">Comments</div>
              </div>
              <div className="text-center p-3 bg-navy-dark/50 rounded-lg border border-beige-dark/30">
                <div className="text-2xl font-bold text-beige">
                  {avgRating > 0 ? avgRating.toFixed(1) : "-"}
                </div>
                <div className="text-xs text-beige-dark">Avg Rating</div>
              </div>
            </div>
          </div>

          {/* Social Links */}
          {socialLinks.length > 0 && (
            <div className="mt-6 pt-6 border-t border-beige-dark/30">
              <h3 className="text-sm font-semibold text-beige mb-3">Connected Profiles</h3>
              <div className="flex flex-wrap gap-2">
                {socialLinks.map((link) => (
                  <a
                    key={link.key}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-navy-dark text-beige-dark hover:text-beige border border-beige-dark/30 hover:border-beige/50 transition-all text-sm"
                  >
                    {link.label}
                    <ExternalLink size={14} />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("recommendations")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "recommendations"
                ? "bg-beige text-navy-blue"
                : "bg-navy-blue/50 text-beige-dark hover:text-beige border border-beige-dark/30"
            }`}
          >
            Recommendations ({totalRecommendations})
          </button>
          <button
            onClick={() => setActiveTab("comments")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "comments"
                ? "bg-beige text-navy-blue"
                : "bg-navy-blue/50 text-beige-dark hover:text-beige border border-beige-dark/30"
            }`}
          >
            Comments ({totalComments})
          </button>
        </div>

        {/* Content */}
        {activeTab === "recommendations" ? (
          <div className="grid gap-6">
            {recommendations.length === 0 ? (
              <div className="text-center py-12 bg-navy-blue/30 rounded-2xl border-2 border-dashed border-beige-dark/30">
                <p className="text-beige-dark text-lg">No recommendations yet.</p>
              </div>
            ) : (
              recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="bg-navy-blue/70 backdrop-blur-lg rounded-2xl p-6 border border-beige-dark/30 hover:border-beige/50 transition-all"
                >
                  <h3 className="text-2xl font-bold text-beige mb-2">{rec.title}</h3>
                  <p className="text-beige-dark mb-4">{rec.description}</p>
                  <div className="flex items-center gap-4 text-sm text-beige-dark">
                    <span className="flex items-center gap-1">
                      <Star size={16} />
                      {allRatings
                        .filter((r) => r.recommendationId === rec.id)
                        .reduce((acc, r) => acc + r.stars, 0) /
                        allRatings.filter((r) => r.recommendationId === rec.id).length || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <ThumbsUp size={16} />
                      {allRecommends.filter((r) => r.recommendationId === rec.id).length}
                    </span>
                    <Link
                      href={`/${rec.section}/${rec.category}`}
                      className="text-beige hover:text-beige-dark transition-colors ml-auto"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="grid gap-4">
            {comments.length === 0 ? (
              <div className="text-center py-12 bg-navy-blue/30 rounded-2xl border-2 border-dashed border-beige-dark/30">
                <p className="text-beige-dark text-lg">No comments yet.</p>
              </div>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-navy-blue/70 backdrop-blur-lg rounded-xl p-4 border border-beige-dark/30"
                >
                  <p className="text-beige-dark mb-2">{comment.content}</p>
                  <p className="text-xs text-beige-dark">{formatDate(comment.createdAt)}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {showEditModal && isOwnProfile && (
        <EditProfileModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          user={user}
        />
      )}
    </div>
  );
}

