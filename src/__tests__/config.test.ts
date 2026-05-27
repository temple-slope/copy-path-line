import { test } from 'node:test';
import { strict as assert } from 'node:assert';

// We can't easily import vscode in a node:test run. Test the type shape instead
// by importing the FormatConfig type and constructing an object that satisfies
// it. If the fields change, this file fails to compile.
import type { FormatConfig, GitRef } from '../config';

test('FormatConfig has gitRef and gitRemote fields', () => {
  const cfg: FormatConfig = {
    atPrefix: true,
    rangeSeparator: 'dash',
    exitVisualModeAfterCopy: true,
    gitRef: 'commit',
    gitRemote: 'origin',
  };
  const ref: GitRef = cfg.gitRef;
  assert.equal(ref, 'commit');
  assert.equal(cfg.gitRemote, 'origin');
});
