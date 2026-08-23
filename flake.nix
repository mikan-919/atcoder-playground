{
  description = "TypeScript/Bun development environment for AtCoder";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

  outputs = { nixpkgs, ... }:
    let
      systems = [ "x86_64-linux" "aarch64-linux" ];
      forAllSystems = nixpkgs.lib.genAttrs systems;
    in
    {
      devShells = forAllSystems (system:
        let
          pkgs = import nixpkgs { inherit system; };
          biomeForProject = pkgs.writeShellScriptBin "biome-nix" ''
            exec ${pkgs.biome}/bin/biome "$@"
          '';
          esbuildForProject = pkgs.writeShellScriptBin "esbuild-nix" ''
            exec ${pkgs.esbuild}/bin/esbuild "$@"
          '';
        in
        {
          default = pkgs.mkShell {
            packages = with pkgs; [
              bun
              nodejs_22
              python3Packages.online-judge-tools
              watchexec
              zsh
              biome
              vtsls
              biomeForProject
              esbuildForProject
            ];

            shellHook = ''
              echo "AtCoder environment: Bun $(bun --version), Node.js $(node --version), oj $(oj --version)"
              if [[ $- == *i* ]] && [[ -z "''${ZSH_VERSION:-}" ]]; then
                exec zsh -i
              fi
            '';
          };
        });
    };
}
