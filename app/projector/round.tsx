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
import FloorPageLayout from "../components/FloorPageLayout";

export enum REVEAL_STATE {
  NOT_STARTED = "NOT_STARTED",
  NOT_REVEALED = "NOT_REVEALED",
  REVEALED = "REVEALED",
  PASSED = "PASSED",
  FINISHED = "FINISHED",
}

/**
 * How many images stay mounted around the one on screen.
 *
 * Every example used to be mounted at once with only opacity hiding the rest,
 * so opening a round downloaded the whole category -- 75 MB for City
 * Skylines, 60 MB for Pop Divas -- to show one picture at a time. The index
 * only ever advances by one, so keeping a single frame behind for the
 * crossfade and a few ahead to preload gives the identical instant
 * transition for a fraction of the bytes.
 */
const KEEP_BEHIND = 1;
const KEEP_AHEAD = 3;

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
  // One send-only channel for the lifetime of the component. Constructing it
  // during render created a new one every frame, none of which were ever
  // closed -- and because it sits in onRoundFinish's dependency list, it also
  // made that callback (and everything depending on it) unstable.
  const presenterChannelRef = useRef<BroadcastChannel | null>(null);
  if (!presenterChannelRef.current) {
    presenterChannelRef.current = new BroadcastChannel("the-floor-presenter");
  }
  const channel = presenterChannelRef.current;
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
  const selectedExampleIndexRef = useRef(selectedExampleIndex);

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

  useEffect(() => {
    selectedExampleIndexRef.current = selectedExampleIndex;
  }, [selectedExampleIndex]);

  useEffect(
    () => () => {
      presenterChannelRef.current?.close();
      presenterChannelRef.current = null;
    },
    []
  );

  const onRoundFinish = useCallback(
    (forceWin?: "challenger" | "defender") => {
      let winner =
        challengerTimeLeft > defenderTimeLeft ? challenger : defender;

      let loser = challengerTimeLeft > defenderTimeLeft ? defender : challenger;

      if (forceWin) {
        winner = forceWin === "challenger" ? challenger : defender;
        loser = forceWin === "challenger" ? defender : challenger;
      }

      onFinish(winner, loser, challenger.category);

      channel.postMessage({
        type: PRESENTER_MESSAGE_TYPE.END_ROUND,
      });
    },
    [
      challenger,
      challengerTimeLeft,
      defender,
      defenderTimeLeft,
      onFinish,
      revealExampleName,
      channel,
    ]
  );

  const onNext = useCallback(
    async (timeout: number = 1000) => {
      await new Promise((resolve) => setTimeout(resolve, timeout));

      // Read the index as it is when the timer fires rather than when this
      // callback was created. Advancing from a captured value meant a call
      // made a few examples ago would set the round back to that example,
      // showing the wrong picture for a frame.
      const current = selectedExampleIndexRef.current;
      if (examples.length - 1 === current) {
        setRevealExampleName(REVEAL_STATE.FINISHED);
        return;
      }

      setRevealExampleName(REVEAL_STATE.NOT_REVEALED);
      setSelectedExampleIndex(current + 1);
    },
    [examples]
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

  // The handlers change identity on every example, but the subscription must
  // not: it is held in a ref so the effect below can run exactly once.
  const handlers = useRef({ onRoundFinish, onPass, onReveal, playSound });
  useEffect(() => {
    handlers.current = { onRoundFinish, onPass, onReveal, playSound };
  }, [onRoundFinish, onPass, onReveal, playSound]);

  useEffect(() => {
    // This previously returned its cleanup from inside the message listener
    // rather than from the effect, so no channel was ever closed. Combined
    // with deps that changed on every example, each advance left another live
    // listener behind, and a single press from the presenter reached all of
    // them at once.
    const channel = new BroadcastChannel("the-floor-projector");

    const onMessage = (event: MessageEvent) => {
      switch (event.data.type) {
        case PROJECTOR_MESSAGE_TYPE.START_ROUND:
          setCountdown(3);
          setRevealExampleName(REVEAL_STATE.NOT_REVEALED);
          handlers.current.playSound("countdown");
          break;
        case PROJECTOR_MESSAGE_TYPE.FINISH_ROUND:
          handlers.current.onRoundFinish(event.data.forceWin);
          break;
        case PROJECTOR_MESSAGE_TYPE.PASS_ROUND:
          handlers.current.onPass();
          break;
        case PROJECTOR_MESSAGE_TYPE.REVEAL_ROUND:
          handlers.current.onReveal();
          break;
        default:
          console.warn("Unknown message type", event.data.type);
          break;
      }
    };

    channel.addEventListener("message", onMessage);

    return () => {
      channel.removeEventListener("message", onMessage);
      channel.close();
    };
  }, []);

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
      challenger,
      defender,
    });
  }, [
    selectedExampleIndex,
    examples,
    channel,
    category,
    revealExampleName,
    challenger,
    defender,
  ]);

  const isFinished = revealExampleName === REVEAL_STATE.FINISHED;
  const isBad =
    revealExampleName === REVEAL_STATE.PASSED ||
    revealExampleName === REVEAL_STATE.FINISHED;

  if (currentTurn == null) {
    return (
      <FloorPageLayout>
        <div className="flex items-center justify-center w-full h-full">
          <p className="text-[12rem] font-bold text-yellow-500 text-center">
            {countdown !== null ? countdown : "THE FLOOR"}
          </p>
        </div>
      </FloorPageLayout>
    );
  }

  return (
    <FloorPageLayout>
      <div className="p-10 relative w-full h-full">
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
    </FloorPageLayout>
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

        // Outside the window the image is not in the DOM at all, so the
        // browser never requests it.
        if (
          index < selectedExampleIndex - KEEP_BEHIND ||
          index > selectedExampleIndex + KEEP_AHEAD
        ) {
          return null;
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
