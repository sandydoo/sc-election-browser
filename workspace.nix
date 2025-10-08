{
  lib,
  callPackage,
  pnpm,
}:

let
  src = lib.fileset.toSource {
    root = ./.;
    fileset = lib.fileset.unions [
      ./package.json
      ./pnpm-workspace.yaml
      ./pnpm-lock.yaml
      ./drizzle
      ./drizzle.config.ts
      ./eslint.config.mts
      ./app
      ./packages
    ];
  };

  version = "unstable";

  pnpmDeps = pnpm.fetchDeps {
    pname = "sc-election-deps";
    inherit version src;
    fetcherVersion = 2;
    hash = "sha256-PbopVeXUaZjHKFMuKFRKaW8PLHuW58R8s1rlIbdAFQw=";
  };
in
{
  sc-election-app = callPackage ./nix/app/package.nix { inherit src version pnpmDeps; };
  sc-election-fetcher = callPackage ./nix/fetcher/package.nix { inherit src version pnpmDeps; };
}
