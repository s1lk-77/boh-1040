import { Divider, Flex, ScrollArea, Text, Group, Input } from "@mantine/core";
import { STANDARD_FRAME_WIDTH } from "../../../shared/constants";
import { Fragment } from "react/jsx-runtime";
import Entry from "../boh-generics/Entry";
import { BaseCard } from "../../../shared/types";

interface CatalogProps {
  entries: BaseCard[];
  onDisplay: (lookup: string) => void;
}

const Catalog = ({ entries, onDisplay }: CatalogProps) => {
  return (
    <Flex
      direction="column"
      bd="solid black 3px"
      w={STANDARD_FRAME_WIDTH}
      flex={1}
      mih={0}
    >
      <Group p="xs" fw="bold" ta="center">
        <Text>Heading</Text>
        <Input placeholder="filter..." />
      </Group>
      <Divider size="sm" mb={0} color="black" aria-hidden />
      <ScrollArea
        flex={1}
        type="auto"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {entries.map((entry, i) => {
          const key = "MYtext";
          let desc: string | undefined = undefined;
          if ("MYtext" in entry && typeof entry["MYtext"] === "string") {
            desc = entry["MYtext"];
          }

          return (
            <Fragment key={`${entry}-${i}`}>
              <Entry
                name={entry.MYname}
                lookup={entry.MYlookup}
                desc={desc}
                onClick={() => onDisplay(entry.MYlookup)}
              />
            </Fragment>
          );
        })}
      </ScrollArea>
    </Flex>
  );
};

export default Catalog;
