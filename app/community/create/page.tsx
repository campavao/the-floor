"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import FloorPageLayout from "../../components/FloorPageLayout";
import FloorButton from "../../components/FloorButton";
import ExampleImageGrid from "../../components/community/ExampleImageGrid";
import Link from "next/link";

interface Example {
  id?: string;
  name: string;
  alternatives: string[];
  imageUrl: string | null;
  imageStatus: "pending" | "uploading" | "uploaded" | "failed";
}

export default function CreateCategoryPage() {
  const router = useRouter();
  const [step, setStep] = useState<"details" | "images">("details");
  
  // Category details
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [searchQueryTemplate, setSearchQueryTemplate] = useState("{name} high resolution photo");
  
  // Examples
  const [examples, setExamples] = useState<Example[]>([]);
  const [exampleInput, setExampleInput] = useState("");
  const [bulkInput, setBulkInput] = useState("");
  const [showBulkInput, setShowBulkInput] = useState(false);
  
  // Category ID (after creation)
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [exampleIds, setExampleIds] = useState<Record<number, string>>({});
  
  // State
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addExample = (name: string) => {
    const trimmedName = name.trim();
    if (!trimmedName) return;
    
    // Check for duplicates
    if (examples.some((e) => e.name.toLowerCase() === trimmedName.toLowerCase())) {
      return;
    }
    
    setExamples([
      ...examples,
      {
        name: trimmedName,
        alternatives: [],
        imageUrl: null,
        imageStatus: "pending",
      },
    ]);
  };

  const handleAddExample = () => {
    addExample(exampleInput);
    setExampleInput("");
  };

  const handleBulkAdd = () => {
    const lines = bulkInput.split("\n").filter((line) => line.trim());
    lines.forEach((line) => addExample(line.trim()));
    setBulkInput("");
    setShowBulkInput(false);
  };

  const removeExample = (index: number) => {
    setExamples(examples.filter((_, i) => i !== index));
  };

  const updateExample = (index: number, updates: Partial<Example>) => {
    setExamples((prev) =>
      prev.map((e, i) => (i === index ? { ...e, ...updates } : e))
    );
  };

  const handleCreateCategory = async () => {
    if (!categoryName.trim() || examples.length === 0) {
      setError("Please provide a category name and at least one example");
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: categoryName.trim(),
          description: description.trim(),
          searchQueryTemplate: searchQueryTemplate.trim(),
          examples: examples.map((e) => ({
            name: e.name,
            alternatives: e.alternatives,
          })),
        }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
        return;
      }

      // Store category ID and example IDs
      setCategoryId(data.category.id);
      
      const ids: Record<number, string> = {};
      if (data.category.examples) {
        data.category.examples.forEach((example: any, index: number) => {
          ids[index] = example.id;
        });
      }
      setExampleIds(ids);

      // Move to images step
      setStep("images");
    } catch (err) {
      setError("Failed to create category. Please try again.");
    } finally {
      setIsCreating(false);
    }
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

  const handleFinish = () => {
    router.push(`/community/${categoryId}`);
  };

  // Step 1: Category Details
  if (step === "details") {
    return (
      <FloorPageLayout>
        <div className="min-h-screen p-4 sm:p-8 md:p-12 flex flex-col gap-6 max-w-4xl mx-auto w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold glow-text" style={{ color: "#00d4ff" }}>
                Create New Category
              </h1>
              <p className="text-white/70 mt-1">Step 1: Define your category</p>
            </div>
            <Link href="/community">
              <FloorButton variant="rectangular" className="font-semibold">
                Cancel
              </FloorButton>
            </Link>
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-500 rounded-lg p-4 text-red-300">
              {error}
            </div>
          )}

          {/* Category Details Form */}
          <div className="bg-gray-900/50 rounded-lg border-2 border-[#00d4ff] p-4 sm:p-6 space-y-4">
            <div>
              <label className="block text-white font-semibold mb-2">
                Category Name *
              </label>
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="e.g., 90s Sitcoms, Famous Scientists, Video Game Consoles"
                className="w-full bg-gray-800 text-white p-3 rounded-md border-2 border-[#00d4ff]/50 focus:border-[#00d4ff] focus:outline-none focus:ring-2 focus:ring-[#00d4ff]/30"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of what this category contains..."
                rows={2}
                className="w-full bg-gray-800 text-white p-3 rounded-md border-2 border-[#00d4ff]/50 focus:border-[#00d4ff] focus:outline-none focus:ring-2 focus:ring-[#00d4ff]/30"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">
                Image Search Template
              </label>
              <input
                type="text"
                value={searchQueryTemplate}
                onChange={(e) => setSearchQueryTemplate(e.target.value)}
                placeholder="{name} high resolution photo"
                className="w-full bg-gray-800 text-white p-3 rounded-md border-2 border-[#00d4ff]/50 focus:border-[#00d4ff] focus:outline-none focus:ring-2 focus:ring-[#00d4ff]/30"
              />
              <p className="text-white/50 text-sm mt-1">
                Use {"{name}"} as a placeholder for each example name. E.g., &quot;{"{name}"} movie poster&quot;
              </p>
            </div>
          </div>

          {/* Examples Section */}
          <div className="bg-gray-900/50 rounded-lg border-2 border-[#00d4ff] p-4 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <h2 className="text-xl font-semibold text-white">Examples *</h2>
                <p className="text-white/60 text-sm">Add items that belong in this category</p>
              </div>
              <button
                onClick={() => setShowBulkInput(!showBulkInput)}
                className="text-[#00d4ff] text-sm hover:underline"
              >
                {showBulkInput ? "Single input" : "Bulk add"}
              </button>
            </div>

            {showBulkInput ? (
              <div className="space-y-2">
                <textarea
                  value={bulkInput}
                  onChange={(e) => setBulkInput(e.target.value)}
                  placeholder="Enter one example per line:&#10;Example 1&#10;Example 2&#10;Example 3"
                  rows={6}
                  className="w-full bg-gray-800 text-white p-3 rounded-md border-2 border-[#00d4ff]/50 focus:border-[#00d4ff] focus:outline-none focus:ring-2 focus:ring-[#00d4ff]/30"
                />
                <FloorButton
                  variant="rectangular"
                  className="font-semibold"
                  onClick={handleBulkAdd}
                  disabled={!bulkInput.trim()}
                >
                  Add All
                </FloorButton>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={exampleInput}
                  onChange={(e) => setExampleInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddExample()}
                  placeholder="Enter an example..."
                  className="flex-1 bg-gray-800 text-white p-3 rounded-md border-2 border-[#00d4ff]/50 focus:border-[#00d4ff] focus:outline-none focus:ring-2 focus:ring-[#00d4ff]/30"
                />
                <FloorButton
                  variant="rectangular"
                  className="font-semibold"
                  onClick={handleAddExample}
                  disabled={!exampleInput.trim()}
                >
                  Add
                </FloorButton>
              </div>
            )}

            {/* Examples List */}
            {examples.length > 0 && (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {examples.map((example, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-800 p-3 rounded-md group"
                  >
                    <span className="text-white">{example.name}</span>
                    <button
                      onClick={() => removeExample(index)}
                      className="text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            <p className="text-white/50 text-sm">
              {examples.length} example{examples.length !== 1 ? "s" : ""} added
              {examples.length < 5 && " (minimum 5 recommended)"}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end pt-4">
            <Link href="/community">
              <FloorButton variant="rectangular" className="font-semibold w-full sm:w-auto">
                Cancel
              </FloorButton>
            </Link>
            <FloorButton
              variant="rectangular"
              className="font-semibold w-full sm:w-auto"
              onClick={handleCreateCategory}
              disabled={isCreating || !categoryName.trim() || examples.length === 0}
            >
              {isCreating ? "Creating..." : "Continue to Images →"}
            </FloorButton>
          </div>
        </div>
      </FloorPageLayout>
    );
  }

  // Step 2: Add Images
  return (
    <FloorPageLayout>
      <div className="min-h-screen p-4 sm:p-8 md:p-12 flex flex-col gap-6 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold glow-text" style={{ color: "#00d4ff" }}>
              Add Images
            </h1>
            <p className="text-white/70 mt-1">Step 2: Find and edit images for each example</p>
          </div>
          <FloorButton
            variant="rectangular"
            className="font-semibold"
            onClick={handleFinish}
          >
            Finish & View Category
          </FloorButton>
        </div>

        {/* Instructions */}
        <div className="bg-gray-900/50 rounded-lg border border-[#00d4ff]/30 p-4">
          <h3 className="text-white font-semibold mb-2">How to add images:</h3>
          <ol className="text-white/70 text-sm space-y-1 list-decimal list-inside">
            <li>Click &quot;Fetch&quot; on any example to search for images</li>
            <li>Select an image from the results or paste a custom URL</li>
            <li>Use &quot;Edit&quot; to paint over and remove any text/watermarks</li>
            <li>The category will auto-publish when all images are ready</li>
          </ol>
        </div>

        {/* Image Grid */}
        <ExampleImageGrid
          examples={examples}
          categoryName={categoryName}
          searchQueryTemplate={searchQueryTemplate}
          onExampleUpdate={updateExample}
          onImageUpload={handleImageUpload}
          onImageUrlSelect={handleImageUrlSelect}
          isEditable={true}
        />

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 border-t border-[#00d4ff]/30">
          <FloorButton
            variant="rectangular"
            className="font-semibold"
            onClick={handleFinish}
          >
            Save & Continue Later
          </FloorButton>
        </div>
      </div>
    </FloorPageLayout>
  );
}
