# @<your-scope>/<name>

Simple public single-entry package archetype used by the template to demonstrate the minimum package contract.

## Install

```sh
pnpm add @<your-scope>/<name>
```

## Usage

```ts
import {greet} from '@<your-scope>/<name>'

console.log(greet('World')) // "Hello, World"
```

## API

### `greet(name: string): string`

Returns a friendly greeting. Pure, no side effects.

**Example:**
```ts
greet('Alice') // "Hello, Alice"
```

## Development

- Build: `pnpm -w -F @<your-scope>/<name> build`
- Test: `pnpm -w -F @<your-scope>/<name> test`
- Lint: `pnpm -w -F @<your-scope>/<name> lint`
- Typecheck: `pnpm -w -F @<your-scope>/<name> typecheck`
- Size: `pnpm -w -F @<your-scope>/<name> size`
- Root contract: `typecheck` and `build` are required package scripts; `test`, `size`, `publint`, and `attw` are optional but supported.

## Project structure

```
packages/demo/
├─ src/
│  └─ index.ts
├─ test/
│  └─ index.test.ts
├─ package.json
├─ tsconfig.json
├─ tsup.config.ts
└─ .size-limit.json
```

## Publishing

This package is versioned and published via Changesets from the monorepo root:

```sh
pnpm -w changeset
pnpm -w changeset version
pnpm install
pnpm -w -r build
pnpm -w changeset publish
```

## Related examples

For non-workspace archetypes, see `examples/package-archetypes/`:

- `public-package/`
- `private-workspace/`
- `multi-entry-package/`
- `adapter-package/`

## License

MIT (change as needed).
