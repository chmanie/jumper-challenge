{
  description = "A prisma test project";
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  inputs.flake-utils.url = "github:numtide/flake-utils";

  outputs = {
    self,
    nixpkgs,
    flake-utils,
  }:
    flake-utils.lib.eachDefaultSystem (system: let
      pkgs = nixpkgs.legacyPackages.${system};
    in {
      devShell = pkgs.mkShell {
        nativeBuildInputs = [pkgs.bashInteractive];
        buildInputs = with pkgs; [
          nodejs
          pnpm
          nodePackages.prisma
          openssl
          pkg-config
        ];
        shellHook = with pkgs; ''
          export PRISMA_QUERY_ENGINE_BINARY="${prisma-engines}/bin/query-engine"
          export PRISMA_QUERY_ENGINE_LIBRARY="${prisma-engines}/lib/libquery_engine.node"
          export PRISMA_SCHEMA_ENGINE_BINARY="${prisma-engines}/bin/schema-engine"
          export PRISMA_FMT_BINARY="${prisma-engines}/bin/prisma-fmt"
          export PKG_CONFIG_PATH="${openssl.dev}/lib/pkgconfig"
        '';
      };
    });
}
