var debugging = false;

/* Disabling the browser back button. The program state is messed up when navigating with the browser
   buttons instead of the intended means in the app. It's Friday and I have no stamina to fix the state problem
   in this mess. Taking the stackoverflow pill: https://stackoverflow.com/a/34337617/2091625
*/
history.pushState(null, document.title, location.href);
window.addEventListener('popstate', function (event) {
    history.pushState(null, document.title, location.href);
});

var shuffleArray = function (array) {
	var m = array.length, t, i;

	// While there remain elements to shuffle
	while (m) {
		// Pick a remaining element…
		i = Math.floor(Math.random() * m--);
		// And swap it with the current element.
		t = array[m];
		array[m] = array[i];
		array[i] = t;
	}
	return array;
}

var validateAge = function(age){
	return /\d{1,3}/.test(value);
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

var isOK = function (t){
		if (t === undefined) {return false;}
		else {return t != "";}
}

var nId = function(id) {
	return id < 0 ? '_'+Math.abs(id) : ''+id;
}

var xml2form = function (xml) {
	var	parser = new DOMParser();
	var	xmlDoc = parser.parseFromString(xml, "application/xml");
	var	xmlDocStatementNodes = xmlDoc.getElementsByTagName("input");
	var forms = [];

	for (i = 0; i < xmlDocStatementNodes.length; i++) {
		var el = xmlDocStatementNodes[i];
		var type = el.getAttribute('type'); //ok
		var req = el.getAttribute('required'); //ok
		if (isOK(req)) {
			req = req == "true" ? true : false;
		}
		var key = el.getAttribute('key');// ok
		var label = el.getElementsByTagName('label')[0].childNodes[0].nodeValue;
		
		var form = {};
		form.key = key;
		form.type = type;
		form.templateOptions = {};
		if (isOK(label)){
			form.templateOptions.label = label;
		}
		if (isOK(req)){
			form.templateOptions.required = req;
		}

		if (type == 'select' || type == 'radio' || type == 'multiCheckbox') {
			var options = el.getElementsByTagName('option');
			form.templateOptions.options = [];
			for (let opt of options) {
				if (isOK(opt)) {
					var opt_name = opt.getAttribute('name');
					var opt_value = opt.childNodes[0].nodeValue;
					if (type == 'multicheckbox') {
						form.templateOptions.options.push({title:opt_name,value:opt_value});
					}
					else if (isOK(opt_name)&&isOK(opt_value)) {
						form.templateOptions.options.push({name:opt_name,value:opt_value});
					} else if (isOK(opt_value)&&!isOK(opt_name)) {
						form.templateOptions.options.push({name:opt_value,value:opt_value});
					}
				}
			}
		} 
		forms.push(form);
	}
	return forms;
}

var xml2html = function (xml) {
	var	parser = new DOMParser();
	var	xmlDoc = parser.parseFromString(xml, "application/xml");

	if (xmlDoc.documentElement.nodeName == "parsererror") {
		return {};
	}

	var	xmlDocStatementNodes = xmlDoc.getElementsByTagName("page");
	var pages = [];

	for (i = 0; i < xmlDocStatementNodes.length; i++) {
		var el = xmlDocStatementNodes[i];
		pages.push (el); 
	}
	return pages;
}


//Warning for future maintainers: for some reason, the column was growing bigger
//than value set here, so (rows-1)+3 basically works around this issue
 // 32 is the height of the cell
var workAroundpx = function(rows){
	return (rows*32) - rows+2;
}
var generateMyTd = function(id, rows, colour) {
	var toptd = document.createElement('td');
	// toptd attr	
	var toptdstyle = document.createAttribute('style');
	toptdstyle.value = "vertical-align:top";
	toptd.setAttributeNode(toptdstyle);

	var topdiv = document.createElement('div');
	// topdiv attr	
	var topdivStyle = document.createAttribute('style');
	topdivStyle.value = "width:150px;padding-right:10px;";
	topdiv.setAttributeNode(topdivStyle);

	var carddiv = document.createElement('div');
	// carddiv attr	
	var carddivClass = document.createAttribute('class');
	carddivClass.value = "card";
	carddiv.setAttributeNode(carddivClass);

	var cardheaderdiv = document.createElement('div'); 
	// cardheaderdiv attr	
	var cardheaderdivclass = document.createAttribute('class');
	cardheaderdivclass.value = "card-header";
	cardheaderdiv.setAttributeNode(cardheaderdivclass);
	cardheaderdiv.setAttribute("style",
	"background-image:\
	 linear-gradient(to bottom,"+colour+" 0,"+colour+" 100%)!important;"); //border-color

	var cardtitleh3 = document.createElement('h3');
	// cardtitleh3 attr	
	var cardtitleh3class = document.createAttribute('class');
	cardtitleh3class.value	= "card-title";
	var cardtitleAlign = document.createAttribute('align');
	cardtitleAlign.value = "center";
	var cardtitleTextNode = document.createTextNode(id);
	cardtitleh3.setAttributeNode(cardtitleh3class);
	cardtitleh3.setAttributeNode(cardtitleAlign);
	cardtitleh3.appendChild(cardtitleTextNode);

	var innerul = document.createElement('ul');
	// innerul attr	
	var innerulDndListAttr = document.createAttribute('dnd-list');
	innerulDndListAttr.value = "ratings.rating" + nId(id);
	var innerulDndDropAttr = document.createAttribute('dnd-drop');
	innerulDndDropAttr.value = "dropCallback(index, item, external, type)";
  var innerulDndDisableIfAttr = document.createAttribute('dnd-disable-if');
	innerulDndDisableIfAttr.value = "ratings.rating"+nId(id)+".length >=" + rows;
	var innerulStyleAttr = document.createAttribute('style');
	innerulStyleAttr.value = "height: " + workAroundpx(rows) + 'px';
  innerul.setAttributeNode(innerulDndListAttr);
  innerul.setAttributeNode(innerulDndDropAttr);
	innerul.setAttributeNode(innerulDndDisableIfAttr);
	innerul.setAttributeNode(innerulStyleAttr);

	var tooltipdiv = document.createElement('div');
	// tooltipdiv attr	
	var tooltipdivTooltipsTemplateAttr =
	 document.createAttribute('tooltip-template');
	tooltipdivTooltipsTemplateAttr.value = 
	   "<div class='ttiptext'>{{statement.statement}}</div>";
	var tooltipdivTooltipSideAttr =
	 document.createAttribute('tooltip-side');
	tooltipdivTooltipSideAttr.value = "right";
	var tooltipdivTooltipSizeAttr = 
	 document.createAttribute('tooltip-size');
	tooltipdivTooltipSizeAttr.value = "large";
	var tooltipdivNgRepeat =
	 document.createAttribute('ng-repeat');
	tooltipdivNgRepeat.value 
	 = "statement in "+"ratings.rating"+nId(id);
	tooltipdiv.setAttribute("tooltips",'');
	tooltipdiv.setAttributeNode(tooltipdivTooltipsTemplateAttr);
	tooltipdiv.setAttributeNode(tooltipdivTooltipSideAttr);
	tooltipdiv.setAttributeNode(tooltipdivTooltipSizeAttr);
	tooltipdiv.setAttributeNode(tooltipdivNgRepeat);

	var innerli = document.createElement('li');
	// innerli attr	
	//innerli attributes
	var innerliDndDraggableAttr = document.createAttribute
		('dnd-draggable');
	innerliDndDraggableAttr.value = "statement";
	var innerliDndMovedAttr = document.createAttribute
		('dnd-moved');
  innerliDndMovedAttr.value = "movedCallback(ratings.rating"+nId(id)+",$index)";
	var innerliDndEfctAlwdAttr = document.createAttribute
	('dnd-effect-allowed');
	innerliDndEfctAlwdAttr.value = "move";
	var innerliNgStyle = document.createAttribute
	('ng-style');
	innerliNgStyle.value = "getStyle(statement)";
	var innerliTextNode = document.createTextNode
		("{{ statement.statement|truncate:10 }}");
	innerli.setAttributeNode(innerliDndDraggableAttr);
	innerli.setAttributeNode(innerliDndMovedAttr);
	innerli.setAttributeNode(innerliDndEfctAlwdAttr);
	innerli.setAttributeNode(innerliNgStyle);
	innerli.appendChild(innerliTextNode);

	var placeholderli = document.createElement('li');
	// placeholderli attr	
	var placeholderliClass = document.createAttribute("class");
	placeholderliClass.value="dndPlaceholder";
	var placeholderliStyle = document.createAttribute("style");
	placeholderliStyle.value="display: none;";
	placeholderli.setAttributeNode(placeholderliClass);
	placeholderli.setAttributeNode(placeholderliStyle);
	

	tooltipdiv.appendChild(innerli);
	innerul.appendChild(tooltipdiv);
	innerul.appendChild(placeholderli);
	cardheaderdiv.appendChild(cardtitleh3);
	carddiv.appendChild(cardheaderdiv);
	carddiv.appendChild(innerul);
	topdiv.appendChild(carddiv);
	toptd.appendChild(topdiv);
	return toptd;
}

var getUrlParameter = function(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }

    return ''; // return empty string if parameter not found
};

