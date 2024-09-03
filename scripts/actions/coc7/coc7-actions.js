import { ActionHandler } from "../actionHandler.js";
import * as settings from "../../settings.js";

export class ActionHandlerCoC7 extends ActionHandler {
  constructor(filterManager, categoryManager, activeActor) {
    super(filterManager, categoryManager);
    this.activeActor = activeActor;
  }

  /** @override */
  async doBuildActionList() {
    let result = this.initializeEmptyActionList();

    if (!this.activeActor) return result;

    if (!['character', 'npc', 'creature'].includes(this.activeActor.type)) {
      return result;
    }

    result.actorId = this.activeActor.id;

    let actions = this._getActions(this.activeActor);
    let skills = this._getSkills(this.activeActor);

    this._combineCategoryWithList(
      result,
      this.i18n("tokenActionHud.actions"),
      actions
    );

    this._combineCategoryWithList(
      result,
      this.i18n("tokenActionHud.skills"),
      skills
    );

    if (settings.get("showHudTitle")) result.hudTitle = this.activeActor.name;

    return result;
  }

  _getActions(actor) {
    let result = this.initializeEmptyCategory("actions");

    let category = this.initializeEmptySubcategory();
    let melee = this.initializeEmptySubcategory();
    let ranged = this.initializeEmptySubcategory();

    for (let characteristicKey in actor.system.characteristics) {
      category.actions.push({
        name: this.i18n(actor.system.characteristics[characteristicKey].label),
        encodedValue: ["characteristic", characteristicKey].join(this.delimiter),
      });
    }
    if (actor.system.attribs.lck.value) {
      category.actions.push({
        name: actor.system.attribs.lck.label,
        encodedValue: ["attribute", 'lck'].join(this.delimiter),
      });
    }
    if (actor.system.attribs.san.value) {
      category.actions.push({
        name: actor.system.attribs.san.label,
        encodedValue: ["attribute", 'san'].join(this.delimiter),
      });
    }

    if (category.actions.length) {
      category.actions.sort((left, right) => {
        return left.name
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLocaleLowerCase()
        .localeCompare(
          right.name
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLocaleLowerCase()
        )
      })
    }

    this._combineSubcategoryWithCategory(
      result,
      this.i18n('CoC7.Entities.' + actor.type.charAt(0).toUpperCase() + actor.type.slice(1)),
      category
    );

    for (let item of actor.items) {
      if (item.type === 'weapon') {
        if (item.system.properties?.rngd) {
          ranged.actions.push({
            name: item.name,
            encodedValue: ["weapon", item.id].join(this.delimiter),
          });
        } else {
          melee.actions.push({
            name: item.name,
            encodedValue: ["weapon", item.id].join(this.delimiter),
          });
        }
      }
    }

    if (melee.actions.length) {
      melee.actions.sort((left, right) => {
        return left.name
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLocaleLowerCase()
        .localeCompare(
          right.name
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLocaleLowerCase()
        )
      })
      this._combineSubcategoryWithCategory(
        result,
        this.i18n('CoC7.MeleeWeapons'),
        melee
      );
    }

    if (ranged.actions.length) {
      ranged.actions.sort((left, right) => {
        return left.name
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLocaleLowerCase()
        .localeCompare(
          right.name
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLocaleLowerCase()
        )
      })
      this._combineSubcategoryWithCategory(
        result,
        this.i18n('CoC7.RangeWeapons'),
        ranged
      );
    }

    return result;
  }

  _getSkills(actor) {
    let result = this.initializeEmptyCategory("skills");

    let category = this.initializeEmptySubcategory();

    for (let item of actor.items) {
      if (item.type === 'skill') {
        category.actions.push({
          name: item.name,
          encodedValue: ["skill", item.name].join(this.delimiter),
        });
      }
    }

    if (category.actions.length) {
      category.actions.sort((left, right) => {
        return left.name
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLocaleLowerCase()
        .localeCompare(
          right.name
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLocaleLowerCase()
        )
      })
    }

    this._combineSubcategoryWithCategory(
      result,
      this.i18n('CoC7.Entities.' + actor.type.charAt(0).toUpperCase() + actor.type.slice(1)),
      category
    );

    return result;
  }
}
