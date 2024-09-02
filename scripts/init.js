import { TokenActionHUD } from "./tokenactionhud.js";
import { SystemManagerFactory } from "./managers/systemManagerFactory.js";
import { registerHandlerbars } from "./utilities/handlebars.js";
import { switchCSS } from "./utils.js";

const appName = "token-action-hud";

let systemManager;

Hooks.on("init", () => {
  registerHandlerbars();

  game.modules.get('token-action-hud').api = {
    /* put all the relevant classes that systems and modules might need to access here */
  }

  game.settings.register(appName, "startup", {
    name: "One-Time Startup Prompt",
    scope: "world",
    config: false,
    type: Boolean,
    default: false
  });

  const systemManagers = {  
    "CoC7": "CoC7",
    /* put all the SystemManagers that are included directly in TAH here */
  }
  Hooks.call('preCreateTAHSystemManager', systemManagers); // this allows systems / modules to react to the hook and inject their own SystemManager
  
  const system = game.system.id;
  const supportedSystem = systemManagers[system];
  if(!supportedSystem) {
    console.error("Token Action HUD: System not supported")
    /* handle the error case somehow. If this happens, it means the current system is not supported */
  }
  systemManager = SystemManagerFactory.create(supportedSystem, appName);
  systemManager.registerSettings();
  switchCSS(game.settings.get(systemManager.appName, "style"));
});

/**
 * Move the HUD below the scene context menus
 */
Hooks.on("renderSceneNavigation", (data, html) => {
  html.find("li.scene.nav-item").contextmenu((ev) => {
      sendHudToBottom();
  });
});

/**
 * Move the HUD below the hotbar context menus
 */
Hooks.on("renderHotbar", (data, html) => {
  html.find("li.macro").contextmenu((ev) => {
      sendHudToBottom();
  });
});

function sendHudToBottom () {
  if (!game.tokenActionHUD) return;
   game.tokenActionHUD.element[0].style.zIndex = 0;       
}

// Hooks.on("init", () => {
//   registerHandlerbars();

//   let system = game.system.id;

//   systemManager = SystemManagerFactory.create(system, appName);
//   systemManager.registerSettings();
// });

Hooks.once('ready', async () => {
  if (game.user.isGM) {
    if (!(game.modules.get('lib-themer')?.active ?? false) && !(game.modules.get('color-picker')?.active ?? false) && !(game.modules.get('colorsettings')?.active ?? false)) {
      const firstStartup = game.settings.get(appName, "startup") === false;
      if ( firstStartup ) {
        ui.notifications.notify("Token Action HUD: To set colors within this module's settings, install and enable one of the following 'Color Picker', 'Color Settings' or 'libThemer' modules.")
        game.settings.set(appName, "startup", true);
      }
    }
  }
});

Hooks.on("canvasReady", async () => {
  let user = game.user;

  if (!user) throw new Error("Token Action HUD | No user found.");

  if (!game.tokenActionHUD) {
    game.tokenActionHUD = new TokenActionHUD(systemManager);
    await game.tokenActionHUD.init(user);
  }

  game.tokenActionHUD.setTokensReference(canvas.tokens);

  Hooks.on("controlToken", (token, controlled) => {
    game.tokenActionHUD.update();
  });

  Hooks.on("updateToken", (scene, token, diff, options, idUser) => {
    // If it's an X or Y change assume the token is just moving.
    if (diff.hasOwnProperty("y") || diff.hasOwnProperty("x")) return;
    if (game.tokenActionHUD.validTokenChange(token))
      game.tokenActionHUD.update();
  });

  Hooks.on("deleteToken", (scene, token, change, userId) => {
    if (game.tokenActionHUD.validTokenChange(token))
      game.tokenActionHUD.update();
  });

  Hooks.on("hoverToken", (token, hovered) => {
    if (game.tokenActionHUD.validTokenHover(token, hovered))
      game.tokenActionHUD.update();
  });

  Hooks.on("updateActor", (actor) => {
    if (game.tokenActionHUD.validActorOrItemUpdate(actor))
      game.tokenActionHUD.update();
  });

  Hooks.on("deleteActor", (actor) => {
    if (game.tokenActionHUD.validActorOrItemUpdate(actor))
      game.tokenActionHUD.update();
  });

  Hooks.on("deleteItem", (item) => {
    let actor = item.actor;
    if (game.tokenActionHUD.validActorOrItemUpdate(actor))
      game.tokenActionHUD.update();
  });

  Hooks.on("createItem", (item) => {
    let actor = item.actor;
    if (game.tokenActionHUD.validActorOrItemUpdate(actor))
      game.tokenActionHUD.update();
  });

  Hooks.on("updateItem", (item) => {
    let actor = item.actor;
    if (game.tokenActionHUD.validActorOrItemUpdate(actor))
      game.tokenActionHUD.update();
  });

  Hooks.on("renderTokenActionHUD", () => {
    game.tokenActionHUD.applySettings();
    game.tokenActionHUD.trySetPos();
  });

  Hooks.on("renderCompendium", (source, html) => {
    let metadata = source?.metadata;
    if (
      game.tokenActionHUD.isLinkedCompendium(
        `${metadata?.package}.${metadata?.name}`
      )
    )
      game.tokenActionHUD.update();
  });

  Hooks.on("deleteCompendium", (source, html) => {
    let metadata = source?.metadata;
    if (
      game.tokenActionHUD.isLinkedCompendium(
        `${metadata?.package}.${metadata?.name}`
      )
    )
      game.tokenActionHUD.update();
  });

  Hooks.on("createCombat", (combat) => {
    game.tokenActionHUD.update();
  });

  Hooks.on("deleteCombat", (combat) => {
    game.tokenActionHUD.update();
  });

  Hooks.on("updateCombat", (combat) => {
    game.tokenActionHUD.update();
  });

  Hooks.on("updateCombatant", (combat, combatant) => {
    game.tokenActionHUD.update();
  });

  Hooks.on("forceUpdateTokenActionHUD", () => {
    game.tokenActionHUD.update();
  });

  Hooks.on("createActiveEffect", () => {
    game.tokenActionHUD.update();
  });

  Hooks.on("deleteActiveEffect", () => {
    game.tokenActionHUD.update();
  });

  game.tokenActionHUD.update();
});

