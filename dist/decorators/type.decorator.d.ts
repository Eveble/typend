import { MarkReflective } from 'tsruntime';
import { types } from '../types';
export declare function Type(...args: any[]): MarkReflective<types.ClassDecorator>;
export declare namespace Type {
    var beforeDefine: (target: any, ...args: any[]) => void;
    var afterDefine: (target: any, ...args: any[]) => void;
}
