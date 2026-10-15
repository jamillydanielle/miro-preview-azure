/*
 * ---------------------------------------------------------
 * Copyright(C) Microsoft Corporation. All rights reserved.
 * ---------------------------------------------------------
 */
/**
 * The status of an operation.
 */
export var OperationStatus;
(function (OperationStatus) {
    /**
     * The operation does not have a status set.
     */
    OperationStatus[OperationStatus["NotSet"] = 0] = "NotSet";
    /**
     * The operation has been queued.
     */
    OperationStatus[OperationStatus["Queued"] = 1] = "Queued";
    /**
     * The operation is in progress.
     */
    OperationStatus[OperationStatus["InProgress"] = 2] = "InProgress";
    /**
     * The operation was cancelled by the user.
     */
    OperationStatus[OperationStatus["Cancelled"] = 3] = "Cancelled";
    /**
     * The operation completed successfully.
     */
    OperationStatus[OperationStatus["Succeeded"] = 4] = "Succeeded";
    /**
     * The operation completed with a failure.
     */
    OperationStatus[OperationStatus["Failed"] = 5] = "Failed";
})(OperationStatus || (OperationStatus = {}));
