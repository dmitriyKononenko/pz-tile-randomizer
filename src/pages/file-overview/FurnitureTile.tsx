import { Typography } from "@mui/material";
import React, { ReactNode, memo } from "react";
import BrokenImageIcon from "@mui/icons-material/BrokenImage";

import { FurnitureTileMetadata } from "../../tbx";
import { GameTile, TileViewer } from "../../components";
import { useForceRender } from "../../hooks/useForceRender";
import { EmptyFurniture, Furniture } from "../../model/entities/furniture";

interface FurnitureTileProps {
  tileMetadata: FurnitureTileMetadata;
  furnitureTiles: Furniture[];
}

const furnitureTileRenderer = (furnitureTile: Furniture): ReactNode => {
  const tile =
    furnitureTile.entries[0]?.tiles?.[1]?.tile ||
    furnitureTile.entries[0]?.tiles?.[0]?.tile;
  const folder = furnitureTile.folder;
  const isUnknownTile = furnitureTile instanceof EmptyFurniture;

  if (!tile || isUnknownTile) {
    return (
      <Typography
        variant="caption"
        px={2}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        Can't find file: <b>"{tile}"</b>
        <BrokenImageIcon fontSize="large" />
      </Typography>
    );
  }

  if (!tile) {
    return [];
  }

  const { groups = {} } =
    tile.match(/(?<fileName>.+)_(?<tileIndex>[0-9]+)$/) ?? {};

  const index = Number(groups?.tileIndex);
  const file = `${folder}/${groups.fileName}`;

  return (
    <TileViewer
      key={`${file}_${index}`}
      tileIndex={index}
      file={file}
      width={128}
      height={256}
      tilesInRow={8}
    />
  );
};

const FurnitureTile: React.FC<FurnitureTileProps> = memo(
  ({ tileMetadata, furnitureTiles }) => {
    const render = useForceRender();

    const options = tileMetadata.getOptions(furnitureTiles);

    const handleTileChange = (tile: Furniture) => {
      tileMetadata.setTile(tile);
      render();
    };

    const handleRandomTile = () => {
      handleTileChange(tileMetadata.getRandomOption(furnitureTiles));
    };

    return (
      <GameTile<Furniture>
        value={tileMetadata.tile}
        onChange={handleTileChange}
        onRandom={handleRandomTile}
        options={options}
        title={tileMetadata.metadata.room}
        renderer={furnitureTileRenderer}
      />
    );
  }
);

export default FurnitureTile;
