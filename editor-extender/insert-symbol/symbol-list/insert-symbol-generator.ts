export const DATA_ATTRIBUTE_NAME = "data-value";

/**
 * Represents a helper class for importing a symbol list JSON and generating the buttons that populate the tool's popup.
 */
export class InsertSymbolGenerator {
    private symbolConfig;

    constructor (symbolList) {
        this.symbolConfig = symbolList;
    }

    /**
     * Generates a button for each symbol model of a JSON list.
     */
    generateButtons(ownerDocument: Document): HTMLButtonElement[] {
        return this.symbolConfig.map((symbol: SymbolModel) => this.generateButton(ownerDocument, symbol));
    }

    private generateButton(ownerDocument: Document, symbol: SymbolModel): HTMLButtonElement {
        const button = ownerDocument.createElement("button");

        button.type = "button";
        button.className = "symbol-cell";
        button.setAttribute(DATA_ATTRIBUTE_NAME, symbol.value);
        // The symbol alone is not a reliable accessible name, so screen readers announce its name instead.
        button.setAttribute("aria-label", symbol.tooltip.toLowerCase());
        button.title = symbol.tooltip;
        button.textContent = symbol.value;

        return button;
    }
}

class SymbolModel {
    name: string;
    value: string;
    escapedValue: string;
    tooltip: string;
}
