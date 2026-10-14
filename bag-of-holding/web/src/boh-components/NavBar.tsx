import { Button, Group, GroupProps } from "@mantine/core";
import { STANDARD_FRAME_WIDTH } from "../../../shared/constants";

interface NavBarProps extends GroupProps {}

const NavBar = ({ ...props }: NavBarProps) => {
  return (
    <Group {...props} justify="space-between" w={STANDARD_FRAME_WIDTH}>
      <Button>Collect</Button>
      <Button>Settings</Button>
    </Group>
  );
};

export default NavBar;
