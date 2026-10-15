/*
 * ---------------------------------------------------------
 * Copyright(C) Microsoft Corporation. All rights reserved.
 * ---------------------------------------------------------
 */
export var AggregationType;
(function (AggregationType) {
    AggregationType[AggregationType["Hourly"] = 0] = "Hourly";
    AggregationType[AggregationType["Daily"] = 1] = "Daily";
})(AggregationType || (AggregationType = {}));
export var ResultPhase;
(function (ResultPhase) {
    ResultPhase[ResultPhase["Preliminary"] = 0] = "Preliminary";
    ResultPhase[ResultPhase["Full"] = 1] = "Full";
})(ResultPhase || (ResultPhase = {}));
