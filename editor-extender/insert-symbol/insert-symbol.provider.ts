import { Injectable, ClassProvider } from "@angular/core";
import { ToolBarItem, EditorConfigProvider, EDITOR_CONFIG_TOKEN } from "@progress/sitefinity-adminapp-sdk/app/api/v1";
import { InsertSymbolGenerator, DATA_ATTRIBUTE_NAME } from "./symbol-list/insert-symbol-generator";
import { ToolBuilder, ToolConfig } from "../../helpers/tool-builder";

const TOOLBAR_BUTTON_DATA = {
    DEFAULT: {
        name: "insertsymbol",
        tooltip: "Insert symbol"
    }
};

declare const kendo;
declare const jQuery: any;

require("!style-loader!css-loader!./insert-symbol.provider.css");
import symbolList from "./symbol-list/symbol-list.json";

@Injectable()
class InsertSymbolProvider implements EditorConfigProvider {
    /**
     * If you want to remove some toolbar items return their names as strings in the array. Order is insignificant.
     * Otherwise return an empty array.
     * Example: return [ "embed" ];
     * The above code will remove the embed toolbar item from the editor.
     * Documentation where you can find all tools' names: https://docs.telerik.com/kendo-ui/api/javascript/ui/editor/configuration/tools
     *
     * @returns {string[]}
     * @memberof InsertSymbolProvider
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
     * @memberof InsertSymbolProvider
     */
    configureEditor(configuration: any) {
        return configuration;
    }

    /**
     * The method that gets invoked when the editor constructs the toolbar actions.
     *
     * @param {*} editorHost The Kendo's editor object.
     * @returns {ToolBarItem[]} The custom toolbar items that will be added to the Kendo's toolbar.
     * @memberof InsertSymbolProvider
     */
    // eslint-disable-next-line  @typescript-eslint/no-unused-vars
    getToolBarItems(editorHost: any): ToolBarItem[] {
        /**
         * The custom tool.
         */
        const DEFAULT_TOOL: ToolBarItem = {
            name: TOOLBAR_BUTTON_DATA.DEFAULT.name,
            tooltip: TOOLBAR_BUTTON_DATA.DEFAULT.tooltip,
            ordinal: -1,
            exec: () => {}
        };

        this.configureInsertSymbolTool();
        return [DEFAULT_TOOL];
    }

    private configureInsertSymbolTool() {
        const popupTemplateGenerator = function () {
            const symbolGenerator = new InsertSymbolGenerator(Object.keys(symbolList).map(k => symbolList[k]));
            const generatedHtml = symbolGenerator.generateHtml();
            return `<div class='k-ct-popup symbol-popup'><div class='k-status symbol-title'>INSERT SPECIAL CHARACTERS</div>${generatedHtml}</div>`;
        };

        const Tool = kendo.ui.editor.Tool;

        const PopupTool = Tool.extend({
            initialize: function (ui, editor) {
                this.editor = editor;
                const popup = jQuery(this.options.popupTemplate)
                    .appendTo("body")
                    .kendoPopup({
                        anchor: ui,
                        copyAnchorStyles: false,
                        open: this._open.bind(this),
                        activate: this._activate.bind(this),
                        close: this._close.bind(this),
                    })
                    .data("kendoPopup");
                this.popup = popup;

                ui.on("click", this._toggle.bind(this));
            },
            _toggle: function () {
                this.popup.toggle();
            },
            command: jQuery.noop,
            _open: function() {

            },
            _activate: function() {
                const that = this;
                that.popup.element.find(".symbol-cell").each(function() {
                    jQuery(this).click(function() {
                        that.popup.close();
                        const symbol = jQuery(this).text();
                        that.editor.paste(symbol);
                    });
                });
            },
            _close: function() {
                const that = this;
                that.popup.element.find(".symbol-cell").each(function() {
                    jQuery(this).off("click");
                });
            },
            destroy: function() {
                this.popup.destroy();
            }
        });
        ToolBuilder.registerTool(kendo, PopupTool, TOOLBAR_BUTTON_DATA.DEFAULT.name, popupTemplateGenerator(), true);
    }
}

export const INSERT_SYMBOL_PROVIDER: ClassProvider = {
    multi: true,
    provide: EDITOR_CONFIG_TOKEN,
    useClass: InsertSymbolProvider
};
