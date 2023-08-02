import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import { getBotEvents } from "../dbModels/Event";

export const getServerSideProps: GetServerSideProps<{
  botEvents: any;
}> = async () => {
  const botEvents = await getBotEvents();
  return { props: { botEvents } };
};

export function BotBlocker({
  botEvents,
}: InferGetServerSidePropsType<typeof getServerSideProps>): JSX.Element {
  async function blockIP(ipAddress: string) {
    try {
      const headers = {
        "Content-Type": "application/json",
      };

      const response = await fetch("/api/create-firewall-rule", {
        method: "POST",
        headers: headers,
        body: JSON.stringify({ ipAddress }),
      });

      if (response.ok) {
        console.log("Firewall rule created successfully!");
      } else {
        console.log("Failed to create firewall rule.");
      }
    } catch (error) {
      console.error("An error occurred:", error.message);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div
        style={{ display: "flex", flexDirection: "row", fontWeight: "bold" }}
      >
        <div style={{ flex: 1 }}>Request ID</div>
        <div style={{ flex: 1 }}>IP</div>
        <div style={{ flex: 1 }}>Is Bot</div>
        <div style={{ flex: 1 }}>Bot Type</div>
        <div style={{ flex: 1 }}>Actions</div>
      </div>
      {botEvents.map((event: any, index: number) => (
        <div
          key={index}
          style={{
            display: "flex",
            flexDirection: "row",
            borderBottom: "1px solid #ccc",
          }}
        >
          <div style={{ flex: 1 }}>{event.requestId}</div>
          <div style={{ flex: 1 }}>{event.ip}</div>
          <div style={{ flex: 1 }}>{event.isBot ? "Yes" : "No"}</div>
          <div style={{ flex: 1 }}>{event.botType}</div>
          <div style={{ flex: 1 }}>
            <button
              onClick={async () => {
                await blockIP(event.ip);
              }}
            >
              Block this IP
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default BotBlocker;
