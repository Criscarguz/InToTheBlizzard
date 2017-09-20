var searchButton = $('.searchButton')

searchButton.on('click', function(event){

	event.preventDefault()

	var mainInput = $('.generalInput').val()

	$.ajax({
		url: "https://eu.api.battle.net/d3/profile/Retorcito-2859/?locale=es_ES&apikey=kqbhvfayxz65tc8w52p4rh2dwwjqfaj3",
		dataType: 'json',
		success: generalInfo,
		error: error
	})
})

function error(){

	alert('¡ERROR!')
}

function generalInfo (data){

	var resultsDiv = $('.results')

	resultsDiv.empty()

	var name = ('<h2>Heroes:' + data.heroes[0].name + '</h2>')
	var pictureURL = "https://render-api-eu.worldofwarcraft.com/static-render/eu/"
	var picture = ("<img src="+(pictureURL)+(data.thumbnail)+">")
	var guild = (data.guildName)
	var guildResult = ("<h3>Hermandad:<h3 class='guildName'> "+guild+"</h3></h3>")

	resultsDiv.append(name, picture,guildResult)

}