import { Box, Flex, Group, Stack, Text, Title } from "@mantine/core";
import "../../styles.css";
import { useThemeColor } from "../hooks/useThemeColor";
import { MAGENTA, PINK, YELLOW } from "../../../shared/constants";
import { Entry, type EntryProps } from "../boh-generics/Entry";
import { AbilCard } from "../../../shared/types";
import { useState } from "react";

interface AbilEntryProps extends Omit<
  EntryProps,
  "identifier" | "children" | "clickable"
> {
  abil: AbilCard;
}

const AbilEntry = ({
  abil,
  onClick,
  selecting = false,
  onSelect = () => {},
  onDelete = () => {},
  selectionRef,
}: AbilEntryProps) => {
  const { themeColor } = useThemeColor()!;
  const [clickable, setClickable] = useState<HTMLDivElement | null>(null);

  const resolvedDesc: string =
    abil.MYtext === undefined || abil.MYtext === ""
      ? "no description text given"
      : abil.MYtext;

  return (
    <Entry
      identifier={abil.MYlookup}
      selecting={selecting}
      onSelect={onSelect}
      onDelete={onDelete}
      selectionRef={selectionRef}
      onClick={onClick}
      clickable={clickable}
    >
      <Stack
        flex={1}
        ref={(node) => {
          if (node) setClickable(node);
        }}
        className={
          themeColor === "y"
            ? "hoverButton"
            : themeColor === "m"
              ? "hoverMagentaButton"
              : "hoverPinkButton"
        }
        component="div"
        gap="lg"
        pt="sm"
        px={0}
        ta="left"
        bd="2px solid black"
        bg={themeColor === "y" ? YELLOW : themeColor === "m" ? MAGENTA : PINK}
        style={{
          background: "white",
          cursor: "pointer",
          minWidth: 0,
          touchAction: "pan-y",
        }}
        my="sm"
      >
        <Group justify="space-between" px="sm">
          <Title size="h3" c="black">
            {abil.MYname === "" ? "Unnamed Ability" : abil.MYname}
          </Title>

          <Text className="u-fira-code" c="black">
            {"@" + abil.MYlookup}
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
    </Entry>
  );
};

export default AbilEntry;
