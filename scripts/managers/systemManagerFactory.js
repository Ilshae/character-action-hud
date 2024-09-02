import { CoC7SystemManager } from './coc7.js'

export class SystemManagerFactory {
  static create(system, appName) {
    switch (system) {
      case 'CoC7':
        return new CoC7SystemManager(appName);
    }
  }
}
