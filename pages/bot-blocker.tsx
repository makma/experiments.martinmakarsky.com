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
      {botEvents.map((event, index) => (
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
            <button>Block this IP</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default BotBlocker;
