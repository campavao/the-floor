/* eslint-disable @next/next/no-img-element */
"use client";
import classNames from "classnames";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Category,
  CATEGORY_METADATA,
  FloorData,
  ImageExample,
  TextExample,
} from "../data";
import {
  PRESENTER_MESSAGE_TYPE,
  PROJECTOR_MESSAGE_TYPE,
} from "../presenter/page";
import { useSound } from "../hooks/useSound";
import { useSearchParams } from "next/navigation";

export enum REVEAL_STATE {
  NOT_STARTED = "NOT_STARTED",
  NOT_REVEALED = "NOT_REVEALED",
  REVEALED = "REVEALED",
  PASSED = "PASSED",
  FINISHED = "FINISHED",
}

export default function Round({
  category,
  challenger,
  defender,
  onFinish,
}: {
  category: Category;
  challenger: FloorData;
  defender: FloorData;
  onFinish: (
    winner: FloorData,
    loser: FloorData,
    newCategory: Category
  ) => void;
}) {
  const { folder, examples: rawExamples } = CATEGORY_METADATA[category];
  const channel = new BroadcastChannel("the-floor-presenter");
  const searchParams = useSearchParams();
  const { playSound, preloadSounds } = useSound();

  const [selectedExampleIndex, setSelectedExampleIndex] = useState(0);

  const [challengerTimeLeft, setChallengerTimeLeft] = useState(45);
  const [defenderTimeLeft, setDefenderTimeLeft] = useState(45);

  const [currentTurn, setCurrentTurn] = useState<"challenger" | "defender">();

  const [countdown, setCountdown] = useState<number | null>(null);

  const [revealExampleName, setRevealExampleName] = useState<REVEAL_STATE>(
    REVEAL_STATE.NOT_STARTED
  );

  const revealExampleNameRef = useRef(revealExampleName);

  const shuffle = (items: any[]) => {
    return items.sort(() => Math.random() - 0.5);
  };

  const examples = useMemo(() => {
    if (searchParams.get("debug") === "true") {
      return shuffle(rawExamples);
    }

    return rawExamples;
  }, [rawExamples, searchParams]);

  useEffect(() => {
    revealExampleNameRef.current = revealExampleName;
  }, [revealExampleName]);

  const onRoundFinish = useCallback(() => {
    if (revealExampleName !== REVEAL_STATE.FINISHED) {
      return;
    }

    const winner =
      challengerTimeLeft > defenderTimeLeft ? challenger : defender;
    const loser = challengerTimeLeft > defenderTimeLeft ? defender : challenger;

    onFinish(winner, loser, challenger.category);

    channel.postMessage({
      type: PRESENTER_MESSAGE_TYPE.SET_CURRENT_ROUND_EXAMPLE,
      category: undefined,
      example: undefined,
      selectedExampleIndex: 0,
      state: REVEAL_STATE.NOT_STARTED,
      debugExamples: undefined,
    });
  }, [
    challenger,
    challengerTimeLeft,
    defender,
    defenderTimeLeft,
    onFinish,
    revealExampleName,
    channel,
  ]);

  const onNext = useCallback(
    async (timeout: number = 1000) => {
      await new Promise((resolve) => setTimeout(resolve, timeout));
      if (examples.length - 1 === selectedExampleIndex) {
        setRevealExampleName(REVEAL_STATE.FINISHED);
        return;
      }

      setRevealExampleName(REVEAL_STATE.NOT_REVEALED);
      setSelectedExampleIndex(selectedExampleIndex + 1);
    },
    [examples, selectedExampleIndex]
  );

  const onPass = useCallback(async () => {
    if (revealExampleName !== REVEAL_STATE.NOT_REVEALED) {
      return;
    }

    setRevealExampleName(REVEAL_STATE.PASSED);
    playSound("incorrect-buzz");
    await onNext(3000);
  }, [onNext, playSound, revealExampleName]);

  const onReveal = useCallback(async () => {
    if (revealExampleName !== REVEAL_STATE.NOT_REVEALED) {
      return;
    }

    setRevealExampleName(REVEAL_STATE.REVEALED);
    playSound("correct-ding");
    await onNext();
    setCurrentTurn(currentTurn === "challenger" ? "defender" : "challenger");
  }, [currentTurn, onNext, playSound, revealExampleName]);

  useEffect(() => {
    if (countdown === null) {
      return;
    }

    if (countdown === 0) {
      setCurrentTurn("challenger");
      setCountdown(null);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  useEffect(() => {
    if (!currentTurn) {
      return;
    }

    const interval = setInterval(async () => {
      // Check the ref value to avoid needing revealExampleName in dependencies
      if (
        // If the answer is revealed, don't count down
        revealExampleNameRef.current === REVEAL_STATE.REVEALED ||
        // If the round is finished, don't count down
        revealExampleNameRef.current === REVEAL_STATE.FINISHED
      ) {
        return;
      }

      if (currentTurn === "challenger") {
        setChallengerTimeLeft((prev) => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            setRevealExampleName(REVEAL_STATE.FINISHED);
            return 0;
          }
          return newTime;
        });
      } else {
        setDefenderTimeLeft((prev) => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            setRevealExampleName(REVEAL_STATE.FINISHED);

            return 0;
          }
          return newTime;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentTurn]);

  useEffect(() => {
    const channel = new BroadcastChannel("the-floor-projector");
    channel.addEventListener("message", (event) => {
      switch (event.data.type) {
        case PROJECTOR_MESSAGE_TYPE.START_ROUND:
          setCountdown(3);
          setRevealExampleName(REVEAL_STATE.NOT_REVEALED);
          playSound("countdown");
          break;
        case PROJECTOR_MESSAGE_TYPE.FINISH_ROUND:
          onRoundFinish();
          break;
        case PROJECTOR_MESSAGE_TYPE.PASS_ROUND:
          onPass();
          break;
        case PROJECTOR_MESSAGE_TYPE.REVEAL_ROUND:
          onReveal();
          break;
        default:
          console.warn("Unknown message type", event.data.type);
          break;
      }
    });
  }, [onRoundFinish, onPass, onReveal, playSound]);

  useEffect(() => {
    preloadSounds();
  }, [preloadSounds]);

  useEffect(() => {
    const example = examples[selectedExampleIndex];
    channel.postMessage({
      type: PRESENTER_MESSAGE_TYPE.SET_CURRENT_ROUND_EXAMPLE,
      category,
      example,
      selectedExampleIndex,
      state: revealExampleName,
      debugExamples: examples,
    });
  }, [selectedExampleIndex, examples, channel, category, revealExampleName]);

  const isFinished = revealExampleName === REVEAL_STATE.FINISHED;
  const isBad =
    revealExampleName === REVEAL_STATE.PASSED ||
    revealExampleName === REVEAL_STATE.FINISHED;

  if (currentTurn == null) {
    return (
      <div className="fixed inset-0 bg-opacity-75 flex items-center justify-center z-50">
        <p className="text-[12rem] font-bold text-yellow-500">
          {countdown !== null ? countdown : "THE FLOOR"}
        </p>
      </div>
    );
  }

  return (
    <div className="p-10 relative">
      <div className="flex flex-col items-center justify-center bg-white h-[75vh] mx-auto rounded-lg p-4">
        <RoundDisplay
          examples={examples}
          selectedExampleIndex={selectedExampleIndex}
          folder={folder}
        />
      </div>
      <div className="flex flex-col gap-2 w-full">
        <div className="flex flex-row gap-2 w-full justify-between p-2">
          <div
            className={classNames(
              "bg-blue-500 outline outline-4 outline-yellow-500 px-6 py-3 transform skew-x-[15deg] flex items-center justify-center min-w-[120px] min-h-[60px] rounded",
              {
                "bg-red-500": currentTurn === "challenger" && isBad,
                "bg-gray-500": currentTurn !== "challenger" && !isFinished,
                "bg-green-500": currentTurn !== "challenger" && isFinished,
              }
            )}
          >
            <p className="text-2xl font-bold text-white uppercase transform skew-x-[-15deg]">
              {challenger.person}
            </p>
          </div>
          <div
            className={classNames(
              "bg-blue-500 outline outline-4 outline-yellow-500 px-6 py-3 transform skew-x-[-15deg] flex items-center justify-center min-w-[120px] min-h-[60px] rounded",
              {
                "bg-red-500": currentTurn === "defender" && isBad,
                "bg-gray-500": currentTurn !== "defender" && !isFinished,
                "bg-green-500": currentTurn !== "defender" && isFinished,
              }
            )}
          >
            <p className="text-2xl font-bold text-white uppercase transform skew-x-[15deg]">
              {defender.person}
            </p>
          </div>
        </div>
        <div className="flex flex-row gap-2 w-full px-4">
          <div
            className={classNames(
              "bg-blue-600 px-6 py-4 rounded flex items-center justify-center min-w-[120px]",
              {
                "outline outline-4 outline-yellow-500":
                  currentTurn === "challenger",
                "bg-green-500": currentTurn !== "challenger" && isFinished,
                "bg-red-500": currentTurn === "challenger" && isBad,
                "bg-gray-500": currentTurn !== "challenger" && !isFinished,
              }
            )}
          >
            <p className="text-4xl font-bold text-white">
              {challengerTimeLeft}
            </p>
          </div>
          <div
            className={classNames(
              "flex-1 bg-blue-600 px-6 py-4 rounded flex items-center justify-center",
              {
                "bg-red-500": isBad,
              }
            )}
          >
            <p className="text-4xl font-bold uppercase text-white">
              {revealExampleName !== REVEAL_STATE.NOT_REVEALED
                ? examples[selectedExampleIndex]?.name || ""
                : ""}
            </p>
          </div>
          <div
            className={classNames(
              "bg-blue-600 px-6 py-4 rounded flex items-center justify-center min-w-[120px]",
              {
                "outline outline-4 outline-yellow-500":
                  currentTurn === "defender",
                "bg-green-500": currentTurn !== "defender" && isFinished,
                "bg-red-500": currentTurn === "defender" && isBad,
                "bg-gray-500": currentTurn !== "defender" && !isFinished,
              }
            )}
          >
            <p className={"text-4xl font-bold text-white"}>
              {defenderTimeLeft}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function RoundDisplay({
  examples,
  selectedExampleIndex,
  folder,
}: {
  examples: ImageExample[] | TextExample[];
  selectedExampleIndex: number;
  folder: string;
}) {
  const example = examples[selectedExampleIndex];

  // Preload upcoming images to prevent flashing
  useEffect(() => {
    const preloadImages = () => {
      // Preload the next 3 images
      for (let i = 1; i <= 3; i++) {
        const nextIndex = selectedExampleIndex + i;
        if (nextIndex < examples.length) {
          const nextExample = examples[nextIndex];
          if (nextExample && "image" in nextExample) {
            const img = new Image();
            img.src = `/images/${folder}/${nextExample.image}`;
          }
        }
      }
    };

    preloadImages();
  }, [selectedExampleIndex, examples, folder]);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {examples.map((example, index) => {
        const isSelected = index === selectedExampleIndex;
        if ("text" in example) {
          return (
            <p
              className={classNames(
                "text-8xl text-wrap text-center font-bold text-black absolute",
                {
                  "opacity-0 pointer-events-none": !isSelected,
                  "opacity-100": isSelected,
                }
              )}
              key={index}
            >
              {example.text}
            </p>
          );
        }

        return (
          <img
            src={`/images/${folder}/${example.image}`}
            className={classNames(
              "absolute h-full w-auto max-w-full object-contain rounded transition-opacity duration-200",
              {
                "opacity-0 pointer-events-none": !isSelected,
                "opacity-100": isSelected,
              }
            )}
            key={`${folder}-${example.image}-${index}`}
            loading="eager"
            decoding="sync"
          />
        );
      })}
    </div>
  );
}
