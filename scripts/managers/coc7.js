import { SystemManager } from "./manager.js";
import { ActionHandlerCoC7 as ActionHandler } from "../actions/coc7/coc7-actions.js";
import { RollHandlerBaseCoC7 as Core } from "../rollHandlers/coc7/coc7-base.js";
import * as settings from "../settings/coc7-settings.js";

export class CoC7SystemManager extends SystemManager {
  constructor(appName) {
    super(appName);
  }

  /** @override */
  doGetActionHandler(filterManager, categoryManager, activeActor) {
    let actionHandler = new ActionHandler(filterManager, categoryManager, activeActor);
    return actionHandler;
  }

  /** @override */
  getAvailableRollHandlers() {
    let choices = { core: "Core CoC7" };

    return choices;
  }

  /** @override */
  doGetRollHandler(handlerId, activeActor) {
    console.log("coc7", handlerId, activeActor);
    return new Core(activeActor);
  }

  /** @override */
  doRegisterSettings(appName, updateFunc) {
    settings.register(appName, updateFunc);
  }
}
