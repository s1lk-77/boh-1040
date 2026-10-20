import { Button, Flex, Group, Stack } from "@mantine/core";
import { STANDARD_FRAME_WIDTH } from "../../../shared/constants";
import CardBack from "../boh-generics/CardBack";
import { useEffect, useState } from "react";
import { BaseCard } from "../../../shared/types";
import CardFront from "../boh-generics/CardFront";
import { RefreshCcw, ArrowLeft, ArrowRight } from "lucide-react";
import "../../styles.css";

interface DisplayProps {
  gameName: string;
  playerName: string;
  card: BaseCard;
  showToolBar?: boolean;
  onIndex: (dir: -1 | 1) => void;
  defaultFlipped?: boolean;
}

const Display = ({
  gameName,
  playerName,
  card,
  showToolBar = true,
  defaultFlipped = false,
  onIndex,
}: DisplayProps) => {
  const [flipped, setFlipped] = useState<boolean>(false);
  useEffect(() => {
    setFlipped(defaultFlipped);
  }, [defaultFlipped]);
  return (
    <Stack w={STANDARD_FRAME_WIDTH} flex={1} mih={0}>
      {flipped ? (
        <CardBack gameName={gameName} card={card} />
      ) : (
        <CardFront
          owned
          gameName={gameName}
          playerName={playerName}
          card={card}
        />
      )}
      {showToolBar && (
        <Group justify="space-between" align="center" h="15%" wrap="nowrap">
          <Button
            h="auto"
            c="black"
            bg="none"
            className="hoverTransparentButton"
          >
            <ArrowLeft onClick={() => onIndex(-1)} />
          </Button>
          <Button
            h="auto"
            c="black"
            bg="none"
            className="hoverTransparentButton"
            onClick={() => {
              setFlipped(!flipped);
            }}
          >
            <Flex direction="column">
              <RefreshCcw size={30} className="hoverRotate" />
              Flip
            </Flex>
          </Button>
          <Button
            h="auto"
            c="black"
            bg="none"
            className="hoverTransparentButton"
          >
            <ArrowRight onClick={() => onIndex(1)} />
          </Button>
        </Group>
      )}
    </Stack>
  );
};

export default Display;