var numberOfClassifiedStatements  = function(classifications) {
    return classifications.AGREE.length + classifications.NEUTRAL.length + classifications.DISAGREE.length;
};

var app = angular.module('qmethod', ['formly','formlyBootstrap','ui.router', 'angular.filter', 'dndLists', 'igTruncate', '720kb.tooltips']);

// ========== CONFIG
app.config(function ($stateProvider, $locationProvider) {

	$locationProvider.hashPrefix('');

	$stateProvider.state({
		name: 'step1',
		url: '/step1',
		templateUrl: 'templates/step1.html',
		controller: 'step1Ctrl',
		resolve: {
			'promisedata': ['$http', function($http){
				return $http.get('settings/survey.xml');
			}],
			'startingPages': ['$http', function($http){
				return $http.get('settings/startingPages.xml');
			}]
		}
	});

	$stateProvider.state({
		name: 'step3',
		url: '/step3',
		templateUrl: 'templates/step3.html',
		controller: 'step3Ctrl',
		resolve: {
			'promisedata': ['$http', function($http){
				return $http.get('settings/statements.xml');
			}]
		}
	});

	$stateProvider.state({
		name: 'step4',
		url: '/step4',
		templateUrl: 'templates/step4.html',
		controller: 'step4Ctrl',
		resolve: {
			'promisedata': ['$http', function($http){
				return $http.get('settings/map.xml');
			}]
		}
	});

	$stateProvider.state({
		name: 'step5',
		url: '/step5',
		templateUrl: 'templates/step5.html',
		controller: 'step5Ctrl'
	});

	$stateProvider.state({
		name: 'step6',
		url: '/step6',
		templateUrl: 'templates/step6.html',
		controller: 'step6Ctrl'
	});

	$stateProvider.state({
		name: 'step7',
		url: '/step7',
		templateUrl: 'templates/step7.html',
		controller: 'step7Ctrl'
	});
});

