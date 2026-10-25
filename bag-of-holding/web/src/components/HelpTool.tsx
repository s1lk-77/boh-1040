import { Stack, Button, Popover, type StackProps } from "@mantine/core";
import { CircleHelp } from "lucide-react";
import "../../styles.css";
import { useState } from "react";

interface HelpToolProps extends StackProps {
  children: React.ReactNode;
}

const HelpTool = ({ children, ...props }: HelpToolProps) => {
  const [opened, setOpened] = useState(false);
  return (
    <Stack {...props} pos="absolute" left="100%">
      <Popover
        opened={opened}
        onChange={setOpened}
        position="right"
        withArrow
        width={250}
        arrowSize={12}
        offset={-8}
        styles={{
          arrow: {
            border: "2px solid black",
          },
        }}
      >
        <Popover.Target>
          <Button
            c="black"
            bg="none"
            className="hoverTransparentButton"
            onClick={() => setOpened((o) => !o)}
          >
            <CircleHelp fill={opened ? "var(--mantine-color-red-3)" : "none"} />
          </Button>
        </Popover.Target>
        <Popover.Dropdown
          bg="red.3"
          bd="2px solid black"
          style={
            {
              "--popover-border-color": "black",
            } as React.CSSProperties
          }
        >
          {children}
        </Popover.Dropdown>
      </Popover>
    </Stack>
  );
};

export default HelpTool;
