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
  gameName: string;
}

/**
 * The GM's dashboard page.
 */
function Playerlist({ gameCode, gameName }: PlayerlistProps) {
  const client = useClient();
  const [players, setPlayers] = useState<BaseCard[]>([]);
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
    setPlayers([...mappedCards]);
  }, [gameCode, client, selectedCard]);

  useEffect(() => {
    loadCompendium();
  }, []);

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
