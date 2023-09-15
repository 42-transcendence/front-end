export function partition<T, U extends T>(
    array: Iterable<T>,
    predicate: (el: T) => el is U,
): [U[], Exclude<T, U>[]];

export function partition<T>(
    array: Iterable<T>,
    predicate: (el: T) => boolean,
): [T[], T[]];

export function partition(
    array: Iterable<unknown>,
    predicate: (el: unknown) => boolean,
): [unknown[], unknown[]] {
    const matches: Array<unknown> = [];
    const rest: Array<unknown> = [];

    for (const element of array) {
        if (predicate(element)) {
            matches.push(element);
        } else {
            rest.push(element);
        }
    }

    return [matches, rest];
}
