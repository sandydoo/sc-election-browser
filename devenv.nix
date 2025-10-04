{ pkgs, lib, config, inputs, ... }:

{
  env.DATABASE_URL = "file:local.db";

  languages.javascript = {
    enable = true;
    pnpm = {
      enable = true;
      install.enable = true;
    };
  };

  languages.typescript.enable = true;
}
