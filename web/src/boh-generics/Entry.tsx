import { Button, Group, Stack } from "@mantine/core";
import "../../styles.css";
import { motion } from "motion/react";
import { Check, Trash } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export interface EntryProps {
  identifier: string;
  selecting: boolean;
  onSelect: (lookup: string) => void;
  onDelete: (lookup: string) => void;
  selectionRef: React.RefObject<Set<string>>;
  children: React.ReactNode;
  onClick: () => void;
  clickable: HTMLDivElement | null;
}

/**
 * A Catalog Entry. This is a generic functionality component, providing all the functionalities of a catalog entry.
 * For aesthetic stylings, see CardEntry.
 * @param props
 * @returns
 */
export const Entry = ({
  identifier,
  selecting = false,
  onSelect = () => {},
  onDelete = () => {},
  onClick,
  selectionRef,
  children,
  clickable,
}: EntryProps) => {
  const [selected, setSelected] = useState<boolean>(false);

  useEffect(() => {
    if (!selecting) setSelected(false);
  }, [selecting]);

  useEffect(() => {
    if (!selectionRef) return;
    if (selectionRef.current.has(identifier)) {
      setSelected(true);
    } else {
      setSelected(false);
    }
  }, [identifier]);

  const onClickInternal = useCallback(() => {
    if (selecting) {
      setSelected((s) => !s);
      onSelect(identifier);
    } else {
      onClick();
    }
  }, [onClick, selecting]);

  useEffect(() => {
    if (!clickable) return;
    clickable.addEventListener("click", onClickInternal);

    return () => {
      clickable.removeEventListener("click", onClickInternal);
    };
  }, [clickable]);

  return (
    <Group w="100%" gap={0}>
      <motion.div
        whileTap={{ y: 5 }}
        style={{
          flex: 1,
          minHeight: 0,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          touchAction: "pan-y",
        }}
      >
        {children}
      </motion.div>
      {selecting && (
        <Stack>
          <Button
            bg="none"
            c="black"
            styles={{
              root: {
                paddingLeft: "var(--mantine-spacing-xs)",
                paddingRight: 0,
              },
            }}
            onClick={() => {
              setSelected(!selected);
              onSelect(identifier);
            }}
          >
            {selected ? (
              <Check />
            ) : (
              <svg
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://w3.org"
              />
            )}
          </Button>
          <Button
            className="hoverTransparentButton"
            bg="none"
            c="black"
            styles={{
              root: {
                paddingLeft: "var(--mantine-spacing-xs)",
                paddingRight: 0,
              },
            }}
            onClick={() => {
              onDelete(identifier);
            }}
          >
            <Trash />
          </Button>
        </Stack>
      )}
    </Group>
  );
};
