import { Divider, Flex, Group, Stack, Text, Title } from "@mantine/core";

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
    <Stack
      w="92%"
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
      }}
    >
      <Group justify="space-between" px="sm">
        <Title size="h3">{name === "" ? "Unnamed Ability" : name}</Title>
        <Text>{"@" + lookup}</Text>
      </Group>
      <Text truncate="end" px="sm">
        {resolvedDesc}
      </Text>
      {/* <Divider size="sm" color="black" /> */}
      <Flex direction="column" w="100%" align="flex-end">
        <Text mr="0.2rem" c="gray.7" size="sm">
          Ability
        </Text>
        {/* <Divider size="xs" color="black" /> */}
      </Flex>
    </Stack>
  );
};

export default Entry;
