import { RollHandler } from "../rollHandler.js";

export class RollHandlerBaseCoC7 extends RollHandler {
  constructor(activeActor) {
    super();
    this.activeActor = activeActor;
  }

  /** @override */
  doHandleActionEvent(event, encodedValue) {
    let payload = encodedValue.split("|");

    if (payload.length != 2) {
      super.throwInvalidValueErr();
    }

    let macroType = payload[0];
    let actionId = payload[1];

    let actor = this.activeActor;

    switch (macroType) {
      case 'characteristic':
        actor.characteristicCheck(actionId, event.shiftKey);
        break;
      case 'attribute':
        actor.attributeCheck(actionId, event.shiftKey);
        break;
      case 'weapon':
        actor.weaponCheck({ id: actionId }, event.shiftKey)
        break;
      case 'skill':
        actor.skillCheck({ name: actionId }, event.shiftKey)
        break;
    }
  }
}
