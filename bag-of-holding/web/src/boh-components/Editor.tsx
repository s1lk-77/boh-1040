import { Button, Stack } from "@mantine/core";
import { Fragment } from "react/jsx-runtime";
import FeatureInput from "../boh-generics/FeatureInput";
import { useCallback, useRef } from "react";
import { type Feature } from "../../../shared/constants";

interface EditorProps {
  features: Feature[];
}

const Editor = ({ features }: EditorProps) => {
  const featuresRef = useRef<Record<string, string>>({});

  const OnFeatureChange = useCallback((feature: string, value: string) => {
    featuresRef.current[feature] = value;
  }, []);

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
      <Button>Add</Button>
    </Stack>
  );
};

export default Editor;
