import citiesWithPopOver1Million from "../data/citiesWithPopOver1Million.json";

import { Feature, Point } from "geojson";

interface CityProps {
  name: string;
  country: string;
  iso_a2: string;
  type: string;
  population: number;
}

export interface City extends Feature<Point> {
  properties: CityProps;
}

// export const citiesWithImage = countries.filter((c) =>
//   countryCodesWithImage.includes(c.code.toLowerCase())
// );

// export const smallCountryLimit = 5000;
// export const bigEnoughCountriesWithImage = countriesWithImage.filter(
//   (country) => areas[country.code] > smallCountryLimit
// );
// export const cities: Array<Feature> = JSON.parse(
//   citiesWithPopOver1Million.features
// );

export const cities: City[] = citiesWithPopOver1Million.features.map(
  // Cast type for "type" properties (see issue here https://github.com/DefinitelyTyped/DefinitelyTyped/issues/37370)
  (feature) => {
    return {
      ...feature,
      type: "Feature" as const,
      geometry: {
        ...feature.geometry,
        type: "Point" as const,
      },
    };
  }
);

export function getCityName(city: City) {
  return city.properties.name;
}

// export function getCountryName(language: string, country: Country) {
//   switch (language) {
//     case "fr":
//       return frenchCountryNames[country.code];
//     case "hu":
//       return hungarianCountryNames[country.code];
//     case "nl":
//       return dutchCountryNames[country.code];
//     default:
//       return country.name;
//   }
// }

export function sanitizeCityName(cityName: string): string {
  return cityName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[- '()]/g, "")
    .toLowerCase();
}
