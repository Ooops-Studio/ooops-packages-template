# packages-monorepo-template

Opinionated TypeScript + pnpm template for publishable npm package workspaces. It stays generic at the root and pushes package complexity into package-local scripts and config so the repo can grow from a simple library into more advanced multi-package systems.

## Requirements

- Node 20.x or 22.x
- pnpm 10.20.0

## Quick start

1. Use this repository as a GitHub template.
2. Clone your new repository.
3. Run `pnpm bootstrap`.
   - This runs `pnpm install`, bootstraps the controlled template placeholders, and uses git and folder-name defaults when it can.
   - Use `pnpm bootstrap --help` for non-interactive flags, `--dry-run`, or `--skip-install`.
4. If pnpm warns that build scripts were ignored, run `pnpm approve-builds` and approve the packages your environment requires before the first build.
5. Run `pnpm -w validate`.

Fresh template repos stay green in GitHub Actions before bootstrap. CI automatically runs a template-safe profile until the placeholders are replaced, then it promotes itself to the full `validate` pipeline.

## Workspace contract

The root workspace orchestrates packages. Packages own their own tool choices.

Required package scripts:

- `typecheck`
- `build`

Optional package scripts:

- `test`
- `size`
- `publint`
- `attw`

That means the root contract scales without assuming that every package has one entrypoint, one export map shape, or one publish profile.

## What’s inside

- Shared TypeScript base config
- Shared ESLint flat config
- Shared Vitest base config for package-local merges
- Generic dependency-cruiser baseline
- Local CI and release workflows
- Template guard for unreplaced publish-facing placeholders
- Demo package showing the simplest public package shape
- Non-workspace archetype examples for more advanced package shapes

## Workspace layout

```text
.
├─ packages/
│  └─ demo/                         # simple public single-entry package example
├─ examples/package-archetypes/     # non-workspace archetype examples
├─ scripts/template-guard.mjs       # fails fast while manifest placeholders remain
├─ scripts/smoke-check-archetypes.mjs
├─ scripts/create-package.mjs
├─ scripts/copy-package-from-repo.mjs
├─ scripts/deprecate-package.mjs
├─ scripts/package-readiness.mjs
├─ package-readiness.config.json
├─ renovate.json                    # dependency update automation
├─ license-policy.json              # allowed dependency licenses
├─ .github/workflows/ci.yml         # local CI workflow
├─ .github/workflows/release.yml    # local Changesets release workflow
├─ tsconfig.base.json               # shared TS defaults
├─ eslint.config.js                 # shared lint defaults
├─ vitest.config.ts                 # shared test defaults
└─ .dependency-cruiser.cjs          # generic graph rules
```

## Common scripts

- `pnpm -w lint` — lint shared root files plus package and example config files
- `pnpm -w typecheck` — run required package `typecheck` scripts recursively
- `pnpm -w build` — run required package `build` scripts recursively
- `pnpm -w test` — run package `test` scripts when present
- `pnpm -w size` — run package `size` scripts when present
- `pnpm -w depcruise` — run dependency-cruiser against workspace source
- `pnpm bootstrap` — install dependencies and run the template bootstrap flow in one command
- `pnpm init:template` — replace the controlled template placeholders, update repository metadata, and optionally rename the starter package directory
- `pnpm -w check:manifests` — validate package manifest policy for public and private workspace packages
- `pnpm -w publint` — run package `publint` scripts when present
- `pnpm -w attw` — run package `attw` scripts when present
- `pnpm -w check:packed-artifacts` — pack the complete publishable package graph, install sibling tarballs with temporary overrides, and verify imports, framework-adapter types, and tarball contents
- `pnpm -w readiness` — generate an advisory package-readiness report
- `pnpm -w readiness:json` — emit the package-readiness report as JSON
- `pnpm -w readiness:strict` — fail on packages that need review or are blocked
- `pnpm -w check:licenses` — verify installed dependency licenses against `license-policy.json`
- `pnpm -w audit:prod` — blocking production dependency audit
- `pnpm -w audit:dev` — development dependency audit; CI runs it as non-blocking warning by default
- `pnpm -w release:preflight` — verify publish credentials or trusted publishing assumptions before release
- `pnpm -w publish:packages -- --dry-run` — preview the registry-aware package publish targets without publishing
- `pnpm -w create:package -- --name @your-scope/example --archetype public-package` — create a new package from an archetype
- `pnpm -w copy:package -- --from ../other-repo/packages/example` — copy a package into `packages/` and normalize obvious workspace-only fields. External targets require both `--allow-external-target` and `--force`.
- `pnpm -w deprecate:package -- --package @your-scope/old-package` — dry-run npm deprecation guidance for a package; add `--execute` to run `npm deprecate`
- `pnpm -w validate:ci` — run template-safe CI before bootstrap and automatically switch to full `validate` after bootstrap
- `pnpm -w guard:template` — fail fast if publish-facing manifests still contain placeholders
- `pnpm -w smoke:archetypes` — verify the documented package archetype examples stay in sync
- `pnpm -w validate` — the strict initialized-repo quality contract used locally and in release workflows

