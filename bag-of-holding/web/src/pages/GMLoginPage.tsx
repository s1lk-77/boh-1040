import { Stack, Text, Title, Input, Button, Group } from "@mantine/core";
import CenterLayout from "../components/CenterLayout";
import { useState, useCallback, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useClient } from "../ClientProvider";
import { GAME_CODE_REGEX } from "../../../shared/constants";

/**
 * The GM login page
 */
function GMLoginPage() {
  const client = useClient();
  const navigate = useNavigate();

  const [gameCode, setGameCode] = useState<string>("");
  const [gameName, setGameName] = useState<string>("");
  const [gameCodeError, setGameCodeError] = useState<boolean>(false);
  const [playerNameError, setPlayerNameError] = useState<boolean>(false);

  const updateGameCode = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    let newCode: string = e.target.value;
    if (GAME_CODE_REGEX.test(newCode)) {
      setGameCode(newCode.toLowerCase());
    }
  }, []);

  const createGame = useCallback(async () => {
    if (client === null) return;
    const res = await client["/portal/create-game"]({ gameCode, gameName });
    if ("error" in res) {
      console.error(res.error);
    } else {
      navigate(`../demiplane/${res.gameCode}`, {
        state: { gameCode: res.gameCode },
      });
    }
  }, [client, gameCode, gameName]);

  const reopenGame = useCallback(async () => {
    if (client === null) return;
    const res = await client["/portal/reopen-game"]({ gameCode });
    if ("error" in res) {
      console.error(res.error);
    } else {
      navigate(`../demiplane/${res.gameCode}`, {
        state: { gameCode: res.gameCode },
      });
    }
  }, [client, gameCode, gameName]);

  const openPlayerView = useCallback(() => {
    navigate("..");
  }, []);

  const reopenKeydown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      reopenGame();
    }
  };

  return (
    <CenterLayout asOverlay>
      <Stack align="center" h="96dvh" justify="space-between">
        <Text>MIT Assassins' Guild</Text>
        <Stack align="center">
          <Title>Welcome, GM!</Title>

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
            placeholder="Enter game name"
            value={gameName}
            onChange={(e) => setGameName(e.target.value)}
            error={playerNameError}
            autoComplete="off"
            autoCapitalize="off"
          />
          <Group>
            <Button
              className="hoverButton"
              bd="2px solid black"
              bg="none"
              c="black"
              onClick={createGame}
            >
              Create this game
            </Button>
            <Button
              className="hoverButton"
              bd="2px solid black"
              bg="yellow.3"
              c="black"
              onClick={reopenGame}
            >
              Reopen this game
            </Button>
          </Group>
        </Stack>
        <Group>
          <Button
            bg="none"
            c="black"
            bd="1px solid black"
            className="hoverGrayButton"
          >
            README
          </Button>
          <Button
            bg="none"
            c="black"
            bd="1px solid black"
            className="hoverGrayButton"
            onClick={openPlayerView}
          >
            I'm a player
          </Button>
        </Group>
      </Stack>
    </CenterLayout>
  );
}

export default GMLoginPage;
