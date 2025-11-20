"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink, MessageCircle, ThumbsUp, Share2, User } from "lucide-react";
import { db, id } from "@/lib/instant";
import { formatDate, getInitials } from "@/lib/utils";
import { RatingStars } from "./RatingStars";
import { CommentSection } from "./CommentSection";

interface RecommendationCardProps {
  recommendation: any;
  ratings: any[];
  recommends: any[];
  comments: any[];
  users: any[];
  currentUser: any;
}

export function RecommendationCard({
  recommendation,
  ratings,
  recommends,
  comments,
  users,
  currentUser,
}: RecommendationCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const submitter = users.find((u) => u.id === recommendation.userId);
  const userRating = ratings.find((r) => r.userId === currentUser?.id);
  const userRecommend = recommends.find((r) => r.userId === currentUser?.id);

  const avgRating =
    ratings.length > 0
      ? ratings.reduce((acc, r) => acc + r.stars, 0) / ratings.length
      : 0;

  const handleRecommend = async () => {
    if (!currentUser) {
      alert("Please sign in to recommend");
      return;
    }

    try {
      if (userRecommend) {
        // Remove recommend
        await db.transact([db.tx.recommends[userRecommend.id].delete()]);
      } else {
        // Add recommend
        await db.transact([
          db.tx.recommends[id()].update({
            recommendationId: recommendation.id,
            userId: currentUser.id,
            createdAt: Date.now(),
          }),
        ]);
      }
    } catch (error) {
      console.error("Failed to toggle recommend:", error);
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/${recommendation.section}/${recommendation.category}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: recommendation.title,
          text: recommendation.description,
          url: url,
        });
        
        // Track share
        if (currentUser) {
          await db.transact([
            db.tx.shares[id()].update({
              recommendationId: recommendation.id,
              userId: currentUser.id,
              createdAt: Date.now(),
            }),
          ]);
        }
      } catch (error) {
        // User cancelled share
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(url);
        setIsSharing(true);
        setTimeout(() => setIsSharing(false), 2000);
        
        // Track share
        if (currentUser) {
          await db.transact([
            db.tx.shares[id()].update({
              recommendationId: recommendation.id,
              userId: currentUser.id,
              createdAt: Date.now(),
            }),
          ]);
        }
      } catch (error) {
        console.error("Failed to copy:", error);
      }
    }
  };

  const handleRating = async (stars: number) => {
    if (!currentUser) {
      alert("Please sign in to rate");
      return;
    }

    try {
      if (userRating) {
        // Update existing rating
        await db.transact([
          db.tx.ratings[userRating.id].update({ stars }),
        ]);
      } else {
        // Create new rating
        await db.transact([
          db.tx.ratings[id()].update({
            recommendationId: recommendation.id,
            userId: currentUser.id,
            stars,
            createdAt: Date.now(),
          }),
        ]);
      }
    } catch (error) {
      console.error("Failed to rate:", error);
    }
  };

  return (
    <div className="bg-navy-blue/70 backdrop-blur-lg rounded-2xl p-6 md:p-8 border border-beige-dark/30 hover:border-beige/50 transition-all shadow-lg">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {submitter?.avatarUrl ? (
            <img
              src={submitter.avatarUrl}
              alt={submitter.username}
              className="w-12 h-12 rounded-full object-cover border-2 border-beige-dark/30"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-beige/20 flex items-center justify-center text-beige font-bold border-2 border-beige-dark/30">
              {submitter ? getInitials(submitter.username) : "?"}
            </div>
          )}
          <div>
            <Link
              href={`/profile/${recommendation.userId}`}
              className="font-semibold text-beige hover:text-beige-dark transition-colors"
            >
              {submitter?.username || "Unknown User"}
            </Link>
            <p className="text-sm text-beige-dark">{formatDate(recommendation.createdAt)}</p>
          </div>
        </div>
        
        {recommendation.url && (
          <a
            href={recommendation.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full hover:bg-beige/10 text-beige-dark hover:text-beige transition-all"
            title="Visit link"
          >
            <ExternalLink size={20} />
          </a>
        )}
      </div>

      {/* Content */}
      <h3 className="text-2xl font-bold text-beige mb-3">{recommendation.title}</h3>
      <p className="text-beige-dark leading-relaxed mb-4">{recommendation.description}</p>

      {recommendation.imageUrl && (
        <img
          src={recommendation.imageUrl}
          alt={recommendation.title}
          className="w-full max-h-64 object-cover rounded-xl mb-4"
        />
      )}

      {/* Rating */}
      <div className="mb-4">
        <RatingStars
          rating={avgRating}
          userRating={userRating?.stars}
          totalRatings={ratings.length}
          onRate={handleRating}
          disabled={!currentUser}
        />
      </div>

      {/* Interaction Bar */}
      <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-beige-dark/30">
        <button
          onClick={handleRecommend}
          disabled={!currentUser}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all ${
            userRecommend
              ? "bg-beige/20 text-beige border-2 border-beige"
              : "bg-navy-dark text-beige-dark hover:text-beige border-2 border-beige-dark/30 hover:border-beige/50"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          title={!currentUser ? "Sign in to recommend" : undefined}
        >
          <ThumbsUp size={18} fill={userRecommend ? "currentColor" : "none"} />
          <span>{recommends.length}</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-navy-dark text-beige-dark hover:text-beige border-2 border-beige-dark/30 hover:border-beige/50 font-semibold transition-all"
        >
          <MessageCircle size={18} />
          <span>{comments.length}</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-navy-dark text-beige-dark hover:text-beige border-2 border-beige-dark/30 hover:border-beige/50 font-semibold transition-all"
        >
          <Share2 size={18} />
          {isSharing && <span className="text-xs">Copied!</span>}
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-6 pt-6 border-t border-beige-dark/30">
          <CommentSection
            recommendationId={recommendation.id}
            comments={comments}
            users={users}
            currentUser={currentUser}
          />
        </div>
      )}
    </div>
  );
}

