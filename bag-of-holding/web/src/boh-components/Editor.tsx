import { Button, Group, Stack, Text } from "@mantine/core";
import { Fragment } from "react/jsx-runtime";
import FeatureInput from "../boh-generics/FeatureInput";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { BaseCard, type Feature } from "../../../shared/types";
import { useClient } from "../ClientProvider";
import { Trash, Upload } from "lucide-react";

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
    <Stack align="center" w="100%" pt="sm">
      {mode === "update" ? (
        <Text fw="bold">@{card?.MYlookup}</Text>
      ) : (
        <Text fw="bold">Add Entry</Text>
      )}
      {features.map((feature: Feature, i: number) => (
        <Fragment key={`${feature.name}${i}`}>
          <FeatureInput
            w="100%"
            feature={feature}
            onFeatureChange={(value: string) =>
              onFeatureChange(feature.name, value)
            }
            defaultValue={card === undefined ? undefined : card[feature.name]}
            flag={clearFlag}
          />
        </Fragment>
      ))}
      <Text>{log}</Text>
      <Group w="100%">
        <Button
          className="hoverButton"
          flex={1}
          onClick={mode === "add" ? onAdd : onUpdate}
          c="black"
          bg="yellow.2"
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
              className="hoverButton"
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
              className="hoverButton"
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
    </Stack>
  );
};

export default Editor;
