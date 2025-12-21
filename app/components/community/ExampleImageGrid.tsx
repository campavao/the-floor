"use client";

import { useState, useEffect } from "react";
import FloorButton from "../FloorButton";
import ImageSearchModal from "./ImageSearchModal";
import ImageEditor from "./ImageEditor";

interface Example {
  id?: string;
  name: string;
  alternatives: string[];
  imageUrl: string | null;
  imageStatus: "pending" | "uploading" | "uploaded" | "failed";
  isSelected?: boolean;
}

interface ExampleImageGridProps {
  examples: Example[];
  categoryName: string;
  searchQueryTemplate: string;
  onExampleUpdate: (index: number, updates: Partial<Example>) => void;
  onImageUpload: (index: number, blob: Blob, fileName: string) => Promise<string | null>;
  onImageUrlSelect: (index: number, url: string) => Promise<string | null>;
  isEditable?: boolean;
}

export default function ExampleImageGrid({
  examples,
  categoryName,
  searchQueryTemplate,
  onExampleUpdate,
  onImageUpload,
  onImageUrlSelect,
  isEditable = true,
}: ExampleImageGridProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [currentSearchQuery, setCurrentSearchQuery] = useState("");

  // Select first example on mount
  useEffect(() => {
    if (examples.length > 0 && selectedIndex >= examples.length) {
      setSelectedIndex(0);
    }
  }, [examples.length, selectedIndex]);

  const selectedExample = examples[selectedIndex];

  const getSearchQuery = (exampleName: string) => {
    return searchQueryTemplate.replace("{name}", exampleName);
  };

  const handleFetchImage = (index: number) => {
    const example = examples[index];
    const query = getSearchQuery(example.name);
    setCurrentSearchQuery(query);
    setSelectedIndex(index);
    setSearchModalOpen(true);
  };

  const handleImageSelect = async (imageUrl: string) => {
    onExampleUpdate(selectedIndex, { imageStatus: "uploading" });
    
    const result = await onImageUrlSelect(selectedIndex, imageUrl);
    
    if (result) {
      onExampleUpdate(selectedIndex, { 
        imageUrl: result, 
        imageStatus: "uploaded" 
      });
    } else {
      onExampleUpdate(selectedIndex, { imageStatus: "failed" });
    }
    
    setSearchModalOpen(false);
  };

  const handleEditImage = (index: number) => {
    setSelectedIndex(index);
    setEditorOpen(true);
  };

  const handleSaveEditedImage = async (blob: Blob) => {
    const example = examples[selectedIndex];
    onExampleUpdate(selectedIndex, { imageStatus: "uploading" });
    
    const result = await onImageUpload(selectedIndex, blob, example.name);
    
    if (result) {
      onExampleUpdate(selectedIndex, { 
        imageUrl: result, 
        imageStatus: "uploaded" 
      });
    } else {
      onExampleUpdate(selectedIndex, { imageStatus: "failed" });
    }
    
    setEditorOpen(false);
  };

  const handleFetchAll = async () => {
    for (let i = 0; i < examples.length; i++) {
      if (!examples[i].imageUrl || examples[i].imageStatus === "pending") {
        handleFetchImage(i);
        break; // Open search for first missing image
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "uploaded": return "text-green-400";
      case "uploading": return "text-yellow-400";
      case "failed": return "text-red-400";
      default: return "text-gray-400";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "uploaded": return "✓ Ready";
      case "uploading": return "⏳ Uploading...";
      case "failed": return "✗ Failed";
      default: return "◯ Pending";
    }
  };

  const uploadedCount = examples.filter(e => e.imageStatus === "uploaded").length;
  const progress = examples.length > 0 ? (uploadedCount / examples.length) * 100 : 0;

  return (
    <div className="space-y-4">
      {/* Progress Bar */}
      <div className="bg-gray-800/50 p-4 rounded-lg border border-[#00d4ff]/30">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
          <div>
            <h4 className="text-white font-semibold">{categoryName}</h4>
            <p className="text-white/60 text-sm">
              {uploadedCount} of {examples.length} images ready
            </p>
          </div>
          {isEditable && uploadedCount < examples.length && (
            <FloorButton
              variant="rectangular"
              className="text-sm font-semibold"
              onClick={handleFetchAll}
            >
              Fetch Next Image
            </FloorButton>
          )}
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className="bg-[#00d4ff] h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {examples.map((example, index) => (
          <div
            key={example.id || index}
            className={`relative bg-gray-800/50 rounded-lg border-2 transition-all cursor-pointer overflow-hidden ${
              selectedIndex === index
                ? "border-[#ffd700] shadow-[0_0_15px_rgba(255,215,0,0.3)]"
                : "border-gray-700 hover:border-[#00d4ff]"
            }`}
            onClick={() => setSelectedIndex(index)}
          >
            {/* Image or Placeholder */}
            <div className="aspect-square relative">
              {example.imageUrl ? (
                <img
                  src={example.imageUrl}
                  alt={example.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-900">
                  <span className="text-gray-500 text-3xl">?</span>
                </div>
              )}
              
              {/* Uploading overlay */}
              {example.imageStatus === "uploading" && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                  <div className="animate-spin h-8 w-8 border-3 border-[#00d4ff] border-t-transparent rounded-full"></div>
                </div>
              )}

              {/* Status indicator */}
              <div className={`absolute top-1 right-1 px-1.5 py-0.5 rounded text-xs font-medium ${getStatusColor(example.imageStatus)} bg-black/70`}>
                {getStatusText(example.imageStatus)}
              </div>
            </div>

            {/* Name and Actions */}
            <div className="p-2">
              <p className="text-white text-sm font-medium truncate" title={example.name}>
                {example.name}
              </p>
              
              {isEditable && (
                <div className="flex gap-1 mt-2">
                  <button
                    className="flex-1 text-xs py-1 px-2 rounded bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFetchImage(index);
                    }}
                  >
                    {example.imageUrl ? "New" : "Fetch"}
                  </button>
                  {example.imageUrl && (
                    <button
                      className="flex-1 text-xs py-1 px-2 rounded bg-green-600 hover:bg-green-500 text-white transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditImage(index);
                      }}
                    >
                      Edit
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Image Search Modal */}
      <ImageSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSelect={handleImageSelect}
        searchQuery={currentSearchQuery}
        currentImageUrl={selectedExample?.imageUrl}
      />

      {/* Image Editor Modal */}
      {selectedExample?.imageUrl && (
        <ImageEditor
          isOpen={editorOpen}
          onClose={() => setEditorOpen(false)}
          onSave={handleSaveEditedImage}
          imageUrl={selectedExample.imageUrl}
          title={selectedExample.name}
        />
      )}
    </div>
  );
}
