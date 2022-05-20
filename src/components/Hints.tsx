import React, { useEffect, useState } from "react";
import { HintRow } from "./HintRow";
import { Population } from "./Population";
import { OsmStreets } from "./OsmStreets";
import { Weather } from "./Weather";
import { Guess } from "../domain/guess";
import { City } from "../domain/cities";
import axios from "axios";

const getStaticMapboxUrl = (coordinates: number[], zoomLevel: number) => {
  return `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/${coordinates[0]},${coordinates[1]},${zoomLevel},0/500x400?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`;
};

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
    // Fetching the image here allows us to load it before we need to display it
    const fetchImage = async () => {
      try {
        setImage(
          await getOsmStreetsImage(
            city.geometry.coordinates[0],
            city.geometry.coordinates[1]
          )
        );
      } catch (e) {
        setIsOsmError(true);
      }
    };

    fetchImage();
  }, [city]);

  const questions = [
    <Population key="q1" population={city.properties.population} />,
    // OSM streets
    isOsmError ? (
      <h1>Error loading OSM streets image</h1>
    ) : (
      <OsmStreets key="q2" image={image} />
    ),
    // Weather
    <Weather key="q3" cityName={city.properties.name} />,
    // Satellite
    <>
      <h1>Mapbox Satellite</h1>
      <img
        key="q4"
        src={getStaticMapboxUrl(city.geometry.coordinates, 12)}
        alt="1st satellite"
      />
    </>,
    <img
      key="q5"
      src={getStaticMapboxUrl(city.geometry.coordinates, 9)}
      alt="1st satellite"
    />,
    <img
      key="q6"
      src={getStaticMapboxUrl(city.geometry.coordinates, 6)}
      alt="1st satellite"
    />,
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
