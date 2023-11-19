import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
} from "@mui/material";
import React, { ReactNode } from "react";

type SelectDialogProps = {
  open: boolean;
  options: any[];
  value: any;
  renderOption: (option: any) => ReactNode;
  onChange: (value: any) => void;
  onClose: () => void;
};

export const SelectDialog: React.FC<SelectDialogProps> = ({
  open,
  options,
  value,
  renderOption,
  onChange,
  onClose,
}) => {
  return (
    <Dialog open={open} maxWidth="md" onClose={onClose}>
      <DialogTitle>Select a tile</DialogTitle>
      <DialogContent>
        <Grid
          container
          rowSpacing={1}
          columnSpacing={1}
          columns={{ xs: 4, sm: 8, md: 12 }}
          sx={{ p: 2 }}
        >
          {options.map((option, i) => (
            <Grid item key={i}>
              <Box width="max-content">
                <Paper
                  sx={{
                    "&:hover": {
                      boxShadow: 5,
                      cursor: "pointer",
                    },
                  }}
                  elevation={value === option ? 5 : 0}
                  onClick={() => onChange(option)}
                >
                  {renderOption(option)}
                </Paper>
              </Box>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
