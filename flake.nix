{
  description = "Aonsoku development environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, utils }:
    utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
        
        deps = with pkgs; [
          # System tools
          nodejs_20
          pnpm
          electron
          patchelf
          
          # Electron dependencies
          alsa-lib
          at-spi2-core
          atk
          cairo
          cups
          dbus
          expat
          fontconfig
          freetype
          gdk-pixbuf
          glib
          gtk3
          libGL
          libglvnd
          libgbm # Specifically adding libgbm
          libappindicator-gtk3
          libdrm
          libnotify
          libpulseaudio
          libuuid
          libva
          libx11
          libxcb
          libxcomposite
          libxcursor
          libxdamage
          libxext
          libxfixes
          libxi
          libxkbcommon
          libxrandr
          libxrender
          libxshmfence
          libxtst
          mesa
          nspr
          nss
          pango
          pipewire
          systemd
          vulkan-loader
          wayland
        ];
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = deps;

          shellHook = ''
            # Create the library path
            export LD_LIBRARY_PATH=${pkgs.lib.makeLibraryPath deps}:$LD_LIBRARY_PATH
            
            # Default Discord Client ID for Aonsoku
            export MAIN_VITE_DISCORD_CLIENT_ID="1215413348007612476"
            
            # Force electron to use nix-provided one
            export ELECTRON_OVERRIDE_DIST_PATH="${pkgs.electron}/bin"
            if [ ! -f "$ELECTRON_OVERRIDE_DIST_PATH/electron" ]; then
              export ELECTRON_OVERRIDE_DIST_PATH="${pkgs.electron}/libexec/electron"
            fi

            # Patch node_modules binary as a fallback
            ELECTRON_BIN="./node_modules/electron/dist/electron"
            if [ -f "$ELECTRON_BIN" ]; then
              echo "Applying NixOS patch to: $ELECTRON_BIN"
              chmod +w "$ELECTRON_BIN"
              
              # Get the dynamic linker path
              DYNAMIC_LINKER="$(cat $NIX_CC/nix-support/dynamic-linker)"
              
              # Patch it!
              patchelf --set-interpreter "$DYNAMIC_LINKER" \
                       --set-rpath "$LD_LIBRARY_PATH:\$ORIGIN" \
                       "$ELECTRON_BIN"
                       
              # Also patch the helper binaries if they exist
              for helper in "./node_modules/electron/dist/chrome-sandbox" "./node_modules/electron/dist/electron_helper"; do
                if [ -f "$helper" ]; then
                  chmod +w "$helper"
                  patchelf --set-interpreter "$DYNAMIC_LINKER" --set-rpath "$LD_LIBRARY_PATH" "$helper" 2>/dev/null || true
                fi
              done
              echo "Patching complete."
            fi
            
            echo "Aonsoku dev shell loaded."
            echo "System Electron: $(which electron)"
          '';
        };
      });
}
