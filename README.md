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

## Production

Build the production artifacts:

```bash
nix build .#sc-election-app
nix build .#sc-election-fetcher
```
