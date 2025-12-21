"use client";

import { useState, useEffect } from "react";
import FloorButton from "../FloorButton";

interface ImageResult {
  url: string;
  thumbnail: string;
  title?: string;
}

interface ImageSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (imageUrl: string) => void;
  searchQuery: string;
  currentImageUrl?: string | null;
}

export default function ImageSearchModal({
  isOpen,
  onClose,
  onSelect,
  searchQuery,
  currentImageUrl,
}: ImageSearchModalProps) {
  const [images, setImages] = useState<ImageResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customUrl, setCustomUrl] = useState("");
  const [showCustomUrl, setShowCustomUrl] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && searchQuery) {
      searchImages();
    }
  }, [isOpen, searchQuery]);

  const searchImages = async () => {
    setLoading(true);
    setError(null);
    setImages([]);

    try {
      const response = await fetch(`/api/search-images?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else if (data.images) {
        setImages(data.images);
      }
    } catch (err) {
      setError("Failed to search for images");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = () => {
    const urlToUse = showCustomUrl ? customUrl : selectedImage;
    if (urlToUse) {
      onSelect(urlToUse);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg border-2 border-[#00d4ff] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-[#00d4ff]/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h3 className="text-xl font-bold text-white">Select Image</h3>
          <div className="flex flex-wrap gap-2">
            <FloorButton
              variant="rectangular"
              className="text-sm font-semibold"
              onClick={() => setShowCustomUrl(!showCustomUrl)}
            >
              {showCustomUrl ? "Search Results" : "Use URL"}
            </FloorButton>
            <FloorButton
              variant="rectangular"
              className="text-sm font-semibold"
              onClick={searchImages}
              disabled={loading}
            >
              {loading ? "Searching..." : "Refresh"}
            </FloorButton>
            <FloorButton
              variant="rectangular"
              className="text-sm font-semibold"
              onClick={onClose}
            >
              Cancel
            </FloorButton>
          </div>
        </div>

        {/* Search info */}
        <div className="p-4 bg-gray-800/50 border-b border-[#00d4ff]/30">
          <p className="text-white/70 text-sm">
            Searching for: <span className="text-[#00d4ff] font-semibold">{searchQuery}</span>
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {showCustomUrl ? (
            <div className="space-y-4">
              <label className="block">
                <span className="text-white mb-2 block">Paste image URL:</span>
                <input
                  type="url"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full bg-gray-800 text-white p-3 rounded-md border-2 border-[#00d4ff] focus:outline-none focus:ring-2 focus:ring-[#00d4ff]"
                />
              </label>
              {customUrl && (
                <div className="mt-4">
                  <p className="text-white/70 text-sm mb-2">Preview:</p>
                  <img
                    src={customUrl}
                    alt="Preview"
                    className="max-w-full max-h-64 object-contain rounded-md border-2 border-[#00d4ff]"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>
          ) : (
            <>
              {loading && (
                <div className="text-center py-8">
                  <div className="animate-spin h-10 w-10 border-4 border-[#00d4ff] border-t-transparent rounded-full mx-auto"></div>
                  <p className="text-white/70 mt-4">Searching for images...</p>
                </div>
              )}

              {error && (
                <div className="text-center py-8">
                  <p className="text-red-400">{error}</p>
                  <FloorButton
                    variant="rectangular"
                    className="mt-4 text-sm font-semibold"
                    onClick={searchImages}
                  >
                    Try Again
                  </FloorButton>
                </div>
              )}

              {!loading && !error && images.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-white/70">No images found. Try a different search or use a custom URL.</p>
                </div>
              )}

              {!loading && images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {images.map((image, index) => (
                    <div
                      key={index}
                      className={`relative cursor-pointer rounded-md overflow-hidden border-2 transition-all ${
                        selectedImage === image.url
                          ? "border-[#ffd700] shadow-[0_0_15px_rgba(255,215,0,0.5)]"
                          : "border-gray-700 hover:border-[#00d4ff]"
                      }`}
                      onClick={() => setSelectedImage(image.url)}
                    >
                      <img
                        src={image.thumbnail || image.url}
                        alt={image.title || `Image ${index + 1}`}
                        className="w-full h-32 object-cover"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder-image.png";
                        }}
                      />
                      {selectedImage === image.url && (
                        <div className="absolute top-1 right-1 bg-[#ffd700] text-black rounded-full w-6 h-6 flex items-center justify-center">
                          ✓
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#00d4ff]/30 flex justify-end gap-3">
          <FloorButton
            variant="rectangular"
            className="font-semibold"
            onClick={onClose}
          >
            Cancel
          </FloorButton>
          <FloorButton
            variant="rectangular"
            className="font-semibold"
            onClick={handleSelect}
            disabled={showCustomUrl ? !customUrl : !selectedImage}
          >
            Use Selected Image
          </FloorButton>
        </div>
      </div>
    </div>
  );
}