Filter by package: `pnpm -w -F @your-scope/<pkg> <script>`

## Package archetypes

The template supports four generic package shapes without making the repo domain-specific:

- **Public package**: publishable single-entry library. See `packages/demo/` and `examples/package-archetypes/public-package/`.
- **Private workspace package**: internal support code that participates in required checks but omits publish-oriented scripts. See `examples/package-archetypes/private-workspace/`.
- **Multi-entry package**: one package with multiple public subpaths and package-local entry mapping. See `examples/package-archetypes/multi-entry-package/`.
- **Adapter package**: publishable package with peer dependencies and package-local overrides. See `examples/package-archetypes/adapter-package/`.

These examples are intentionally not part of the workspace. They document supported expansion paths without forcing those shapes into every generated repo.

## Shared defaults and package-local overrides

The root configs are shared defaults, not rigid rules.

Use package-local config when a package needs to diverge:

- **Vitest**: create `packages/<name>/vitest.config.ts` and merge from the root base.
- **tsup**: keep build entry maps in `packages/<name>/tsup.config.ts`.
- **size-limit**: use `.json` for simple packages and `.mjs` when the config needs logic or multiple budgets.
- **peer dependencies**: declare them only in the packages that need adapter-style host integration.
- **dependency-cruiser layering**: extend the generic baseline with repo-specific import rules when your package graph needs stricter architecture enforcement.

## Publish safety checks

The template includes two generic publish-oriented checks beyond `publint` and `attw`:

- **Manifest policy** checks package metadata for publishable packages:
  - `license`
  - `repository`
  - `homepage`
  - `bugs.url`
  - `engines.node`
  - `files`
  - `exports`
  - `publishConfig.access` for scoped public packages
- **Packed artifact smoke test** verifies the actual tarball:
  - `pnpm pack` succeeds
  - the tarball contains built files under `dist/`
  - the tarball omits `src/`, `test/`, and `coverage/`
  - a temp consumer can install the tarball
  - Node can import every exported specifier
  - TypeScript can resolve every exported specifier

## When to override root defaults

Stay with the root defaults when the package is a straightforward library.

Override locally when the package has one of these traits:

- multiple public subpath exports
- browser vs server entrypoints
- peer dependencies
- special size budgets
- stricter or package-specific test setup
- custom dependency-layering rules

The root should stay orchestration-only. Package-specific complexity should stay package-local.

## Adding a new package

Start with the minimum package interface:

```json
{
  "scripts": {
    "typecheck": "tsc -p tsconfig.json --noEmit",
    "build": "tsup"
  }
}
```

Then add optional scripts only if the package needs them:

```json
{
  "scripts": {
    "test": "vitest run",
    "size": "size-limit --config .size-limit.json",
    "publint": "publint",
    "attw": "attw --pack --ignore-rules no-resolution --ignore-rules cjs-resolves-to-esm"
  }
}
```

Use the archetype examples when choosing a package shape instead of copying the demo package blindly.

## Optional tooling installer

The template starts as mandatory core plus optional tooling modules. `pnpm bootstrap` and `pnpm init:template` can keep the default `internal-packages` preset, choose a smaller preset, or enable an explicit module list.

Common flows:

```sh
pnpm init:template -- --preset minimal-library --dry-run
pnpm init:template -- --preset internal-packages
pnpm init:template -- --modules release,renovate,security-audit
pnpm init:template -- --modules migration-tools --no-cleanup
pnpm init:template -- --modules none
pnpm init:template -- --registry npm
pnpm init:template -- --registry github
pnpm init:template -- --registry both
```

