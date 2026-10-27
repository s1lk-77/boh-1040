import { Button, Group, GroupProps, Flex } from "@mantine/core";
import { STANDARD_FRAME_WIDTH } from "../../../shared/constants";
import { Palette, RefreshCcw, Plus, X } from "lucide-react";
import "../../styles.css";
import { useFlip } from "../hooks/useFlip";

interface NavBarProps extends GroupProps {
  toggleSearch: () => void;
  toggleSettings: () => void;
  showHome?: boolean;
  searching: boolean;
  setting: boolean;
}

const NavBar = ({
  showHome = true,
  toggleSearch,
  toggleSettings,
  searching,
  setting,
  ...props
}: NavBarProps) => {
  const iFlip = useFlip();

  return (
    <Group
      {...props}
      justify="space-between"
      w={STANDARD_FRAME_WIDTH}
      pos="relative"
    >
      <Button
        h="auto"
        c="black"
        bg="none"
        className="hoverTransparentButton"
        onClick={toggleSettings}
      >
        {setting ? (
          <X color="var(--mantine-color-red-8)" className="hoverRotateXs" />
        ) : (
          <Palette />
        )}
      </Button>
      {showHome && (
        <Button
          h="auto"
          c="black"
          bg="none"
          className="hoverTransparentButton"
          onClick={() => {
            iFlip?.flipRef.current?.();
          }}
        >
          <Flex direction="column">
            <RefreshCcw size={30} className="hoverRotate" />
            Flip
          </Flex>
        </Button>
      )}
      <Button
        onClick={toggleSearch}
        h="auto"
        c="black"
        bg="none"
        className="hoverTransparentButton"
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
