import Panel from "../components/Panel";
import CenterLayout from "../components/CenterLayout";
import { Button, Box, Group, Input, Stack, Text, Title } from "@mantine/core";
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
import { useFocusTrap } from "@mantine/hooks";
import { Edit, Upload, X, Eye } from "lucide-react";
import "../../styles.css";
import Display from "../boh-components/Display";

/**
 * The GM's dashboard page.
 */
function GMPage() {
  const { gameCode } = useParams();
  const client = useClient();
  const [gameName, setGameName] = useState<string | null>(null);
  const [updatedGameName, setUpdatedGameName] = useState<string>("");
  const [cards, setCards] = useState<BaseCard[]>([]);
  const [editorMode, setEditorMode] = useState<"add" | "update">("add");
  const [selectedCard, setSelectedCard] = useState<BaseCard | null>(null);
  const { BackButton, setBackCb } = useBackButton();
  const [editingName, setEditingName] = useState<boolean>(false);
  const focusTrapRef = useFocusTrap(editingName);
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"edit" | "view">("view");

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

  const uploadName = useCallback(async () => {
    if (!client || !gameCode || updatedGameName === "") return;
    const newName = updatedGameName;
    const res = await client["/edit/update-name"]({
      gameCode,
      gameName: newName,
    });
    if ("error" in res) {
      console.error(res);
      return;
    }
    setUpdatedGameName("");
    setGameName(newName);
    setEditingName(false);
  }, [gameCode, client, updatedGameName]);

  const features: Feature[] = BASE_FEATURES.concat(ABIL_FEATURES);
  return (
    <CenterLayout asOverlay pos="relative">
      {BackButton}
      <Stack h="100dvh" pt="xl" pb="l" px="l" gap="xl" align="center" mih={0}>
        <Text>MIT Assassins' Guild</Text>
        <Box
          h="calc(var(--mantine-h1-font-size) * var(--mantine-h1-line-height))"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {editingName ? (
            <Group
              ref={focusTrapRef}
              h="calc(var(--mantine-h1-font-size) * var(--mantine-h1-line-height))"
              align="center"
            >
              <Input
                data-autofocus
                autoFocus
                value={updatedGameName}
                onChange={(e) => {
                  setUpdatedGameName(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    uploadName();
                  } else if (e.key === "Escape") {
                    setEditingName(false);
                  }
                }}
                styles={{
                  input: {
                    fontFamily: "Fira Code, monospace",
                    fontWeight: 450,
                    border: "2px solid black",
                  },
                }}
              />
              <Upload
                role="button"
                tabIndex={0}
                aria-label="Save title"
                className="u-pointer hoverTransparentButton"
                onClick={uploadName}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    uploadName();
                  }
                }}
              />
              <X
                role="button"
                tabIndex={0}
                aria-label="Cancel editing title"
                color="var(--mantine-color-red-8)"
                className="u-pointer hoverRotateXs"
                onClick={() => setEditingName(false)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setEditingName(false);
                  }
                }}
              />
            </Group>
          ) : (
            <Title
              order={1}
              h="calc(var(--mantine-h1-font-size) * var(--mantine-h1-line-height))"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              {gameName}{" "}
              <Edit
                className="u-pointer hoverTransparentButton"
                onClick={() => {
                  setUpdatedGameName(gameName ?? "");
                  setEditingName(true);
                }}
              />
            </Title>
          )}
        </Box>
        <Group flex={1} mih={0} align="flex-start" w="70dvw">
          <Panel h="90%" flex={1} gap="0">
            <Panel.Header m={0}>
              <Group w="100%">
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
                {/* <Button
                  c="black"
                  bg="none"
                  className="hoverTransparentButton"
                  fw="normal"
                >
                  Upload
                </Button> */}
              </Group>
            </Panel.Header>
            <Stack mt={0} flex={1} px="lg">
              {viewMode === "edit" ? (
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
              ) : (
                <Stack h="100%" w="100%" py="xl" align="center">
                  {selectedCard ? (
                    <>
                      <Display
                        gameName={gameName!}
                        onIndex={() => {}}
                        showToolBar={false}
                        playerName="TestPlayer1"
                        card={selectedCard}
                      />
                      <Display
                        gameName={gameName!}
                        onIndex={() => {}}
                        showToolBar={false}
                        playerName="TestPlayer1"
                        card={selectedCard}
                        defaultFlipped={true}
                      />
                    </>
                  ) : (
                    <Text c="gray.6">Select a card to view it!</Text>
                  )}
                </Stack>
              )}
            </Stack>
          </Panel>
          <Panel h="90%" flex={1} mih={0}>
            <Catalog entries={cards} onDisplay={onDisplay} w="100%" useColor />
          </Panel>
        </Group>
      </Stack>
    </CenterLayout>
  );
}

export default GMPage;
