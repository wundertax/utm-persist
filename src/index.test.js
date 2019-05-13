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

describe('test referrel processing without utm params', () => {
  let handler = null;
  let storageKey = 'referrel';

  beforeAll(() => {
    const url = '?utm_medium=utm_not_valid_because_has_no_source';
    const referrer = 'https://www.google.com/';
    Object.defineProperty(window.document, 'referrer', { value: referrer, writable: true });
    handler = new UTMHandler(storageKey);
    handler.processReferral(url);
  });

  it('should return referrer and save it on localStorage', () => {
    const utmLocalStorage = handler.history;
    expect(utmLocalStorage.length).toEqual(1);
  });

});

describe('test valid referrel processing with utm params', () => {
  let handler = null;
  let storageKey = 'referrel-with-utm';

  beforeAll(() => {
    const url = '?utm_source=test';
    const referrer = 'https://www.google.com/';
    window.document.referrer = referrer;
    handler = new UTMHandler(storageKey);
    handler.processReferral(url);
  });

  it('should not return the referrer and not save anything on localStorage ', () => {
    const utmLocalStorage = handler.history;
    expect(utmLocalStorage.length).toEqual(0);
  });

});

describe('test not listed referrer processing with utm params', () => {
  let handler = null;
  let storageKey = 'referrel-with-not-listed-referrer';

  beforeAll(() => {
    const url = '?utm_medium=utm_not_valid_because_has_no_source';
    const referrer = 'https://www.nosearch.de/';
    window.document.referrer = referrer;    handler = new UTMHandler(storageKey);
    handler.processReferral(url);
  });

  it('should not return the referrer and not save anything on localStorage ', () => {
    const utmLocalStorage = handler.history;
    expect(utmLocalStorage.length).toEqual(0);
  });

});
