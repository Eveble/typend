import { expect } from 'chai';
import 'reflect-metadata';
import { InjectingPropsTransformer } from '../../../../src/converters/transformers/injecting-props-transformer';
import { Class } from '../../../../src/patterns/class';
import { Collection } from '../../../../src/patterns/collection';
import { INJECTABLE_PROPERTIES_KEY } from '../../../../src/constants/metadata-keys';

describe(`InjectingPropsTransformer`, function() {
  class MyClassWithInjected {
    defined: string;
  }
  Reflect.defineMetadata(
    INJECTABLE_PROPERTIES_KEY,
    { injected: Number },
    MyClassWithInjected
  );

  class MyClassWithoutInjected {
    defined: string;
  }

  describe('evaluation', () => {
    it('returns true for Class pattern instance that contains injected properties metadata', () => {
      const transformer = new InjectingPropsTransformer();
      const classType = new Class(MyClassWithInjected, {
        defined: String,
      });
      expect(transformer.canTransform(classType)).to.be.true;
    });

    it('returns false for Class pattern instance that does not contain injected properties metadata', () => {
      const transformer = new InjectingPropsTransformer();
      expect(
        transformer.canTransform(
          new Class(MyClassWithoutInjected, {
            exposedKey: String,
          })
        )
      ).to.be.false;
    });

    it('returns false for any non Class pattern instance', () => {
      const transformer = new InjectingPropsTransformer();
      expect(transformer.canTransform(true)).to.be.false;
      expect(transformer.canTransform(false)).to.be.false;
      expect(transformer.canTransform(new Collection({}))).to.be.false;
      expect(transformer.canTransform(new MyClassWithoutInjected())).to.be
        .false;
    });
  });

  describe('transformation', () => {
    it('transforms Class pattern instance properties by wrapping internal ones with Internal pattern', () => {
      const transformer = new InjectingPropsTransformer();
      const classType = new Class(MyClassWithInjected, {
        defined: String,
      });
      const transformedClassType = transformer.transform(classType);
      expect(transformedClassType).to.be.instanceof(Class);
      const transformedProps = transformedClassType.properties;
      expect((transformedProps as any).defined).to.be.equal(String);
      expect((transformedProps as any).injected).to.be.equal(Number);
      expect(transformedClassType).to.be.eql(
        new Class(MyClassWithInjected, {
          defined: String,
          injected: Number,
        })
      );
    });
  });
});
