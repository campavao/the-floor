"use client";

import { useEffect, useState } from "react";

export enum PROJECTOR_MESSAGE_TYPE {
  RANDOMIZER = "RANDOMIZER",
  GO_BACK_TO_FLOOR = "GO_BACK_TO_FLOOR",
  START_ROUND = "START_ROUND",
  FINISH_ROUND = "FINISH_ROUND",
  PASS_ROUND = "PASS_ROUND",
  REVEAL_ROUND = "REVEAL_ROUND",
}

export enum PRESENTER_MESSAGE_TYPE {
  SET_CURRENT_ROUND_EXAMPLE = "SET_CURRENT_ROUND_EXAMPLE",
}

export default function PresenterPage() {
  const [currentRoundExample, setCurrentRoundExample] = useState<{
    name: string;
    image: string;
    alternatives: string[];
  }>();
  const [selectedExampleIndex, setSelectedExampleIndex] = useState<number>(0);

  const channel = new BroadcastChannel("the-floor-projector");

  const openProjector = () => {
    window.open("/projector", "projector", "fullscreen=yes");
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

  useEffect(() => {
    const channel = new BroadcastChannel("the-floor-presenter");
    channel.addEventListener("message", (event) => {
      switch (event.data.type) {
        case PRESENTER_MESSAGE_TYPE.SET_CURRENT_ROUND_EXAMPLE:
          setCurrentRoundExample(event.data.example);
          setSelectedExampleIndex(event.data.selectedExampleIndex);
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

      <button
        className="bg-blue-500 text-white p-2 rounded-md"
        onClick={openProjector}
      >
        Open Projector Window
      </button>

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

      <div className="flex flex-col gap-2 mt-20">
        <h3 className="text-2xl font-bold">Round Controls</h3>
        <p className="text-lg text-white">
          Current Answer:{" "}
          <span className="font-bold">{currentRoundExample?.name}</span>
        </p>
        <p className="text-lg text-white">
          Selected Example Index: {selectedExampleIndex}
        </p>
        <p className="text-lg text-white">
          Alternatives: {currentRoundExample?.alternatives.join(", ")}
        </p>
        <div className="flex flex-row gap-2">
          <button
            className="bg-blue-500 text-white p-2 rounded-md"
            onClick={() => triggerStartRound()}
          >
            Start Round
          </button>
          <button
            className="bg-blue-500 text-white p-2 rounded-md"
            onClick={() => triggerFinishRound()}
          >
            Finish Round
          </button>
          <button
            className="bg-red-500 text-white p-2 rounded-md"
            onClick={() => triggerPassRound()}
          >
            Pass Round
          </button>
          <button
            className="bg-green-500 text-white p-2 rounded-md"
            onClick={() => triggerRevealRound()}
          >
            Reveal Round
          </button>
        </div>
      </div>
    </div>
  );
}