if (!angular.equals({},config)) {
  	  firebase.initializeApp(config);
	  var rootRef = firebase.database().ref();
}

  
// ========== CONTROLLERS
app.controller("appCtrl", function ($scope, $rootScope, $state) {
	$state.go('step1');
});

app.controller("step1Ctrl",['promisedata','startingPages',
		'$scope','$rootScope','$state','$sce',function
	   	(promisedata,startingPages,$scope,$rootScope,$state,$sce) {
	        $rootScope.formFields = xml2form(promisedata.data);
          $rootScope.starttime = Date.now();
	$scope.currentPageIndex = 0;
	$scope.pageData = xml2html(startingPages.data);
	$scope.debugging = angular.copy(debugging);
  	if (!angular.equals({},$scope.pageData)) {
		$scope.currentPage = $sce.trustAsHtml($scope.pageData[0].outerHTML);
		$scope.maxPages = $scope.pageData.length;
	} else {
		$scope.currentPage = $sce.trustAsHtml("<h3>Error parsing settings/startingPages.xml; Please, check for syntax errors.</h3>");
		$scope.maxPages = $scope.pageData.length;
	}

	$scope.changePage = function() {
		$scope.currentPage = $sce.trustAsHtml($scope.pageData[$scope.currentPageIndex].outerHTML);
	}

  $scope.next = function () {
		if ($scope.currentPageIndex+1 >= $scope.maxPages || debugging) {
			$state.go('step3');
		} else {
			$scope.currentPageIndex += 1;	
			$scope.changePage();
		}
	}
	$scope.back = function () {
		if ($scope.currentPageIndex-1 >= 0) {
			$scope.currentPageIndex -= 1;
			$scope.changePage();
		}
	}
}]);

