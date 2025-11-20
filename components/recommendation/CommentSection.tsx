"use client";

import { useState } from "react";
import Link from "next/link";
import { Send } from "lucide-react";
import { db, id } from "@/lib/instant";
import { formatDate, getInitials } from "@/lib/utils";

interface CommentSectionProps {
  recommendationId: string;
  comments: any[];
  users: any[];
  currentUser: any;
}

export function CommentSection({
  recommendationId,
  comments,
  users,
  currentUser,
}: CommentSectionProps) {
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) return;

    setIsSubmitting(true);
    try {
      await db.transact([
        db.tx.comments[id()].update({
          recommendationId,
          userId: currentUser.id,
          content: newComment.trim(),
          createdAt: Date.now(),
        }),
      ]);
      setNewComment("");
    } catch (error) {
      console.error("Failed to post comment:", error);
      alert("Failed to post comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Sort comments by date (newest first)
  const sortedComments = [...comments].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-bold text-beige">
        Comments ({comments.length})
      </h4>

      {/* Add Comment Form */}
      {currentUser ? (
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 px-4 py-2 rounded-lg bg-navy-dark border-2 border-beige-dark/30 text-beige placeholder-beige-dark/50 focus:border-beige focus:outline-none transition-colors"
            disabled={isSubmitting}
          />
          <button
            type="submit"
            disabled={isSubmitting || !newComment.trim()}
            className="px-4 py-2 rounded-lg bg-beige text-navy-blue font-semibold hover:bg-beige-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Send size={18} />
          </button>
        </form>
      ) : (
        <div className="p-4 rounded-lg bg-navy-dark/50 border border-beige-dark/30 text-beige-dark text-center">
          Please sign in to comment
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {sortedComments.length === 0 ? (
          <p className="text-beige-dark text-center py-4">No comments yet. Be the first to comment!</p>
        ) : (
          sortedComments.map((comment) => {
            const commenter = users.find((u) => u.id === comment.userId);
            return (
              <div
                key={comment.id}
                className="flex gap-3 p-4 rounded-lg bg-navy-dark/50 border border-beige-dark/30"
              >
                <Link href={`/profile/${comment.userId}`}>
                  {commenter?.avatarUrl ? (
                    <img
                      src={commenter.avatarUrl}
                      alt={commenter.username}
                      className="w-10 h-10 rounded-full object-cover border-2 border-beige-dark/30"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-beige/20 flex items-center justify-center text-beige text-sm font-bold border-2 border-beige-dark/30">
                      {commenter ? getInitials(commenter.username) : "?"}
                    </div>
                  )}
                </Link>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Link
                      href={`/profile/${comment.userId}`}
                      className="font-semibold text-beige hover:text-beige-dark transition-colors"
                    >
                      {commenter?.username || "Unknown User"}
                    </Link>
                    <span className="text-xs text-beige-dark">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-beige-dark leading-relaxed">{comment.content}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

