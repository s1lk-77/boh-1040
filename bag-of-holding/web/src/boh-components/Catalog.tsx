import {
  Divider,
  Flex,
  ScrollArea,
  Text,
  Group,
  Input,
  Button,
} from "@mantine/core";
import { STANDARD_FRAME_WIDTH } from "../../../shared/constants";
import { Fragment } from "react/jsx-runtime";
import Entry from "../boh-generics/Entry";
import { BaseCard } from "../../../shared/types";
import { ArrowDownZA, ArrowUpAZ, ArrowUpDown, Filter } from "lucide-react";
import {
  type ChangeEvent,
  useCallback,
  useEffect,
  useState,
  useRef,
} from "react";
import { motion, AnimatePresence } from "motion/react";

interface CatalogProps {
  entries: BaseCard[];
  onDisplay: (lookup: string) => void;
  w?: string;
  useColor?: boolean;
  initialRef: React.RefObject<boolean>;
}

const Catalog = ({
  entries,
  onDisplay,
  w,
  initialRef,
  useColor = false,
}: CatalogProps) => {
  const [filter, setFilter] = useState<string>("");
  const [sort, setSort] = useState<"az" | "za" | "">("");
  const [processed, setProcessed] = useState<BaseCard[]>([]);

  const onFilter = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setFilter(newValue);
  }, []);

  useEffect(() => {
    let sortFunc = (a: BaseCard, b: BaseCard) => 0;
    if (sort === "az") {
      sortFunc = (a: BaseCard, b: BaseCard) => a.MYname.localeCompare(b.MYname);
    } else if (sort === "za") {
      sortFunc = (a: BaseCard, b: BaseCard) => b.MYname.localeCompare(a.MYname);
    }

    setProcessed(
      entries
        .filter(
          (c) =>
            c.MYname.toLowerCase().includes(filter.toLowerCase()) ||
            c.MYtext?.toLowerCase().includes(filter.toLowerCase()),
        )
        .toSorted(sortFunc),
    );
  }, [filter, entries, sort]);

  useEffect(() => {
    setProcessed(entries);
  }, [entries]);

  const toggleSort = useCallback(() => {
    setSort((state) => {
      switch (state) {
        case "":
          return "az";
        case "az":
          return "za";
        case "za":
          return "";
      }
    });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0.3 }}
      animate={{ opacity: 1 }}
      exit={
        initialRef.current ? { opacity: 0, scale: 0.3 } : { y: -5, opacity: 0 }
      }
      transition={
        initialRef.current
          ? { duration: 0.1 }
          : {
              duration: 0.3,
              scale: { type: "spring", visualDuration: 0.3, bounce: 0.5 },
            }
      }
      style={{
        flex: 1,
        minHeight: 0,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
      key={"catalog"}
    >
      <Flex
        direction="column"
        bg="gray.3"
        w={w ?? STANDARD_FRAME_WIDTH}
        flex={1}
        mih={0}
        bdrs="md"
      >
        <Group
          p="xs"
          ta="center"
          bg={useColor ? "red.4" : "gray.4"}
          bd="solid black 2px"
          style={{
            borderTopLeftRadius: "var(--mantine-radius-md)",
            borderTopRightRadius: "var(--mantine-radius-md)",
            borderBottomLeftRadius: "0px",
            borderBottomRightRadius: "0px",
          }}
        >
          <Filter
            fill={
              useColor
                ? "var(--mantine-color-red-2)"
                : "var(--mantine-color-gray-2)"
            }
          />
          <Input
            flex={1}
            placeholder="type to filter..."
            value={filter}
            onChange={onFilter}
            styles={{
              input: {
                fontFamily: "Fira Code, monospace",
                fontWeight: 450,
                border: "2px solid black",
                "&:focus": {
                  borderColor: "var(--mantine-color-grape-6)",
                },
              },
            }}
          />
          <Button
            w="fit-content"
            bg={useColor ? "red.3" : "gray.2"}
            c="black"
            className="hoverTransparentButton"
            onClick={toggleSort}
          >
            {sort === "" ? (
              <ArrowUpDown />
            ) : sort === "az" ? (
              <ArrowUpAZ />
            ) : (
              <ArrowDownZA />
            )}
          </Button>
        </Group>
        <Divider mb={0} aria-hidden />
        <ScrollArea
          flex={1}
          mih={0}
          type="auto"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <Flex direction="column" align="center" gap="sm" mt="sm">
            {processed.length === 0 && (
              <Text c="gray.6">We couldn't find anything.</Text>
            )}
            <motion.div
              initial="hidden"
              animate={initialRef.current ? "show" : { y: 0, opacity: 1 }}
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
              variants={
                initialRef.current
                  ? {
                      hidden: { opacity: 0 },
                      show: {
                        opacity: 1,
                        transition: {
                          staggerChildren: 0.15,
                        },
                      },
                    }
                  : {}
              }
            >
              {processed.map((entry, i) => {
                const key = "MYtext";
                let desc: string | undefined = undefined;
                if ("MYtext" in entry && typeof entry["MYtext"] === "string") {
                  desc = entry["MYtext"];
                }

                return (
                  <motion.div
                    key={`${entry}-${i}`}
                    variants={
                      initialRef.current
                        ? {
                            hidden: { opacity: 0, y: 30 },
                            show: {
                              opacity: 1,
                              y: 0,
                              transition: { type: "spring", stiffness: 100 },
                            },
                          }
                        : {}
                    }
                    style={{
                      width: "90%",
                    }}
                  >
                    <Entry
                      name={entry.MYname}
                      lookup={entry.MYlookup}
                      desc={desc}
                      onClick={() => onDisplay(entry.MYlookup)}
                    />
                  </motion.div>
                );
              })}
            </motion.div>
          </Flex>
        </ScrollArea>
      </Flex>
    </motion.div>
  );
};

export default Catalog;
