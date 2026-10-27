import { Stack, Title, Text, ScrollArea, Box } from "@mantine/core";
import Card from "./Card";
import {
  MAGENTA,
  PINK,
  SMALL_FRAME_WIDTH,
  YELLOW,
} from "../../../shared/constants";
import { formatDate } from "../utilities";
import { AbilColor, BaseCard } from "../../../shared/types";
import "../../styles.css";
import "../assets/flipcard.css";
import { useThemeColor } from "../hooks/useThemeColor";

interface CardFrontProps {
  owned: boolean;
  gameName: string;
  playerName?: string;
  card: BaseCard;
}

const CardFront = ({ owned, gameName, playerName, card }: CardFrontProps) => {
  const { themeColor } = useThemeColor()!;
  const today: Date = new Date();
  const cardType = "Ability Card";
  const tr = owned ? (playerName ?? "silvanvs") : "Not Transferable";
  const bl = owned ? gameName + " / " + formatDate(today) : gameName;
  const br = owned ? "Not Transferable" : formatDate(today);

  return (
    <Card
      justify="space-evenly"
      tl={cardType}
      tr={tr}
      bl={bl}
      br={br}
      bg={themeColor === "y" ? YELLOW : themeColor === "m" ? MAGENTA : PINK}
      className="flip-card-front"
    >
      <Stack align="center">
        <Title size="h2" ta="center">
          {card.MYname === "" ? "Unnamed Ability" : card.MYname}
        </Title>
        <Text className="u-fira-code">{`@${card.MYlookup}`}</Text>
      </Stack>
      <ScrollArea
        w={SMALL_FRAME_WIDTH}
        type="auto"
        mih={0}
        scrollbars="y"
        offsetScrollbars="present"
        viewportProps={{
          style: {
            pointerEvents: "auto",
            touchAction: "pan-y",
            WebkitOverflowScrolling: "touch",
            display: "flex",
            flexDirection: "column",
            height: "100%",
          },
        }}
        data-framer-invalidate
      >
        <Stack mih="100%" align="center" justify="center" h="100%">
          <Text style={{ whiteSpace: "pre-wrap" }}>
            {!card.MYtext ? "no description given" : card.MYtext}
          </Text>
        </Stack>
      </ScrollArea>
    </Card>
  );
};

export default CardFront;
