# Installation

## Prerequisites

- **Node.js 20.19.0 or higher** — Check your version: `node --version`

## Package Managers

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
nix run github:Fission-AI/OvseSpec -- init
```

Or install to your profile:

```bash
nix profile install github:Fission-AI/OvseSpec
```

Or add to your development environment in `flake.nix`:

```nix
{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    ovsespec.url = "github:Fission-AI/OvseSpec";
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
