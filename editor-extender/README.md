# Custom content editor

When content editors edit their content, they can benefit from the Admin App rich text editor that provides them with relevant text editing features. Out-of-the-box, content editors can work with image and link selector contextual toolsets for Sitefinity CMS content as well as many text formatting and styling options. You can also extend the editor capabilities by adding a custom functionality represented as a button in the editor toolbar. In order to do so a custom [**ToolBarItem**](http://admin-app-extensions-docs.sitefinity.site/interfaces/toolbaritem.html) has to be injected in the editor configuration.
To do this a custom implementation of the [**EditorConfigProvider**](http://admin-app-extensions-docs.sitefinity.site/interfaces/editorconfigprovider.html) must be provided. The provider has a method [**getToolBarItems**](http://admin-app-extensions-docs.sitefinity.site/interfaces/editorconfigprovider.html#gettoolbaritems) that is invoked before the editor is instantiated. You need to provide a custom set of commands that you want to be displayed in the editor as a return result of this method.

Not only can you add commands to the editor but also you can remove such. The [**EditorConfigProvider**](http://admin-app-extensions-docs.sitefinity.site/interfaces/editorconfigprovider.html) interface defines a method [**getToolBarItemsNamesToRemove**](http://admin-app-extensions-docs.sitefinity.site/interfaces/editorconfigprovider.html#gettoolbaritemsnamestoremove). The method should return an array with the names of the toolbar items that you want to remove, for example `"embed"`, `"createTable"` or `"html"`. In case you don't want to remove any toolbar items the method should return an empty array.

**NOTE:** Only default toolbar items can be removed. Toolbar items added by custom implementations of the [**EditorConfigProvider**](http://admin-app-extensions-docs.sitefinity.site/interfaces/editorconfigprovider.html) interface cannot be removed.

What is more you have the power to edit the configurations which are used to instantiate the editor. The [**EditorConfigProvider**](http://admin-app-extensions-docs.sitefinity.site/interfaces/editorconfigprovider.html) interface defines a method [**configureEditor**](http://admin-app-extensions-docs.sitefinity.site/interfaces/editorconfigprovider.html#configureeditor) that is invoked before the editor is instantiated. The method accepts the current editor configuration object and returns the modified configurations. The editor honours the `tools`, `serialization`, `deserialization`, `pasteCleanup` and `immutables` options and the `keydown`, `keyup`, `paste`, `change`, `execute` and `select` events.

## Accessing the editor

The Admin App does not load jQuery or Kendo UI for jQuery, so extensions must not use the `jQuery`, `$` or `kendo` globals. The `editorHost` argument of **getToolBarItems** is an `EditorHost`:

* `editorHost.element` is the element that hosts the editor.
* `editorHost.isPersonalized` tells whether the edited field is personalized.
* `editorHost.getEditor()` returns the editor, or `null` before the editor is created. Because **getToolBarItems** runs before the editor is created, call it when the tool is executed.
* `editorHost.whenReady(editor => { ... })` runs the callback once the editor and its toolbar are rendered. Use it for setup that needs the editor, for example to call `groupToolbarButtons(editor.toolbar.element, ...)`.

The editor supports `value()`, `exec(name, params)`, for example `exec("insertHtml", { html })`, `state(name)`, `getRange()`, `selectRange(range)`, `paste(html)`, `bind`/`unbind`/`trigger`, `undo()`/`redo()` and `history` (`record`, `canUndo`, `canRedo`, `clear`, `truncate` and `on`). `body`, `element`, `wrapper` and `toolbar.element` are plain DOM elements, so use the standard DOM API on them.

## Toolbar items

A **ToolBarItem** runs its `exec` function when it is pressed. The function receives `{ name, sender, target, originalEvent, preventDefault }`, where `sender` is the editor.

To open a popup instead, provide a `popup(container, context)` function and no `exec`. The toolbar opens the popup under the tool and passes its element as `container` and `{ editor, close }` as `context`. Render plain DOM into the container, call `context.close()` after the user picks a value and return a function that removes your event listeners. The toolbar positions the popup, closes it on Esc and returns the focus to the tool. See the [insert symbol sample](./insert-symbol/README.md).

Set the icon of a tool with its `icon` property: the CSS classes of an sf-font glyph, for example `sf-font-image`, a FontAwesome 4.7 glyph, for example `sf-fa sf-fa-font`, or a class that your extension styles. A tool without an icon shows a settings icon. To move a custom tool next to another one, call `groupToolbarButtons(editor.toolbar.element, toolName, destinationToolName, isAtTheEnd)` with the tool names.

## Custom content editor samples

### [Custom content editor toolbar with insert symbol functionality](./insert-symbol/README.md)

### [Custom content editor toolbar with word count](./word-count/README.md)

### [Custom content editor toolbar with spellcheck functionality and spellcheck contextual toolset](./spell-check/README.md)

### [Custom content editor toolbar with insert video functionality](./sitefinity-videos/README.md)

### [Custom content editor toolbar with switch text direction functionality](./switch-text-direction/README.md)
