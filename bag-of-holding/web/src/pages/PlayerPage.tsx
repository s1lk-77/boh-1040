import { useParams } from "react-router-dom";
import { useClient } from "../ClientProvider";
import MobileViewport from "../components/MobileViewport";
import { useCallback, useEffect, useState } from "react";
import { Stack, Title } from "@mantine/core";
import Catalog from "../boh-components/Catalog";
import NavBar from "../boh-components/NavBar";
import { PlayerPage } from "../../../shared/constants";
import SearchBar from "../boh-components/SearchBar";

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

  const loadName = useCallback(async () => {
    if (!client || gameCode === undefined) return;
    const res = await client["/portal/name"]({ gameCode });
    if ("error" in res) {
      console.error("could not find game name");
      return;
    }
    setGameName(res.gameName);
  }, [gameCode, client]);

  useEffect(() => {
    loadName();
  }, []);

  const hardCode = [
    { name: "a1", lookup: "123" },
    { name: "a2", lookup: "234923" },
  ];

  const display = useCallback((lookup: string) => {
    console.log(`${lookup}`);
  }, []);

  return (
    <MobileViewport>
      <Stack h="100%" w="100%" align="center" py="lg" mih={0}>
        <Title>{gameName}</Title>
        <Catalog entries={hardCode} onDisplay={display} />
        {searching && (
          <SearchBar
            gameCode={gameCode ?? "moonrise"}
            playerName={playerName ?? "silvanvs"}
            onSuccess={() => {}}
          />
        )}
        <NavBar toggleSearch={() => setSearching(!searching)} />
      </Stack>
    </MobileViewport>
  );
}

export default PlayerPage;
