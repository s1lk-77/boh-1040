import { Input, Group, Button, type GroupProps } from "@mantine/core";
import { useCallback, useRef, useState } from "react";
import { useClient } from "../ClientProvider";
import { STANDARD_FRAME_WIDTH } from "../../../shared/constants";
import { BaseCard } from "../../../shared/types";
import { unwrapCard } from "../utilities";

interface SearchBarProps extends GroupProps {
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

  const onSubmit = useCallback(async () => {
    setValue("");
    if (busyRef.current) return;
    if (!client) return;

    // call endpoint
    // set busy flag
    busyRef.current = true;
    console.log(`${playerName}@${gameCode} @ ${value}`);
    // await
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

    // unset busy flag
    busyRef.current = false;
  }, [gameCode, playerName, value]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onSubmit();
    }
  };

  return (
    <Group
      {...props}
      w={STANDARD_FRAME_WIDTH}
      bg="white"
      bd="2px solid black"
      py="lg"
      px="sm"
    >
      <Input
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
      <Button onClick={onSubmit}>Find</Button>
    </Group>
  );
};

export default SearchBar;
