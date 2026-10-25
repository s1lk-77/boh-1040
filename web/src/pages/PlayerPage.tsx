import { useNavigate, useParams } from "react-router-dom";
import { useClient } from "../ClientProvider";
import MobileViewport from "../components/MobileViewport";
import { useCallback, useEffect, useRef, useState } from "react";
import { Flex, Stack, Title, Text } from "@mantine/core";
import Catalog from "../boh-components/Catalog";
import NavBar from "../boh-components/NavBar";
import { PlayerPage } from "../../../shared/constants";
import SearchBar from "../boh-components/SearchBar";
import { BaseCard } from "../../../shared/types";
import { unwrapCard } from "../utilities";
import Display from "../boh-components/Display";
import useBackButton from "../hooks/useBackButton";
import HelpTool from "../components/HelpTool";

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
      {page === "home" && BackButton}
      <HelpTool flushRight pt="sm">
        <Text size="sm">
          Click <b>"+"</b> (bottom right) to collect new abilities. Click on any
          card to view its full display.
        </Text>
      </HelpTool>
      <Stack h="100%" w="100%" align="center" pb="lg" pt="sm" mih={0}>
        <Text>MIT Assassins' Guild</Text>
        {page === "home" && (
          <Flex direction="column" align="center">
            <Title order={1} my={0} size="h2">
              {gameName}
            </Title>
            <Text my={0}>{playerName}</Text>
          </Flex>
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
            showToolBar={!searching}
            onIndex={onIndex}
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
            }}
          />
        )}
        <NavBar
          toggleSearch={() => setSearching(!searching)}
          goHome={() => setPage("home")}
          showHome={page !== "home"}
          searching={searching}
        />
      </Stack>
    </MobileViewport>
  );
}

export default PlayerPage;
