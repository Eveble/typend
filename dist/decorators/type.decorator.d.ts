import { MarkReflective } from 'tsruntime';
import { types } from '../types';
export declare function Type(...args: any[]): MarkReflective<types.ClassDecorator>;
export declare namespace Type {
    var beforeHook: (target: any, ...args: any[]) => void;
    var afterHook: (target: any, ...args: any[]) => void;
}
