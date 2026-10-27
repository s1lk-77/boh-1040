import { Stack, StackProps, TextInput, Textarea } from "@mantine/core";
import { type ChangeEvent, useCallback, useEffect, useState } from "react";
import { parseGametexName } from "../utilities";
import { type Feature } from "../../../shared/types";
import { PLAYER_NAME_REGEX } from "../../../shared/constants";
import HelpTool from "../components/HelpTool";

interface FeatureInputProps extends StackProps {
  onFeatureChange: (value: string) => void;
  feature: Feature;
  defaultValue?: string;
  flag: boolean;
  strict?: boolean;
  help?: string;
}

const FeatureInput = ({
  feature,
  onFeatureChange,
  defaultValue,
  flag,
  strict = false,
  help,
  ...props
}: FeatureInputProps) => {
  const [value, setValue] = useState<string>("");

  const strictUpdate = useCallback(
    (newString: string) => {
      if (PLAYER_NAME_REGEX.test(newString) || newString === "") {
        setValue(newString);
        onFeatureChange(newString);
      } else if (newString.at(-1) === " " && newString.at(-2) !== "-") {
        newString = newString.replace(" ", "-");
        setValue(newString);
        onFeatureChange(newString);
      }
    },
    [onFeatureChange],
  );

  const changeHandler = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      if (strict) {
        strictUpdate(newValue);
        return;
      }
      setValue(newValue);
      onFeatureChange(newValue);
    },
    [onFeatureChange, strict, strictUpdate],
  );

  useEffect(() => {
    if (defaultValue !== undefined) setValue(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    if (flag) setValue("");
  }, [flag]);

  return (
    <Stack gap="xs" {...props} pos="relative">
      {help && (
        <HelpTool
          flushRight
          fillColor="var(--mantine-color-red-4)"
          popLeft
          mt={-7}
        >
          {help}
        </HelpTool>
      )}
      {feature.isMultiline ? (
        <Textarea
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
              fontFamily: "Fira Code, monospace",
              fontWeight: 450,
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
