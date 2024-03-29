import { NgModule } from "@angular/core";
import { CustomInputWriteComponent } from './custom-field/custom-field-write.component';
import { WIDGET_EDITOR_CUSTOM_FIELDS_PROVIDER } from './custom-field/widget-editor-custom-fields-provider';
import { FrameworkModule } from "@progress/sitefinity-adminapp-sdk/app/api/v1";
import { CUSTOM_WIDGET_EDITOR_VIEW_TOKEN } from './custom-editor/custom-widget-editor-view-provider';
import { FormsModule } from '@angular/forms';
import { CustomWidgetEditorComponent } from './custom-editor/custom-widget-editor.component';
import { SfInputModule } from "@progress/sitefinity-component-framework";

/**
 * The widget editor extender module.
 */
@NgModule({
    providers: [
        WIDGET_EDITOR_CUSTOM_FIELDS_PROVIDER,
        CUSTOM_WIDGET_EDITOR_VIEW_TOKEN
    ],
    declarations: [
        CustomInputWriteComponent,
        CustomWidgetEditorComponent
    ],
    imports: [
        FormsModule, SfInputModule, FrameworkModule
    ]
})
export class WidgetEditorExtenderModule { /* empty */ }
