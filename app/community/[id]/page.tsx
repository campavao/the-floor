"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import FloorPageLayout from "../../components/FloorPageLayout";
import FloorButton from "../../components/FloorButton";
import ExampleImageGrid from "../../components/community/ExampleImageGrid";
import CategoryVoteButton from "../../components/community/CategoryVoteButton";

interface Example {
  id?: string;
  name: string;
  alternatives: string[];
  imageUrl: string | null;
  imageStatus: "pending" | "uploading" | "uploaded" | "failed";
}

interface Category {
  id: string;
  name: string;
  description: string;
  search_query_template: string;
  upvotes: number;
  downvotes: number;
  is_published: boolean;
  created_at: string;
  examples: Array<{
    id: string;
    name: string;
    alternatives: string[];
    image_url: string | null;
    image_status: string;
    order_index: number;
  }>;
}

export default function CategoryDetailPage() {
  const params = useParams();
  const categoryId = params.id as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [examples, setExamples] = useState<Example[]>([]);
  const [exampleIds, setExampleIds] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchCategory = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/categories/${categoryId}`);
        const data = await response.json();

        if (data.error) {
          setError(data.error);
          return;
        }

        const cat = data.category;
        setCategory(cat);

        // Convert examples to component format
        const sortedExamples = [...(cat.examples || [])].sort(
          (a, b) => a.order_index - b.order_index
        );

        const convertedExamples: Example[] = sortedExamples.map((e) => ({
          alternatives: e.alternatives || [],
          id: e.id,
          imageStatus: e.image_status as Example["imageStatus"],
          imageUrl: e.image_url,
          name: e.name,
        }));

        setExamples(convertedExamples);

        // Build example ID map
        const ids: Record<number, string> = {};
        sortedExamples.forEach((e, index) => {
          ids[index] = e.id;
        });
        setExampleIds(ids);
      } catch {
        setError("Failed to load category");
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategory();
  }, [categoryId]);

  const updateExample = (index: number, updates: Partial<Example>) => {
    setExamples((prev) =>
      prev.map((e, i) => (i === index ? { ...e, ...updates } : e))
    );
  };

  const handleImageUpload = useCallback(
    async (index: number, blob: Blob, fileName: string): Promise<string | null> => {
      if (!categoryId || !exampleIds[index]) return null;

      try {
        const formData = new FormData();
        formData.append("file", blob, `${fileName}.jpg`);
        formData.append("categoryId", categoryId);
        formData.append("exampleId", exampleIds[index]);
        formData.append("fileName", fileName);

        const response = await fetch("/api/upload-image", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        return data.url || null;
      } catch (err) {
        console.error("Upload error:", err);
        return null;
      }
    },
    [categoryId, exampleIds]
  );

  const handleImageUrlSelect = useCallback(
    async (index: number, imageUrl: string): Promise<string | null> => {
      if (!categoryId || !exampleIds[index]) return null;

      try {
        const response = await fetch("/api/upload-image", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageUrl,
            categoryId,
            exampleId: exampleIds[index],
            fileName: examples[index].name,
          }),
        });

        const data = await response.json();
        return data.url || null;
      } catch (err) {
        console.error("Upload from URL error:", err);
        return null;
      }
    },
    [categoryId, exampleIds, examples]
  );

  if (loading) {
    return (
      <FloorPageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin h-12 w-12 border-4 border-[#00d4ff] border-t-transparent rounded-full mx-auto"></div>
            <p className="text-white/70 mt-4">Loading category...</p>
          </div>
        </div>
      </FloorPageLayout>
    );
  }

  if (error || !category) {
    return (
      <FloorPageLayout>
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center bg-gray-900/50 rounded-lg border-2 border-red-500/50 p-8 max-w-md">
            <p className="text-red-400 text-lg mb-4">{error || "Category not found"}</p>
            <Link href="/community">
              <FloorButton variant="rectangular" className="font-semibold">
                Back to Community
              </FloorButton>
            </Link>
          </div>
        </div>
      </FloorPageLayout>
    );
  }

  const uploadedCount = examples.filter((e) => e.imageStatus === "uploaded").length;
  const totalCount = examples.length;

  return (
    <FloorPageLayout>
      <div className="min-h-screen p-4 sm:p-8 md:p-12 flex flex-col gap-6 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold glow-text" style={{ color: "#00d4ff" }}>
                {category.name}
              </h1>
              {!category.is_published && (
                <span className="bg-yellow-600 text-white text-xs px-2 py-1 rounded">
                  Draft
                </span>
              )}
            </div>
            {category.description && (
              <p className="text-white/70 mt-2">{category.description}</p>
            )}
            <div className="flex flex-wrap items-center gap-4 mt-3">
              <CategoryVoteButton
                categoryId={category.id}
                upvotes={category.upvotes}
                downvotes={category.downvotes}
              />
              <span className="text-white/50 text-sm">
                {uploadedCount}/{totalCount} images ready
              </span>
              <span className="text-white/40 text-sm">
                Created {new Date(category.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <FloorButton
              variant="rectangular"
              className="font-semibold"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Done Editing" : "Edit Images"}
            </FloorButton>
            <Link href="/community">
              <FloorButton variant="rectangular" className="font-semibold">
                Back
              </FloorButton>
            </Link>
          </div>
        </div>

        {/* Edit Mode Info */}
        {isEditing && (
          <div className="bg-gray-900/50 rounded-lg border border-[#00d4ff]/30 p-4">
            <h3 className="text-white font-semibold mb-2">Editing Mode</h3>
            <p className="text-white/70 text-sm">
              Click &quot;Fetch&quot; to find new images, or &quot;Edit&quot; to remove text/watermarks from existing images.
            </p>
          </div>
        )}

        {/* Examples Grid */}
        {isEditing ? (
          <ExampleImageGrid
            examples={examples}
            categoryName={category.name}
            searchQueryTemplate={category.search_query_template}
            onExampleUpdate={updateExample}
            onImageUpload={handleImageUpload}
            onImageUrlSelect={handleImageUrlSelect}
            isEditable={true}
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {examples.map((example, index) => (
              <div
                key={example.id || index}
                className="bg-gray-800/50 rounded-lg border-2 border-gray-700 overflow-hidden"
              >
                <div className="aspect-square relative">
                  {example.imageUrl ? (
                    <img
                      src={example.imageUrl}
                      alt={example.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-900">
                      <span className="text-gray-500 text-3xl">?</span>
                    </div>
                  )}
                </div>
                <div className="p-2">
                  <p className="text-white text-sm font-medium truncate" title={example.name}>
                    {example.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 border-t border-[#00d4ff]/30 mt-auto">
          <Link href="/community">
            <FloorButton variant="rectangular" className="font-semibold w-full sm:w-auto">
              Back to Community
            </FloorButton>
          </Link>
          <Link href="/presenter">
            <FloorButton variant="rectangular" className="font-semibold w-full sm:w-auto">
              Play The Floor
            </FloorButton>
          </Link>
        </div>
      </div>
    </FloorPageLayout>
  );
}
