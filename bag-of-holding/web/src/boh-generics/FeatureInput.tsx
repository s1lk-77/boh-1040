import {
  Stack,
  TextInput,
  Text,
  type TextProps,
  Textarea,
} from "@mantine/core";
import { type ChangeEvent, useCallback, useState } from "react";
import { parseGametexName } from "../utilities";
import { type Feature } from "../../../shared/constants";

interface FeatureInputProps extends TextProps {
  onChange: (value: string) => void;
  feature: Feature;
}

const FeatureInput = ({ feature, onChange, ...props }: FeatureInputProps) => {
  const [value, setValue] = useState<string>("");

  const changeHandler = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      setValue(newValue);
      onChange(value);
    },
    [onChange],
  );

  return (
    <Stack gap="xs">
      {feature.isMultiline ? (
        <Textarea
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
