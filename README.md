# SC Election Browser

Browse candidates, questions, and responses for the NixOS Steering Committee election.

## Development

### Prerequisites

Install [devenv](https://devenv.sh) to manage the development environment.

### Setup

Enter the development shell:

```bash
devenv shell
```

Set up secrets:

```bash
secretspec check
```

Launch the web server:

```bash
pnpm dev
```

Create the database:

```bash
pnpm db:push
```

Populate the database:

```bash
pnpm fetch:all
```

## API Endpoints

The application provides JSON API endpoints for programmatic access:

- `GET /api/candidates` - List all candidates
- `GET /api/candidates/[handle]` - Get candidate by GitHub handle
- `GET /api/questions` - List all questions
- `GET /api/questions/[issueNumber]` - Get question by GitHub issue number

## Production

Build the production artifacts:

```bash
nix build .#sc-election-app
nix build .#sc-election-fetcher
```
