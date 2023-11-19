import { Typography } from "@mui/material";
import React, { ReactNode, memo } from "react";
import BrokenImageIcon from "@mui/icons-material/BrokenImage";

import { BuildingTileMetadata } from "../../tbx";
import { GameTile, TileViewer } from "../../components";
import { useForceRender } from "../../hooks/useForceRender";
import { BuildingEntry, EmptyBuildingEntry } from "../../model";

interface BuildingTileProps {
  tileMetadata: BuildingTileMetadata;
  buildingTiles: BuildingEntry[];
}

const buildingTileRenderer = (buildingTile: any): ReactNode => {
  const tile = buildingTile.tiles?.[0]?.tile;
  const isUnknownTile = buildingTile instanceof EmptyBuildingEntry;
  const folder = buildingTile.folder;

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

  const { groups = {} } =
    tile.match(/(?<fileName>.+)_(?<tileIndex>[0-9]+)$/) ?? {};

  const index = Number(groups?.tileIndex);
  const file = `${folder}/${groups.fileName}`;

  return (
    <TileViewer
      tileIndex={index}
      file={file}
      width={128}
      height={256}
      tilesInRow={8}
    />
  );
};

const BuildingTile: React.FC<BuildingTileProps> = memo(
  ({ tileMetadata, buildingTiles }) => {
    const render = useForceRender();

    const options = tileMetadata.getOptions(buildingTiles);

    const handleTileChange = (tile: BuildingEntry) => {
      tileMetadata.setTile(tile);
      render();
    };

    const handleRandomTile = () => {
      handleTileChange(tileMetadata.getRandomOption(buildingTiles));
    };

    return (
      <GameTile<BuildingEntry>
        value={tileMetadata.tile}
        onChange={handleTileChange}
        onRandom={handleRandomTile}
        options={options}
        title={tileMetadata.metadata.room}
        renderer={buildingTileRenderer}
      />
    );
  }
);

export default BuildingTile;
