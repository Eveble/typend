import { types } from './types';
export declare class Describer implements types.Describer {
    static describers: Record<string, any>;
    private describers;
    constructor(describers?: Map<string, types.TypeDescriber>);
    describe(value: any | any[]): string;
    createDescription(value: any | any[]): types.Stringifiable;
    protected createIndividualDescription(arg: any): types.Stringifiable;
    protected createDescriptionList(values: any[]): types.Stringifiable;
    registerDescriber(type: string, describer: types.TypeDescriber, shouldOverride?: boolean): void;
    overrideDescriber(type: string, describer: types.TypeDescriber): void;
    getDescriber(type: string): types.TypeDescriber | undefined;
    hasDescriber(type: string): boolean;
    removeDescriber(type: string): void;
    getDescribers(): Map<string, types.TypeDescriber>;
    setFormatting(formatting: types.DescriberFormatting): void;
}
