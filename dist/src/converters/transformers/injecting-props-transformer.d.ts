import 'reflect-metadata';
import { types } from '../../types';
import { Class } from '../../patterns/class';
export declare class InjectingPropsTransformer implements types.TypeTransformer {
    canTransform(type: types.Type): boolean;
    transform(classType: Class): Class;
}
