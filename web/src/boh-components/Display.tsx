import { Box, Button, Flex, Group, Stack } from "@mantine/core";
import { STANDARD_FRAME_WIDTH } from "../../../shared/constants";
import CardBack from "../boh-generics/CardBack";
import { useEffect, useState } from "react";
import { AbilColor, BaseCard } from "../../../shared/types";
import CardFront from "../boh-generics/CardFront";
import { RefreshCcw, ArrowLeft, ArrowRight } from "lucide-react";
import "../../styles.css";
import "../assets/flipcard.css";
import { motion } from "motion/react";
import { useFlip } from "../hooks/useFlip";

interface DisplayProps {
  gameName: string;
  playerName: string;
  card: BaseCard;
  onIndex: (dir: -1 | 1) => void;
  defaultFlipped?: boolean;
}

const Display = ({
  gameName,
  playerName,
  card,
  defaultFlipped = false,
  onIndex,
}: DisplayProps) => {
  const [flipped, setFlipped] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const iFlip = useFlip();

  useEffect(() => {
    setFlipped(defaultFlipped);
  }, [defaultFlipped]);

  useEffect(() => {
    iFlip?.setFlipHandler(handleFlip);
  }, []);

  function handleFlip() {
    if (!isAnimating) {
      setFlipped((f) => !f);
      setIsAnimating(true);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0.3 }}
      animate={{ opacity: 1 }}
      style={{
        width: "100%",
        display: "flex",
        flex: 1,
        minHeight: 0,
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Stack w={STANDARD_FRAME_WIDTH} flex={1} mih={0}>
        <Flex flex={1} className="flip-card-container" onClick={handleFlip}>
          <motion.div
            className="flip-card-inner"
            initial={false}
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
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
      </Stack>
    </motion.div>
  );
};

export default Display;
