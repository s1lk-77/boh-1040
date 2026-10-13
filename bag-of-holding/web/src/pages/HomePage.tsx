import { useClient } from "../ClientProvider";
import { useState, useCallback } from "react";

/**
 * The home page of the app.
 */
function HomePage() {
  const client = useClient();
  const [test, setTest] = useState<string>("default");

  const load = useCallback(async () => {
    if (client === null) return;
    const res = await client["/portal/open-bag"]({
      gameCode: "test1",
      playerName: "silk",
    });
    if ("error" in res) return;
    else {
      setTest(res.gameCode);
    }
  }, [client]);

  return (
    <>
      <div>Hello from HomePage!</div>
      <button onClick={load}>Click me!</button>
      <div>{test}</div>
    </>
  );
}

export default HomePage;
