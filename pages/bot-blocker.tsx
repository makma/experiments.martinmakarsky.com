import { useState, useEffect } from "react";

const BotBlocker = () => {
  const [botEvents, setBotEvents] = useState(new Array<any>());

  useEffect(() => {
    async function getBotEvents() {
      const { BOT_EVENTS } = process.env as unknown as {
        BOT_EVENTS: KVNamespace;
      };
      const botEventKeys = (await BOT_EVENTS.list({ limit: 10 })).keys;

      const botEvents = Array<any>();
      for (const botEventKey of botEventKeys) {
        const botEvent = await BOT_EVENTS.get(botEventKey.name);
        botEvents.push(botEvent);
      }
      setBotEvents(botEvents);
    }

    getBotEvents();
  }, []);

  return (
    <div>
      <h1>Items List</h1>
      <ul>
        {botEvents.map((item, index) => (
          <li key={index}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default BotBlocker;
