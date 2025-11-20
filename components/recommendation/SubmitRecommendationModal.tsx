"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { db, id } from "@/lib/instant";
import { validateUrl } from "@/lib/utils";

interface SubmitRecommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
  section: string;
  category: string;
  userId: string;
}

export function SubmitRecommendationModal({
  isOpen,
  onClose,
  section,
  category,
  userId,
}: SubmitRecommendationModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !description.trim()) {
      setError("Title and description are required");
      return;
    }

    if (url && !validateUrl(url)) {
      setError("Please enter a valid URL");
      return;
    }

    if (imageUrl && !validateUrl(imageUrl)) {
      setError("Please enter a valid image URL");
      return;
    }

    setLoading(true);
    try {
      await db.transact([
        db.tx.recommendations[id()].update({
          userId,
          section,
          category,
          title: title.trim(),
          description: description.trim(),
          url: url.trim() || undefined,
          imageUrl: imageUrl.trim() || undefined,
          createdAt: Date.now(),
        }),
      ]);
      
      // Reset form and close
      setTitle("");
      setDescription("");
      setUrl("");
      setImageUrl("");
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to submit recommendation. Please try again.");
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

        <h2 className="text-3xl font-extrabold text-beige mb-2">Submit Your Insight</h2>
        <p className="text-beige-dark mb-6">
          Share a resource, tool, or insight that has helped you
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-beige text-sm font-semibold mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-navy-dark border-2 border-beige-dark/30 text-beige placeholder-beige-dark/50 focus:border-beige focus:outline-none transition-colors"
              placeholder="e.g., Discord Server for Hip-Hop Producers"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-beige text-sm font-semibold mb-2">
              Description *
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-lg bg-navy-dark border-2 border-beige-dark/30 text-beige placeholder-beige-dark/50 focus:border-beige focus:outline-none transition-colors resize-none"
              placeholder="Describe why this is valuable and how it helped you..."
              required
            />
          </div>

          {/* URL */}
          <div>
            <label htmlFor="url" className="block text-beige text-sm font-semibold mb-2">
              Link
            </label>
            <input
              type="url"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-navy-dark border-2 border-beige-dark/30 text-beige placeholder-beige-dark/50 focus:border-beige focus:outline-none transition-colors"
              placeholder="https://example.com"
            />
          </div>

          {/* Image URL */}
          <div>
            <label htmlFor="imageUrl" className="block text-beige text-sm font-semibold mb-2">
              Image URL (Optional)
            </label>
            <input
              type="url"
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-navy-dark border-2 border-beige-dark/30 text-beige placeholder-beige-dark/50 focus:border-beige focus:outline-none transition-colors"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-300 text-sm">
              {error}
            </div>
          )}

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
              disabled={loading}
              className="flex-1 py-3 rounded-lg bg-beige text-navy-blue font-bold hover:bg-beige-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Submitting...
                </>
              ) : (
                "Submit Recommendation"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

