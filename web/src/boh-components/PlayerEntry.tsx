import "../../styles.css";
import { useThemeColor } from "../hooks/useThemeColor";
import { MAGENTA, PINK, YELLOW } from "../../../shared/constants";
import { Entry, type EntryBaseProps } from "../boh-generics/Entry";
import { type BaseCard } from "../../../shared/types";
import { useState } from "react";
import { CardEntry } from "../boh-generics/CardEntry";

interface PlayerEntryProps extends EntryBaseProps {
  player: BaseCard;
  onClick: () => void;
}

const PlayerEntry = ({
  player,
  onClick,
  selecting,
  onSelect = () => {},
  onDelete = () => {},
  selectionRef,
}: PlayerEntryProps) => {
  const [selected, setSelected] = useState<boolean>(false);

  const cardColor = "red.3";
  const buttonColor = "hoverRedButton";

  return (
    <Entry
      identifier={player.MYlookup}
      selecting={selecting}
      onSelect={onSelect}
      onDelete={onDelete}
      selectionRef={selectionRef}
      selected={selected}
      setSelected={setSelected}
    >
      <CardEntry
        card={player}
        cardType="Player"
        cardColor={cardColor}
        className={buttonColor}
        onClick={() => {
          if (selecting) {
            setSelected(!selected);
            onSelect(player.MYlookup);
          } else {
            onClick();
          }
        }}
      />
    </Entry>
  );
};

export default PlayerEntry;
