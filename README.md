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
  templates/index.html  templates/front-page.html  templates/home.html
  parts/header.html  parts/footer.html
tests/scaffold.test.mjs
```

The root `.wp-env.json` uses `core: null`, `port: 8888`, `themes: ["./themes/block-theme"]`, `plugins: ["./plugins/custom-blocks-plugin"]`, and enables `WP_DEBUG` and `SCRIPT_DEBUG`. `theme.json` uses version 3 (requires WordPress 6.6+), `appearanceTools`, content/wide widths, and fluid typography. The interactive demo block is `custom-blocks/custom-blocks` and its Interactivity API store is `custom-blocks`.

## Edit the terminal home

Open Appearance → Editor → Templates → Front Page. The hero, headings and footer use core blocks; edit their copy directly. The Tools core Group contains six `custom-blocks/tool-card` blocks. Select a card to edit its plain-text Tool name and Description fields; use the editor's standard block inserter, mover, and remove controls to add, reorder, or delete cards. Each card starts collapsed and expands independently on the frontend. The original `custom-blocks/custom-blocks` demo remains registered for existing content.

The Latest Posts section uses a **non-inherited** native Query Loop, initially showing the three newest posts by date. Adjust section width with the Group layout, count in Query settings, and one or two columns in Post Template layout independently. The no-results message is a core block. No post catalog, Markdown import, images, or external fonts are included. The All posts link points to `/blog/`. To activate that route, create separate published Home and Blog pages in Pages (do not repurpose existing pages). In Settings → Reading, select **A static page**, choose Home as the homepage and Blog as the posts page, then save. Confirm neither slug is already occupied before creating pages. Until those Reading settings are saved, `/blog/` may return 404. The posts index uses `templates/home.html` with an inherited Query Loop, so its page size follows Reading settings; pagination is provided by core blocks. Do not replace existing saved template customizations.

Site Editor changes are stored in the database and may override template files. If a file edit does not appear, inspect saved customizations rather than deleting them. Editor save/reload persistence has not been browser-tested because these tests intentionally do not mutate saved templates. Restore the previous Reading choices manually if you need to roll back the route; do not delete pre-existing content.

## Verify

Run `npm run test:unit`, `npm run plugin:build`, and `npm run test:e2e` against the running `wp-env` at localhost:8888. Install Chromium with `npx playwright install chromium` if needed. Before running browser tests, publish separate Home and Blog pages and set Settings → Reading to use Home as the static homepage and Blog as the posts page. Ensure the active Front Page template displays the All posts link; saved Site Editor overrides can hide file changes. The browser checks real click/keyboard interaction, independence, responsive cards, navigation to the posts index, and page errors without creating content. A missing `/blog/` route fails the test rather than being skipped. The official WordPress Playwright package recommends Node LTS; check runtime support when using a non-LTS Node release.

## Official references

- [wp-env](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-env/) and [create-block](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-create-block/)
- [Interactive template](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-create-block-interactive-template/) and [scripts](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-scripts/)
- [Theme structure](https://developer.wordpress.org/themes/core-concepts/theme-structure/), [appearanceTools](https://developer.wordpress.org/themes/global-settings-and-styles/settings/appearance-tools/), and [theme.json](https://developer.wordpress.org/block-editor/reference-guides/theme-json-reference/theme-json-living/)
