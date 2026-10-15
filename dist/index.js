(() => {
  // node_modules/azure-devops-extension-sdk/esm/SDK.min.js
  var e = parseInt("10000000000", 36);
  var t = Number.MAX_SAFE_INTEGER || 9007199254740991;
  var n = class {
    objects = {};
    register(e2, t2) {
      this.objects[e2] = t2;
    }
    unregister(e2) {
      delete this.objects[e2];
    }
    getInstance(e2, t2) {
      var n2 = this.objects[e2];
      if (n2) return "function" == typeof n2 ? n2(t2) : n2;
    }
  };
  var r = 1;
  var o = class {
    promises = {};
    postToWindow;
    targetOrigin;
    handshakeToken;
    registry;
    channelId;
    nextMessageId = 1;
    nextProxyId = 1;
    proxyFunctions = {};
    constructor(o2, i2) {
      this.postToWindow = o2, this.targetOrigin = i2, this.registry = new n(), this.channelId = r++, this.targetOrigin || (this.handshakeToken = Math.floor(Math.random() * (t - e) + e).toString(36) + Math.floor(Math.random() * (t - e) + e).toString(36));
    }
    getObjectRegistry() {
      return this.registry;
    }
    async invokeRemoteMethod(e2, t2, n2, r2, o2) {
      const i2 = { id: this.nextMessageId++, methodName: e2, instanceId: t2, instanceContext: r2, params: this._customSerializeObject(n2, o2), serializationSettings: o2 };
      this.targetOrigin || (i2.handshakeToken = this.handshakeToken);
      const s2 = new Promise(((e3, t3) => {
        this.promises[i2.id] = { resolve: e3, reject: t3 };
      }));
      return this._sendRpcMessage(i2), s2;
    }
    getRemoteObjectProxy(e2, t2) {
      return this.invokeRemoteMethod("", e2, void 0, t2);
    }
    invokeMethod(e2, t2) {
      if (t2.methodName) {
        var n2 = e2[t2.methodName];
        if ("function" == typeof n2) try {
          var r2 = [];
          t2.params && (r2 = this._customDeserializeObject(t2.params, {}));
          var o2 = n2.apply(e2, r2);
          o2 && o2.then && "function" == typeof o2.then ? o2.then(((e3) => {
            this._success(t2, e3, t2.handshakeToken);
          }), ((e3) => {
            this.error(t2, e3);
          })) : this._success(t2, o2, t2.handshakeToken);
        } catch (e3) {
          this.error(t2, e3);
        }
        else this.error(t2, new Error("RPC method not found: " + t2.methodName));
      } else this._success(t2, e2, t2.handshakeToken);
    }
    getRegisteredObject(e2, t2) {
      if ("__proxyFunctions" === e2) return this.proxyFunctions;
      var n2 = this.registry.getInstance(e2, t2);
      return n2 || (n2 = i.getInstance(e2, t2)), n2;
    }
    onMessage(e2) {
      if (e2.instanceId) {
        const t2 = this.getRegisteredObject(e2.instanceId, e2.instanceContext);
        if (!t2) return false;
        "function" == typeof t2.then ? t2.then(((t3) => {
          this.invokeMethod(t3, e2);
        }), ((t3) => {
          this.error(e2, t3);
        })) : this.invokeMethod(t2, e2);
      } else {
        const t2 = this.promises[e2.id];
        if (!t2) return false;
        e2.error ? t2.reject(this._customDeserializeObject([e2.error], {})[0]) : t2.resolve(this._customDeserializeObject([e2.result], {})[0]), delete this.promises[e2.id];
      }
      return true;
    }
    owns(e2, t2, n2) {
      if (this.postToWindow === e2) {
        if (this.targetOrigin) return !!t2 && ("null" === t2.toLowerCase() || 0 === this.targetOrigin.toLowerCase().indexOf(t2.toLowerCase()));
        if (n2.handshakeToken && n2.handshakeToken === this.handshakeToken) return this.targetOrigin = t2, true;
      }
      return false;
    }
    error(e2, t2) {
      this._sendRpcMessage({ id: e2.id, error: this._customSerializeObject([t2], e2.serializationSettings)[0], handshakeToken: e2.handshakeToken });
    }
    _success(e2, t2, n2) {
      this._sendRpcMessage({ id: e2.id, result: this._customSerializeObject([t2], e2.serializationSettings)[0], handshakeToken: n2 });
    }
    _sendRpcMessage(e2) {
      this.postToWindow.postMessage(JSON.stringify(e2), "*");
    }
    _customSerializeObject(e2, t2, n2, r2 = 1, o2 = 1) {
      if (!e2 || o2 > 100) return;
      if (e2 instanceof Node || e2 instanceof Window || e2 instanceof Event) return;
      var i2;
      let s2;
      s2 = n2 || { newObjects: [], originalObjects: [] }, s2.originalObjects.push(e2);
      var c = (n3, i3, c2) => {
        var a3;
        try {
          a3 = n3[c2];
        } catch (e3) {
        }
        var h3 = typeof a3;
        if ("undefined" !== h3) {
          var d3 = -1;
          if ("object" === h3 && (d3 = s2.originalObjects.indexOf(a3)), d3 >= 0) {
            var u2 = s2.newObjects[d3];
            u2.__circularReferenceId || (u2.__circularReferenceId = r2++), i3[c2] = { __circularReference: u2.__circularReferenceId };
          } else "function" === h3 ? (this.nextProxyId++, i3[c2] = { __proxyFunctionId: this._registerProxyFunction(a3, e2), _channelId: this.channelId }) : "object" === h3 ? a3 && a3 instanceof Date ? i3[c2] = { __proxyDate: a3.getTime() } : i3[c2] = this._customSerializeObject(a3, t2, s2, r2, o2 + 1) : "__proxyFunctionId" !== c2 && (i3[c2] = a3);
        }
      };
      if (e2 instanceof Array) {
        i2 = [], s2.newObjects.push(i2);
        for (var a2 = 0, h2 = e2.length; a2 < h2; a2++) c(e2, i2, a2);
      } else {
        i2 = {}, s2.newObjects.push(i2);
        let n3 = {};
        try {
          n3 = (function(e3) {
            const t3 = {};
            for (; e3 && e3 !== Object.prototype; ) {
              const n4 = Object.getOwnPropertyNames(e3);
              for (const e4 of n4) "constructor" !== e4 && (t3[e4] = true);
              e3 = Object.getPrototypeOf(e3);
            }
            return t3;
          })(e2);
        } catch (e3) {
        }
        for (var d2 in n3) (d2 && "_" !== d2[0] || t2 && t2.includeUnderscoreProperties) && c(e2, i2, d2);
      }
      return s2.originalObjects.pop(), s2.newObjects.pop(), i2;
    }
    _registerProxyFunction(e2, t2) {
      var n2 = this.nextProxyId++;
      return this.proxyFunctions["proxy" + n2] = function() {
        return e2.apply(t2, Array.prototype.slice.call(arguments, 0));
      }, n2;
    }
    _customDeserializeObject(e2, t2) {
      var n2 = this;
      if (!e2) return null;
      var r2 = (e3, r3) => {
        var o3 = e3[r3], i3 = typeof o3;
        "__circularReferenceId" === r3 && "number" === i3 ? (t2[o3] = e3, delete e3[r3]) : "object" === i3 && o3 && (o3.__proxyFunctionId ? e3[r3] = function() {
          return n2.invokeRemoteMethod("proxy" + o3.__proxyFunctionId, "__proxyFunctions", Array.prototype.slice.call(arguments, 0), {}, { includeUnderscoreProperties: true });
        } : o3.__proxyDate ? e3[r3] = new Date(o3.__proxyDate) : o3.__circularReference ? e3[r3] = t2[o3.__circularReference] : this._customDeserializeObject(o3, t2));
      };
      if (e2 instanceof Array) for (var o2 = 0, i2 = e2.length; o2 < i2; o2++) r2(e2, o2);
      else if ("object" == typeof e2) for (var s2 in e2) r2(e2, s2);
      return e2;
    }
  };
  var i = new n();
  var s = new class {
    _channels = [];
    constructor() {
      window.addEventListener("message", this._handleMessageReceived);
    }
    addChannel(e2, t2) {
      const n2 = new o(e2, t2);
      return this._channels.push(n2), n2;
    }
    removeChannel(e2) {
      this._channels = this._channels.filter(((t2) => t2 !== e2));
    }
    _handleMessageReceived = (e2) => {
      let t2;
      if ("string" == typeof e2.data) try {
        t2 = JSON.parse(e2.data);
      } catch (e3) {
      }
      if (t2) {
        let n2, r2 = false;
        for (const o2 of this._channels) o2.owns(e2.source, e2.origin, t2) && (n2 = o2, r2 = o2.onMessage(t2) || r2);
        n2 && !r2 && (window.console && console.error(`No handler found on any channel for message: ${JSON.stringify(t2)}`), t2.instanceId && n2.error(t2, new Error(`The registered object ${t2.instanceId} could not be found.`)));
      }
    };
  }();
  var a = window;
  var h;
  a._AzureDevOpsSDKVersion && console.error("The AzureDevOps SDK is already loaded. Only one version of this module can be loaded in a given document."), a._AzureDevOpsSDKVersion = 4, (function(e2) {
    e2[e2.Unknown = 0] = "Unknown", e2[e2.Deployment = 1] = "Deployment", e2[e2.Enterprise = 2] = "Enterprise", e2[e2.Organization = 4] = "Organization";
  })(h || (h = {}));
  var d = "DevOps.HostControl";
  var u = s.addChannel(window.parent);
  var l;
  var f;
  var g;
  var p;
  var m;
  var y;
  var _;
  var v;
  var w;
  var b;
  var O = new Promise(((e2) => {
    b = e2;
  }));
  function k(e2, t2) {
    const n2 = window;
    let r2;
    "function" == typeof n2.CustomEvent ? r2 = new n2.CustomEvent(e2, t2) : (t2 = t2 || { bubbles: false, cancelable: false }, r2 = document.createEvent("CustomEvent"), r2.initCustomEvent(e2, t2.bubbles, t2.cancelable, t2.detail)), window.dispatchEvent(r2);
  }
  function x(e2) {
    return new Promise(((t2) => {
      const n2 = { ...e2, sdkVersion: 4 };
      u.invokeRemoteMethod("initialHandshake", d, [n2]).then(((e3) => {
        const n3 = e3.context;
        g = n3.pageContext, f = g ? g.webContext : void 0, l = f ? f.team : void 0, m = e3.initialConfig || {}, y = e3.contributionId, p = n3.extension, _ = n3.user, v = n3.host, e3.themeData && (J(e3.themeData), window.addEventListener("themeChanged", ((e4) => {
          J(e4.detail.data);
        }))), b(), t2();
      }));
    }));
  }
  async function j() {
    return O;
  }
  function I(e2) {
    return `Attempted to call ${e2}() before init() was complete. Wait for init to complete or place within a ready() callback.`;
  }
  function C() {
    if (!y) throw new Error(I("getContributionId"));
    return y;
  }
  async function F(e2) {
    return j().then((() => u.invokeRemoteMethod("getService", "DevOps.ServiceManager", [e2])));
  }
  function N(e2, t2) {
    u.getObjectRegistry().register(e2, t2);
  }
  function J(e2) {
    w || (w = document.createElement("style"), w.type = "text/css", document.head.appendChild(w));
    const t2 = [];
    if (e2) for (const n2 in e2) t2.push("--" + n2 + ": " + e2[n2]);
    w.innerText = ":root { " + t2.join("; ") + " } body { color: var(--text-primary-color) }", k("themeApplied", { detail: e2 });
  }
  u.getObjectRegistry().register("DevOps.SdkClient", { dispatchEvent: k });

  // node_modules/azure-devops-extension-api/esm/WorkItemTracking/WorkItemTracking.js
  var ClassificationNodesErrorPolicy;
  (function(ClassificationNodesErrorPolicy2) {
    ClassificationNodesErrorPolicy2[ClassificationNodesErrorPolicy2["Fail"] = 1] = "Fail";
    ClassificationNodesErrorPolicy2[ClassificationNodesErrorPolicy2["Omit"] = 2] = "Omit";
  })(ClassificationNodesErrorPolicy || (ClassificationNodesErrorPolicy = {}));
  var CommentExpandOptions;
  (function(CommentExpandOptions2) {
    CommentExpandOptions2[CommentExpandOptions2["None"] = 0] = "None";
    CommentExpandOptions2[CommentExpandOptions2["Reactions"] = 1] = "Reactions";
    CommentExpandOptions2[CommentExpandOptions2["RenderedText"] = 8] = "RenderedText";
    CommentExpandOptions2[CommentExpandOptions2["RenderedTextOnly"] = 16] = "RenderedTextOnly";
    CommentExpandOptions2[CommentExpandOptions2["All"] = -17] = "All";
  })(CommentExpandOptions || (CommentExpandOptions = {}));
  var CommentFormat;
  (function(CommentFormat2) {
    CommentFormat2[CommentFormat2["Markdown"] = 0] = "Markdown";
    CommentFormat2[CommentFormat2["Html"] = 1] = "Html";
  })(CommentFormat || (CommentFormat = {}));
  var CommentReactionType;
  (function(CommentReactionType2) {
    CommentReactionType2[CommentReactionType2["Like"] = 0] = "Like";
    CommentReactionType2[CommentReactionType2["Dislike"] = 1] = "Dislike";
    CommentReactionType2[CommentReactionType2["Heart"] = 2] = "Heart";
    CommentReactionType2[CommentReactionType2["Hooray"] = 3] = "Hooray";
    CommentReactionType2[CommentReactionType2["Smile"] = 4] = "Smile";
    CommentReactionType2[CommentReactionType2["Confused"] = 5] = "Confused";
  })(CommentReactionType || (CommentReactionType = {}));
  var CommentSortOrder;
  (function(CommentSortOrder2) {
    CommentSortOrder2[CommentSortOrder2["Asc"] = 1] = "Asc";
    CommentSortOrder2[CommentSortOrder2["Desc"] = 2] = "Desc";
  })(CommentSortOrder || (CommentSortOrder = {}));
  var FieldType;
  (function(FieldType2) {
    FieldType2[FieldType2["String"] = 0] = "String";
    FieldType2[FieldType2["Integer"] = 1] = "Integer";
    FieldType2[FieldType2["DateTime"] = 2] = "DateTime";
    FieldType2[FieldType2["PlainText"] = 3] = "PlainText";
    FieldType2[FieldType2["Html"] = 4] = "Html";
    FieldType2[FieldType2["TreePath"] = 5] = "TreePath";
    FieldType2[FieldType2["History"] = 6] = "History";
    FieldType2[FieldType2["Double"] = 7] = "Double";
    FieldType2[FieldType2["Guid"] = 8] = "Guid";
    FieldType2[FieldType2["Boolean"] = 9] = "Boolean";
    FieldType2[FieldType2["Identity"] = 10] = "Identity";
    FieldType2[FieldType2["PicklistString"] = 11] = "PicklistString";
    FieldType2[FieldType2["PicklistInteger"] = 12] = "PicklistInteger";
    FieldType2[FieldType2["PicklistDouble"] = 13] = "PicklistDouble";
  })(FieldType || (FieldType = {}));
  var FieldUsage;
  (function(FieldUsage2) {
    FieldUsage2[FieldUsage2["None"] = 0] = "None";
    FieldUsage2[FieldUsage2["WorkItem"] = 1] = "WorkItem";
    FieldUsage2[FieldUsage2["WorkItemLink"] = 2] = "WorkItemLink";
    FieldUsage2[FieldUsage2["Tree"] = 3] = "Tree";
    FieldUsage2[FieldUsage2["WorkItemTypeExtension"] = 4] = "WorkItemTypeExtension";
  })(FieldUsage || (FieldUsage = {}));
  var GetFieldsExpand;
  (function(GetFieldsExpand2) {
    GetFieldsExpand2[GetFieldsExpand2["None"] = 0] = "None";
    GetFieldsExpand2[GetFieldsExpand2["ExtensionFields"] = 1] = "ExtensionFields";
    GetFieldsExpand2[GetFieldsExpand2["IncludeDeleted"] = 2] = "IncludeDeleted";
  })(GetFieldsExpand || (GetFieldsExpand = {}));
  var LargeTextCustomHtmlFormat;
  (function(LargeTextCustomHtmlFormat2) {
    LargeTextCustomHtmlFormat2[LargeTextCustomHtmlFormat2["Markdown"] = 0] = "Markdown";
    LargeTextCustomHtmlFormat2[LargeTextCustomHtmlFormat2["Html"] = 1] = "Html";
  })(LargeTextCustomHtmlFormat || (LargeTextCustomHtmlFormat = {}));
  var LinkQueryMode;
  (function(LinkQueryMode2) {
    LinkQueryMode2[LinkQueryMode2["WorkItems"] = 0] = "WorkItems";
    LinkQueryMode2[LinkQueryMode2["LinksOneHopMustContain"] = 1] = "LinksOneHopMustContain";
    LinkQueryMode2[LinkQueryMode2["LinksOneHopMayContain"] = 2] = "LinksOneHopMayContain";
    LinkQueryMode2[LinkQueryMode2["LinksOneHopDoesNotContain"] = 3] = "LinksOneHopDoesNotContain";
    LinkQueryMode2[LinkQueryMode2["LinksRecursiveMustContain"] = 4] = "LinksRecursiveMustContain";
    LinkQueryMode2[LinkQueryMode2["LinksRecursiveMayContain"] = 5] = "LinksRecursiveMayContain";
    LinkQueryMode2[LinkQueryMode2["LinksRecursiveDoesNotContain"] = 6] = "LinksRecursiveDoesNotContain";
  })(LinkQueryMode || (LinkQueryMode = {}));
  var LogicalOperation;
  (function(LogicalOperation2) {
    LogicalOperation2[LogicalOperation2["NONE"] = 0] = "NONE";
    LogicalOperation2[LogicalOperation2["AND"] = 1] = "AND";
    LogicalOperation2[LogicalOperation2["OR"] = 2] = "OR";
  })(LogicalOperation || (LogicalOperation = {}));
  var ProvisioningActionType;
  (function(ProvisioningActionType2) {
    ProvisioningActionType2[ProvisioningActionType2["Import"] = 0] = "Import";
    ProvisioningActionType2[ProvisioningActionType2["Validate"] = 1] = "Validate";
  })(ProvisioningActionType || (ProvisioningActionType = {}));
  var QueryErrorPolicy;
  (function(QueryErrorPolicy2) {
    QueryErrorPolicy2[QueryErrorPolicy2["Fail"] = 1] = "Fail";
    QueryErrorPolicy2[QueryErrorPolicy2["Omit"] = 2] = "Omit";
  })(QueryErrorPolicy || (QueryErrorPolicy = {}));
  var QueryExpand;
  (function(QueryExpand2) {
    QueryExpand2[QueryExpand2["None"] = 0] = "None";
    QueryExpand2[QueryExpand2["Wiql"] = 1] = "Wiql";
    QueryExpand2[QueryExpand2["Clauses"] = 2] = "Clauses";
    QueryExpand2[QueryExpand2["All"] = 3] = "All";
    QueryExpand2[QueryExpand2["Minimal"] = 4] = "Minimal";
  })(QueryExpand || (QueryExpand = {}));
  var QueryOption;
  (function(QueryOption2) {
    QueryOption2[QueryOption2["Doing"] = 1] = "Doing";
    QueryOption2[QueryOption2["Done"] = 2] = "Done";
    QueryOption2[QueryOption2["Followed"] = 3] = "Followed";
  })(QueryOption || (QueryOption = {}));
  var QueryRecursionOption;
  (function(QueryRecursionOption2) {
    QueryRecursionOption2[QueryRecursionOption2["ParentFirst"] = 0] = "ParentFirst";
    QueryRecursionOption2[QueryRecursionOption2["ChildFirst"] = 1] = "ChildFirst";
  })(QueryRecursionOption || (QueryRecursionOption = {}));
  var QueryResultType;
  (function(QueryResultType2) {
    QueryResultType2[QueryResultType2["WorkItem"] = 1] = "WorkItem";
    QueryResultType2[QueryResultType2["WorkItemLink"] = 2] = "WorkItemLink";
  })(QueryResultType || (QueryResultType = {}));
  var QueryType;
  (function(QueryType2) {
    QueryType2[QueryType2["Flat"] = 1] = "Flat";
    QueryType2[QueryType2["Tree"] = 2] = "Tree";
    QueryType2[QueryType2["OneHop"] = 3] = "OneHop";
  })(QueryType || (QueryType = {}));
  var ReportingRevisionsExpand;
  (function(ReportingRevisionsExpand2) {
    ReportingRevisionsExpand2[ReportingRevisionsExpand2["None"] = 0] = "None";
    ReportingRevisionsExpand2[ReportingRevisionsExpand2["Fields"] = 1] = "Fields";
  })(ReportingRevisionsExpand || (ReportingRevisionsExpand = {}));
  var TemplateType;
  (function(TemplateType2) {
    TemplateType2[TemplateType2["WorkItemType"] = 0] = "WorkItemType";
    TemplateType2[TemplateType2["GlobalWorkflow"] = 1] = "GlobalWorkflow";
  })(TemplateType || (TemplateType = {}));
  var TreeNodeStructureType;
  (function(TreeNodeStructureType2) {
    TreeNodeStructureType2[TreeNodeStructureType2["Area"] = 0] = "Area";
    TreeNodeStructureType2[TreeNodeStructureType2["Iteration"] = 1] = "Iteration";
  })(TreeNodeStructureType || (TreeNodeStructureType = {}));
  var TreeStructureGroup;
  (function(TreeStructureGroup2) {
    TreeStructureGroup2[TreeStructureGroup2["Areas"] = 0] = "Areas";
    TreeStructureGroup2[TreeStructureGroup2["Iterations"] = 1] = "Iterations";
  })(TreeStructureGroup || (TreeStructureGroup = {}));
  var WorkItemErrorPolicy;
  (function(WorkItemErrorPolicy2) {
    WorkItemErrorPolicy2[WorkItemErrorPolicy2["Fail"] = 1] = "Fail";
    WorkItemErrorPolicy2[WorkItemErrorPolicy2["Omit"] = 2] = "Omit";
  })(WorkItemErrorPolicy || (WorkItemErrorPolicy = {}));
  var WorkItemExpand;
  (function(WorkItemExpand2) {
    WorkItemExpand2[WorkItemExpand2["None"] = 0] = "None";
    WorkItemExpand2[WorkItemExpand2["Relations"] = 1] = "Relations";
    WorkItemExpand2[WorkItemExpand2["Fields"] = 2] = "Fields";
    WorkItemExpand2[WorkItemExpand2["Links"] = 3] = "Links";
    WorkItemExpand2[WorkItemExpand2["All"] = 4] = "All";
  })(WorkItemExpand || (WorkItemExpand = {}));
  var WorkItemRecentActivityType;
  (function(WorkItemRecentActivityType2) {
    WorkItemRecentActivityType2[WorkItemRecentActivityType2["Visited"] = 0] = "Visited";
    WorkItemRecentActivityType2[WorkItemRecentActivityType2["Edited"] = 1] = "Edited";
    WorkItemRecentActivityType2[WorkItemRecentActivityType2["Deleted"] = 2] = "Deleted";
    WorkItemRecentActivityType2[WorkItemRecentActivityType2["Restored"] = 3] = "Restored";
  })(WorkItemRecentActivityType || (WorkItemRecentActivityType = {}));
  var WorkItemTypeFieldsExpandLevel;
  (function(WorkItemTypeFieldsExpandLevel2) {
    WorkItemTypeFieldsExpandLevel2[WorkItemTypeFieldsExpandLevel2["None"] = 0] = "None";
    WorkItemTypeFieldsExpandLevel2[WorkItemTypeFieldsExpandLevel2["AllowedValues"] = 1] = "AllowedValues";
    WorkItemTypeFieldsExpandLevel2[WorkItemTypeFieldsExpandLevel2["DependentFields"] = 2] = "DependentFields";
    WorkItemTypeFieldsExpandLevel2[WorkItemTypeFieldsExpandLevel2["All"] = 3] = "All";
  })(WorkItemTypeFieldsExpandLevel || (WorkItemTypeFieldsExpandLevel = {}));

  // node_modules/whatwg-fetch/fetch.js
  var support = {
    searchParams: "URLSearchParams" in self,
    iterable: "Symbol" in self && "iterator" in Symbol,
    blob: "FileReader" in self && "Blob" in self && (function() {
      try {
        new Blob();
        return true;
      } catch (e2) {
        return false;
      }
    })(),
    formData: "FormData" in self,
    arrayBuffer: "ArrayBuffer" in self
  };
  function isDataView(obj) {
    return obj && DataView.prototype.isPrototypeOf(obj);
  }
  if (support.arrayBuffer) {
    viewClasses = [
      "[object Int8Array]",
      "[object Uint8Array]",
      "[object Uint8ClampedArray]",
      "[object Int16Array]",
      "[object Uint16Array]",
      "[object Int32Array]",
      "[object Uint32Array]",
      "[object Float32Array]",
      "[object Float64Array]"
    ];
    isArrayBufferView = ArrayBuffer.isView || function(obj) {
      return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1;
    };
  }
  var viewClasses;
  var isArrayBufferView;
  function normalizeName(name) {
    if (typeof name !== "string") {
      name = String(name);
    }
    if (/[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(name) || name === "") {
      throw new TypeError("Invalid character in header field name");
    }
    return name.toLowerCase();
  }
  function normalizeValue(value) {
    if (typeof value !== "string") {
      value = String(value);
    }
    return value;
  }
  function iteratorFor(items) {
    var iterator = {
      next: function() {
        var value = items.shift();
        return { done: value === void 0, value };
      }
    };
    if (support.iterable) {
      iterator[Symbol.iterator] = function() {
        return iterator;
      };
    }
    return iterator;
  }
  function Headers2(headers) {
    this.map = {};
    if (headers instanceof Headers2) {
      headers.forEach(function(value, name) {
        this.append(name, value);
      }, this);
    } else if (Array.isArray(headers)) {
      headers.forEach(function(header) {
        this.append(header[0], header[1]);
      }, this);
    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function(name) {
        this.append(name, headers[name]);
      }, this);
    }
  }
  Headers2.prototype.append = function(name, value) {
    name = normalizeName(name);
    value = normalizeValue(value);
    var oldValue = this.map[name];
    this.map[name] = oldValue ? oldValue + ", " + value : value;
  };
  Headers2.prototype["delete"] = function(name) {
    delete this.map[normalizeName(name)];
  };
  Headers2.prototype.get = function(name) {
    name = normalizeName(name);
    return this.has(name) ? this.map[name] : null;
  };
  Headers2.prototype.has = function(name) {
    return this.map.hasOwnProperty(normalizeName(name));
  };
  Headers2.prototype.set = function(name, value) {
    this.map[normalizeName(name)] = normalizeValue(value);
  };
  Headers2.prototype.forEach = function(callback, thisArg) {
    for (var name in this.map) {
      if (this.map.hasOwnProperty(name)) {
        callback.call(thisArg, this.map[name], name, this);
      }
    }
  };
  Headers2.prototype.keys = function() {
    var items = [];
    this.forEach(function(value, name) {
      items.push(name);
    });
    return iteratorFor(items);
  };
  Headers2.prototype.values = function() {
    var items = [];
    this.forEach(function(value) {
      items.push(value);
    });
    return iteratorFor(items);
  };
  Headers2.prototype.entries = function() {
    var items = [];
    this.forEach(function(value, name) {
      items.push([name, value]);
    });
    return iteratorFor(items);
  };
  if (support.iterable) {
    Headers2.prototype[Symbol.iterator] = Headers2.prototype.entries;
  }
  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError("Already read"));
    }
    body.bodyUsed = true;
  }
  function fileReaderReady(reader) {
    return new Promise(function(resolve, reject) {
      reader.onload = function() {
        resolve(reader.result);
      };
      reader.onerror = function() {
        reject(reader.error);
      };
    });
  }
  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader();
    var promise = fileReaderReady(reader);
    reader.readAsArrayBuffer(blob);
    return promise;
  }
  function readBlobAsText(blob) {
    var reader = new FileReader();
    var promise = fileReaderReady(reader);
    reader.readAsText(blob);
    return promise;
  }
  function readArrayBufferAsText(buf) {
    var view = new Uint8Array(buf);
    var chars = new Array(view.length);
    for (var i2 = 0; i2 < view.length; i2++) {
      chars[i2] = String.fromCharCode(view[i2]);
    }
    return chars.join("");
  }
  function bufferClone(buf) {
    if (buf.slice) {
      return buf.slice(0);
    } else {
      var view = new Uint8Array(buf.byteLength);
      view.set(new Uint8Array(buf));
      return view.buffer;
    }
  }
  function Body() {
    this.bodyUsed = false;
    this._initBody = function(body) {
      this.bodyUsed = this.bodyUsed;
      this._bodyInit = body;
      if (!body) {
        this._bodyText = "";
      } else if (typeof body === "string") {
        this._bodyText = body;
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body;
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body;
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this._bodyText = body.toString();
      } else if (support.arrayBuffer && support.blob && isDataView(body)) {
        this._bodyArrayBuffer = bufferClone(body.buffer);
        this._bodyInit = new Blob([this._bodyArrayBuffer]);
      } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
        this._bodyArrayBuffer = bufferClone(body);
      } else {
        this._bodyText = body = Object.prototype.toString.call(body);
      }
      if (!this.headers.get("content-type")) {
        if (typeof body === "string") {
          this.headers.set("content-type", "text/plain;charset=UTF-8");
        } else if (this._bodyBlob && this._bodyBlob.type) {
          this.headers.set("content-type", this._bodyBlob.type);
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
          this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8");
        }
      }
    };
    if (support.blob) {
      this.blob = function() {
        var rejected = consumed(this);
        if (rejected) {
          return rejected;
        }
        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob);
        } else if (this._bodyArrayBuffer) {
          return Promise.resolve(new Blob([this._bodyArrayBuffer]));
        } else if (this._bodyFormData) {
          throw new Error("could not read FormData body as blob");
        } else {
          return Promise.resolve(new Blob([this._bodyText]));
        }
      };
      this.arrayBuffer = function() {
        if (this._bodyArrayBuffer) {
          return consumed(this) || Promise.resolve(this._bodyArrayBuffer);
        } else {
          return this.blob().then(readBlobAsArrayBuffer);
        }
      };
    }
    this.text = function() {
      var rejected = consumed(this);
      if (rejected) {
        return rejected;
      }
      if (this._bodyBlob) {
        return readBlobAsText(this._bodyBlob);
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer));
      } else if (this._bodyFormData) {
        throw new Error("could not read FormData body as text");
      } else {
        return Promise.resolve(this._bodyText);
      }
    };
    if (support.formData) {
      this.formData = function() {
        return this.text().then(decode);
      };
    }
    this.json = function() {
      return this.text().then(JSON.parse);
    };
    return this;
  }
  var methods = ["DELETE", "GET", "HEAD", "OPTIONS", "POST", "PUT"];
  function normalizeMethod(method) {
    var upcased = method.toUpperCase();
    return methods.indexOf(upcased) > -1 ? upcased : method;
  }
  function Request(input, options) {
    options = options || {};
    var body = options.body;
    if (input instanceof Request) {
      if (input.bodyUsed) {
        throw new TypeError("Already read");
      }
      this.url = input.url;
      this.credentials = input.credentials;
      if (!options.headers) {
        this.headers = new Headers2(input.headers);
      }
      this.method = input.method;
      this.mode = input.mode;
      this.signal = input.signal;
      if (!body && input._bodyInit != null) {
        body = input._bodyInit;
        input.bodyUsed = true;
      }
    } else {
      this.url = String(input);
    }
    this.credentials = options.credentials || this.credentials || "same-origin";
    if (options.headers || !this.headers) {
      this.headers = new Headers2(options.headers);
    }
    this.method = normalizeMethod(options.method || this.method || "GET");
    this.mode = options.mode || this.mode || null;
    this.signal = options.signal || this.signal;
    this.referrer = null;
    if ((this.method === "GET" || this.method === "HEAD") && body) {
      throw new TypeError("Body not allowed for GET or HEAD requests");
    }
    this._initBody(body);
  }
  Request.prototype.clone = function() {
    return new Request(this, { body: this._bodyInit });
  };
  function decode(body) {
    var form = new FormData();
    body.trim().split("&").forEach(function(bytes) {
      if (bytes) {
        var split = bytes.split("=");
        var name = split.shift().replace(/\+/g, " ");
        var value = split.join("=").replace(/\+/g, " ");
        form.append(decodeURIComponent(name), decodeURIComponent(value));
      }
    });
    return form;
  }
  function parseHeaders(rawHeaders) {
    var headers = new Headers2();
    var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, " ");
    preProcessedHeaders.split(/\r?\n/).forEach(function(line) {
      var parts = line.split(":");
      var key = parts.shift().trim();
      if (key) {
        var value = parts.join(":").trim();
        headers.append(key, value);
      }
    });
    return headers;
  }
  Body.call(Request.prototype);
  function Response(bodyInit, options) {
    if (!options) {
      options = {};
    }
    this.type = "default";
    this.status = options.status === void 0 ? 200 : options.status;
    this.ok = this.status >= 200 && this.status < 300;
    this.statusText = "statusText" in options ? options.statusText : "";
    this.headers = new Headers2(options.headers);
    this.url = options.url || "";
    this._initBody(bodyInit);
  }
  Body.call(Response.prototype);
  Response.prototype.clone = function() {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers2(this.headers),
      url: this.url
    });
  };
  Response.error = function() {
    var response = new Response(null, { status: 0, statusText: "" });
    response.type = "error";
    return response;
  };
  var redirectStatuses = [301, 302, 303, 307, 308];
  Response.redirect = function(url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError("Invalid status code");
    }
    return new Response(null, { status, headers: { location: url } });
  };
  var DOMException = self.DOMException;
  try {
    new DOMException();
  } catch (err) {
    DOMException = function(message, name) {
      this.message = message;
      this.name = name;
      var error = Error(message);
      this.stack = error.stack;
    };
    DOMException.prototype = Object.create(Error.prototype);
    DOMException.prototype.constructor = DOMException;
  }
  function fetch2(input, init) {
    return new Promise(function(resolve, reject) {
      var request = new Request(input, init);
      if (request.signal && request.signal.aborted) {
        return reject(new DOMException("Aborted", "AbortError"));
      }
      var xhr = new XMLHttpRequest();
      function abortXhr() {
        xhr.abort();
      }
      xhr.onload = function() {
        var options = {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: parseHeaders(xhr.getAllResponseHeaders() || "")
        };
        options.url = "responseURL" in xhr ? xhr.responseURL : options.headers.get("X-Request-URL");
        var body = "response" in xhr ? xhr.response : xhr.responseText;
        setTimeout(function() {
          resolve(new Response(body, options));
        }, 0);
      };
      xhr.onerror = function() {
        setTimeout(function() {
          reject(new TypeError("Network request failed"));
        }, 0);
      };
      xhr.ontimeout = function() {
        setTimeout(function() {
          reject(new TypeError("Network request failed"));
        }, 0);
      };
      xhr.onabort = function() {
        setTimeout(function() {
          reject(new DOMException("Aborted", "AbortError"));
        }, 0);
      };
      function fixUrl(url) {
        try {
          return url === "" && self.location.href ? self.location.href : url;
        } catch (e2) {
          return url;
        }
      }
      xhr.open(request.method, fixUrl(request.url), true);
      if (request.credentials === "include") {
        xhr.withCredentials = true;
      } else if (request.credentials === "omit") {
        xhr.withCredentials = false;
      }
      if ("responseType" in xhr) {
        if (support.blob) {
          xhr.responseType = "blob";
        } else if (support.arrayBuffer && request.headers.get("Content-Type") && request.headers.get("Content-Type").indexOf("application/octet-stream") !== -1) {
          xhr.responseType = "arraybuffer";
        }
      }
      request.headers.forEach(function(value, name) {
        xhr.setRequestHeader(name, value);
      });
      if (request.signal) {
        request.signal.addEventListener("abort", abortXhr);
        xhr.onreadystatechange = function() {
          if (xhr.readyState === 4) {
            request.signal.removeEventListener("abort", abortXhr);
          }
        };
      }
      xhr.send(typeof request._bodyInit === "undefined" ? null : request._bodyInit);
    });
  }
  fetch2.polyfill = true;
  if (!self.fetch) {
    self.fetch = fetch2;
    self.Headers = Headers2;
    self.Request = Request;
    self.Response = Response;
  }

  // node_modules/azure-devops-extension-api/esm/Common/Fetch.js
  async function issueRequest(requestUrl, options, vssRequestOptions) {
    let response = void 0;
    if (!options) {
      options = {};
    }
    let headers;
    if (options.headers) {
      if (options.headers instanceof Headers) {
        headers = options.headers;
      } else {
        headers = new Headers();
        if (typeof options.headers.hasOwnProperty === "function") {
          for (const key in options.headers) {
            if (options.headers.hasOwnProperty(key)) {
              headers.append(key, options.headers[key]);
            }
          }
        }
      }
    } else {
      headers = new Headers();
    }
    options.headers = headers;
    headers.append("X-VSS-ReauthenticationAction", "Suppress");
    if (vssRequestOptions) {
      const sessionId = vssRequestOptions.sessionId;
      const command = vssRequestOptions.command;
      if (sessionId) {
        if (command) {
          headers.append("X-TFS-Session", sessionId + "," + command);
        } else {
          headers.append("X-TFS-Session", sessionId);
        }
      }
    }
    options.credentials = "same-origin";
    let refreshToken = false;
    let retried = false;
    while (true) {
      if (vssRequestOptions && vssRequestOptions.authTokenProvider) {
        const authHeader = await vssRequestOptions.authTokenProvider.getAuthorizationHeader(refreshToken);
        if (authHeader) {
          headers.set("Authorization", authHeader);
        }
        headers.set("X-TFS-FedAuthRedirect", "Suppress");
      }
      try {
        response = await fetch(requestUrl, options);
      } catch (ex) {
        console.warn(`Unhandled exception in fetch for ${requestUrl}: ${ex && ex.toString()}`);
        const error = new Error("TF400893: Unable to contact the server. Please check your network connection and try again.");
        error.name = "NetworkException";
        throw error;
      }
      if (response.status === 401 && !retried && vssRequestOptions && vssRequestOptions.authTokenProvider) {
        retried = true;
        refreshToken = true;
        continue;
      }
      break;
    }
    if (!response.ok) {
      const error = new Error();
      error.name = "TFS.WebApi.Exception";
      error.status = response.status;
      error.responseText = await response.text();
      if (error.responseText && error.responseText !== "") {
        try {
          error.serverError = JSON.parse(error.responseText);
          if (error.serverError && error.serverError.message) {
            error.message = error.serverError.message;
          }
        } catch (exception) {
        }
      }
      if (!error.message) {
        error.message = response.status + ": " + response.statusText;
      }
      throw error;
    }
    return response;
  }

  // node_modules/azure-devops-extension-api/esm/Common/Util/Serialization.js
  var msAjaxDateRegEx = new RegExp('(^|[^\\\\])\\"\\\\/Date\\((-?[0-9]+)(?:[a-zA-Z]|(?:\\+|-)[0-9]{4})?\\)\\\\/\\"', "g");
  function deserializeVssJsonObject(text) {
    function replaceMsJsonDates(object, parentObject, parentObjectKey) {
      if (parentObject && typeof object.__msjson_date__ === "number") {
        parentObject[parentObjectKey] = new Date(object.__msjson_date__);
        return;
      }
      for (let key in object) {
        const value = object[key];
        if (value !== null && typeof value === "object") {
          replaceMsJsonDates(object[key], object, key);
        }
      }
    }
    let deserializedData = null;
    if (text) {
      const replacedText = text.replace(msAjaxDateRegEx, '$1{"__msjson_date__":$2 }');
      deserializedData = JSON.parse(replacedText);
      if (replacedText !== text) {
        replaceMsJsonDates(deserializedData, null, "");
      }
    }
    return deserializedData;
  }

  // node_modules/azure-devops-extension-api/esm/Common/Util/Url.js
  var KeyCodes;
  (function(KeyCodes2) {
    KeyCodes2[KeyCodes2["asterisk"] = 42] = "asterisk";
    KeyCodes2[KeyCodes2["endCurlyBrace"] = 125] = "endCurlyBrace";
    KeyCodes2[KeyCodes2["startCurlyBrace"] = 123] = "startCurlyBrace";
  })(KeyCodes || (KeyCodes = {}));
  function prepareForComparison(value, upperCase) {
    return value ? upperCase ? value.toLocaleUpperCase() : value : "";
  }
  function stringEquals(str1, str2, ignoreCase) {
    if (str1 === str2) {
      return true;
    }
    return prepareForComparison(str1, ignoreCase).localeCompare(prepareForComparison(str2, ignoreCase)) === 0;
  }
  var Uri = class {
    /**
    * Create a new Uri.
    *
    * @param uri Optional uri string to populate values with
    * @param options Options for parsing the uri string
    */
    constructor(uri, options) {
      this.scheme = "";
      this.noSchemeSeparator = false;
      this.host = "";
      this.port = 0;
      this.path = "";
      this.queryParameters = [];
      this.hashString = "";
      if (uri) {
        this._setFromUriString(uri, options);
      }
    }
    _setFromUriString(uriString, options) {
      let uri = uriString;
      let hashSplit = this._singleSplit(uri, "#");
      if (hashSplit) {
        uri = hashSplit.part1;
        this.hashString = this._decodeUriComponent(hashSplit.part2);
      } else {
        this.hashString = "";
      }
      let querySplit = this._singleSplit(uri, "?");
      if (querySplit) {
        uri = querySplit.part1;
        this.queryString = querySplit.part2;
      } else {
        this.queryParameters = [];
      }
      this.scheme = "";
      this.host = "";
      this.port = 0;
      this.path = "";
      this.noSchemeSeparator = false;
      const schemeSplit = this._singleSplit(uri, ":");
      if (schemeSplit) {
        this.scheme = schemeSplit.part1;
        uri = schemeSplit.part2;
        if (uri.substr(0, 2) === "//") {
          uri = uri.substr(2);
          const pathSplit = this._singleSplit(uri, "/");
          if (pathSplit) {
            uri = pathSplit.part1;
            this.path = pathSplit.part2;
          } else {
            this.path = "";
          }
          const portSplit = this._singleSplit(uri, ":");
          if (portSplit) {
            this.host = portSplit.part1;
            this.port = parseInt(portSplit.part2);
            if (isNaN(this.port)) {
              this.host += ":";
              this.path = portSplit.part2 + "/" + this.path;
            }
          } else {
            this.host = uri;
          }
        } else {
          this.noSchemeSeparator = true;
          this.path = uri;
        }
      } else {
        this.path = uri;
      }
      if (options && options.absoluteUriRequired && !this.scheme) {
        throw new Error(`The uri string "${uriString}" does not represent a valid absolute uri.`);
      }
    }
    _singleSplit(value, separator) {
      const matchIndex = value.indexOf(separator);
      if (matchIndex >= 0) {
        return {
          part1: value.substr(0, matchIndex),
          part2: value.substr(matchIndex + 1)
        };
      } else {
        return void 0;
      }
    }
    _decodeUriComponent(value) {
      if (value) {
        value = value.replace(/\+/g, "%20");
        value = decodeURIComponent(value);
      }
      return value;
    }
    /**
    * Get the absolute uri string for this Uri
    */
    get absoluteUri() {
      let uri = "";
      if (this.scheme) {
        uri = encodeURI(decodeURI(this.scheme)) + ":";
        if (!this.noSchemeSeparator) {
          uri += "//";
        }
      }
      if (this.host) {
        uri += encodeURI(decodeURI(this.host));
        if (this.port) {
          uri += ":" + this.port;
        }
        if (!this.noSchemeSeparator || this.path) {
          uri += "/";
        }
      }
      if (this.path) {
        let encodedPath;
        if (this.noSchemeSeparator) {
          encodedPath = encodeURI(decodeURI(this.path));
        } else {
          const parts = this.path.split("/");
          encodedPath = parts.map((p2) => encodeURIComponent(decodeURIComponent(p2))).join("/");
        }
        if (this.host) {
          uri = combineUrlPaths(uri, encodedPath);
        } else {
          uri = uri + encodedPath;
        }
      }
      const queryString = this.queryString;
      if (queryString) {
        uri += "?" + queryString;
      }
      if (this.hashString) {
        const params = this._splitStringIntoParams(this.hashString);
        const encodedString = this._getParamsAsString(params);
        uri += "#" + encodedString;
      }
      return uri;
    }
    /**
    * Set the absolute uri string for this Uri. Replaces all existing values
    */
    set absoluteUri(uri) {
      this._setFromUriString(uri || "");
    }
    /**
     * Gets the effective port number, returning the default port number if omitted for the given scheme.
     */
    getEffectivePort() {
      if (this.port) {
        return this.port;
      } else {
        if (stringEquals(this.scheme, "http", true)) {
          return 80;
        } else if (stringEquals(this.scheme, "https", true)) {
          return 443;
        } else {
          return 0;
        }
      }
    }
    /**
     * Builds an encoded key/value pair string
     * like query string or hash strings
     */
    _getParamsAsString(params) {
      if (params && params.length) {
        return params.map((param) => {
          if (param.value !== null) {
            return encodeURIComponent(param.name) + "=" + encodeURIComponent(param.value);
          } else {
            return encodeURIComponent(param.name);
          }
        }).join("&");
      } else {
        return "";
      }
    }
    /**
    * Get the query string for this Uri.
    */
    get queryString() {
      return this._getParamsAsString(this.queryParameters);
    }
    /**
    * Set the query string for this Uri. Replaces existing value
    */
    set queryString(queryString) {
      this.queryParameters = this._splitStringIntoParams(queryString);
    }
    /**
     * Coverts a key/value pair string into parameters array
     * @param paramString String such as a=b&c=d
     */
    _splitStringIntoParams(paramString) {
      let params = [];
      paramString.split("&").forEach((pair) => {
        if (pair) {
          const valueSplit = this._singleSplit(pair, "=");
          if (valueSplit) {
            params.push({
              name: this._decodeUriComponent(valueSplit.part1),
              value: this._decodeUriComponent(valueSplit.part2)
            });
          } else {
            params.push({
              name: this._decodeUriComponent(pair),
              value: null
            });
          }
        }
      });
      return params;
    }
    /**
    * Get the value of the query parameter with the given key
    *
    * @param name Query parameter name
    */
    getQueryParam(name) {
      let value;
      if (this.queryParameters) {
        let matchingPairs = this.queryParameters.filter((p2) => stringEquals(p2.name, name, true));
        if (matchingPairs.length > 0) {
          value = matchingPairs[0].value;
        }
      }
      return value;
    }
    /**
     * Adds a query string parameter to the current uri
     *
     * @param name The Query parameter name
     * @param value The Query parameter value
     * @param replaceExisting If true, replace all existing parameters with the same name
     */
    addQueryParam(name, value, replaceExisting) {
      if (replaceExisting) {
        this.removeQueryParam(name);
      }
      if (!this.queryParameters) {
        this.queryParameters = [];
      }
      this.queryParameters.push({ name, value });
    }
    /**
     * Adds query string parameters to the current uri
     *
     * @param parameters Query parameters to add
     * @param replaceExisting If true, replace all existing parameters with the same name
     * @param keyPrefix If specified, a value to prepend to all query parameter keys
     */
    addQueryParams(parameters, replaceExisting, keyPrefix) {
      for (const key in parameters) {
        const value = parameters[key];
        if (value !== null && value !== void 0) {
          const keyWithPrefix = (keyPrefix || "") + key;
          if (value instanceof Date) {
            this.addQueryParam(keyWithPrefix, value.toJSON(), replaceExisting);
          } else if (Array.isArray(value)) {
            value.forEach((v2) => this.addQueryParam(keyWithPrefix, "" + v2, replaceExisting));
          } else if (typeof value === "object") {
            this.addQueryParams(value, replaceExisting, keyWithPrefix + ".");
          } else {
            this.addQueryParam(keyWithPrefix, "" + value, replaceExisting);
          }
        }
      }
    }
    /**
     * Removes a query string parameter
     *
     * @param name The Query parameter name
     */
    removeQueryParam(name) {
      if (this.queryParameters) {
        this.queryParameters = this.queryParameters.filter((p2) => !stringEquals(p2.name, name, true));
      }
    }
  };
  function combineUrlPaths(...paths) {
    let segmentsToJoin = [];
    for (let i2 = 0, last = paths.length - 1; i2 <= last; i2++) {
      let path = paths[i2];
      if (path) {
        if (path === "/" && (i2 === 0 || i2 === last)) {
          segmentsToJoin.push("");
        } else {
          if (i2 > 0 && path[0] === "/") {
            path = path.substr(1);
          }
          if (i2 < last && path[path.length - 1] === "/") {
            path = path.substr(0, path.length - 1);
          }
          if (path) {
            segmentsToJoin.push(path);
          }
        }
      }
    }
    if (segmentsToJoin.length === 1 && segmentsToJoin[0] === "") {
      return "/";
    }
    return segmentsToJoin.join("/");
  }
  function parseRouteTemplate(routeTemplate) {
    const parsedRoute = {
      segments: []
    };
    let paramStartIndex = -1;
    let segmentStartIndex = -1;
    let segmentPrefix = "";
    for (let charIndex = 0, routeTemplateLen = routeTemplate.length; charIndex < routeTemplateLen; charIndex++) {
      let c = routeTemplate.charCodeAt(charIndex);
      if (paramStartIndex >= 0) {
        if (c === 125) {
          let paramName = routeTemplate.substring(paramStartIndex, charIndex);
          let isWildCardParam = false;
          if (paramName.charCodeAt(0) === 42) {
            paramName = paramName.substr(1);
            isWildCardParam = true;
          }
          parsedRoute.segments.push({
            paramName,
            isWildCardParam
          });
          paramStartIndex = -1;
        }
      } else {
        if (c === 123 && routeTemplate.charCodeAt(charIndex + 1) !== 123) {
          if (segmentPrefix || segmentStartIndex >= 0) {
            let segmentText = segmentPrefix;
            if (segmentStartIndex >= 0) {
              segmentText += routeTemplate.substring(segmentStartIndex, charIndex);
            }
            if (segmentText) {
              parsedRoute.segments.push({
                text: segmentText
              });
            }
            segmentStartIndex = -1;
            segmentPrefix = "";
          }
          paramStartIndex = charIndex + 1;
        } else {
          if (c === 123 && routeTemplate.charCodeAt(charIndex + 1) === 123 || c === 125 && routeTemplate.charCodeAt(charIndex + 1) === 125) {
            segmentPrefix = segmentPrefix + routeTemplate.substring(segmentStartIndex >= 0 ? segmentStartIndex : charIndex, charIndex + 1);
            segmentStartIndex = -1;
            charIndex++;
          }
          if (segmentStartIndex < 0) {
            segmentStartIndex = charIndex;
          }
        }
      }
    }
    if (segmentStartIndex >= 0 || paramStartIndex >= 0) {
      const segmentText = segmentPrefix + routeTemplate.substring(segmentStartIndex >= 0 ? segmentStartIndex : paramStartIndex);
      if (segmentText) {
        parsedRoute.segments.push({
          text: segmentText
        });
      }
    }
    let required = false;
    for (let i2 = parsedRoute.segments.length - 1; i2 >= 0; i2--) {
      let segment = parsedRoute.segments[i2];
      if (segment.text && segment.text !== "/") {
        required = true;
      } else if (required && segment.paramName) {
        segment.isRequiredParam = true;
      }
    }
    return parsedRoute;
  }
  function replaceParsedRouteValues(parsedRoute, routeValues, continueOnUnmatchedSegements) {
    let urlParts = [];
    let matchedParameters = {};
    let matchedParametersCount = 0;
    for (let segmentIndex = 0, l2 = parsedRoute.segments.length; segmentIndex < l2; segmentIndex++) {
      const segment = parsedRoute.segments[segmentIndex];
      if (segment.text) {
        let segmentText = segment.text;
        if (continueOnUnmatchedSegements) {
          if (segmentIndex > 0 && segmentText.charAt(0) === "/") {
            if (urlParts.length === 0) {
              segmentText = segmentText.substr(1);
            }
          }
        }
        if (segmentText) {
          urlParts.push(segmentText);
        }
      } else {
        const value = routeValues[segment.paramName];
        if (!value && value !== 0) {
          if (!continueOnUnmatchedSegements) {
            if (segment.isRequiredParam) {
              return void 0;
            } else {
              break;
            }
          } else if (urlParts.length) {
            let lastSegment = urlParts[urlParts.length - 1];
            if (lastSegment[lastSegment.length - 1] === "/") {
              urlParts[urlParts.length - 1] = lastSegment.substr(0, lastSegment.length - 1);
            }
          }
        } else {
          urlParts.push(segment.isWildCardParam ? encodeURI("" + value) : encodeURIComponent("" + value));
          matchedParameters[segment.paramName] = true;
          matchedParametersCount++;
        }
      }
    }
    return {
      url: urlParts.join(""),
      matchedParameters,
      matchedParametersCount
    };
  }
  function replaceRouteValues(routeTemplate, routeValues) {
    let parsedRoute = parseRouteTemplate(routeTemplate);
    return replaceParsedRouteValues(parsedRoute, routeValues, true).url;
  }

  // node_modules/azure-devops-extension-api/esm/Common/RestClientBase.js
  var RestClientBase = class {
    constructor(options) {
      this._options = options || {};
      if (typeof this._options.rootPath === "string") {
        this._rootPath = Promise.resolve(this._options.rootPath);
      } else {
        this._rootPath = this._options.rootPath || Promise.resolve("/");
      }
    }
    /**
    * Gets the root path of the Service
    *
    * @returns Promise for the resolving the root path of the service.
    */
    async getRootPath() {
      return this._rootPath;
    }
    /**
    * Issue a request to a VSS REST endpoint.
    *
    * @param requestParams request options
    * @returns Promise for the response
    */
    async beginRequest(requestParams) {
      return this._rootPath.then((rootPath) => {
        let requestUrl = rootPath + replaceRouteValues(requestParams.routeTemplate, requestParams.routeValues || {});
        if (requestParams.queryParams) {
          const uri = new Uri(requestUrl);
          uri.addQueryParams(requestParams.queryParams);
          requestUrl = uri.absoluteUri;
        }
        return this._issueRequest(requestUrl, requestParams.apiVersion, requestParams);
      });
    }
    /**
     * Issue a request to a VSS REST endpoint at the specified location
     *
     * @param requestUrl Resolved URL of the request
     * @param apiVersion API version
     * @param requestParams Optional request parameters
     */
    _issueRequest(requestUrl, apiVersion, requestParams) {
      let fetchOptions = {};
      fetchOptions.method = requestParams.method || "GET";
      fetchOptions.mode = "cors";
      if (!requestParams.isRawData && requestParams.body && fetchOptions.method.toUpperCase() !== "GET") {
        fetchOptions.body = JSON.stringify(requestParams.body);
      } else {
        fetchOptions.body = requestParams.body;
      }
      let acceptType = requestParams.httpResponseType || "application/json";
      let acceptHeaderValue = `${acceptType};api-version=${apiVersion};excludeUrls=true;enumsAsNumbers=true;msDateFormat=true;noArrayWrap=true`;
      fetchOptions.headers = Object.assign({
        "Accept": acceptHeaderValue,
        "Content-Type": requestParams.body && "application/json"
      }, requestParams.customHeaders);
      let vssRequestOptions = {
        authTokenProvider: this._options.authTokenProvider,
        sessionId: this._options.sessionId,
        command: requestParams.command || this._options.command
      };
      let result = issueRequest(requestUrl, fetchOptions, vssRequestOptions);
      return result.then((response) => {
        if (requestParams.returnRawResponse) {
          return response;
        } else if (acceptType.toLowerCase().indexOf("json") >= 0) {
          return response.text().then(deserializeVssJsonObject);
        } else if (acceptType.toLowerCase() === "text/plain") {
          return response.text();
        } else {
          return response.arrayBuffer();
        }
      });
    }
  };

  // node_modules/azure-devops-extension-api/esm/WorkItemTracking/WorkItemTrackingClient.js
  var WorkItemTrackingRestClient = class extends RestClientBase {
    constructor(options) {
      super(options);
    }
    /**
     * INTERNAL ONLY: USED BY ACCOUNT MY WORK PAGE. This returns Doing, Done, Follows and activity work items details.
     *
     * @param queryOption -
     */
    async getAccountMyWorkData(queryOption) {
      const queryValues = {
        "$queryOption": queryOption
      };
      return this.beginRequest({
        apiVersion: "5.0-preview.1",
        routeTemplate: "_apis/work/accountMyWork",
        queryParams: queryValues
      });
    }
    /**
     * Gets recent work item activities
     *
     */
    async getRecentActivityData() {
      return this.beginRequest({
        apiVersion: "5.0-preview.2",
        routeTemplate: "_apis/work/accountMyWorkRecentActivity"
      });
    }
    /**
     * INTERNAL ONLY: USED BY ACCOUNT MY WORK PAGE.
     *
     */
    async getRecentMentions() {
      return this.beginRequest({
        apiVersion: "5.0-preview.1",
        routeTemplate: "_apis/work/accountRecentMentions"
      });
    }
    /**
     * Get the list of work item tracking outbound artifact link types.
     *
     */
    async getWorkArtifactLinkTypes() {
      return this.beginRequest({
        apiVersion: "5.0-preview.1",
        routeTemplate: "_apis/wit/artifactLinkTypes"
      });
    }
    /**
     * Queries work items linked to a given list of artifact URI.
     *
     * @param artifactUriQuery - Defines a list of artifact URI for querying work items.
     * @param project - Project ID or project name
     */
    async queryWorkItemsForArtifactUris(artifactUriQuery, project) {
      return this.beginRequest({
        apiVersion: "5.0-preview.1",
        method: "POST",
        routeTemplate: "{project}/_apis/wit/artifactUriQuery",
        routeValues: {
          project
        },
        body: artifactUriQuery
      });
    }
    /**
     * Uploads an attachment.
     *
     * @param content - Content to upload
     * @param project - Project ID or project name
     * @param fileName - The name of the file
     * @param uploadType - Attachment upload type: Simple or Chunked
     * @param areaPath - Target project Area Path
     */
    async createAttachment(content, project, fileName, uploadType, areaPath) {
      const queryValues = {
        fileName,
        uploadType,
        areaPath
      };
      return this.beginRequest({
        apiVersion: "5.0-preview.3",
        method: "POST",
        routeTemplate: "{project}/_apis/wit/attachments/{id}",
        routeValues: {
          project
        },
        customHeaders: {
          "Content-Type": "application/octet-stream"
        },
        queryParams: queryValues,
        body: content,
        isRawData: true
      });
    }
    /**
     * Downloads an attachment.
     *
     * @param id - Attachment ID
     * @param project - Project ID or project name
     * @param fileName - Name of the file
     * @param download - If set to \<c\>true\</c\> always download attachment
     */
    async getAttachmentContent(id, project, fileName, download) {
      const queryValues = {
        fileName,
        download
      };
      return this.beginRequest({
        apiVersion: "5.0-preview.3",
        httpResponseType: "application/octet-stream",
        routeTemplate: "{project}/_apis/wit/attachments/{id}",
        routeValues: {
          project,
          id
        },
        queryParams: queryValues
      });
    }
    /**
     * Downloads an attachment.
     *
     * @param id - Attachment ID
     * @param project - Project ID or project name
     * @param fileName - Name of the file
     * @param download - If set to \<c\>true\</c\> always download attachment
     */
    async getAttachmentZip(id, project, fileName, download) {
      const queryValues = {
        fileName,
        download
      };
      return this.beginRequest({
        apiVersion: "5.0-preview.3",
        httpResponseType: "application/zip",
        routeTemplate: "{project}/_apis/wit/attachments/{id}",
        routeValues: {
          project,
          id
        },
        queryParams: queryValues
      });
    }
    /**
     * Gets root classification nodes or list of classification nodes for a given list of nodes ids, for a given project. In case ids parameter is supplied you will  get list of classification nodes for those ids. Otherwise you will get root classification nodes for this project.
     *
     * @param project - Project ID or project name
     * @param ids - Comma separated integer classification nodes ids. It's not required, if you want root nodes.
     * @param depth - Depth of children to fetch.
     * @param errorPolicy - Flag to handle errors in getting some nodes. Possible options are Fail and Omit.
     */
    async getClassificationNodes(project, ids, depth, errorPolicy) {
      const queryValues = {
        ids: ids && ids.join(","),
        "$depth": depth,
        errorPolicy
      };
      return this.beginRequest({
        apiVersion: "5.0-preview.2",
        routeTemplate: "{project}/_apis/wit/classificationNodes",
        routeValues: {
          project
        },
        queryParams: queryValues
      });
    }
    /**
     * Gets root classification nodes under the project.
     *
     * @param project - Project ID or project name
     * @param depth - Depth of children to fetch.
     */
    async getRootNodes(project, depth) {
      const queryValues = {
        "$depth": depth
      };
      return this.beginRequest({
        apiVersion: "5.0-preview.2",
        routeTemplate: "{project}/_apis/wit/classificationNodes",
        routeValues: {
          project
        },
        queryParams: queryValues
      });
    }
    /**
     * Create new or update an existing classification node.
     *
     * @param postedNode - Node to create or update.
     * @param project - Project ID or project name
     * @param structureGroup - Structure group of the classification node, area or iteration.
     * @param path - Path of the classification node.
     */
    async createOrUpdateClassificationNode(postedNode, project, structureGroup, path) {
      return this.beginRequest({
        apiVersion: "5.0-preview.2",
        method: "POST",
        routeTemplate: "{project}/_apis/wit/classificationNodes/{structureGroup}/{*path}",
        routeValues: {
          project,
          structureGroup,
          path
        },
        body: postedNode
      });
    }
    /**
     * Delete an existing classification node.
     *
     * @param project - Project ID or project name
     * @param structureGroup - Structure group of the classification node, area or iteration.
     * @param path - Path of the classification node.
     * @param reclassifyId - Id of the target classification node for reclassification.
     */
    async deleteClassificationNode(project, structureGroup, path, reclassifyId) {
      const queryValues = {
        "$reclassifyId": reclassifyId
      };
      return this.beginRequest({
        apiVersion: "5.0-preview.2",
        method: "DELETE",
        routeTemplate: "{project}/_apis/wit/classificationNodes/{structureGroup}/{*path}",
        routeValues: {
          project,
          structureGroup,
          path
        },
        queryParams: queryValues
      });
    }
    /**
     * Gets the classification node for a given node path.
     *
     * @param project - Project ID or project name
     * @param structureGroup - Structure group of the classification node, area or iteration.
     * @param path - Path of the classification node.
     * @param depth - Depth of children to fetch.
     */
    async getClassificationNode(project, structureGroup, path, depth) {
      const queryValues = {
        "$depth": depth
      };
      return this.beginRequest({
        apiVersion: "5.0-preview.2",
        routeTemplate: "{project}/_apis/wit/classificationNodes/{structureGroup}/{*path}",
        routeValues: {
          project,
          structureGroup,
          path
        },
        queryParams: queryValues
      });
    }
    /**
     * Update an existing classification node.
     *
     * @param postedNode - Node to create or update.
     * @param project - Project ID or project name
     * @param structureGroup - Structure group of the classification node, area or iteration.
     * @param path - Path of the classification node.
     */
    async updateClassificationNode(postedNode, project, structureGroup, path) {
      return this.beginRequest({
        apiVersion: "5.0-preview.2",
        method: "PATCH",
        routeTemplate: "{project}/_apis/wit/classificationNodes/{structureGroup}/{*path}",
        routeValues: {
          project,
          structureGroup,
          path
        },
        body: postedNode
      });
    }
    /**
     * Gets a comment for a work item at the specified revision.
     *
     * @param id - Work item id
     * @param revision - Revision for which the comment need to be fetched
     * @param project - Project ID or project name
     */
    async getComment(id, revision, project) {
      return this.beginRequest({
        apiVersion: "5.0-preview.2",
        routeTemplate: "{project}/_apis/wit/workItems/{id}/comments/{revision}",
        routeValues: {
          project,
          id,
          revision
        }
      });
    }
    /**
     * Gets the specified number of comments for a work item from the specified revision.
     *
     * @param id - Work item id
     * @param project - Project ID or project name
     * @param fromRevision - Revision from which comments are to be fetched (default is 1)
     * @param top - The number of comments to return (default is 200)
     * @param order - Ascending or descending by revision id (default is ascending)
     */
    async getComments(id, project, fromRevision, top, order) {
      const queryValues = {
        fromRevision,
        "$top": top,
        order
      };
      return this.beginRequest({
        apiVersion: "5.0-preview.2",
        routeTemplate: "{project}/_apis/wit/workItems/{id}/comments/{revision}",
        routeValues: {
          project,
          id
        },
        queryParams: queryValues
      });
    }
    /**
     * Create a new field.
     *
     * @param workItemField - New field definition
     * @param project - Project ID or project name
     */
    async createField(workItemField, project) {
      return this.beginRequest({
        apiVersion: "5.0-preview.2",
        method: "POST",
        routeTemplate: "{project}/_apis/wit/fields/{fieldNameOrRefName}",
        routeValues: {
          project
        },
        body: workItemField
      });
    }
    /**
     * Deletes the field. To undelete a filed, see "Update Field" API.
     *
     * @param fieldNameOrRefName - Field simple name or reference name
     * @param project - Project ID or project name
     */
    async deleteField(fieldNameOrRefName, project) {
      return this.beginRequest({
        apiVersion: "5.0-preview.2",
        method: "DELETE",
        routeTemplate: "{project}/_apis/wit/fields/{fieldNameOrRefName}",
        routeValues: {
          project,
          fieldNameOrRefName
        }
      });
    }
    /**
     * Gets information on a specific field.
     *
     * @param fieldNameOrRefName - Field simple name or reference name
     * @param project - Project ID or project name
     */
    async getField(fieldNameOrRefName, project) {
      return this.beginRequest({
        apiVersion: "5.0-preview.2",
        routeTemplate: "{project}/_apis/wit/fields/{fieldNameOrRefName}",
        routeValues: {
          project,
          fieldNameOrRefName
        }
      });
    }
    /**
     * Returns information for all fields. The project ID/name parameter is optional.
     *
     * @param project - Project ID or project name
     * @param expand - Use ExtensionFields to include extension fields, otherwise exclude them. Unless the feature flag for this parameter is enabled, extension fields are always included.
     */
    async getFields(project, expand) {
      const queryValues = {
        "$expand": expand
      };
      return this.beginRequest({
        apiVersion: "5.0-preview.2",
        routeTemplate: "{project}/_apis/wit/fields/{fieldNameOrRefName}",
        routeValues: {
          project
        },
        queryParams: queryValues
      });
    }
    /**
     * Update a field.
     *
     * @param payload - Payload contains desired value of the field's properties
     * @param fieldNameOrRefName - Name/reference name of the field to be updated
     * @param project - Project ID or project name
     */
    async updateField(payload, fieldNameOrRefName, project) {
      return this.beginRequest({
        apiVersion: "5.0-preview.2",
        method: "PATCH",
        routeTemplate: "{project}/_apis/wit/fields/{fieldNameOrRefName}",
        routeValues: {
          project,
          fieldNameOrRefName
        },
        body: payload
      });
    }
    /**
     * Creates a query, or moves a query.
     *
     * @param postedQuery - The query to create.
     * @param project - Project ID or project name
     * @param query - The parent id or path under which the query is to be created.
     * @param validateWiqlOnly - If you only want to validate your WIQL query without actually creating one, set it to true. Default is false.
     */
    async createQuery(postedQuery, project, query, validateWiqlOnly) {
      const queryValues = {
        validateWiqlOnly
      };
      return this.beginRequest({
        apiVersion: "5.0-preview.2",
        method: "POST",
        routeTemplate: "{project}/_apis/wit/queries/{*query}",
        routeValues: {
          project,
          query
        },
        queryParams: queryValues,
        body: postedQuery
      });
    }
    /**
     * Delete a query or a folder. This deletes any permission change on the deleted query or folder and any of its descendants if it is a folder. It is important to note that the deleted permission changes cannot be recovered upon undeleting the query or folder.
     *
     * @param project - Project ID or project name
     * @param query - ID or path of the query or folder to delete.
     */
    async deleteQuery(project, query) {
      return this.beginRequest({
        apiVersion: "5.0-preview.2",
        method: "DELETE",
        routeTemplate: "{project}/_apis/wit/queries/{*query}",
        routeValues: {
          project,
          query
        }
      });
    }
    /**
     * Gets the root queries and their children
     *
     * @param project - Project ID or project name
     * @param expand - Include the query string (wiql), clauses, query result columns, and sort options in the results.
     * @param depth - In the folder of queries, return child queries and folders to this depth.
     * @param includeDeleted - Include deleted queries and folders
     */
    async getQueries(project, expand, depth, includeDeleted) {
      const queryValues = {
        "$expand": expand,
        "$depth": depth,
        "$includeDeleted": includeDeleted
      };
      return this.beginRequest({
        apiVersion: "5.0-preview.2",
        routeTemplate: "{project}/_apis/wit/queries/{*query}",
        routeValues: {
          project
        },
        queryParams: queryValues
      });
    }
    /**
     * Retrieves an individual query and its children
     *
     * @param project - Project ID or project name
     * @param query - ID or path of the query.
     * @param expand - Include the query string (wiql), clauses, query result columns, and sort options in the results.
     * @param depth - In the folder of queries, return child queries and folders to this depth.
     * @param includeDeleted - Include deleted queries and folders
     * @param useIsoDateFormat - DateTime query clauses will be formatted using a ISO 8601 compliant format
     */
    async getQuery(project, query, expand, depth, includeDeleted, useIsoDateFormat) {
      const queryValues = {
        "$expand": expand,
        "$depth": depth,
        "$includeDeleted": includeDeleted,
        "$useIsoDateFormat": useIsoDateFormat
      };
      return this.beginRequest({
        apiVersion: "5.0-preview.2",
        routeTemplate: "{project}/_apis/wit/queries/{*query}",
        routeValues: {
          project,
          query
        },
        queryParams: queryValues
      });
    }
    /**
     * Searches all queries the user has access to in the current project
     *
     * @param project - Project ID or project name
     * @param filter - The text to filter the queries with.
     * @param top - The number of queries to return (Default is 50 and maximum is 200).
     * @param expand -
     * @param includeDeleted - Include deleted queries and folders
     */
    async searchQueries(project, filter, top, expand, includeDeleted) {
      const queryValues = {
        "$filter": filter,
        "$top": top,
        "$expand": expand,
        "$includeDeleted": includeDeleted
      };
      return this.beginRequest({
        apiVersion: "5.0-preview.2",
        routeTemplate: "{project}/_apis/wit/queries/{*query}",
        routeValues: {
          project
        },
        queryParams: queryValues
      });
    }
    /**
     * Update a query or a folder. This allows you to update, rename and move queries and folders.
     *
     * @param queryUpdate - The query to update.
     * @param project - Project ID or project name
     * @param query - The ID or path for the query to update.
     * @param undeleteDescendants - Undelete the children of this folder. It is important to note that this will not bring back the permission changes that were previously applied to the descendants.
     */
    async updateQuery(queryUpdate, project, query, undeleteDescendants) {
      const queryValues = {
        "$undeleteDescendants": undeleteDescendants
      };
      return this.beginRequest({
        apiVersion: "5.0-preview.2",
        method: "PATCH",
        routeTemplate: "{project}/_apis/wit/queries/{*query}",
        routeValues: {
          project,
          query
        },
        queryParams: queryValues,
        body: queryUpdate
      });
    }
    /**
     * Gets a list of queries by ids (Maximum 1000)
     *
     * @param queryGetRequest -
     * @param project - Project ID or project name
     */
    async getQueriesBatch(queryGetRequest, project) {
      return this.beginRequest({
        apiVersion: "5.0-preview.1",
        method: "POST",
        routeTemplate: "{project}/_apis/wit/queriesBatch",
        routeValues: {
          project
        },
        body: queryGetRequest
      });
    }
    /**
     * Destroys the specified work item permanently from the Recycle Bin. This action can not be undone.
     *
     * @param id - ID of the work item to be destroyed permanently
     * @param project - Project ID or project name
     */
    async destroyWorkItem(id, project) {
      return this.beginRequest({
        apiVersion: "5.0-preview.2",
        method: "DELETE",
        routeTemplate: "{project}/_apis/wit/recyclebin/{id}",
        routeValues: {
          project,
          id
        }
      });
    }
    /**
     * Gets a deleted work item from Recycle Bin.
     *
     * @param id - ID of the work item to be returned
     * @param project - Project ID or project name
     */
    async getDeletedWorkItem(id, project) {
      return this.beginRequest({
        apiVersion: "5.0-preview.2",
        routeTemplate: "{project}/_apis/wit/recyclebin/{id}",
        routeValues: {
          project,
          id
        }
      });
    }
    /**
     * Gets the work items from the recycle bin, whose IDs have been specified in the parameters
     *
     * @param ids - Comma separated list of IDs of the deleted work items to be returned
     * @param project - Project ID or project name
     */
    async getDeletedWorkItems(ids, project) {
      const queryValues = {
        ids: ids && ids.join(",")
      };
      return this.beginRequest({
        apiVersion: "5.0-preview.2",
        routeTemplate: "{project}/_apis/wit/recyclebin/{id}",
        routeValues: {
          project
        },
        queryParams: queryValues
      });
    }
    /**
     * Gets a list of the IDs and the URLs of the deleted the work items in the Recycle Bin.
     *
     * @param project - Project ID or project name
     */
    async getDeletedWorkItemShallowReferences(project) {
      return this.beginRequest({
        apiVersion: "5.0-preview.2",
        routeTemplate: "{project}/_apis/wit/recyclebin/{id}",
        routeValues: {
          project
        }
      });
    }
    /**
     * Restores the deleted work item from Recycle Bin.
     *
     * @param payload - Paylod with instructions to update the IsDeleted flag to false
     * @param id - ID of the work item to be restored
     * @param project - Project ID or project name
     */
    async restoreWorkItem(payload, id, project) {
      return this.beginRequest({
        apiVersion: "5.0-preview.2",
        method: "PATCH",
        routeTemplate: "{project}/_apis/wit/recyclebin/{id}",
        routeValues: {
          project,
          id
        },
        body: payload
      });
    }
    /**
     * Returns a fully hydrated work item for the requested revision
     *
     * @param id -
     * @param revisionNumber -
     * @param project - Project ID or project name
     * @param expand -
     */
    async getRevision(id, revisionNumber, project, expand) {
      const queryValues = {
        "$expand": expand
      };
      return this.beginRequest({
        apiVersion: "5.0-preview.3",
        routeTemplate: "{project}/_apis/wit/workItems/{id}/revisions/{revisionNumber}",
        routeValues: {
          project,
          id,
          revisionNumber
        },
        queryParams: queryValues
      });
    }
    /**
     * Returns the list of fully hydrated work item revisions, paged.
     *
     * @param id -
     * @param project - Project ID or project name
     * @param top -
     * @param skip -
     * @param expand -
     */
    async getRevisions(id, project, top, skip, expand) {
      const queryValues = {
        "$top": top,
        "$skip": skip,
        "$expand": expand
      };
      return this.beginRequest({
        apiVersion: "5.0-preview.3",
        routeTemplate: "{project}/_apis/wit/workItems/{id}/revisions/{revisionNumber}",
        routeValues: {
          project,
          id
        },
        queryParams: queryValues
      });
    }
    /**
     * RESTful method to send mail for selected/queried work items.
     *
     * @param body -
     * @param project - Project ID or project name
     */
    async sendMail(body, project) {
      return this.beginRequest({
        apiVersion: "5.0-preview.1",
        method: "POST",
        routeTemplate: "{project}/_apis/wit/sendMail",
        routeValues: {
          project
        },
        body
      });
    }
    /**
     * Creates a template
     *
     * @param template - Template contents
     * @param project - Project ID or project name
     * @param team - Team ID or team name
     */
    async createTemplate(template, project, team) {
      return this.beginRequest({
        apiVersion: "5.0-preview.1",
        method: "POST",
        routeTemplate: "{project}/{team}/_apis/wit/templates",
        routeValues: {
          project,
          team
        },
        body: template
      });
    }
    /**
     * Gets template
     *
     * @param project - Project ID or project name
     * @param team - Team ID or team name
     * @param workitemtypename - Optional, When specified returns templates for given Work item type.
     */
    async getTemplates(project, team, workitemtypename) {
      const queryValues = {
        workitemtypename
      };
      return this.beginRequest({
        apiVersion: "5.0-preview.1",
        routeTemplate: "{project}/{team}/_apis/wit/templates",
        routeValues: {
          project,
          team
        },
        queryParams: queryValues
      });
    }
    /**
     * Deletes the template with given id
     *
     * @param project - Project ID or project name
     * @param team - Team ID or team name
     * @param templateId - Template id
     */
    async deleteTemplate(project, team, templateId) {
      return this.beginRequest({
        apiVersion: "5.0-preview.1",
        method: "DELETE",
        routeTemplate: "{project}/{team}/_apis/wit/templates/{templateId}",
        routeValues: {
          project,
          team,
          templateId
        }
      });
    }
    /**
     * Gets the template with specified id
     *
     * @param project - Project ID or project name
     * @param team - Team ID or team name
     * @param templateId - Template Id
     */
    async getTemplate(project, team, templateId) {
      return this.beginRequest({
        apiVersion: "5.0-preview.1",
        routeTemplate: "{project}/{team}/_apis/wit/templates/{templateId}",
        routeValues: {
          project,
          team,
          templateId
        }
      });
    }
    /**
     * Replace template contents
     *
     * @param templateContent - Template contents to replace with
     * @param project - Project ID or project name
     * @param team - Team ID or team name
     * @param templateId - Template id
     */
    async replaceTemplate(templateContent, project, team, templateId) {
      return this.beginRequest({
        apiVersion: "5.0-preview.1",
        method: "PUT",
        routeTemplate: "{project}/{team}/_apis/wit/templates/{templateId}",
        routeValues: {
          project,
          team,
          templateId
        },
        body: templateContent
      });
    }
    /**
     * Returns a single update for a work item
     *
     * @param id -
     * @param updateNumber -
     * @param project - Project ID or project name
     */
    async getUpdate(id, updateNumber, project) {
      return this.beginRequest({
        apiVersion: "5.0-preview.3",
        routeTemplate: "{project}/_apis/wit/workItems/{id}/updates/{updateNumber}",
        routeValues: {
          project,
          id,
          updateNumber
        }
      });
    }
    /**
     * Returns the deltas between work item revisions
     *
     * @param id -
     * @param project - Project ID or project name
     * @param top -
     * @param skip -
     */
    async getUpdates(id, project, top, skip) {
      const queryValues = {
        "$top": top,
        "$skip": skip
      };
      return this.beginRequest({
        apiVersion: "5.0-preview.3",
        routeTemplate: "{project}/_apis/wit/workItems/{id}/updates/{updateNumber}",
        routeValues: {
          project,
          id
        },
        queryParams: queryValues
      });
    }
    /**
     * Gets the results of the query given its WIQL.
     *
     * @param wiql - The query containing the WIQL.
     * @param project - Project ID or project name
     * @param team - Team ID or team name
     * @param timePrecision - Whether or not to use time precision.
     * @param top - The max number of results to return.
     */
    async queryByWiql(wiql, project, team, timePrecision, top) {
      const queryValues = {
        timePrecision,
        "$top": top
      };
      return this.beginRequest({
        apiVersion: "5.0-preview.2",
        method: "POST",
        routeTemplate: "{project}/{team}/_apis/wit/wiql",
        routeValues: {
          project,
          team
        },
        queryParams: queryValues,
        body: wiql
      });
    }
    /**
     * Gets the results of the query given the query ID.
     *
     * @param id - The query ID.
     * @param project - Project ID or project name
     * @param team - Team ID or team name
     * @param timePrecision - Whether or not to use time precision.
     * @param top - The max number of results to return.
     */
    async getQueryResultCount(id, project, team, timePrecision, top) {
      const queryValues = {
        timePrecision,
        "$top": top
      };
      return this.beginRequest({
        apiVersion: "5.0-preview.2",
        method: "HEAD",
        routeTemplate: "{project}/{team}/_apis/wit/wiql/{id}",
        routeValues: {
          project,
          team,
          id
        },
        queryParams: queryValues,
        returnRawResponse: true
      }).then(async (response) => {
        return Number(response.headers.get("X-Total-Count"));
      });
    }
    /**
     * Gets the results of the query given the query ID.
     *
     * @param id - The query ID.
     * @param project - Project ID or project name
     * @param team - Team ID or team name
     * @param timePrecision - Whether or not to use time precision.
     * @param top - The max number of results to return.
     */
    async queryById(id, project, team, timePrecision, top) {
      const queryValues = {
        timePrecision,
        "$top": top
      };
      return this.beginRequest({
        apiVersion: "5.0-preview.2",
        routeTemplate: "{project}/{team}/_apis/wit/wiql/{id}",
        routeValues: {
          project,
          team,
          id
        },
        queryParams: queryValues
      });
    }
    /**
     * Get a work item icon given the friendly name and icon color.
     *
     * @param icon - The name of the icon
     * @param color - The 6-digit hex color for the icon
     * @param v - The version of the icon (used only for cache invalidation)
     */
    async getWorkItemIconJson(icon, color, v2) {
      const queryValues = {
        color,
        v: v2
      };
      return this.beginRequest({
        apiVersion: "5.0-preview.1",
        routeTemplate: "_apis/wit/workItemIcons/{icon}",
        routeValues: {
          icon
        },
        queryParams: queryValues
      });
    }
    /**
     * Get a list of all work item icons.
     *
     */
    async getWorkItemIcons() {
      return this.beginRequest({
        apiVersion: "5.0-preview.1",
        routeTemplate: "_apis/wit/workItemIcons/{icon}"
      });
    }
    /**
     * Get a work item icon given the friendly name and icon color.
     *
     * @param icon - The name of the icon
     * @param color - The 6-digit hex color for the icon
     * @param v - The version of the icon (used only for cache invalidation)
     */
    async getWorkItemIconSvg(icon, color, v2) {
      const queryValues = {
        color,
        v: v2
      };
      return this.beginRequest({
        apiVersion: "5.0-preview.1",
        httpResponseType: "image/svg+xml",
        routeTemplate: "_apis/wit/workItemIcons/{icon}",
        routeValues: {
          icon
        },
        queryParams: queryValues
      });
    }
    /**
     * Get a work item icon given the friendly name and icon color.
     *
     * @param icon - The name of the icon
     * @param color - The 6-digit hex color for the icon
     * @param v - The version of the icon (used only for cache invalidation)
     */
    async getWorkItemIconXaml(icon, color, v2) {
      const queryValues = {
        color,
        v: v2
      };
      return this.beginRequest({
        apiVersion: "5.0-preview.1",
        httpResponseType: "image/xaml+xml",
        routeTemplate: "_apis/wit/workItemIcons/{icon}",
        routeValues: {
          icon
        },
        queryParams: queryValues
      });
    }
    /**
     * Get a batch of work item links
     *
     * @param project - Project ID or project name
     * @param linkTypes - A list of types to filter the results to specific link types. Omit this parameter to get work item links of all link types.
     * @param types - A list of types to filter the results to specific work item types. Omit this parameter to get work item links of all work item types.
     * @param continuationToken - Specifies the continuationToken to start the batch from. Omit this parameter to get the first batch of links.
     * @param startDateTime - Date/time to use as a starting point for link changes. Only link changes that occurred after that date/time will be returned. Cannot be used in conjunction with 'watermark' parameter.
     */
    async getReportingLinksByLinkType(project, linkTypes, types, continuationToken, startDateTime) {
      const queryValues = {
        linkTypes: linkTypes && linkTypes.join(","),
        types: types && types.join(","),
        continuationToken,
        startDateTime
      };
      return this.beginRequest({
        apiVersion: "5.0-preview.3",
        routeTemplate: "{project}/_apis/wit/reporting/workItemLinks",
        routeValues: {
          project
        },
        queryParams: queryValues
      });
    }
    /**
     * Gets the work item relation type definition.
     *
     * @param relation - The relation name
     */
    async getRelationType(relation) {
      return this.beginRequest({
        apiVersion: "5.0-preview.2",
        routeTemplate: "_apis/wit/workItemRelationTypes/{relation}",
        routeValues: {
          relation
        }
      });
    }
    /**
     * Gets the work item relation types.
     *
     */
    async getRelationTypes() {
      return this.beginRequest({
        apiVersion: "5.0-preview.2",
        routeTemplate: "_apis/wit/workItemRelationTypes/{relation}"
      });
    }
    /**
     * Get a batch of work item revisions with the option of including deleted items
     *
     * @param project - Project ID or project name
     * @param fields - A list of fields to return in work item revisions. Omit this parameter to get all reportable fields.
     * @param types - A list of types to filter the results to specific work item types. Omit this parameter to get work item revisions of all work item types.
     * @param continuationToken - Specifies the watermark to start the batch from. Omit this parameter to get the first batch of revisions.
     * @param startDateTime - Date/time to use as a starting point for revisions, all revisions will occur after this date/time. Cannot be used in conjunction with 'watermark' parameter.
     * @param includeIdentityRef - Return an identity reference instead of a string value for identity fields.
     * @param includeDeleted - Specify if the deleted item should be returned.
     * @param includeTagRef - Specify if the tag objects should be returned for System.Tags field.
     * @param includeLatestOnly - Return only the latest revisions of work items, skipping all historical revisions
     * @param expand - Return all the fields in work item revisions, including long text fields which are not returned by default
     * @param includeDiscussionChangesOnly - Return only the those revisions of work items, where only history field was changed
     * @param maxPageSize - The maximum number of results to return in this batch
     */
    async readReportingRevisionsGet(project, fields, types, continuationToken, startDateTime, includeIdentityRef, includeDeleted, includeTagRef, includeLatestOnly, expand, includeDiscussionChangesOnly, maxPageSize) {
      const queryValues = {
        fields: fields && fields.join(","),
        types: types && types.join(","),
        continuationToken,
        startDateTime,
        includeIdentityRef,
        includeDeleted,
        includeTagRef,
        includeLatestOnly,
        "$expand": expand,
        includeDiscussionChangesOnly,
        "$maxPageSize": maxPageSize
      };
      return this.beginRequest({
        apiVersion: "5.0-preview.2",
        routeTemplate: "{project}/_apis/wit/reporting/workItemRevisions",
        routeValues: {
          project
        },
        queryParams: queryValues
      });
    }
    /**
     * Get a batch of work item revisions. This request may be used if your list of fields is large enough that it may run the URL over the length limit.
     *
     * @param filter - An object that contains request settings: field filter, type filter, identity format
     * @param project - Project ID or project name
     * @param continuationToken - Specifies the watermark to start the batch from. Omit this parameter to get the first batch of revisions.
     * @param startDateTime - Date/time to use as a starting point for revisions, all revisions will occur after this date/time. Cannot be used in conjunction with 'watermark' parameter.
     * @param expand -
     */
    async readReportingRevisionsPost(filter, project, continuationToken, startDateTime, expand) {
      const queryValues = {
        continuationToken,
        startDateTime,
        "$expand": expand
      };
      return this.beginRequest({
        apiVersion: "5.0-preview.2",
        method: "POST",
        routeTemplate: "{project}/_apis/wit/reporting/workItemRevisions",
        routeValues: {
          project
        },
        queryParams: queryValues,
        body: filter
      });
    }
    /**
     * Creates a single work item.
     *
     * @param document - The JSON Patch document representing the work item
     * @param project - Project ID or project name
     * @param type - The work item type of the work item to create
     * @param validateOnly - Indicate if you only want to validate the changes without saving the work item
     * @param bypassRules - Do not enforce the work item type rules on this update
     * @param suppressNotifications - Do not fire any notifications for this change
     * @param expand - The expand parameters for work item attributes. Possible options are \{ None, Relations, Fields, Links, All \}.
     */
    async createWorkItem(document2, project, type, validateOnly, bypassRules, suppressNotifications, expand) {
      const queryValues = {
        validateOnly,
        bypassRules,
        suppressNotifications,
        "$expand": expand
      };
      return this.beginRequest({
        apiVersion: "5.0-preview.3",
        method: "POST",
        routeTemplate: "{project}/_apis/wit/workItems/${type}",
        routeValues: {
          project,
          type
        },
        customHeaders: {
          "Content-Type": "application/json-patch+json"
        },
        queryParams: queryValues,
        body: document2
      });
    }
    /**
     * Returns a single work item from a template.
     *
     * @param project - Project ID or project name
     * @param type - The work item type name
     * @param fields - Comma-separated list of requested fields
     * @param asOf - AsOf UTC date time string
     * @param expand - The expand parameters for work item attributes. Possible options are \{ None, Relations, Fields, Links, All \}.
     */
    async getWorkItemTemplate(project, type, fields, asOf, expand) {
      const queryValues = {
        fields,
        asOf,
        "$expand": expand
      };
      return this.beginRequest({
        apiVersion: "5.0-preview.3",
        routeTemplate: "{project}/_apis/wit/workItems/${type}",
        routeValues: {
          project,
          type
        },
        queryParams: queryValues
      });
    }
    /**
     * Deletes the specified work item and sends it to the Recycle Bin, so that it can be restored back, if required. Optionally, if the destroy parameter has been set to true, it destroys the work item permanently. WARNING: If the destroy parameter is set to true, work items deleted by this command will NOT go to recycle-bin and there is no way to restore/recover them after deletion. It is recommended NOT to use this parameter. If you do, please use this parameter with extreme caution.
     *
     * @param id - ID of the work item to be deleted
     * @param project - Project ID or project name
     * @param destroy - Optional parameter, if set to true, the work item is deleted permanently. Please note: the destroy action is PERMANENT and cannot be undone.
     */
    async deleteWorkItem(id, project, destroy) {
      const queryValues = {
        destroy
      };
      return this.beginRequest({
        apiVersion: "5.0-preview.3",
        method: "DELETE",
        routeTemplate: "{project}/_apis/wit/workItems/{id}",
        routeValues: {
          project,
          id
        },
        queryParams: queryValues
      });
    }
    /**
     * Returns a single work item.
     *
     * @param id - The work item id
     * @param project - Project ID or project name
     * @param fields - Comma-separated list of requested fields
     * @param asOf - AsOf UTC date time string
     * @param expand - The expand parameters for work item attributes. Possible options are \{ None, Relations, Fields, Links, All \}.
     */
    async getWorkItem(id, project, fields, asOf, expand) {
      const queryValues = {
        fields: fields && fields.join(","),
        asOf,
        "$expand": expand
      };
      return this.beginRequest({
        apiVersion: "5.0-preview.3",
        routeTemplate: "{project}/_apis/wit/workItems/{id}",
        routeValues: {
          project,
          id
        },
        queryParams: queryValues
      });
    }
    /**
     * Returns a list of work items (Maximum 200)
     *
     * @param ids - The comma-separated list of requested work item ids. (Maximum 200 ids allowed).
     * @param project - Project ID or project name
     * @param fields - Comma-separated list of requested fields
     * @param asOf - AsOf UTC date time string
     * @param expand - The expand parameters for work item attributes. Possible options are \{ None, Relations, Fields, Links, All \}.
     * @param errorPolicy - The flag to control error policy in a bulk get work items request. Possible options are \{Fail, Omit\}.
     */
    async getWorkItems(ids, project, fields, asOf, expand, errorPolicy) {
      const queryValues = {
        ids: ids && ids.join(","),
        fields: fields && fields.join(","),
        asOf,
        "$expand": expand,
        errorPolicy
      };
      return this.beginRequest({
        apiVersion: "5.0-preview.3",
        routeTemplate: "{project}/_apis/wit/workItems/{id}",
        routeValues: {
          project
        },
        queryParams: queryValues
      });
    }
    /**
     * Updates a single work item.
     *
     * @param document - The JSON Patch document representing the update
     * @param id - The id of the work item to update
     * @param project - Project ID or project name
     * @param validateOnly - Indicate if you only want to validate the changes without saving the work item
     * @param bypassRules - Do not enforce the work item type rules on this update
     * @param suppressNotifications - Do not fire any notifications for this change
     * @param expand - The expand parameters for work item attributes. Possible options are \{ None, Relations, Fields, Links, All \}.
     */
    async updateWorkItem(document2, id, project, validateOnly, bypassRules, suppressNotifications, expand) {
      const queryValues = {
        validateOnly,
        bypassRules,
        suppressNotifications,
        "$expand": expand
      };
      return this.beginRequest({
        apiVersion: "5.0-preview.3",
        method: "PATCH",
        routeTemplate: "{project}/_apis/wit/workItems/{id}",
        routeValues: {
          project,
          id
        },
        customHeaders: {
          "Content-Type": "application/json-patch+json"
        },
        queryParams: queryValues,
        body: document2
      });
    }
    /**
     * Gets work items for a list of work item ids (Maximum 200)
     *
     * @param workItemGetRequest -
     * @param project - Project ID or project name
     */
    async getWorkItemsBatch(workItemGetRequest, project) {
      return this.beginRequest({
        apiVersion: "5.0-preview.1",
        method: "POST",
        routeTemplate: "{project}/_apis/wit/workItemsBatch",
        routeValues: {
          project
        },
        body: workItemGetRequest
      });
    }
    /**
     * INTERNAL ONLY: It will be used for My account work experience. Get the work item type state color for multiple projects
     *
     * @param projectNames -
     */
    async getWorkItemStateColors(projectNames) {
      return this.beginRequest({
        apiVersion: "5.0-preview.1",
        method: "POST",
        routeTemplate: "_apis/work/workitemStateColor",
        body: projectNames
      });
    }
    /**
     * Returns the next state on the given work item IDs.
     *
     * @param ids - list of work item ids
     * @param action - possible actions. Currently only supports checkin
     */
    async getWorkItemNextStatesOnCheckinAction(ids, action) {
      const queryValues = {
        ids: ids && ids.join(","),
        action
      };
      return this.beginRequest({
        apiVersion: "5.0-preview.1",
        routeTemplate: "_apis/wit/workItemTransitions",
        queryParams: queryValues
      });
    }
    /**
     * Get all work item type categories.
     *
     * @param project - Project ID or project name
     */
    async getWorkItemTypeCategories(project) {
      return this.beginRequest({
        apiVersion: "5.0-preview.2",
        routeTemplate: "{project}/_apis/wit/workItemTypeCategories/{category}",
        routeValues: {
          project
        }
      });
    }
    /**
     * Get specific work item type category by name.
     *
     * @param project - Project ID or project name
     * @param category - The category name
     */
    async getWorkItemTypeCategory(project, category) {
      return this.beginRequest({
        apiVersion: "5.0-preview.2",
        routeTemplate: "{project}/_apis/wit/workItemTypeCategories/{category}",
        routeValues: {
          project,
          category
        }
      });
    }
    /**
     * INTERNAL ONLY: It will be used for My account work experience. Get the wit type color for multiple projects
     *
     * @param projectNames -
     */
    async getWorkItemTypeColors(projectNames) {
      return this.beginRequest({
        apiVersion: "5.0-preview.1",
        method: "POST",
        routeTemplate: "_apis/work/workitemTypeColor",
        body: projectNames
      });
    }
    /**
     * INTERNAL ONLY: It is used for color and icon providers. Get the wit type color for multiple projects
     *
     * @param projectNames -
     */
    async getWorkItemTypeColorAndIcons(projectNames) {
      return this.beginRequest({
        apiVersion: "5.0-preview.1",
        method: "POST",
        routeTemplate: "_apis/wit/workItemTypeColorAndIcon",
        body: projectNames
      });
    }
    /**
     * Returns a work item type definition.
     *
     * @param project - Project ID or project name
     * @param type - Work item type name
     */
    async getWorkItemType(project, type) {
      return this.beginRequest({
        apiVersion: "5.0-preview.2",
        routeTemplate: "{project}/_apis/wit/workItemTypes/{type}",
        routeValues: {
          project,
          type
        }
      });
    }
    /**
     * Returns the list of work item types
     *
     * @param project - Project ID or project name
     */
    async getWorkItemTypes(project) {
      return this.beginRequest({
        apiVersion: "5.0-preview.2",
        routeTemplate: "{project}/_apis/wit/workItemTypes/{type}",
        routeValues: {
          project
        }
      });
    }
    /**
     * Get a list of fields for a work item type with detailed references.
     *
     * @param project - Project ID or project name
     * @param type - Work item type.
     * @param expand - Expand level for the API response. Properties: to include allowedvalues, default value, isRequired etc. as a part of response; None: to skip these properties.
     */
    async getWorkItemTypeFieldsWithReferences(project, type, expand) {
      const queryValues = {
        "$expand": expand
      };
      return this.beginRequest({
        apiVersion: "5.0-preview.3",
        routeTemplate: "{project}/_apis/wit/workitemtypes/{type}/fields/{field}",
        routeValues: {
          project,
          type
        },
        queryParams: queryValues
      });
    }
    /**
     * Get a field for a work item type with detailed references.
     *
     * @param project - Project ID or project name
     * @param type - Work item type.
     * @param field -
     * @param expand - Expand level for the API response. Properties: to include allowedvalues, default value, isRequired etc. as a part of response; None: to skip these properties.
     */
    async getWorkItemTypeFieldWithReferences(project, type, field, expand) {
      const queryValues = {
        "$expand": expand
      };
      return this.beginRequest({
        apiVersion: "5.0-preview.3",
        routeTemplate: "{project}/_apis/wit/workitemtypes/{type}/fields/{field}",
        routeValues: {
          project,
          type,
          field
        },
        queryParams: queryValues
      });
    }
    /**
     * Returns the state names and colors for a work item type.
     *
     * @param project - Project ID or project name
     * @param type - The state name
     */
    async getWorkItemTypeStates(project, type) {
      return this.beginRequest({
        apiVersion: "5.0-preview.1",
        routeTemplate: "{project}/_apis/wit/workitemtypes/{type}/states",
        routeValues: {
          project,
          type
        }
      });
    }
    /**
     * Export work item type
     *
     * @param project - Project ID or project name
     * @param type -
     * @param exportGlobalLists -
     */
    async exportWorkItemTypeDefinition(project, type, exportGlobalLists) {
      const queryValues = {
        exportGlobalLists
      };
      return this.beginRequest({
        apiVersion: "5.0-preview.1",
        routeTemplate: "{project}/_apis/wit/workItemTypeTemplate/{type}",
        routeValues: {
          project,
          type
        },
        queryParams: queryValues
      });
    }
    /**
     * Add/updates a work item type
     *
     * @param updateModel -
     * @param project - Project ID or project name
     */
    async updateWorkItemTypeDefinition(updateModel, project) {
      return this.beginRequest({
        apiVersion: "5.0-preview.1",
        method: "POST",
        routeTemplate: "{project}/_apis/wit/workItemTypeTemplate/{type}",
        routeValues: {
          project
        },
        body: updateModel
      });
    }
  };
  WorkItemTrackingRestClient.RESOURCE_AREA_ID = "5264459e-e5e0-4bd8-b118-0985e68a4ec5";

  // node_modules/azure-devops-extension-api/esm/WorkItemTracking/WorkItemTrackingServices.js
  var WorkItemTrackingServiceIds;
  (function(WorkItemTrackingServiceIds2) {
    WorkItemTrackingServiceIds2["WorkItemFormNavigationService"] = "ms.vss-work-web.work-item-form-navigation-service";
    WorkItemTrackingServiceIds2["WorkItemFormService"] = "ms.vss-work-web.work-item-form";
  })(WorkItemTrackingServiceIds || (WorkItemTrackingServiceIds = {}));

  // index.js
  var MIRO_FIELD = "Custom.MiroURL";
  async function updatePreview() {
    const workItemService = await F(
      WorkItemTrackingServiceIds.WorkItemFormService
    );
    const value = await workItemService.getFieldValue(MIRO_FIELD);
    const iframe = document.getElementById("miro");
    const message = document.getElementById("message");
    if (!value) {
      iframe.style.display = "none";
      message.style.display = "block";
      message.innerText = "Nenhuma URL do Miro informada.";
      return;
    }
    let url = String(value).trim();
    url = url.replace(
      "miro.com/app/board/",
      "miro.com/app/live-embed/"
    );
    iframe.src = url;
    iframe.style.display = "block";
    message.style.display = "none";
  }
  x();
  j().then(() => {
    N(C(), () => ({
      onLoaded: async () => {
        await updatePreview();
      },
      onFieldChanged: async (args) => {
        if (args.changedFields && args.changedFields[MIRO_FIELD] !== void 0) {
          await updatePreview();
        }
      }
    }));
    updatePreview();
  });
})();
