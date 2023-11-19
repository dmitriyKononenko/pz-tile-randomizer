import { FC, useMemo, useState } from "react";
import { AppBar, Box, TextField, Toolbar, Typography } from "@mui/material";

import { Tbx } from "../../tbx/tbx";
import { FileRender } from "./FileRender";
import { TbxDataManager } from "../../tbx";
import { BuildingEntry, Furniture } from "../../model";
import { TbxDownloadButton, TbxUploadButton } from "../../components";

export interface FileOverviewProps {
  buildingTiles: BuildingEntry[];
  furnitureTiles: Furniture[];
}

export const FileOverview: FC<FileOverviewProps> = ({
  buildingTiles,
  furnitureTiles,
}) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [file, setFile] = useState<Tbx | null>(null);
  const manager = useMemo(() => file && new TbxDataManager(file), [file]);

  const handleFileUpload = (file: Tbx, name: string) => {
    setFile(file);
    setFileName(name.replace(/.tbx/i, ""));
  };

  const handleFileNameChange = (event: any) => {
    setFileName(event.target.value);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          {fileName && (
            <TextField
              variant="standard"
              value={fileName}
              onChange={handleFileNameChange}
              sx={{
                color: "#FFFFFF",
                "& .MuiInput-root": {
                  color: "white",
                },
                "& .MuiInput-root:before": {
                  display: "none",
                },
              }}
            />
          )}
          <Box
            ml="auto"
            sx={{
              "& > *": {
                marginLeft: 2,
              },
            }}
          >
            {file && fileName && (
              <TbxDownloadButton tbx={file} name={`${fileName}.tbx`} />
            )}
            <TbxUploadButton onUpload={handleFileUpload} />
          </Box>
        </Toolbar>
      </AppBar>
      {manager ? (
        <FileRender
          tbxManager={manager}
          buildingTiles={buildingTiles}
          furnitureTiles={furnitureTiles}
        />
      ) : (
        <Box mt="30%" display="flex" justifyContent="center" width="100%">
          <Typography variant="h3">Upload a TBX file</Typography>
        </Box>
      )}
    </Box>
  );
};
