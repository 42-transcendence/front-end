export function isNonNullArray<T>(array: (T | null)[]): array is T[] {
    return array.every((x: T | null) => x !== null);
}
