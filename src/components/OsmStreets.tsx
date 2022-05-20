import React, { useEffect, useState } from "react";

interface OsmStreetsProps {
  image: string | undefined;
}

export const OsmStreets = ({ image }: OsmStreetsProps) => {
  return image ? (
    <img src={image} alt="OSM Streets" />
  ) : (
    <h1>Loading image...</h1>
  );
};
