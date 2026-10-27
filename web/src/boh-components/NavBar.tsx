import { Button, Group, GroupProps, Flex } from "@mantine/core";
import { STANDARD_FRAME_WIDTH } from "../../../shared/constants";
import {
  Palette,
  RefreshCcw,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import "../../styles.css";
import { useFlip } from "../hooks/useFlip";

interface NavBarProps extends GroupProps {
  toggleSearch: () => void;
  toggleSettings: () => void;
  showHome?: boolean;
  searching: boolean;
  setting: boolean;
  onIndex: (dir: 1 | -1) => void;
}

const NavBar = ({
  showHome = true,
  toggleSearch,
  toggleSettings,
  searching,
  setting,
  onIndex,
  ...props
}: NavBarProps) => {
  const iFlip = useFlip();

  return (
    <Group
      {...props}
      justify="space-between"
      w={STANDARD_FRAME_WIDTH}
      pos="relative"
      gap="xs"
      wrap="nowrap"
    >
      <Button
        h="auto"
        c="black"
        bg="none"
        className="hoverTransparentButton"
        onClick={toggleSettings}
        pr={0}
      >
        {setting ? (
          <X color="var(--mantine-color-red-8)" className="hoverRotateXs" />
        ) : (
          <Palette />
        )}
      </Button>
      {showHome && (
        <>
          <Button
            p={0}
            bg="gray.3"
            c="black"
            onClick={() => {
              onIndex(-1);
            }}
          >
            <ChevronLeft />
          </Button>
          <Button
            h="auto"
            c="black"
            bg="none"
            className="hoverTransparentButton"
            p={0}
            onClick={() => {
              iFlip?.flipRef.current?.();
            }}
          >
            <Flex direction="column">
              <RefreshCcw size={30} className="hoverRotate" />
              Flip
            </Flex>
          </Button>
          <Button
            p={0}
            bg="gray.3"
            c="black"
            onClick={() => {
              onIndex(1);
            }}
          >
            <ChevronRight />
          </Button>
        </>
      )}
      <Button
        onClick={toggleSearch}
        h="auto"
        c="black"
        bg="none"
        className="hoverTransparentButton"
        pl={0}
      >
        {searching ? (
          <X color="var(--mantine-color-red-8)" className="hoverRotateXs" />
        ) : (
          <Plus />
        )}
      </Button>
    </Group>
  );
};

export default NavBar;
