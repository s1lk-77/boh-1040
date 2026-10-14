import { Flex, type StackProps, Group, Stack, Text } from "@mantine/core";
import { ReactNode } from "react";

interface CardProps extends StackProps {
  children: ReactNode;
  tr?: string;
  tl?: string;
  br?: string;
  bl?: string;
}

const Card = ({
  children,
  tr = "tr",
  tl = "tl",
  br = "br",
  bl = "bl",
  ...props
}: CardProps) => {
  return (
    <Flex direction="column" bd="solid black 2px" flex={1} mih={0} p="sm">
      <Group justify="space-between" wrap="nowrap">
        <Text>{tl}</Text>
        <Text ta="right">{tr}</Text>
      </Group>
      <Stack flex={1} align="center" {...props} py="sm" mih={0}>
        {children}
      </Stack>
      <Group justify="space-between" wrap="nowrap">
        <Text>{bl}</Text>
        <Text ta="right">{br}</Text>
      </Group>
    </Flex>
  );
};

export default Card;
