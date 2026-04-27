import rawReactions from './reactions.json';

// This tells Vite to find every .svg inside src/data/name_rxns/
// 'eager: true' loads them immediately so they are available on first render.
// 'import.meta.glob' returns a map: { "./name_rxns/file.svg": "blob/url" }
const svgModules = import.meta.glob('./name_rxns/**/*.svg', { 
  eager: false, // Lazy for performance
  query: '?url',
  import: 'default'
});

export type Difficulty = 1 | 2 | 3;

export interface Reaction {
  id: string;
  name: string;
  difficulty: Difficulty;
  template: {
    reactants_label: string;
    product_label: string;
    conditions: string;
    display_label: string;
  };
  metadata: {
    mechanism: string;
    retrosynthetic_cue: string;
    tags: string[];
    summary: string;
  };
  svg: {
    reactants: string | (() => Promise<any>); // A path/URL rather than raw string
    product: string | (() => Promise<any>); // A path/URL rather than raw string
  };
}

// ---------------------------------------------------------------------------
// REACTION SVGs: Deprecated in favour of an external JSON
// ---------------------------------------------------------------------------

// Cast the JSON to the strict interface, mapping the path strings to the actual bundled URLs
const reactions: Reaction[] = (rawReactions as any[]).map((r) => ({
  ...r,
  svg: {
    // Look up the path from JSON (e.g. `name_rxns/appel_reactants.svg`)
    // and match it against the module map.
    // The prepended './' matches the glob format.
    reactants: svgModules[`./${r.svg.reactants}`],
    product: svgModules[`./${r.svg.product}`],
  }
}));

export default reactions;
