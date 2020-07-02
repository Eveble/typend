import { types } from '../types';
export declare class ClassDescriber implements types.TypeDescriber {
    describe(arg: any): types.Stringifiable;
    protected describeProperties(arg: any): string | undefined;
    protected describeType(arg: any): string;
    protected generateMessage(properties: string | undefined, type: string): string;
}
