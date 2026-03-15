export class DomainError extends Error {
    code: string;
    status: number;

    constructor(message: string, options?: { code?: string; status?: number }) {
        super(message);
        this.name = "DomainError";
        this.code = options?.code ?? "DOMAIN_ERROR";
        this.status = options?.status ?? 400;
    }
}

export function isDomainError(error: unknown): error is DomainError {
    return error instanceof DomainError;
}
