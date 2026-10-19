import { Input, Flex, Button, type FlexProps } from "@mantine/core";
import { useCallback, useRef, useState } from "react";
import { useFocusTrap } from "@mantine/hooks";
import { useClient } from "../ClientProvider";
import { STANDARD_FRAME_WIDTH } from "../../../shared/constants";
import { BaseCard } from "../../../shared/types";
import { unwrapCard } from "../utilities";
import { Search } from "lucide-react";

interface SearchBarProps extends FlexProps {
  onSuccess: (value: BaseCard) => void;
  gameCode: string;
  playerName: string;
}

const SearchBar = ({
  onSuccess,
  gameCode,
  playerName,
  ...props
}: SearchBarProps) => {
  const [value, setValue] = useState<string>("");
  const busyRef = useRef<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const client = useClient();
  const focusTrapRef = useFocusTrap();

  const onSubmit = useCallback(async () => {
    setValue("");
    if (busyRef.current) return;
    if (!client) return;

    // call endpoint
    // set busy flag
    busyRef.current = true;
    console.log(`${playerName}@${gameCode} @ ${value}`);
    try {
      const res = await client["/collect/print"]({
        gameCode,
        lookup: value,
        playerName,
      });
      if ("error" in res) {
        console.error("could not find lookup");
        setError(true);
        return;
      }
      console.log(res);
      const card = unwrapCard(res.abil.card);
      if (card) onSuccess(card);
    } finally {
      // unset busy flag
      busyRef.current = false;
    }
  }, [client, gameCode, onSuccess, playerName, value]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onSubmit();
    }
  };

  return (
    <Flex
      {...props}
      ref={focusTrapRef}
      w={STANDARD_FRAME_WIDTH}
      h="15%"
      align="center"
      bg="gray.1"
      bd="2px solid black"
      pl="sm"
    >
      <Input
        data-autofocus
        autoFocus
        styles={{
          input: {
            border: "2px solid black",
            "&:focus": {
              borderColor: "var(--mantine-color-grape-6)",
            },
            fontFamily: "Fira Code, monospace",
            fontWeight: 450,
          },
        }}
        flex={1}
        placeholder="@..."
        value={value}
        error={error}
        onChange={(e) => {
          if (error) setError(false);
          setValue(e.target.value);
        }}
        onKeyDown={handleKeyDown}
      />
      <Button
        onClick={onSubmit}
        h="auto"
        c="black"
        bg="none"
        aria-label="Search"
      >
        <Search />
      </Button>
    </Flex>
  );
};

export default SearchBar;
