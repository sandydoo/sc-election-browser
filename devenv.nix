{ pkgs, lib, config, inputs, ... }:

{
  env.DATABASE_URL = "file:local.db";

  git-hooks.hooks = {
    eslint.enable = true;
    nixfmt-rfc-style.enable = true;
    prettier.enable = true;
  };

  languages.javascript = {
    enable = true;
    pnpm = {
      enable = true;
      install.enable = true;
    };
  };

  languages.typescript.enable = true;
}
