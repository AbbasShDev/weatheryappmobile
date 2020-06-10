let notificationMesssge = document.querySelector('.notification');
let currentLocation = document.querySelector('.current-location');
let dayAndDate = document.querySelector('.day-date');
let weatherIcon = document.querySelector('.weather-icon');
let mainTemp = document.querySelector('.main-temp-value');
let tempDescription = document.querySelector('.temp-description');
let humidityValue = document.querySelector('.humidity-value');
let windValue = document.querySelector('.wind-value');
let MaxTempValue = document.querySelector('.max-temp-value');
let MinTempValue = document.querySelector('.min-temp-value');
let myDate = new Date();

let ApiKey = 'e0ad44b9250db28e45669dbbcc1f88a9';

let darkmodeStorge = localStorage.getItem('darkmoodStorge');
let latStorge = localStorage.getItem('latStorge');
let langStorge = localStorage.getItem('langStorge');

if (latStorge !== null && langStorge !== null) {
	//removing the btnActive claas from all btn
	document.querySelectorAll('.loactionsChoice .btn').forEach((btn) => {
		btn.classList.remove('btnActive');
		////adding the btnActive claas for the clicked btn
		if (btn.dataset.latitude == latStorge && btn.dataset.longitude == langStorge) {
			btn.classList.add('btnActive');
			const currentNeerUrl = `https://api.openweathermap.org/data/2.5/find?lat=${latStorge}&lon=${langStorge}&cnt=6&units=metric&appid=${ApiKey}`;
			//forcast for 7 neext 7 days api URL
			const WeekUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latStorge}&lon=${langStorge}&exclude=minutely,hourly&units=metric&appid=${ApiKey}`;

			getWeekWeather(WeekUrl);
			getCurrentNeerWeather(currentNeerUrl);
		}

		if (btn.classList.contains('btn-dark')) {
			document.querySelectorAll('.loactionsChoice .btn').forEach((btn) => {
				btn.classList.remove('btnActive-dark');
				////adding the btnActive claas for the clicked btn
				if (btn.dataset.latitude == latStorge && btn.dataset.longitude == langStorge) {
					btn.classList.add('btnActive-dark');
				}
			});
		}
	});
}
//requesting the permition for location from user
window.addEventListener('load', () => {
	geolocationWeather();
});
//if darkmoodStorge in local storge not = to null
if (darkmodeStorge !== null && darkmodeStorge == 'true') {
	document.querySelector('.darkmode-toggler').classList.add('darkmode-toggler-dark');
	document.body.classList.add('body-dark');
	const allbtn = document.querySelectorAll('.loactionsChoice .btn');
	allbtn.forEach((btn) => {
		if (btn.classList.contains('btnActive')) {
			btn.classList.remove('btnActive-dark');
		}
		btn.classList.add('btn-dark');
	});

	const allSections = document.querySelectorAll('.weather-style');

	allSections.forEach((sec) => {
		sec.classList.add('weather-style-dark');
	});

	document.querySelector('.navbar-brand').classList.add('navbar-brand-dark');
	document.querySelector('input').classList.add('input-dark');
	document.querySelector('.add-city-btn').classList.add('add-city-btn-dark');
}

//geting all locations btn
let locationsBtn = document.querySelectorAll('.loactionsChoice .btn');
//looping through the btns
locationsBtn.forEach((btn) => {
	btn.addEventListener('click', (e) => {
		btnActind(e);
	});
});
function btnActind(e) {
	//removing the btnActive claas from all btn
	document.querySelectorAll('.loactionsChoice .btn').forEach((btn) => {
		btn.classList.remove('btnActive');
	});
	////adding the btnActive claas for the clicked btn

	e.target.classList.add('btnActive');

	if (e.target.classList.contains('btn-dark')) {
		document.querySelectorAll('.loactionsChoice .btn').forEach((btn) => {
			btn.classList.remove('btnActive-dark');
		});
		////adding the btnActive claas for the clicked btn

		e.target.classList.add('btnActive-dark');
	}

	let lat = e.target.dataset.latitude;
	let lang = e.target.dataset.longitude;

	localStorage.setItem('latStorge', lat);
	localStorage.setItem('langStorge', lang);

	if (lat == '' && lang == '') {
		//make sure geolacttin denied mesaage is not there
		notificationMesssge.innerText = '';
		geolocationWeather();
	} else {
		notificationMesssge.innerText = '';

		const currentNeerUrl = `https://api.openweathermap.org/data/2.5/find?lat=${lat}&lon=${lang}&cnt=6&units=metric&appid=${ApiKey}`;
		//forcast for 7 neext 7 days api URL
		const WeekUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lang}&exclude=minutely,hourly&units=metric&appid=${ApiKey}`;

		getWeekWeather(WeekUrl);
		getCurrentNeerWeather(currentNeerUrl);
	}
}
function geolocationWeather() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(setPostion, showError);
	} else {
		notificationMesssge.innerText = "Your browser dosn't support Geolocation";
	}
}

function getTodayName(dayNum) {
	let days = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ];

	return days[dayNum];
}

function showError(error) {
	//show message if user denied allowing Geolocation
	notificationMesssge.innerText = error.message;
}

function setPostion(postion) {
	//geting the longitude
	let lang = postion.coords.longitude;
	//geting the latitude
	let lat = postion.coords.latitude;
	//currnt locations and loacions neer you api URL
	const currentNeerUrl = `https://api.openweathermap.org/data/2.5/find?lat=${lat}&lon=${lang}&cnt=6&units=metric&appid=${ApiKey}`;
	//forcast for 7 neext 7 days api URL
	const WeekUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lang}&exclude=minutely,hourly&units=metric&appid=${ApiKey}`;

	getWeekWeather(WeekUrl);
	getCurrentNeerWeather(currentNeerUrl);
}

async function getCurrentNeerWeather(currentNeerUrl) {
	let resopnse = await fetch(currentNeerUrl);

	if (resopnse.ok) {
		let weather = await resopnse.json();
		let neerLocationHeading = document.querySelector('.section2 h4');
		neerLocationHeading.innerText = `Locations Neer ${weather.list[0].name}`;

		//cureent Weather info
		currentLocation.innerText = `${weather.list[0].name} ${weather.list[0].sys.country}`;
		dayAndDate.innerText = `${getTodayName(myDate.getDay())} ${myDate.getDate()}/${myDate.getMonth() + 1}`;
		weatherIcon.setAttribute('src', `icons/${weather.list[0].weather[0].icon}.png`);
		mainTemp.innerText = `${Math.floor(weather.list[0].main.temp)}° `;
		tempDescription.innerText = `${weather.list[0].weather[0].description}`;
		humidityValue.innerText = `${weather.list[0].main.humidity}%`;
		windValue.innerText = `${weather.list[0].wind.speed} m/s`;

		//weather info for 5 locations neer
		let locationsNeerDiv = document.querySelector('.locatiosNeerYou');
		locationsNeerDiv.innerHTML = '';

		for (let i = 1; i < weather.list.length; i++) {
			let location = weather.list[i].name;
			let weatherTemp = Math.floor(weather.list[i].main.temp);
			let weatherIcon = weather.list[i].weather[0].icon;
			let newDiv = document.createElement('div');
			newDiv.innerHTML = `
		    <div class="col-lg-0 text-center justify-content-center">
        	<div class="neer-you-location pt-3">${location}</div>
        	<div class="location-temp-value pt-2"><p class="mb-0">${weatherTemp}° <span>C</span></p></div>
        	<div><img class="location-weather-icon" src="icons/${weatherIcon}.png" alt=""></div>
      		</div>
		`;
			locationsNeerDiv.append(newDiv);
		}

		console.log(weather);
	}
}
//calling the api
async function getWeekWeather(WeekUrl) {
	let resopnse = await fetch(WeekUrl);

	if (resopnse.ok) {
		let weather = await resopnse.json();

		let weekDiv = document.querySelector('.week-weather');
		weekDiv.innerHTML = '';

		for (let i = 1; i < weather.daily.length; i++) {
			let unix_timestamp = weather.daily[i].dt;
			let date = new Date(unix_timestamp * 1000);
			let dayNum = date.getDay();
			let dayName = getTodayName(dayNum);
			let dayAndMonth = `${date.getDate()}/${date.getMonth() + 1}`;
			let weatherTemp = Math.floor(weather.daily[i].temp.day);
			let weatherIcon = weather.daily[i].weather[0].icon;
			let newDiv = document.createElement('div');
			newDiv.innerHTML = `
		    <div class="col-lg-0 text-center justify-content-center py-lg-2">
		    <div class="week-day">${dayName}</div>
		    <div class="week-day-date">${dayAndMonth}</div>
		    <div class="week-temp-value pt-3"><p class="mb-0">${weatherTemp}° <span>C</span></p></div>
		    <div><img class="week-weather-icon" src="icons/${weatherIcon}.png" alt=""></div>
		    </div>
		`;
			weekDiv.append(newDiv);
		}

		MaxTempValue.innerText = `${Math.floor(weather.daily[0].temp.max)}° `;
		MinTempValue.innerText = `${Math.floor(weather.daily[0].temp.min)}° `;
		console.log(weather);
	}
}
//dark mode
const darkmodeToggler = document.querySelector('.darkmode-toggler');

function darkmodeFunc() {
	document.body.classList.toggle('body-dark');

	const allbtn = document.querySelectorAll('.loactionsChoice .btn');
	allbtn.forEach((btn) => {
		if (btn.classList.contains('btnActive')) {
			btn.classList.toggle('btnActive-dark');
		}
		btn.classList.toggle('btn-dark');
	});

	const allSections = document.querySelectorAll('.weather-style');

	allSections.forEach((sec) => {
		sec.classList.toggle('weather-style-dark');
	});

	document.querySelector('.navbar-brand').classList.toggle('navbar-brand-dark');
	document.querySelector('.darkmode-toggler').classList.toggle('darkmode-toggler-dark');
	document.querySelector('input').classList.toggle('input-dark');
	document.querySelector('.add-city-btn').classList.toggle('add-city-btn-dark');
}

darkmodeToggler.onclick = () => {
	darkmodeFunc();
	let dark;
	if (document.body.classList.contains('body-dark')) {
		dark = true;
	} else {
		dark = false;
	}
	localStorage.setItem('darkmoodStorge', dark);
};

//adding new city
let addCityBtn = document.querySelector('.add-city-btn');

addCityBtn.onclick = () => {
	let inputValue = document.querySelector('input').value;

	if (inputValue == '') {
		alert('Enter Location Name');
	} else {
		let cityUrl = `https://api.opencagedata.com/geocode/v1/json?q=${inputValue}&key=82d3487b13b54cddbda225f84f863798`;

		getCityLatLang(cityUrl, inputValue);
	}
};

