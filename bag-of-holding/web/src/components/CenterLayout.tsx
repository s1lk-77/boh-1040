import type { ReactNode } from "react";
import { Center, type CenterProps } from "@mantine/core";

interface CenterLayoutProps extends CenterProps {
  asOverlay?: boolean;
  fullWidth?: boolean;
  children?: ReactNode;
}

/**
 * A component that centers its children in the center of the screen with an optional full screen
 * mode and additional corner content. Supports all props from Mantine's Center component.
 *
 * @param asOverlay - Whether to render as a full screen overlay (default: false)
 * @param fullWidth - Whether to render with full width (default: false)
 * @param children - The children to center
 */
function CenterLayout({
  asOverlay,
  fullWidth,
  children,
  ...props
}: CenterLayoutProps) {
  const centerProps: CenterProps = {
    pos: asOverlay ? "absolute" : "relative",
    inset: 0,
    ...props,
  };
  if (fullWidth) centerProps.w = "100%";

  return <Center {...centerProps}>{children}</Center>;
}

export default CenterLayout;
