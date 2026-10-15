/*
 * ---------------------------------------------------------
 * Copyright(C) Microsoft Corporation. All rights reserved.
 * ---------------------------------------------------------
 */
/**
 * Enumerates data types that are supported as subscription input values.
 */
export var InputDataType;
(function (InputDataType) {
    /**
     * No data type is specified.
     */
    InputDataType[InputDataType["None"] = 0] = "None";
    /**
     * Represents a textual value.
     */
    InputDataType[InputDataType["String"] = 10] = "String";
    /**
     * Represents a numeric value.
     */
    InputDataType[InputDataType["Number"] = 20] = "Number";
    /**
     * Represents a value of true or false.
     */
    InputDataType[InputDataType["Boolean"] = 30] = "Boolean";
    /**
     * Represents a Guid.
     */
    InputDataType[InputDataType["Guid"] = 40] = "Guid";
    /**
     * Represents a URI.
     */
    InputDataType[InputDataType["Uri"] = 50] = "Uri";
})(InputDataType || (InputDataType = {}));
export var InputFilterOperator;
(function (InputFilterOperator) {
    InputFilterOperator[InputFilterOperator["Equals"] = 0] = "Equals";
    InputFilterOperator[InputFilterOperator["NotEquals"] = 1] = "NotEquals";
})(InputFilterOperator || (InputFilterOperator = {}));
/**
 * Mode in which a subscription input should be entered (in a UI)
 */
export var InputMode;
(function (InputMode) {
    /**
     * This input should not be shown in the UI
     */
    InputMode[InputMode["None"] = 0] = "None";
    /**
     * An input text box should be shown
     */
    InputMode[InputMode["TextBox"] = 10] = "TextBox";
    /**
     * An password input box should be shown
     */
    InputMode[InputMode["PasswordBox"] = 20] = "PasswordBox";
    /**
     * A select/combo control should be shown
     */
    InputMode[InputMode["Combo"] = 30] = "Combo";
    /**
     * Radio buttons should be shown
     */
    InputMode[InputMode["RadioButtons"] = 40] = "RadioButtons";
    /**
     * Checkbox should be shown(for true/false values)
     */
    InputMode[InputMode["CheckBox"] = 50] = "CheckBox";
    /**
     * A multi-line text area should be shown
     */
    InputMode[InputMode["TextArea"] = 60] = "TextArea";
})(InputMode || (InputMode = {}));
