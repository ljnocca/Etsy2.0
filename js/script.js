//* make home link more readabe or  button 
//* improve details page
//* adventure mode?

var url = 'https://openapi.etsy.com/v2/listings/'
var apiKey = 'puo5vvna7bdawlcb885za35d'

//************************
//CONTROLLER 
//************************
var EtsyRouter = Backbone.Router.extend({
	routes: {
		'home': 'showActiveListings', 
		'search/:query': 'searchEtsy', 
		'details/:id' : 'showDetails',
		'*default' : 'goHome'
	},

	showActiveListings: function(){
		var collectionInstance = new EtsyCollection()
		collectionInstance.fetch({
			dataType: 'jsonp',
			data:{
				'api_key': apiKey,
				includes : 'Images'
			}
		})
		new ListView({
			collection: collectionInstance
		})

	},
	searchEtsy: function(searchQuery){
		var collectionInstance = new EtsyCollection()
		collectionInstance.fetch({
			dataType: 'jsonp',
			data:{
				'api_key': apiKey,
				includes: 'Images',
				keywords: searchQuery
			}
		})
		new ListView({
			collection: collectionInstance
		})

	},
	showDetails: function(listingID){
		var modelInstance = new EtsyModel()
		modelInstance.url += listingID + '.js'
		modelInstance.fetch({
			dataType: 'jsonp',
			data:{
				'api_key': apiKey,
				includes: 'Images'

			}
		})
		new DetailsView({
			model: modelInstance
		})

	},
	goHome: function(){
		location.hash = 'home'
	}
})

//************************
//VIEWS 
//************************

var ListView = Backbone.View.extend({
	initialize: function(){
		document.querySelector('.content').innerHTML = '<img src="../default.gif" class="loader">'
		this.listenTo(this.collection, 'sync', this._render)
	},
	_render: function(){
		var containerNode = document.querySelector('.content')
		var html = ''

		this.collection.forEach(function(inputModel){
			var titleString = inputModel.get('title')
			if (titleString.length>25){
				titleString = titleString.substring(0,25)+"..."
			}

			html += '<div class="col-sm-4">'
			html += 	'<div class="summary">'
			html += 		'<a href="#details/'+ inputModel.get('listing_id')+'">'
			html += 			'<img class="summaryImage" src ='+ inputModel.get('Images')[0].url_570xN+'>'
			html += 			'<h4>' + titleString + '</h4>'
			html +=				'<h5>' + "$ " + inputModel.get('price') + '</h5>'
			html += 		'</a>'
			html += 	'</div>'
			html += '</div>'
		})
		containerNode.innerHTML = html
	}
})

var DetailsView = Backbone.View.extend({
	initialize: function(){
		document.querySelector('.content').innerHTML = '<img src="../default.gif" class="loader">'
		this.listenTo(this.model, 'sync', this._render)
	},
	_render: function(){
		var containerNode = document.querySelector('.content')
		var html = ''
			html += '<div class="details">'
			html += 	'<h2>' + this.model.get('title') + '</h2>'
			html += 	'<h4>$ ' + this.model.get('price') + '</h4>'
			html += 	'<img src="'+ this.model.get('Images')[0].url_570xN+'">'
			html += 	'<p class="description">' + this.model.get('description') + '</p>'
			html += 	'<button class="myButton"><a class="loButton" href="'+this.model.get('url')+'">Buy</button>'
			html += '</div>'
		containerNode.innerHTML = html
	}
})

//************************
//COLLECTION / MODELS 
//************************

var EtsyCollection = Backbone.Collection.extend({
	url: url + 'active.js',
	parse: function(apiResponse){
		console.log(apiResponse)
		return apiResponse.results
	}
})

var EtsyModel = Backbone.Model.extend({
	url: url,
	parse: function(apiResponse){
		console.log(apiResponse.results[0])
		return apiResponse.results[0]
	}
})

//************************
//SEARCH
//************************
var searchNode = document.querySelector('.search')

searchNode.addEventListener('keydown', function(eventObj) {
    if (eventObj.keyCode === 13) {
        var input = eventObj.target.value
        location.hash = "search/" + input
        eventObj.target.value = ''
    }
})

//**STARTING ROUTER & HISTORY**//
new EtsyRouter()
Backbone.history.start()