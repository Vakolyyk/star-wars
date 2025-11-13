## Star Wars Universe Explorer

A dynamic web application built with Next.js (App Router) that allows users to browse data from the Star Wars universe, including heroes, films, starships, and planets. It features an interactive graph visualization (built with React Flow) to display the complex relationships between characters, the films they appeared in, and the starships they piloted.

## Tech Stack

- Framework: Next.js (App Router)
- Language: TypeScript
- Styling: Tailwind CSS
- Graph Visualization: React Flow
- Data Fetching: Axios (using Server Actions)
- Testing: Jest, React Testing Library, & ts-jest

## Project Structure

A brief overview of the key directories in this project:

```
/
├── __mocks__/         # Mocks for Jest (e.g., styleMock.js, fileMock.js)
├── app/
│   ├── actions/      # Server Actions for data fetching (hero.ts, film.ts, etc.)
│   ├── components/   # Reusable React components (HeroesList.tsx, HeroGraph.tsx, etc.)
│   ├── page.tsx      # The main homepage
│   └── layout.tsx    # The root layout
├── lib/
│   └── api.ts        # Axios instance configuration
├── types/
│   └── index.ts      # TypeScript type definitions (Hero, Film, etc.)
├── jest.config.js    # Jest configuration file
├── jest.setup.js     # Jest setup file (imports @testing-library/jest-dom)
└── tsconfig.json     # TypeScript configuration (with path aliases)
```

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing.

## Prerequisites

You must have Node.js (v18 or later) and npm or yarn installed on your machine.

## Installation

Clone the repository:

```bash
git clone https://your-repository-url/your-project.git
cd your-project
```

## Install dependencies:

```bash
npm install
# or
yarn install
```

## Environment Variables

This project requires an API endpoint to fetch data. Create a file named .env.local in the root of your project and add the URL of your backend API.

## .env

This is the base URL for the Star Wars API (or your custom backend)
API_URL=https://your-api-base-url.com/api

## Running the Development Server

Once the dependencies are installed and the environment variables are set, you can run the development server:

```bash
npm run dev
# or
yarn dev
```

Open http://localhost:3000 with your browser to see the result.

## Testing

This project uses Jest and React Testing Library for unit and integration testing.

We have configured Jest to work with Next.js, TypeScript (ts-jest), path aliases (@/), and to correctly mock CSS and file imports.

## Running Tests

To run the full test suite, execute the following command:

```bash
npm test
```

This will run Jest in interactive watch mode by default.

## Running in Watch Mode

If your npm test script is not set to watch mode, you can run it explicitly:

```bash
npm test -- --watch
```

## Test Coverage

To generate a test coverage report, run:

```bash
npm test -- --coverage
```

This will create a coverage/ directory in your project root with a detailed HTML report.
