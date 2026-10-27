import { Group, Flex, type FlexProps } from "@mantine/core";
import { useRef, useEffect } from "react";
import {
  MAGENTA,
  PINK,
  STANDARD_FRAME_WIDTH,
  YELLOW,
} from "../../../shared/constants";
import { Square } from "lucide-react";
import "../../styles.css";
import { motion } from "motion/react";
import { useThemeColor } from "../hooks/useThemeColor";

interface ColorPickerProps extends FlexProps {
  onClose: () => void;
}

const ColorPicker = ({ onClose, ...props }: ColorPickerProps) => {
  const searchRef = useRef<HTMLDivElement>(null);
  const { setThemeColor } = useThemeColor()!;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if the ref exists, and if the clicked target is NOT inside the element
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        onClose(); // Action to take when clicked outside
      }
    };

    window.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <Flex
      {...props}
      ref={searchRef}
      w={STANDARD_FRAME_WIDTH}
      h="12%"
      align="center"
      bg="gray.3"
      pl="sm"
      bdrs="md"
    >
      <motion.div
        style={{ width: "100%", display: "flex", alignItems: "center" }}
        initial={{ y: 10 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", bounce: 0 }}
      >
        <Group w="100%" px="md" justify="center">
          <Square
            className="u-pointer"
            size={48}
            fill={YELLOW}
            onClick={() => {
              setThemeColor("y");
            }}
          />
          <Square
            className="u-pointer"
            size={48}
            fill={MAGENTA}
            onClick={() => {
              setThemeColor("m");
            }}
          />
          <Square
            className="u-pointer"
            size={48}
            fill={PINK}
            onClick={() => {
              setThemeColor("p");
            }}
          />
        </Group>
      </motion.div>
    </Flex>
  );
};

export default ColorPicker;
