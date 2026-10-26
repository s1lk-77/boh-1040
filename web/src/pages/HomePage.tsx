import { useClient } from "../ClientProvider";
import {
  useState,
  useCallback,
  useEffect,
  type ChangeEvent,
  useRef,
} from "react";
import {
  Flex,
  Button,
  Stack,
  Group,
  Input,
  Title,
  Text,
  Image,
} from "@mantine/core";
import { GAME_CODE_REGEX, PLAYER_NAME_REGEX } from "../../../shared/constants";
import { useNavigate, useLocation } from "react-router";
import CenterLayout from "../components/CenterLayout";
import { ExternalLink } from "lucide-react";
import HelpTool from "../components/HelpTool";
import "../../styles.css";
import logo from "../assets/GuildLogo.png";

/**
 * The home page of the app.
 */
function HomePage() {
  const client = useClient();
  const navigate = useNavigate();
  const location = useLocation();

  const [gameCode, setGameCode] = useState<string>("");
  const [playerName, setPlayerName] = useState<string>("");
  const [gameCodeError, setGameCodeError] = useState<boolean>(false);
  const [playerNameError, setPlayerNameError] = useState<boolean>(false);
  const [dneError, setDneError] = useState<"code" | "name" | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const locFlagRef = useRef<boolean>(false);
  useEffect(() => {
    if (!locFlagRef.current) {
      setGameCode(location?.state?.gameCode ?? "");
      setPlayerName(location?.state?.playerName ?? "");
    }
  }, [location]);

  const updatePlayerName = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    let newName: string = e.target.value;
    setPlayerNameError(false);
    setDneError(null);
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
    setDneError(null);
    if (GAME_CODE_REGEX.test(newCode)) {
      setGameCode(newCode.toLowerCase());
    }
  }, []);

  const openBag = useCallback(async () => {
    if (client === null) return;
    if (gameCode === "") {
      setGameCodeError(true);
      return;
    }
    if (playerName === "") {
      setPlayerNameError(true);
      return;
    }
    const res = await client["/portal/open-bag"]({ gameCode, playerName });
    if ("error" in res) {
      setDneError("code");
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
      setDneError("name");
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
    else if (dneError === "code")
      setErrorMsg(
        "The Wizard of the Court couldn't find the demiplane you're looking for :(",
      );
    else if (dneError === "name")
      setErrorMsg(
        "The Wizard of the Court couldn't find the bag you're looking for :(",
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
        <Image
          src={logo}
          alt="no image"
          h="12dvh"
          fit="scale-down"
          mt="-4dvh"
        />
        <Stack align="center" pos="relative">
          <Text c="red.4" ta="center">
            the journeyman's
          </Text>

          <Title
            order={1}
            c="black"
            className="u-goth"
            size="5rem"
            ta="center"
            style={{ textShadow: "2px 2px 4px var(--mantine-color-gray-2)" }}
          >
            Bag of Holding
          </Title>
          <Text c="red.4" ta="center">
            the one pocket to fit them all...
          </Text>
          <Stack pos="relative">
            <Input
              placeholder="Enter game code..."
              value={gameCode}
              onChange={updateGameCode}
              error={gameCodeError || dneError}
              autoComplete="off"
              autoCapitalize="off"
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

            <Input
              placeholder="Enter your name..."
              value={playerName}
              onChange={updatePlayerName}
              error={playerNameError || dneError}
              autoComplete="off"
              autoCapitalize="off"
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
            <HelpTool fillColor="var(--mantine-color-red-3)">
              <Text size="sm">
                To{" "}
                <Text fw="bold" span>
                  open a new bag
                </Text>
                , enter the game code provided by your GMs and pick a name (e.g.
                your name). To{" "}
                <Text fw="bold" span>
                  reopen your bag
                </Text>
                , re-enter the game code and the name you picked.
              </Text>
            </HelpTool>
          </Stack>
          <Group>
            <Button
              className="hoverLightRedButton"
              bd="2px solid black"
              bg="red.6"
              c="black"
              onClick={openBag}
            >
              Open this bag
            </Button>
            <Button
              className="hoverButton"
              bd="2px solid black"
              bg="yellow.3"
              c="black"
              onClick={reopenBag}
            >
              Reopen bag
            </Button>
          </Group>
          {errorMsg !== null && (
            <Text pos="absolute" top="105%" c="gray.2" ta="center">
              {errorMsg}
            </Text>
          )}
        </Stack>
        <Flex direction="column" align="center" gap="xs">
          <Text pos="relative">
            A better pocket for your ability cards
            <HelpTool
              fillColor="var(--mantine-color-red-3)"
              useEllipsis
              mt="-5"
              ml="-10"
            >
              <b>Bag of Holding (BoH)</b> is a digital assistant that
              inventories your out-of-game cards and stores them in an
              accessible digital pocket, eliminating the tedium of physical
              cutouts while fully preserving the GameTeX look. BoH is designed
              for mobile devices smaller than an iPad, with a full-screen editor
              dashboard for GMs.
            </HelpTool>
          </Text>
          <Group>
            <Button
              bg="red.6"
              c="black"
              bd="1px solid black"
              className="hoverLightRedButton"
              onClick={openReadme}
            >
              {"README"}
              <ExternalLink size={15} />
            </Button>
            <Button
              bg="red.6"
              c="black"
              bd="1px solid black"
              onClick={openGMView}
              className="hoverLightRedButton"
            >
              I'm a GM
            </Button>
          </Group>
        </Flex>
      </Stack>
    </CenterLayout>
  );
}

export default HomePage;
