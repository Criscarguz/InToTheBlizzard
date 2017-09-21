let searchButton = $('.searchButton')
let selectClass =$('.selectClass')
let deckSelected=[]
let provider = new firebase.auth.GoogleAuthProvider()
let user = undefined
let database = firebase.database()
let deckUserSession ={}

	// FUNCION COMPROBAR SI ESTAS LOGEADO

function onload() {
	$('.logout').hide()
	
	firebase.auth().onAuthStateChanged(function(userAuth) {
	  if (userAuth) {
	    user = userAuth;
	    showWelcome()
	    console.log("USUARIO LOGEADO",user)
	  } else {
	  	logout()
	    console.log("No hay usuario logeado")
	  }
	})
}

	// SIGN IN INTO GOOGLE

function signIn(){
	firebase.auth().signInWithPopup(provider).then(function(result) {
	  // This gives you a Google Access Token. You can use it to access the Google API.
	  var token = result.credential.accessToken
	  // The signed-in user info.
	  user = result.user;
	  // ...
	  // showWelcome()
	}).catch(function(error) {
	  // Handle Errors here.
	  var errorCode = error.code
	  var errorMessage = error.message
	  // The email of the user's account used.
	  var email = error.email
	  // The firebase.auth.AuthCredential type that was used.
	  var credential = error.credential
	  // ...
	});



}


function showWelcome(){
	$('.sign').hide()
	$('.logout').show()
	$('#mydeck').show()
	readUserData()
	console.log("Usuario",user)
	$('.deckSelect').append("<h5 class= 'userName'>"+user.displayName+"</h5>")

	$('.deckSelect').append("<img class ='profileImg'src='"+user.photoURL+"'/>")

}
function logout (){

	firebase.auth().signOut().then(function() {

		$('.profileImg').remove()
		$('.userName').remove()
		$('.sign').show()
		$('.logout').hide()
		$('#mydeck').hide()


  // Sign-out successful.
	}).catch(function(error) {
  // An error happened.
	});
}


searchButton.on('click', function(event){

	event.preventDefault();

	let mainInput = $('.generalInput').val()

	$.ajax({
		url: "https://omgvamp-hearthstone-v1.p.mashape.com/cards/search/"+mainInput+"?locale=esES",
		dataType: 'json',
		success: generalInfo,
		error: error,
		beforeSend: function(xhr) {
		xhr.setRequestHeader("X-Mashape-Authorization", "RpHXCI5m0AmshwiGOTLAu7oXKqy3p1eQYCwjsn4DHWtcslkAn8")
		}
	});

});

$('#mydeck').on('change',function(){
	deckSelected =  deckUserSession[this.value].deck
	showDeck(deckUserSession[this.value].name)
})
selectClass.on('change', function(event){
	event.preventDefault()

	let selectClasses = $('.selectClass').val()
	deckSelected=[]
	showDeck()
	$.ajax({
		url: "https://omgvamp-hearthstone-v1.p.mashape.com/cards/classes/"+selectClasses+"?locale=esES",
		dataType: 'json',
		success: cardByClass,
		error: error,
		beforeSend: function(xhr) {
		xhr.setRequestHeader("X-Mashape-Authorization", "RpHXCI5m0AmshwiGOTLAu7oXKqy3p1eQYCwjsn4DHWtcslkAn8")
		}
	})
})

	// FUNCION DE ERROR

function error(){

	alert('Carta no encontrada.')
}

	// FUNCION BUSCAR CARTAS POR NOMBRE

function generalInfo (data){

	let resultsDiv = $('.results')

	resultsDiv.empty()

	for (let i = data.length - 1; i >= 0; i--) {
		
		let card= document.createElement("div")
		card.classList="col-3 hscard"

		let addButton= document.createElement("button")
		addButton.innerText="Añadir al mazo"
		addButton.classList="btn btn-primary"
		addButton.data=data[i]
		$(addButton).on('click', addCardToDeck)
		
		//FILTRO DE CARTAS
		
		if(data[i].type == "Minion" || data[i].type == "Spell" || data[i].type =="Enchantment" || data[i].type =="Weapon") {


			let name = '<h2 class="title">' + data[i].name+ '</h2>'
			//let image = '<div><img src="'+data[i].img+'"></div>'
			let image = new Image()
			image.onerror = (err) =>{
				image.src="./img/empty2.png"
			}
			image.src = data[i].img
			let divImage = document.createElement("div")
			divImage.append(image)
	 		card.innerHTML = name 
	 		card.append(divImage)
	 		card.append(addButton)
	 		resultsDiv.append(card)
		}

	}
	
}

	// FUNCION BUSCAR CARTAS POR CLASES

