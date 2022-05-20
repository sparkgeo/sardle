import React, { useEffect, useState } from "react";
import axios from "axios";

export interface WeatherResponse {
  dayhour: string;
  temp: { c: number; f: number };
  precip: string;
  humidity: string;
  wind: { km: number; mile: number };
  iconURL: string;
  comment: string;
}

const getWeather = async (city: string): Promise<WeatherResponse> => {
  const response = await axios.get(
    `https://weatherdbi.herokuapp.com/data/weather/${city}`
  );

  return response.data.currentConditions;
};

interface WeatherProps {
  cityName: string;
}

export function Weather({ cityName }: WeatherProps) {
  const [weather, setWeather] = useState<WeatherResponse | undefined>(
    undefined
  );
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setWeather(await getWeather(cityName));
      } catch (e) {
        setIsError(true);
      }
    };

    fetchWeather();
  }, [cityName]);

  if (isError) {
    return (
      <>
        <h1>Current Weather</h1>
        <h2>Error loading weather data</h2>
      </>
    );
  }

  if (weather) {
    return (
      <>
        <h1>Current Weather</h1>
        <img src={weather.iconURL} alt="Weather Symbol"></img>
        <h2>Temperature: {weather.temp.c}°C</h2>
        <h2>Precipitation: {weather.precip}</h2>
        <h2>Humidity: {weather.precip}</h2>
      </>
    );
  }

  return (
    <>
      <h1>Current Weather</h1>
      <h2>Loading weather data...</h2>
    </>
  );
}
