import { Input, Group, Button } from "@mantine/core";
import { useCallback, useRef, useState } from "react";
import { useClient } from "../ClientProvider";
import { STANDARD_FRAME_WIDTH } from "../../../shared/constants";

interface SearchBarProps {
  onSuccess: (value: [string, string][]) => void;
  gameCode: string;
  playerName: string;
}

const SearchBar = ({ onSuccess, gameCode, playerName }: SearchBarProps) => {
  const [value, setValue] = useState<string>("");
  const busyRef = useRef<boolean>(false);
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
    console.log(res);
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
      w={STANDARD_FRAME_WIDTH}
      bg="white"
      bd="3px solid black"
      py="lg"
      px="sm"
    >
      <Input
        flex={1}
        placeholder="@..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <Button onClick={onSubmit}>Find</Button>
    </Group>
  );
};

export default SearchBar;
