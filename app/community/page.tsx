"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import FloorPageLayout from "../components/FloorPageLayout";
import FloorButton from "../components/FloorButton";
import CategoryVoteButton from "../components/community/CategoryVoteButton";

interface CommunityCategory {
  id: string;
  name: string;
  description: string;
  upvotes: number;
  downvotes: number;
  is_published: boolean;
  created_at: string;
  examples: Array<{
    id: string;
    name: string;
    image_url: string | null;
    image_status: string;
  }>;
}

export default function CommunityPage() {
  const [categories, setCategories] = useState<CommunityCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"votes" | "newest" | "name">("votes");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchCategories();
  }, [sortBy]);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/categories?sort=${sortBy}`);
      const data = await response.json();

      if (data.error) {
        // Supabase not configured - show helpful message
        if (response.status === 503) {
          setError("Community features require Supabase to be configured. See .env.example for setup instructions.");
        } else {
          setError(data.error);
        }
      } else {
        setCategories(data.categories || []);
      }
    } catch (err) {
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryThumbnail = (category: CommunityCategory) => {
    const uploadedExample = category.examples.find(
      (e) => e.image_url && e.image_status === "uploaded"
    );
    return uploadedExample?.image_url || null;
  };

  return (
    <FloorPageLayout>
      <div className="min-h-screen p-4 sm:p-8 md:p-12 flex flex-col gap-6 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold glow-text" style={{ color: "#00d4ff" }}>
              Community Categories
            </h1>
            <p className="text-white/70 mt-2">
              Browse and vote on categories created by the community
            </p>
          </div>
          <Link href="/community/create">
            <FloorButton variant="rectangular" className="font-semibold whitespace-nowrap">
              + Create Category
            </FloorButton>
          </Link>
        </div>

        {/* Search and Sort */}
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-gray-900 text-white p-3 rounded-md border-2 border-[#00d4ff] focus:outline-none focus:ring-2 focus:ring-[#00d4ff]"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "votes" | "newest" | "name")}
            className="bg-gray-900 text-white p-3 rounded-md border-2 border-[#00d4ff] focus:outline-none focus:ring-2 focus:ring-[#00d4ff]"
          >
            <option value="votes">Most Popular</option>
            <option value="newest">Newest</option>
            <option value="name">Alphabetical</option>
          </select>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin h-12 w-12 border-4 border-[#00d4ff] border-t-transparent rounded-full mx-auto"></div>
            <p className="text-white/70 mt-4">Loading categories...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-gray-900/50 rounded-lg border-2 border-yellow-500/50">
            <div className="text-yellow-400 text-6xl mb-4">⚠️</div>
            <p className="text-white text-lg mb-2">Community Features Not Available</p>
            <p className="text-white/70 max-w-md mx-auto mb-6">{error}</p>
            <Link href="/categories">
              <FloorButton variant="rectangular" className="font-semibold">
                View Built-in Categories Instead
              </FloorButton>
            </Link>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="text-center py-12 bg-gray-900/50 rounded-lg border-2 border-[#00d4ff]/30">
            <p className="text-white/70 text-lg mb-4">
              {searchQuery
                ? "No categories found matching your search"
                : "No community categories yet. Be the first to create one!"}
            </p>
            {!searchQuery && (
              <Link href="/community/create">
                <FloorButton variant="rectangular" className="font-semibold">
                  Create First Category
                </FloorButton>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCategories.map((category) => {
              const thumbnail = getCategoryThumbnail(category);
              const exampleCount = category.examples.length;
              const uploadedCount = category.examples.filter(
                (e) => e.image_status === "uploaded"
              ).length;

              return (
                <Link
                  key={category.id}
                  href={`/community/${category.id}`}
                  className="group"
                >
                  <div className="bg-gray-900/50 rounded-lg border-2 border-gray-700 hover:border-[#00d4ff] transition-all overflow-hidden">
                    {/* Thumbnail */}
                    <div className="aspect-video bg-gray-800 relative overflow-hidden">
                      {thumbnail ? (
                        <img
                          src={thumbnail}
                          alt={category.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                          <span className="text-5xl">📁</span>
                        </div>
                      )}
                      {/* Example count badge */}
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {uploadedCount}/{exampleCount} images
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-white group-hover:text-[#00d4ff] transition-colors">
                        {category.name}
                      </h3>
                      {category.description && (
                        <p className="text-white/60 text-sm mt-1 line-clamp-2">
                          {category.description}
                        </p>
                      )}
                      
                      {/* Vote buttons and date */}
                      <div className="flex items-center justify-between mt-3">
                        <div onClick={(e) => e.preventDefault()}>
                          <CategoryVoteButton
                            categoryId={category.id}
                            upvotes={category.upvotes}
                            downvotes={category.downvotes}
                            size="sm"
                          />
                        </div>
                        <span className="text-white/40 text-xs">
                          {new Date(category.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 border-t border-[#00d4ff]/30 mt-auto">
          <Link href="/presenter">
            <FloorButton variant="rectangular" className="font-semibold w-full sm:w-auto">
              Back to Home
            </FloorButton>
          </Link>
          <Link href="/categories">
            <FloorButton variant="rectangular" className="font-semibold w-full sm:w-auto">
              View Built-in Categories
            </FloorButton>
          </Link>
        </div>
      </div>
    </FloorPageLayout>
  );
}