function cardByClass (data){
	console.log(data)

	let resultsDiv = $('.results')

	resultsDiv.empty()	
	for (let i = data.length - 1; i >= 0; i--) {
		
		let card= document.createElement("div")
		card.classList="col-3 hscard"

		let addButton= document.createElement("button")
		addButton.innerText="Añadir al mazo"
		addButton.classList="btn btn-primary"
		addButton.data = data[i]
		$(addButton).on('click', addCardToDeck)
		
		//FILTRO DE CARTAS
		
		if(data[i].type == "Minion" || data[i].type == "Spell" || data[i].type =="Enchantment" || data[i].type =="Weapon") {

			let name = '<h2 class="title">' + data[i].name+ '</h2>'
			let image = new Image()
			image.onerror = (err) =>{
				image.src="./img/empty2.png"
			}
			image.src = data[i].img
			let divImage = document.createElement("div")
			divImage.append(image)
	 		card.innerHTML = name
	 		card.append(divImage)
	 		card.append(addButton)
	 		resultsDiv.append(card)
		}

	}

}

 // FUNCIONES DE AÑADIR Y QUITAR CARTAS DEL MAZO

function addCardToDeck (){
	let cardSelected = this.data
	let count = 1
	if(totalCardInDeck() >= 30){
		return;
	}
	//FUNCION PARA COMPROBAR CONTADOR DE LAS CARTAS DEL MAZO
	deckSelected.forEach((item,position)=>{
		if(item.cardId == cardSelected.cardId){
			count = 2
			deckSelected.splice(position,1)
		}
	})	
	cardSelected.count = count
	deckSelected.push(cardSelected)
	showDeck()
}

	// FUNCION PARA COMPROBAR EL TOTAL DE CARTAS EN EL MAZO

function totalCardInDeck(){
	let totalCardDeck = 0
	deckSelected.forEach((item,position)=>{
		totalCardDeck+=item.count		
	})
	return totalCardDeck
}
	// QUITAR CARTAS DEL MAZO
function removeCardFromDeck(){
	let card = this.data
	let nameDeck = $('input#nameDeck').val()
	if(card.count == 2){
		card.count--
	}else{
		deckSelected.forEach((item,position)=>{
			if(item.cardId == card.cardId){
				count =2
				deckSelected.splice(position,1)
			}
		})
	}
	showDeck(nameDeck)
}

	// FUNCION PARA COLOCAR EL MAZO EN EL DIV

function showDeck(nameDeck){
	let deck = $('#deck')
	deck[0].innerHTML =""
	for (let i = deckSelected.length - 1; i >= 0; i--) {
		let card = document.createElement("div")
		card.innerText=deckSelected[i].count+" - "+deckSelected[i].name+"  "
		card.data=deckSelected[i]
		let faicon = document.createElement("i")
		faicon.classList="icon-remove"
		faicon.data = deckSelected[i]
		card.append(faicon)

		$(faicon).on("click",removeCardFromDeck)

		deck.append(card)
	}
	let totalCardDeck = document.createElement("div")
	totalCardDeck.innerText="Total cartas "+totalCardInDeck()
	deck.append(totalCardDeck)
	let addNameDeck = document.createElement("input")
	addNameDeck.id="nameDeck"
	addNameDeck.placeholder="Nombre Mazo"
	if(nameDeck){
		addNameDeck.value=nameDeck
	}
	deck.append(addNameDeck)
	let addButton= document.createElement("button")
	addButton.innerText="Guardar mazo"
	addButton.classList="saveDeck btn btn-primary"
	deck.append(addButton)
	let addDeleteButton= document.createElement("button")
	addDeleteButton.innerText="Borrar mazo"
	addDeleteButton.classList="deleteDeck btn btn-danger"
	deck.append(addDeleteButton)
	

	// BOTON GUARDAR MAZO

	let storageRef
	$('.saveDeck').on('click', writeUserData)
	$('.deleteDeck').on('click', deleteUserData)

}
function writeUserData() {
  if(!user){
  	signIn()
  	return
  }
  let uuid = generateUUID()
  let classDeck = $(".selectClass").val()
  let name = $("input#nameDeck").val().length==0 ? uuid : $("input#nameDeck").val()
  let newDeck = {
    deck: deckSelected,
    name: name,
    id:uuid,
    class:classDeck
  }
    $('#deck').empty()

  if(!deckUserSession){
  	deckUserSession ={}
  };


  deckUserSession[name] = newDeck
  firebase.database().ref('deck/' + user.uid+ "/" +name).set(newDeck).then(()=>{alert("Se ha guardado")},(err)=>{alert("No se ha guardado")})
  updateMyDeck()
}

	//FUNCION BORRAR MAZO

function deleteUserData (){
	let name = $("input#nameDeck").val()
	
	$('#deck').empty()

	firebase.database().ref('deck/' + user.uid+ "/" +name).remove()	

	readUserData()
	
}

	// LEER INFO DE LA BASE DE DATOS

function readUserData(){
	let userId = firebase.auth().currentUser.uid	
	firebase.database().ref('/deck/' + userId).once('value').then(function(items) {  	
		deckUserSession = items.val();	  
		updateMyDeck()
	})
}
function updateMyDeck() {

	let mydeck = $('#mydeck')
	mydeck.empty()
	let optionDeck = document.createElement("option")
	mydeck.append(optionDeck)
	for(let key in deckUserSession) {
 			let optionDeck = document.createElement("option")
  			optionDeck.value = deckUserSession[key].name
  			optionDeck.innerText = deckUserSession[key].name
  			optionDeck.data = deckUserSession[key]
  			mydeck.append(optionDeck)
  	}
}

	// GENERAR ID AUTOMATICAMENTE

function generateUUID () { 
    var d = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
        d += performance.now();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}