import Panel from "../components/Panel";
import { Button, Group, Stack, Text, Scroller } from "@mantine/core";
import Editor from "../boh-components/Editor";
import { ABIL_FEATURES, BASE_FEATURES } from "../../../shared/constants";
import { Feature } from "../../../shared/types";
import { useClient } from "../ClientProvider";
import { useCallback, useEffect, useRef, useState } from "react";
import { BaseCard } from "../../../shared/types";
import { unwrapCard } from "../utilities";
import Catalog from "../boh-generics/Catalog";
import { Edit, Upload, Eye } from "lucide-react";
import "../../styles.css";
import Display from "../boh-components/Display";
import HelpTool from "../components/HelpTool";
import Uploader from "../boh-components/Uploader";

interface CompendiumProps {
  gameCode: string;
  gameName: string;
}

/**
 * The GM's dashboard page.
 */
function Compendium({ gameCode, gameName }: CompendiumProps) {
  const client = useClient();
  const [cards, setCards] = useState<BaseCard[]>([]);
  const [editorMode, setEditorMode] = useState<"add" | "update">("add");
  const [selectedCard, setSelectedCard] = useState<BaseCard | null>(null);
  const [viewMode, setViewMode] = useState<"edit" | "view" | "upload">("view");

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
    const mappedCards: BaseCard[] = rawCards
      .map((raw) => unwrapCard(raw.card))
      .filter((card) => card !== undefined);
    if (selectedCard) {
      const maybe = mappedCards.find(
        (c) => c.MYlookup === selectedCard.MYlookup,
      );
      if (maybe) setSelectedCard(maybe);
    }
    setCards([...mappedCards]);
  }, [gameCode, client, selectedCard]);

  useEffect(() => {
    loadCompendium();
  }, []);

  const onDisplay = useCallback(
    (lookup: string) => {
      const thisCard = cards.find((c) => c.MYlookup === lookup);
      if (!thisCard) return;
      setSelectedCard(thisCard);
      setEditorMode("update");
      setViewMode((m) => {
        if (m === "upload") {
          return "view";
        } else if (thisCard.MYlookup === selectedCard?.MYlookup) {
          return m === "edit" ? "view" : "edit";
        } else {
          return m;
        }
      });
    },
    [cards, selectedCard],
  );

  const initialRef = useRef<boolean>(true);

  const onSingleDelete = useCallback(
    async (lookup: string) => {
      if (!client) return;

      const res = await client["/edit/delete-entry"]({ gameCode, lookup });
      if ("error" in res) {
        console.error(`error deleting entry ${lookup} of game ${gameCode}`);
        return;
      }

      loadCompendium();
    },
    [client, gameCode],
  );

  const onBatchDelete = useCallback(
    async (batch: string[]) => {
      if (!client) return;

      const res = await Promise.all(
        batch.map((lookup) =>
          client["/edit/delete-entry"]({ gameCode, lookup }),
        ),
      );
      if ("error" in res) {
        console.error(`error batch deleting entries from game ${gameCode}`);
        return;
      }

      loadCompendium();
    },
    [client, gameCode],
  );

  const features: Feature[] = BASE_FEATURES.concat(ABIL_FEATURES);
  return (
    <>
      <Panel h="90%" flex={1} mih={0} gap="0">
        <Panel.Header m={0}>
          <Scroller w="100%">
            <Group pos="relative" wrap="nowrap">
              <Button
                c="black"
                bg={viewMode === "view" ? "red.2" : "none"}
                className="hoverTransparentButton"
                fw="normal"
                onClick={() => setViewMode("view")}
                // bd={viewMode === "view" ? "2px solid black" : "none"}
              >
                <Text mr="0.5rem">Viewer</Text>
                <Eye />
              </Button>
              <Button
                c="black"
                bg={viewMode === "edit" ? "red.2" : "none"}
                className="hoverTransparentButton"
                fw="normal"
                onClick={() => setViewMode("edit")}
                // bd={viewMode === "edit" ? "2px solid black" : "none"}
              >
                <Text mr="0.5rem">Editor</Text>
                <Edit />
              </Button>
              <Button
                c="black"
                bg={viewMode === "upload" ? "red.2" : "none"}
                className="hoverTransparentButton"
                fw="normal"
                onClick={() => setViewMode("upload")}
              >
                <Text mr="0.5rem">Uploader</Text>
                <Upload />
              </Button>
              <HelpTool fillColor="var(--mantine-color-red-4)" popLeft>
                <Text>
                  Use the <b>Viewer</b> to preview GameTeX renderings of the
                  abilities cards in your catalog. Use the <b>Editor</b> to add
                  new abilites, update existing ones, or delete abilities.
                </Text>
              </HelpTool>
            </Group>
          </Scroller>
        </Panel.Header>
        <Stack mt={0} flex={1} px="lg" mih={0}>
          {viewMode === "edit" && (
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
          )}
          {viewMode === "view" && (
            <Stack h="100%" w="100%" py="xl" align="center">
              {selectedCard ? (
                <>
                  <Display
                    gameName={gameName!}
                    playerName="TestPlayer1"
                    card={selectedCard}
                  />
                  <Display
                    gameName={gameName!}
                    playerName="TestPlayer1"
                    card={selectedCard}
                    defaultFlipped={true}
                  />
                </>
              ) : (
                <Text c="gray.6">
                  Select a card from the right to "GameTeX render" it!
                </Text>
              )}
            </Stack>
          )}
          {viewMode == "upload" && (
            <Uploader gameCode={gameCode ?? ""} onReload={loadCompendium} />
          )}
        </Stack>
      </Panel>
      <Panel h="90%" flex={1} mih={0} miw={0}>
        <Catalog
          entries={cards}
          onDisplay={onDisplay}
          w="100%"
          useColor
          initialRef={initialRef}
          useSelect
          onSingleDelete={onSingleDelete}
          onBatchDelete={onBatchDelete}
        />
      </Panel>
    </>
  );
}

export default Compendium;
