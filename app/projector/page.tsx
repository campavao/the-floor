"use client";
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Category, FLOOR_DATA, FloorData, GameDetails } from "../data";
import classNames from "classnames";
import { PROJECTOR_MESSAGE_TYPE } from "../presenter/page";
import Round from "./round";
import { useLocalStorage } from "usehooks-ts";
import confetti from "canvas-confetti";
import FloorPageLayout from "../components/FloorPageLayout";
import FloorButton from "../components/FloorButton";

interface Round {
  category: Category;
  challenger: FloorData;
  defender: FloorData;
}

export function Projector() {
  const [mounted, setMounted] = useState(false);

  const [gameDetails, setGameDetails, removeGameDetails] = useLocalStorage<
    GameDetails | undefined
  >("the-floor-data", undefined);

  const [selectedFloorPiece, setSelectedFloorPiece] = useLocalStorage<
    FloorData | undefined
  >("the-floor-selected-floor-piece", undefined);

  const [round, setRound] = useLocalStorage<Round | undefined>(
    "the-floor-round",
    undefined
  );

  const [isRandomizing, setIsRandomizing] = useState(false);

  // Ensure we only render after hydration to avoid mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const onRestart = useCallback(() => {
    removeGameDetails();
    setSelectedFloorPiece(undefined);
    setRound(undefined);
  }, [removeGameDetails, setSelectedFloorPiece, setRound]);

  const randomizeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const randomizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const finalSelectedPieceRef = useRef<FloorData | null>(null);

  const onRandomize = useCallback(() => {
    setIsRandomizing(true);

    // Clear any existing randomize timers
    if (randomizeIntervalRef.current) {
      clearInterval(randomizeIntervalRef.current);
    }
    if (randomizeTimeoutRef.current) {
      clearTimeout(randomizeTimeoutRef.current);
    }

    const unrandomizedPieces =
      gameDetails?.data?.filter((piece) => !piece.hasPlayed) ?? [];

    if (unrandomizedPieces.length === 0) {
      setIsRandomizing(false);
      return;
    }

    // Start interval that picks a random piece every second
    randomizeIntervalRef.current = setInterval(() => {
      const randomFloorPiece =
        unrandomizedPieces[
          Math.floor(Math.random() * unrandomizedPieces.length)
        ];
      if (randomFloorPiece) {
        finalSelectedPieceRef.current = randomFloorPiece;
        setSelectedFloorPiece(randomFloorPiece);
      }
    }, 250);

    // Random duration between 4 and 6 seconds
    const randomDuration = 2000 + Math.random() * 2000; // 4000-6000ms

    // After random duration, stop the interval and mark the final piece as randomized
    randomizeTimeoutRef.current = setTimeout(() => {
      if (randomizeIntervalRef.current) {
        clearInterval(randomizeIntervalRef.current);
        randomizeIntervalRef.current = null;
      }

      const finalPiece = finalSelectedPieceRef.current;
      if (finalPiece) {
        setIsRandomizing(false);
        setGameDetails((prev) => {
          return {
            ...prev,
            data:
              prev?.data?.map((piece) => ({
                ...piece,
                hasPlayed:
                  piece.person === finalPiece.person ? true : piece.hasPlayed,
              })) ?? [],
          };
        });
      }
    }, randomDuration);
  }, [gameDetails, setSelectedFloorPiece, setGameDetails]);

  useEffect(() => {
    const channel = new BroadcastChannel("the-floor-projector");
    channel.addEventListener("message", (event) => {
      switch (event.data.type) {
        case PROJECTOR_MESSAGE_TYPE.RANDOMIZER:
          onRandomize();
          break;
        case PROJECTOR_MESSAGE_TYPE.GO_BACK_TO_FLOOR:
          setSelectedFloorPiece(undefined);
          break;
        case PROJECTOR_MESSAGE_TYPE.RESTART:
          onRestart();
          break;
        default:
          console.warn("Unknown message type", event.data.type);
          break;
      }
    });

    // Cleanup on unmount
    return () => {
      if (randomizeIntervalRef.current) {
        clearInterval(randomizeIntervalRef.current);
      }
      if (randomizeTimeoutRef.current) {
        clearTimeout(randomizeTimeoutRef.current);
      }

      channel.close();
    };
  }, [onRestart, onRandomize]);

  const highlightedFloorPieceCategories = useMemo(() => {
    const allSelectedFloorPieces =
      gameDetails?.data
        ?.map((piece: FloorData, index: number) => {
          const isSameCategory =
            piece.category === selectedFloorPiece?.category;
          const isSamePerson = piece.person === selectedFloorPiece?.person;
          const isValid = isSameCategory && isSamePerson;

          return isValid ? index : null;
        })
        .filter((index) => index != null) ?? [];

    if (allSelectedFloorPieces.length === 0) return [];

    const highlightedFloorPieceCategories = allSelectedFloorPieces
      .flatMap((index) =>
        getHighlightedFloorPieceCategories(
          index,
          selectedFloorPiece?.person ?? "",
          gameDetails?.data ?? []
        )
      )
      // Filter out selected piece if it's in the highlighted categories
      .filter((category) => category !== selectedFloorPiece?.category);

    return highlightedFloorPieceCategories;
  }, [selectedFloorPiece, gameDetails]);

  const onSelectOrMerge = (
    winner: FloorData,
    loser: FloorData,
    newCategory: Category
  ) => {
    const newWinnerPiece = {
      ...winner,
      hasPlayed: true,
      category: newCategory,
    };

    const newFloorPieces =
      gameDetails?.data?.map((piece: FloorData) => {
        // Overwrite the newly selected floor piece with the winning one (existing piece for now)
        if (
          piece.category === loser.category &&
          piece.person === loser.person
        ) {
          return newWinnerPiece;
        }

        if (
          piece.category === winner.category &&
          piece.person === winner.person
        ) {
          return newWinnerPiece;
        }

        return piece;
      }) ?? [];

    setGameDetails((prev) => {
      return {
        ...prev,
        data: newFloorPieces,
      };
    });
    setSelectedFloorPiece(newWinnerPiece);
    setRound(undefined);
  };

  const onStartRound = useCallback(
    (floorPiece: FloorData) => {
      if (selectedFloorPiece == null) {
        setSelectedFloorPiece(floorPiece);
        return;
      }

      setRound({
        category: floorPiece.category,
        challenger: selectedFloorPiece,
        defender: floorPiece,
      });
    },
    [selectedFloorPiece, setSelectedFloorPiece, setRound]
  );

  const whoIsRemaining = useMemo(
    () =>
      new Set(gameDetails?.data?.map((piece: FloorData) => piece.person) ?? []),
    [gameDetails]
  );

  useEffect(() => {
    if (whoIsRemaining.size === 1) {
      const timeout = setInterval(() => {
        // Confetti
        confetti({
          particleCount: 100,
          spread: 300,
          origin: { y: 0.5 },
        });
      }, 2000);

      return () => clearInterval(timeout);
    }
  }, [whoIsRemaining]);

  if (!gameDetails) {
    return (
      <FloorPageLayout>
        <div className="flex flex-col items-center justify-center h-full text-white text-xl gap-4 font-bold w-full">
          <p className="text-center">Game not found</p>
          <p className="text-center">Go back to start a new game</p>
          <FloorButton
            variant="rectangular"
            className="font-semibold"
            onClick={() => (window.location.href = "/presenter")}
          >
            Go Back
          </FloorButton>
        </div>
      </FloorPageLayout>
    );
  }

  // Don't render until after hydration to avoid mismatch
  if (!mounted) {
    return (
      <FloorPageLayout>
        <div className="grid grid-cols-4 grid-rows-10 h-full p-20 w-full" />
      </FloorPageLayout>
    );
  }

  if (whoIsRemaining.size === 1) {
    return (
      <FloorPageLayout>
        <div className="flex flex-col items-center justify-center h-full text-white text-9xl font-bold w-full">
          <p className="text-center">{Array.from(whoIsRemaining)[0]} wins!</p>
        </div>
      </FloorPageLayout>
    );
  }

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
    <FloorPageLayout>
      <div className="grid grid-cols-4 grid-rows-9 h-full p-20 w-full">
        {gameDetails?.data?.map((floorPiece: FloorData, index: number) => {
          const isSameCategoryAndPerson =
            selectedFloorPiece?.category === floorPiece.category &&
            selectedFloorPiece?.person === floorPiece.person;

          const isHighlighted = highlightedFloorPieceCategories.includes(
            floorPiece.category
          );

          return (
            <FloorPiece
              key={floorPiece.category + "-" + index}
              floorPiece={floorPiece}
              isSelected={isSameCategoryAndPerson}
              isHighlighted={!isRandomizing && isHighlighted}
              isRandomizing={isRandomizing}
              onSelect={onStartRound}
              selectedFloorPiece={selectedFloorPiece}
            />
          );
        })}
      </div>
    </FloorPageLayout>
  );
}

