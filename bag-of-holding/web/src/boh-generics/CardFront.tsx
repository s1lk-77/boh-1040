import { Stack, Title, Text, ScrollArea, Box } from "@mantine/core";
import Card from "./Card";
import { SMALL_FRAME_WIDTH } from "../../../shared/constants";
import { formatDate } from "../utilities";

interface CardFrontProps {
  owned: boolean;
  gameName: string;
  playerName?: string;
}

const CardFront = ({ owned, gameName, playerName }: CardFrontProps) => {
  const today: Date = new Date();
  const cardType = "Ability Card";
  const tr = owned ? (playerName ?? "silvanvs") : "Not Transferable";
  const bl = owned ? gameName + " / " + formatDate(today) : gameName;
  const br = owned ? "Not Transferable" : formatDate(today);
  return (
    <Card justify="space-evenly" tl={cardType} tr={tr} bl={bl} br={br}>
      <Stack align="center">
        <Title size="h2">Title of Abil</Title>
        <Text>@lookup</Text>
      </Stack>
      <ScrollArea
        w={SMALL_FRAME_WIDTH}
        mih={0}
        type="auto"
        scrollbars="y"
        offsetScrollbars="present"
      >
        <Stack mih="100%" align="center" justify="center" h="100%">
          <Text>Just a short description</Text>
        </Stack>
      </ScrollArea>
    </Card>
  );
};

export default CardFront;
