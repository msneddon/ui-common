(function( $, undefined ) {
    $.KBWidget({
        name: "KBaseNarrativeMethodMainOverview",
        parent: "kbaseAuthenticatedWidget",
        version: "1.0.0",
        
        userNameFetchUrl:"https://kbase.us/services/genome_comparison/users?usernames=",
	
	
        options: {
            methodId:null,
	    narrativeStoreUrl:"https://kbase.us/services/narrative_method_store/rpc",
            kbCache:{},
        },
	
	loggedIn:false,
	loggedInUserId:null,
	
	$alertPanel:null,
	$mainPanel:null,
	$specPanel:null,
	
	narstore: null,
	methodFullInfo: null,
	methodSpec: null,
	
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
            self.$specPanel = $("<div></div>");
	    self.$elem.append(self.$specPanel);
	    
	    // create the client
	    self.narstore = new NarrativeMethodStore(self.options.narrativeStoreUrl+"/rpc");
	    
	    // get the data and render
	    self.fetchMethodInfoAndRender();
	    self.fetchSpecInfoAndRender();
	    
	    return this;
	},
 
	
	
	fetchMethodInfoAndRender: function() {
	    var self = this;
	    if (self.options.methodId) {
		self.narstore.get_method_full_info({ids:[self.options.methodId]},
		    function(data) {
			self.methodFullInfo = data[0];
			self.renderMainPanel();
		    },
		    function(err) {
			self.$alertPanel.append('<div class="alert alert-warning" role="alert"><b>There is no Narrative Method with id <i>'+self.options.methodId+'</i></b>.</div>');
			console.error(err);
			// show a list of narrative methods
			self.renderMethodList();
			
		    });
	    } else {
		self.renderMethodList();
	    }
	    
	},
	
	renderMainPanel: function() {
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
		for(var k=0; k<m['authors'].length; k++) {
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
					//'<button id="savemetod" class="btn btn-default">Save to Favorites</button>' +
					'<button id="launchmethod" class="btn btn-default">Launch in New Narrative</button>' +
				      '</div>'  
				    );
	    
	   /* $topButtons.find("#savemethod").click(function(e) {
		    e.preventDefault(); //to prevent standard click event
		    alert("This button should save this Method for the user so it can be found easily in the Narrative list of functions for the user.");
		});*/
	    $topButtons.find("#launchmethod").click(function(e) {
		    e.preventDefault(); //to prevent standard click event
		    alert("This should create a new narrative populated with this Method.");
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
	    
	    if (m['technical_description']) {
		var $techDetailsDiv = $('<div>')
					.append("<hr><h4>Technical Details</h4>")
					.append(m['technical_description']+"<br>");
		self.$mainPanel.append($techDetailsDiv);
	    }
	    
	    
	},
	
	
	
	fetchSpecInfoAndRender: function() {
	    var self = this;
	    if (self.options.methodId) {
		self.narstore.get_method_spec({ids:[self.options.methodId]},
		    function(data) {
			self.methodSpec = data[0];
			self.renderSpecPanel();
		    },
		    function(err) {
			console.error(err);
		    });
	    }
	    
	},
	renderSpecPanel: function() {
	    var self = this;
	    var spec = self.methodSpec;
	    console.log(spec);
	    
	    self.$specPanel.append("<hr><h4>Technical Parameter Details</h4>");
	    
	    var $paramGroupDiv = $('<div>');
	    for(var p=0; p<spec['parameters'].length; p++) {
		var param = spec['parameters'][p];
		
		var $paramDiv = $('<div>');
		
		var spacer = "&nbsp&nbsp&nbsp&nbsp"; // todo: improve this terrible styling!
		
		$paramDiv.append('<strong>Parameter ' +(p+1)+ ":</strong><br>");
		$paramDiv.append(spacer+ '<strong>' +param['ui_name']+ "</strong> (id=<i>"+param['id']+"</i>)<br>");
		
		$paramDiv.append(spacer +spacer+'<i>Short Description:</i> &nbsp' +param['short_hint']+ "<br>");
		$paramDiv.append(spacer +spacer+'<i>Long Description:</i> &nbsp' +param['long_hint']+ "<br>");
		
		$paramGroupDiv.append($paramDiv).append("<br>");
	    }
	    self.$specPanel.append($paramGroupDiv);
	    
	    
	},
	
	renderMethodList : function() {
	    var self = this;
	    
	    self.narstore.list_methods({},
		function(data) {
		    
		    var methodsData = [];
		    for(var i=0; i<data.length; i++) {
			methodsData.push({
			    name:'<a href="#/narrativestore/method/'+data[i]['id']+'">' + data[i]['name'] +'</a>',
			    description:data[i]['subtitle']
			});
		    }
				    
		    self.$mainPanel.append('<table cellpadding="0" cellspacing="0" border="0" id="methods-table" \
					class="table table-bordered table-striped" style="width: 100%; margin-left: 0px; margin-right: 0px;"/>');
		    
		    var tableSettings = {
			//"sPaginationType": "full_numbers",
			"iDisplayLength": 100,
			//"aaSorting" : [[1,'asc'],[2,'asc']],  // [[0,'asc']],
			"sDom": '<f><t><ip>',
			"aoColumns": [
			    {sTitle: "Method", mData: "name"}, 
			    {sTitle: "Quick Description", mData: "description", sWidth:"70%"},
			],
			"aaData": methodsData,
			"oLanguage": {
			    "sSearch": "&nbsp&nbspSearch Methods:&nbsp&nbsp",
			    "sEmptyTable": "No Narrative Methods listed."
			}
		    };
		    
		    var methodsTable = self.$elem.find('#methods-table').dataTable(tableSettings);
		},
		function(err) {
		    console.error(err);
		});
	}

    });
})( jQuery )
