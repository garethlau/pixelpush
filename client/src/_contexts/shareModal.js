import { useState, createContext } from "react";
import ShareModal from "../_components/ShareModal";

export const ShareModalContext = createContext();

export function ShareModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  function open() {
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
  }

  return (
    <ShareModalContext.Provider
      value={{
        isOpen,
        open,
        close,
      }}
    >
      <ShareModal isOpen={isOpen} open={open} close={close} />
      {children}
    </ShareModalContext.Provider>
  );
}
