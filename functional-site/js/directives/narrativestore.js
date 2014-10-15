
/*
 *  Directives
 *  
 *  These can be thought of as the 'widgets' on a page.  
 *  Scope comes from the controllers.
 *
*/

angular.module('narrativestore-directives', []);
angular.module('narrativestore-directives')

.directive('narrativemethodmainoverview', function($rootScope) {
    return {
        link: function(scope, ele, attrs) {
            var methodId = scope.params.methodid;
            
	    // setup panel
            var p = $(ele).kbasePanel({title: "&nbsp"}) /* ,rightLabel: "ws", subText: scope.userid}); */
            p.loading();
            
            $(p.body()).KBaseNarrativeMethodMainOverview({
		methodId:methodId,
		narrativeStoreUrl:"http://dev19.berkeley.kbase.us/narrative_method_store",
		kbCache:scope.params.kbCache
            });
	}
    };
})