const canvas = document.querySelector ("canvas");
const ctx = canvas.getContext ("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var SpaceShipArr = ["SpaceShip.png","Cat.png","Run.png","Aries.png","UFO.png"]
var SpaceShipImg = "radio0";


var spaceShip = [];
var bullets = [];

init ();

base_image = new Image();
base_image.src = document.getElementById(SpaceShipImg).value;
base_image.onload;

boom_image = new Image();
boom_image.src = 'Boom.png';
boom_image.onload;

var shotVolume = 100;
var backgroundVolume = 100;
var boomVolume = 100;

function init () {
	SpaceShipArr.forEach ((item, index) => {
			$("#chooseCharSpaceShip").append (
				'<label class="itemGrid"><input id="radio'+index+'" type="radio" name="SpaceShipName" value="SpaceShip/'+SpaceShipArr[index]+'"><img src="SpaceShip/'+SpaceShipArr[index]+'"></label>'
			);
	});
	//document.getElementById("radio0").checked = true;
}


const mouse = {
	x : 0,
	y : 0,
};

var Score = 0;
var CreatFrame = false;
var CanPlay = false;

var myAudio = document.getElementById ("audioBG");
myAudio.load ();
var shotAudio = document.getElementById ("audioShoot");
shotAudio.load ();
var boomAudio = document.getElementById ("audioBoom");
boomAudio.load ();

var speedSpaceShip = 0.9;

function SpaceShipVt (x,y) {
	this.x = x;
	this.y = y;
	this.update = () => {
		this.x -= speedSpaceShip;
		ctx.drawImage(base_image, this.x, this.y);
	}
}

function bullet (x,y) {
	this.x = x;
	this.y = y;
	this.update = () => {
		this.x += 3;
		ctx.beginPath();
		ctx.arc(this.x, this.y, 5, 0, Math.PI * 2, false);
		ctx.fillStyle = "#3D6EF7";
    	ctx.fill();
		ctx.closePath();
	}
}

function CreatBullet (x,y) {
	bullets.push (new bullet (x,y));
}

var TimeCreateSpaceShip = 2010;

function LevelUp () {
	if (CanPlay) {
		setTimeout (LevelUp,10000);
		if (TimeCreateSpaceShip > 1000)
			TimeCreateSpaceShip -= 10;
		speedSpaceShip += 0.1;
	}
}

function CreatSpaceShip () {
	if (CanPlay) {
		setTimeout (CreatSpaceShip,TimeCreateSpaceShip);
		if (CreatFrame)
			spaceShip.push (new SpaceShipVt (window.innerWidth, Math.random() * (window.innerHeight - 100)));
	}
}

function Finish () {
	spaceShip = [];
	bullets = [];
	myAudio.pause ();
	TimeCreateSpaceShip = 2010;
	speedSpaceShip = 0.9;
	document.getElementById ("Score").textContent = "Score: "+Score;
	Score = 0;
	document.body.style.backgroundColor = "black";
	canvas.style.display = "none";
	document.querySelector ("#FinishGame").style.display = "flex";
	//ctx.clearRect(0, 0, canvas.width, canvas.height);
	CreatFrame = false;
	CanPlay = false;
}

function animate() {
	if (CanPlay) {
		requestAnimationFrame(animate);
		  if (CreatFrame) {
			  ctx.fillStyle = "rgba(0,0,0,0.05)";
			  ctx.fillRect(0, 0, canvas.width, canvas.height);
			  
			  spaceShip.forEach((item, index) => {
			  	if (item.x < 0) {
			  		Finish ();
			  	}

			  	item.update ();
			  });
			  bullets.forEach((item, index) => {
			  	spaceShip.forEach((item2, index2) => {
			  		if (item.x >= item2.x && item.x <= item2.x + base_image.width && item.y >= item2.y && item.y <= item2.y + base_image.height) {
			  			boomAudio.load ();
			  			boomAudio.play ();
			  			ctx.drawImage(boom_image, item2.x, item2.y);
			  			spaceShip.splice(index2, 1);
			  			bullets.splice(index, 1);
			  			Score++;
			  		}
			  	});
			  	if (item.x > window.innerWidth) {
			  		bullets.splice(index, 1);
			  	}
			  	item.update ();
			  });
			  
			  ctx.fillStyle = "white";
			  ctx.font = "25px Arial";
			  ctx.fillText ("Score: "+Score,4,28);  
			  ctx.font = "16px Arial";
			  ctx.fillText ("Spaceship's flight speed: "+speedSpaceShip.toFixed(1),4,window.innerHeight-15); 
			  ctx.fillText ("New monster creation time: "+TimeCreateSpaceShip+" milisecond",4,window.innerHeight-32); 	
			  
		  }
	}
}



window.addEventListener('focus', () => CreatFrame = true);
window.addEventListener('blur', () => CreatFrame = false);

function PlayGame () {
	CreatFrame = true;
	CanPlay = true;
	document.querySelector ("#readyScreen").style.display = "none";
	canvas.style.display = "";
	animate ();
	CreatSpaceShip ();
	myAudio.load ();
	myAudio.play ();
	document.body.style.backgroundColor = "white";
	LevelUp ();
}

function Setting() {
	document.querySelector ("#readyScreen").style.display = "none";
	document.querySelector ("#settingScreen").style.display = "flex";
	document.getElementById("backgroundVolume").value = backgroundVolume;
	document.getElementById("shotVolume").value = shotVolume;
	document.getElementById("boomVolume").value = boomVolume;
	document.getElementById('backgroundVolume_label').innerHTML = 'Background volume (' + backgroundVolume/100 + ')';
	document.getElementById('shotVolume_label').innerHTML = 'Shot volume (' + shotVolume/100 + ')';
	document.getElementById('boomVolume_label').innerHTML = 'Boom volume (' + boomVolume/100 + ')';
	
}

function ChangeSpaceShip () {
	document.getElementById ('settingScreen').style.display = 'none';	
	document.getElementById ('changeSpaceShip').style.display = 'flex';	
	document.getElementById(SpaceShipImg).checked = true;
}

function ApplySpaceShip () {
	SpaceShipImg = document.querySelector('input[name="SpaceShipName"]:checked').id;
	base_image.src = document.getElementById(SpaceShipImg).value;
	base_image.onload;
	Swal.fire(
	  'Successful Confirmation',
	  'Successful confirmation, press "Return" to return to the setting screen.',
	  'success'
	)
}


var frameAlert = 50;
var alertColor;
var stringAlert;
var widthAlert;



function alertGame () {
	if (frameAlert > 0) {
		requestAnimationFrame(alertGame);
		frameAlert-=1;
		ctx.fillStyle = alertColor;
		ctx.fillRect(window.innerWidth - widthAlert - 10, 10, widthAlert, 75);
		ctx.font = "20px Arial";
		ctx.fillStyle = "white";
		ctx.fillText(stringAlert, window.innerWidth - widthAlert, 50);
	}
	else frameAlert = 50;
}

function Apply () {
	backgroundVolume = document.getElementById("backgroundVolume").value;
	shotVolume = document.getElementById("shotVolume").value;
	boomVolume = document.getElementById("boomVolume").value;
	myAudio.volume = backgroundVolume/100;
	shotAudio.volume = shotVolume/100;
	boomAudio.volume = boomVolume/100;
	Swal.fire(
	  'Successful Confirmation',
	  'Successful confirmation, press "Return" to return to the homepage.',
	  'success'
	)
}

var Shoter = true;

window.addEventListener ("click", function (event) {
	if (canvas.style.display != "none") {
		if (Shoter) {
			Shoter = false;
			setTimeout (() => {
				Shoter = true;
			},750);
			CreatBullet (0, event.clientY);
			shotAudio.load();
			shotAudio.play();
		}
		else {
			alertGame ();
			stringAlert = "You shoot bullets too fast";
			widthAlert = 250;
			alertColor = "rgba(255, 99, 71, 0.1)";		
		}
	}
});

window.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        Finish ();
    }
});
