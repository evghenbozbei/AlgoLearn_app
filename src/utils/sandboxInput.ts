export const MAX_ARRAY_INPUT_LENGTH = 256;
export const MAX_ARRAY_ITEMS = 10;
export const MAX_INTEGER_INPUT_LENGTH = 17;

export const ARRAY_LENGTH_ERROR = `Введите не более ${MAX_ARRAY_INPUT_LENGTH} символов.`;
export const INTEGER_ERROR = 'Введите целое число от -9007199254740991 до 9007199254740991.';

export type InputResult<T> = { value: T; error?: never } | { value?: never; error: string };

export function parseSandboxInteger(input: string): InputResult<number> {
  if (input.length > MAX_INTEGER_INPUT_LENGTH || !/^[+-]?\d+$/.test(input)) {
    return { error: INTEGER_ERROR };
  }
  const value = Number(input);
  return Number.isSafeInteger(value) ? { value } : { error: INTEGER_ERROR };
}

export function parseSandboxArray(input: string): InputResult<number[]> {
  // Reject oversized input before scanning or allocating token arrays.
  if (input.length > MAX_ARRAY_INPUT_LENGTH) return { error: ARRAY_LENGTH_ERROR };
  const values: number[] = [];
  for (const match of input.matchAll(/[^,\s]+/g)) {
    if (values.length === MAX_ARRAY_ITEMS) {
      return { error: `Введите не более ${MAX_ARRAY_ITEMS} чисел.` };
    }
    const parsed = parseSandboxInteger(match[0]);
    if (parsed.error) return { error: INTEGER_ERROR };
    values.push(parsed.value);
  }
  return values.length > 0 ? { value: values } : { error: 'Введите хотя бы одно целое число.' };
}