Available optional modules:

- `release` — Changesets release workflow, publish preflight and release docs
- `renovate` — dependency update automation
- `license-policy` — dependency license policy checks
- `migration-tools` — package creation, package copying and package deprecation/archive helpers
- `security-audit` — production and development dependency audit jobs
- `size-limit` — package-level size budgets
- `publint-attw` — publish compatibility checks
- `package-readiness` — advisory or strict release-readiness reports per publishable package
- `dependency-cruiser` — package graph and architecture checks
- `registry-github` — GitHub Packages publishing and consumer registry documentation

Disabled modules are removed by default from scripts, workflows, docs and files. The initializer keeps a local `.optional-module-cache` so a generated repository can add them later without retrieving this template again:

```sh
pnpm setup:module list
pnpm setup:module add license-policy
pnpm setup:module remove license-policy
pnpm setup:module status
```

GitHub Packages is a registry strategy, not an independent capability. Make the transition explicit:

```sh
pnpm setup:module add registry-github --registry github
pnpm setup:module remove registry-github --registry npm
```

Use `--no-cleanup` when you want to leave the optional source files in place for inspection.

## Dependency and security automation

Renovate is the default dependency update tool. `renovate.json` schedules weekly updates for npm/pnpm dependencies, the lockfile, and GitHub Actions. Updates are grouped for GitHub Actions and common lint/test/build tooling, with automerge disabled by default so package maintainers review changes before merging.

CI has an explicit read-only default permission:

```yaml
permissions:
  contents: read
```

The release workflow narrows only the permissions it needs for publishing. GitHub Actions are version-pinned by default (`actions/checkout@v4`, etc.). Choose `--action-pinning sha` during setup to generate checked-in 40-character action digests with readable version comments. `pnpm check:workflows` enforces the selected policy, and Renovate tracks digest updates.

The bundled dependency checks are:

- `pnpm -w audit:prod` blocks CI on production advisories at `moderate` or higher.
- `pnpm -w audit:dev` runs in CI as a warning/non-blocking job while dev tooling advisories are cleaned up.
- `pnpm -w check:licenses` blocks `validate` when installed packages use licenses outside `license-policy.json`.

## Release safety

Release supports classic `NPM_TOKEN` and npm trusted publishing for npm, plus GitHub Packages when `--registry github` or `--registry both` is selected during template setup.

Before publishing, `pnpm -w release:preflight` checks that one of these paths is configured:

- `NPM_TOKEN` is available to the workflow.
- The workflow is running in GitHub Actions with provenance enabled for trusted publishing.

The release workflow also supports manual validation:

1. Open the `Release` workflow in GitHub Actions.
2. Run `workflow_dispatch` with `dry_run=true`.
3. Confirm install, preflight dry-run, and `pnpm -w validate` pass without publishing.

Recommended branch protection for production package repos:

- Protect `main`.
- Require CI to pass before merge.
- Require review for release PRs generated by Changesets.
- Disable direct pushes to `main`.
- Keep release credentials in repository or organization secrets, not in local env files.

## For internal package splits

This template is intended to support extracting reusable internal packages from larger monorepos into focused package repos, for example:

- `ooops-suite` → `ooops-stage-packages`
- `ooops-suite` → `ooops-analytics-packages`

Recommended extraction flow:

1. Create a new repository from this template.
2. Run `pnpm bootstrap` and replace placeholders.
3. Copy the package from the source monorepo:

   ```sh
   pnpm -w copy:package -- --from ../ooops-suite/packages/stage-api
   ```

4. Review the printed follow-up items. Workspace-only dependency ranges such as `workspace:*`, `file:`, and `link:` are rewritten to `^0.0.0` so they cannot accidentally leak into published packages.
5. Run `pnpm install`.
6. Run `pnpm -w check:manifests` and `pnpm -w validate:ci`.
7. Add a Changeset for the first release after package metadata and README links are correct.

For new packages that do not yet exist in another repo, scaffold from an archetype:

```sh
pnpm -w create:package -- --name @your-scope/new-package --archetype public-package
```

Both migration scripts support `--dry-run` and never publish or commit changes.

When a package is replaced or archived, use the deprecation helper first:

```sh
pnpm -w deprecate:package -- --package @your-scope/old-package
pnpm -w deprecate:package -- --package @your-scope/old-package --update-readme --execute
```

