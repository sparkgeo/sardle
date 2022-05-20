import {
  computeProximityPercent,
  formatDistance,
  generateSquareCharacters,
  getDirectionEmoji,
} from "../domain/geography";
import { Guess } from "../domain/guess";
import React, { useCallback, useEffect, useState } from "react";
import CountUp from "react-countup";
import { SettingsData } from "../hooks/useSettings";
import { Twemoji } from "@teuteuf/react-emoji-render";

const SQUARE_ANIMATION_LENGTH = 250;
type AnimationState = "NOT_STARTED" | "RUNNING" | "ENDED";

interface GuessRowProps {
  guess?: Guess;
  settingsData: SettingsData;
  cityInputRef?: React.RefObject<HTMLInputElement>;
  questionType: string;
}

export function GuessRow({
  guess,
  settingsData,
  cityInputRef,
  questionType,
}: GuessRowProps) {
  const { distanceUnit, theme } = settingsData;

  let proximityPercent;
  let difference;
  let unit;
  let arrowEmoji;
  if (questionType === "distance") {
    proximityPercent =
      guess != null ? computeProximityPercent(guess.distance) : 0;
    unit = distanceUnit;
    difference =
      guess != null
        ? formatDistance(guess.distance, unit)
        : formatDistance(0, unit);
    arrowEmoji =
      guess != null ? <Twemoji text={getDirectionEmoji(guess)} /> : undefined;
  } else {
    proximityPercent = guess != null ? guess.populationPercentDifference : 0;
    unit = "people";
    difference =
      guess != null ? `${guess.populationDifference} people` : "0 people";
    if (guess != null && guess.populationDifference < 0) {
      arrowEmoji = <Twemoji text="🔽" />;
    } else if (guess != null && guess.populationDifference > 0) {
      arrowEmoji = <Twemoji text="🔼" />;
    } else {
      arrowEmoji = <Twemoji text="✅" />;
    }
  }

  const squares = generateSquareCharacters(proximityPercent, theme);

  const [animationState, setAnimationState] =
    useState<AnimationState>("NOT_STARTED");

  useEffect(() => {
    setAnimationState("NOT_STARTED");

    if (guess == null) {
      return;
    }

    setAnimationState("RUNNING");
    const timeout = setTimeout(() => {
      setAnimationState("ENDED");
    }, SQUARE_ANIMATION_LENGTH * 6);

    return () => {
      clearTimeout(timeout);
    };
  }, [guess]);

  const handleClickOnEmptyRow = useCallback(() => {
    if (cityInputRef?.current != null) {
      cityInputRef?.current.focus();
    }
  }, [cityInputRef]);

  switch (animationState) {
    case "NOT_STARTED":
      return (
        <div
          onClick={handleClickOnEmptyRow}
          className={`col-span-7 h-8 bg-gray-200 dark:bg-slate-600 rounded`}
        />
      );
    case "RUNNING":
      return (
        <>
          <div
            className={`flex text-2xl w-full justify-evenly items-center col-span-6 border-2 h-8 rounded`}
          >
            {squares.map((character, index) => (
              <div
                key={index}
                className="opacity-0 animate-reveal"
                style={{
                  animationDelay: `${SQUARE_ANIMATION_LENGTH * index}ms`,
                }}
              >
                <Twemoji text={character} />
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center border-2 h-8 col-span-1 animate-reveal rounded">
            <CountUp
              end={proximityPercent}
              suffix="%"
              duration={(SQUARE_ANIMATION_LENGTH * 5) / 1000}
            />
          </div>
        </>
      );
    case "ENDED":
      return (
        <>
          <div className="flex items-center justify-center border-2 h-8 col-span-3 animate-reveal rounded">
            <p className="text-ellipsis overflow-hidden whitespace-nowrap">
              {guess?.name.toUpperCase()}
            </p>
          </div>
          <div className="flex items-center justify-center border-2 h-8 col-span-2 animate-reveal rounded">
            {guess && difference}
          </div>
          <div className="flex items-center justify-center border-2 h-8 col-span-1 animate-reveal rounded">
            {guess && arrowEmoji}
          </div>
          <div className="flex items-center justify-center border-2 h-8 col-span-1 animate-reveal animate-pop rounded">
            {/* {`${proximityPercent}%`} */}
            {guess &&
            guess.populationDifference &&
            guess.populationDifference < 0
              ? `-${proximityPercent}%`
              : `${proximityPercent}%`}
          </div>
        </>
      );
  }
}
