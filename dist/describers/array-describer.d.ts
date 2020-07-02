import { types } from '../types';
export declare class ArrayDescriber implements types.TypeDescriber {
    describe(arg: any, describer: types.Describer): types.Stringifiable;
    protected describeArguments(arg: any, describer: types.Describer): string | undefined;
    protected generateMessage(args: any): string;
}
