import { createContext, useState } from "react";

export const PhotoDetailsContext = createContext();

export function PhotoDetailsProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [photo, setPhoto] = useState(null);

  function open(photoDetails) {
    setPhoto(photoDetails);
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
  }

  return (
    <PhotoDetailsContext.Provider
      value={{
        isOpen,
        photo,
        open,
        close,
      }}
    >
      {children}
    </PhotoDetailsContext.Provider>
  );
}
