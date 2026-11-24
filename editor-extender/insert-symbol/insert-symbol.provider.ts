import { Injectable, ClassProvider } from "@angular/core";
import { ToolBarItem, ToolBarItemPopupContext, EditorConfigProvider, EditorHost, EDITOR_CONFIG_TOKEN } from "@progress/sitefinity-adminapp-sdk/app/api/v1";
import { InsertSymbolGenerator, DATA_ATTRIBUTE_NAME } from "./symbol-list/insert-symbol-generator";

const TOOLBAR_BUTTON_DATA = {
    DEFAULT: {
        name: "insertsymbol",
        tooltip: "Insert symbol",
        // Neither sf-font nor FontAwesome 4.7 has an omega glyph, so the CSS draws one.
        icon: "sample-insert-symbol-icon"
    }
};

const POPUP_TITLE = "Insert special characters";

require("!style-loader!css-loader!./insert-symbol.provider.css");
import symbolList from "./symbol-list/symbol-list.json";

@Injectable()
class InsertSymbolProvider implements EditorConfigProvider {
    /**
     * If you want to remove some toolbar items return their names as strings in the array. Order is insignificant.
     * Otherwise return an empty array.
     * Example: return [ "embed" ];
     * The above code will remove the embed toolbar item from the editor.
     *
     * @returns {string[]}
     * @memberof InsertSymbolProvider
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
     * @memberof InsertSymbolProvider
     */
    configureEditor(configuration: any) {
        return configuration;
    }

    /**
     * The method that gets invoked when the editor constructs the toolbar actions.
     *
     * @param {EditorHost} editorHost The element hosting the editor.
     * @returns {ToolBarItem[]} The custom toolbar items that will be added to the editor's toolbar.
     * @memberof InsertSymbolProvider
     */
    // eslint-disable-next-line  @typescript-eslint/no-unused-vars
    getToolBarItems(editorHost: EditorHost): ToolBarItem[] {
        /**
         * The custom tool. It has a popup instead of an exec function.
         * The toolbar opens, positions and closes the popup, closes it on Esc and returns the focus to the tool.
         */
        const DEFAULT_TOOL: ToolBarItem = {
            name: TOOLBAR_BUTTON_DATA.DEFAULT.name,
            tooltip: TOOLBAR_BUTTON_DATA.DEFAULT.tooltip,
            icon: TOOLBAR_BUTTON_DATA.DEFAULT.icon,
            ordinal: -1,
            popup: (container: HTMLElement, context: ToolBarItemPopupContext) => this.renderSymbolPopup(container, context)
        };

        return [DEFAULT_TOOL];
    }

    /**
     * Renders the symbol buttons in the popup container that the toolbar provides.
     *
     * @returns A teardown function that the toolbar calls when the popup closes.
     */
    private renderSymbolPopup(container: HTMLElement, context: ToolBarItemPopupContext): () => void {
        const ownerDocument = container.ownerDocument;
        const symbolGenerator = new InsertSymbolGenerator(Object.keys(symbolList).map(k => symbolList[k]));
        const title = ownerDocument.createElement("div");
        const symbolPopup = ownerDocument.createElement("div");

        title.className = "symbol-title";
        title.textContent = POPUP_TITLE;
        symbolPopup.className = "symbol-popup";
        symbolGenerator.generateButtons(ownerDocument).forEach(button => symbolPopup.appendChild(button));
        container.append(title, symbolPopup);

        const onClick = (event: MouseEvent) => {
            const cell = (event.target as HTMLElement).closest(`[${DATA_ATTRIBUTE_NAME}]`);

            if (cell) {
                // The editor inserts the html at the selection it had before the popup took the focus.
                context.editor.exec("insertHtml", { html: escapeHtml(cell.getAttribute(DATA_ATTRIBUTE_NAME)) });
                context.close();
            }
        };

        const onKeydown = (event: KeyboardEvent) => moveFocus(event, Array.from(symbolPopup.querySelectorAll<HTMLElement>(`[${DATA_ATTRIBUTE_NAME}]`)));

        symbolPopup.addEventListener("click", onClick);
        symbolPopup.addEventListener("keydown", onKeydown);

        return () => {
            symbolPopup.removeEventListener("click", onClick);
            symbolPopup.removeEventListener("keydown", onKeydown);
        };
    }
}

/**
 * Moves the focus between the symbol buttons with the arrow, Home and End keys.
 */
function moveFocus(event: KeyboardEvent, buttons: HTMLElement[]) {
    const current = buttons.indexOf(event.target as HTMLElement);
    const columns = buttons.filter(button => button.offsetTop === buttons[0].offsetTop).length || 1;
    const moves: { [key: string]: number } = {
        ArrowRight: current + 1,
        ArrowLeft: current - 1,
        ArrowDown: current + columns,
        ArrowUp: current - columns,
        Home: 0,
        End: buttons.length - 1
    };
    const next = buttons[moves[event.key]];

    if (current > -1 && next) {
        event.preventDefault();
        next.focus();
    }
}

function escapeHtml(value: string): string {
    return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export const INSERT_SYMBOL_PROVIDER: ClassProvider = {
    multi: true,
    provide: EDITOR_CONFIG_TOKEN,
    useClass: InsertSymbolProvider
};
