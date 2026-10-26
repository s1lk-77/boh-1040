import { Box, Flex, Group, Stack, Text, Title } from "@mantine/core";
import "../../styles.css";
import { motion } from "motion/react";

interface EntryProps {
  name: string;
  lookup: string;
  onClick: () => void;
  desc?: string;
}

const Entry = ({ name, lookup, onClick, desc = undefined }: EntryProps) => {
  const resolvedDesc: string =
    desc === undefined || desc === "" ? "no description text given" : desc;
  return (
    <motion.div
      whileTap={{ y: 5 }}
      style={{ width: "100%", minWidth: 0, overflow: "hidden" }}
    >
      <Stack
        w="100%"
        className="hoverButton"
        component="button"
        onClick={onClick}
        gap="lg"
        pt="sm"
        px={0}
        ta="left"
        bd="2px solid black"
        bg="yellow.5"
        style={{
          background: "white",
          cursor: "pointer",
          minWidth: 0,
          overflow: "hidden",
        }}
        my="sm"
      >
        <Group justify="space-between" px="sm">
          <Title size="h3">{name === "" ? "Unnamed Ability" : name}</Title>

          <Text className="u-fira-code">{"@" + lookup}</Text>
        </Group>
        <Box flex={1} miw={0}>
          <Text truncate="end" px="sm">
            {resolvedDesc}
          </Text>
        </Box>
        {/* <Divider size="sm" color="black" /> */}
        <Flex direction="column" w="100%" align="flex-end">
          <Text mr="0.2rem" c="gray.7" size="sm">
            Ability
          </Text>
          {/* <Divider size="xs" color="black" /> */}
        </Flex>
      </Stack>
    </motion.div>
  );
};

export default Entry;
