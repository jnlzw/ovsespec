# Installation

## Prerequisites

- **Node.js 20.19.0 or higher** — Check your version: `node --version`

## GitHub Install

OvseSpec can be installed directly from the GitHub repository:

```bash
npm install -g https://github.com/jnlzw/ovsespec/archive/refs/heads/main.tar.gz
```

## Package Managers

The npm package name is `@jn-lzw/ovsespec`. Use these commands after the package has been published to the npm registry.

### npm

```bash
npm install -g @jn-lzw/ovsespec@latest
```

### pnpm

```bash
pnpm add -g @jn-lzw/ovsespec@latest
```

### yarn

```bash
yarn global add @jn-lzw/ovsespec@latest
```

### bun

Bun can install OvseSpec globally, but OvseSpec currently runs on Node.js.
You still need Node.js 20.19.0 or higher available on `PATH`.

```bash
bun add -g @jn-lzw/ovsespec@latest
```

## Nix

Run OvseSpec directly without installation:

```bash
nix run github:jnlzw/ovsespec -- init
```

Or install to your profile:

```bash
nix profile install github:jnlzw/ovsespec
```

Or add to your development environment in `flake.nix`:

```nix
{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    ovsespec.url = "github:jnlzw/ovsespec";
  };

  outputs = { nixpkgs, ovsespec, ... }: {
    devShells.x86_64-linux.default = nixpkgs.legacyPackages.x86_64-linux.mkShell {
      buildInputs = [ ovsespec.packages.x86_64-linux.default ];
    };
  };
}
```

## Verify Installation

```bash
ovsespec --version
```

## Next Steps

After installing, initialize OvseSpec in your project:

```bash
cd your-project
ovsespec init
```

See [Getting Started](getting-started.md) for a full walkthrough.
