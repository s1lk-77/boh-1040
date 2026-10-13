import Panel from "../components/Panel";
import CenterLayout from "../components/CenterLayout";
import { Group, Stack, Title } from "@mantine/core";
import { useParams } from "react-router-dom";
import Editor from "../boh-components/Editor";
import {
  ABIL_FEATURES,
  BASE_FEATURES,
  type Feature,
} from "../../../shared/constants";

/**
 * The GM's dashboard page.
 */
function GMPage() {
  const { gameCode } = useParams();
  const features: Feature[] = BASE_FEATURES.concat(ABIL_FEATURES);
  return (
    <CenterLayout asOverlay>
      <Stack h="100dvh" p="xl" gap="xl" align="center">
        <Title>Demiplane: {gameCode}</Title>
        <Group flex={1} align="flex-start" w="70dvw">
          <Panel h="90%" flex={1}>
            <Editor features={features} />
          </Panel>
          <Panel h="90%" flex={1}>
            Placeholder
          </Panel>
        </Group>
      </Stack>
    </CenterLayout>
  );
}

export default GMPage;
