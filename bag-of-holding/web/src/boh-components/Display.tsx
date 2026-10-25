import { Box, Button, Flex, Group, Stack } from "@mantine/core";
import { STANDARD_FRAME_WIDTH } from "../../../shared/constants";
import CardBack from "../boh-generics/CardBack";
import { useEffect, useState } from "react";
import { BaseCard } from "../../../shared/types";
import CardFront from "../boh-generics/CardFront";
import { RefreshCcw, ArrowLeft, ArrowRight } from "lucide-react";
import "../../styles.css";
import "../assets/flipcard.css";
import { motion } from "motion/react";

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
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setFlipped(defaultFlipped);
  }, [defaultFlipped]);

  function handleFlip() {
    if (!isAnimating) {
      setFlipped(!flipped);
      setIsAnimating(true);
    }
  }

  return (
    <Stack w={STANDARD_FRAME_WIDTH} flex={1} mih={0}>
      <Flex flex={1} className="flip-card-container" onClick={handleFlip}>
        <motion.div
          className="flip-card-inner"
          initial={false}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          onAnimationComplete={() => setIsAnimating(false)}
        >
          <CardFront
            owned
            gameName={gameName}
            playerName={playerName}
            card={card}
          />
          <CardBack gameName={gameName} card={card} />
        </motion.div>
      </Flex>
      {showToolBar && (
        <Group
          justify="space-between"
          align="center"
          py="md"
          mb="sm"
          wrap="nowrap"
          bg="gray.3"
          bdrs="md"
        >
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
            onClick={handleFlip}
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
