import { Button, Group, GroupProps } from "@mantine/core";
import { STANDARD_FRAME_WIDTH } from "../../../shared/constants";
import { Settings, CornerDownLeft, Plus } from "lucide-react";
import "../../styles.css";

interface NavBarProps extends GroupProps {
  toggleSearch: () => void;
  showHome?: boolean;
  goHome: () => void;
}

const NavBar = ({
  showHome = true,
  toggleSearch,
  goHome,
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
      <Button
        onClick={toggleSearch}
        h="auto"
        c="black"
        bg="none"
        className="hoverTransparentButton"
      >
        <Plus />
      </Button>
      {showHome && (
        <Button
          h="auto"
          c="black"
          bg="none"
          onClick={goHome}
          className="hoverTransparentButton"
        >
          <CornerDownLeft />
        </Button>
      )}
    </Group>
  );
};

export default NavBar;
