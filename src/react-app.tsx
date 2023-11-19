import ReactDOM from "react-dom/client";
import React, { FC, useMemo } from "react";
import { ThemeProvider } from "@emotion/react";
import { alpha, createTheme, getContrastRatio } from "@mui/material";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { FileOverview } from "./pages";
import {
  Furniture,
  buildingList,
  furnitureList,
  BuildingEntry,
  hydrateBuildingTilesFromConfig,
  hydrateFurnitureTilesFromConfig,
} from "./model";

const mainColor = "#212121";
const primary = {
  main: mainColor,
  light: alpha(mainColor, 0.5),
  dark: alpha(mainColor, 0.9),
  contrastText: getContrastRatio(mainColor, "#fff") > 4.5 ? "#fff" : "#111",
};

const defaultTheme = createTheme({
  palette: {
    mode: "light",
    primary,
  },
});

const root = ReactDOM.createRoot(document.body);

interface DefinitionsProps {}

const Definitions: FC<DefinitionsProps> = () => {
  const [definitions, setDefinitions] = React.useState<any>(null);

  React.useEffect(() => {
    // @ts-ignore
    window.tiles
      .getTileDefinitions()
      // @ts-ignore
      .then((definitions) => {
        setDefinitions(definitions);
      })
      .catch((err: any) => {
        console.error(err);
      });
  }, []);

  const buildingTiles: BuildingEntry[] = useMemo(() => {
    return (
      // @ts-ignore
      definitions?.buildingDefinitions?.flatMap((config) =>
        buildingList.flatMap(hydrateBuildingTilesFromConfig(config))
      ) ?? []
    );
  }, [definitions]);

  const furnitureTiles: Furniture[] = useMemo(() => {
    return (
      // @ts-ignore
      definitions?.furnitureDefinitions?.flatMap((config) =>
        furnitureList.flatMap(hydrateFurnitureTilesFromConfig(config))
      ) ?? []
    );
  }, [definitions]);

  if (!definitions) {
    return null;
  }

  return (
    <FileOverview
      buildingTiles={buildingTiles}
      furnitureTiles={furnitureTiles}
    />
  );
};

root.render(
  <React.StrictMode>
    <ThemeProvider theme={defaultTheme}>
      <Definitions />
    </ThemeProvider>
  </React.StrictMode>
);
