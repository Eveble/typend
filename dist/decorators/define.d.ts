import 'reflect-metadata';
import { MarkReflective } from 'tsruntime';
import { types } from '../types';
export declare function define(...args: any[]): MarkReflective<types.ClassDecorator>;
export declare namespace define {
    var beforeDefine: (target: any, ...args: any[]) => void;
    var afterDefine: (target: any, ...args: any[]) => void;
}
