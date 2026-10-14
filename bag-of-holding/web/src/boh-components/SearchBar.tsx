import { Input, Group, Button } from "@mantine/core";
import { useCallback, useRef, useState } from "react";
import { useClient } from "../ClientProvider";

interface SearchBarProps {
  onSuccess: (value: [string, string][]) => void;
}

const SearchBar = ({ onSuccess }: SearchBarProps) => {
  const [value, setValue] = useState<string>("");
  const busyRef = useRef<boolean>(false);
  const client = useClient();

  const onSubmit = useCallback(async () => {
    setValue("");
    if (busyRef.current) return;
    if (!client) return;

    // call endpoint
    // set busy flag
    // await
    // unset busy flag
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onSubmit();
    }
  };

  return (
    <Group w="100%" bg="white" bd="3px solid black" py="lg" px="sm">
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
