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

    pnpm --filter @sc-election/app exec svelte-kit sync
    pnpm --filter @sc-election/app build

    runHook postBuild
  '';

  installPhase = ''
    runHook preInstall

    mkdir -p $out/lib
    cp -r app/build $out/lib/app

    runHook postInstall
  '';

  meta = {
    description = "SC Election Browser application";
    platforms = lib.platforms.all;
  };
})
