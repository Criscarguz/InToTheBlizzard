let searchButton = $('.searchButton')
let guildButton = $('.guildButton')
let guildMembersSelect = $('.guildMembers')
let guildSelect = $('.guildMembers')
let provider = new firebase.auth.GoogleAuthProvider()
let user



	// SIGN IN INTO GOOGLE
function signIn(){
	firebase.auth().signInWithPopup(provider).then(function(result) {
	  // This gives you a Google Access Token. You can use it to access the Google API.
	  var token = result.credential.accessToken;
	  // The signed-in user info.
	  user = result.user;
	  // ...
	  showWelcome();
	}).catch(function(error) {
	  // Handle Errors here.
	  var errorCode = error.code;
	  var errorMessage = error.message;
	  // The email of the user's account used.
	  var email = error.email;
	  // The firebase.auth.AuthCredential type that was used.
	  var credential = error.credential;
	  // ...
	});

}

function showWelcome(){
	$('.sign').hide()
	alert('Bienvenido '+ user.displayName)
}

	//FUNCION CLICK EN BUSCAR

searchButton.on('click', function(event){

	event.preventDefault()

	let mainInput = $('.generalInput').val()
	let mainSelect = $('.generalSelect').val()

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

	let resultsDiv = $('.results')

	resultsDiv.empty()
	guildMembersSelect.empty()
	$('.memberResult').empty()

	let name = ('<h2>' + data.name + '</h2>')
	let pictureURL = "https://render-api-eu.worldofwarcraft.com/static-render/eu/"
	let picture = ("<img src="+(pictureURL)+(data.thumbnail)+">")
	let guild = (data.guild.name)
	let guildResult = ("<h3>Hermandad:<h3 class='guildName'> "+guild+"</h3></h3>")
	let honorableKills = ("<h4 class='kills'>Muertes honorables: "+(data.totalHonorableKills)+"</h4>")
	let logros = ("<h4 class='achievements'>Puntos de logros: "+(data.achievementPoints)+"</h4>")
 console.log(data)
	resultsDiv.append(name, picture,guildResult, honorableKills, logros)
	$(".guild.hidden").removeClass("hidden")
	getGuildMember();

}

	//FUNCION GUILDMEMBERS

guildButton.on('click',getGuildMember )

function getGuildMember(event){
	if(event){
		event.preventDefault()
	}

	let guildName = $(".guildName")[0].innerHTML
	let mainSelect = $('.generalSelect').val()

	$.ajax({
		url: "https://eu.api.battle.net/wow/guild/"+mainSelect+"/"+guildName+"?fields=members&locale=es_ES&apikey=kqbhvfayxz65tc8w52p4rh2dwwjqfaj3",
		dataType: 'json',
		success: guildMembers,
		error: error

	})

}

function guildMembers (data){

	guildMembersSelect.empty()

	for (let i = data.members.length -1; i >= 0; i--) {

		if(data.members[i].character.level === 110){

			guildMembersSelect.append("<option>"+data.members[i].character.name+"</option>")

		}

	}
	
}

guildSelect.change( function(){

	let mainSelect = $('.generalSelect').val()
	guildSelect = $('.guildMembers').val()


	$.get("https://eu.api.battle.net/wow/character/"+mainSelect+"/"+guildSelect+"?fields=guild&locale=es_ES&apikey=kqbhvfayxz65tc8w52p4rh2dwwjqfaj3", function (dataV1){

		let memberResult = $('.memberResult')

		memberResult.empty()

		let name = ('<h2>' + dataV1.name + '</h2>')
		let pictureURL = "https://render-api-eu.worldofwarcraft.com/static-render/eu/"
		let picture = ("<img src="+(pictureURL)+(dataV1.thumbnail)+">")
		let honorableKills = ("<h4 class='memberKills'>Muertes honorables: "+(dataV1.totalHonorableKills)+"</h4>")
		let logros = ("<h4 class='memberAchievements'>Puntos de logros: "+(dataV1.achievementPoints)+"</h4>")

		memberResult.append(name, picture, honorableKills, logros)

	})

})

function holis (a) {
	var achievements = parseInt($('.achievements').text().match(/\d+/)[0])
	var achievementsMember = parseInt($('.achievementsMember').text().match(/\d+/)[0])
	var kills = parseInt($('.kills').text().match(/\d+/)[0])
	var memberKills = parseInt($('.memberKills').text().match(/\d+/)[0])

}