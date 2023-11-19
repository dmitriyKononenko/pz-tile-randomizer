import React, { memo } from "react";
import { Box, Grid, Typography } from "@mui/material";

import {
  BuildingTileManager,
  FurnitureTileManager,
  TbxDataManager,
} from "../../tbx";
import { Floor } from "./Floor";
import BuildingTile from "./BuildingTile";
import { BuildingEntry, Furniture } from "../../model";

interface FileRenderProps {
  tbxManager: TbxDataManager;
  buildingTiles: BuildingEntry[];
  furnitureTiles: Furniture[];
}

export const FileRender: React.FC<FileRenderProps> = memo(
  ({ tbxManager, buildingTiles, furnitureTiles }) => {
    const buildingTileManager = new BuildingTileManager(
      tbxManager,
      buildingTiles
    );

    const furnitureTileManager = new FurnitureTileManager(
      tbxManager,
      furnitureTiles
    );

    const floorsEntryList = tbxManager.getFloors();
    const exteriorWallTiles = buildingTileManager.getExteriorWalls();

    return (
      <>
        {floorsEntryList.map((_, i) => (
          <Floor
            floor={i}
            key={i}
            floorsCount={floorsEntryList.length}
            buildingTileManager={buildingTileManager}
            furnitureTileManager={furnitureTileManager}
            buildingTiles={buildingTiles}
            furnitureTiles={furnitureTiles}
          />
        ))}
        <Box py={4} px={2}>
          <Typography variant="h6">Exterior walls</Typography>
          <Grid
            container
            rowSpacing={1}
            columnSpacing={1}
            columns={{ xs: 4, sm: 8, md: 12 }}
            sx={{ p: 2 }}
          >
            {exteriorWallTiles.map((tileMetadata, i) => (
              <Grid item key={i} minHeight={410}>
                <BuildingTile
                  tileMetadata={tileMetadata}
                  buildingTiles={buildingTiles}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </>
    );
  }
);
