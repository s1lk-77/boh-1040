import { useClient } from "../ClientProvider";
import { useState, useCallback, useEffect, type ChangeEvent } from "react";
import { Button, Stack, Group, Input, Title, Text } from "@mantine/core";
import { GAME_CODE_REGEX, PLAYER_NAME_REGEX } from "../../../shared/constants";
import { useNavigate } from "react-router";
import CenterLayout from "../components/CenterLayout";
import { ExternalLink } from "lucide-react";

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
  const [dneError, setDneError] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const updatePlayerName = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    let newName: string = e.target.value;
    setPlayerNameError(false);
    setDneError(false);
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
    setDneError(false);
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
      setDneError(true);
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

  useEffect(() => {
    if (playerNameError || gameCodeError)
      setErrorMsg("Did you forget something?");
    else if (dneError)
      setErrorMsg(
        "The Wizard of the Court couldn't find this bag in the demiplane :(",
      );
    else setErrorMsg(null);
  }, [playerNameError, gameCodeError, dneError]);

  const openReadme = () => {
    window.open(
      "https://github.com/s1lk-77/boh-1040",
      "_blank",
      "noopener noreferrer",
    );
  };

  return (
    <CenterLayout asOverlay>
      <Stack align="center" h="96dvh" justify="space-between">
        <Text>MIT Assassins' Guild</Text>
        <Stack align="center" pos="relative">
          <Text>the journeyman's</Text>
          <Title order={1} c="black">
            Bag of Holding
          </Title>
          <Text>the one pocket to fit them all</Text>
          <Text>
            a great relievance in the Force, as if millions of trees suddenly
            cried out in salvation
          </Text>

          <Input
            placeholder="Enter game code"
            value={gameCode}
            onChange={updateGameCode}
            error={gameCodeError || dneError}
            autoComplete="off"
            autoCapitalize="off"
            onKeyDown={reopenKeydown}
          />

          <Input
            placeholder="Enter your name"
            value={playerName}
            onChange={updatePlayerName}
            error={playerNameError || dneError}
            autoComplete="off"
            autoCapitalize="off"
            onKeyDown={reopenKeydown}
          />
          <Group>
            <Button
              className="hoverGrayButton"
              bd="2px solid black"
              bg="none"
              c="black"
              onClick={openBag}
            >
              Open
            </Button>
            <Button
              className="hoverButton"
              bd="2px solid black"
              bg="yellow.3"
              c="black"
              onClick={reopenBag}
            >
              Reopen
            </Button>
          </Group>
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
            {"README"}
            <ExternalLink size={15} />
          </Button>
          <Button
            bg="none"
            c="black"
            bd="1px solid black"
            onClick={openGMView}
            className="hoverGrayButton"
          >
            I'm a GM
          </Button>
        </Group>
      </Stack>
    </CenterLayout>
  );
}

export default HomePage;
