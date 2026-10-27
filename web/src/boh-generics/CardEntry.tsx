import "../../styles.css";
import { useThemeColor } from "../hooks/useThemeColor";
import { MAGENTA, PINK, YELLOW } from "../../../shared/constants";
import { Entry, type EntryBaseProps } from "./Entry";
import { BaseCard, CardType, CatalogTypeMap } from "../../../shared/types";
import { useState } from "react";
import { CardEntryPanel } from "./CardEntryPanel";

interface CardEntryProps<T extends CardType> extends EntryBaseProps {
  card: CatalogTypeMap[T]["model"];
  cardType: T;
  onClick: () => void;
}

const CardEntry = <T extends CardType>({
  card,
  cardType,
  onClick,
  selecting,
  onSelect = () => {},
  onDelete = () => {},
  selectionRef,
}: CardEntryProps<T>) => {
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
      identifier={card.MYlookup}
      selecting={selecting}
      onSelect={onSelect}
      onDelete={onDelete}
      selectionRef={selectionRef}
      selected={selected}
      setSelected={setSelected}
    >
      <CardEntryPanel
        card={card}
        cardType={cardType}
        cardColor={cardType === "Ability" ? cardColor : "gray.4"}
        className={cardType === "Ability" ? buttonColor : "hoverGrayButton"}
        onClick={() => {
          if (selecting) {
            setSelected(!selected);
            onSelect(card.MYlookup);
          } else {
            onClick();
          }
        }}
      />
    </Entry>
  );
};

export default CardEntry;
