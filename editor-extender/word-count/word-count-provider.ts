import { ClassProvider, Injectable } from "@angular/core";
import { ToolBarItem, EditorConfigProvider, EditorHost, EDITOR_CONFIG_TOKEN  } from "@progress/sitefinity-adminapp-sdk/app/api/v1";

/**
 * A custom toolbar provider implementation for counting the words in the html editor.
 */
@Injectable()
class WordCountProvider implements EditorConfigProvider {
    /**
     * The method that gets invoked when the editor constructs the toolbar actions.
     * @param editorHost The element hosting the editor. The editor is created after this method runs, so get it when the tool is executed.
     */
    getToolBarItems(editorHost: EditorHost): ToolBarItem[] {
        const wordsCount = () => {
            const editor = editorHost.getEditor();
            const editorValue = this.stripHTML(editor.value());
            const count = editorValue ? editorValue.split(" ").length : 0;

            alert(`Words count: ${count}`);
        };

        /**
         * A custom toolbar item
         */
        const CUSTOM_TOOLBAR_ITEM: ToolBarItem = {
            name: "Words-count",
            tooltip: "Words count",
            icon: "sf-font-number",
            ordinal: 5,
            exec: wordsCount
        };

        return [CUSTOM_TOOLBAR_ITEM];
    }

    getToolBarItemsNamesToRemove(): string[] {
        /**
         * If you want to remove some toolbar items return their names as strings in the array. Order is insignificant.
         * Otherwise return an empty array.
         * Example: return [ "embed" ];
         * The above code will remove the embed toolbar item from the editor.
         */
        return [];
    }

    /**
     * This gives access to the editor configuration object
     * that is used to initialize the editor upon creation.
     */
    configureEditor(configuration: any) {
        configuration.pasteCleanup.span = false;
        return configuration;
    }

    private stripHTML(html: string): string {
        const tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    }
}

/**
 * Export a 'multi' class provider so that multiple instances of the same provider can coexist.
 * This allows for more than one provider to be registered within one or more bundles.
 */
export const WORD_COUNT_PROVIDER: ClassProvider = {
    multi: true,
    provide: EDITOR_CONFIG_TOKEN,
    useClass: WordCountProvider
};
