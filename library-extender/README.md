# Custom Digital Assets Management provider

You can add custom DAM providers if you use DAM, which Siteifnity does not support by default.

If you prefer your custom implementation for any DAM providers supported by default, make sure that its _isSupported_ method returns __true__ for that _providerTypeName_, e.g., `return providerTypeName === "CloudinaryBlobStorageProvider";`.

_Note: There must be only one enabled DAM provider on the server. In your case, this should be the server-side implementation of your custom DAM provider._

To register a new provider, you need to create a new class that extends __DamProviderBase__.

```typescript
import { ClassProvider, Injectable } from "@angular/core";
import { EntityData, DamAsset, DamProviderBase, DAM_PROVIDER_TOKEN  } from "@progress/sitefinity-adminapp-sdk/app/api/v1";

declare var cloudinary: any;

const CUSTOM_MEDIA_CANNOT_BE_LOADED = "Custom media selector cannot be loaded.";
const CUSTOM_PROVIDER_TYPE_NAME = "CustomCloudinaryBlobStorageProvider";

@Injectable()
class CustomDamProvider extends DamProviderBase {
    isSupported(providerTypeName: string): boolean {
        ...
    }

    loadMediaSelector(damWrapper: HTMLElement, mediaEntityData: EntityData, allowMultiSelect: boolean): void {
        ...
    }
}
```

You need to implement two abstract methods because they are specific for each provider:

* isSupported - Use this method to determine if your provider supports the one enabled on the server. As a parameter, it receives the name of the Provider Type. You can name the provider any way you want, what matters is the name of the Class on the server.

```typescript
isSupported(providerTypeName: string): boolean {
    return providerTypeName === CUSTOM_PROVIDER_TYPE_NAME;
}
```

* loadMediaSelector - Use this method to instantiate the widget used to select and import asses from your DAM.

It must call __loadDynamicScript__ to embed the script of the DAM's widget into the page to open it. After the script is loaded, use the API of the DAM to create an instance of the widget and open it. Attach to the handler for inserting assets and convert all selected to the specific interface __DamAsset__. Add them to an array and call the __assetsSelected__ method of the base class.

```typescript
loadMediaSelector(damWrapper: HTMLElement, mediaEntityData: EntityData, allowMultiSelect: boolean): void {
    if (!this.areSettingsPropertiesValid()) {
        this.error("Custom media selector cannot be loaded.");
        return;
    }

    this.loadDynamicScript(this.getPropertyValue("ScriptUrl")).subscribe(() => {
        if (typeof cloudinary === "undefined") {
            this.error("Custom media selector cannot be loaded.");
            return;
        }

        let config = {
            cloud_name: this.getPropertyValue("CloudName"),
            api_key: this.getPropertyValue("ApiKey"),
            multiple: allowMultiSelect,
            inline_container: `.${damWrapper.className.replace(/\s/g, ".")}`,
            remove_header: true,
            integration: {
                type: "custom_progress_sitefinity_connector_for_cloudinary",
                platform: "admin app extensions",
                version: "1.0",
                environment: null
            }
        };

        const handlers = {
            insertHandler: this.insertHandler.bind(this),
            errorHandler: this.error.bind(this)
        };

        try {
            const mediaLibrary = cloudinary.createMediaLibrary(config, handlers);
            mediaLibrary.show(config);
        } catch (error) {
            this.error(error);
        }
    }, () => {
        this.error("Custom media selector cannot be loaded.");
    });
}
```

Create ClassProvider for your custom DAM provider and register it in library-extender/index.ts:

```typescript
export const CUSTOM_DAM_PROVIDER: ClassProvider = {
    multi: true,
    provide: DAM_PROVIDER_TOKEN,
    useClass: CustomDamProvider
};
```

After the implementation is complete, when clicking on insert image/document in the rich editor or clicking to relate media item, the widget of the DAM provider will open into the dialog.
