{
  pkgs,
  lib,
  config,
  inputs,
  ...
}:

{
  git-hooks = {
    hooks = {
      eslint.enable = true;
      eslint.settings.binPath = "./node_modules/.bin/eslint";
      nixfmt-rfc-style.enable = true;
      prettier.enable = true;
    };
    excludes = [
      ".devenv"
      "node_modules"
    ];
  };

  languages.javascript = {
    enable = true;
    pnpm = {
      enable = true;
      install.enable = true;
    };
  };

  languages.typescript.enable = true;

  packages = [
    pkgs.secretspec
  ];
}
