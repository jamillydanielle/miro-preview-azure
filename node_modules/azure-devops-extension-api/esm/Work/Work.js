/*
 * ---------------------------------------------------------
 * Copyright(C) Microsoft Corporation. All rights reserved.
 * ---------------------------------------------------------
 */
/**
 * Definition of the type of backlog level
 */
export var BacklogType;
(function (BacklogType) {
    /**
     * Portfolio backlog level
     */
    BacklogType[BacklogType["Portfolio"] = 0] = "Portfolio";
    /**
     * Requirement backlog level
     */
    BacklogType[BacklogType["Requirement"] = 1] = "Requirement";
    /**
     * Task backlog level
     */
    BacklogType[BacklogType["Task"] = 2] = "Task";
})(BacklogType || (BacklogType = {}));
/**
 * Determines what columns to include on the board badge
 */
export var BoardBadgeColumnOptions;
(function (BoardBadgeColumnOptions) {
    /**
     * Only include In Progress columns
     */
    BoardBadgeColumnOptions[BoardBadgeColumnOptions["InProgressColumns"] = 0] = "InProgressColumns";
    /**
     * Include all columns
     */
    BoardBadgeColumnOptions[BoardBadgeColumnOptions["AllColumns"] = 1] = "AllColumns";
    /**
     * Include a custom set of columns
     */
    BoardBadgeColumnOptions[BoardBadgeColumnOptions["CustomColumns"] = 2] = "CustomColumns";
})(BoardBadgeColumnOptions || (BoardBadgeColumnOptions = {}));
export var BoardColumnType;
(function (BoardColumnType) {
    BoardColumnType[BoardColumnType["Incoming"] = 0] = "Incoming";
    BoardColumnType[BoardColumnType["InProgress"] = 1] = "InProgress";
    BoardColumnType[BoardColumnType["Outgoing"] = 2] = "Outgoing";
})(BoardColumnType || (BoardColumnType = {}));
/**
 * The behavior of the work item types that are in the work item category specified in the BugWorkItems section in the Process Configuration
 */
export var BugsBehavior;
(function (BugsBehavior) {
    BugsBehavior[BugsBehavior["Off"] = 0] = "Off";
    BugsBehavior[BugsBehavior["AsRequirements"] = 1] = "AsRequirements";
    BugsBehavior[BugsBehavior["AsTasks"] = 2] = "AsTasks";
})(BugsBehavior || (BugsBehavior = {}));
export var FieldType;
(function (FieldType) {
    FieldType[FieldType["String"] = 0] = "String";
    FieldType[FieldType["PlainText"] = 1] = "PlainText";
    FieldType[FieldType["Integer"] = 2] = "Integer";
    FieldType[FieldType["DateTime"] = 3] = "DateTime";
    FieldType[FieldType["TreePath"] = 4] = "TreePath";
    FieldType[FieldType["Boolean"] = 5] = "Boolean";
    FieldType[FieldType["Double"] = 6] = "Double";
})(FieldType || (FieldType = {}));
/**
 * Enum for the various modes of identity picker
 */
export var IdentityDisplayFormat;
(function (IdentityDisplayFormat) {
    /**
     * Display avatar only
     */
    IdentityDisplayFormat[IdentityDisplayFormat["AvatarOnly"] = 0] = "AvatarOnly";
    /**
     * Display Full name only
     */
    IdentityDisplayFormat[IdentityDisplayFormat["FullName"] = 1] = "FullName";
    /**
     * Display Avatar and Full name
     */
    IdentityDisplayFormat[IdentityDisplayFormat["AvatarAndFullName"] = 2] = "AvatarAndFullName";
})(IdentityDisplayFormat || (IdentityDisplayFormat = {}));
/**
 * Enum for the various types of plans
 */
export var PlanType;
(function (PlanType) {
    PlanType[PlanType["DeliveryTimelineView"] = 0] = "DeliveryTimelineView";
})(PlanType || (PlanType = {}));
/**
 * Flag for permissions a user can have for this plan.
 */
