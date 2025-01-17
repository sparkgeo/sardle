import { Guess } from "../domain/guess";
import { GuessRow } from "./GuessRow";
import React from "react";
import { SettingsData } from "../hooks/useSettings";

interface GuessesProps {
  rowCount: number;
  guesses: Guess[];
  settingsData: SettingsData;
  cityInputRef?: React.RefObject<HTMLInputElement>;
}

const questionTypeMapping: string[] = [
  "population", // q1
  "distance",
  "distance",
  "distance",
  "distance",
  "distance",
];

export function Guesses({
  rowCount,
  guesses,
  settingsData,
  cityInputRef,
}: GuessesProps) {
  return (
    <div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {Array.from(Array(rowCount).keys()).map((index) => (
          <GuessRow
            key={index}
            guess={guesses[index]}
            settingsData={settingsData}
            cityInputRef={cityInputRef}
            questionType={questionTypeMapping[index]}
          />
        ))}
      </div>
    </div>
  );
}
