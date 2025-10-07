{
  description = "SC Election Browser";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
    srvos.url = "github:nix-community/srvos";
    srvos.inputs.nixpkgs.follows = "nixpkgs";
    disko.url = "github:nix-community/disko";
    disko.inputs.nixpkgs.follows = "nixpkgs";
  };

  outputs = { self, nixpkgs, srvos, disko }:
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

      nixosConfigurations.sc-election-server = nixpkgs.lib.nixosSystem {
        system = "aarch64-linux";
        modules = [
          disko.nixosModules.disko
          srvos.nixosModules.server
          srvos.nixosModules.hardware-hetzner-cloud-arm
          {
            _module.args = {
              inherit (self.packages.aarch64-linux) sc-election-app sc-election-fetcher;
            };
          }
          ./nix/nixos/disk-config.nix
          ./nix/nixos/configuration.nix
          ./nix/nixos/hardware-configuration.nix
        ];
      };
    };
}
