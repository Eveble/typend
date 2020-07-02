import { types } from '../types';
export declare class ObjectDescriber implements types.TypeDescriber {
    describe(arg: any, describer: types.Describer): types.Stringifiable;
    protected describeProperties(arg: any, describer: types.Describer): string | undefined;
    protected generateMessage(properties: any): string;
}
