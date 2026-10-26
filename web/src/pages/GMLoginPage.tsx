import {
  Stack,
  Text,
  Title,
  Input,
  Button,
  Group,
  Flex,
  Image,
} from "@mantine/core";
import CenterLayout from "../components/CenterLayout";
import {
  useEffect,
  useState,
  useCallback,
  useRef,
  type ChangeEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import { useClient } from "../ClientProvider";
import { GAME_CODE_REGEX } from "../../../shared/constants";
import { ExternalLink, Feather } from "lucide-react";
import HelpTool from "../components/HelpTool";
import "../../styles.css";
import logo from "../assets/GuildLogo.png";

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
  const [validateError, setValidateError] = useState<boolean>(false);
  const busyRef = useRef<boolean>(false);

  const updateGameCode = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    let newCode: string = e.target.value;
    setGameCodeError(false);
    setDneError(false);
    setValidateError(false);
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
    if (!client || busyRef.current) return;
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
    else if (validateError)
      setErrorMsg("Game code taken. Please pick another one!");
    else setErrorMsg(null);
  }, [gameCodeError, dneError, validateError]);

  const openReadme = useCallback(() => {
    window.open(
      "https://github.com/s1lk-77/boh-1040/blob/main/documentations/GM-guide.md",
      "_blank",
      "noopener noreferrer",
    );
  }, []);

  const maybeCreateGame = useCallback(async () => {
    if (!client || busyRef.current) return;
    if (gameCode === "") {
      setGameCodeError(true);
      return;
    }
    const snapshot = gameCode;
    busyRef.current = true;
    const res = await client["/portal/validate"]({ gameCode });
    busyRef.current = false;
    if ("error" in res) {
      console.error("error");
      return;
    }

    if (res.available) {
      setCreateMode(true);
      setGameCode(snapshot);
    } else {
      setValidateError(true);
    }
  }, [gameCode, client]);

  return (
    <CenterLayout asOverlay>
      <Stack align="center" h="96dvh" justify="space-between">
        <Image
          src={logo}
          alt="no image"
          h="12dvh"
          fit="scale-down"
          mt="-4dvh"
        />
        <Stack align="center" pos="relative">
          {!createMode && (
            <>
              <Title>Welcome, Gamemaster</Title>

              <Flex pos="relative">
                <HelpTool fillColor="var(--mantine-color-red-3)">
                  <Text>
                    To <b>create a new game</b>, enter an alphanumeric game code
                    of choice (e.g.{" "}
                    <Text span className="u-fira-code">
                      starlight
                    </Text>
                    ). Shorter is good! To <b>reopen your game</b>, just
                    re-enter the same code.
                  </Text>
                </HelpTool>
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
                      border: "2px solid black",
                      backgroundColor: "var(--mantine-color-gray-2)",
                    },
                  }}
                />
              </Flex>
              <Group>
                <Button
                  bd="2px solid black"
                  className="hoverLightRedButton"
                  bg="red.6"
                  c="black"
                  onClick={maybeCreateGame}
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
                  Reopen game
                </Button>
              </Group>
            </>
          )}
          {createMode && (
            <>
              <Title ta="center">Pick a name for your game!</Title>
              <Flex pos="relative">
                <Text
                  pos="absolute"
                  left="105%"
                  style={{ whiteSpace: "nowrap" }}
                >
                  (You can change it later)
                </Text>
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
                      border: "2px solid black",
                      backgroundColor: "var(--mantine-color-gray-2)",
                    },
                  }}
                />
              </Flex>
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
                <Button
                  className="hoverLightRedButton"
                  bg="red.6"
                  bd="2px solid black"
                  c="black"
                  onClick={() => {
                    setGameName("");
                    setCreateMode(false);
                    setDneError(false);
                  }}
                >
                  Cancel
                </Button>
              </Group>
            </>
          )}
          {errorMsg !== null && (
            <Text pos="absolute" top="105%" c="gray.2">
              {errorMsg}
            </Text>
          )}
        </Stack>
        <Group>
          <Button
            className="hoverLightRedButton"
            bg="red.6"
            c="black"
            bd="1px solid black"
            onClick={openReadme}
          >
            README
            <ExternalLink size={15} />
          </Button>
          <Button
            className="hoverLightRedButton"
            bg="red.6"
            c="black"
            bd="1px solid black"
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
