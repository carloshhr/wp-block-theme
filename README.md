# Local WordPress workspace

A minimal block theme and an interactive plugin built with official WordPress tools. This repository does not migrate content from the original blog.

## Get started

You need Node.js/npm, Docker Desktop with its daemon running, and PHP for syntax checks. From the repository root:

```bash
npm install
npm --prefix plugins/custom-blocks-plugin install
npm run plugin:build
npm run test:unit
npm run env:start
npx wp-env run cli wp theme activate block-theme
npx wp-env run cli wp plugin activate custom-blocks-plugin
```

Open http://localhost:8888/; the dashboard is at http://localhost:8888/wp-admin/ (user `admin`, password `password`, **local environment only**). The first start downloads WordPress and creates containers; `core: null` selects the stable WordPress managed by `@wordpress/env`. Stop the containers with `npm run env:stop`.

## Develop in two terminals

| Terminal 1 | Terminal 2 |
| --- | --- |
| `npm run env:start` | `npm run plugin:watch` |

The theme and plugin are mounted directly from this repository: do not copy files or restart the environment after every edit. The plugin watch command updates the generated `build/` directory. Do not rerun the generator over an existing plugin. **Only in an empty `plugins/` directory**, the original scaffold command was equivalent to:

```bash
npx @wordpress/create-block@latest custom-blocks-plugin --namespace custom-blocks --template @wordpress/create-block-interactive-template
```

The English names in this repository were applied to the existing scaffold; this command is for reference, not a migration step.

## Workspace map

```text
.wp-env.json                         # WordPress version, port, and mounts
package.json                         # environment and test scripts
plugins/custom-blocks-plugin/
  custom-blocks-plugin.php           # block registration
  src/custom-blocks/                 # interactive block source
    block.json  edit.js  index.js  render.php  view.js
    editor.scss  style.scss  README.md
  build/                              # generated output (including blocks-manifest.php)
  package.json  package-lock.json  readme.txt
themes/block-theme/
  style.css  theme.json  index.php
  templates/index.html  templates/front-page.html
  parts/header.html  parts/footer.html
tests/scaffold.test.mjs
```

The root `.wp-env.json` uses `core: null`, `port: 8888`, `themes: ["./themes/block-theme"]`, `plugins: ["./plugins/custom-blocks-plugin"]`, and enables `WP_DEBUG` and `SCRIPT_DEBUG`. `theme.json` uses version 3 (requires WordPress 6.6+), `appearanceTools`, content/wide widths, and fluid typography. The interactive demo block is `custom-blocks/custom-blocks` and its Interactivity API store is `custom-blocks`.

The front page uses a **non-inherited** Query Loop with three recent posts and an initial two-column layout. Section width, post count, and columns are core block editor controls. The tools cards are editable example groups, not migrated content. The generated block is the official reactive demo, **not** a custom latest-posts or tools implementation. Future work must define those sections without presuming decisions from the original source.

Site Editor changes are stored in the database and may override the displayed template files. If a file edit does not appear, check for a saved customization.

## Official references

- [wp-env](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-env/) and [create-block](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-create-block/)
- [Interactive template](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-create-block-interactive-template/) and [scripts](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-scripts/)
- [Theme structure](https://developer.wordpress.org/themes/core-concepts/theme-structure/), [appearanceTools](https://developer.wordpress.org/themes/global-settings-and-styles/settings/appearance-tools/), and [theme.json](https://developer.wordpress.org/block-editor/reference-guides/theme-json-reference/theme-json-living/)
