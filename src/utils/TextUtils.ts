

export function keysAsString<T>(arg: T, separator:string): string {
    return Object.values(arg).map( v => v.toString()).join(separator)
}