async function getCityLatLang(cityUrl, inputValue) {
	let resopnse = await fetch(cityUrl);

	if (resopnse.ok) {
		let cityIinfo = await resopnse.json();
		let locationDiv = document.querySelector('.loactionsChoice');
		let newDiv = document.createElement('div');
		newDiv.innerHTML = `
		<button class="btn btnStyle newDiv my-2 mx-2"  data-latitude=${cityIinfo.results[0].geometry
			.lat} data-longitude=${cityIinfo.results[0].geometry.lng} type="button">${inputValue}</button>
		`;
		locationDiv.appendChild(newDiv);
	} else {
		alert('City Name NOT Valid Try Again');
	}
	let allNewDiv = document.querySelectorAll('.newDiv');
	allNewDiv.forEach((btn) => {
		btn.addEventListener('click', (e) => {
			btnActind(e);
		});

		if (darkmodeStorge !== null && darkmodeStorge == 'true') {
			allNewDiv.forEach((btn) => {
				//removing the btnActive claas from all btn
				document.querySelectorAll('.newDiv').forEach((btn) => {
					btn.remove('btnActive');
				});
				////adding the btnActive claas for the clicked btn

				btn.classList.add('btnActive');

				if (btn.classList.contains('btn-dark')) {
					document.querySelectorAll('.newDiv').forEach((btn) => {
						btn.classList.remove('btnActive-dark');
					});
					////adding the btnActive claas for the clicked btn

					btn.classList.add('btnActive-dark');
				}
			});
		}
	});
}
