import { Box, Flex, Group, Stack, Text, Title } from "@mantine/core";
import "../../styles.css";
import { useThemeColor } from "../hooks/useThemeColor";
import { MAGENTA, PINK, YELLOW } from "../../../shared/constants";
import { Entry, type EntryProps } from "../boh-generics/Entry";
import { AbilCard } from "../../../shared/types";
import { useCallback, useState } from "react";
import { CardEntry } from "../boh-generics/CardEntry";

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

  const refCb = useCallback((node: HTMLDivElement | null) => {
    if (node) setClickable(node);
  }, []);

  const cardColor =
    themeColor === "y" ? YELLOW : themeColor === "m" ? MAGENTA : PINK;
  const buttonColor =
    themeColor === "y"
      ? "hoverButton"
      : themeColor === "m"
        ? "hoverMagentaButton"
        : "hoverPinkButton";

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
      <CardEntry
        card={abil}
        cardType="Ability"
        cardColor={cardColor}
        className={buttonColor}
        refCb={refCb}
      />
    </Entry>
  );
};

export default AbilEntry;
