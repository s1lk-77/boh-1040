import { Button, Group, Stack } from "@mantine/core";
import "../../styles.css";
import { motion } from "motion/react";
import { Check, Trash } from "lucide-react";
import React, { SetStateAction, useEffect } from "react";

export interface EntryBaseProps {
  selecting: boolean;
  onSelect: (lookup: string) => void;
  onDelete: (lookup: string) => void;
  selectionRef: React.RefObject<Set<string>>;
}

export interface EntryProps extends EntryBaseProps {
  identifier: string;
  children: React.ReactNode;
  selected: boolean;
  setSelected: React.Dispatch<SetStateAction<boolean>>;
}

/**
 * A Catalog Entry. This is a generic functionality component, providing all the functionalities of a catalog entry.
 * For aesthetic stylings, see CardEntry.
 * @param props
 * @returns
 */
export const Entry = ({
  identifier,
  selecting,
  onSelect = () => {},
  onDelete = () => {},
  selectionRef,
  children,
  selected,
  setSelected,
}: EntryProps) => {
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
