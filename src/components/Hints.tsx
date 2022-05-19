import React from "react";
import { HintRow } from "./HintRow";
import { Guess } from "../domain/guess";

interface HintsProps {
  guesses: Guess[];
}

const questions = [
  "question 1",
  "question 2",
  "question 3",
  "question 4",
  "question 5",
  "question 6",
];

export function Hints({ guesses }: HintsProps) {
  const numberOfGuesses = guesses.length;

  const hintQuestions = questions.map((question, idx) => {
    return <HintRow key={idx}>{question}</HintRow>;
  });

  return (
    <>
      {hintQuestions[0]}
      {hintQuestions.slice(1, numberOfGuesses + 1)}
    </>
  );
}
