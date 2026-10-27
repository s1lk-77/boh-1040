import { AbilColor } from "../../../shared/types";
import React, {
  createContext,
  useContext,
  type ReactNode,
  useRef,
  useState,
} from "react";

// create context
interface IThemeColor {
  setThemeColor: React.Dispatch<React.SetStateAction<AbilColor>>;
  themeColor: AbilColor;
}
const ThemeColorContext = createContext<IThemeColor | null>(null);

// context provider
/**
 * Provides the flip handling context for BoH
 * @param children the rest of the app
 * @returns the flip context provider
 */
export function ThemeColorProvider({ children }: { children: ReactNode }) {
  const [themeColor, setThemeColor] = useState<AbilColor>("y");
  const iFlip: IThemeColor = { themeColor, setThemeColor };

  return (
    <ThemeColorContext.Provider value={iFlip}>
      {children}
    </ThemeColorContext.Provider>
  );
}

/**
 * Custom hook for the client context
 * @returns the client context
 */
export const useThemeColor = () => useContext(ThemeColorContext);
