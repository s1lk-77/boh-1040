import {
  FileButton,
  Button,
  Stack,
  Group,
  Text,
  Flex,
  ScrollArea,
  Title,
} from "@mantine/core";
import {
  ABIL_TEMPLATE,
  PLAYER_NAME_REGEX,
  SMALL_FRAME_WIDTH,
} from "../../../shared/constants";
import "../../styles.css";
import { Fragment, useCallback, useEffect, useState } from "react";
import { AbilCard } from "../../../shared/types";
import { useClient } from "../ClientProvider";
import { motion } from "motion/react";

interface UploaderProps {
  gameCode: string;
  onReload: () => Promise<void>;
}

class UploaderError extends Error {}

const Uploader = ({ gameCode, onReload }: UploaderProps) => {
  const client = useClient();

  // downloading the template
  const downloadTemplate = () => {
    // 1. Convert JSON object to a string
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(ABIL_TEMPLATE, null, 2),
    )}`;

    // 2. Create a temporary anchor element
    const downloadAnchor = document.createElement("a");
    downloadAnchor.href = jsonString;
    downloadAnchor.download = "template.json";

    // 3. Trigger the download and clean up
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // uploading json
  const [file, setFile] = useState<File | null>(null);
  const [cards, setCards] = useState<AbilCard[]>([]);
  const [error, setError] = useState<string>("");
  const [mode, setMode] = useState<"confirm" | "upload">("upload");
  const [uploading, setUploading] = useState<boolean>(false);

  useEffect(() => {
    if (!file) return;

    // file reading
    const reader = new FileReader();

    // Event handler when the file reading completes successfully
    reader.onload = (event) => {
      const text = event.target?.result;
      if (!(typeof text === "string")) {
        console.error("read file is not a string");
        throw new UploaderError("Invalid JSON file format.");
      }

      try {
        const parsedData = JSON.parse(text);

        if (!Array.isArray(parsedData)) {
          throw new UploaderError("The uploaded JSON was not an array");
        }

        // dynamic type checking
        const cardsToAdd: AbilCard[] = [];
        for (const obj of parsedData) {
          if (typeof obj !== "object" || obj === null) continue;
          if (
            "MYlookup" in obj &&
            "MYname" in obj &&
            "MYtext" in obj &&
            "MYeffect" in obj &&
            Object.values(obj).every((value) => typeof value === "string")
          ) {
            const lookup: string = obj.MYlookup as string;
            if (PLAYER_NAME_REGEX.test(lookup))
              cardsToAdd.push(obj as AbilCard);
          }
        }

        // add cards
        if (cardsToAdd.length >= 0) {
          setCards(cardsToAdd);
          setMode("confirm");
        } else {
          throw new UploaderError(
            "The Grimoire translator couldn't find any cards in your file :(",
          );
        }
      } catch (err) {
        if (err instanceof UploaderError) {
          setError(err.message);
        } else {
          setError("Invalid JSON file format");
        }
      }
    };

    // Event handler if the file reader runs into an error
    reader.onerror = () => {
      console.error("Error reading file");
      setError("Oh no, something went wrong.");
    };

    // Read the file as a plain text string
    reader.readAsText(file);
  }, [file]);

  const onConfirmAdd = useCallback(async () => {
    if (!client) return;

    setUploading(true);
    for (const card of cards) {
      // perform add
      // perform the add
      const addedEntry = await client["/edit/add-entry"]({
        gameCode,
        lookup: card.MYlookup,
      });
      if ("error" in addedEntry) {
        console.error("error adding entry");
        continue;
      }

      const entriesToUpdate = Object.keys(card).map((key) => {
        return {
          gameCode,
          lookup: card.MYlookup,
          feature: key,
          value: card[key],
        };
      });

      const res = await Promise.all(
        entriesToUpdate.map((entry) => client["/edit/update-entry"](entry)),
      );
      console.log("entries updated", res);
    }
    setUploading(false);
    setMode("upload");
    onReload();
  }, [cards]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        width: "100%",
        display: "flex",
        flex: 1,
        minHeight: 0,
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Stack align="center" w="100%" pt="lg" mih={0}>
        {mode === "upload" && (
          <>
            <Title size="h4">Upload Entries</Title>
            <Text w={SMALL_FRAME_WIDTH}>
              The demiplane supports batch uploading ability cards in JSON
              format. <br />
              <br />
              Your JSON should be an array of objects, each with a "MYlookup",
              "MYname", "MYtext", and "MYeffect" field. See the download
              template.
            </Text>
            <Group>
              <FileButton onChange={setFile} accept="application/json">
                {(props) => (
                  <Button
                    c="black"
                    bd="2px solid black"
                    bg="red.2"
                    className="hoverRedButton"
                    {...props}
                    onClick={() => {
                      setError("");
                      props.onClick();
                    }}
                  >
                    Upload JSON
                  </Button>
                )}
              </FileButton>
              <Button
                onClick={() => {
                  setError("");
                  downloadTemplate();
                }}
                c="black"
                bd="2px solid black"
                bg="none"
                className="hoverGrayButton"
              >
                Download Template JSON
              </Button>
            </Group>
            {error !== "" && <Text c="red">{error}</Text>}
          </>
        )}

        {mode === "confirm" && (
          <>
            <Text c="gray.8">Found entries:</Text>
            <ScrollArea
              w={SMALL_FRAME_WIDTH}
              mih={0}
              type="auto"
              scrollbars="y"
              offsetScrollbars="present"
            >
              <Flex
                direction="column"
                mih="100%"
                align="center"
                justify="center"
                h="100%"
              >
                {cards.map((card, i) => (
                  <Fragment key={card.MYlookup + i}>
                    <Text>
                      {card.MYname} (
                      <Text span className="u-fira-code">
                        {card.MYlookup}
                      </Text>
                      )
                    </Text>
                  </Fragment>
                ))}
              </Flex>
            </ScrollArea>
            <Group w="100%" justify="center">
              <Button
                c="black"
                bd="2px solid black"
                bg="red.2"
                className="hoverRedButton"
                loading={uploading}
                onClick={onConfirmAdd}
              >
                Yes, Add Them!
              </Button>
              <Button
                c="black"
                bd="2px solid black"
                bg="none"
                className="hoverGrayButton"
                onClick={() => {
                  setFile(null);
                  setCards([]);
                  setMode("upload");
                }}
              >
                Cancel
              </Button>
            </Group>
          </>
        )}
      </Stack>
    </motion.div>
  );
};

export default Uploader;