function FloorPiece({
  floorPiece,
  isSelected,
  isRandomizing = false,
  isHighlighted = isRandomizing,
  onSelect,
  selectedFloorPiece,
}: {
  floorPiece: FloorData;
  /** Selected floor piece */
  isSelected: boolean;
  /** Highlighted floor piece surrounding the selected floor piece */
  isHighlighted: boolean;

  isRandomizing: boolean;
  onSelect: (floorPiece: FloorData) => void;
  selectedFloorPiece?: FloorData;
}) {
  const onClick = () => {
    if (!isHighlighted && selectedFloorPiece) return;

    onSelect(floorPiece);
  };

  return (
    <button
      className={classNames(
        "flex flex-col items-center justify-center border border-white font-bold h-20 min-h-20",
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
      {/* <p>{floorPiece.category}</p> */}
      {(isSelected || isHighlighted) && !isRandomizing && (
        <p>{floorPiece.category}</p>
      )}
    </button>
  );
}

const getHighlightedFloorPieceCategories = (
  selectedIndex: number,
  selectedPerson: string,
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
    .filter((index) => floorPieces[index]?.person !== selectedPerson)
    .map((index) => floorPieces[index])
    .map((piece) => piece?.category);
};

export default function ProjectorPage({ params }: { params: Promise<any> }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Projector />
    </Suspense>
  );
}
