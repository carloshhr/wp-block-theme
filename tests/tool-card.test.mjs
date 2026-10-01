import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const php = readFileSync(new URL('../plugins/custom-blocks-plugin/src/tool-card/render.php', import.meta.url), 'utf8');

describe('tool card server markup', () => {
  it('escapes plain text and wires independent accessible controls', () => {
    expect(php).toContain("wp_unique_id( 'tool-description-' )");
    expect(php).toMatch(/esc_html\( \$attributes\['title'\]/);
    expect(php).toMatch(/esc_html\( \$attributes\['description'\]/);
    expect(php).toContain('aria-controls=');
    expect(php).toContain('aria-expanded="false"');
    expect(php).toContain('data-wp-bind--aria-expanded="context.isOpen"');
    expect(php).toContain('data-wp-bind--hidden="!context.isOpen"');
  });
});
