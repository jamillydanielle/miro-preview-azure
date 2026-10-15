/*
 * ---------------------------------------------------------
 * Copyright(C) Microsoft Corporation. All rights reserved.
 * ---------------------------------------------------------
 */
/**
 * Wiki types.
 */
export var WikiType;
(function (WikiType) {
    /**
     * Indicates that the wiki is provisioned for the team project
     */
    WikiType[WikiType["ProjectWiki"] = 0] = "ProjectWiki";
    /**
     * Indicates that the wiki is published from a git repository
     */
    WikiType[WikiType["CodeWiki"] = 1] = "CodeWiki";
})(WikiType || (WikiType = {}));
