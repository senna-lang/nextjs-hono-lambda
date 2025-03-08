import { client } from "@/lib/hono";

export default async function Home() {
  const res = await client.index.$get();
  const message = await res.text();
  return (
    <div>
      <h1>{message}</h1>
    </div>
  );
}
