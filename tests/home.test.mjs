import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const source = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const block = () => JSON.parse(source('plugins/custom-blocks-plugin/src/tool-card/block.json'));

describe('terminal home', () => {
  it('provides a native individual post template with title, date and full content', () => {
    const single = source('themes/block-theme/templates/single.html');
    expect(single).toContain('"slug":"header"');
    expect(single).toContain('"slug":"footer"');
    expect(single).toContain('"tagName":"main"');
    expect(single).toContain('wp:post-title');
    expect(single).toContain('"level":1');
    expect(single).toContain('wp:post-date');
    expect(single).toContain('wp:post-content');
    expect(single).not.toContain('wp:query');
  });
  it('provides a native inherited posts index with pagination and a front-page link', () => {
    const index = source('themes/block-theme/templates/home.html');
    const front = source('themes/block-theme/templates/front-page.html');
    expect(index).toContain('"inherit":true');
    expect(index).toContain('wp:post-template');
    expect(index).toContain('wp:query-pagination-previous');
    expect(index).toContain('wp:query-pagination-numbers');
    expect(index).toContain('wp:query-pagination-next');
    expect(front).toMatch(/<a href="\/blog\/">All posts<\/a>/);
  });
  it('provides six independently editable tool cards and a non-inherited recent-post query', () => {
    const home = source('themes/block-theme/templates/front-page.html');
    expect(home.match(/<!-- wp:custom-blocks\/tool-card /g)).toHaveLength(6);
    for (const name of ['neovim', 'tmux', 'fish + starship', 'firefox', 'obsidian', 'git']) {
      expect(home).toContain(`"title":"${name}"`);
    }
    expect(home).toContain('"inherit":false');
    expect(home).toContain('"perPage":3');
    expect(home).toContain('wp:post-date');
    expect(home).toContain('wp:query-no-results');
  });

  it('declares an interactive dynamic block with plain text attributes', () => {
    const metadata = block();
    expect(metadata.name).toBe('custom-blocks/tool-card');
    expect(metadata.attributes.title.type).toBe('string');
    expect(metadata.attributes.description.type).toBe('string');
    expect(metadata.supports.interactivity).toBe(true);
    expect(metadata.render).toBe('file:./render.php');
    expect(metadata.viewScriptModule).toBeTruthy();
  });

  it('enqueues the theme stylesheet on frontend and in the editor', () => {
    const php = source('themes/block-theme/functions.php');
    expect(php).toContain('wp_enqueue_scripts');
    expect(php).toContain('wp_enqueue_style');
    expect(php).toContain('get_stylesheet_uri');
    expect(php).toContain('after_setup_theme');
    expect(php).toContain('add_editor_style');
  });
});
