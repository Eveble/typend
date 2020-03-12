import { expect } from 'chai';
import { internal } from '../../../../src/annotations/internal';
import { InternalPropsTransformer } from '../../../../src/converters/transformers/internal-props-transformer';
import { Class } from '../../../../src/patterns/class';
import { Collection } from '../../../../src/patterns/collection';
import { Internal } from '../../../../src/patterns/internal';

describe(`InternalPropsTransformer`, function() {
  class MyClassWithInternal {
    exposedKey: string;

    @internal
    internalKey: number;
  }

  class MyClassWithoutInternal {
    exposedKey: string;
  }

  describe('evaluation', () => {
    it('returns true for Class pattern instance that contains internal metadata', () => {
      const transformer = new InternalPropsTransformer();
      const classType = new Class(MyClassWithInternal, {
        exposedKey: String,
        internalKey: Number,
      });
      expect(transformer.canTransform(classType)).to.be.true;
    });

    it('returns false for Class pattern instance that does not contain internal metadata', () => {
      const transformer = new InternalPropsTransformer();
      expect(
        transformer.canTransform(
          new Class(MyClassWithoutInternal, {
            exposedKey: String,
          })
        )
      ).to.be.false;
    });

    it('returns false for any non Class pattern instance', () => {
      const transformer = new InternalPropsTransformer();
      expect(transformer.canTransform(true)).to.be.false;
      expect(transformer.canTransform(false)).to.be.false;
      expect(transformer.canTransform(new Collection({}))).to.be.false;
      expect(transformer.canTransform(new MyClassWithInternal())).to.be.false;
    });
  });

  describe('transformation', () => {
    it('transforms Class pattern instance properties by wrapping internal ones with Internal pattern', () => {
      const transformer = new InternalPropsTransformer();
      const classType = new Class(MyClassWithInternal, {
        exposedKey: String,
        internalKey: Number,
      });
      const transformedClassType = transformer.transform(classType);
      expect(transformedClassType).to.be.instanceof(Class);
      const transformedProps = transformedClassType.properties;
      expect((transformedProps as any).exposedKey).to.be.equal(String);
      expect((transformedProps as any).internalKey).to.be.instanceof(Internal);
      expect(transformedClassType).to.be.eql(
        new Class(MyClassWithInternal, {
          exposedKey: String,
          internalKey: new Internal(Number),
        })
      );
    });
  });
});
