import { Button, Group, Stack, Text, Title, ScrollArea } from "@mantine/core";
import { Fragment } from "react/jsx-runtime";
import FeatureInput from "../boh-generics/FeatureInput";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { BaseCard, type Feature } from "../../../shared/types";
import { useClient } from "../ClientProvider";
import { Trash, Upload } from "lucide-react";
import { LOG_DEFAULT } from "../../../shared/constants";
import { motion } from "motion/react";

interface EditorProps {
  features: Feature[];
  gameCode: string;
  mode: "add" | "update";
  setMode: React.Dispatch<React.SetStateAction<"add" | "update">>;
  card?: BaseCard;
  onReload: () => void;
}

const Editor = ({
  gameCode,
  features,
  mode,
  card,
  setMode,
  onReload,
}: EditorProps) => {
  const client = useClient();
  const [log, setLog] = useState<string>("");
  const featuresRef = useRef<Record<string, string>>({});
  const [clearFlag, setClearFlag] = useState<boolean>(false);

  const onFeatureChange = useCallback((feature: string, value: string) => {
    featuresRef.current[feature] = value;
    setLog("");
  }, []);

  const onAdd = useCallback(async (): Promise<void> => {
    if (!client) {
      return;
    }

    const snapShot = featuresRef.current;
    featuresRef.current = {};
    setClearFlag(true);

    // check required features
    const outstanding = features.filter(
      (feature) =>
        feature.required &&
        !(feature.name in snapShot || snapShot[feature.name] === ""),
    );
    if (outstanding.length > 0) {
      setLog("a required field is missing");
      return;
    }

    // perform the add
    const lookup = snapShot["MYlookup"]!;
    const addedEntry = await client["/edit/add-entry"]({ gameCode, lookup });
    if ("error" in addedEntry) {
      console.error("error adding entry");
      return;
    }

    const entriesToUpdate = Object.keys(snapShot).map((key) => {
      return {
        gameCode,
        lookup,
        feature: key,
        value: snapShot[key],
      };
    });

    for (const entryToUpdate of entriesToUpdate) {
      console.log(`updating`, entryToUpdate);
      const res = await client["/edit/update-entry"](entryToUpdate);
      console.log("entry updated", res);
    }

    onReload();
  }, [features, client]);

  const onUpdate = useCallback(async () => {
    if (!client) return;
    const snapShot = featuresRef.current;
    featuresRef.current = {};
    setClearFlag(true);
    if ("MYlookup" in snapShot || card === undefined) return;

    const entriesToUpdate = Object.keys(snapShot)
      .map((key) => {
        return {
          gameCode,
          lookup: card.MYlookup,
          feature: key,
          value: snapShot[key],
        };
      })
      .filter((e) => e.value !== "");

    const res = await Promise.all(
      entriesToUpdate.map((entry) => client["/edit/update-entry"](entry)),
    );

    console.log("entries updated", res);
    onReload();
  }, [card, client]);

  useEffect(() => {
    if (clearFlag) setClearFlag(false);
  }, [clearFlag]);

  const onDelete = useCallback(async () => {
    if (!client || !card) return;

    const res = await client["/edit/delete-entry"]({
      gameCode,
      lookup: card.MYlookup,
    });

    if ("error" in res) {
      console.error(res);
      return;
    }

    onReload();
  }, [card, client, gameCode]);

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
      <Stack align="center" w="100%" pt="sm" mih={0}>
        {mode === "update" ? (
          <Text fw="bold">
            Ability{" "}
            <Text
              span
              style={{ fontFamily: "fira code, monospace", fontWeight: 700 }}
            >
              {card?.MYlookup}
            </Text>
          </Text>
        ) : (
          <Title size="h4" mb={0}>
            Add Entry
          </Title>
        )}
        <ScrollArea
          flex={1}
          mih={0}
          w="100%"
          type="auto"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <Stack align="center" w="100%">
            {features.map((feature: Feature, i: number) => (
              <Fragment key={`${feature.name}${i}`}>
                <FeatureInput
                  w="100%"
                  feature={feature}
                  onFeatureChange={(value: string) =>
                    onFeatureChange(feature.name, value)
                  }
                  defaultValue={
                    card === undefined ? undefined : card[feature.name]
                  }
                  flag={clearFlag}
                  strict={feature.name === "MYlookup"}
                />
              </Fragment>
            ))}
            <Group w="100%">
              <Button
                className="hoverRedButton"
                flex={1}
                onClick={mode === "add" ? onAdd : onUpdate}
                c="black"
                bg="red.2"
                bd="2px solid black"
              >
                <Text mr="0.5rem">
                  {mode === "add" ? `Add to my game` : "Update"}
                </Text>
                <Upload />
              </Button>
              {mode === "update" && (
                <>
                  <Button
                    className="hoverRedButton"
                    flex={1}
                    onClick={onDelete}
                    c="black"
                    bd="2px solid black"
                    bg="red.5"
                  >
                    <Text mr="0.5rem">Delete</Text>
                    <Trash />
                  </Button>
                  <Button
                    className="hoverGrayButton"
                    flex={1}
                    onClick={() => setMode("add")}
                    c="black"
                    bg="none"
                    bd="2px solid black"
                  >
                    Cancel
                  </Button>
                </>
              )}
            </Group>
            <Text c={log === "" ? "gray.7" : "red"}>
              {mode === "add" && log === "" ? LOG_DEFAULT : log}
            </Text>
          </Stack>
        </ScrollArea>
      </Stack>
    </motion.div>
  );
};

export default Editor;
