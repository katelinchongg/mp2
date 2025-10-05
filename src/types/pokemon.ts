export type PokemonListItem = {
  name: string;
  url: string;
};

export type PokemonListResponse = {
  count: number;
  results: PokemonListItem[];
};

// 👇 Detail shape for /pokemon/:id
export type Pokemon = {
  id: number;
  name: string;
  sprites?: {
    front_default?: string | null;
  };
  types?: Array<{
    slot: number;
    type: { name: string; url: string };
  }>;
};