app.controller("step3Ctrl",['promisedata','$scope', '$rootScope', '$state', function (promisedata, $scope, $rootScope, $state) {

	  statements = [];
	  $scope.debugging = angular.copy(debugging);
	  if (typeof $rootScope.statements == "undefined") {
		    parser = new DOMParser();
		    xmlDoc = parser.parseFromString(promisedata.data,"application/xml");
		    xmlDocStatementNodes = xmlDoc.getElementsByTagName("statement");
		    for (i=0; i < xmlDocStatementNodes.length; i++) {
			      el = xmlDocStatementNodes[i];
			      el_id = el.getAttribute('id');
            el_ebname = el.getAttribute('ebname');
            el_eburl = el.getAttribute('eburl');
			      el_value = el.childNodes[0].nodeValue;
			      statements.push({id: el_id, ebname: el_ebname, eburl: el_eburl, statement: el_value});
		    }
		    //Pick how many statements we have so we can use it for checks
		    $rootScope.numberOfStatements = 
			      JSON.parse(JSON.stringify(statements.length));
		    //shuffleArray(statements);
		    $rootScope.statements = JSON.parse(JSON.stringify(statements));
        $rootScope.statementsDone = 0;
	  }

    $scope.statementPrefix = "It is important to investigate";
    $scope.currentStatement = $rootScope.statements.shift();

	  $scope.classifications = {
		    'AGREE': [],
		    'NEUTRAL': [],
		    'DISAGREE': [],
	  };

	  /*Checks if $rootScope is already defined (the user had made his classifications)*/
	  if (typeof $rootScope.classifications == "undefined") {
		    if (typeof $rootScope.classifications_step3 != "undefined") {
		    }
		    $rootScope.classifications = $scope.classifications;
	  } else {
		    $scope.classifications = $rootScope.classifications;
	  }

	  $scope.hasNoCategory = function (statement) {
		    return statement.category != "undefined";
	  };

	  $scope.done = function () {
		    return $rootScope.statementsDone >= $rootScope.numberOfStatements;
	  };

	  $scope.next = function () {
		    $rootScope.classifications_step3 = JSON.parse(JSON.stringify($rootScope.classifications));
		    $state.go('step4');
	  };

	  $scope.back = function () {
        $rootScope.statements.push($scope.currentStatement);
		    $state.go('step1');
	  };

    if(!$scope.done()) {
     	  $('#helpModal').modal(show = true);
    }

	  if (debugging) {
		    $scope.help = function () {
			      for (var i = 0; i < 50 && ($rootScope.classifications.length != 0); ++i) {
				        var ii = i % 3;
				        var s = $rootScope.statements.shift();
				        if (ii == 0) {
					          s.category = "agree";
					          $scope.classifications.AGREE.push(s);
				        } else if (ii == 1) {
					          s.category = "neutral";
					          $scope.classifications.NEUTRAL.push(s);
				        } else if (ii == 2) {
					          s.category = "disagree";
					          $scope.classifications.DISAGREE.push(s);
				        }
			      }
		    };
		    $scope.help();
	  }

    $scope.statementsToGo = function() {
        return $rootScope.numberOfStatements - $rootScope.statementsDone;
    };

    $scope.disagree = function() {
        $scope.currentStatement.category = "disagree";
        $scope.classifications.DISAGREE.push($scope.currentStatement);
        $scope.currentStatement = $rootScope.statements.shift();
        $rootScope.statementsDone += 1;
    };

    $scope.neutral = function() {
        $scope.currentStatement.category = "neutral";
        $scope.classifications.NEUTRAL.push($scope.currentStatement);
        $scope.currentStatement = $rootScope.statements.shift();
        $rootScope.statementsDone += 1;
    };

    $scope.agree = function() {
        $scope.currentStatement.category = "agree";
        $scope.classifications.AGREE.push($scope.currentStatement);
        $scope.currentStatement = $rootScope.statements.shift();
        $rootScope.statementsDone += 1;
    };

	  $scope.dropAgreeCallback = function (index, item, external, type) {
		    item.category = "agree";
		    $scope.classifications.AGREE.push(item);

		    return true;
	  };

	  $scope.dropNeutralCallback = function (index, item, external, type) {
		    item.category = "neutral";
		    $scope.classifications.NEUTRAL.push(item);

		    return true;
	  };

	  $scope.dropDisagreeCallback = function (index, item, external, type) {
		    item.category = "disagree";
		    $scope.classifications.DISAGREE.push(item);

		    return true;
	  };
}]);

