/* eslint-disable @next/next/no-img-element */
"use client";
import classNames from "classnames";
import { useCallback, useEffect, useRef, useState } from "react";
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

enum REVEAL_STATE {
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
  onFinish: (winner: FloorData, loser: FloorData) => void;
}) {
  const { folder, examples } = CATEGORY_METADATA[category];
  const channel = new BroadcastChannel("the-floor-presenter");

  const [selectedExampleIndex, setSelectedExampleIndex] = useState(0);

  const [challengerTimeLeft, setChallengerTimeLeft] = useState(45);
  const [defenderTimeLeft, setDefenderTimeLeft] = useState(45);

  const [currentTurn, setCurrentTurn] = useState<"challenger" | "defender">();

  const [revealExampleName, setRevealExampleName] = useState<REVEAL_STATE>(
    REVEAL_STATE.NOT_REVEALED
  );

  const revealExampleNameRef = useRef(revealExampleName);

  useEffect(() => {
    revealExampleNameRef.current = revealExampleName;
  }, [revealExampleName]);

  function shuffle<T extends { name: string }[]>(array: T): T {
    return array.sort(() => Math.random() - 0.5);
  }

  const [randomizedExamples] = useState<ImageExample[] | TextExample[]>(() =>
    shuffle(examples)
  );

  const onRoundFinish = useCallback(() => {
    const winner =
      challengerTimeLeft > defenderTimeLeft ? challenger : defender;
    const loser = challengerTimeLeft > defenderTimeLeft ? defender : challenger;

    onFinish(winner, loser);
  }, [challenger, challengerTimeLeft, defender, defenderTimeLeft, onFinish]);

  const onNext = useCallback(
    async (timeout: number = 1000) => {
      await new Promise((resolve) => setTimeout(resolve, timeout));
      if (randomizedExamples.length - 1 === selectedExampleIndex) {
        setRevealExampleName(REVEAL_STATE.FINISHED);
        return;
      }

      setRevealExampleName(REVEAL_STATE.NOT_REVEALED);
      setSelectedExampleIndex(selectedExampleIndex + 1);
    },
    [randomizedExamples, selectedExampleIndex]
  );

  const onPass = useCallback(async () => {
    setRevealExampleName(REVEAL_STATE.PASSED);
    await onNext(3000);
  }, [onNext]);

  const onReveal = useCallback(async () => {
    setRevealExampleName(REVEAL_STATE.REVEALED);
    await onNext();
    setCurrentTurn(currentTurn === "challenger" ? "defender" : "challenger");
  }, [currentTurn, onNext]);

  useEffect(() => {
    if (!currentTurn) {
      return;
    }

    const interval = setInterval(() => {
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
          if (prev <= 0) {
            setRevealExampleName(REVEAL_STATE.FINISHED);
            return 0;
          }
          return prev - 1;
        });
      } else {
        setDefenderTimeLeft((prev) => {
          if (prev <= 0) {
            setRevealExampleName(REVEAL_STATE.FINISHED);
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentTurn]);

  const isTimeUp =
    challengerTimeLeft <= 0 ||
    defenderTimeLeft <= 0 ||
    revealExampleName === REVEAL_STATE.FINISHED;

  useEffect(() => {
    const channel = new BroadcastChannel("the-floor-projector");
    channel.addEventListener("message", (event) => {
      switch (event.data.type) {
        case PROJECTOR_MESSAGE_TYPE.START_ROUND:
          setCurrentTurn("challenger");
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
  }, [onRoundFinish, onPass, onReveal]);

  useEffect(() => {
    const example = randomizedExamples[selectedExampleIndex];
    channel.postMessage({
      type: PRESENTER_MESSAGE_TYPE.SET_CURRENT_ROUND_EXAMPLE,
      example,
      selectedExampleIndex,
    });
  }, [selectedExampleIndex, randomizedExamples, channel]);

  if (currentTurn == null) {
    return <div className='p-20 text-white'>Waiting for start...</div>;
  }

  return (
    <div className='p-20'>
      <div className='flex flex-col items-center justify-center bg-white h-[75vh] mx-auto'>
        {randomizedExamples.map((example, index) => {
          const isSelected = index === selectedExampleIndex;
          if ("text" in example) {
            return (
              <p className='text-4xl font-bold text-white' key={index}>
                {example.text}
              </p>
            );
          }

          return (
            <img
              src={`/images/${folder}/${example.image}`}
              className={classNames("max-h-full max-w-full object-contain", {
                hidden: !isSelected,
              })}
              key={example.name}
            />
          );
        })}
      </div>
      <div className='flex flex-col gap-2 w-full'>
        <div className='flex flex-row gap-2 w-full justify-between p-2'>
          <div className='bg-blue-500 outline outline-4 outline-yellow-500 px-6 py-3 transform skew-x-[15deg] flex items-center justify-center min-w-[120px] min-h-[60px]'>
            <p className='text-2xl font-bold text-white uppercase transform skew-x-[-15deg]'>
              {challenger.person}
            </p>
          </div>
          <div className='bg-blue-500 outline outline-4 outline-yellow-500 px-6 py-3 transform skew-x-[-15deg] flex items-center justify-center min-w-[120px] min-h-[60px]'>
            <p className='text-2xl font-bold text-white uppercase transform skew-x-[15deg]'>
              {defender.person}
            </p>
          </div>
        </div>
        <div className='flex flex-row gap-2 w-full'>
          <div
            className={classNames(
              "bg-blue-600 px-6 py-4 rounded flex items-center justify-center min-w-[120px]",
              {
                "outline outline-4 outline-yellow-500":
                  currentTurn === "challenger",
              }
            )}
          >
            <p
              className={classNames("text-4xl font-bold ", {
                "text-white":
                  currentTurn === "challenger" &&
                  revealExampleName !== REVEAL_STATE.PASSED,
                "text-red-500":
                  currentTurn === "challenger" &&
                  revealExampleName === REVEAL_STATE.PASSED,
                "text-gray-500": currentTurn !== "challenger",
              })}
            >
              {challengerTimeLeft}
            </p>
          </div>
          <div className='flex-1 bg-blue-600 px-6 py-4 rounded flex items-center justify-center'>
            <p className='text-4xl font-bold text-white'>
              {revealExampleName !== REVEAL_STATE.NOT_REVEALED
                ? randomizedExamples[selectedExampleIndex]?.name || ""
                : ""}
            </p>
          </div>
          <div
            className={classNames(
              "bg-blue-600 px-6 py-4 rounded flex items-center justify-center min-w-[120px]",
              {
                "outline outline-4 outline-yellow-500":
                  currentTurn === "defender",
              }
            )}
          >
            <p
              className={classNames("text-4xl font-bold ", {
                "text-white":
                  currentTurn === "defender" &&
                  revealExampleName !== REVEAL_STATE.PASSED,
                "text-red-500":
                  currentTurn === "defender" &&
                  revealExampleName === REVEAL_STATE.PASSED,
                "text-gray-500": currentTurn !== "defender",
              })}
            >
              {defenderTimeLeft}
            </p>
          </div>
        </div>
      </div>
      {/* <div className="flex flex-row gap-2 w-full justify-center p-2">
        {!isTimeUp && currentTurn && (
          <>
            <button
              className="bg-blue-500 text-white p-2 rounded-md"
              onClick={onPass}
            >
              Pass
            </button>
            <button
              className="bg-blue-500 text-white p-2 rounded-md"
              onClick={onReveal}
            >
              Reveal
            </button>
          </>
        )}

        {!isTimeUp && !currentTurn && (
          <button
            className="bg-blue-500 text-white p-2 rounded-md"
            onClick={() => setCurrentTurn("challenger")}
          >
            Start
          </button>
        )}

        {isTimeUp && (
          <button
            className="bg-blue-500 text-white p-2 rounded-md"
            onClick={onRoundFinish}
          >
            Finish
          </button>
        )}
      </div> */}
    </div>
  );
}
