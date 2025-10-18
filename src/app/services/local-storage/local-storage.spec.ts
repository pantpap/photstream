import { TestBed } from '@angular/core/testing';
import { LocalStorage } from './local-storage';

describe('LocalStorage', () => {
  let service: LocalStorage;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LocalStorage]
    });
    service = TestBed.inject(LocalStorage);

    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set item in local storage', () => {
    const key = 'testKey';
    const value = 'testValue';

    service.setItem(key, value);

    expect(localStorage.getItem(key)).toBe(value);
  });

  it('should get item from local storage', () => {
    const key = 'testKey';
    const value = 'testValue';
    localStorage.setItem(key, value);

    const result = service.getItem(key);

    expect(result).toBe(value);
  });

  it('should overwrite existing item', () => {
    const key = 'testKey';
    service.setItem(key, 'oldValue');
    service.setItem(key, 'newValue');

    expect(service.getItem(key)).toBe('newValue');
  });

  it('should handle JSON data', () => {
    const key = 'jsonKey';
    const data = { name: 'test', value: 123 };
    const jsonString = JSON.stringify(data);

    service.setItem(key, jsonString);
    const retrieved = service.getItem(key);

    expect(JSON.parse(retrieved)).toEqual(data);
  });

  it('should retrieve null for non-existent key', () => {
    const result = service.getItem('nonExistentKey');

    expect(result).toBeNull();
  });
});
