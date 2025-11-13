import { HeroesList } from "./components/HeroesList";

export default async function Home() {
  return (
    <div className="min-h-screen font-sans bg-black text-zinc-100">
      {/* Header with title */}
      <header className="border-b border-zinc-800">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold tracking-wide">Star Wars</h1>
        </div>
      </header>

      {/* Main content area containing heroes list */}
      <main className="container mx-auto flex min-h-[calc(100vh-64px)] flex-col px-6 py-12">
        <HeroesList />
      </main>
    </div>
  );
}
