import { Input, Flex, Button, type FlexProps } from "@mantine/core";
import { useCallback, useRef, useState, useEffect } from "react";
import { useFocusTrap, useMergedRef } from "@mantine/hooks";
import { useClient } from "../ClientProvider";
import { STANDARD_FRAME_WIDTH } from "../../../shared/constants";
import { BaseCard } from "../../../shared/types";
import { unwrapCard } from "../utilities";
import { Search } from "lucide-react";
import "../../styles.css";
import { motion } from "motion/react";

interface SearchBarProps extends FlexProps {
  onSuccess: (value: BaseCard) => void;
  gameCode: string;
  playerName: string;
  onClose: () => void;
}

const SearchBar = ({
  onSuccess,
  gameCode,
  playerName,
  onClose,
  ...props
}: SearchBarProps) => {
  const [value, setValue] = useState<string>("");
  const busyRef = useRef<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const client = useClient();
  const focusTrapRef = useFocusTrap();
  const searchRef = useRef<HTMLDivElement>(null);
  const mergedRef = useMergedRef(searchRef, focusTrapRef);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if the ref exists, and if the clicked target is NOT inside the element
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        onClose(); // Action to take when clicked outside
      }
    };

    window.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const onSubmit = useCallback(async () => {
    setValue("");
    if (busyRef.current) return;
    if (!client) return;
    const lookup = value.charAt(0) === "@" ? value.slice(1) : value;

    // call endpoint
    // set busy flag
    busyRef.current = true;
    console.log(`${playerName}@${gameCode} @ ${lookup}`);
    try {
      const res = await client["/collect/print"]({
        gameCode,
        lookup,
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
      ref={mergedRef}
      w={STANDARD_FRAME_WIDTH}
      h="12%"
      align="center"
      bg="gray.3"
      pl="sm"
      bdrs="md"
    >
      <motion.div
        style={{ width: "100%", display: "flex", alignItems: "center" }}
        initial={{ y: 10 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", bounce: 0 }}
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
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
        />
        <Button
          onClick={onSubmit}
          h="auto"
          c="black"
          bg="none"
          aria-label="Search"
        >
          <Search className="hoverTransparentButton" />
        </Button>
      </motion.div>
    </Flex>
  );
};

export default SearchBar;
