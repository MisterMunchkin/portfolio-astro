export type ClassValues<T extends string> = Partial<{
    [K in T]: string | boolean | undefined | null | 0;
}>;
