import { Divider, Group, Stack, Text, Title } from "@mantine/core";

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
      w="100%"
      className="hoverButton"
      component="button"
      onClick={onClick}
      gap="xl"
      pt="xl"
      pb={0}
      px={0}
      ta="left"
      bd="none"
      style={{
        background: "white",
        cursor: "pointer",
      }}
    >
      <Group justify="space-between" px="sm">
        <Title size="h3">{name}</Title>
        <Text>{"@" + lookup}</Text>
      </Group>
      <Text truncate="end" px="sm">
        {resolvedDesc}
      </Text>
      <Divider size="sm" color="black" />
    </Stack>
  );
};

export default Entry;
