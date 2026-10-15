import {
  Stack,
  StackProps,
  TextInput,
  type TextProps,
  Textarea,
} from "@mantine/core";
import { type ChangeEvent, useCallback, useEffect, useState } from "react";
import { parseGametexName } from "../utilities";
import { type Feature } from "../../../shared/types";

interface FeatureInputProps extends StackProps {
  onFeatureChange: (value: string) => void;
  feature: Feature;
  defaultValue?: string;
  flag: boolean;
}

const FeatureInput = ({
  feature,
  onFeatureChange,
  defaultValue,
  flag,
  ...props
}: FeatureInputProps) => {
  const [value, setValue] = useState<string>("");

  const changeHandler = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      setValue(newValue);
      onFeatureChange(newValue);
    },
    [onFeatureChange],
  );

  useEffect(() => {
    if (defaultValue !== undefined) setValue(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    if (flag) setValue("");
  }, [flag]);

  return (
    <Stack gap="xs" {...props}>
      {feature.isMultiline ? (
        <Textarea
          styles={{
            input: {
              border: "2px solid black",
              "&:focus": {
                borderColor: "var(--mantine-color-grape-6)",
              },
            },
          }}
          label={parseGametexName(feature.name)}
          required={feature.required}
          w="100%"
          placeholder={`${feature.name}...`}
          value={value}
          autosize
          minRows={4}
          onChange={changeHandler}
        />
      ) : (
        <TextInput
          styles={{
            input: {
              border: "2px solid black",
              "&:focus": {
                borderColor: "var(--mantine-color-grape-6)",
              },
            },
          }}
          label={parseGametexName(feature.name)}
          required={feature.required}
          w="100%"
          placeholder={`${feature.name}...`}
          value={value}
          onChange={changeHandler}
        />
      )}
    </Stack>
  );
};

export default FeatureInput;