app.controller("step4Ctrl",['promisedata','$scope', '$rootScope', '$state','$compile', function (promisedata, $scope, $rootScope, $state, $compile) {

	  // //If user has distributed over normal distribution re-use it
	  $scope.ratings = [];
    $scope.rows = [];
	  $scope.classifications = JSON.parse(JSON.stringify($rootScope.classifications));
	  $scope.debugging = angular.copy(debugging);

    $scope.updateCurrentBin = function() {
        if($scope.ratings["rating3"].length < $scope.rows["rating3"]) {
            $scope.ratingLabel = "+3";
            $scope.ratingClass = "agree-gradient";
            $scope.currentBin = $scope.ratings["rating3"];
        } else if ($scope.ratings["rating_3"].length < $scope.rows["rating_3"]) {
            $scope.ratingLabel = "-3";
            $scope.ratingClass = "disagree-gradient";
            $scope.currentBin = $scope.ratings["rating_3"];
        } else if ($scope.ratings["rating2"].length < $scope.rows["rating2"]) {
            $scope.ratingLabel = "+2";
            $scope.ratingClass = "agree-gradient";
            $scope.currentBin = $scope.ratings["rating2"];
        } else if ($scope.ratings["rating_2"].length < $scope.rows["rating_2"]) {
            $scope.ratingLabel = "-2";
            $scope.ratingClass = "disagree-gradient";
            $scope.currentBin = $scope.ratings["rating_2"];
        } else if ($scope.ratings["rating1"].length < $scope.rows["rating1"]) {
            $scope.ratingLabel = "+1";
            $scope.ratingClass = "agree-gradient";
            $scope.currentBin = $scope.ratings["rating1"];
        } else if ($scope.ratings["rating_1"].length < $scope.rows["rating_1"]) {
            $scope.ratingLabel = "-1";
            $scope.ratingClass = "disagree-gradient";
            $scope.currentBin = $scope.ratings["rating_1"];
        } else if ($scope.ratings["rating0"].length < $scope.rows["rating0"]) {
            $scope.ratingLabel = "0";
            $scope.ratingClass = "neutral-gradient";
            $scope.currentBin = $scope.ratings["rating0"];
        }
    };

	  if (typeof $rootScope.ratings != "undefined"){
		    $scope.ratings = JSON.parse(JSON.stringify($rootScope.ratings));
		    $scope.classifications.AGREE = [];
		    $scope.classifications.NEUTRAL = [];
		    $scope.classifications.DISAGREE = [];
	  }
	  var smallerLabel = {};
		smallerLabel.value = 0;
		smallerLabel.rating_id = '';

	  var biggerLabel = {};
		biggerLabel.value = 0;
		biggerLabel.rating_id = '';

	  if (typeof $rootScope.table == "undefined") {
		    var tr_el = document.createElement('tr');

		    parser = new DOMParser();
		    xmlDoc = parser.parseFromString(promisedata.data, "application/xml");
		    xmlDocStatementNodes = xmlDoc.getElementsByTagName("column");
		    for (i = 0; i < xmlDocStatementNodes.length; i++) {
			      var el = xmlDocStatementNodes[i];
			      var el_id = parseInt(el.getAttribute('id'), 10);
			      var el_rating_id =  "rating"+ (el_id < 0 ? ('_'+Math.abs(el_id)) : el_id );
			      var el_colour = String(el.getAttribute('colour'));
			      var el_rows = parseInt(el.childNodes[0].nodeValue, 10);
			      if (el_colour != "null" && el_id != "NaN" && el_rows != "NaN") {
				        if (el_id < smallerLabel.value){
					          smallerLabel.value = el_id;
					          smallerLabel.rating_id = el_rating_id;
				        }
				        if (el_id > biggerLabel.value){
					          biggerLabel.value = el_id;
					          biggerLabel.rating_id = el_rating_id;
				        }
				        tr_el.appendChild(generateMyTd(el_id,el_rows,el_colour));
				        $scope.ratings[el_rating_id] = [];
                $scope.rows[el_rating_id] = el_rows;
			      }
		    }

		    $rootScope.table = tr_el;
		    $rootScope.ratingsNegExt = smallerLabel.rating_id;
		    $rootScope.ratingsPosExt = biggerLabel.rating_id;
		    $rootScope.ratingsPosExtId = biggerLabel.value;
		    $rootScope.ratingsNegExtId = smallerLabel.value;
	  }

	  if ((typeof $rootScope.tablecompiled == "undefined") &&
	      typeof $rootScope.table != "undefined") {
		    //HIC SUNT DRACONES
		    //Compile table
		    var cpy = $rootScope.table.cloneNode(true);
		    var linkFn = $compile(cpy);
		    //Link table
		    var content = linkFn($scope);
		    //Store table into rootscope
		    $rootScope.tablecompiled = content[0];
	  }

	  if ($rootScope.table != "undefined"){
		    var table = document.getElementsByTagName('table')[0];
		    while (table.firstChild) {
			      table.removeChild(table.firstChild);
		    }

		    table.append($rootScope.tablecompiled);
	  }

    $scope.updateCurrentBin();

    $scope.movedAgreeCallback = function(index) {
        $scope.classifications.AGREE.splice(index, 1);
        $scope.updateCurrentBin();
    };

    $scope.movedNeutralCallback = function(index) {
        $scope.classifications.NEUTRAL.splice(index, 1);
        $scope.updateCurrentBin();
    };

    $scope.movedDisagreeCallback = function(index) {
        $scope.classifications.DISAGREE.splice(index, 1);
        $scope.updateCurrentBin();
    };

	  $scope.dropAgreeCallback = function (index, item, external, type) {
		    var ret = item.category == "agree";
		    if (ret) {
			      $scope.classifications.AGREE.push(item);
            $scope.updateCurrentBin();
		    }
		    return ret;
	  };

	  $scope.dropNeutralCallback = function (index, item, external, type) {
		    var ret = item.category == "neutral";
		    if (ret) {
			      $scope.classifications.NEUTRAL.push(item);
            $scope.updateCurrentBin();
		    }
		    return ret;
	  };

	  $scope.dropDisagreeCallback = function (index, item, external, type) {
		    var ret = item.category == "disagree";
		    if (ret) {
			      $scope.classifications.DISAGREE.push(item);
            $scope.updateCurrentBin();
		    }
		    return ret;
	  };

	  $scope.done = function () {
		    var numberOfStatements = 0;
		    for (var key in $scope.ratings) {
			      if ($scope.ratings.hasOwnProperty(key)) {
				        numberOfStatements += $scope.ratings[key].length;
			      }
		    }
		    return numberOfStatements == $rootScope.numberOfStatements;
	  };

	  $('#helpModal').modal(show = true);

	  $scope.getStyle = function(statement) {
		    if(statement.category == "agree") {
			      return {"background-color":"#00A848"};
		    } else if (statement.category == "neutral") {
			      return {"background-color":"#BAB9B9"};
		    } else {
			      return {"background-color":"#FF6666"};
		    }
	  };

	  $scope.next = function () {
		    //Copy ratings defined on this step to rootScope so we can send later
		    $rootScope.ratings = Object.assign({}, $scope.ratings);
		    delete $rootScope.tablecompiled;
		    $state.go('step5');
	  };

    $scope.movedCallback = function(ratingBin, index) {
        ratingBin.splice(index, 1);
        $scope.updateCurrentBin();
    };

	  $scope.dropCallback = function (index, item, external, type) {
		    return item;
	  };

    $scope.chooseStatement = function(index, item) {
        let chosenStatement = [];

        if(item.category == "disagree") {
            chosenStatement = $scope.classifications.DISAGREE.splice(index, 1);
        } else if(item.category == "agree") {
            chosenStatement = $scope.classifications.AGREE.splice(index, 1);
        } else if(item.category == "neutral") {
            chosenStatement = $scope.classifications.NEUTRAL.splice(index, 1);
        }

        if(chosenStatement.length == 1) { //should always be the case
            $scope.currentBin.push(chosenStatement[0]);
            $scope.updateCurrentBin();
        }
    };

	  if (debugging) {
		    $scope.help = function() {
			      var concatlists = [];
			      concatlists = concatlists.concat($scope.classifications.AGREE,
					                                   $scope.classifications.NEUTRAL ,
					                                   $scope.classifications.DISAGREE);
			      $scope.classifications.AGREE = [];
			      $scope.classifications.NEUTRAL = [];
			      $scope.classifications.DISAGREE = [];
			      for(var i = 0; i < 2; ++i){
				        $scope.ratings.rating3.push(concatlists.shift());
				        $scope.ratings.rating_3.push(concatlists.shift());
			      }
			      for(var i = 0; i < 6; ++i){
				        $scope.ratings.rating2.push(concatlists.shift());
				        $scope.ratings.rating_2.push(concatlists.shift());
			      }
			      for(var i = 0; i < 10; ++i){
				        $scope.ratings.rating1.push(concatlists.shift());
				        $scope.ratings.rating_1.push(concatlists.shift());
			      }
			      for(var i = 0; i < 14; ++i){
				        $scope.ratings.rating0.push(concatlists.shift());
			      }
		    }
		    $scope.help();
	  }
}]);

