"use client";

import { useEffect, useMemo, useState } from "react";
import { Category, CATEGORY_METADATA } from "../data";
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
}

export default function PresenterPage({
  params,
  searchParams,
}: {
  params: Promise<any>;
  searchParams: Promise<any>;
}) {
  const [currentRoundExample, setCurrentRoundExample] = useState<{
    name: string;
    image: string;
    alternatives: string[];
  }>();
  const [selectedCategory, setSelectedCategory] = useState<Category>();
  const [selectedExampleIndex, setSelectedExampleIndex] = useState<number>(0);
  const [roundState, setRoundState] = useState<REVEAL_STATE | undefined>();
  const [debugExamples, setDebugExamples] = useState<
    {
      name: string;
      image: string;
      alternatives: string[];
    }[]
  >();

  const examples = useMemo(() => {
    if (selectedCategory == null) {
      return [];
    }

    if (debugExamples) {
      return debugExamples;
    }

    return CATEGORY_METADATA[selectedCategory].examples;
  }, [selectedCategory, debugExamples]);

  const channel = new BroadcastChannel("the-floor-projector");

  const openProjector = () => {
    window.open("/projector", "projector", "fullscreen=yes");
  };

  const openDebugWindow = () => {
    window.open("/projector?debug=true", "debug", "fullscreen=yes");
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

  const triggerFinishRound = () => {
    channel.postMessage({ type: PROJECTOR_MESSAGE_TYPE.FINISH_ROUND });
    setCurrentRoundExample(undefined);
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
          setCurrentRoundExample(event.data.example);
          setSelectedExampleIndex(event.data.selectedExampleIndex);
          setSelectedCategory(event.data.category);
          setRoundState(event.data.state);
          setDebugExamples(event.data.debugExamples);
          break;
        default:
          console.warn("Unknown message type", event.data.type);
          break;
      }
    });
  }, []);

  return (
    <div className="text-white p-20">
      <h1>Presenter Mode</h1>

      <div className="flex flex-row gap-2">
        <button
          className="bg-blue-500 text-white p-2 rounded-md"
          onClick={openProjector}
        >
          Open Projector Window
        </button>
        <button
          className="bg-blue-500 text-white p-2 rounded-md"
          onClick={openDebugWindow}
        >
          Open Debug Window
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

      {roundState && (
        <div className="flex flex-col gap-2 mt-20">
          <h3 className="text-2xl font-bold">Round Controls</h3>
          <div className="flex flex-row gap-2">
            {roundState === REVEAL_STATE.NOT_STARTED && (
              <button
                className="bg-blue-500 text-white p-2 rounded-md cursor-pointer"
                onClick={() => triggerStartRound()}
              >
                Start Round
              </button>
            )}
            {roundState === REVEAL_STATE.FINISHED && (
              <button
                className="bg-blue-500 text-white p-2 rounded-md cursor-pointer"
                onClick={() => triggerFinishRound()}
              >
                Finish Round
              </button>
            )}
            {roundState !== REVEAL_STATE.FINISHED &&
              roundState !== REVEAL_STATE.NOT_STARTED && (
                <>
                  <button
                    className="bg-red-500 text-white p-2 rounded-md cursor-pointer"
                    onClick={() => triggerPassRound()}
                    disabled={
                      roundState === REVEAL_STATE.PASSED ||
                      roundState === REVEAL_STATE.REVEALED
                    }
                  >
                    Pass Round
                  </button>
                  <button
                    className="bg-green-500 text-white p-2 rounded-md cursor-pointer"
                    onClick={() => triggerRevealRound()}
                    disabled={
                      roundState === REVEAL_STATE.REVEALED ||
                      roundState === REVEAL_STATE.PASSED
                    }
                  >
                    Reveal Round
                  </button>
                </>
              )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-2">
              <p className="text-lg text-white">
                Current Answer:{" "}
                <span className="font-bold">{currentRoundExample?.name}</span>
              </p>
              <p className="text-lg text-white">
                Example #: {selectedExampleIndex}
              </p>
              <p className="text-lg text-white">
                Total # of Examples: {examples?.length}
              </p>

              <p className="text-lg text-white">
                Alternatives: {currentRoundExample?.alternatives.join(", ")}
              </p>
            </div>

            {selectedCategory && (
              <div className="text-lg text-white max-h-[45vh]">
                <RoundDisplay
                  examples={examples}
                  selectedExampleIndex={selectedExampleIndex}
                  folder={CATEGORY_METADATA[selectedCategory].folder}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
