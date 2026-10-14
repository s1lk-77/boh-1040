import { Button, Group, GroupProps } from "@mantine/core";
import { STANDARD_FRAME_WIDTH } from "../../../shared/constants";
import { Search, Settings } from "lucide-react";

interface NavBarProps extends GroupProps {
  toggleSearch: () => void;
}

const NavBar = ({ toggleSearch, ...props }: NavBarProps) => {
  return (
    <Group
      {...props}
      justify="space-between"
      w={STANDARD_FRAME_WIDTH}
      pos="relative"
    >
      <Button h="auto" c="black" bg="white">
        <Settings />
      </Button>
      <Button onClick={toggleSearch} h="auto" c="black" bg="white">
        <Search />
      </Button>
    </Group>
  );
};

export default NavBar;
