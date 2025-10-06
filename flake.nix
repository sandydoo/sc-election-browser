{
  description = "SC Election Browser";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
  };

  outputs = { self, nixpkgs }:
    let
      systems = [
        "x86_64-linux"
        "x86_64-darwin"
        "aarch64-linux"
        "aarch64-darwin"
      ];
      forAllSystems =
        f:
        builtins.listToAttrs (
          map
            (name: {
              inherit name;
              value = f name;
            })
            systems
        );
    in
    {
      packages = forAllSystems (system:
        let
          pkgs = nixpkgs.legacyPackages.${system};
          workspace = pkgs.callPackage ./workspace.nix {};
        in
        {
          inherit (workspace) sc-election-app sc-election-fetcher;
        });
    };
}