The helper is dry-run by default. With `--execute`, it runs `npm deprecate` and can add a README banner when `--update-readme` is passed. It does not delete packages, archive GitHub repositories, publish releases, or commit changes; those remain intentional manual steps after users have migration guidance.

## GitHub Packages

The installer supports three registry strategies:

- `npm`: default and recommended for public reusable packages.
- `github`: publish only to GitHub Packages for private/internal package distribution.
- `both`: publish the same package version to npm and GitHub Packages.

It also requires a repository-wide `--package-access public|restricted` choice. Both registries together support public packages only; npm-only and GitHub-only repos may choose either access level. The generated `monorepo.config.json` is the source of truth used by manifest and workflow guards.

## Organization policy

The optional `organization-policy` module adds generic dependency, peer-range,
import-direction and forbidden-source-pattern rules. It is disabled by default
and deliberately contains no Ooops Studio package names. Enable it with
`--modules organization-policy,...`, then edit `organization-policy.json` for
the generated organization or product boundary.

GitHub Packages support is useful for private/internal packages, but it adds registry auth, scope mapping, `.npmrc` handling and CI token differences. Keep package manifests registry-neutral and do not add `publishConfig.registry`; the release wrapper handles the selected registry strategy.

GitHub Packages checklist:

- Package names should be scoped to the GitHub owner or organization scope.
- Release workflows need `packages: write`.
- Private/internal consumers need npm auth, usually via `.npmrc` or CI user config.
- Use `GITHUB_PACKAGES_TOKEN` when a dedicated package token is preferred; otherwise the workflow can use `GITHUB_TOKEN`.

## CI and release

The bundled GitHub Actions workflows are local to the repository.

- CI uses `pnpm -w validate:ci`, which is template-aware:
  - before bootstrap it runs a template-safe profile so the fresh template repo stays green
  - after bootstrap it automatically runs the full `pnpm -w validate` pipeline
- CI also runs `pnpm -w audit:prod` as blocking and `pnpm -w audit:dev` as non-blocking.
- Release stays strict and always uses `pnpm -w validate`
- Release runs `pnpm -w release:preflight` before publish and supports manual dry-run validation through `workflow_dispatch`.
- Release publishes through `pnpm -w publish:packages`, which supports `npm`, `github`, and `both` registry strategies.

Release supports both:

- classic `NPM_TOKEN`
- npm trusted publishing with `id-token: write` and provenance enabled

## Package readiness

Package readiness is an optional release-quality layer for publishable package workspaces. It does not replace `publint`, `attw`, `size-limit`, or manifest checks; it summarizes whether each package is ready to be supported publicly or internally.

It checks package metadata, publish safety, README coverage, export surface size, packed size, quality scripts, changed-package changesets, and public-facing leakage warnings such as TODOs, debug statements, or secret-looking text.

```sh
pnpm -w readiness
pnpm -w readiness:json
pnpm -w readiness:strict
```

The default report is advisory. `public-strict` uses strict readiness during validation. Configure thresholds and per-package overrides in `package-readiness.config.json` for intentionally large packages such as service suites with many public subpaths.

## Troubleshooting

- **“I want the shortest possible onboarding path.”**  
  Run `pnpm bootstrap`. It installs dependencies, infers defaults from git and the current folder name when possible, then runs the same bootstrap flow as `pnpm init:template`.

- **“I want to bootstrap the generated repo without editing files manually.”**  
  Run `pnpm init:template`. It prompts for scope, repository, package names, and starter package directory, and it can run non-interactively with flags or preview changes with `--dry-run`.

- **“Install warned that build scripts were ignored.”**  
  Run `pnpm approve-builds` and approve the packages your environment needs, or configure pnpm’s build-script policy for CI and local development.

- **“validate fails immediately with placeholder errors.”**  
  Replace the placeholder values in the manifest files called out by `pnpm -w guard:template`.

- **“GitHub Actions is not permitted to create or approve pull requests.”**  
  Add a PAT with `repo` scope as `RELEASE_TOKEN`. The bundled release workflow already prefers it over the default `github.token`.

- **“A package needs more complex config than the demo package.”**  
  Use one of the archetype examples under `examples/package-archetypes/` and keep the extra complexity inside that package.

## License

MIT (change as needed).
