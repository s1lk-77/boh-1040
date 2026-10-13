import type { ReactNode } from "react";
import { Box } from "@mantine/core";
import CenterLayout from "./CenterLayout";

// TODO CITE MIT STEP PSims FOR PROVIDING THIS CODE

interface MobileViewportProps {
  children: ReactNode;
}

/**
 * A component that simulates a mobile viewport by rendering content in a box with a
 * limited width and height.
 *
 * @param children - Any content to be rendered inside this component
 */
function MobileViewport({ children }: MobileViewportProps) {
  return (
    <CenterLayout asOverlay bg="gray.8">
      <Box
        w="100%"
        h="100%"
        maw="var(--mantine-breakpoint-xs)"
        mah="48rem"
        bg="white"
        pos="relative"
      >
        <Box
          w="100%"
          h="100%"
          style={{ overflowY: "auto", scrollbarWidth: "none" }}
        >
          <Box p="min(1rem, 2vh)" h="100%">
            {children}
          </Box>
        </Box>
      </Box>
    </CenterLayout>
  );
}

export default MobileViewport;
