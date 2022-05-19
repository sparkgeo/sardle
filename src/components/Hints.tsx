import React from "react";
import { HintRow } from "./HintRow";
import { Population } from "./Population";
import { Guess } from "../domain/guess";
import { City } from "../domain/cities";

interface HintsProps {
  guesses: Guess[];
  city: City;
}

export function Hints({ guesses, city }: HintsProps) {
  const numberOfGuesses = guesses.length;

  const questions = [
    <Population key="q1" population={city.properties.population} />,
    "question 2",
    "question 3",
    "question 4",
    "question 5",
    "question 6",
  ];

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
