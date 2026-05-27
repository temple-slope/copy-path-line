import { test } from 'node:test';
import { strict as assert } from 'node:assert';

test('sanity: node:test runner is wired up', () => {
  assert.equal(1 + 1, 2);
});
