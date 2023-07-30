import type { InferGetServerSidePropsType } from "next";

export const runtime = "experimental-edge";

export async function getServerSideProps() {
  const { BOT_EVENTS } = process.env as unknown as {
    BOT_EVENTS: KVNamespace;
  };
  const botEventKeys = (await BOT_EVENTS.list({ limit: 10 })).keys;

  const botEvents = Array<any>();
  for (const botEventKey of botEventKeys) {
    const botEvent = await BOT_EVENTS.get(botEventKey.name);
    botEvents.push(botEvent);
  }
  console.log(`1 ${JSON.stringify(botEvents)}`);

  return { props: { botEvents } };
}

function BotBlocker({
  botEvents,
}: InferGetServerSidePropsType<typeof getServerSideProps>): JSX.Element {
  console.log(`2 ${JSON.stringify(botEvents)}`);

  return (
    <div>
      <h1>Items List</h1>
      <ul>
        {(botEvents as Array<any>).map((item, index) => (
          <li key={index}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default BotBlocker;
