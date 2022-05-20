import React from "react";

interface PopulationProps {
  population: number;
}

export function Population({ population }: PopulationProps) {
  return (
    <>
      <h1>Population</h1>
      <h2>{population}</h2>
    </>
  );
}
