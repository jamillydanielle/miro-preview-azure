/*
 * ---------------------------------------------------------
 * Copyright(C) Microsoft Corporation. All rights reserved.
 * ---------------------------------------------------------
 */
/**
 * identifies the scope of dashboard storage and permissions.
 */
export var DashboardScope;
(function (DashboardScope) {
    /**
     * [DEPRECATED] Dashboard is scoped to the collection user.
     */
    DashboardScope[DashboardScope["Collection_User"] = 0] = "Collection_User";
    /**
     * Dashboard is scoped to the team.
     */
    DashboardScope[DashboardScope["Project_Team"] = 1] = "Project_Team";
    /**
     * Dashboard is scoped to the project.
     */
    DashboardScope[DashboardScope["Project"] = 2] = "Project";
})(DashboardScope || (DashboardScope = {}));
/**
 * None - Team member cannot edit dashboard Edit - Team member can add, configure and delete widgets Manage - Team member can add, reorder, delete dashboards Manage Permissions - Team member can manage membership of other members to perform group operations.
 */
export var GroupMemberPermission;
(function (GroupMemberPermission) {
    GroupMemberPermission[GroupMemberPermission["None"] = 0] = "None";
    GroupMemberPermission[GroupMemberPermission["Edit"] = 1] = "Edit";
    GroupMemberPermission[GroupMemberPermission["Manage"] = 2] = "Manage";
    GroupMemberPermission[GroupMemberPermission["ManagePermissions"] = 3] = "ManagePermissions";
})(GroupMemberPermission || (GroupMemberPermission = {}));
/**
 * Read - User can see dashboards Create - User can create dashboards Edit - User can add, configure and delete widgets, and edit dashboard settings. Delete - User can delete dashboards Manage Permissions - Team member can manage membership of other members to perform group operations.
 */
export var TeamDashboardPermission;
(function (TeamDashboardPermission) {
    TeamDashboardPermission[TeamDashboardPermission["None"] = 0] = "None";
    TeamDashboardPermission[TeamDashboardPermission["Read"] = 1] = "Read";
    TeamDashboardPermission[TeamDashboardPermission["Create"] = 2] = "Create";
    TeamDashboardPermission[TeamDashboardPermission["Edit"] = 4] = "Edit";
    TeamDashboardPermission[TeamDashboardPermission["Delete"] = 8] = "Delete";
    TeamDashboardPermission[TeamDashboardPermission["ManagePermissions"] = 16] = "ManagePermissions";
})(TeamDashboardPermission || (TeamDashboardPermission = {}));
/**
 * data contract required for the widget to function in a webaccess area or page.
 */
export var WidgetScope;
(function (WidgetScope) {
    WidgetScope[WidgetScope["Collection_User"] = 0] = "Collection_User";
    WidgetScope[WidgetScope["Project_Team"] = 1] = "Project_Team";
})(WidgetScope || (WidgetScope = {}));
