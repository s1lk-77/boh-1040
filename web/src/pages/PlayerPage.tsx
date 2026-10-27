import { useNavigate, useParams } from "react-router-dom";
import { useClient } from "../ClientProvider";
import MobileViewport from "../components/MobileViewport";
import { useCallback, useEffect, useRef, useState } from "react";
import { Flex, Group, Stack, Title, Text, Button } from "@mantine/core";
import Catalog from "../boh-components/Catalog";
import NavBar from "../boh-components/NavBar";
import { PlayerPage } from "../../../shared/constants";
import SearchBar from "../boh-components/SearchBar";
import { AbilColor, BaseCard } from "../../../shared/types";
import { unwrapCard } from "../utilities";
import Display from "../boh-components/Display";
import useBackButton from "../hooks/useBackButton";
import HelpTool from "../components/HelpTool";
import { X } from "lucide-react";
import "../../styles.css";
import { FlipProvider } from "../hooks/useFlip";
import ColorPicker from "../boh-components/ColorPicker";
import { ThemeColorProvider } from "../hooks/useThemeColor";

/**
 * The player home page.
 */
function PlayerPage() {
  const client = useClient();
  const { bagId } = useParams();
  const gameCode: string | undefined = bagId?.split("@")[1];
  const playerName: string | undefined = bagId?.split("@")[0];

  const [gameName, setGameName] = useState<string | null>(null);
  const [page, setPage] = useState<PlayerPage>("home");
  const [searching, setSearching] = useState<boolean>(false);
  const [coloring, setColoring] = useState<boolean>(false);

  const init = { MYlookup: "1", MYname: "2" };
  const [cards, setCards] = useState<BaseCard[]>([]);
  const indexRef = useRef<number>(0);
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
   * Loads the player's compendium
   */
  const loadCompendium = useCallback(async () => {
    if (!client || gameCode === undefined || playerName === undefined) return;
    const res = await client["/collect/production"]({ gameCode, playerName });
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
  }, [gameCode, playerName, client]);

  useEffect(() => {
    loadName();
    loadCompendium();
  }, []);

  const display = useCallback(
    (lookup: string) => {
      console.log(`lookup is ${lookup}`);
      initialRef.current = false;
      indexRef.current = cards.findIndex((c) => c.MYlookup === lookup);
      if (indexRef.current === -1) {
        console.error("card not found");
        return;
      }
      setSelectedCard(cards[indexRef.current]);
      setPage("display");
      setSearching(false);
    },
    [cards],
  );

  const onIndex = useCallback(
    (offset: -1 | 1) => {
      const newIndex = indexRef.current + offset;
      if (newIndex < 0 || newIndex >= cards.length) return;
      indexRef.current = newIndex;
      setSelectedCard(cards[newIndex]);
    },
    [cards],
  );

  useEffect(() => {
    setBackCb(() =>
      navigate("../..", {
        state: { gameCode, playerName },
      }),
    );
  }, [setBackCb]);

  // flags
  const initialRef = useRef<boolean>(true);

  return (
    <MobileViewport>
      <FlipProvider>
        <ThemeColorProvider>
          {page === "home" && BackButton}
          {page === "home" && (
            <HelpTool flushRight pt="sm">
              <Text size="sm">
                Click <b>"+"</b> (bottom right) to collect new abilities. Click
                on any card to view its full display.
              </Text>
            </HelpTool>
          )}
          <Stack
            h="100%"
            w="100%"
            align="center"
            pb={page === "home" ? "lg" : 0}
            pt={page === "home" ? "sm" : 0}
            mih={0}
          >
            {page === "home" && (
              <>
                <Flex direction="column" align="center">
                  <Title order={1} my={0} size="h2">
                    {gameName}
                  </Title>
                  <Text my={0}>{playerName}</Text>
                </Flex>
              </>
            )}
            {page === "display" && (
              <Group justify="flex-end" w="100%">
                <Button
                  bg="none"
                  c="red.7"
                  className="hoverRotateXs"
                  onClick={() => {
                    setPage("home");
                  }}
                  pr={0}
                >
                  <X />
                </Button>
              </Group>
            )}

            {page === "home" && (
              <Catalog
                entries={cards}
                onDisplay={display}
                initialRef={initialRef}
              />
            )}
            {page === "display" && (
              <Display
                gameName={gameName ?? "Moonrise"}
                playerName={playerName ?? "silvanvs"}
                card={selectedCard ?? cards[0] ?? init}
              />
            )}

            {searching && (
              <SearchBar
                onClose={() => {
                  setSearching(false);
                }}
                gameCode={gameCode ?? "moonrise"}
                playerName={playerName ?? "silvanvs"}
                onSuccess={(card: BaseCard) => {
                  setCards([...cards, card]);
                  setSelectedCard(card);
                  setPage("display");
                  setSearching(false);
                  indexRef.current = cards.length;
                }}
              />
            )}

            {coloring && (
              <ColorPicker
                onClose={() => {
                  setColoring(false);
                }}
              />
            )}
            <NavBar
              toggleSearch={() => {
                setSearching(!searching);
                setColoring(false);
              }}
              toggleSettings={() => {
                setColoring(!coloring);
                setSearching(false);
              }}
              onIndex={onIndex}
              showHome={page !== "home"}
              searching={searching}
              setting={coloring}
              pt={page === "home" ? undefined : "sm"}
              pb={page === "home" ? undefined : "lg"}
            />
          </Stack>
        </ThemeColorProvider>
      </FlipProvider>
    </MobileViewport>
  );
}

export default PlayerPage;
