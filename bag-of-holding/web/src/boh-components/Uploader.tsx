import { Button, Stack, Group } from "@mantine/core";
import { ABIL_TEMPLATE } from "../../../shared/constants";

const Uploader = () => {
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

  return (
    <Stack align="center" w="100%" pt="sm">
      <Group>
        <Button>Upload JSON</Button>
        <Button onClick={downloadTemplate}>Download Template JSON</Button>
      </Group>
    </Stack>
  );
};

export default Uploader;
