{
  src,
  version,
  pnpmDeps,

  lib,
  stdenv,
  nodejs,
  pnpm,
  callPackage,
}:

stdenv.mkDerivation (finalAttrs: {
  pname = "sc-election-app";
  inherit src pnpmDeps version;

  nativeBuildInputs = [
    nodejs
    pnpm.configHook
  ];

  buildPhase = ''
    runHook preBuild

    export DATABASE_URL="file:local.db"
    export MIGRATIONS_DIR="$src/drizzle"

    pnpm --filter @sc-election/app exec svelte-kit sync
    pnpm --filter @sc-election/app build

    runHook postBuild
  '';

  installPhase = ''
    runHook preInstall

    mkdir -p $out/lib/app

    # Use pnpm deploy to create production bundle with resolved dependencies
    pnpm --filter @sc-election/app deploy --prod --ignore-scripts $out/lib/app

    # Copy build output
    cp -r app/build/* $out/lib/app/

    # Copy migration files
    cp -r drizzle $out/lib/migrations

    runHook postInstall
  '';

  meta = {
    description = "SC Election Browser application";
    platforms = lib.platforms.all;
  };
})
