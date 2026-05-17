"use client";

import { useEffect, useRef, useState } from "react";
import {
  Category,
  CATEGORY_METADATA,
  ImageExample,
  TextExample,
} from "../data";
import FloorPageLayout from "../components/FloorPageLayout";
import FloorButton from "../components/FloorButton";
import Link from "next/link";

export default function CategoriesPage() {
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<
    Category | undefined
  >(undefined);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter categories based on search query
  const filteredCategories = Object.keys(CATEGORY_METADATA).filter(
    (category) =>
      category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.toLowerCase().includes(searchQuery.toLowerCase())
  ) as Category[];

  useEffect(() => {
    if (selectedCategory && containerRef) {
      containerRef.scrollTop = 0;
    }
  }, [selectedCategory, containerRef]);

  if (selectedCategory) {
    const categoryData = CATEGORY_METADATA[selectedCategory];
    const examples = categoryData.examples;

    return (
      <FloorPageLayout>
        <div className="h-full w-full overflow-hidden p-8 md:p-20 flex flex-col gap-6 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-row items-center justify-between mb-4">
            <h2
              className="text-4xl font-bold glow-text"
              style={{ color: "#00d4ff" }}
            >
              {selectedCategory}
            </h2>
            <FloorButton
              variant="rectangular"
              className="font-semibold"
              onClick={() => setSelectedCategory(undefined)}
            >
              Back to Categories
            </FloorButton>
          </div>

          {/* Category Info */}
          <div className="bg-gray-900/50 p-4 rounded-lg border-2 border-[#00d4ff] mb-6">
            <p className="text-white">
              <span className="font-semibold" style={{ color: "#00d4ff" }}>
                Total Examples:
              </span>{" "}
              {examples.length}
            </p>
          </div>

          {/* Examples Grid */}
          <div
            ref={setContainerRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[70vh] overflow-y-auto"
          >
            {examples.map((item, index) => {
              const isTextExample = "text" in item;
              const isImageExample = "image" in item;

              return (
                <div
                  key={index}
                  className="bg-gray-900/50 p-6 rounded-lg border-2 border-[#00d4ff] flex flex-col gap-4"
                >
                  {isTextExample ? (
                    <div className="flex flex-col gap-3">
                      <div className="bg-gray-800 p-4 rounded-md min-h-[100px] flex items-center justify-center">
                        <p className="text-3xl font-bold text-white text-center">
                          {item.text}
                        </p>
                      </div>
                      <div className="flex flex-col items-center w-full text-center gap-2">
                        <p className="w-full font-white font-bold text-2xl">
                          {item.name}
                        </p>
                        {/* {item.alternatives && item.alternatives.length > 0 && (
                            <p className="text-sm text-white/60">
                                <span
                                className="font-semibold"
                                style={{ color: "#ff6b35" }}
                                >
                                Alternatives:
                                </span>{" "}
                                {item.alternatives.join(", ")}
                            </p>
                            )} */}
                      </div>
                    </div>
                  ) : isImageExample ? (
                    <div className="flex flex-col gap-3">
                      <div className="bg-gray-800 rounded-md overflow-hidden flex items-center justify-center min-h-[200px]">
                        <img
                          src={`/images/${categoryData.folder}/${item.image}`}
                          alt={item.name}
                          className="max-w-full max-h-[200px] object-contain"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <p className="w-full font-white font-bold text-2xl text-center">
                          {item.name}
                        </p>
                        {/* {item.alternatives && item.alternatives.length > 0 && (
                          <p className="text-sm text-white/60">
                            <span
                              className="font-semibold"
                              style={{ color: "#ff6b35" }}
                            >
                              Alternatives:
                            </span>{" "}
                            {item.alternatives.join(", ")}
                          </p>
                        )} */}
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </FloorPageLayout>
    );
  }

  return (
    <FloorPageLayout>
      <div className="h-full w-full overflow-hidden p-8 md:p-20 flex flex-col gap-6 max-w-7xl mx-auto">
        {/* Header */}
        <h1
          className="text-4xl font-bold mb-4 glow-text"
          style={{ color: "#00d4ff" }}
        >
          Categories
        </h1>

        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-900 text-white p-3 rounded-md border-2 border-[#00d4ff] focus:outline-none focus:ring-2 focus:ring-[#00d4ff] focus:ring-offset-2 focus:ring-offset-black"
            style={{ boxShadow: "0 0 10px rgba(0, 212, 255, 0.3)" }}
          />
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[70vh] overflow-y-auto">
          {filteredCategories.length === 0 ? (
            <div className="col-span-full text-center text-white/60 py-8">
              No categories found matching your search
            </div>
          ) : (
            filteredCategories.map((category) => {
              const categoryData = CATEGORY_METADATA[category];
              return (
                <FloorButton
                  key={category}
                  variant="rectangular"
                  className="font-semibold text-base flex flex-col items-center justify-center gap-2 p-8"
                  onClick={() => {
                    setSelectedCategory(category);

                    containerRef?.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    });
                  }}
                >
                  <span className="text-center">{category}</span>
                  <span
                    className="text-xs font-normal"
                    style={{ color: "#00d4ff" }}
                  >
                    {categoryData.examples.length} examples
                  </span>
                </FloorButton>
              );
            })
          )}
        </div>

        {/* Back Button */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 border-t-2 border-[#00d4ff]/30">
          <FloorButton
            variant="rectangular"
            className="font-semibold"
            onClick={() => (window.location.href = "/presenter")}
          >
            Back to Presenter
          </FloorButton>
          <Link href="/" prefetch={false}>
            <FloorButton variant="rectangular" className="font-semibold">
              About This Game
            </FloorButton>
          </Link>
          <Link href="/categories/contribute" prefetch={false}>
            <FloorButton variant="rectangular" className="font-semibold">
              How to Add More Categories
            </FloorButton>
          </Link>
        </div>
      </div>
    </FloorPageLayout>
  );
}
