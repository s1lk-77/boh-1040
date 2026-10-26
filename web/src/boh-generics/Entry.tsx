import { Button, Box, Flex, Group, Stack, Text, Title } from "@mantine/core";
import "../../styles.css";
import { motion } from "motion/react";
import { Square, Check, Trash } from "lucide-react";
import { useState } from "react";

interface EntryProps {
  name: string;
  lookup: string;
  onClick: () => void;
  desc?: string;
  selecting?: boolean;
}

const Entry = ({
  name,
  lookup,
  onClick,
  desc = undefined,
  selecting = false,
}: EntryProps) => {
  const [selected, setSelected] = useState<boolean>(false);

  const resolvedDesc: string =
    desc === undefined || desc === "" ? "no description text given" : desc;

  return (
    <Group w="100%" gap={0}>
      <motion.div
        whileTap={{ y: 5 }}
        style={{
          flex: 1,
          minWidth: 0,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Stack
          flex={1}
          className="hoverButton"
          component="button"
          onClick={() => {
            if (selecting) {
              setSelected(!selected);
            } else {
              onClick();
            }
          }}
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
            <Title size="h3" c="black">
              {name === "" ? "Unnamed Ability" : name}
            </Title>

            <Text className="u-fira-code" c="black">
              {"@" + lookup}
            </Text>
          </Group>
          <Box flex={1} miw={0}>
            <Text truncate="end" px="sm" c="black">
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
      {selecting && (
        <Stack>
          <Button
            bg="none"
            c="black"
            styles={{
              root: {
                paddingLeft: "var(--mantine-spacing-xs)",
                paddingRight: 0,
              },
            }}
            onClick={() => {
              setSelected(!selected);
            }}
          >
            {selected ? (
              <Check />
            ) : (
              <svg
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://w3.org"
              />
            )}
          </Button>
          <Button
            className="hoverTransparentButton"
            bg="none"
            c="black"
            styles={{
              root: {
                paddingLeft: "var(--mantine-spacing-xs)",
                paddingRight: 0,
              },
            }}
          >
            <Trash />
          </Button>
        </Stack>
      )}
    </Group>
  );
};

export default Entry;
