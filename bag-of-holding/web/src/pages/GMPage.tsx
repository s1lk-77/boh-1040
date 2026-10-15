import Panel from "../components/Panel";
import CenterLayout from "../components/CenterLayout";
import { Group, Stack, Text, Title } from "@mantine/core";
import { useNavigate, useParams } from "react-router-dom";
import Editor from "../boh-components/Editor";
import { ABIL_FEATURES, BASE_FEATURES } from "../../../shared/constants";
import { Feature } from "../../../shared/types";
import { useClient } from "../ClientProvider";
import { useCallback, useEffect, useState } from "react";
import { BaseCard } from "../../../shared/types";
import { unwrapCard } from "../utilities";
import Catalog from "../boh-components/Catalog";
import useBackButton from "../hooks/useBackButton";

/**
 * The GM's dashboard page.
 */
function GMPage() {
  const { gameCode } = useParams();
  const client = useClient();
  const [gameName, setGameName] = useState<string | null>(null);
  const [cards, setCards] = useState<BaseCard[]>([]);
  const [editorMode, setEditorMode] = useState<"add" | "update">("add");
  const [selectedCard, setSelectedCard] = useState<BaseCard | null>(null);
  const { BackButton, setBackCb } = useBackButton();
  const navigate = useNavigate();

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
    setCards([...mappedCards]);
  }, [gameCode, client]);

  useEffect(() => {
    loadName();
    loadCompendium();
  }, []);

  const backCb = useCallback(() => {
    navigate("../../portal");
  }, []);
  useEffect(() => {
    setBackCb(backCb);
  }, [backCb, setBackCb]);

  const onDisplay = useCallback(
    (lookup: string) => {
      const thisCard = cards.find((c) => c.MYlookup === lookup);
      if (!thisCard) return;
      setSelectedCard(thisCard);
      setEditorMode("update");
    },
    [cards],
  );

  const features: Feature[] = BASE_FEATURES.concat(ABIL_FEATURES);
  return (
    <CenterLayout asOverlay pos="relative">
      {BackButton}
      <Stack h="100dvh" pt="xl" pb="l" px="l" gap="xl" align="center" mih={0}>
        <Text>MIT Assassins' Guild</Text>
        <Title mt={0}>Demiplane: {gameName}</Title>
        <Group flex={1} mih={0} align="flex-start" w="70dvw">
          <Panel h="90%" flex={1}>
            <Editor
              features={
                editorMode === "update"
                  ? features.filter((f) => f.name !== "MYlookup")
                  : features
              }
              gameCode={gameCode!}
              mode={editorMode}
              card={editorMode === "update" ? selectedCard! : undefined}
              setMode={setEditorMode}
              onReload={() => {
                loadCompendium();
                setEditorMode("add");
              }}
            />
          </Panel>
          <Panel h="90%" flex={1} mih={0}>
            <Catalog entries={cards} onDisplay={onDisplay} w="100%" />
          </Panel>
        </Group>
      </Stack>
    </CenterLayout>
  );
}

export default GMPage;
