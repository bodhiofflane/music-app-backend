import cyrillicToTranslit from 'cyrillic-to-translit-js';

export const stringCheckService = (str: string | null) => {
  if (!str || typeof str !== 'string') {
    return null;
  }
  return str;
}

export const spaceRemovalService = (str: string) => {
  return str.toLocaleLowerCase().split(' ').join('');
}

export const ruToLatService = (str: string) => {
  const lowerSting = str.toLowerCase();
  // Вообще библиотека cyrillicToTranslit избавляет от необходимости использовать encodeURI, то все же оставлю.
  return encodeURI(cyrillicToTranslit().transform(lowerSting, '_'));
}

console.log(ruToLatService('Anacondaz - Привет, Г.'));


