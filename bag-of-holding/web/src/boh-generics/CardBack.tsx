import { Stack, Title, Text, ScrollArea } from "@mantine/core";
import Card from "./Card";
import { SMALL_FRAME_WIDTH } from "../../../shared/constants";
import { formatDate } from "../utilities";

interface CardBackProps {
  heading?: string;
  gameName: string;
}

const CardBack = ({ heading = "Ability Effect", gameName }: CardBackProps) => {
  const today: Date = new Date();
  const cardType = "Ability Card";
  const tr = "Not Transferable";
  const bl = gameName;
  const br = formatDate(today);
  return (
    <Card justify="space-evenly" tl={cardType} tr={tr} bl={bl} br={br}>
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
      >
        <Stack mih="100%" align="center" justify="center" h="100%">
          <Text>Just a short description</Text>
        </Stack>
      </ScrollArea>
    </Card>
  );
};

export default CardBack;
