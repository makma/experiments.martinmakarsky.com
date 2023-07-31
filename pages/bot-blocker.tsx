import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import { getBotEvents } from "../dbModels/Event";

export const getServerSideProps: GetServerSideProps<{
  botEvents: any;
}> = async () => {
  console.log("getting bot events");
  const botEvents = await getBotEvents();
  console.log(`obtained ${botEvents}`);

  return { props: { botEvents } };
};

export function BotBlocker({
  botEvents,
}: InferGetServerSidePropsType<typeof getServerSideProps>): JSX.Element {
  return (
    <div>
      <h1>Bot Events</h1>
      <ul>
        {(botEvents as Array<any>).map((item, index) => (
          <li key={index}>
            <pre>{JSON.stringify(item)}</pre>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BotBlocker;
