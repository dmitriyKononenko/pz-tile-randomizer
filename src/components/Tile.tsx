import { FC } from "react";
import { Box } from "@mui/material";

export interface TileProps {
  tileIndex: number;
  file: string;
  width: number;
  height: number;
  tilesInRow: number;
}

export const TileViewer: FC<TileProps> = ({
  tileIndex,
  file,
  width,
  height,
  tilesInRow,
}) => {
  const y = Math.floor((tileIndex * width) / (width * tilesInRow)) * height;
  const x = (tileIndex % tilesInRow) * width;

  return (
    <Box
      width={width}
      height={height}
      overflow="hidden"
      style={{
        backgroundImage: `url(tiles://${file}.png)`,
        backgroundPosition: `-${x}px -${y}px`,
      }}
    />
  );
};
