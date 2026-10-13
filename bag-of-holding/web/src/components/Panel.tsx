import type { ReactNode } from "react";
import {
  Box,
  Center,
  Paper,
  ScrollArea,
  Stack,
  Title,
  type CenterProps,
  type PaperProps,
  type ScrollAreaProps,
  type TitleProps,
} from "@mantine/core";

// TODO CITE MIT STEP PSims FOR PROVIDING THIS CODE

interface PanelProps extends PaperProps {
  children: ReactNode;
}

interface PanelHeaderProps extends CenterProps {
  title?: string; // takes precedence over children (if both are provided)
  children?: ReactNode;
  titleProps?: TitleProps;
  titleRef?: React.RefObject<HTMLDivElement | null>;
}

interface PanelBodyProps extends ScrollAreaProps {
  children: ReactNode;
}

interface PanelFooterProps extends CenterProps {
  children: ReactNode;
}

/**
 * A panel component that displays a card-like component (i.e., rounded corners, shadow),
 * meant to be used in a dashboard. The panel is a wrapper around Mantine's Paper component.
 *
 * The panel is best used with its Panel.Header, Panel.Body, and Panel.Footer components.
 * With these components, the header and footer are fixed while the body is scrollable.
 *
 * Panel supports all the props of the underlying Paper component.
 * Use props such as h, w, maw, mah, etc. to control the size of the panel.
 */
function Panel({ children, ...props }: PanelProps) {
  return (
    <Paper
      radius="md"
      shadow="xs"
      p="md"
      bg="gray.1"
      bd="1px solid gray.4"
      {...props}
    >
      <Stack h="100%">{children}</Stack>
    </Paper>
  );
}

/**
 * A header for a panel. If a title is provided, the children are ignored. Uses Mantine's
 * Center component under the hood, which is a flexbox container and supports all its props.
 *
 * @param title - The title to display in the header (optional)
 * @param children - The children to display in the header (optional)
 * @param titleProps - any props associated with the child Mantine Title component used in this component
 * @param titleRef - reference drilling down to the title for screenreader focus purposes
 */
function PanelHeader({
  title,
  children,
  titleProps,
  titleRef,
  ...props
}: PanelHeaderProps) {
  if (title) {
    children = (
      <Title ref={titleRef} order={2} {...titleProps}>
        {title}
      </Title>
    );
  }
  return (
    <Center flex={0} {...props}>
      {children}
    </Center>
  );
}

/**
 * A scrollable body for a panel. Supports all props from Mantine's ScrollArea
 * component.
 */
function PanelBody({ children, ...props }: PanelBodyProps) {
  return (
    <ScrollArea
      flex={1}
      type="auto"
      scrollbars="y"
      offsetScrollbars="present"
      bd="1px solid gray.3"
      bg="gray.0"
      {...props}
    >
      <Box p="md">{children}</Box>
    </ScrollArea>
  );
}

/**
 * A footer for a panel. The footer is fixed. Uses Mantine's Center component under the hood
 * (which is a flexbox container) and supports all its props.
 */
function PanelFooter({ children, ...props }: PanelFooterProps) {
  return (
    <Center flex={0} {...props}>
      {children}
    </Center>
  );
}

Panel.Header = PanelHeader;
Panel.Body = PanelBody;
Panel.Footer = PanelFooter;

export default Panel;
