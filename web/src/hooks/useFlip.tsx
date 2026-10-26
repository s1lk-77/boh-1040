import React, {
  createContext,
  useContext,
  type ReactNode,
  useRef,
} from "react";

// create context
type Handler = () => void;
interface IFlip {
  setFlipHandler: (handler: Handler) => void;
  flipRef: React.RefObject<Handler | null>;
}
const FlipContext = createContext<IFlip | null>(null);

// context provider
/**
 * Provides the flip handling context for BoH
 * @param children the rest of the app
 * @returns the flip context provider
 */
export function FlipProvider({ children }: { children: ReactNode }) {
  const flipRef = useRef<Handler | null>(null);
  const setFlipHandler = (handler: Handler) => {
    flipRef.current = handler;
  };
  const iFlip: IFlip = { flipRef, setFlipHandler };

  return <FlipContext.Provider value={iFlip}>{children}</FlipContext.Provider>;
}

/**
 * Custom hook for the client context
 * @returns the client context
 */
export const useFlip = () => useContext(FlipContext);
