import { types } from '../types';
export declare class DebugDescriber implements types.TypeDescriber {
    private options;
    constructor(options?: {
        compact: boolean;
        colors: boolean;
    });
    describe(arg: any): types.Stringifiable;
}
