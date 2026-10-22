import { type ReactNode, useCallback, useRef } from "react";
import { Button, Text } from "@mantine/core";
import { ArrowLeftToLine } from "lucide-react";

export interface IBack {
  BackButton: ReactNode;
  setBackCb: (cb: () => void) => void;
}

const useBackButton = (): IBack => {
  const callbackRef = useRef<() => void | null>(null);

  const setBackCb = useCallback((cb: () => void) => {
    callbackRef.current = cb;
  }, []);

  const BackButton = (
    <Button
      className="hoverTransparentButton"
      top={0}
      pt="sm"
      left={0}
      bg="none"
      c="black"
      pos="absolute"
      onClick={() => {
        callbackRef.current?.();
      }}
    >
      <ArrowLeftToLine size={24} />
    </Button>
  );

  return { setBackCb, BackButton };
};

export default useBackButton;
