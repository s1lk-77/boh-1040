import { Divider, Stack, ScrollArea, Text, Group, Input } from "@mantine/core";
import { STANDARD_FRAME_WIDTH } from "../../../shared/constants";
import { Fragment } from "react/jsx-runtime";
import Entry from "../boh-generics/Entry";

interface CatalogProps {
  entries: { name: string; lookup: string }[];
  onDisplay: (lookup: string) => void;
}

const Catalog = ({ entries, onDisplay }: CatalogProps) => {
  return (
    <Stack bd="solid black 3px" w={STANDARD_FRAME_WIDTH} flex={1} mih={0}>
      <ScrollArea
        flex={1}
        type="auto"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <Group p="xs" fw="bold" ta="center">
          <Text>Heading</Text>
          <Input placeholder="filter..." />
        </Group>
        <Divider size="sm" color="black" aria-hidden />
        {entries.map((entry, i) => (
          <Fragment key={`${entry}-${i}`}>
            <Entry
              name={entry.name}
              lookup={entry.lookup}
              onClick={() => onDisplay(entry.lookup)}
            />
          </Fragment>
        ))}
      </ScrollArea>
    </Stack>
  );
};

export default Catalog;
