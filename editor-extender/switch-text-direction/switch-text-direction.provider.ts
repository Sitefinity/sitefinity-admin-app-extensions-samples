import { Injectable, ClassProvider } from "@angular/core";
import { EditorConfigProvider, EditorHost, ToolBarItem, TOOLBARITEMS_TOKEN, groupToolbarButtons } from "@progress/sitefinity-adminapp-sdk/app/api/v1";

const RTL = "rtl";
const TOOLBAR_BUTTONS_DATA = {
    LTR: {
        name: "Left-to-right",
        tooltip: "Left-to-right",
        // sf-font glyph; the CSS adds the direction arrow.
        icon: "sf-font-paragraph sample-text-direction-icon -ltr"
    },
    RTL: {
        name: "Right-to-left",
        tooltip: "Right-to-left",
        icon: "sf-font-paragraph sample-text-direction-icon -rtl"
    }
};

require("!style-loader!css-loader!./switch-text-direction.provider.css");

@Injectable()
class SwitchTextDirectionProvider implements EditorConfigProvider {
    /**
     * The method that gets invoked when the editor constructs the toolbar actions.
     *
     * @param {EditorHost} editorHost The element hosting the editor.
     * @returns {ToolBarItem[]} The custom toolbar items that will be added to the editor's toolbar.
     * @memberof SwitchTextDirectionProvider
     */
    getToolBarItems(editorHost: EditorHost): ToolBarItem[] {
        const SWITCH_LEFT_TO_RIGHT_TOOL: ToolBarItem = {
            name: TOOLBAR_BUTTONS_DATA.LTR.name,
            tooltip: TOOLBAR_BUTTONS_DATA.LTR.tooltip,
            icon: TOOLBAR_BUTTONS_DATA.LTR.icon,
            ordinal: 6,
            exec: () => {
                const editorParent = this.getEditorParent(editorHost);
                if (editorParent.dir === RTL) {
                    editorParent.removeAttribute("dir");
                }
            }
        };

        const SWITCH_RIGHT_TO_LEFT_TOOL: ToolBarItem = {
            name: TOOLBAR_BUTTONS_DATA.RTL.name,
            tooltip: TOOLBAR_BUTTONS_DATA.RTL.tooltip,
            icon: TOOLBAR_BUTTONS_DATA.RTL.icon,
            ordinal: 7,
            exec: () => {
                const editorParent = this.getEditorParent(editorHost);
                if (editorParent.dir === RTL) {
                    editorParent.removeAttribute("dir");
                } else {
                    editorParent.dir = RTL;
                }
            }
        };

        // The editor and its toolbar are created after this method runs, so group the direction buttons once they are ready.
        editorHost.whenReady(editor => {
            groupToolbarButtons(editor.toolbar.element, TOOLBAR_BUTTONS_DATA.RTL.name, TOOLBAR_BUTTONS_DATA.LTR.name, false);
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
     * This gives access to the editor configuration object
     * that is used to initialize the editor upon creation.
     *
     * @param {*} configuration
     * @returns The modified configuration.
     * @memberof SwitchTextDirectionProvider
     */
    configureEditor(configuration: any): any {
        return configuration;
    }

    /**
     * The direction is set on the parent of the editable element, so it applies to the whole content.
     */
    private getEditorParent(editorHost: EditorHost): HTMLElement {
        return editorHost.getEditor().element.parentElement;
    }
}

export const SWITCH_TEXT_DIRECTION_PROVIDER: ClassProvider = {
    multi: true,
    provide: TOOLBARITEMS_TOKEN,
    useClass: SwitchTextDirectionProvider
};
