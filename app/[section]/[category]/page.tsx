"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Filter } from "lucide-react";
import { db, SECTIONS, type SectionKey } from "@/lib/instant";
import { RecommendationCard } from "@/components/recommendation/RecommendationCard";
import { SubmitRecommendationModal } from "@/components/recommendation/SubmitRecommendationModal";

type SortOption = "newest" | "highest-rated" | "most-recommended";

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const section = params.section as SectionKey;
  const categoryId = params.category as string;

  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const { isLoading, user } = db.useAuth();
  
  // Query recommendations for this category
  const { isLoading: recsLoading, error, data } = db.useQuery({
    recommendations: {
      $: {
        where: {
          section: section,
          category: categoryId,
        },
      },
    },
    ratings: {},
    recommends: {},
    comments: {},
    users: {},
  });

  // Validate section and category
  const sectionData = SECTIONS[section];
  if (!sectionData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-beige mb-4">Section Not Found</h1>
          <Link href="/" className="text-beige-dark hover:text-beige">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  const category = sectionData.categories.find((c) => c.id === categoryId);
  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-beige mb-4">Category Not Found</h1>
          <Link href="/" className="text-beige-dark hover:text-beige">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  const recommendations = data?.recommendations || [];
  const ratings = data?.ratings || [];
  const recommends = data?.recommends || [];
  const comments = data?.comments || [];
  const users = data?.users || [];

  // Sort recommendations
  const sortedRecommendations = [...recommendations].sort((a, b) => {
    if (sortBy === "newest") {
      return b.createdAt - a.createdAt;
    } else if (sortBy === "highest-rated") {
      const avgA = getAverageRating(a.id, ratings);
      const avgB = getAverageRating(b.id, ratings);
      return avgB - avgA;
    } else if (sortBy === "most-recommended") {
      const countA = recommends.filter((r) => r.recommendationId === a.id).length;
      const countB = recommends.filter((r) => r.recommendationId === b.id).length;
      return countB - countA;
    }
    return 0;
  });

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-[1200px] mx-auto px-5">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-beige-dark hover:text-beige transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            Back to Home
          </Link>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-beige mb-2 tracking-tight">
                {category.name}
              </h1>
              <p className="text-beige-dark text-lg">{sectionData.name}</p>
            </div>

            <button
              onClick={() => {
                if (!user) {
                  alert("Please sign in to submit a recommendation");
                  return;
                }
                setShowSubmitModal(true);
              }}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-beige text-navy-blue font-bold hover:bg-beige-dark transition-all shadow-lg hover:shadow-xl"
            >
              <Plus size={20} />
              Submit Insight
            </button>
          </div>
        </div>

        {/* Sort and Filter */}
        <div className="flex flex-wrap items-center gap-4 mb-8 p-4 bg-navy-blue/50 rounded-xl border border-beige-dark/30">
          <div className="flex items-center gap-2 text-beige font-semibold">
            <Filter size={20} />
            Sort by:
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { value: "newest" as const, label: "Newest" },
              { value: "highest-rated" as const, label: "Highest Rated" },
              { value: "most-recommended" as const, label: "Most Recommended" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setSortBy(option.value)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  sortBy === option.value
                    ? "bg-beige text-navy-blue"
                    : "bg-navy-dark text-beige-dark hover:text-beige border border-beige-dark/30"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        {recsLoading ? (
          <div className="grid gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-64 bg-navy-blue/50 rounded-2xl animate-pulse border border-beige-dark/30"
              />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-400">Failed to load recommendations. Please try again.</p>
          </div>
        ) : sortedRecommendations.length === 0 ? (
          <div className="text-center py-12 bg-navy-blue/30 rounded-2xl border-2 border-dashed border-beige-dark/30">
            <p className="text-beige-dark text-lg mb-4">No recommendations yet for this category.</p>
            <p className="text-beige-dark mb-6">Be the first to share your insights!</p>
            {user && (
              <button
                onClick={() => setShowSubmitModal(true)}
                className="px-6 py-3 rounded-full bg-beige text-navy-blue font-bold hover:bg-beige-dark transition-all"
              >
                Submit First Recommendation
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-6">
            {sortedRecommendations.map((rec) => (
              <RecommendationCard
                key={rec.id}
                recommendation={rec}
                ratings={ratings.filter((r) => r.recommendationId === rec.id)}
                recommends={recommends.filter((r) => r.recommendationId === rec.id)}
                comments={comments.filter((c) => c.recommendationId === rec.id)}
                users={users}
                currentUser={user}
              />
            ))}
          </div>
        )}
      </div>

      {showSubmitModal && user && (
        <SubmitRecommendationModal
          isOpen={showSubmitModal}
          onClose={() => setShowSubmitModal(false)}
          section={section}
          category={categoryId}
          userId={user.id}
        />
      )}
    </div>
  );
}

function getAverageRating(recommendationId: string, ratings: any[]): number {
  const recRatings = ratings.filter((r) => r.recommendationId === recommendationId);
  if (recRatings.length === 0) return 0;
  const sum = recRatings.reduce((acc, r) => acc + r.stars, 0);
  return sum / recRatings.length;
}

