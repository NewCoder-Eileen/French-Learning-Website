import type { Module } from './types';
import module1 from './module1-present';
import module2 from './module2-adjectifs';
import module3 from './module3-reflechis';
import module4 from './module4-passe-avoir';
import module5 from './module5-passe-etre';
import module6 from './module6-futur-simple';
import module7 from './module7-futur-proche';

export const modules: Module[] = [
  module1,
  module2,
  module3,
  module4,
  module5,
  module6,
  module7,
];

export type { Module };
