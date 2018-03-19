import { UTMHandler } from './index';

describe('extracts all params', () => {
  let handler = null;
  let extractedParams = {};

  beforeAll(() => {
    const url = '?utm_source=google&utm_medium=medium&utm_term=keyword&utm_content=some%20content&utm_campaign=some%20campaign&utm_test=other%20value';
    handler = new UTMHandler();
    extractedParams = handler.extractUTM(url);
  });

  it('utm_source is extracted', () => {
    expect(extractedParams.utm_source).toBe('google');
  });

  it('utm_medium is extracted', () => {
    expect(extractedParams.utm_medium).toBe('medium');
  });

  it('utm_term is extracted', () => {
    expect(extractedParams.utm_term).toBe('keyword');
  });

  it('utm_content is extracted', () => {
    expect(extractedParams.utm_content).toBe('some%20content');
  });

  it('utm_campaign is extracted', () => {
    expect(extractedParams.utm_campaign).toBe('some%20campaign');
  });

});

describe('test history access', () => {
  let handler = null;

  beforeAll(() => {
    handler = new UTMHandler();
  });

  it('without any data should return empty array', () => {
    const utmLocalStorage = handler.history;
    expect(utmLocalStorage).toEqual([]);
  });

  it('with data should return the value', () => {
    const url = '?utm_source=google&utm_medium=medium&utm_term=keyword&utm_content=some%20content&utm_campaign=some%20campaign&utm_test=other%20value';
    handler.processUTM(url);
    const utmLocalStorage = handler.history;
    expect(utmLocalStorage.length).toEqual(1);
  });

});


describe('test custom storage key', () => {
  let handler = null;
  let storageKey = '';

  beforeAll(() => {
    storageKey = 'foobar';
    handler = new UTMHandler(storageKey);
  });

  it('without any data should return empty array', () => {
    const utmLocalStorage = handler.history;
    expect(utmLocalStorage).toEqual([]);
  });

  it('with data should return the value', () => {
    const url = '?utm_source=google&utm_medium=medium&utm_term=keyword&utm_content=some%20content&utm_campaign=some%20campaign&utm_test=other%20value';
    handler.processUTM(url);
    const utmLocalStorage = handler.history;
    expect(utmLocalStorage.length).toEqual(1);
  });

});
