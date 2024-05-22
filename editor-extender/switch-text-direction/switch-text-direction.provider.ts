import { Injectable, ClassProvider } from "@angular/core";
import { EditorConfigProvider, ToolBarItem, TOOLBARITEMS_TOKEN, groupToolbarButtons } from "@progress/sitefinity-adminapp-sdk/app/api/v1";
import { fromEvent } from "rxjs";
import { first } from "rxjs/operators";

// These classes are defined in the application's styles.
const RTL_CLASS = "k-rtl";
const LTR_BUTTON_SELECTOR = ".k-i-Left-to-right";
const RTL_BUTTON_SELECTOR = ".k-i-Right-to-left";
const TOOLBAR_BUTTONS_DATA = {
    LTR: {
        name: "Left-to-right",
        tooltip: "Left-to-right"
    },
    RTL: {
        name: "Right-to-left",
        tooltip: "Right-to-left"
    }
};

require("!style-loader!css-loader!./switch-text-direction.provider.css");

@Injectable()
class SwitchTextDirectionProvider implements EditorConfigProvider {
    /**
     * The method that gets invoked when the editor constructs the toolbar actions.
     *
     * @param {*} editorHost The Kendo's editor object.
     * @returns {ToolBarItem[]} The custom toolbar items that will be added to the Kendo's toolbar.
     * @memberof SwitchTextDirectionProvider
     */
    getToolBarItems(editorHost: any): ToolBarItem[] {
        const SWITCH_LEFT_TO_RIGHT_TOOL: ToolBarItem = {
            name: TOOLBAR_BUTTONS_DATA.LTR.name,
            tooltip: TOOLBAR_BUTTONS_DATA.LTR.tooltip,
            ordinal: 6,
            exec: () => {
                const editorParent = editorHost.getKendoEditor().element.parent();
                if (editorParent.hasClass(RTL_CLASS)) {
                    editorParent.removeClass(RTL_CLASS);
                }
            }
        };

        const SWITCH_RIGHT_TO_LEFT_TOOL: ToolBarItem = {
            name: TOOLBAR_BUTTONS_DATA.RTL.name,
            tooltip:  TOOLBAR_BUTTONS_DATA.RTL.tooltip,
            ordinal: 7,
            exec: () => {
                const editorParent = editorHost.getKendoEditor().element.parent();
                editorParent.hasClass(RTL_CLASS) ? editorParent.removeClass(RTL_CLASS) : editorParent.addClass(RTL_CLASS);
            }
        };

        // Should group the direction buttons once the editor is loaded and focused.
        fromEvent(editorHost[0], "focusin")
            .pipe(first())
            .subscribe(() => {
                const toolbar = editorHost.getKendoEditor().toolbar.element;
                groupToolbarButtons(toolbar, RTL_BUTTON_SELECTOR, LTR_BUTTON_SELECTOR, false);
            });

        return [SWITCH_LEFT_TO_RIGHT_TOOL, SWITCH_RIGHT_TO_LEFT_TOOL];
    }

    /**
     * If you want to remove some toolbar items return their names as strings in the array. Order is insignificant.
     * Otherwise return an empty array.
     * Example: return [ "embed" ];
     * The above code will remove the embed toolbar item from the editor.
     *
     * @returns {string[]}
     * @memberof SwitchTextDirectionProvider
     */
    getToolBarItemsNamesToRemove(): string[] {
        return [];
    }

    /**
     * This gives access to the Kendo UI Editor configuration object
     * that is used to initialize the editor upon creation
     * Kendo UI Editor configuration overview documentation -> https://docs.telerik.com/kendo-ui/controls/editors/editor/overview#configuration
     *
     * @param {*} configuration
     * @returns The modified configuration.
     * @memberof SwitchTextDirectionProvider
     */
    configureEditor(configuration: any): any {
        return configuration;
    }
}

export const SWITCH_TEXT_DIRECTION_PROVIDER: ClassProvider = {
    multi: true,
    provide: TOOLBARITEMS_TOKEN,
    useClass: SwitchTextDirectionProvider
};
