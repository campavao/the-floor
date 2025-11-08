"use client";
import { useMemo, useState } from "react";
import { FLOOR_DATA, FloorData } from "./data";
import classNames from "classnames";

export default function Home() {
  const [floorPieces, setFloorPieces] = useState<FloorData[]>(FLOOR_DATA);
  const [selectedFloorPiece, setSelectedFloorPiece] =
    useState<FloorData | null>(null);

  const highlightedFloorPieceCategories = useMemo(() => {
    const allSelectedFloorPieces = floorPieces
      .map((piece, index) =>
        piece.category === selectedFloorPiece?.category ? index : null
      )
      .filter((index) => index !== null);

    if (allSelectedFloorPieces.length === 0) return [];

    const highlightedFloorPieceCategories = allSelectedFloorPieces
      .flatMap((index) =>
        getHighlightedFloorPieceCategories(index, floorPieces)
      )
      // Filter out selected piece if it's in the highlighted categories
      .filter((category) => category !== selectedFloorPiece?.category);

    return highlightedFloorPieceCategories;
  }, [selectedFloorPiece, floorPieces]);

  const onSelectOrMerge = (floorPiece: FloorData) => {
    if (selectedFloorPiece == null) {
      setSelectedFloorPiece(floorPiece);
      return;
    }

    console.log(floorPiece.category);
    console.log(selectedFloorPiece.category);

    const newFloorPieces = floorPieces.map((piece) => {
      // Overwrite the newly selected floor piece with the winning one (existing piece for now)
      if (piece.category === floorPiece.category) {
        return selectedFloorPiece;
      }

      return piece;
    });
    setFloorPieces(newFloorPieces);
    setSelectedFloorPiece(null);
  };

  return (
    <main className="w-full h-screen">
      <div className="grid grid-cols-4 grid-rows-8 h-full p-20">
        {floorPieces.map((floorPiece, index) => (
          <FloorPiece
            key={floorPiece.category + "-" + index}
            floorPiece={floorPiece}
            isSelected={selectedFloorPiece?.category === floorPiece.category}
            isHighlighted={highlightedFloorPieceCategories.includes(
              floorPiece.category
            )}
            onSelect={onSelectOrMerge}
            selectedFloorPiece={selectedFloorPiece}
          />
        ))}
      </div>
    </main>
  );
}

function FloorPiece({
  floorPiece,
  isSelected,
  isHighlighted,
  onSelect,
  selectedFloorPiece,
}: {
  floorPiece: FloorData;
  /** Selected floor piece */
  isSelected: boolean;
  /** Highlighted floor piece surrounding the selected floor piece */
  isHighlighted: boolean;

  onSelect: (floorPiece: FloorData) => void;
  selectedFloorPiece: FloorData | null;
}) {
  const onClick = () => {
    if (!isHighlighted && selectedFloorPiece) return;

    onSelect(floorPiece);
  };

  return (
    <button
      className={classNames(
        "flex flex-col items-center justify-center border border-white font-bold",
        {
          "bg-blue-100 text-black": isSelected,
          "bg-blue-400": isHighlighted,
          "text-white": !isSelected && !isHighlighted,
          "border-yellow-500 border-2": isHighlighted,
        }
      )}
      onClick={onClick}
    >
      <h2>{floorPiece.person}</h2>
      {(isSelected || isHighlighted) && <p>{floorPiece.category}</p>}
    </button>
  );
}

const getHighlightedFloorPieceCategories = (
  selectedIndex: number,
  floorPieces: FloorData[]
): string[] => {
  if (selectedIndex === -1) return [];

  const COLS = 4;
  const adjacentIndices: number[] = [];

  // Above
  if (selectedIndex >= COLS) {
    adjacentIndices.push(selectedIndex - COLS);
  }

  // Below
  if (selectedIndex < floorPieces.length - COLS) {
    adjacentIndices.push(selectedIndex + COLS);
  }

  // Left (check we're not on the left edge)
  if (selectedIndex % COLS !== 0) {
    adjacentIndices.push(selectedIndex - 1);
  }

  // Right (check we're not on the right edge)
  if (selectedIndex % COLS !== COLS - 1) {
    adjacentIndices.push(selectedIndex + 1);
  }

  return adjacentIndices
    .map((index) => floorPieces[index])
    .map((piece) => piece.category);
};
