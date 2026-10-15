/*
 * ---------------------------------------------------------
 * Copyright(C) Microsoft Corporation. All rights reserved.
 * ---------------------------------------------------------
 */
export var InheritLevel;
(function (InheritLevel) {
    InheritLevel[InheritLevel["None"] = 0] = "None";
    InheritLevel[InheritLevel["Deployment"] = 1] = "Deployment";
    InheritLevel[InheritLevel["Account"] = 2] = "Account";
    InheritLevel[InheritLevel["Collection"] = 4] = "Collection";
    InheritLevel[InheritLevel["All"] = 7] = "All";
})(InheritLevel || (InheritLevel = {}));
export var RelativeToSetting;
(function (RelativeToSetting) {
    RelativeToSetting[RelativeToSetting["Context"] = 0] = "Context";
    RelativeToSetting[RelativeToSetting["WebApplication"] = 2] = "WebApplication";
    RelativeToSetting[RelativeToSetting["FullyQualified"] = 3] = "FullyQualified";
})(RelativeToSetting || (RelativeToSetting = {}));
export var ServiceStatus;
(function (ServiceStatus) {
    ServiceStatus[ServiceStatus["Assigned"] = 0] = "Assigned";
    ServiceStatus[ServiceStatus["Active"] = 1] = "Active";
    ServiceStatus[ServiceStatus["Moving"] = 2] = "Moving";
})(ServiceStatus || (ServiceStatus = {}));