app.controller("step5Ctrl", function ($scope, $rootScope, $state) {

//		$rootScope.ratingsNegExt = smallerLabel.rating_id;
//		$rootScope.ratingsPosExt = biggerLabel.rating_id;
	$scope.positiveExtreme = $rootScope.ratingsPosExtId;
	$scope.negativeExtreme = $rootScope.ratingsNegExtId;
	$scope.debugging = angular.copy(debugging);
	var negativeExtremesArr = $rootScope.ratings[$rootScope.ratingsNegExt];
	var positiveExtremesArr = $rootScope.ratings[$rootScope.ratingsPosExt];
	if (typeof $rootScope.explanations == "undefined") {
		var posextremeExplanations = [];
		var negextremeExplanations = [];
		for (var key in negativeExtremesArr) {
			negextremeExplanations.push({statement:negativeExtremesArr[key],explanation:""});
		}
		for (var key in positiveExtremesArr) {
			posextremeExplanations.push({statement:positiveExtremesArr[key],explanation:""});
		}
		$rootScope.explanations = {
			agree: posextremeExplanations,
			disagree: negextremeExplanations
		};
	}

	if (debugging) {
		for (let obj of $rootScope.explanations.agree) {
			obj.explanation = "TEST EXPLANATION";
		}
		for (let obj of $rootScope.explanations.disagree) {
			obj.explanation = "TEST EXPLANATION";
		}
	}

	$('#helpModal').modal(show = true);

	$scope.done = function () {
		var explanationsDone = 1;
		for (var key in $rootScope.explanations.agree){
			//prevent overflow
			explanationsDone = explanationsDone *
			($rootScope.explanations.agree[key].explanation.length > 0  ? 1 : 0);
		}
		for (var key in $rootScope.explanations.disagree){
			explanationsDone = explanationsDone*
			($rootScope.explanations.disagree[key].explanation.length > 0 ? 1 : 0); } return explanationsDone > 0;
	}

	$scope.next = function () {
		$state.go('step6');
	}

	String.prototype.isEmpty = function () {
		return (this.length === 0 || !this.trim());
	};
});

