import { useParams } from "react-router-dom";

export default function Venue() {
  const { id } = useParams();
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Venue</h1>
      <p className="mt-2 text-sm opacity-80">Venue ID: {id}</p>
    </main>
  );
}
