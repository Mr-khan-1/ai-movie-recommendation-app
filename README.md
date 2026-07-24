# CineMatch — Smart Film Discovery Platform

CineMatch is a premium, fully featured React movie recommendation web application built with TypeScript, Vite, and Tailwind CSS. The app features a high-fidelity visual design, persistent watchlist storage, interactive ratings/reviews, dynamic theme switcher options, and a movie spotlight roulette game.

This version has been refined to adhere to strict professional UI heuristics, removing emoji-based placeholders and replacing them with vector SVG icons and styled typography.

---

## 🚀 Key Features

1. **CineMatch Recommender Engine**: Select multiple genres and a matching mood to trigger the matching algorithm. Displays results with dynamic match percentages (e.g. `96% Match`) and customized reasoning text.
2. **Surprise Movie Roulette**: An interactive game featuring a high-speed roulette card cycle and slowdown animation that selects and spotlights a random movie.
3. **Interactive Movie Details Widescreen Dashboard**:
   - Custom **HTML5 Video Trailer Player** that streams live sample MP4 movie trailers.
   - Crew grid showcasing Year, Runtime, Director, Cast pills, and Tonal tags.
   - **Local Reviews Sub-system**: Submit reviews with interactive star selectors and custom text comments. Edit/delete reviews with absolute persistence.
   - **More Like This Slider**: Dynamically generates similar movie suggestions sharing at least one genre.
4. **Dynamic Watchlist (Favorites)**: Real-time saving/unsaving of movies from cards or detail pages, complete with a navigation header bubble count, sorting options, local search, and custom clear actions.
5. **Theme Accent Color Switcher**: Switch the application's highlight borders and neon glow gradients dynamically (`violet`, `cyan`, `emerald`, `rose`, `amber`) at the click of a button in the navbar.
6. **Global Search Input**: Interactive search matching titles, directors, descriptions, and genres in real-time on the main browse catalog.

---

## 🛠️ Technology Stack
- **Framework**: React 19 (TypeScript)
- **Bundler**: Vite 5
- **Styling**: Tailwind CSS & Custom CSS Keyframe Animations
- **State Management**: React Context (`useCinematch` custom hook)
- **Data Persistence**: Synchronized Web `localStorage` for Watchlist and Reviews

---

## 📝 Assignment Submission Details

### 1. Prompts Used During Development
Below is the structured sequence of prompts utilized to guide the AI coding assistant throughout the refactoring workflow:

*   **Prompt 1 (Analysis)**: `"Inspect the existing workspace layout, configuration files, and files under src/. Identify the current placeholders, bugs, or compiler warnings that are preventing the application from building cleanly."`
*   **Prompt 2 (Data Enrichment)**: `"Modify types.ts to extend the Movie model with details like trailerUrl, cast list, director, runtime, popularity score, and backdropUrl. Update movies.ts to populate all 18 entries with high-resolution Unsplash movie-themed URLs and detailed information."`
*   **Prompt 3 (State & Storage)**: `"Create a React Context provider in src/context/CinematchContext.tsx to handle global state. Save favorited movie IDs and user reviews (rating + text comment) in localStorage so they persist on refresh. Add an accent color theme switcher state that updates CSS custom property variables."`
*   **Prompt 4 (Navbar & Controls)**: `"Refactor NavBar.tsx. Add a search bar that updates global state, a bubble badge indicating favorites count, and circle buttons to switch application theme colors. Fix DefaultLayout.tsx import casing error."`
*   **Prompt 5 (Movie Cards & Recommendations)**: `"Update MovieCard.tsx to link to detail subpages, support heart favorite toggles, show movie metadata, and compute a dynamic match score based on selected filters. Fix RecommendationList.tsx props signature."`
*   **Prompt 6 (Roulette & Modal)**: `"Implement a full Surprise Roulette modal in SurpriseButton.tsx. When clicked, cycle through poster images in a quick shuffle, slow down, select a random movie winner, and show it in a spotlight container."`
*   **Prompt 7 (Detail Page & Trailer)**: `"Overhaul MovieDetailsPage.tsx. Build a header backdrop banner, similar movies list, an HTML5 video tag that plays the movie trailer stream when triggered, and a form to write, display, and delete custom reviews with 1-5 star ratings."`
*   **Prompt 8 (Favorites Page)**: `"Refactor FavoritesPage.tsx to display saved movies. Include a local search input, sorting filters (rating, release year, title), clear watchlist options, and an empty state illustration linking home."`
*   **Prompt 9 (CSS Animations)**: `"Configure styles.css. Import Tailwind base components, set CSS variables for themes, write custom scrollbar stylings, and create custom keyframe animations for fade-in lists and heart icons."`
*   **Prompt 10 (Professional UI Refactor)**: `"Remove emoji placeholders, clapperboards, popcorn icons, magnifying glass emojis, and raw star characters. Replace them with professional vector SVG paths, icons, and clean typography badges to enforce proper UI heuristics."`

