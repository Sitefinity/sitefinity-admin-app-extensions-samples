import { Injectable, ClassProvider, Inject } from "@angular/core";
import { EditorHost, ToolBarItem, ToolBarItemsProvider, TOOLBARITEMS_TOKEN, SelectorService, SelectorOptions, SELECTOR_SERVICE, DataItem } from "@progress/sitefinity-adminapp-sdk/app/api/v1";

// The editor removes breaks with this class when it saves the content; they only let the caret move around the inserted element.
const TRAILING_BREAK = "<br class='sf-rich-text-br'>";

export const ensureTrailingBreaks = (html: string): string => {
    return `${TRAILING_BREAK}${html}${TRAILING_BREAK}`;
};

/**
 * A custom toolbar provider implementation for inserting existing images in the editor.
 */
@Injectable()
class ImagesToolbarItemProvider implements ToolBarItemsProvider {
    constructor(@Inject(SELECTOR_SERVICE) private readonly selectorService: SelectorService) { }

    getToolBarItems(editorHost: EditorHost): ToolBarItem[] {
        const CUSTOM_TOOLBAR_ITEM: ToolBarItem = {
            name: "Sitefinity-images",
            tooltip: "Sitefinity images",
            icon: "sf-font-image",
            ordinal: 7,
            exec: () => {
                // The editor is created after getToolBarItems runs, so get it when the tool is executed.
                const editor = editorHost.getEditor();

                // Save editor's current range, so we can insert
                // later the HTML at this position.
                const currentRange = editor.getRange();
                const selectorOptions: SelectorOptions = {
                    multiple: true
                };

                // open the selector and subscribe to the result
                this.selectorService.openImageLibrarySelector(selectorOptions).subscribe(images => {
                    if (images.length) {
                        // Restore editor's saved position.
                        editor.selectRange(currentRange);
                        images.forEach((img: DataItem) => {
                            const imageElement = document.createElement("img");
                            imageElement.src = img.data.ThumbnailUrl;

                            // Insert the HTML and trigger editor's change, so the
                            // HTML can be saved.
                            editor.paste(ensureTrailingBreaks(imageElement.outerHTML));
                            editor.trigger("change");
                        });
                    }
                });
            }
        };

        return [CUSTOM_TOOLBAR_ITEM];
    }

    getToolBarItemsNamesToRemove(): string[] {
        // If you want to remove some toolbar items return their names as strings in the array. Order is insignificant.
        // Otherwise return an empty array.
        // Example: return [ "embed" ];
        // The above code will remove the embed toolbar item from the editor.
        return [];
    }
}

/**
 * Export a 'multi' class provider so that multiple instances of the same provider can coexist.
 * This allows for more than one provider to be registered within one or more bundles.
 */
export const IMAGE_TOOLBAR_ITEM_PROVIDER: ClassProvider = {
    multi: true,
    provide: TOOLBARITEMS_TOKEN,
    useClass: ImagesToolbarItemProvider
};
