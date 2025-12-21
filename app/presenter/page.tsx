"use client";

import { useEffect, useMemo, useState } from "react";
import { Category, CATEGORY_METADATA, FloorData, GameDetails } from "../data";
import { REVEAL_STATE, RoundDisplay } from "../projector/round";
import FloorButton from "../components/FloorButton";
import FloorPageLayout from "../components/FloorPageLayout";
import { useLocalStorage } from "usehooks-ts";
import Link from "next/link";

export enum PROJECTOR_MESSAGE_TYPE {
  RANDOMIZER = "RANDOMIZER",
  GO_BACK_TO_FLOOR = "GO_BACK_TO_FLOOR",
  RESTART = "RESTART",
  START_ROUND = "START_ROUND",
  FINISH_ROUND = "FINISH_ROUND",
  PASS_ROUND = "PASS_ROUND",
  REVEAL_ROUND = "REVEAL_ROUND",
}

export enum PRESENTER_MESSAGE_TYPE {
  SET_CURRENT_ROUND_EXAMPLE = "SET_CURRENT_ROUND_EXAMPLE",
  END_ROUND = "END_ROUND",
}

export default function PresenterPage({
  params,
  searchParams,
}: {
  params: Promise<any>;
  searchParams: Promise<any>;
}) {
  const [projectorWindow, setProjectorWindow] = useState<Window | null>(null);
  const [roundDetails, setRoundDetails] = useState<{
    category: Category;
    challenger: FloorData;
    defender: FloorData;
    exampleIndex: number;
    roundState: REVEAL_STATE;
    example: {
      name: string;
      image: string;
      alternatives: string[];
    };
  }>();
  const [gameDetails, setGameDetails] = useState<GameDetails | undefined>(
    undefined
  );
  const [liveGameDetails, setLiveGameDetails] = useLocalStorage<
    GameDetails | undefined
  >("the-floor-data", undefined);

  // Game setup state
  const [searchQuery, setSearchQuery] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [newPlayerCategory, setNewPlayerCategory] = useState<
    Category | undefined
  >(undefined);
  const [editPlayerName, setEditPlayerName] = useState("");
  const [editPlayerCategory, setEditPlayerCategory] = useState<
    Category | undefined
  >(undefined);

  const [demoDetails, setDemoDetails] = useState<{
    category: Category;
  }>();

  const [debugExamples, setDebugExamples] = useState<
    {
      name: string;
      image: string;
      alternatives: string[];
    }[]
  >();

  const desktopPlayWarning = (
    <div
      className="w-full bg-yellow-500/10 border-2 border-yellow-400/80 rounded-lg p-4 text-yellow-100"
      style={{ boxShadow: "0 0 20px rgba(234, 179, 8, 0.15)" }}
    >
      <p className="font-bold">Desktop required to play.</p>
      <p className="text-sm text-yellow-100/90 mt-1">
        The presenter opens a separate projector window and uses multiple
        windows/pop-ups, so gameplay isn’t supported on mobile.
      </p>
    </div>
  );

  const examples = useMemo(() => {
    if (roundDetails?.category == null) {
      return [];
    }

    if (debugExamples) {
      return debugExamples;
    }

    return CATEGORY_METADATA[roundDetails.category].examples;
  }, [roundDetails?.category, debugExamples]);

  const channel = new BroadcastChannel("the-floor-projector");

  const openProjector = () => {
    const newWindow = window.open("/projector", "projector", "fullscreen=yes");
    if (newWindow) {
      if (projectorWindow) {
        projectorWindow.close();
      }

      setProjectorWindow(newWindow);
    }
  };

  const triggerStartDemoRound = () => {
    const newWindow = window.open(
      `/demo?category=${demoDetails?.category}`,
      "debug",
      "fullscreen=yes"
    );

    setDemoDetails(undefined);

    if (newWindow) {
      if (projectorWindow) {
        projectorWindow.close();
      }

      setProjectorWindow(newWindow);
    }
  };

  const triggerRandomizer = () => {
    channel.postMessage({ type: PROJECTOR_MESSAGE_TYPE.RANDOMIZER });
  };

  const triggerGoBackToFloor = () => {
    channel.postMessage({ type: PROJECTOR_MESSAGE_TYPE.GO_BACK_TO_FLOOR });
  };

  const triggerStartRound = () => {
    channel.postMessage({ type: PROJECTOR_MESSAGE_TYPE.START_ROUND });
  };

  const triggerFinishRound = (forceWin?: "challenger" | "defender") => {
    channel.postMessage({
      type: PROJECTOR_MESSAGE_TYPE.FINISH_ROUND,
      forceWin,
    });

    setRoundDetails(undefined);
  };

  const triggerPassRound = () => {
    channel.postMessage({ type: PROJECTOR_MESSAGE_TYPE.PASS_ROUND });
  };

  const triggerRevealRound = () => {
    channel.postMessage({ type: PROJECTOR_MESSAGE_TYPE.REVEAL_ROUND });
  };

  const triggerRestart = () => {
    channel.postMessage({ type: PROJECTOR_MESSAGE_TYPE.RESTART });
  };

  useEffect(() => {
    const channel = new BroadcastChannel("the-floor-presenter");
    channel.addEventListener("message", (event) => {
      switch (event.data.type) {
        case PRESENTER_MESSAGE_TYPE.SET_CURRENT_ROUND_EXAMPLE:
          setRoundDetails({
            category: event.data.category,
            challenger: event.data.challenger,
            defender: event.data.defender,
            exampleIndex: event.data.selectedExampleIndex,
            roundState: event.data.state,
            example: event.data.example,
          });
          break;
        case PRESENTER_MESSAGE_TYPE.END_ROUND:
          setRoundDetails(undefined);
          break;
        default:
          console.warn("Unknown message type", event.data.type);
          break;
      }
    });

    return () => {
      channel.close();
    };
  }, []);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Only handle keyboard shortcuts when in round mode
      if (!roundDetails) return;

      // Check if we're in a state where buttons are visible
      if (
        roundDetails.roundState === REVEAL_STATE.FINISHED ||
        roundDetails.roundState === REVEAL_STATE.NOT_STARTED
      ) {
        return;
      }

      // Handle "1" key for Pass
      if (event.key === "1") {
        const isDisabled =
          roundDetails.roundState === REVEAL_STATE.PASSED ||
          roundDetails.roundState === REVEAL_STATE.REVEALED;
        if (!isDisabled) {
          triggerPassRound();
        }
      }

      // Handle "2" key for Correct
      if (event.key === "2") {
        const isDisabled =
          roundDetails.roundState === REVEAL_STATE.REVEALED ||
          roundDetails.roundState === REVEAL_STATE.PASSED;
        if (!isDisabled) {
          triggerRevealRound();
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [roundDetails]);

  // GAME SETUP
  if (gameDetails) {
    // Get used categories to prevent duplicates
    const usedCategories = new Set(gameDetails.data.map((p) => p.category));

    // Filter players based on search query
    const filteredPlayers = gameDetails.data.filter(
      (player) =>
        player.person.toLowerCase().includes(searchQuery.toLowerCase()) ||
        player.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Get available categories (not used by other players)
    const getAvailableCategories = (currentCategory?: Category) => {
      return Object.keys(CATEGORY_METADATA).filter(
        (cat) => !usedCategories.has(cat as Category) || cat === currentCategory
      ) as Category[];
    };

    const handleAddPlayer = () => {
      if (!newPlayerName.trim() || newPlayerCategory === undefined) return;

      // Check if category is already used
      if (usedCategories.has(newPlayerCategory)) {
        alert("This category is already assigned to another player!");
        return;
      }

      const newPlayer: FloorData = {
        person: newPlayerName.trim(),
        category: newPlayerCategory,
        hasPlayed: false,
        isStillInTheGame: true,
      };

      setGameDetails({
        data: [...gameDetails.data, newPlayer],
      });

      setNewPlayerName("");
      setNewPlayerCategory(undefined);
    };

    const handleUpdatePlayer = (index: number) => {
      if (!editPlayerName.trim() || editPlayerCategory === undefined) return;

      // Check if category is already used by another player
      const currentPlayer = gameDetails.data[index];
      if (
        editPlayerCategory !== currentPlayer.category &&
        usedCategories.has(editPlayerCategory)
      ) {
        alert("This category is already assigned to another player!");
        return;
      }

      const updatedData = [...gameDetails.data];
      updatedData[index] = {
        ...updatedData[index],
        person: editPlayerName.trim(),
        category: editPlayerCategory,
      };

      setGameDetails({ data: updatedData });
      setEditingIndex(null);
    };

    const handleDeletePlayer = (index: number) => {
      const updatedData = gameDetails.data.filter((_, i) => i !== index);
      setGameDetails({ data: updatedData });
      if (editingIndex === index) {
        setEditingIndex(null);
      }
    };

    const handleStartEdit = (index: number) => {
      const player = gameDetails.data[index];
      setEditPlayerName(player.person);
      setEditPlayerCategory(player.category);
      setEditingIndex(index);
    };

    const handleCancelEdit = () => {
      setEditingIndex(null);
      setEditPlayerName("");
      setEditPlayerCategory(undefined);
    };

    return (
      <FloorPageLayout>
        <div className="p-8 md:p-20 flex flex-col gap-6 w-full max-w-7xl mx-auto">
          <h3
            className="text-4xl font-bold mb-4 glow-text"
            style={{ color: "#00d4ff" }}
          >
            Game Setup
          </h3>

          {desktopPlayWarning}

          {/* Search Bar */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search players or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-900 text-white p-3 rounded-md border-2 border-[#00d4ff] focus:outline-none focus:ring-2 focus:ring-[#00d4ff] focus:ring-offset-2 focus:ring-offset-black"
              style={{ boxShadow: "0 0 10px rgba(0, 212, 255, 0.3)" }}
            />
          </div>

          {/* Add New Player Form */}
          <div className="bg-gray-900/50 p-6 rounded-lg border-2 border-[#00d4ff] mb-6">
            <h4
              className="text-2xl font-bold mb-4 glow-text"
              style={{ color: "#00d4ff" }}
            >
              Add New Player
            </h4>
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="Player name"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                className="flex-1 bg-gray-800 text-white p-3 rounded-md border-2 border-[#00d4ff] focus:outline-none focus:ring-2 focus:ring-[#00d4ff]"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddPlayer();
                }}
              />
              <select
                value={newPlayerCategory || ""}
                onChange={(e) =>
                  setNewPlayerCategory(
                    e.target.value ? (e.target.value as Category) : undefined
                  )
                }
                className="flex-1 bg-gray-800 text-white p-3 rounded-md border-2 border-[#00d4ff] focus:outline-none focus:ring-2 focus:ring-[#00d4ff]"
              >
                <option value="">Select category...</option>
                {getAvailableCategories().map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <FloorButton
                variant="rectangular"
                className="font-semibold"
                onClick={handleAddPlayer}
                disabled={
                  !newPlayerName.trim() || newPlayerCategory === undefined
                }
              >
                Add Player
              </FloorButton>
            </div>
          </div>

          {/* Players List */}
          <div className="flex flex-col gap-4 mb-6">
            <h4
              className="text-2xl font-bold glow-text"
              style={{ color: "#00d4ff" }}
            >
              Players ({gameDetails.data.length})
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto">
              {filteredPlayers.length === 0 ? (
                <div className="col-span-full text-center text-white/60 py-8">
                  {searchQuery
                    ? "No players found matching your search"
                    : "No players added yet"}
                </div>
              ) : (
                filteredPlayers.map((player, index) => {
                  const actualIndex = gameDetails.data.indexOf(player);
                  const isEditing = editingIndex === actualIndex;

                  return (
                    <div
                      key={actualIndex}
                      className="bg-gray-900/50 p-4 rounded-lg border-2 border-[#00d4ff] flex flex-col gap-3"
                    >
                      {isEditing ? (
                        <>
                          <input
                            type="text"
                            value={editPlayerName}
                            onChange={(e) => setEditPlayerName(e.target.value)}
                            className="bg-gray-800 text-white p-2 rounded-md border border-[#00d4ff] focus:outline-none focus:ring-2 focus:ring-[#00d4ff]"
                            onKeyDown={(e) => {
                              if (e.key === "Enter")
                                handleUpdatePlayer(actualIndex);
                              if (e.key === "Escape") handleCancelEdit();
                            }}
                          />
                          <select
                            value={editPlayerCategory || ""}
                            onChange={(e) =>
                              setEditPlayerCategory(
                                e.target.value
                                  ? (e.target.value as Category)
                                  : undefined
                              )
                            }
                            className="bg-gray-800 text-white p-2 rounded-md border border-[#00d4ff] focus:outline-none focus:ring-2 focus:ring-[#00d4ff]"
                          >
                            {getAvailableCategories(player.category).map(
                              (category) => (
                                <option key={category} value={category}>
                                  {category}
                                </option>
                              )
                            )}
                          </select>
                          <div className="flex gap-2">
                            <FloorButton
                              variant="rectangular"
                              className="flex-1 text-sm font-semibold"
                              onClick={() => handleUpdatePlayer(actualIndex)}
                            >
                              Save
                            </FloorButton>
                            <FloorButton
                              variant="rectangular"
                              className="flex-1 text-sm font-semibold"
                              onClick={handleCancelEdit}
                            >
                              Cancel
                            </FloorButton>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex flex-col gap-1">
                            <p className="text-xl font-bold text-white">
                              {player.person}
                            </p>
                            <p
                              className="text-sm font-semibold"
                              style={{ color: "#00d4ff" }}
                            >
                              {player.category}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <FloorButton
                              variant="rectangular"
                              className="flex-1 text-sm font-semibold"
                              onClick={() => handleStartEdit(actualIndex)}
                            >
                              Edit
                            </FloorButton>
                            <FloorButton
                              variant="rectangular"
                              className="flex-1 text-sm font-semibold"
                              onClick={() => handleDeletePlayer(actualIndex)}
                            >
                              Delete
                            </FloorButton>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end pt-4 border-t-2 border-[#00d4ff]/30">
            <FloorButton
              variant="rectangular"
              className="font-bold text-lg w-full sm:w-auto"
              onClick={() => setGameDetails(undefined)}
            >
              Cancel
            </FloorButton>
            <FloorButton
              variant="rectangular"
              className="font-bold text-lg w-full sm:w-auto"
              onClick={() => {
                if (gameDetails.data.length === 0) {
                  alert("Please add at least one player to start the game!");
                  return;
                }
                setLiveGameDetails(gameDetails);
                setGameDetails(undefined);
                openProjector();
              }}
              disabled={gameDetails.data.length === 0}
            >
              Start Game
            </FloorButton>
          </div>
        </div>
      </FloorPageLayout>
    );
  }

  // DEMO SETUP
  if (demoDetails) {
    return (
      <FloorPageLayout>
        <div className="p-8 md:p-20 flex flex-col gap-6">
          <h3
            className="text-4xl font-bold mb-6 glow-text"
            style={{ color: "#00d4ff" }}
          >
            Demo Details
          </h3>
          {desktopPlayWarning}
          <label className="text-xl font-bold flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center mb-4">
            <span className="glow-text" style={{ color: "#00d4ff" }}>
              Category:
            </span>
            <select
              onChange={(e) =>
                setDemoDetails({ category: e.target.value as Category })
              }
              value={demoDetails?.category}
              className="w-full sm:w-auto bg-gray-900 text-white p-3 rounded-md border-2 border-[#00d4ff] focus:outline-none focus:ring-2 focus:ring-[#00d4ff] focus:ring-offset-2 focus:ring-offset-black"
              style={{ boxShadow: "0 0 10px rgba(0, 212, 255, 0.3)" }}
            >
              {Object.keys(CATEGORY_METADATA)
                .sort()
                .map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
            </select>
          </label>
          <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6">
            <FloorButton
              variant="rectangular"
              className="font-bold text-lg w-full sm:w-auto"
              onClick={() => setDemoDetails(undefined)}
            >
              Cancel
            </FloorButton>
            <FloorButton
              variant="rectangular"
              className="font-bold text-lg w-full sm:w-auto"
              onClick={triggerStartDemoRound}
            >
              Start
            </FloorButton>
          </div>
        </div>
      </FloorPageLayout>
    );
  }

  // ROUND MODE
  if (roundDetails) {
    return (
      <FloorPageLayout>
        <div className="p-8 md:p-20 flex flex-col gap-6">
          <h3
            className="text-4xl font-bold mb-6 glow-text"
            style={{ color: "#00d4ff" }}
          >
            Round Details
          </h3>
          {desktopPlayWarning}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {roundDetails.roundState === REVEAL_STATE.NOT_STARTED && (
              <FloorButton
                variant="rectangular"
                className="cursor-pointer font-bold text-lg"
                onClick={() => triggerStartRound()}
              >
                Start Round
              </FloorButton>
            )}
            {roundDetails.roundState === REVEAL_STATE.FINISHED && (
              <FloorButton
                variant="rectangular"
                className="cursor-pointer font-bold text-lg"
                onClick={() => triggerFinishRound()}
              >
                Finish Round
              </FloorButton>
            )}
            {roundDetails.roundState !== REVEAL_STATE.FINISHED &&
              roundDetails.roundState !== REVEAL_STATE.NOT_STARTED && (
                <div className="flex flex-col gap-4">
                  <p className="text-xl text-white font-semibold">
                    Use the keyboard to pass or correct the round:
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <FloorButton
                      variant="rectangular"
                      className="cursor-pointer font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      onClick={() => triggerPassRound()}
                      disabled={
                        roundDetails.roundState === REVEAL_STATE.PASSED ||
                        roundDetails.roundState === REVEAL_STATE.REVEALED
                      }
                    >
                      Pass{" "}
                      <code className="ml-2 px-2 py-1 bg-black/30 rounded">
                        [1]
                      </code>
                    </FloorButton>
                    <FloorButton
                      variant="rectangular"
                      className="cursor-pointer font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      onClick={() => triggerRevealRound()}
                      disabled={
                        roundDetails.roundState === REVEAL_STATE.REVEALED ||
                        roundDetails.roundState === REVEAL_STATE.PASSED
                      }
                    >
                      Correct{" "}
                      <code className="ml-2 px-2 py-1 bg-black/30 rounded">
                        [2]
                      </code>
                    </FloorButton>
                  </div>
                </div>
              )}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div
              className="flex flex-col gap-4 bg-gray-900/50 p-6 rounded-lg border-2 border-[#00d4ff]"
              style={{ boxShadow: "0 0 20px rgba(0, 212, 255, 0.2)" }}
            >
              <p className="text-xl text-white">
                Current Answer:{" "}
                <span
                  className="font-bold glow-text"
                  style={{ color: "#00d4ff" }}
                >
                  {roundDetails.example?.name}
                </span>
              </p>
              <p className="text-lg text-white">
                Example #:{" "}
                <span className="font-bold" style={{ color: "#00d4ff" }}>
                  {roundDetails.exampleIndex}
                </span>
              </p>
              <p className="text-lg text-white">
                Total # of Examples:{" "}
                <span className="font-bold" style={{ color: "#00d4ff" }}>
                  {examples?.length}
                </span>
              </p>

              <p className="text-lg text-white">
                Alternatives:{" "}
                <span className="font-semibold" style={{ color: "#ff6b35" }}>
                  {roundDetails.example?.alternatives.join(", ")}
                </span>
              </p>

              <div className="flex flex-row gap-3 mt-4">
                <FloorButton
                  variant="rectangular"
                  className="cursor-pointer font-semibold text-sm flex-1"
                  onClick={() => triggerFinishRound("challenger")}
                >
                  Force Win ({roundDetails.challenger.person})
                </FloorButton>

                <FloorButton
                  variant="rectangular"
                  className="cursor-pointer font-semibold text-sm flex-1"
                  onClick={() => triggerFinishRound("defender")}
                >
                  Force Win ({roundDetails.defender.person})
                </FloorButton>
              </div>
            </div>

            {roundDetails.category && (
              <div
                className="text-lg text-white max-h-[45vh] bg-gray-900/50 p-6 rounded-lg border-2 border-[#00d4ff]"
                style={{ boxShadow: "0 0 20px rgba(0, 212, 255, 0.2)" }}
              >
                <RoundDisplay
                  examples={examples}
                  selectedExampleIndex={roundDetails.exampleIndex}
                  folder={CATEGORY_METADATA[roundDetails.category].folder}
                />
              </div>
            )}
          </div>
        </div>
      </FloorPageLayout>
    );
  }

  if (liveGameDetails) {
    return (
      <FloorPageLayout>
        <div className="p-8 md:p-20 flex flex-col gap-6">
          <h3
            className="text-4xl font-bold mb-6 glow-text"
            style={{ color: "#00d4ff" }}
          >
            Live Game Details
          </h3>
          {desktopPlayWarning}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <FloorButton
              variant="rectangular"
              className="font-semibold"
              onClick={() => triggerRandomizer()}
            >
              Randomizer
            </FloorButton>
            <FloorButton
              variant="rectangular"
              className="font-semibold"
              onClick={() => triggerGoBackToFloor()}
            >
              Go Back to Floor
            </FloorButton>
            <FloorButton
              variant="rectangular"
              className="font-semibold"
              onClick={() => {
                triggerRestart();
                setLiveGameDetails(undefined);
              }}
            >
              End Game
            </FloorButton>
          </div>
        </div>
      </FloorPageLayout>
    );
  }

  return (
    <FloorPageLayout>
      <div className="flex flex-col items-center justify-center gap-6 md:gap-8 p-8 md:p-20">
        {desktopPlayWarning}
        {/* Logo-style title */}
        <div className="text-center mb-8">
          <div className="text-5xl sm:text-7xl md:text-9xl font-black metallic-text mb-4">
            THE FLOOR
          </div>
          <div className="text-base sm:text-lg md:text-2xl text-white/80 font-light mt-4">
            Play The Floor at home
          </div>
        </div>

        {/* Main action button */}
        <div className="mt-8">
          <FloorButton
            variant="square"
            className="font-bold text-xl relative z-10"
            onClick={() => setGameDetails({ data: [] })}
          >
            Start Game
          </FloorButton>
        </div>

        {/* Additional control buttons */}
        <div className="flex flex-col gap-8 mt-8">
          <FloorButton
            variant="rectangular"
            className="font-semibold text-base"
            onClick={() => setDemoDetails({ category: "Apps" })}
          >
            Start Single Round
          </FloorButton>
          <Link
            className="font-semibold text-base text-center"
            href="/categories"
          >
            View available categories
          </Link>
          <Link className="font-semibold text-base text-center" href="/about">
            About this game
          </Link>
        </div>
      </div>
    </FloorPageLayout>
  );
}
