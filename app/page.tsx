import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen font-sans bg-black text-zinc-100">
      <header className="border-b border-zinc-800">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold tracking-wide">Star Wars</h1>
        </div>
      </header>

      <main className="container mx-auto flex min-h-[calc(100vh-64px)] flex-col px-6 py-12">
        <section className="w-full max-w-4xl mx-auto bg-zinc-900 rounded-2xl shadow-sm p-8">
          <h2 className="text-xl font-semibold mb-4">Welcome to the Star Wars Universe</h2>
          <p className="text-zinc-400">
            Explore heroes, starships, and films from the legendary saga. Use the navigation
            or search to begin your journey through the galaxy.
          </p>
        </section>
      </main>
    </div>
  );
}
