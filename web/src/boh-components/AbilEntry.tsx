import { Box, Flex, Group, Stack, Text, Title } from "@mantine/core";
import "../../styles.css";
import { useThemeColor } from "../hooks/useThemeColor";
import { MAGENTA, PINK, YELLOW } from "../../../shared/constants";
import { Entry, type EntryBaseProps } from "../boh-generics/Entry";
import { AbilCard } from "../../../shared/types";
import { useEffect, useState } from "react";
import { CardEntry } from "../boh-generics/CardEntry";

interface AbilEntryProps extends EntryBaseProps {
  abil: AbilCard;
  onClick: () => void;
}

const AbilEntry = ({
  abil,
  onClick,
  selecting,
  onSelect = () => {},
  onDelete = () => {},
  selectionRef,
}: AbilEntryProps) => {
  const { themeColor } = useThemeColor()!;
  const [selected, setSelected] = useState<boolean>(false);

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
      selected={selected}
      setSelected={setSelected}
    >
      <CardEntry
        card={abil}
        cardType="Ability"
        cardColor={cardColor}
        className={buttonColor}
        onClick={() => {
          if (selecting) {
            setSelected(!selected);
            onSelect(abil.MYlookup);
          } else {
            onClick();
          }
        }}
      />
    </Entry>
  );
};

export default AbilEntry;
