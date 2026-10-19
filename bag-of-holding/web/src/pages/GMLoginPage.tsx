import { Stack, Text, Title, Input, Button, Group } from "@mantine/core";
import CenterLayout from "../components/CenterLayout";
import { useEffect, useState, useCallback, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useClient } from "../ClientProvider";
import { GAME_CODE_REGEX } from "../../../shared/constants";
import { ExternalLink } from "lucide-react";

/**
 * The GM login page
 */
function GMLoginPage() {
  const client = useClient();
  const navigate = useNavigate();

  const [gameCode, setGameCode] = useState<string>("");
  const [gameName, setGameName] = useState<string>("");
  const [createMode, setCreateMode] = useState<boolean>(false);
  const [gameCodeError, setGameCodeError] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [dneError, setDneError] = useState<boolean>(false);

  const updateGameCode = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    let newCode: string = e.target.value;
    setGameCodeError(false);
    setDneError(false);
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
      setDneError(true);
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

  useEffect(() => {
    if (gameCodeError) setErrorMsg("We need a game code!");
    else if (dneError) setErrorMsg("The demiplane rejected this connection :(");
    else setErrorMsg(null);
  }, [gameCodeError, dneError]);

  const openReadme = useCallback(() => {
    window.open(
      "https://github.com/s1lk-77/boh-1040/blob/main/documentations/GM-guide.md",
      "_blank",
      "noopener noreferrer",
    );
  }, []);

  return (
    <CenterLayout asOverlay>
      <Stack align="center" h="96dvh" justify="space-between">
        <Text>MIT Assassins' Guild</Text>
        <Stack align="center" pos="relative">
          {!createMode && (
            <>
              <Title>Welcome, GM!</Title>

              <Input
                placeholder="Enter game code"
                value={gameCode}
                onChange={updateGameCode}
                autoComplete="off"
                autoCapitalize="off"
                error={gameCodeError}
                onKeyDown={reopenKeydown}
                styles={{
                  input: {
                    fontFamily: "Fira Code, monospace",
                    fontWeight: 450,
                  },
                }}
              />
              <Group>
                <Button
                  className="hoverButton"
                  bd="2px solid black"
                  bg="none"
                  c="black"
                  onClick={() => {
                    if (gameCode === "") {
                      setGameCodeError(true);
                      return;
                    }
                    setCreateMode(true);
                  }}
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
            </>
          )}
          {createMode && (
            <>
              <Title>Pick a name for your game</Title>
              <Input
                placeholder="Enter game name"
                value={gameName}
                onChange={(e) => setGameName(e.target.value)}
                autoComplete="off"
                autoCapitalize="off"
                styles={{
                  input: {
                    fontFamily: "Fira Code, monospace",
                    fontWeight: 450,
                  },
                }}
              />
              <Group>
                <Button
                  className="hoverButton"
                  bd="2px solid black"
                  bg="yellow.3"
                  c="black"
                  onClick={createGame}
                >
                  Confirm
                </Button>
              </Group>
            </>
          )}
          {errorMsg !== null && (
            <Text pos="absolute" top="105%" c="red">
              {errorMsg}
            </Text>
          )}
        </Stack>
        <Group>
          <Button
            bg="none"
            c="black"
            bd="1px solid black"
            className="hoverGrayButton"
            onClick={openReadme}
          >
            README
            <ExternalLink size={15} />
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
