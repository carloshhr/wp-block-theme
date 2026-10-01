import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const text = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const json = (path) => JSON.parse(text(path));

describe('WordPress workspace scaffold', () => {
  it('mounts exactly the English-named theme and plugin', () => {
    const env = json('.wp-env.json');
    expect(env.core).toBeNull();
    expect(env.port).toBe(8888);
    expect(env.themes).toEqual(['./themes/block-theme']);
    expect(env.plugins).toEqual(['./plugins/custom-blocks-plugin']);
    expect(env.config).toMatchObject({ WP_DEBUG: true, SCRIPT_DEBUG: true });
    const root = json('package.json');
    expect(root.name).toBe('wordpress-block-workspace');
    expect(root.scripts['plugin:build']).toContain('plugins/custom-blocks-plugin');
  });

  it('provides an English-named FSE theme with version 3 settings and templates', () => {
    const theme = json('themes/block-theme/theme.json');
    expect(theme.version).toBe(3);
    expect(theme.settings.appearanceTools).toBe(true);
    expect(theme.settings.layout.contentSize).toBeTruthy();
    expect(theme.settings.layout.wideSize).toBeTruthy();
    expect(theme.settings.typography.fluid).toBe(true);
    expect(theme.settings.color.palette.length).toBeGreaterThan(0);
    expect(text('themes/block-theme/style.css')).toContain('Text Domain: block-theme');
    expect(text('themes/block-theme/parts/footer.html')).toContain('Block Theme');
    for (const file of ['style.css', 'index.php', 'templates/index.html', 'templates/front-page.html', 'parts/header.html', 'parts/footer.html']) {
      expect(text(`themes/block-theme/${file}`)).toBeTruthy();
    }
    expect(text('themes/block-theme/templates/front-page.html')).toContain('wp:query');
  });

  it('retains the English interactive block metadata and its server and frontend entry points', () => {
    const plugin = 'plugins/custom-blocks-plugin';
    const block = json(`${plugin}/src/custom-blocks/block.json`);
    expect(block.name).toBe('custom-blocks/custom-blocks');
    expect(block.title).toBe('Custom Blocks');
    expect(block.textdomain).toBe('custom-blocks-plugin');
    expect(block.supports.interactivity).toBe(true);
    expect(block.viewScriptModule).toBeTruthy();
    expect(block.render).toBeTruthy();
    expect(json(`${plugin}/package.json`).name).toBe('custom-blocks-plugin');
    expect(text(`${plugin}/custom-blocks-plugin.php`)).toMatch(/Plugin Name:\s+Custom Blocks Plugin/);
    expect(text(`${plugin}/src/custom-blocks/view.js`)).toMatch(/store\(\s*'custom-blocks'/);
    expect(text(`${plugin}/src/custom-blocks/render.php`)).toContain('custom-blocks');
  });
});
