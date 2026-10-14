# Makefile for building, running and cleaning the Flatpak package

FLATPACK_ID = io.github.victoralvesf.aonsoku
FILE_YAML = ${FLATPACK_ID}.yaml
FILE_METAINFO = ${FLATPACK_ID}.metainfo.xml
FILE_FLATPAK = ${FLATPACK_ID}.flatpak

COMMIT_HASH = "13343e35a7d5bb8350f5a73655468524a6672349"

OPTS = --arch=x86_64 --force-clean --user --verbose
OPTS_INSTALL = ${OPTS} --install
OPTS_FULL_INSTALL = ${OPTS_INSTALL} --install-deps-from=flathub

BUILD_PATH=build
YARN_BIN=$(shell which yarnpkg || which yarn)

PACKAGE_MANAGER = $(shell if command -v apt &> /dev/null; then echo "apt"; elif command -v dnf &> /dev/null; then echo "dnf"; else echo "unknown"; fi)

build-install: clean # Build the Flatpak package with dependencies already installed
	flatpak-builder ${OPTS_INSTALL} ${BUILD_PATH} ${FILE_YAML}

build: clean # Build the Flatpak package without installing
	flatpak-builder ${OPTS} ${BUILD_PATH} ${FILE_YAML}

build-full-install: clean # Build the Flatpak package
	flatpak-builder ${OPTS_FULL_INSTALL} ${BUILD_PATH} ${FILE_YAML}

build-fast-install: clean-build-path # Build the Flatpak package without cleaning .flatpak-builder directory
	flatpak-builder --user --install ${BUILD_PATH} ${FILE_YAML}

build-aarch64: clean-build-path # Build the Flatpak package for aarch64
	flatpak-builder --user --arch=aarch64 ${BUILD_PATH} ${FILE_YAML}

build-export: build flatpak-export # Build and export the Flatpak package
	@echo "[i] Flatpak package built and exported to ${FILE_FLATPAK}"

flatpak-export: # Export the built Flatpak package to the local repository
	flatpak build-export export ${BUILD_PATH}
	flatpak build-bundle export ${FILE_FLATPAK} ${FLATPACK_ID}

install-dependencies-locally: # Install Flatpak runtime and SDK dependencies locally
	flatpak remote-add --user --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo
	flatpak install -y --user flathub org.freedesktop.Platform//25.08
	flatpak install -y --user flathub org.electronjs.Electron2.BaseApp//25.08
	flatpak install -y --user flathub org.freedesktop.Sdk//25.08
	flatpak install -y --user flathub org.freedesktop.Sdk.Extension.node24//25.08
	flatpak install -y --user flathub org.gnome.Platform//46
	flatpak install -y --user flathub org.gnome.Sdk//46
	sudo ${PACKAGE_MANAGER} install -y flatpak-builder nodejs npm yarnpkg
	sudo npm install -g yarn@1.22.22
	sudo npm install -gpnpm@11.9.0

setup-venv: # Create a Python virtual environment
	python3 -m venv .venv

flatpak-node-generator: setup-venv # Install flatpak-node-generator in the virtual environment
	. .venv/bin/activate && \
	pip install flatpak-node-generator

clean: # Clean up build artifacts
	rm -rf .flatpak-builder ${BUILD_PATH} export temp-aonsoku ${FILE_FLATPAK}

clean-build-path: # Clean up only the build path
	rm -rf ${BUILD_PATH}

yarn-sources: clean flatpak-node-generator # Update node modules in the Flatpak package
	git clone https://github.com/victoralvesf/aonsoku.git temp-aonsoku
	cd temp-aonsoku && git checkout ${COMMIT_HASH}
	cd temp-aonsoku && sed -i '/packageManager/d' package.json
	cd temp-aonsoku && ${YARN_BIN} cache clean && rm -rf node_modules package-lock.json yarn.lock pnpm-lock.yaml
	${YARN_BIN} --cwd temp-aonsoku install --production --mode=skip-build --network-timeout 100000
	cd temp-aonsoku && npm cache clean -g --force --verbose && rm -rf node_modules package-lock.json pnpm-lock.yaml
	cd temp-aonsoku && ../.venv/bin/flatpak-node-generator yarn -r yarn.lock --no-trim-index --electron-node-headers -o ../yarn-sources.json
	cp temp-aonsoku/yarn.lock yarn.lock
	rm -rf temp-aonsoku

generated-sources: clean flatpak-node-generator # Update node modules in the Flatpak package
	git clone https://github.com/victoralvesf/aonsoku.git temp-aonsoku
	cd temp-aonsoku && git checkout ${COMMIT_HASH}
	cd temp-aonsoku && npm cache clean -g --force --verbose && rm -rf node_modules package-lock.json
	cd temp-aonsoku && npm i --lockfile-version 3
	cd temp-aonsoku && ../.venv/bin/flatpak-node-generator npm -r package-lock.json --no-trim-index --electron-node-headers -o ../generated-sources.json
	rm -rf temp-aonsoku

run: # Run the Flatpak application
	flatpak run ${FLATPACK_ID} --trace-deprecation --verbose --ostree-verbose --unhandled-rejections=strict --trace-warnings

remove: # Uninstall the Flatpak application
	flatpak remove -y ${FLATPACK_ID}

lint: # Lint the Flatpak YAML file
	flatpak run --command=flatpak-builder-lint org.flatpak.Builder manifest ${FILE_YAML}

lint-metainfo:
	flatpak run --command=flatpak-builder-lint org.flatpak.Builder appstream ${FILE_METAINFO}

sync-aonsoku:
	cp -v io.github.victoralvesf.aonsoku.metainfo.xml ../aonsoku/flatpak
	cp -v io.github.victoralvesf.aonsoku.desktop ../aonsoku/flatpak