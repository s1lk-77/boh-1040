import { useClient } from "../ClientProvider";
import { useState, useCallback, type ChangeEvent } from "react";
import { Button, Stack, Group, Input, Title, Text } from "@mantine/core";
import { GAME_CODE_REGEX, PLAYER_NAME_REGEX } from "../../../shared/constants";
import { useNavigate } from "react-router";
import CenterLayout from "../components/CenterLayout";

/**
 * The home page of the app.
 */
function HomePage() {
  const client = useClient();
  const navigate = useNavigate();

  const [gameCode, setGameCode] = useState<string>("");
  const [playerName, setPlayerName] = useState<string>("");
  const [gameCodeError, setGameCodeError] = useState<boolean>(false);
  const [playerNameError, setPlayerNameError] = useState<boolean>(false);

  const updatePlayerName = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    let newName: string = e.target.value;
    setPlayerNameError(false);
    if (PLAYER_NAME_REGEX.test(newName) || newName === "") {
      setPlayerName(newName);
    } else if (newName.at(-1) === " " && newName.at(-2) !== "-") {
      newName = newName.replace(" ", "-");
      setPlayerName(newName);
    }
  }, []);

  const updateGameCode = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    let newCode: string = e.target.value;
    setGameCodeError(false);
    if (GAME_CODE_REGEX.test(newCode)) {
      setGameCode(newCode.toLowerCase());
    }
  }, []);

  const openBag = useCallback(async () => {
    if (client === null) return;
    const res = await client["/portal/open-bag"]({ gameCode, playerName });
    if ("error" in res) {
      console.error(res.error);
    } else {
      navigate(`bag/${res.playerName}@${res.gameCode}`, {
        state: { gameCode: res.gameCode, playerName: res.playerName },
      });
    }
  }, [client, gameCode, playerName]);

  const reopenBag = useCallback(async () => {
    if (client === null) return;
    if (gameCode === "") {
      setGameCodeError(true);
      return;
    }
    if (playerName === "") {
      setPlayerNameError(true);
      return;
    }
    const res = await client["/portal/reopen-bag"]({ gameCode, playerName });
    if ("error" in res) {
      console.error(res.error);
    } else {
      navigate(`bag/${res.playerName}@${res.gameCode}`, {
        state: { gameCode: res.gameCode, playerName: res.playerName },
      });
    }
  }, [client, gameCode, playerName]);

  const openGMView = useCallback(() => {
    navigate("/portal");
  }, []);

  const reopenKeydown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      reopenBag();
    }
  };

  return (
    <CenterLayout asOverlay>
      <Stack align="center" h="96dvh" justify="space-between">
        <Text>MIT Assassins' Guild</Text>
        <Stack align="center">
          <Text>the journeyman's</Text>
          <Title>Bag of Holding</Title>
          <Text>the one pocket to fit them all</Text>
          <Text>
            a great relievance in the Force, as if millions of trees suddenly
            cried out in salvation
          </Text>

          <Input
            placeholder="Enter game code"
            value={gameCode}
            onChange={updateGameCode}
            error={gameCodeError}
            autoComplete="off"
            autoCapitalize="off"
            onKeyDown={reopenKeydown}
          />

          <Input
            placeholder="Enter your name"
            value={playerName}
            onChange={updatePlayerName}
            error={playerNameError}
            autoComplete="off"
            autoCapitalize="off"
            onKeyDown={reopenKeydown}
          />
          <Group>
            <Button bd="2px solid black" bg="none" c="black" onClick={openBag}>
              Open
            </Button>
            <Button
              bd="2px solid black"
              bg="yellow.3"
              c="black"
              onClick={reopenBag}
            >
              Reopen
            </Button>
          </Group>
        </Stack>
        <Group>
          <Button>README</Button>
          <Button onClick={openGMView}>I'm a GM</Button>
        </Group>
      </Stack>
    </CenterLayout>
  );
}

export default HomePage;
