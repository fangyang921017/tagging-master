export declare class EventBus {
    clientList: Record<string, Array<Function>>;
    constructor();
    on(key: string, fn: Function): void;
    emit(...args: [string, ...unknown[]]): boolean;
    remove(key: string, fn: Function): boolean;
}
