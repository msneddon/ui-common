
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
            var methodid = scope.params.methodid;
            
	    // setup panel
            var p = $(ele).kbasePanel({title: methodid}) /* ,rightLabel: "ws", subText: scope.userid}); */
            /*p.loading();
            
            $(p.body()).KBaseNarrativeMethodMainOverview({
                
            })
            
            */
            // create ws client (because we need to go to the dev workspace)
            /*var peopleWsUrl = "http://dev04.berkeley.kbase.us:7058";
            var ws;
            if (scope.params.kbCache.token) {  ws = new Workspace(peopleWsUrl, {token: scope.params.kbCache.token}); }
	    else { ws = new Workspace(peopleWsUrl); }
	    
            var objectIds = [{ref:"appdata/"+appid}];
            ws.get_objects(objectIds,
                function(data) {
		    // create the widget if we found the data
		    var appData = data[0]['data'];
		    $(ele).find(".panel-title").html(appData['name']);
                    $(p.body()).KBaseAppOverview({
                                        appData:appData,
                                        wsUserInfoUrl:peopleWsUrl,
                                        appDataRef:"appdata/"+appid,
                                        kbCache:scope.params.kbCache
                                    });
		},
		function(err) {
                    // if we get an error, then no workspace or no profile exists (or is readable by this user...) and we just exit
		    $(p.body()).append("No app exists with id <i>"+appid+"</i>.");
		    console.error(err);
		});
		*/
	}
    };
})