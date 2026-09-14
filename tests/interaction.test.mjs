import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const html = await readFile(new URL('../layouts/index.html', import.meta.url), 'utf8');
const css = await readFile(new URL('../static/styles.css', import.meta.url), 'utf8');

test('each tile family exposes its own interaction hook', () => {
  const families = [
    ['value-item--archive', 4],
    ['fact-card--catalog', 3],
    ['journey-step--progress', 6],
    ['event--timeline', 6],
  ];

  for (const [className, expectedCount] of families) {
    assert.equal((html.match(new RegExp(className, 'g')) || []).length, expectedCount);
    assert.match(css, new RegExp(`\\.${className}:hover`));
  }
});

test('interactive controls keep a distinct pressed state for each family', () => {
  assert.equal((html.match(/aria-pressed="false"/g) || []).length, 19);
  assert.match(css, /\.value-item--archive\.is-selected/);
  assert.match(css, /\.fact-card--catalog\.is-selected/);
  assert.match(css, /\.journey-step--progress\.is-selected/);
  assert.match(css, /\.event--timeline\.is-selected/);
});

test('catalog cards use the new index-card treatment without the old cue', () => {
  assert.doesNotMatch(css, /content:\s*["']檔案摘錄["']/);
  assert.match(css, /\.teacher-facts \.fact-card--catalog\s*\{[\s\S]*?border-radius:\s*4px/);
});
