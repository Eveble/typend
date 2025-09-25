import { types } from '../types';
export declare class ErrorDescriber implements types.TypeDescriber {
    describe(arg: any): types.Stringifiable;
    protected generateMessage(value: string | undefined, type: string): string;
}
