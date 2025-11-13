'use client';

import { useMemo } from 'react';
import ReactFlow, { Node, Edge, Background } from 'reactflow';
import 'reactflow/dist/style.css';
import { Hero, Starship, Film } from '../types';

type HeroGraphProps = {
  hero: Hero;
  filmsWithStarships: { film: Film; starships: Starship[] }[];
};

export const HeroGraph = ({ hero, filmsWithStarships }: HeroGraphProps) => {
  /**
   * Build nodes for hero, films, and starships.
   * Memoized to avoid unnecessary recalculations.
   */
  const nodes: Node[] = useMemo(() => {
    const heroNode: Node = {
      id: `hero-${hero.name}`,
      data: { label: hero.name },
      position: { x: 0, y: 0 },
      style: { padding: 10, background: '#1f2937', color: '#fff', borderRadius: 10 },
    };

    const filmNodes: Node[] = filmsWithStarships.map(({ film }, i) => ({
      id: `film-${film.episode_id}`,
      data: { label: film.title },
      position: { x: (i + 1) * 200, y: 100 },
      style: { padding: 10, background: '#374151', color: '#fff', borderRadius: 10 },
    }));

    const starshipNodes: Node[] = filmsWithStarships.flatMap(({ film, starships }, i) =>
      starships.map((s, j) => ({
        id: `starship-${film.episode_id}-${s.name}`,
        data: { label: s.name },
        position: { x: (i + 1) * 200 + j * 100, y: 250 + j * 70 },
        style: { padding: 10, background: '#4b5563', color: '#fff', borderRadius: 10 },
      })),
    );

    return [heroNode, ...filmNodes, ...starshipNodes];
  }, [hero, filmsWithStarships]);

  /**
   * Build edges between hero → films and films → starships.
   */
  const edges: Edge[] = useMemo(() => {
    const filmEdges: Edge[] = filmsWithStarships.map(({ film }) => ({
      id: `hero-film-${film.episode_id}`,
      source: `hero-${hero.name}`,
      target: `film-${film.episode_id}`,
      animated: true,
      style: { stroke: '#9ca3af' },
    }));

    const starshipEdges: Edge[] = filmsWithStarships.flatMap(({ film, starships }) =>
      starships.map((s) => ({
        id: `film-starship-${film.episode_id}-${s.name}`,
        source: `film-${film.episode_id}`,
        target: `starship-${film.episode_id}-${s.name}`,
        animated: true,
        style: { stroke: '#9ca3af' },
      })),
    );

    return [...filmEdges, ...starshipEdges];
  }, [hero, filmsWithStarships]);

  return (
    <div className="w-full h-[70vh]">
      {/* Interactive graph showing hero connections */}
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Background />
      </ReactFlow>
    </div>
  );
};
