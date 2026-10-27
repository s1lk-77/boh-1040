import Panel from "../components/Panel";
import { Button, Group, Stack, Text, Scroller } from "@mantine/core";
import Editor from "../boh-components/Editor";
import { ABIL_FEATURES, BASE_FEATURES } from "../../../shared/constants";
import { AbilCard, Feature } from "../../../shared/types";
import { useClient } from "../ClientProvider";
import { useCallback, useEffect, useRef, useState } from "react";
import { BaseCard } from "../../../shared/types";
import { unwrapCard } from "../utilities";
import Catalog from "../boh-generics/Catalog";
import "../../styles.css";

interface PlayerlistProps {
  gameCode: string;
}

/**
 * The GM's dashboard page.
 */
function Playerlist({ gameCode }: PlayerlistProps) {
  const client = useClient();
  const [players, setPlayers] = useState<BaseCard[]>([]);

  /**
   * Loads the game's compendium
   */
  const loadPlayerlist = useCallback(async () => {
    if (!client || gameCode === undefined) return;
    const res = await client["/collect/list-players"]({ gameCode });
    if ("error" in res) {
      console.error("could not load playerlist");
      return;
    }
    const rawList = res.playerlist;
    const mappedPlayers: BaseCard[] = rawList.map((raw) => {
      return { MYlookup: raw.playerName, MYname: raw.playerName };
    });
    console.log(mappedPlayers);
    setPlayers([...mappedPlayers]);
  }, [gameCode, client]);

  useEffect(() => {
    loadPlayerlist();
  }, []);

  const initialRef = useRef<boolean>(true);

  const onSingleDelete = useCallback(
    async (lookup: string) => {
      if (!client) return;

      const res = await Promise.resolve({});
      if ("error" in res) {
        console.error(`error deleting entry ${lookup} of game ${gameCode}`);
        return;
      }

      loadPlayerlist();
    },
    [client, gameCode],
  );

  const onBatchDelete = useCallback(
    async (batch: string[]) => {
      if (!client) return;

      const res = await Promise.all(batch.map((lookup) => Promise.resolve({})));
      if ("error" in res) {
        console.error(`error batch deleting entries from game ${gameCode}`);
        return;
      }

      loadPlayerlist();
    },
    [client, gameCode],
  );

  const features: Feature[] = BASE_FEATURES.concat(ABIL_FEATURES);
  return (
    <>
      <Panel h="90%" flex={1} mih={0} miw={0}>
        <Catalog
          cardType="Player"
          entries={players}
          onDisplay={() => {}}
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

export default Playerlist;
