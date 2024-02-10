import playList from './playList.js';

const timeElem = document.querySelector('.time');
const dateElem = document.querySelector('.date');
const greetingElem = document.querySelector('.greeting');
const name = document.querySelector('.name');
const slideNextElem = document.querySelector('.slide-next');
const slidePrevElem = document.querySelector('.slide-prev');
const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather-description');
const windElem = document.querySelector('.wind');
const humidityElem = document.querySelector('.humidity');
const city = document.querySelector('.city');
const weatherError = document.querySelector('.weather-error');
const quoteElem = document.querySelector('.quote');
const authorElem = document.querySelector('.author');
const changeQuoteElem = document.querySelector('.change-quote');

const playListElem = document.querySelector('.play-list');
const playElem = document.querySelector('.play');
const playPrevElem = document.querySelector('.play-prev');
const playNextElem = document.querySelector('.play-next');
const audio = new Audio();
///////////////////////////////////////////////////////////////////////////////
const volumeListenerElem = document.querySelector('.volume-listener');
const volumeControllerElem = document.querySelector('.volume-controller');
const volumeSvg = document.querySelector('.volume');
const trackNameElem = document.querySelector('.track-name');
//////////////////////////////////////////////////////////////////////////////
const trackListenerElem = document.querySelector('.track-listener');
const trackControllerElem = document.querySelector('.track-controller');
const currentTimeElem = document.querySelector('.current-time');
const durationTimeElem = document.querySelector('.duration-time');

function showTimeAndDate() {
	const date = new Date();
	const options = {
		month: 'long',
		day: 'numeric',
		weekday: 'long',
	};
	//console.log(НЕ РАБОТАЕТ ПЕРЕМЕНА ПРИВЕТСВИЯ ПО ВРЕМЕНИ, ЧЕ С ЭТИМ ДЕЛАТЬ???);
	if (date.getSeconds() == 0 && date.getMinutes() == 0) {
		//Проверка на бэк
		showGreeting();
		setBackgroundImage();
	}
	dateElem.textContent = date.toLocaleString("en", options);
	timeElem.textContent = date.toLocaleTimeString();
	if (audio.duration == audio.currentTime) {
		playNext();
	}
	// console.log(getDurationInFormat(audio.currentTime));
}


function showGreeting() {
	const date = new Date();
	const hours = date.getHours();
	let time = '';
		if      (hours < 6) time = 'night';
		else if (hours < 12)time = 'morning'
		else if (hours < 18)time = 'afternoon';
		else                time = 'evening';
	greetingElem.textContent = `Good ${time}`;
}


function setBackgroundImage() {
	const date = new Date();
	const hours = date.getHours();	
	let randomNum = Math.floor(1 + Math.random() * 20);
	if (randomNum < 10) randomNum = "0" + randomNum;
	if      (hours < 6) document.body.style.backgroundImage = `url('https://raw.githubusercontent.com/Skrigan/momentum/main/night/${randomNum}.jpg')`;
	else if (hours < 12)document.body.style.backgroundImage = `url('https://raw.githubusercontent.com/Skrigan/momentum/main/morning/${randomNum}.jpg')`;
	else if (hours < 18)document.body.style.backgroundImage = `url('https://raw.githubusercontent.com/Skrigan/momentum/main/afternoon/${randomNum}.jpg')`;
	else                document.body.style.backgroundImage = `url('https://raw.githubusercontent.com/Skrigan/momentum/main/evening/${randomNum}.jpg')`;
}


function slideNext() {
	let prevBack = document.body.style.backgroundImage;
	let randomNum = prevBack.slice(-8, -6);
	if (randomNum == 20) randomNum = 1;
	else ++randomNum;
	if (randomNum < 10) randomNum = "0" + randomNum;
	const img = new Image();
	img.src = prevBack.slice(5, -8) + randomNum + prevBack.slice(-6, -2);
	img.onload = () => {
		document.body.style.backgroundImage = 'url(' + img.src + ')';
	};
}
function slidePrev() {
	let prevBack = document.body.style.backgroundImage;
	let randomNum = prevBack.slice(-8, -6);
	if (randomNum == 1) randomNum = 20;
	else --randomNum;
	if (randomNum < 10) randomNum = "0" + randomNum;
	const img = new Image();
	img.src = prevBack.slice(5, -8) + randomNum + prevBack.slice(-6, -2);
	img.onload = () => {
		document.body.style.backgroundImage = 'url(' + img.src + ')';
	};
}


