import {
  Stack,
  Button,
  Popover,
  type StackProps,
  type MantineColorScheme,
} from "@mantine/core";
import { CircleHelp } from "lucide-react";
import "../../styles.css";
import { useState } from "react";

interface HelpToolProps extends StackProps {
  children: React.ReactNode;
  fillColor?: string;
  flushRight?: boolean;
  popLeft?: boolean;
}

const HelpTool = ({
  children,
  flushRight = false,
  fillColor = "var(--mantine-color-gray-4)",
  popLeft = false,
  ...props
}: HelpToolProps) => {
  const [opened, setOpened] = useState(false);
  return (
    <Stack
      {...props}
      pos="absolute"
      left={flushRight ? undefined : "100%"}
      right={flushRight ? 0 : undefined}
      top={0}
    >
      <Popover
        opened={opened}
        onChange={setOpened}
        position={popLeft ? "left" : "right"}
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
            <CircleHelp fill={opened ? fillColor : "none"} />
          </Button>
        </Popover.Target>
        <Popover.Dropdown
          bg={fillColor}
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
