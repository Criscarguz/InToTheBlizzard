var searchButton = $('.searchButton')
var guildButton = $('.guildButton')
var guildMembersSelect = $('.guildMembers')
var guildSelect = $('.guildMembers')


	//FUNCION CLICK EN BUSCAR

searchButton.on('click', function(event){

	event.preventDefault()

	var mainInput = $('.generalInput').val()
	var mainSelect = $('.generalSelect').val()

	$.ajax({
		url: "https://eu.api.battle.net/wow/character/"+mainSelect+"/"+mainInput+"?fields=guild&locale=es_ES&apikey=kqbhvfayxz65tc8w52p4rh2dwwjqfaj3",
		dataType: 'json',
		success: generalInfo,
		error: error
	})

})

   // FUNCION DE ERROR

function error(){

	alert('¡ERROR!')
}

	// FUNCION DE SUCCESS

function generalInfo (data){

	var resultsDiv = $('.results')

	resultsDiv.empty()
	guildMembersSelect.empty()
	$('.memberResult').empty()

	var name = ('<h2>' + data.name + '</h2>')
	var pictureURL = "https://render-api-eu.worldofwarcraft.com/static-render/eu/"
	var picture = ("<img src="+(pictureURL)+(data.thumbnail)+">")
	var guild = (data.guild.name)
	var guildResult = ("<h3>Hermandad:<h3 class='guildName'> "+guild+"</h3></h3>")
	var honorableKills = ("<h4 class='kills'>Muertes honorables: "+(data.totalHonorableKills)+"</h4>")
	var logros = ("<h4 class='achievements'>Puntos de logros: "+(data.achievementPoints)+"</h4>")

	resultsDiv.append(name, picture,guildResult, honorableKills, logros)

}

	//FUNCION GUILDMEMBERS

guildButton.on('click', function(event){

	event.preventDefault()

	var guildName = $(".guildName")[0].innerHTML
	var mainSelect = $('.generalSelect').val()

	$.ajax({
		url: "https://eu.api.battle.net/wow/guild/"+mainSelect+"/"+guildName+"?fields=members&locale=es_ES&apikey=kqbhvfayxz65tc8w52p4rh2dwwjqfaj3",
		dataType: 'json',
		success: guildMembers,
		error: error

	})

})

function guildMembers (data){

	guildMembersSelect.empty()

	for (var i = data.members.length -1; i >= 0; i--) {

		if(data.members[i].character.level === 110){

			guildMembersSelect.append("<option>"+data.members[i].character.name+"</option>")

		}

	}
	
}

guildSelect.change( function(){

	var mainSelect = $('.generalSelect').val()
	guildSelect = $('.guildMembers').val()


	$.get("https://eu.api.battle.net/wow/character/"+mainSelect+"/"+guildSelect+"?fields=guild&locale=es_ES&apikey=kqbhvfayxz65tc8w52p4rh2dwwjqfaj3", function (dataV1){

		var memberResult = $('.memberResult')

		memberResult.empty()

		var name = ('<h2>' + dataV1.name + '</h2>')
		var pictureURL = "https://render-api-eu.worldofwarcraft.com/static-render/eu/"
		var picture = ("<img src="+(pictureURL)+(dataV1.thumbnail)+">")
		var honorableKills = ("<h4 class='memberKills'>Muertes honorables: "+(dataV1.totalHonorableKills)+"</h4>")
		var logros = ("<h4 class='memberAchievements'>Puntos de logros: "+(dataV1.achievementPoints)+"</h4>")

		memberResult.append(name, picture, honorableKills, logros)

	})

})

$('.batalla').on('click', function holis (a) {
var achievements = parseInt($('.achievements').text().match(/\d+/)[0])
var achievementsMember = parseInt($('.achievementsMember').text().match(/\d+/)[0])
var kills = parseInt($('.kills').text().match(/\d+/)[0])
var memberKills = parseInt($('.memberKills').text().match(/\d+/)[0])
if (achievements > achievementsMember){
	$('.asd').append ("<p>hola</p>")

}else {
	$('.asd').append ("<p>adios</p>")

}
})