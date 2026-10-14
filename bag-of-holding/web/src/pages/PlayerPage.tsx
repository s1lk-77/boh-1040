import { useParams } from "react-router-dom";
import { useClient } from "../ClientProvider";
import MobileViewport from "../components/MobileViewport";
import { useCallback, useEffect, useState } from "react";
import { Stack, Title } from "@mantine/core";
import Catalog from "../boh-components/Catalog";
import NavBar from "../boh-components/NavBar";
import { PlayerPage } from "../../../shared/constants";
import SearchBar from "../boh-components/SearchBar";
import { BaseCard } from "../../../shared/types";

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

  const hardCode: BaseCard[] = [
    { MYname: "a1", MYlookup: "123" },
    { MYname: "a2", MYlookup: "234923" },
  ];
  const [entries, setEntries] = useState<BaseCard[]>(hardCode);

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

  const display = useCallback((lookup: string) => {
    console.log(`${lookup}`);
  }, []);

  return (
    <MobileViewport>
      <Stack h="100%" w="100%" align="center" py="lg" mih={0}>
        <Title>{gameName}</Title>
        <Catalog entries={entries} onDisplay={display} />
        {searching && (
          <SearchBar
            gameCode={gameCode ?? "moonrise"}
            playerName={playerName ?? "silvanvs"}
            onSuccess={(card: BaseCard) => {
              setEntries([...entries, card]);
            }}
          />
        )}
        <NavBar toggleSearch={() => setSearching(!searching)} />
      </Stack>
    </MobileViewport>
  );
}

export default PlayerPage;
