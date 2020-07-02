import { types } from '../types';
export declare class FallbackDescriber implements types.TypeDescriber {
    describe(arg: any): types.Stringifiable;
    protected describeValue(arg: any): string | undefined;
    protected describeType(arg: any): string;
    protected generateMessage(value: string | undefined, type: string): string;
}
