# Organic Name Reactions Quiz

A high-fidelity, schematic-based revision tool for organic chemistry, supporting over 70 essential name reactions. This is an unofficial student project.

## Technical Overview

The application is built with Vue, Vite, and Tailwind CSS, prioritising a stable, 'no-flicker' UI for rendering complex chemical schematics.

### Key Architecture
* **Data Layer**: Centralised `reactions.json` database. SVGs are co-located in `src/data/name_rxns/` and resolved via Vite's `import.meta.glob` for optimal bundling and caching.
* **State Management**: Encapsulated within a custom `useQuiz.ts` hook, handling phase transitions, Fisher-Yates shuffling, and scoring logic.
* **UI Components**:
    * `QuizCard`: A dual-stage display with a schematic canvas and a product dropzone.
    * `OptionButton`: Handles variable-dimension SVG rendering using `object-contain` to ensure visual uniformity across options.
    * `ExplanationPanel`: Provides post-selection metadata, including mechanisms and retrosynthetic cues.

### Asset Engineering
To maintain a well-engineered solution, SVGs are managed as external assets rather than inline strings. This allows for better maintainability and extensibility, and leverages browser caching whilst avoiding the 'cheap hacks' of raw HTML injection.
