import { Button, Flex, Group, Stack } from "@mantine/core";
import { STANDARD_FRAME_WIDTH } from "../../../shared/constants";
import CardBack from "../boh-generics/CardBack";
import { useState } from "react";
import { BaseCard } from "../../../shared/types";
import CardFront from "../boh-generics/CardFront";
import { RefreshCcw, ArrowLeft, ArrowRight } from "lucide-react";

interface DisplayProps {
  gameName: string;
  playerName: string;
  card: BaseCard;
  showToolBar?: boolean;
}

const Display = ({
  gameName,
  playerName,
  showToolBar = true,
}: DisplayProps) => {
  const [flipped, setFlipped] = useState<boolean>(true);
  return (
    <Stack w={STANDARD_FRAME_WIDTH} flex={1} mih={0}>
      {flipped ? (
        <CardBack gameName={gameName} />
      ) : (
        <CardFront owned gameName={gameName} playerName={playerName} />
      )}
      {showToolBar && (
        <Group justify="space-between" align="center" h="15%" wrap="nowrap">
          <Button h="auto" c="black" bg="white">
            <ArrowLeft />
          </Button>
          <Button
            h="auto"
            c="black"
            bg="white"
            onClick={() => {
              setFlipped(!flipped);
            }}
          >
            <Flex direction="column">
              <RefreshCcw size={30} />
              Flip
            </Flex>
          </Button>
          <Button h="auto" c="black" bg="white">
            <ArrowRight />
          </Button>
        </Group>
      )}
    </Stack>
  );
};

export default Display;
