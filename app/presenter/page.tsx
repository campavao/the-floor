"use client";

import { useEffect, useMemo, useState } from "react";
import { Category, CATEGORY_METADATA, FloorData } from "../data";
import { REVEAL_STATE, RoundDisplay } from "../projector/round";

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

  // DEMO SETUP
  if (demoDetails) {
    return (
      <div className="text-white p-20 flex flex-col gap-2">
        <h3 className="text-2xl font-bold">Demo Details</h3>
        <label className="text-lg font-bold flex flex-row justify-between gap-2">
          Category:
          <select
            onChange={(e) =>
              setDemoDetails({ category: e.target.value as Category })
            }
            value={demoDetails?.category}
            className="bg-white text-black p-2 rounded-md"
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
        <div className="flex flex-row justify-between gap-2">
          <button
            className="bg-blue-500 text-white p-2 rounded-md"
            onClick={() => setDemoDetails(undefined)}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white p-2 rounded-md"
            onClick={triggerStartDemoRound}
          >
            Start
          </button>
        </div>
      </div>
    );
  }

  // ROUND MODE
  if (roundDetails) {
    return (
      <div className="text-white p-20 flex flex-col gap-2">
        <h3 className="text-2xl font-bold">Round Details</h3>
        <div className="flex flex-row gap-2">
          {roundDetails.roundState === REVEAL_STATE.NOT_STARTED && (
            <button
              className="bg-blue-500 text-white p-2 rounded-md cursor-pointer"
              onClick={() => triggerStartRound()}
            >
              Start Round
            </button>
          )}
          {roundDetails.roundState === REVEAL_STATE.FINISHED && (
            <button
              className="bg-blue-500 text-white p-2 rounded-md cursor-pointer"
              onClick={() => triggerFinishRound()}
            >
              Finish Round
            </button>
          )}
          {roundDetails.roundState !== REVEAL_STATE.FINISHED &&
            roundDetails.roundState !== REVEAL_STATE.NOT_STARTED && (
              <div>
                <p className="text-lg text-white">
                  Use the keyboard to pass or correct the round:
                </p>
                <div className="flex gap-2">
                  <button
                    className="bg-red-500 text-white p-2 rounded-md cursor-pointer"
                    onClick={() => triggerPassRound()}
                    disabled={
                      roundDetails.roundState === REVEAL_STATE.PASSED ||
                      roundDetails.roundState === REVEAL_STATE.REVEALED
                    }
                  >
                    Pass <code>[1]</code>
                  </button>
                  <button
                    className="bg-green-500 text-white p-2 rounded-md cursor-pointer "
                    onClick={() => triggerRevealRound()}
                    disabled={
                      roundDetails.roundState === REVEAL_STATE.REVEALED ||
                      roundDetails.roundState === REVEAL_STATE.PASSED
                    }
                  >
                    Correct <code>[2]</code>
                  </button>
                </div>
              </div>
            )}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-2">
            <p className="text-lg text-white">
              Current Answer:{" "}
              <span className="font-bold">{roundDetails.example?.name}</span>
            </p>
            <p className="text-lg text-white">
              Example #: {roundDetails.exampleIndex}
            </p>
            <p className="text-lg text-white">
              Total # of Examples: {examples?.length}
            </p>

            <p className="text-lg text-white">
              Alternatives: {roundDetails.example?.alternatives.join(", ")}
            </p>

            <div className="flex flex-row gap-2">
              <button
                className="bg-blue-500 text-white p-2 rounded-md cursor-pointer"
                onClick={() => triggerFinishRound("challenger")}
              >
                Force Win ({roundDetails.challenger.person})
              </button>

              <button
                className="bg-blue-500 text-white p-2 rounded-md cursor-pointer"
                onClick={() => triggerFinishRound("defender")}
              >
                Force Win ({roundDetails.defender.person})
              </button>
            </div>
          </div>

          {roundDetails.category && (
            <div className="text-lg text-white max-h-[45vh]">
              <RoundDisplay
                examples={examples}
                selectedExampleIndex={roundDetails.exampleIndex}
                folder={CATEGORY_METADATA[roundDetails.category].folder}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="text-white p-20">
      <h1>Presenter Mode</h1>

      <div className="flex flex-row gap-2">
        <button
          className="bg-blue-500 text-white p-2 rounded-md"
          onClick={openProjector}
        >
          Start Game
        </button>
        <button
          className="bg-blue-500 text-white p-2 rounded-md"
          onClick={() => setDemoDetails({ category: "Apps" })}
        >
          Start Single Round
        </button>
        <button
          className="bg-blue-500 text-white p-2 rounded-md"
          onClick={() => triggerRestart()}
        >
          Restart
        </button>
      </div>

      <div className="flex flex-col gap-2 mt-20">
        <h3 className="text-2xl font-bold">Floor Controls</h3>
        <button
          className="bg-blue-500 text-white p-2 rounded-md"
          onClick={() => triggerRandomizer()}
        >
          Randomizer
        </button>
        <button
          className="bg-blue-500 text-white p-2 rounded-md"
          onClick={() => triggerGoBackToFloor()}
        >
          Go Back to Floor
        </button>
      </div>
    </div>
  );
}
