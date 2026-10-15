/*
 * ---------------------------------------------------------
 * Copyright(C) Microsoft Corporation. All rights reserved.
 * ---------------------------------------------------------
 */
/**
 * Compression type for file stored in Blobstore
 */
export var BlobCompressionType;
(function (BlobCompressionType) {
    BlobCompressionType[BlobCompressionType["None"] = 0] = "None";
    BlobCompressionType[BlobCompressionType["GZip"] = 1] = "GZip";
})(BlobCompressionType || (BlobCompressionType = {}));
/**
 * Status of a container item.
 */
export var ContainerItemStatus;
(function (ContainerItemStatus) {
    /**
     * Item is created.
     */
    ContainerItemStatus[ContainerItemStatus["Created"] = 1] = "Created";
    /**
     * Item is a file pending for upload.
     */
    ContainerItemStatus[ContainerItemStatus["PendingUpload"] = 2] = "PendingUpload";
})(ContainerItemStatus || (ContainerItemStatus = {}));
/**
 * Type of a container item.
 */
export var ContainerItemType;
(function (ContainerItemType) {
    /**
     * Any item type.
     */
    ContainerItemType[ContainerItemType["Any"] = 0] = "Any";
    /**
     * Item is a folder which can have child items.
     */
    ContainerItemType[ContainerItemType["Folder"] = 1] = "Folder";
    /**
     * Item is a file which is stored in the file service.
     */
    ContainerItemType[ContainerItemType["File"] = 2] = "File";
})(ContainerItemType || (ContainerItemType = {}));
/**
 * Options a container can have.
 */
export var ContainerOptions;
(function (ContainerOptions) {
    /**
     * No option.
     */
    ContainerOptions[ContainerOptions["None"] = 0] = "None";
})(ContainerOptions || (ContainerOptions = {}));
