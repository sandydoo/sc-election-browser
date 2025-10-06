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

    pnpm --filter @sc-election/fetcher build

    runHook postBuild
  '';

  installPhase = ''
    runHook preInstall

    mkdir -p $out/bin
    cp packages/election-fetcher/dist/cli.js $out/bin/election-fetcher

    substituteInPlace $out/bin/election-fetcher \
      --replace-fail "/usr/bin/env node" "${nodejs}/bin/node"

    chmod +x $out/bin/election-fetcher

    runHook postInstall
  '';

  meta = {
    description = "SC Election data fetcher CLI tool";
    mainProgram = "election-fetcher";
    platforms = lib.platforms.all;
  };
})
