# Aonsoku Flatpak Generator

## Building/testing the build locally

### Preparing your setup

1. Install dependencies on your local setup by running

    `make install-dependencies-locally`

### Preparing for a new build

1. Edit the **Makefile** file and set the `COMMIT_HASH` variable to the desired commit SHA256 hash.

1. Generate the Yarn dependency sources (`yarn-sources.json` and `yarn.lock` files) by runing

    `make yarn-sources`

1. Edit the **io.github.victoralvesf.aonsoku.yaml** file and set the commit hash of the main Aonsoku repository (currently line number 67) to the same one you set in step 1.

### Building locally

There are several make targets for building the package locally.
This one will clear all downloaded packages and start the build. If successful, the package also gets installed in your system and you can test it.

    `make build-install`

If the package build fails, you can try a fast build, which **will not clean the environment (delete old builds) and will not download the sources**.

    `make build-fast-install`
