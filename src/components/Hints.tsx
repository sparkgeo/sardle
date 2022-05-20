import React, { useEffect, useState } from "react";
import { HintRow } from "./HintRow";
import { Population } from "./Population";
import { OsmStreets } from "./OsmStreets";
import { Guess } from "../domain/guess";
import { City } from "../domain/cities";
import axios from "axios";

const getOsmStreetsImage = async (
  longitude: number,
  latitude: number
): Promise<string | undefined> => {
  const response = await axios.get(
    // "http://thisiscool.pythonanywhere.com/streets?lat=${latitude}&lon=${longitude}",
    `http://localhost:5000/streets?lat=${latitude}&lon=${longitude}`,
    {
      responseType: "arraybuffer",
    }
  );

  const base64 = btoa(
    new Uint8Array(response.data).reduce(
      (data, byte) => data + String.fromCharCode(byte),
      ""
    )
  );
  return `data:image/jpeg;base64,${base64}`;
};

interface HintsProps {
  guesses: Guess[];
  city: City;
}

export function Hints({ guesses, city }: HintsProps) {
  const numberOfGuesses = guesses.length;

  const [image, setImage] = useState<string | undefined>(undefined);
  const [isOsmError, setIsOsmError] = useState<boolean>(false);

  useEffect(() => {
    // Fetching the image here allows us to load in before we need to display it
    const fetchImage = async () => {
      try {
        setImage(
          await getOsmStreetsImage(
            city.geometry.coordinates[0],
            city.geometry.coordinates[1]
          )
        );
      } catch (e) {
        console.log("set is error");
        setIsOsmError(true);
      }
    };

    fetchImage();
  }, [city]);

  const questions = [
    <Population key="q1" population={city.properties.population} />,
    isOsmError ? (
      <h1>Error loading OSM streets image</h1>
    ) : (
      <OsmStreets key="q2" image={image} />
    ),
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
