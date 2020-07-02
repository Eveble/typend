import { types } from './types';
export declare class Description implements types.Stringifiable {
    value?: string;
    type?: string;
    message: string;
    constructor(props: {
        value?: string;
        type?: string;
        message: string;
    });
    toString(): string;
}
export declare class DescriptionList implements types.Stringifiable {
    descriptions: types.Stringifiable[];
    constructor(descriptions?: types.Stringifiable[]);
    toString(): string;
}
