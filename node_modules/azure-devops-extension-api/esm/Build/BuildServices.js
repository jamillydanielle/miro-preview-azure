/**
 * Contribution ids of Azure Pipelines services which can be obtained from DevOps.getService
 */
export var BuildServiceIds;
(function (BuildServiceIds) {
    /**
     * Service for getting contextual information when on a builds page
     */
    BuildServiceIds["BuildPageDataService"] = "ms.vss-build-web.build-page-data-service";
})(BuildServiceIds || (BuildServiceIds = {}));
