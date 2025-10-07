{
  src,
  version,
  pnpmDeps,

  lib,
  stdenv,
  nodejs,
  pnpm,
}:

stdenv.mkDerivation (finalAttrs: {
  pname = "sc-election-fetcher";
  inherit src pnpmDeps version;

  nativeBuildInputs = [
    pnpm.configHook
  ];

  buildInputs = [
    nodejs
  ];

  buildPhase = ''
    runHook preBuild

    export DATABASE_URL="file:local.db"
    export MIGRATIONS_DIR="$src/drizzle"

    pnpm --filter @sc-election/fetcher build

    runHook postBuild
  '';

  installPhase = ''
    runHook preInstall

    mkdir -p $out/lib/fetcher

    # Use pnpm deploy to create production bundle with resolved dependencies
    pnpm --filter @sc-election/fetcher deploy --prod --ignore-scripts $out/lib/fetcher

    # Copy the built CLI (already compiled from TypeScript in buildPhase)
    cp packages/election-fetcher/dist/cli.js $out/lib/fetcher/cli.js

    # Create wrapper script in bin
    mkdir -p $out/bin
    substituteInPlace $out/lib/fetcher/cli.js \
      --replace-fail "/usr/bin/env node" "${nodejs}/bin/node"

    ln -s $out/lib/fetcher/cli.js $out/bin/election-fetcher

    # Copy migration files
    cp -r drizzle $out/lib/migrations

    runHook postInstall
  '';

  meta = {
    description = "SC Election data fetcher CLI tool";
    mainProgram = "election-fetcher";
    platforms = lib.platforms.all;
  };
})