export var PlanUserPermissions;
(function (PlanUserPermissions) {
    /**
     * None
     */
    PlanUserPermissions[PlanUserPermissions["None"] = 0] = "None";
    /**
     * Permission to view this plan.
     */
    PlanUserPermissions[PlanUserPermissions["View"] = 1] = "View";
    /**
     * Permission to update this plan.
     */
    PlanUserPermissions[PlanUserPermissions["Edit"] = 2] = "Edit";
    /**
     * Permission to delete this plan.
     */
    PlanUserPermissions[PlanUserPermissions["Delete"] = 4] = "Delete";
    /**
     * Permission to manage this plan.
     */
    PlanUserPermissions[PlanUserPermissions["Manage"] = 8] = "Manage";
    /**
     * Full control permission for this plan.
     */
    PlanUserPermissions[PlanUserPermissions["AllPermissions"] = 15] = "AllPermissions";
})(PlanUserPermissions || (PlanUserPermissions = {}));
export var TimeFrame;
(function (TimeFrame) {
    TimeFrame[TimeFrame["Past"] = 0] = "Past";
    TimeFrame[TimeFrame["Current"] = 1] = "Current";
    TimeFrame[TimeFrame["Future"] = 2] = "Future";
})(TimeFrame || (TimeFrame = {}));
export var TimelineCriteriaStatusCode;
(function (TimelineCriteriaStatusCode) {
    /**
     * No error - filter is good.
     */
    TimelineCriteriaStatusCode[TimelineCriteriaStatusCode["OK"] = 0] = "OK";
    /**
     * One of the filter clause is invalid.
     */
    TimelineCriteriaStatusCode[TimelineCriteriaStatusCode["InvalidFilterClause"] = 1] = "InvalidFilterClause";
    /**
     * Unknown error.
     */
    TimelineCriteriaStatusCode[TimelineCriteriaStatusCode["Unknown"] = 2] = "Unknown";
})(TimelineCriteriaStatusCode || (TimelineCriteriaStatusCode = {}));
export var TimelineIterationStatusCode;
(function (TimelineIterationStatusCode) {
    /**
     * No error - iteration data is good.
     */
    TimelineIterationStatusCode[TimelineIterationStatusCode["OK"] = 0] = "OK";
    /**
     * This iteration overlaps with another iteration, no data is returned for this iteration.
     */
    TimelineIterationStatusCode[TimelineIterationStatusCode["IsOverlapping"] = 1] = "IsOverlapping";
})(TimelineIterationStatusCode || (TimelineIterationStatusCode = {}));
export var TimelineTeamStatusCode;
(function (TimelineTeamStatusCode) {
    /**
     * No error - all data for team is good.
     */
    TimelineTeamStatusCode[TimelineTeamStatusCode["OK"] = 0] = "OK";
    /**
     * Team does not exist or access is denied.
     */
    TimelineTeamStatusCode[TimelineTeamStatusCode["DoesntExistOrAccessDenied"] = 1] = "DoesntExistOrAccessDenied";
    /**
     * Maximum number of teams was exceeded. No team data will be returned for this team.
     */
    TimelineTeamStatusCode[TimelineTeamStatusCode["MaxTeamsExceeded"] = 2] = "MaxTeamsExceeded";
    /**
     * Maximum number of team fields (ie Area paths) have been exceeded. No team data will be returned for this team.
     */
    TimelineTeamStatusCode[TimelineTeamStatusCode["MaxTeamFieldsExceeded"] = 3] = "MaxTeamFieldsExceeded";
    /**
     * Backlog does not exist or is missing crucial information.
     */
    TimelineTeamStatusCode[TimelineTeamStatusCode["BacklogInError"] = 4] = "BacklogInError";
    /**
     * Team field value is not set for this team. No team data will be returned for this team
     */
    TimelineTeamStatusCode[TimelineTeamStatusCode["MissingTeamFieldValue"] = 5] = "MissingTeamFieldValue";
    /**
     * Team does not have a single iteration with date range.
     */
    TimelineTeamStatusCode[TimelineTeamStatusCode["NoIterationsExist"] = 6] = "NoIterationsExist";
})(TimelineTeamStatusCode || (TimelineTeamStatusCode = {}));
