

export function keysAsString<T>(arg: T, separator:string): string {
    return Object.values(arg).map( v => v.toString()).join(separator)
}

export function groupItems<T>(items: Array<T>, columns: number): Array<Array<T>> {
    new Array<[T]>()
    return items
        .reduce((matrix: Array<Array<T>>, item: T, index) => {
                if (index % columns === 0) {
                    matrix.push(new Array<T>());
                }
                let row: Array<T> = matrix[matrix.length - 1];
                row.push(item)
                return matrix;
            },
            new Array<Array<T>>());
}