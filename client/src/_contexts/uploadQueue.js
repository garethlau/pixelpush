import { createContext } from "react";
import useQueue from "../_hooks/useQueue";

export const UploadQueueContext = createContext([]);

export function UploadQueueProvider({ children }) {
  const queue = useQueue([]);
  return (
    <UploadQueueContext.Provider value={{ uploadQueue: queue }}>
      {children}
    </UploadQueueContext.Provider>
  );
}
