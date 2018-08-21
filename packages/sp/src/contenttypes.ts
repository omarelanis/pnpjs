import { TypedHash, jsS } from "@pnp/common";
import { SharePointQueryableCollection, SharePointQueryableInstance, defaultPath } from "./sharepointqueryable";
import { metadata } from "./utils/metadata";

/**
 * Describes a collection of content types
 *
 */
@defaultPath("contenttypes")
export class ContentTypes extends SharePointQueryableCollection {

    public getById = this._getById(ContentType);

    /**
     * Adds an existing contenttype to a content type collection
     *
     * @param contentTypeId in the following format, for example: 0x010102
     */
    public addAvailableContentType(contentTypeId: string): Promise<ContentTypeAddResult> {

        const postBody: string = jsS({
            "contentTypeId": contentTypeId,
        });

        return this.clone(ContentTypes, "addAvailableContentType").postCore<{ id: string }>({ body: postBody }).then((data) => {
            return {
                contentType: this.getById(data.id),
                data: data,
            };
        });
    }

    /**
     * Adds a new content type to the collection
     *
     * @param id The desired content type id for the new content type (also determines the parent content type)
     * @param name The name of the content type
     * @param description The description of the content type
     * @param group The group in which to add the content type
     * @param additionalSettings Any additional settings to provide when creating the content type
     *
     */
    public add(
        id: string,
        name: string,
        description = "",
        group = "Custom Content Types",
        additionalSettings: TypedHash<string | number | boolean> = {}): Promise<ContentTypeAddResult> {

        const postBody = jsS(Object.assign(metadata("SP.ContentType"), {
            "Description": description,
            "Group": group,
            "Id": { "StringValue": id },
            "Name": name,
        }, additionalSettings));

        return this.postCore({ body: postBody }).then((data) => {
            return { contentType: this.getById(data.id), data: data };
        });
    }
}

/**
 * Describes a single ContentType instance
 *
 */
export class ContentType extends SharePointQueryableInstance {

    /**
     * Gets the column (also known as field) references in the content type.
    */
    public get fieldLinks(): FieldLinks {
        return new FieldLinks(this);
    }

    /**
     * Gets a value that specifies the collection of fields for the content type.
     */
    public get fields(): SharePointQueryableCollection {
        return new SharePointQueryableCollection(this, "fields");
    }

    /**
     * Gets the parent content type of the content type.
     */
    public get parent(): ContentType {
        return new ContentType(this, "parent");
    }

    /**
     * Gets a value that specifies the collection of workflow associations for the content type.
     */
    public get workflowAssociations(): SharePointQueryableCollection {
        return new SharePointQueryableCollection(this, "workflowAssociations");
    }

    /**
     * Delete this content type
     */
    public delete = this._delete;
}

export interface ContentTypeAddResult {
    contentType: ContentType;
    data: any;
}

/**
 * Represents a collection of field link instances
 */
@defaultPath("fieldlinks")
export class FieldLinks extends SharePointQueryableCollection {
    public getById = this._getById(FieldLink);
}

/**
 * Represents a field link instance
 */
export class FieldLink extends SharePointQueryableInstance { }
