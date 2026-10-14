import { Divider, Flex, ScrollArea, Text, Group, Input } from "@mantine/core";
import { STANDARD_FRAME_WIDTH } from "../../../shared/constants";
import { Fragment } from "react/jsx-runtime";
import Entry from "../boh-generics/Entry";
import { BaseCard } from "../../../shared/types";
import { Filter } from "lucide-react";

interface CatalogProps {
  entries: BaseCard[];
  onDisplay: (lookup: string) => void;
}

const Catalog = ({ entries, onDisplay }: CatalogProps) => {
  return (
    <Flex
      direction="column"
      bd="solid black 2px"
      w={STANDARD_FRAME_WIDTH}
      flex={1}
      mih={0}
    >
      <Group p="xs" ta="center">
        <Filter />
        <Input
          placeholder="type to filter..."
          styles={{
            input: {
              border: "2px solid black",
              "&:focus": {
                borderColor: "var(--mantine-color-grape-6)",
              },
            },
          }}
        />
      </Group>
      <Divider size="sm" mb={0} color="black" aria-hidden />
      <ScrollArea
        flex={1}
        type="auto"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <Flex direction="column" align="center" gap="sm" mt="sm">
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
        </Flex>
      </ScrollArea>
    </Flex>
  );
};

export default Catalog;