async function getWeather() {
	const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=en&appid=08f2a575dda978b9c539199e54df03b0&units=metric`;
	// console.log('тик-так');
	try {
		const res = await fetch(url);
		const data = await res.json();
		weatherIcon.classList.add(`owf-${data.weather[0].id}`);
		temperature.textContent = `${Math.round(data.main.temp)}°C`;
		weatherDescription.textContent = data.weather[0].description;
		windElem.textContent = `Wind speed: ${Math.round(data.wind.speed)} m/s`;
		humidityElem.textContent = `Humidity: ${Math.round(data.main.humidity)}%`;
		weatherError.textContent = '';
	} catch(err) {
		weatherIcon.classList.remove(Array.from(weatherIcon.classList)[2]);
		temperature.textContent = '';
		weatherDescription.textContent = '';
		windElem.textContent = '';
		humidityElem.textContent = '';
		weatherError.textContent = `Error! city not found.`;
	}
}


function setLocalStorage() {
	localStorage.setItem('name', name.value);
	localStorage.setItem('city', city.value);
}
function getLocalStorage() {
	if(localStorage.getItem('name')) {
		name.value = localStorage.getItem('name');
	}
	if(localStorage.getItem('city')) {
		city.value = localStorage.getItem('city');
		getWeather();
	} else {
		city.value = 'Minsk';
		getWeather();
	}
}


let idIntervals = 0;
function setWeatherbyTime() {
	idIntervals = setInterval(getWeather, 180000);
}


async function getQuotes() {
	const quotes = 'quotes.json';
	const res = await fetch(quotes);
	const data = await res.json();
	let randomNum = Math.floor(Math.random() * data.length);
	quoteElem.textContent = `"${data[randomNum].text}"`;
	authorElem.textContent = data[randomNum].author;
}

function audioSetup () {
	for (let i = 0; i < playList.length; i++) {
		let li = document.createElement('li');
		li.classList.add('play-item');
		li.textContent = playList[i]['title'];
		playListElem.append(li);
		if (i == 0) {
			audio.src = playList[i]['src'];
			trackNameElem.textContent = playList[i]['title'];
			activePlayItem(playListElem.children[i]);
			trackControllerElem.style.width = '0%';
			currentTimeElem.textContent = '00:00';
			durationTimeElem.textContent = playList[i]['duration'];
			duration = setInterval(durationController, 200);
		}
	}
	playListElem.addEventListener('click',function (event) {
		playListPress (event);
	});
}

let isPaused = true;
function toggleAudio () {
	if (Array.from(playElem.classList).includes('pause')) {
		// clearInterval(duration);
		audio.pause();
		isPaused = true;
	} else {
		for (let i = 0; i < playList.length; i++) {
			if (playList[i]['src'] == audio.getAttribute('src')) {
				activePlayItem(playListElem.children[i]);
				trackNameElem.textContent = playList[i]['title'];
				break;
			}
		}
		clearInterval(duration);
		audio.play();
		duration = setInterval(durationController, 200);
		isPaused = false;
	}
	playElem.classList.toggle('pause');
}

function playNext () {
	clearInterval(duration);
	for (let i = 0; i < playList.length; i++) {
		if (playList[i].src == audio.getAttribute('src')) {
			if (i == playList.length - 1) {
				audio.src = playList[0]['src'];
				durationTimeElem.textContent = playList[0]['duration'];
			} else {
				audio.src = playList[i+1]['src'];
				durationTimeElem.textContent = playList[i+1]['duration'];
			}
			currentTimeElem.textContent = '00:00';
			trackControllerElem.style.width = '0%';
			break;
		}
	}
	playElem.classList.remove('pause');
	toggleAudio();
}

function playPrev () {
	clearInterval(duration);
	for (let i = 0; i < playList.length; i++) {
		if (playList[i].src == audio.getAttribute('src')) {
			if (i == 0) {
				audio.src = playList[playList.length - 1]['src'];
				durationTimeElem.textContent = playList[playList.length - 1]['duration'];
			} else {
				audio.src = playList[i-1]['src'];
				durationTimeElem.textContent = playList[i-1]['duration'];
			}
			currentTimeElem.textContent = '00:00';
			trackControllerElem.style.width = '0%';
			break;
		}
	}
	playElem.classList.remove('pause');
	toggleAudio();
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
//volume bar handler
let volumeDrag = false;
volumeListenerElem.addEventListener('mousedown',function(event){
	volumeDrag = true;
	updateVolume(event.clientX - volumeListenerElem.offsetLeft);
		//срабатывает по всей области экрана
	if (volumeSvg.classList.length == 2) {
		pastVolume = volumeControllerElem.offsetWidth;
		toggleMuted();
	}
});
document.addEventListener('mousemove',function(event){
	if(volumeDrag){
		updateVolume(event.clientX - volumeListenerElem.offsetLeft);
		// if (event.clientX - volumeListenerElem.offsetLeft <= 0) {
		// 	toggleMuted();
		// }
	}
});
document.addEventListener('mouseup',function(){
	if (volumeDrag & event.clientX - volumeListenerElem.offsetLeft <= 0) {
		toggleMuted();
	}
	volumeDrag = false;
});
function updateVolume (position) {
	let percentage = 100 * position / volumeListenerElem.clientWidth;

	if (percentage > 100) {
		percentage = 100;
	}
	if (percentage < 0) {
		percentage = 0;
	}
	volumeControllerElem.style.width = percentage +'%';
	audio.volume = percentage / 100;
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////
//track bar handler
let trackDrag = false;
trackListenerElem.addEventListener('mousedown',function(event){
	trackDrag = true;
	updateTrack(event.clientX - trackListenerElem.offsetLeft);
	audio.pause();
});
document.addEventListener('mousemove',function(event){
	if(trackDrag){
		updateTrack(event.clientX - trackListenerElem.offsetLeft);
	}
});
document.addEventListener('mouseup',function(){
	if (trackDrag & !isPaused) {
		audio.play();
	}
	trackDrag = false;
});
function updateTrack (position) {
	let percentage = 100 * position / trackListenerElem.clientWidth;
	
	if (percentage > 100) {
		percentage = 100;
	}
	if (percentage < 0) {
		percentage = 0;
	}
	trackControllerElem.style.width = percentage +'%';
	audio.currentTime = (percentage / 100)*audio.duration;
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////
let pastVolume;
function toggleMuted () {
	if (volumeSvg.classList.length == 1) {
		pastVolume = volumeControllerElem.offsetWidth;
		volumeSvg.classList.add('mute');
		updateVolume(0);
	} else {
		volumeSvg.classList.remove('mute');
		updateVolume(pastVolume);
	}
}
volumeSvg.addEventListener('click', toggleMuted);
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function getDurationInFormat (duration) {
	let sec = Math.floor(duration % 60);
	let min = Math.floor(duration / 60);
	if (sec < 10) sec = '0'+sec;
	if (min < 10) min = '0'+min;
	return `${min}:${sec}`;
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
//update of track controller
let duration;
function durationController () {
	let percentage = 100 * audio.currentTime / audio.duration;
	trackControllerElem.style.width = percentage + '%';
	currentTimeElem.textContent = getDurationInFormat(audio.currentTime);
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
// playListElem;
function playListPress (event) {
	let classes = Array.from(event.target.classList);
	if(classes.includes('play-item') & !classes.includes('item-active')) {
		activePlayItem(event.target);
		clearInterval(duration);
		let title = event.target.textContent;
		for (let i = 0; i < playList.length; i++) {
			if (playList[i]['title'] == title) {
				audio.src = playList[i]['src'];
				durationTimeElem.textContent = playList[i]['duration'];
				currentTimeElem.textContent = '00:00';
				trackControllerElem.style.width = '0%';
				break;
			}
		}
		playElem.classList.remove('pause');
		toggleAudio();
	}
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
let activeItem;
function activePlayItem (playItem) {
	if (activeItem) {
		activeItem.classList.remove('item-active');
	 }
	 activeItem = playItem;
	 activeItem.classList.add('item-active');
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////

playElem.addEventListener('click', toggleAudio);
playPrevElem.addEventListener('click', playPrev);
playNextElem.addEventListener('click', playNext);

getQuotes();
changeQuoteElem.addEventListener('click', getQuotes);
showTimeAndDate();
setInterval(showTimeAndDate, 1000);
showGreeting();
window.addEventListener('beforeunload', setLocalStorage);
window.addEventListener('load', getLocalStorage);
setBackgroundImage();
audioSetup ();
slideNextElem.addEventListener('click', slideNext);
slidePrevElem.addEventListener('click', slidePrev);
city.addEventListener('blur', getWeather);
city.addEventListener('keydown', function(e) {
	if (e.keyCode === 13) {
		getWeather();
	}
});
setWeatherbyTime();
city.addEventListener('focusin', function() {
	clearInterval(idIntervals);
});
city.addEventListener('focusout', function() {
	setWeatherbyTime();
});
