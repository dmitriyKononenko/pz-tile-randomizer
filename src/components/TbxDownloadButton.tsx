import { Button } from "@mui/material";
import { Fragment, useRef, FC } from "react";
import DownloadIcon from "@mui/icons-material/Download";

import { Tbx } from "../tbx/tbx";

export interface DownloadButtonProps {
  tbx: Tbx;
  name: string;
}

export const TbxDownloadButton: FC<DownloadButtonProps> = ({ tbx, name }) => {
  const ref = useRef(null);

  const handleDownload = () => {
    ref.current?.click();
  };

  return (
    <Fragment>
      <a
        style={{ visibility: "hidden" }}
        ref={ref}
        download={name}
        href={`data:application/tbx;base64,${btoa(tbx.toString())}`}
      ></a>
      <Button
        component="label"
        variant="text"
        color="inherit"
        startIcon={<DownloadIcon />}
        onClick={handleDownload}
      >
        Download
      </Button>
    </Fragment>
  );
};
