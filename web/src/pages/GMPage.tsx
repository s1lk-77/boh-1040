import Panel from "../components/Panel";
import CenterLayout from "../components/CenterLayout";
import { Button, Box, Group, Input, Stack, Text, Title } from "@mantine/core";
import { useNavigate, useParams } from "react-router-dom";
import { useClient } from "../ClientProvider";
import { useCallback, useEffect, useState } from "react";
import useBackButton from "../hooks/useBackButton";
import { useFocusTrap } from "@mantine/hooks";
import { Edit, Upload, X, PlayingCardsFan, UsersRound } from "lucide-react";
import "../../styles.css";
import { ThemeColorProvider } from "../hooks/useThemeColor";
import Compendium from "../boh-components/Compendium";

/**
 * The GM's dashboard page.
 */
function GMPage() {
  const { gameCode } = useParams();
  const client = useClient();
  const [gameName, setGameName] = useState<string | null>(null);
  const [updatedGameName, setUpdatedGameName] = useState<string>("");
  const { BackButton, setBackCb } = useBackButton();
  const [editingName, setEditingName] = useState<boolean>(false);
  const focusTrapRef = useFocusTrap(editingName);
  const navigate = useNavigate();

  /**
   * Loads game name
   */
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

  const backCb = useCallback(() => {
    navigate("../../portal");
  }, []);
  useEffect(() => {
    setBackCb(backCb);
  }, [backCb, setBackCb]);

  const uploadName = useCallback(async () => {
    if (!client || !gameCode || updatedGameName === "") return;
    const newName = updatedGameName;
    const res = await client["/edit/update-name"]({
      gameCode,
      gameName: newName,
    });
    if ("error" in res) {
      console.error(res);
      return;
    }
    setUpdatedGameName("");
    setGameName(newName);
    setEditingName(false);
  }, [gameCode, client, updatedGameName]);

  return (
    <CenterLayout asOverlay pos="relative">
      {BackButton}
      <ThemeColorProvider>
        <Stack h="100dvh" pt="xl" pb="l" px="l" gap="xl" align="center" mih={0}>
          <Text>MIT Assassins' Guild</Text>
          <Box
            h="calc(var(--mantine-h1-font-size) * var(--mantine-h1-line-height))"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {editingName ? (
              <Group
                ref={focusTrapRef}
                h="calc(var(--mantine-h1-font-size) * var(--mantine-h1-line-height))"
                align="center"
              >
                <Input
                  data-autofocus
                  autoFocus
                  value={updatedGameName}
                  onChange={(e) => {
                    setUpdatedGameName(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      uploadName();
                    } else if (e.key === "Escape") {
                      setEditingName(false);
                    }
                  }}
                  styles={{
                    input: {
                      fontFamily: "Fira Code, monospace",
                      fontWeight: 450,
                      border: "2px solid black",
                    },
                  }}
                />
                <Upload
                  role="button"
                  tabIndex={0}
                  aria-label="Update game name"
                  className="u-pointer hoverTransparentButton"
                  onClick={uploadName}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      uploadName();
                    }
                  }}
                />
                <X
                  role="button"
                  tabIndex={0}
                  aria-label="Cancel editing game name"
                  color="black"
                  className="u-pointer hoverRotateXs"
                  onClick={() => setEditingName(false)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setEditingName(false);
                    }
                  }}
                />
              </Group>
            ) : (
              <Title
                order={1}
                h="calc(var(--mantine-h1-font-size) * var(--mantine-h1-line-height))"
                className="u-goth"
                size="5rem"
                c="red.3"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  textShadow: "2px 2px 4px black",
                }}
              >
                {gameName}{" "}
                <Edit
                  className="u-pointer hoverTransparentButton"
                  onClick={() => {
                    setUpdatedGameName(gameName ?? "");
                    setEditingName(true);
                  }}
                />
              </Title>
            )}
          </Box>
          <Group flex={1} mih={0} align="flex-start" w="70dvw">
            <Panel bg="red.6">
              <Stack>
                <Button
                  className="hoverTransparentButton"
                  bg="none"
                  c="white"
                  px="xs"
                >
                  <PlayingCardsFan />
                </Button>
                <Button
                  className="hoverTransparentButton"
                  bg="none"
                  c="white"
                  px="xs"
                >
                  <UsersRound />
                </Button>
              </Stack>
            </Panel>
            <Compendium
              gameCode={gameCode ?? "moonrise"}
              gameName={gameName ?? "Moonrise"}
            />
          </Group>
        </Stack>
      </ThemeColorProvider>
    </CenterLayout>
  );
}

export default GMPage;
