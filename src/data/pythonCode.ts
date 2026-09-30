// Source markers are removed from the displayed/copyable Python code.
// Step generators refer to these markers rather than fragile line numbers.
export function definePythonCode(source: string) {
  const markers = new Map<string, number>();
  const code = source.trim().split('\n').map((line, index) => {
    const match = line.match(/\s+# @step:(\w+)\s*$/);
    if (!match) return line;
    if (markers.has(match[1])) throw new Error(`Duplicate Python step: ${match[1]}`);
    markers.set(match[1], index + 1);
    return line.slice(0, match.index);
  }).join('\n');
  return {
    code,
    line(step: string): number {
      const line = markers.get(step);
      if (line === undefined) throw new Error(`Unknown Python step: ${step}`);
      return line;
    }
  };
}

export const PYTHON_CODE = {
  linear: definePythonCode(`def linear_search(arr: list[int], target: int) -> int: # @step:init
    for i in range(len(arr)):
        if arr[i] == target: # @step:compare
            return i # @step:found
    return -1 # @step:missing`),
  binary: definePythonCode(`def binary_search(arr: list[int], target: int) -> int:
    left, right = 0, len(arr) - 1 # @step:init
    while left <= right:
        mid = (left + right) // 2 # @step:mid
        if arr[mid] == target:
            return mid # @step:found
        elif arr[mid] < target:
            left = mid + 1 # @step:moveLeft
        else:
            right = mid - 1 # @step:moveRight
    return -1 # @step:missing`),
  bubble: definePythonCode(`def bubble_sort(arr: list[int]) -> list[int]: # @step:init
    n = len(arr)
    for i in range(n): # @step:pass
        swapped = False
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]: # @step:compare
                arr[j], arr[j + 1] = arr[j + 1], arr[j] # @step:swap
                swapped = True
        if not swapped:
            break # @step:earlyExit
    return arr`),
  selection: definePythonCode(`def selection_sort(arr: list[int]) -> list[int]: # @step:init
    n = len(arr)
    for i in range(n): # @step:pass
        min_idx = i # @step:pick
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]: # @step:compare
                min_idx = j # @step:minimum
        if min_idx != i:
            arr[i], arr[min_idx] = arr[min_idx], arr[i] # @step:swap
    return arr`),
  insertion: definePythonCode(`def insertion_sort(arr: list[int]) -> list[int]: # @step:init
    for i in range(1, len(arr)):
        key = arr[i] # @step:pick
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j] # @step:shift
            j -= 1
        arr[j + 1] = key # @step:place
    return arr # @step:done`)
};
