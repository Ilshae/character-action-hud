import * as settings from "../settings.js";

export class GenericActionHandler {
  baseHandler;

  constructor(baseHandler) {
    this.baseHandler = baseHandler;
  }

  addGenericCategories(actionList) {
    this._addConditions(actionList);
  }

  /** @private */
  _addConditions(actionList) {}
}
