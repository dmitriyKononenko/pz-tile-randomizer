import { useState } from "react";
import { Box, Button, ButtonGroup, Card, Typography } from "@mui/material";

import { SelectDialog } from "./SelectDialog";

export interface GameTileProps<T> {
  value: T;
  options: T[];
  onChange?: (tileEntry: T) => void;
  onRandom?: () => void;
  title?: string;
  place?: string;
  renderer: (Tile: T) => React.ReactNode;
}

export function GameTile<T>({
  value,
  options,
  onChange,
  onRandom,
  title,
  renderer,
}: GameTileProps<T>) {
  const [open, setOpen] = useState(false);

  const handleSetRandom = () => {
    onRandom?.();
  };

  const handleChange = (option: T) => {
    onChange?.(option);
    setOpen(false);
  };

  return (
    <>
      <Card
        raised
        sx={{
          width: 170,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          boxSizing: "border-box",
          py: 1,
        }}
      >
        <Box px={1}>
          <Typography variant="caption">{title}</Typography>
        </Box>
        <Box
          display="flex"
          flexWrap="wrap"
          onClick={() => setOpen(true)}
          sx={{ cursor: "pointer" }}
        >
          {renderer(value)}
        </Box>
        <Box
          display="flex"
          flexWrap="wrap"
          justifyContent="start"
          sx={{
            "&>*": {
              marginTop: "auto",
            },
          }}
        >
          <ButtonGroup
            variant="contained"
            aria-label="outlined primary button group"
          >
            <Button size="small" onClick={handleSetRandom}>
              Rand
            </Button>
            <Button size="small" onClick={() => setOpen(true)}>
              Select
            </Button>
          </ButtonGroup>
        </Box>
      </Card>
      <SelectDialog
        open={open}
        options={options}
        value={value}
        onChange={handleChange}
        onClose={() => setOpen(false)}
        renderOption={renderer}
      />
    </>
  );
}
