"use client";
import { useEffect, useMemo, useState } from "react";
import { Category, FLOOR_DATA, FloorData } from "../data";
import classNames from "classnames";
import { PROJECTOR_MESSAGE_TYPE } from "../presenter/page";
import Round from "./round";

interface Round {
  category: Category;
  challenger: FloorData;
  defender: FloorData;
}

export default function Home() {
  const [floorPieces, setFloorPieces] = useState<FloorData[]>(FLOOR_DATA);

  // Randomize after mount to avoid hydration mismatch
  useEffect(() => {
    setFloorPieces([...FLOOR_DATA].sort(() => Math.random() - 0.5));
  }, []);

  const [selectedFloorPiece, setSelectedFloorPiece] =
    useState<FloorData | null>(null);

  const [round, setRound] = useState<Round>();

  useEffect(() => {
    const channel = new BroadcastChannel("the-floor-projector");
    channel.addEventListener("message", (event) => {
      switch (event.data.type) {
        case PROJECTOR_MESSAGE_TYPE.RANDOMIZER:
          const randomFloorPiece = [...floorPieces]
            .filter((piece) => !piece.hasBeenRandomized)
            .sort(() => Math.random() - 0.5)[0];

          setSelectedFloorPiece(randomFloorPiece);
          setFloorPieces((prev) => {
            // If all pieces have been randomized, reset them
            if (prev.every((piece) => piece.hasBeenRandomized)) {
              return [...prev].map((piece) => ({
                ...piece,
                hasBeenRandomized: false,
              }));
            } else {
              // Otherwise, mark the random piece as randomized
              return [...prev].map((piece) =>
                piece.category === randomFloorPiece.category
                  ? { ...piece, hasBeenRandomized: true }
                  : piece
              );
            }
          });
          break;
        case PROJECTOR_MESSAGE_TYPE.GO_BACK_TO_FLOOR:
          setSelectedFloorPiece(null);
          break;
        default:
          console.warn("Unknown message type", event.data.type);
          break;
      }
    });
  }, [floorPieces]);

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

  const onSelectOrMerge = (winner: FloorData, loser: FloorData) => {
    const newFloorPieces = floorPieces.map((piece) => {
      // Overwrite the newly selected floor piece with the winning one (existing piece for now)
      if (piece.category === loser.category) {
        return winner;
      }

      return piece;
    });

    setFloorPieces(newFloorPieces);
    setSelectedFloorPiece(winner);
    setRound(undefined);
  };

  const onStartRound = (floorPiece: FloorData) => {
    if (selectedFloorPiece == null) {
      setSelectedFloorPiece(floorPiece);
      return;
    }

    setRound({
      category: floorPiece.category,
      challenger: selectedFloorPiece,
      defender: floorPiece,
    });
  };

  if (round) {
    return (
      <Round
        category={round.category}
        challenger={round.challenger}
        defender={round.defender}
        onFinish={onSelectOrMerge}
      />
    );
  }

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
            onSelect={onStartRound}
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
      <p>{floorPiece.person}</p>
      <p>{floorPiece.category}</p>
      {/* {(isSelected || isHighlighted) && <p>{floorPiece.category}</p>} */}
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
