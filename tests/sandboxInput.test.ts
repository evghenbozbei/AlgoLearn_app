import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  parseSandboxArray, parseSandboxInteger, MAX_ARRAY_INPUT_LENGTH, ARRAY_LENGTH_ERROR
} from '../src/utils/sandboxInput';

test('array input accepts signed integers, whitespace separators and repeated values', () => {
  assert.deepEqual(parseSandboxArray(' -4, 0, +12\n12\t5 '), { value: [-4, 0, 12, 12, 5] });
});

test('ten numbers are accepted, extra numbers are rejected instead of truncated', () => {
  assert.equal(parseSandboxArray('1,2,3,4,5,6,7,8,9,10').value?.length, 10);
  assert.match(parseSandboxArray('1,2,3,4,5,6,7,8,9,10,11').error!, /10/);
});

test('large input is rejected and the character limit is inclusive', () => {
  assert.deepEqual(parseSandboxArray('1'.padEnd(MAX_ARRAY_INPUT_LENGTH)), { value: [1] });
  assert.deepEqual(parseSandboxArray('1'.repeat(1_000_000)), { error: ARRAY_LENGTH_ERROR });
});

test('empty or partially invalid arrays never produce fallback or partial data', () => {
  for (const input of ['', ' , \n ', '1,12abc,3', '1,2.5', '1,1e3', '0x10', '-', 'Infinity', 'NaN']) {
    const result = parseSandboxArray(input);
    assert.ok(result.error, input);
    assert.equal(result.value, undefined, input);
  }
});

test('safe integer boundaries are preserved exactly and overflow is rejected', () => {
  for (const value of [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, 0, -10]) {
    assert.deepEqual(parseSandboxInteger(String(value)), { value });
  }
  for (const value of ['9007199254740992', '-9007199254740992', '9'.repeat(400)]) {
    assert.ok(parseSandboxInteger(value).error);
    assert.ok(parseSandboxArray(value).error);
  }
});

test('invalid search targets are not silently converted to zero or truncated', () => {
  for (const value of ['', '-', '12abc', '1.5', '1e3', 'Infinity', 'NaN']) {
    assert.ok(parseSandboxInteger(value).error, value);
    assert.equal(parseSandboxInteger(value).value, undefined, value);
  }
});
