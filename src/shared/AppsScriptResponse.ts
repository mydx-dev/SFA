export class AppsScriptResponse<T> {
    public readonly stringifyData: string;
    constructor(data: T) {
        this.stringifyData = JSON.stringify(data);
    }

    getContent(): T {
        return JSON.parse(this.stringifyData) as T;
    }
}

export function parseAppsScriptResponse<T>(response: AppsScriptResponse<T>): T {
    return JSON.parse(response.stringifyData) as T;
}
