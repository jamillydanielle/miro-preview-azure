/*
 * ---------------------------------------------------------
 * Copyright(C) Microsoft Corporation. All rights reserved.
 * ---------------------------------------------------------
 */
export var FrameworkIdentityType;
(function (FrameworkIdentityType) {
    FrameworkIdentityType[FrameworkIdentityType["None"] = 0] = "None";
    FrameworkIdentityType[FrameworkIdentityType["ServiceIdentity"] = 1] = "ServiceIdentity";
    FrameworkIdentityType[FrameworkIdentityType["AggregateIdentity"] = 2] = "AggregateIdentity";
    FrameworkIdentityType[FrameworkIdentityType["ImportedIdentity"] = 3] = "ImportedIdentity";
})(FrameworkIdentityType || (FrameworkIdentityType = {}));
export var GroupScopeType;
(function (GroupScopeType) {
    GroupScopeType[GroupScopeType["Generic"] = 0] = "Generic";
    GroupScopeType[GroupScopeType["ServiceHost"] = 1] = "ServiceHost";
    GroupScopeType[GroupScopeType["TeamProject"] = 2] = "TeamProject";
})(GroupScopeType || (GroupScopeType = {}));
export var QueryMembership;
(function (QueryMembership) {
    /**
     * Query will not return any membership data
     */
    QueryMembership[QueryMembership["None"] = 0] = "None";
    /**
     * Query will return only direct membership data
     */
    QueryMembership[QueryMembership["Direct"] = 1] = "Direct";
    /**
     * Query will return expanded membership data
     */
    QueryMembership[QueryMembership["Expanded"] = 2] = "Expanded";
    /**
     * Query will return expanded up membership data (parents only)
     */
    QueryMembership[QueryMembership["ExpandedUp"] = 3] = "ExpandedUp";
    /**
     * Query will return expanded down membership data (children only)
     */
    QueryMembership[QueryMembership["ExpandedDown"] = 4] = "ExpandedDown";
})(QueryMembership || (QueryMembership = {}));
export var ReadIdentitiesOptions;
(function (ReadIdentitiesOptions) {
    ReadIdentitiesOptions[ReadIdentitiesOptions["None"] = 0] = "None";
    ReadIdentitiesOptions[ReadIdentitiesOptions["FilterIllegalMemberships"] = 1] = "FilterIllegalMemberships";
})(ReadIdentitiesOptions || (ReadIdentitiesOptions = {}));
