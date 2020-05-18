export interface ILogger {
    v(message: string, ...meta: any[]): void;
    i(message: string, ...meta: any[]): void;
    e(message: string, ...meta: any[]): void;
}