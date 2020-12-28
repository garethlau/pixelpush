import { createContext, useState } from "react";

export const UploadProgressContext = createContext();

export function UploadProgressProvider({ children }) {
  // Progress is value between 0 and 1
  const [uploads, setUploads] = useState({});
  const [curr, setCurr] = useState(null);

  function startProgress(key) {
    setUploads((prev) => {
      prev[key] = 0;
      return prev;
    });
    setCurr(key);
  }

  function setProgress(key, loaded, total) {
    setUploads((prev) => ({
      ...prev,
      [key]: loaded / total,
    }));
  }

  function completeProgress(key) {
    setUploads((prev) => {
      let next = Object.assign({}, prev);
      delete next[key];
      return next;
    });
    setCurr(null);
  }

  function getProgress(key) {
    return uploads[key] || 0;
  }

  function isUploading(key) {
    return curr === key;
  }

  return (
    <UploadProgressContext.Provider
      value={{
        setProgress,
        getProgress,
        completeProgress,
        startProgress,
        isUploading,
        uploads,
      }}
    >
      {children}
    </UploadProgressContext.Provider>
  );
}
