'use client';

import { useEffect, useState } from 'react';
import { Hero } from '../types';
import { getHeroes } from '../actions/hero';
import { HeroModal } from './HeroModal';

export const HeroesList = () => {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedHero, setSelectedHero] = useState<Hero | null>(null);

  const fetchHeroes = async (pageNum: number) => {
    setLoading(true);
    try {
      const data = await getHeroes(pageNum);

      setHeroes(data.results);
      setTotalPages(Math.ceil(data.count / 10));
    } catch (err) {
      console.error('Failed to fetch heroes', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    fetchHeroes(page);
  }, [page]);

  const handlePageChange = (pageNum: number) => {
    if (pageNum < 1 || pageNum > totalPages) return;
    setPage(pageNum);
  };

  const handleHeroClick = (hero: Hero) => {
    setSelectedHero(hero);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedHero(null);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Render hero cards */}
      <div className="flex flex-col gap-3 relative">
        {heroes.map((hero) => (
          <div
            key={hero.name}
            onClick={() => handleHeroClick(hero)}
            className="cursor-pointer w-full max-w-4xl mx-auto bg-zinc-900 rounded-2xl shadow-sm p-8"
          >
            <h2 className="text-xl font-semibold">{hero.name}</h2>
          </div>
        ))}

        {loading && (
          <div className="fixed inset-0 flex justify-center items-center bg-black/50 rounded-2xl">
            <p className="text-white text-lg">Loading...</p>
          </div>
        )}
      </div>

      {/* Pagination controls at the bottom */}
      <div className="flex justify-center gap-2 mt-6 flex-wrap items-center">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className="px-4 py-2 rounded-lg border bg-zinc-900 text-zinc-300 hover:bg-zinc-800 disabled:opacity-50"
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            onClick={() => handlePageChange(num)}
            className={`px-4 py-2 rounded-lg border ${
              num === page
                ? 'bg-zinc-700 text-white'
                : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800'
            }`}
          >
            {num}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
          className="px-4 py-2 rounded-lg border bg-zinc-900 text-zinc-300 hover:bg-zinc-800 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Modal for hero details */}
      <HeroModal isOpen={modalOpen} onClose={handleCloseModal} hero={selectedHero} />
    </div>
  );
};
