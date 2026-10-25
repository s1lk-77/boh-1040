import { Button, Group, GroupProps } from "@mantine/core";
import { STANDARD_FRAME_WIDTH } from "../../../shared/constants";
import { Settings, CircleSmall, Plus, X } from "lucide-react";
import "../../styles.css";

interface NavBarProps extends GroupProps {
  toggleSearch: () => void;
  showHome?: boolean;
  goHome: () => void;
  searching?: boolean;
}

const NavBar = ({
  showHome = true,
  toggleSearch,
  goHome,
  searching = false,
  ...props
}: NavBarProps) => {
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
          onClick={goHome}
          className="hoverTransparentButton"
        >
          <CircleSmall />
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
