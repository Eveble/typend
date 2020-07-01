import { expect } from 'chai';
import { Description, DescriptionList } from '../../src/description';

describe(`Description`, function () {
  describe(`construction`, () => {
    it(`takes a value as a string, type as a string and message as a string and assigns them`, () => {
      const value = 'my-value';
      const type = 'my-type';
      const message = 'my-message';
      const desc = new Description({ value, type, message });
      expect(desc).to.be.eql({
        value,
        type,
        message,
      });
    });

    it(`allows to pass undefined as a value`, () => {
      const value = undefined;
      const type = 'my-type';
      const message = 'my-message';
      const desc = new Description({ value, type, message });
      expect(desc).to.be.eql({
        value,
        type,
        message,
      });
    });
  });

  describe(`conversion`, () => {
    it(`returns message as a string`, () => {
      const value = 'my-value';
      const type = 'my-type';
      const message = 'my-message';
      const desc = new Description({ value, type, message });
      expect(desc.toString()).to.be.equal(message);
    });
  });
});

describe(`DescriptionList`, function () {
  describe(`construction`, () => {
    it(`initializes with description list as empty array`, () => {
      const list = new DescriptionList();
      expect(list.descriptions).to.be.an.instanceof(Array);
      expect(list.descriptions).to.be.empty;
    });

    it(`takes an array of descriptions and assigns them`, () => {
      const value = 'my-value';
      const type = 'my-type';
      const message = 'my-message';
      const desc = new Description({ value, type, message });
      const descArray = [desc];
      const list = new DescriptionList(descArray);
      expect(list.descriptions).to.be.equal(descArray);
    });
  });

  describe(`conversion`, () => {
    it(`returns combined message strings from each description in list as a single string`, () => {
      const desc1 = new Description({
        value: 'my-first-value',
        type: 'my-first-type',
        message: 'my-first-message',
      });
      const desc2 = new Description({
        value: 'my-second-value',
        type: 'my-second-type',
        message: 'my-second-message',
      });
      const descArray = [desc1, desc2];
      const list = new DescriptionList(descArray);
      expect(list.toString()).to.be.equal(
        'my-first-message, my-second-message'
      );
    });
  });
});
