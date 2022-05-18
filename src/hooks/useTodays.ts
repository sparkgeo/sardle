import { DateTime } from "luxon";
import { useCallback, useEffect, useState } from "react";
import seedrandom from "seedrandom";
import { cities, City } from "../domain/cities";
import { Guess, loadAllGuesses, saveGuesses } from "../domain/guess";

const forcedCities: Record<string, string> = {
  "2022-02-02": "TD",
  "2022-02-03": "PY",
  "2022-03-21": "HM",
  "2022-03-22": "MC",
  "2022-03-23": "PR",
  "2022-03-24": "MX",
};

const noRepeatStartDate = DateTime.fromFormat("2022-05-01", "yyyy-MM-dd");

export function getDayString(shiftDayCount?: number) {
  return DateTime.now()
    .plus({ days: shiftDayCount ?? 0 })
    .toFormat("yyyy-MM-dd");
}

export function useTodays(dayString: string): [
  {
    city?: City;
    guesses: Guess[];
  },
  (guess: Guess) => void
] {
  const [todays, setTodays] = useState<{
    city?: City;
    guesses: Guess[];
  }>({ guesses: [] });

  const addGuess = useCallback(
    (newGuess: Guess) => {
      if (todays == null) {
        return;
      }

      const newGuesses = [...todays.guesses, newGuess];

      setTodays((prev) => ({ city: prev.city, guesses: newGuesses }));
      saveGuesses(dayString, newGuesses);
    },
    [dayString, todays]
  );

  useEffect(() => {
    const guesses = loadAllGuesses()[dayString] ?? [];
    const city = getCity(dayString);

    setTodays({ city, guesses });
  }, [dayString]);

  // const randomAngle = useMemo(
  //   () => seedrandom.alea(dayString)() * 360,
  //   [dayString]
  // );

  // const imageScale = useMemo(() => {
  //   const normalizedAngle = 45 - (randomAngle % 90);
  //   const radianAngle = (normalizedAngle * Math.PI) / 180;
  //   return 1 / (Math.cos(radianAngle) * Math.sqrt(2));
  // }, [randomAngle]);

  return [todays, addGuess];
}

function getCity(dayString: string) {
  const currentDayDate = DateTime.fromFormat(dayString, "yyyy-MM-dd");
  let pickingDate = DateTime.fromFormat("2022-03-21", "yyyy-MM-dd");
  const smallCountryCooldown = 0;
  let pickedCity: City | null = null;

  const lastPickDates: Record<string, DateTime> = {};

  do {
    // smallCountryCooldown--;

    const pickingDateString = pickingDate.toFormat("yyyy-MM-dd");

    const forcedCityCode = forcedCities[dayString];
    const forcedCity =
      forcedCityCode != null
        ? cities.find((city) => city.properties.iso_a2 === forcedCityCode)
        : undefined;

    // const countrySelection =
    //   smallCountryCooldown < 0
    //     ? countriesWithImage
    //     : bigEnoughCountriesWithImage;

    const citySelection = cities;

    if (forcedCity != null) {
      pickedCity = forcedCity;
    } else {
      let cityIndex = Math.floor(
        seedrandom.alea(pickingDateString)() * citySelection.length
      );
      pickedCity = citySelection[cityIndex];

      if (currentDayDate >= noRepeatStartDate) {
        while (isARepeat(pickedCity, lastPickDates, currentDayDate)) {
          cityIndex = (cityIndex + 1) % citySelection.length;
          pickedCity = citySelection[cityIndex];
        }
      }
    }

    lastPickDates[pickedCity.properties.iso_a2] = pickingDate;
    pickingDate = pickingDate.plus({ day: 1 });
  } while (pickingDate <= currentDayDate);

  return pickedCity;
}

function isARepeat(
  pickedCity: City | null,
  lastPickDates: Record<string, DateTime>,
  currentDayDate: DateTime
) {
  if (
    pickedCity == null ||
    lastPickDates[pickedCity.properties.iso_a2] == null
  ) {
    return false;
  }
  const daysSinceLastPick = lastPickDates[pickedCity.properties.iso_a2].diff(
    currentDayDate,
    "day"
  ).days;

  return daysSinceLastPick < 100;
}
