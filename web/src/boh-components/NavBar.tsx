import { Button, Group, GroupProps, Flex } from "@mantine/core";
import { STANDARD_FRAME_WIDTH } from "../../../shared/constants";
import { Settings, RefreshCcw, Plus, X } from "lucide-react";
import "../../styles.css";
import { useFlip } from "../hooks/useFlip";

interface NavBarProps extends GroupProps {
  toggleSearch: () => void;
  showHome?: boolean;
  searching?: boolean;
}

const NavBar = ({
  showHome = true,
  toggleSearch,
  searching = false,
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
      <Button h="auto" c="black" bg="none" className="hoverTransparentButton">
        <Settings />
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
