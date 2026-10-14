import Panel from "../components/Panel";
import CenterLayout from "../components/CenterLayout";
import { Group, Stack, Title } from "@mantine/core";
import { useParams } from "react-router-dom";
import Editor from "../boh-components/Editor";
import { ABIL_FEATURES, BASE_FEATURES } from "../../../shared/constants";
import { Feature } from "../../../shared/types";
import { useClient } from "../ClientProvider";
import { useCallback, useEffect, useState } from "react";
import { BaseCard } from "../../../shared/types";
import { unwrapCard } from "../utilities";
import Catalog from "../boh-components/Catalog";

/**
 * The GM's dashboard page.
 */
function GMPage() {
  const { gameCode } = useParams();
  const client = useClient();
  const [gameName, setGameName] = useState<string | null>(null);
  const [cards, setCards] = useState<BaseCard[]>([]);

  /**
   * Loads game name
   */
  const loadName = useCallback(async () => {
    if (!client || gameCode === undefined) return;
    const res = await client["/portal/name"]({ gameCode });
    if ("error" in res) {
      console.error("could not find game name");
      return;
    }
    setGameName(res.gameName);
  }, [gameCode, client]);

  /**
   * Loads the game's compendium
   */
  const loadCompendium = useCallback(async () => {
    if (!client || gameCode === undefined) return;
    const res = await client["/collect/admin"]({ gameCode });
    if ("error" in res) {
      console.error("could not load compendium");
      return;
    }
    const rawCards = res.abils.cards;
    console.log("raw cards are", rawCards);
    const mappedCards: BaseCard[] = rawCards
      .map((raw) => unwrapCard(raw.card))
      .filter((card) => card !== undefined);
    setCards([...cards, ...mappedCards]);
  }, [gameCode, client]);

  useEffect(() => {
    loadName();
    loadCompendium();
  }, []);

  const features: Feature[] = BASE_FEATURES.concat(ABIL_FEATURES);
  return (
    <CenterLayout asOverlay>
      <Stack h="100dvh" p="xl" gap="xl" align="center">
        <Title>Demiplane: {gameName}</Title>
        <Group flex={1} align="flex-start" w="70dvw">
          <Panel h="90%" flex={1}>
            <Editor features={features} gameCode={gameCode!} />
          </Panel>
          <Panel h="90%" flex={1}>
            <Catalog entries={cards} onDisplay={() => {}} />
          </Panel>
        </Group>
      </Stack>
    </CenterLayout>
  );
}

export default GMPage;
