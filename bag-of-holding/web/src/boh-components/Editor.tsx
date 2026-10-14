import { Button, Stack, Text } from "@mantine/core";
import { Fragment } from "react/jsx-runtime";
import FeatureInput from "../boh-generics/FeatureInput";
import { useCallback, useEffect, useRef, useState } from "react";
import { type Feature } from "../../../shared/types";
import { useClient } from "../ClientProvider";

interface EditorProps {
  features: Feature[];
  gameCode: string;
}

const Editor = ({ gameCode, features }: EditorProps) => {
  const client = useClient();
  const [log, setLog] = useState<string>("");
  const featuresRef = useRef<Record<string, string>>({});

  const OnFeatureChange = useCallback((feature: string, value: string) => {
    featuresRef.current[feature] = value;
    setLog("");
  }, []);

  const OnAdd = useCallback(async (): Promise<void> => {
    if (!client) {
      return;
    }

    // check required features
    const outstanding = features.filter(
      (feature) =>
        feature.required &&
        !(
          feature.name in featuresRef.current ||
          featuresRef.current[feature.name] === ""
        ),
    );
    if (outstanding.length > 0) {
      setLog("a required field is missing");
      return;
    }

    // perform the add
    const lookup = featuresRef.current["MYlookup"]!;
    const addedEntry = await client["/edit/add-entry"]({ gameCode, lookup });
    if ("error" in addedEntry) {
      console.error("error adding entry");
      return;
    }

    const entriesToUpdate = Object.keys(featuresRef.current).map((key) => {
      return {
        gameCode,
        lookup,
        feature: key,
        value: featuresRef.current[key],
      };
    });

    for (const entryToUpdate of entriesToUpdate) {
      console.log(`updating`, entryToUpdate);
      const res = await client["/edit/update-entry"](entryToUpdate);
      console.log("entry updated", res);
    }
  }, [features, client]);

  return (
    <Stack>
      {features.map((feature: Feature, i: number) => (
        <Fragment key={`${feature.name}${i}`}>
          <FeatureInput
            feature={feature}
            onChange={(value: string) => OnFeatureChange(feature.name, value)}
          />
        </Fragment>
      ))}
      <Text>{log}</Text>
      <Button onClick={OnAdd}>Add</Button>
    </Stack>
  );
};

export default Editor;
