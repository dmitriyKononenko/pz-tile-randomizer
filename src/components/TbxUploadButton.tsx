import { FC } from "react";
import { Button, styled } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import { Tbx } from "../tbx/tbx";

export interface TbxUploadButtonProps {
  onUpload: (data: Tbx, name: string) => void;
}

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export const TbxUploadButton: FC<TbxUploadButtonProps> = ({ onUpload }) => {
  const handleFileUpload = (event: any) => {
    const [file] = event.target.files;

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onerror = () => {
      alert("Error reading file");
    };

    reader.onloadend = () => {
      const tbx = Tbx.fromString(String(reader.result));
      onUpload(tbx, file.name);
    };

    if (!event.target.files?.length) {
      return;
    }

    reader.readAsText(file);
  };

  return (
    <Button
      component="label"
      variant="text"
      color="inherit"
      startIcon={<CloudUploadIcon />}
    >
      Upload file
      <VisuallyHiddenInput type="file" onChange={handleFileUpload} />
    </Button>
  );
};
