import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const fixture = new URL('../themes/block-theme/tests/fixtures/pagination.wordpress.xml', import.meta.url);

describe('pagination WXR fixture', () => {
  it('is valid, local-only WXR 1.2 containing ten distinct published posts', () => {
    const xml = readFileSync(fixture, 'utf8');
    const script = `
      $dom = new DOMDocument();
      if (!$dom->load($argv[1], LIBXML_NONET)) { exit(2); }
      $xp = new DOMXPath($dom);
      $xp->registerNamespace('wp', 'http://wordpress.org/export/1.2/');
      $xp->registerNamespace('content', 'http://purl.org/rss/1.0/modules/content/');
      $xp->registerNamespace('dc', 'http://purl.org/dc/elements/1.1/');
      $items = [];
      foreach ($xp->query('/rss/channel/item') as $item) {
        $get = fn($path) => $xp->evaluate('string(' . $path . ')', $item);
        $items[] = [
          'title' => $get('title'), 'slug' => $get('wp:post_name'),
          'status' => $get('wp:status'), 'type' => $get('wp:post_type'),
          'date' => $get('wp:post_date'), 'content' => $get('content:encoded'),
          'author' => $get('dc:creator'),
        ];
      }
      echo json_encode(['version' => $xp->evaluate('string(/rss/@version)'),
        'wxr' => $xp->evaluate('string(/rss/channel/wp:wxr_version)'),
        'otherChildren' => $xp->query('/rss/channel/*[not(self::item or self::title or self::link or self::description or self::language or self::wp:wxr_version or self::wp:base_site_url or self::wp:base_blog_url)]')->length,
        'items' => $items]);
    `;
    const result = spawnSync('php', ['-r', script, fixture.pathname], { encoding: 'utf8' });
    expect(result.status, result.stderr).toBe(0);
    const { version, wxr, otherChildren, items } = JSON.parse(result.stdout);
    expect([version, wxr, otherChildren]).toEqual(['2.0', '1.2', 0]);
    expect(items).toHaveLength(10);
    expect(new Set(items.map(({ slug }) => slug)).size).toBe(10);
    expect(new Set(items.map(({ title }) => title)).size).toBe(10);
    for (const item of items) {
      expect(item.slug).toMatch(/^pagination-seed-[0-9]{2}$/);
      expect(item.title).toMatch(/^Pagination Seed [0-9]{2}:/);
      expect(item.status).toBe('publish');
      expect(item.type).toBe('post');
      expect(item.date).toMatch(/^2020-01-\d\d 12:00:00$/);
      expect(item.content.length).toBeGreaterThan(70);
      expect(item.author).toBe('admin');
    }
    expect(xml).not.toMatch(/<(?:wp:author|wp:category|wp:tag|wp:attachment_url|enclosure)\b|https?:\/\/(?!wordpress\.org\/export\/|purl\.org\/rss\/|purl\.org\/dc\/|www\.w3\.org\/|localhost:8888(?:<|\/))/);
  });
});
