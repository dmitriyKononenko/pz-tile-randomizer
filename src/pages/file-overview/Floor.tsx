import React, { memo, useMemo } from "react";
import { Box, Grid, Typography } from "@mui/material";

import BuildingTile from "./BuildingTile";
import { BuildingEntry } from "../../model";
import FurnitureTile from "./FurnitureTile";
import { Furniture } from "../../model/entities/furniture";
import { BuildingTileManager, FurnitureTileManager } from "../../tbx";

type FloorProps = {
  floor: number;
  floorsCount: number;
  buildingTileManager: BuildingTileManager;
  furnitureTileManager: FurnitureTileManager;
  buildingTiles: BuildingEntry[];
  furnitureTiles: Furniture[];
};

export const Floor: React.FC<FloorProps> = memo(
  ({
    floor,
    floorsCount,
    buildingTileManager,
    furnitureTileManager,
    buildingTiles,
    furnitureTiles,
  }) => {
    const buildingEntries = useMemo(
      () => buildingTileManager.getBuildingEntries(floor),
      [buildingTileManager, floor]
    );
    const interiorWallEntries = useMemo(
      () => buildingTileManager.getInteriorWalls(floor),
      [buildingTileManager, floor]
    );

    const furnitureEntries = useMemo(
      () => furnitureTileManager.getFurnitureEntries(floor),
      [furnitureTileManager, floor]
    );

    return (
      <Box py={4} px={2}>
        <Typography variant="h5">
          {floor >= floorsCount - 1 ? "Roof" : `Floor: ${floor + 1}`}
        </Typography>
        {!!buildingEntries.length && (
          <Typography variant="h6">Building tiles</Typography>
        )}
        <Grid
          container
          rowSpacing={1}
          columnSpacing={1}
          columns={{ xs: 4, sm: 8, md: 12 }}
          sx={{ p: 2 }}
        >
          {buildingEntries.map((tileMetadata, i) => (
            <Grid item key={i} minHeight={410}>
              <BuildingTile
                tileMetadata={tileMetadata}
                buildingTiles={buildingTiles}
              />
            </Grid>
          ))}
        </Grid>
        {!!interiorWallEntries.length && (
          <Typography variant="h6">Interior walls</Typography>
        )}
        <Grid
          container
          rowSpacing={1}
          columnSpacing={1}
          columns={{ xs: 4, sm: 8, md: 12 }}
          sx={{ p: 2 }}
        >
          {interiorWallEntries.map((tileMetadata, i) => (
            <Grid item key={i} minHeight={410}>
              <BuildingTile
                tileMetadata={tileMetadata}
                buildingTiles={buildingTiles}
              />
            </Grid>
          ))}
        </Grid>
        {!!furnitureEntries.length && (
          <Typography variant="h6">Furniture</Typography>
        )}
        <Grid
          container
          rowSpacing={1}
          columnSpacing={1}
          columns={{ xs: 4, sm: 8, md: 12 }}
          sx={{ p: 2 }}
        >
          {furnitureEntries.map((tileMetadata, i) => (
            <Grid item key={i} minHeight={410}>
              <FurnitureTile
                tileMetadata={tileMetadata}
                furnitureTiles={furnitureTiles}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }
);
