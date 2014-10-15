(function( $, undefined ) {
    $.KBWidget({
        name: "KBaseNarrativeMethodMainOverview",
        parent: "kbaseAuthenticatedWidget",
        version: "1.0.0",
        
        userNameFetchUrl:"https://kbase.us/services/genome_comparison/users?usernames=",
	
	
        options: {
            methodId:null,
	    narrativeStoreUrl:"http://dev19.berkeley.kbase.us/narrative_method_store",
            kbCache:{},
        },
	
	loggedIn:false,
	loggedInUserId:null,
	
	$alertPanel:null,
	$mainPanel:null,
	
	narstore: null,
	methodFullInfo: null,
	
        init: function(options) {
            this._super(options);
            var self = this;
	    
	    if (options.kbCache.token) {
		self.loggedIn = true;
		self.loggedInUserId = $('<div></div>').kbaseLogin().get_kbase_cookie('user_id');
            }
	    
	    // setup the alert panel
            self.$alertPanel = $("<div></div>");
	    self.$elem.append(self.$alertPanel);
            self.$mainPanel = $("<div></div>").css("overflow","auto");
	    self.$elem.append(self.$mainPanel);
	    
	    // create the client
	    self.narstore = new NarrativeMethodStore(self.options.narrativeStoreUrl+"/rpc");
	    
            //self.render();
	    
	    self.fetchMethodInfoAndRender();
	    
	    return this;
	},
 
	
	
	fetchMethodInfoAndRender: function() {
	    var self = this;
	    
            self.narstore.get_method_full_info({ids:[self.options.methodId]},
                function(data) {
		    self.methodFullInfo = data[0];
		    self.render();
		},
		function(err) {
                    self.$alertPanel.append('<div class="alert alert-warning" role="alert"><b>There is no Narrative Method with id <i>'+self.options.methodId+'</i></b>.</div>');
		    console.error(err);
		    // show a list of narrative methods
		    self.narstore.list_methods({},
			function(data) {
			    var $listDiv = $('<div>');
			    for(var i=0; i<data.length; i++) {
				$listDiv.append(
				    $('<a href="#/narrativestore/method/'+data[i]['id']+'">' + data[i]['name'] +'</a><br>')
				)
			    }
			    self.$mainPanel.append($listDiv);
			},
			function(err) {
			    console.error(err);
			});
		});
	    
	},
	
	
	
	render: function() {
	    var self = this;
	    var m = self.methodFullInfo;
	    console.log(m);
	    
	    var $header = $('<div>').addClass("row").css("width","95%");
	    
	    var $basicInfo = $('<div>').addClass("col-md-8");
	    
	    //var verString
	    
	    $basicInfo.append('<div><h2>'+m['name']+'</h2>');
	    if (m['subtitle']) {
		$basicInfo.append('<div><h4>'+m['subtitle']+'</h4></div>');
	    }
	    if (m['ver']) {
		$basicInfo.append('<div><strong>Version: </strong>&nbsp&nbsp'+m['ver']+"</div>");
	    }
	    
	    if (m['contact']) {
		$basicInfo.append('<div><strong>Help or Questions? Contact: </strong>&nbsp&nbsp'+m['contact']+"</div>");
	    }
	    
	    if (m['authors']) {
		var $authors = $('<div>');
		for(var k=0; k<m['author'].length; k++) {
		    if (k==0) {
			$authors.append('<strong>Authors: </strong>&nbsp&nbsp'+m['authors'][k]);
		    } else {
			$authors.append(', '+ad['authors'][k]);
		    }
		}
		$basicInfo.append($authors);
	    }
	    
	    /*$basicInfo.append('<br><div><strong>Input Types: </strong>&nbsp&nbspKBaseGenomes.Genome</div>');
	    $basicInfo.append('<div><strong>Output Types: </strong>&nbsp&nbspKBaseTrees.Tree</div>');*/
	    
	    var $topButtons = $('<div>').addClass("col-md-4").css("text-align","right")
				    /*.append(
				      '<div>' +
					'<h4><span class="label label-primary">#18 in the App Gallery</span></h4>' +
				      '</div>'
				    )*/
				    .append(
				      '<div class="btn-group">' +
					'<button id="saveapp" class="btn btn-default">Save to Favorites</button>' +
					'<button id="launchapp" class="btn btn-default">Launch in New Narrative</button>' +
				      '</div>'  
				    );
	    
	    $topButtons.find("#saveapp").click(function(e) {
		    e.preventDefault(); //to prevent standard click event
		    alert("This button should save/install this App so it can be found easily in the Narrative list of functions for the user.");
		});
	    $topButtons.find("#launchapp").click(function(e) {
		    e.preventDefault(); //to prevent standard click event
		    alert("This should create a new narrative populated with this App.");
		});
	    
	    $header.append($basicInfo);
	    $header.append($topButtons);
	    
	    self.$mainPanel.append($header);
	    
	    
	    var $descriptionPanels = $('<div>').addClass("row").css("width","95%");
	    var $description = $('<div>').addClass("col-md-12");
	    if (m['description']) {
		$description.append('<div><hr>'+m['description']+"</div>");
	    }
	    $descriptionPanels.append($description);
	    
	    self.$mainPanel.append($descriptionPanels);
	    
	    if (m['screenshots']) {
		var imgHtml = '';
		for(var s=0; s<m['screenshots'].length; s++) {
		    imgHtml += '<td style="padding:10px;"><div style="border: 1px solid black; width: 350px; height:250px;">'+
			'<img src="'+self.options.narrativeStoreUrl + m['screenshots'][s]['url']  +'" width="100%">' +
			'</div></td>';
		}
		var $ssPanel = $("<div>").append(
		    '<br><br><div style="width:95%;overflow:auto;">'+
			'<table style="border:0px;"><tr>'+
			imgHtml +
			'</tr></table>'+
		    '</div>'
		);
	       
		self.$mainPanel.append($ssPanel);
	    }
	}

    });
})( jQuery )