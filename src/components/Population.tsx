import React from "react";

interface PopulationProps {
  population: number;
}

export function Population({ population }: PopulationProps) {
  // We could do an async API request here with axios

  return <h1>Population: {population}</h1>;
}
