import { Stack, Title, Text, ScrollArea } from "@mantine/core";
import Card from "./Card";
import {
  MAGENTA,
  PINK,
  SMALL_FRAME_WIDTH,
  YELLOW,
} from "../../../shared/constants";
import { formatDate } from "../utilities";
import { AbilColor, BaseCard } from "../../../shared/types";
import "../assets/flipcard.css";
import { useThemeColor } from "../hooks/useThemeColor";

interface CardBackProps {
  heading?: string;
  gameName: string;
  card: BaseCard;
}

const CardBack = ({
  heading = "Ability Effect",
  gameName,
  card,
}: CardBackProps) => {
  const { themeColor } = useThemeColor()!;
  const today: Date = new Date();
  const cardType = "Ability Card";
  const tr = "Not Transferable";
  const bl = gameName;
  const br = formatDate(today);
  return (
    <Card
      justify="space-evenly"
      tl={cardType}
      tr={tr}
      bl={bl}
      br={br}
      bg={themeColor === "y" ? YELLOW : themeColor === "m" ? MAGENTA : PINK}
      className="flip-card-back"
    >
      <Stack align="center">
        <Title size="h2">{heading}</Title>
      </Stack>
      <ScrollArea
        w={SMALL_FRAME_WIDTH}
        mih={0}
        type="auto"
        scrollbars="y"
        offsetScrollbars="present"
        bd="1px solid black"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <Stack mih="100%" align="center" justify="center" h="100%">
          <Text style={{ whiteSpace: "pre-wrap" }} ta="center">
            {!card.MYeffect ? "-" : card.MYeffect}
          </Text>
        </Stack>
      </ScrollArea>
    </Card>
  );
};

export default CardBack;
