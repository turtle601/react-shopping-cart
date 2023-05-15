import { AtomEffect, atom } from 'recoil';
import { Cart } from '../types/cart';
import { getLocalData } from '../utils/localStorage';

const localStorageEffect: <T>(key: string) => AtomEffect<T> =
  (key: string) =>
  ({ setSelf, onSet }) => {
    const savedValue = localStorage.getItem(key);
    if (savedValue != null) {
      setSelf(JSON.parse(savedValue));
    }

    onSet((newValue, _, isReset) => {
      isReset
        ? localStorage.removeItem(key)
        : localStorage.setItem(key, JSON.stringify(newValue));
    });
  };

export const cartState = atom<Cart[]>({
  key: 'CartListState',
  default: getLocalData('CART'),
  effects: [localStorageEffect<Cart[]>('CART')],
});