---

### 2. How the AI Assisted Throughout the Implementation
The AI functioned as a pair programmer, contributing in the following ways:
- **Architecture Setup**: Designed a modular state-sharing system via React Context, avoiding redundant prop-drilling.
- **Data Modeling**: Created a robust mock movie database complete with public video streams and high-quality photography assets.
- **Tailwind & CSS Integration**: Combined Tailwind utility classes with custom CSS keyframe animations to create a polished, glassmorphic dark-theme interface.
- **Algorithm Design**: Wrote the matching scoring mechanism that dynamically rates how closely a movie aligns with the user's selected genres and mood.
- **Typing Verification**: Ensured all components were strictly typed under TypeScript compiler constraints.

---

### 3. Examples of Manual Improvements, Corrections, and Refactoring
During development, the following manual adjustments and refactoring operations were made to correct compiler errors and enhance performance:

#### A. Fixing Import Casing Typos
- **Problem**: In [DefaultLayout.tsx](src/layouts/DefaultLayout.tsx), the file imported `Navbar` from `../components/Navbar`. However, the actual file in the filesystem was named `NavBar.tsx`. This led to case-sensitivity compilation errors on Linux/Unix systems and strict CI/CD environments.
- **Correction**: Refactored the import path to match the exact filename:
  ```typescript
  // From:
  import Navbar from '../components/Navbar'
  // To:
  import Navbar from '../components/NavBar'
  ```

#### B. Resolving TypeScript Props Interface Mismatches
- **Problem**: In [RecommendationList.tsx](src/components/RecommendationList.tsx), the compiler threw `TS2739` because `MovieCard` was instantiated without `genre` or `mood` props, which were marked as required in `MovieCardProps`.
- **Correction**: Modified the `MovieCardProps` interface in `MovieCard.tsx` to mark matching tags as optional, and refactored internal logic to compute match scores dynamically if they are absent:
  ```typescript
  interface MovieCardProps {
    movie: Movie
    genre?: string
    mood?: string
    highlighted?: boolean
    reason?: string
  }
  ```

#### C. Handling Browser Environments in Node Typings
- **Problem**: Inside [SurpriseButton.tsx](src/components/SurpriseButton.tsx), the timer variable `timerRef` was declared as `NodeJS.Timeout`. Since this is a browser-based React client, the `NodeJS` global namespace was not defined, leading to compiler error `TS2503`.
- **Correction**: Replaced the backend typing with the standard frontend return type signature:
  ```typescript
  // Fixed:
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  ```

#### D. Heuristic Refactor: Emoji Elimination to SVG Vectors
- **Problem**: The initial implementation used emoji characters (e.g. `💥`, `🍿`, `🎬`, `✨`, `★`) as quick icons. While functional, this represents poor UI heuristic design (inconsistent OS rendering, non-scalable assets, informal/unprofessional appearance).
- **Correction**: Refactored all components to utilize standard vector SVGs, including ratings star arrays, film reel representations, and empty state search glyphs:
  ```tsx
  {/* Professional SVG Star replacing raw character ★ */}
  <svg className="h-5 w-5 fill-current text-amber-400" viewBox="0 0 24 24">
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
  ```

---

## ⚙️ Running Locally

To launch the project in development mode:

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the Vite dev server:
   ```bash
   npm run dev
   ```
3. Compile and build the production bundle:
   ```bash
   npm run build
   ```
