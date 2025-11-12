'use client';

import { useEffect, useState } from "react";
import { Hero, Film, Starship } from "../types";
import { getHeroDetails } from "../actions/hero";
import { HeroGraph } from "./HeroGraph";

type HeroModalProps = {
    isOpen: boolean;
    onClose: () => void;
    hero: Hero | null;
};

type FilmWithStarships = {
    film: Film;
    starships: Starship[];
};

export const HeroModal = ({ isOpen, onClose, hero }: HeroModalProps) => {
    const [loading, setLoading] = useState(false);
    const [filmsWithStarships, setFilmsWithStarships] = useState<FilmWithStarships[]>([]);

    useEffect(() => {
        if (!hero || !isOpen) return;

        const fetchDetails = async () => {
            setLoading(true);
            try {
                const details = await getHeroDetails(hero);
                setFilmsWithStarships(details.films);
            } catch (err) {
                console.error("Failed to fetch hero details", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [hero, isOpen]);

    if (!isOpen || !hero) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-zinc-900 p-6 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-auto relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-zinc-300 hover:text-white"
                >
                    ✖
                </button>

                <h2 className="text-2xl font-bold mb-4">{hero.name}</h2>

                {loading ? (
                    <p className="text-zinc-400">Loading details...</p>
                ) : (
                    <HeroGraph filmsWithStarships={filmsWithStarships} hero={hero} />
                )}
            </div>
        </div>
    );
};