app.controller("step6Ctrl",['$scope', '$rootScope', '$state', function ($scope, $rootScope, $state) {

	var vm = this;
	vm.model = {};
	vm.onSubmit = $scope.onSubmit;
	vm.userForm = $scope.userForm;
	vm.userFields = $rootScope.formFields;
	$scope.debugging = angular.copy(debugging);

	$scope.submit = function() {
		$scope.send();
	}

	$scope.back = function () {
		$state.go('step5');
	}

	$scope.send = function () {
		var response = {
			classifications: {
				'AGREE':[],
				'DISAGREE':[],
				'NEUTRAL':[]
			},
			ratings: {},
			explanations: {agree:[],disagree:[]},
			questionnaire: {},
        metadata: {
            //ip: '',
            starttime: '',
            endtime: '',
            pilot: false,
            referral: ''}
		}
		response.questionnaire = angular.copy(vm.model);

		// Send classifications statement only
		angular.forEach($rootScope.classifications_step3, function(value, key) {
			for(let stat of $rootScope.classifications_step3[key]) {
				response.classifications[key].push(stat.id);
			}
		});

		//Send ratings but with statement id only
		angular.forEach($rootScope.ratings, function(value, key) {
			for(let stat of $rootScope.ratings[key]) {
				if(response.ratings[key] === undefined) {
					response.ratings[key] = [];
				}
				response.ratings[key].push(stat.id);
			}
		});

		//Send explanations text paired with staexplanationstement id only
		for (let exp of $rootScope.explanations.agree){
			response.explanations.agree.push({statementId:exp.statement.id,text:exp.explanation});
		}
		for (let exp of $rootScope.explanations.disagree){
			response.explanations.disagree.push({statementId:exp.statement.id,text:exp.explanation});
		}

      // Dont't store the IP anymore since this API seems to be blocked by AD blockers,
      // resulting in that the data is not stored and we don't get to step 7.
      // $.getJSON("https://api.ipify.org?format=jsonp&callback=?", function(json) {
      //    response.metadata.ip = json.ip;
          response.metadata.referral = getUrlParameter('ref');
          response.metadata.starttime = $rootScope.starttime;
          response.metadata.endtime = Date.now();
          if (typeof rootRef != "undefined") {
			        rootRef.push(response, function (error) {
				          if (error) {
					            alert("Couldn't send data to firebase. Cause:"+error);
					            $scope.send();
					            return;
				          } else {
					            $state.go('step7');
				          }
			        });
		      } else {
			        console.log (JSON.stringify(response));
		      }
      //});
	}

}]);

app.controller("step7Ctrl", function ($scope, $rootScope, $state) {
	  $scope.debugging = angular.copy(debugging);

    $scope.ebs= [];
    for (let rating of $rootScope.ratings.rating3) {
        let ebName = rating.ebname;
        let ebUrl = rating.eburl;
        $scope.ebs.push({ebName: ebName, ebUrl: ebUrl});
    }


});
