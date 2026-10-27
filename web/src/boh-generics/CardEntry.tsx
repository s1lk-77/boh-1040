import {
  Box,
  BoxProps,
  Flex,
  Group,
  type MantineColor,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import "../../styles.css";
import { BaseCard } from "../../../shared/types";

export interface CardEntryProps {
  card: BaseCard;
  cardType: string;
  cardColor: MantineColor;
  className: BoxProps["className"];
  onClick: () => void;
}

export const CardEntry = ({
  card,
  cardType,
  cardColor,
  className = "hoverButton",
  onClick,
}: CardEntryProps) => {
  const resolvedDesc: string =
    card.MYtext === undefined || card.MYtext === ""
      ? "no description text given"
      : card.MYtext;

  return (
    <Stack
      flex={1}
      onClick={onClick}
      className={className}
      component="div"
      gap="lg"
      pt="sm"
      px={0}
      ta="left"
      bd="2px solid black"
      bg={cardColor}
      style={{
        background: "white",
        cursor: "pointer",
        minWidth: 0,
        touchAction: "pan-y",
      }}
      my="sm"
    >
      <Group justify="space-between" px="sm">
        <Title size="h3" c="black">
          {card.MYname === "" ? "Unnamed Ability" : card.MYname}
        </Title>

        <Text className="u-fira-code" c="black">
          {"@" + card.MYlookup}
        </Text>
      </Group>
      {card.MYtext && (
        <Box flex={1} miw={0}>
          <Text truncate="end" px="sm" c="black">
            {resolvedDesc}
          </Text>
        </Box>
      )}
      {/* <Divider size="sm" color="black" /> */}
      <Flex direction="column" w="100%" align="flex-end">
        <Text mr="0.2rem" c="gray.7" size="sm">
          {cardType}
        </Text>
        {/* <Divider size="xs" color="black" /> */}
      </Flex>
    </Stack>
  );
};
