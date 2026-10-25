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
  bg = "white",
  className,
  ...props
}: CardProps) => {
  return (
    <Flex
      className={className}
      direction="column"
      bd="solid black 2px"
      p="sm"
      bg={bg}
      w="100%"
      mih={0}
    >
      <Group justify="space-between" wrap="nowrap" w="100%">
        <Text>{tl}</Text>
        <Text ta="right">{tr}</Text>
      </Group>
      <Stack flex={1} align="center" {...props} py="sm" mih={0} w="100%">
        {children}
      </Stack>
      <Group justify="space-between" wrap="nowrap" w="100%">
        <Text>{bl}</Text>
        <Text ta="right">{br}</Text>
      </Group>
    </Flex>
  );
};

export default Card;
