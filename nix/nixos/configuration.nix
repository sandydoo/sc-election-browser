{
  config,
  pkgs,
  lib,
  sc-election-app,
  sc-election-fetcher,
  ...
}:

let
  stateDir = "/var/lib/sc-election";
  databaseUrl = "file:${stateDir}/db.sqlite";
in
{

  systemd.sockets.sc-election-app = {
    description = "SC Election Browser Application Socket";
    wantedBy = [ "sockets.target" ];
    socketConfig = {
      ListenStream = "127.0.0.1:3000";
      Accept = false;
    };
  };

  systemd.services.sc-election-app = {
    description = "SC Election Browser Application";
    after = [ "network.target" ];
    requires = [ "sc-election-app.socket" ];

    serviceConfig = {
      Type = "notify";
      ExecStart = "${pkgs.nodejs}/bin/node ${sc-election-app}/lib/app";
      Restart = "always";
      RestartSec = "10s";
      User = "sc-election";
      Group = "sc-election";
      StateDirectory = "sc-election";
      WorkingDirectory = stateDir;
      Environment = [
        "NODE_ENV=production"
        "DATABASE_URL=${databaseUrl}"
        "MIGRATIONS_DIR=${sc-election-app}/lib/migrations"
        "FONTS_DIR=${sc-election-app}/lib/app/client/fonts"
      ];
    };
  };

  systemd.services.sc-election-fetcher = {
    description = "SC Election Data Fetcher";
    after = [ "network.target" ];

    serviceConfig = {
      Type = "oneshot";
      ExecStart = "${sc-election-fetcher}/bin/election-fetcher fetch-all";
      User = "sc-election";
      Group = "sc-election";
      StateDirectory = "sc-election";
      WorkingDirectory = stateDir;
      Environment = [
        "NODE_ENV=production"
        "DATABASE_URL=${databaseUrl}"
        "MIGRATIONS_DIR=${sc-election-app}/lib/migrations"
      ];
      EnvironmentFile = "/run/secrets/sc-election-fetcher";
    };
  };

  systemd.timers.sc-election-fetcher = {
    description = "SC Election Data Fetcher Timer";
    wantedBy = [ "timers.target" ];

    timerConfig = {
      OnBootSec = "1min";
      OnUnitActiveSec = "30min";
      Persistent = true;
    };
  };

  users.users.sandydoo = {
    isNormalUser = true;
    extraGroups = [ "wheel" ];
    openssh.authorizedKeys.keys = [
      "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIO18rhoNZWQZeudtRFBZvJXLkHEshSaEFFt2llG5OeHk"
    ];
  };

  users.users.sc-election = {
    isSystemUser = true;
    group = "sc-election";
  };

  users.groups.sc-election = { };

  services.openssh.settings.PermitRootLogin = "no";

  services.caddy = {
    enable = true;
    virtualHosts."sc-election-browser.sandydoo.me" = {
      extraConfig = ''
        reverse_proxy localhost:3000
      '';
    };
  };

  networking.firewall.allowedTCPPorts = [
    80
    443
  ];

  system.stateVersion = "25.11";
}
