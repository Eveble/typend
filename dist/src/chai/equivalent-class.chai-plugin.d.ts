export interface EquivalentClassOptions {
    checkName?: boolean;
    checkPrototypeChain?: boolean;
    checkInstantiation?: boolean;
    checkStaticProperties?: boolean;
    checkInstanceMethods?: boolean;
    instantiationArgs?: any[];
}
export declare function equivalentClassChai(chai: any, utils: any): void;
export declare function setupEquivalentClassMatcher(): void;
declare global {
    namespace Chai {
        interface Assertion {
            equivalentClass(expected: any, options?: EquivalentClassOptions): Assertion;
        }
    }
}
export default equivalentClassChai;
