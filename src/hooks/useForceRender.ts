import { useState } from "react";

// Stupid hook to force a re-render :)
export const useForceRender = () => {
  const [, setTick] = useState({});

  return () => setTick({});
};
