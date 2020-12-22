import { createContext, useState } from "react";

export const UploadProgressContext = createContext();

export function UploadProgressProvider({ children }) {
  // Progress is value between 0 and 1
  const [progress, setProgress] = useState(0);

  return (
    <UploadProgressContext.Provider value={{ progress, setProgress }}>
      {children}
    </UploadProgressContext.Provider>
  );
}
