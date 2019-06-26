const searchForm = document.querySelector('#search-form');
const movie = document.querySelector('#movies');

function apiSearch(event) {
	event.preventDefault();
	const searchText = document.querySelector('.form-control').value;
	if (searchText.trim() === '') {
		movie.innerHTML = '<h4 style="margin: 0 auto" class="text-danger"">Поле не должно быть пустым</h4>';
		return;
	}

	const server = 'https://api.themoviedb.org/3/search/multi?api_key=cab33ab172e5683b2960bbb5451115fd&language=ru&query=' + searchText;

	movie.innerHTML = '<div class="spinner"></div>';
	fetch(server)
		.then((value) => {
			if (value.status !== 200) {
				return Promise.reject(value.status);
			}
			return value.json();
		})
		.then((output) => {
			let inner = '';
			if (output.results.length === 0) {
				inner = `<h3 class="col-12 text-center text-info">По вашему запросу ничего не найдено</h3>`;
			}
			output.results.forEach(function (item) {
				let nameItem = item.name || item.title,
					releaseDate = item.release_date || item.first_air_date || "Неизвестно",
					imgSrc = item.poster_path ? ("https://image.tmdb.org/t/p/w185" + item.poster_path) : "./pic/No-photo.png",
					description = item.overview || "",
					rate = item.vote_average || "Неизвестно",
					dataInfo = '';
				if (item.media_type !== 'person')
					dataInfo = `data-id="${item.id}}" data-type="${item.media_type}"`;

				inner += `
						<div class="movie-item" ${dataInfo}>
							<img class="poster-film" 
									 src="${imgSrc}"
									 alt="${nameItem}"
							/>
							<div style="text-align: right; width: 100%;">
								<span class="badge badge-dark" style="font-size: large;">Rate: ${rate}</span>
							</div>
							<h4 class="text-left">${nameItem}</h4>
							<strong>(${releaseDate})</strong>
							<p style="margin-right: 10px;">${description}</p>
						</div>`;
			});
			if (inner !== '') {
				movie.innerHTML = inner;
			} else {
				movie.innerHTML = 'По вашему запросу ничего не найдено';
			}
			document.querySelector('.form-control').value = '';
			addEventMedia();
		})
		.catch((reason) => {
			movie.innerHTML = 'что-то пошло не так...';
			console.error(reason);
		})
}

searchForm.addEventListener('submit', apiSearch);

function addEventMedia() {
	const media = movie.querySelectorAll('div[data-id]');
	media.forEach((elem) => {
		elem.style.cursor = "pointer";
		elem.addEventListener('click', showFullInfo)
	})
}

function showFullInfo() {
	let url = '';
	if (this.dataset.type === 'movie') {
		url = `http://api.themoviedb.org/3/movie/${this.dataset.id}?api_key=cab33ab172e5683b2960bbb5451115fd&language=ru`
	} else if (this.dataset.type === 'tv') {
		url = `http://api.themoviedb.org/3/tv/${this.dataset.id}?api_key=cab33ab172e5683b2960bbb5451115fd&language=ru`
	} else {
		movie.innerHTML = '<h2 class="col-12 text-center text-danger">' +
			'Произошла ошибка повторите позже.</h2>';
	}

	fetch(url)
		.then((value) => {
			if (value.status !== 200) {
				return Promise.reject(value.status);
			}
			return value.json();
		})
		.then((output) => {
			let genres = '';
			output.genres.map((item) => genres += item.name + ', ');
			movie.innerHTML = `
			<h4 class="col-12 text-center text-info mb-4">${output.name || output.title}</h4>
			<h5 class="col-12 text-center">Жанры: ${genres.trim().substring(0,genres.trim().length-1)}</h5>
			<div class="col-5">
				<img class="img-fluid img-thumbnail mb-4" src="${(output.poster_path)? `https://image.tmdb.org/t/p/w500${output.poster_path}`: './pic/No-photo.png' }"
					alt="${output.name || output.title}"
				/>
				${ (output.homepage) ? `<p class="text-center text-info mb-2"><a class="btn btn-primary" href="${output.homepage}" target="_blank">Официальный сайт</a></p>` : ""}
				${ (output.imdb_id) ? `<p class="text-center text-info mb-2"><a  class="btn btn-primary" href="http://imdb.com/title/${output.imdb_id}" target="_blank">Страница на IMDB.com</a></p>` : ""}
			</div>
			<div class="col-7">
				<span class="badge badge-dark mb-2" style="font-size: medium;">Рейтинг: ${output.vote_average}</span>
				<p>${output.overview || "отсутствует"}</p>
				${(output.last_episode_to_air)? `<p>${output.number_of_seasons} сезон ${output.last_episode_to_air.episode_number} серий вышло </p>` : "" }
				<p>Статус: ${output.status}</p> 
			</div>
			`
		})
		.catch((reason) => {
			movie.innerHTML = 'что-то пошло не так...';
			console.error(reason);
		})

}

document.addEventListener('DOMContentLoaded',() => {
	fetch('http://api.themoviedb.org/3/trending/all/week?api_key=cab33ab172e5683b2960bbb5451115fd&language=ru')
		.then((value) => {
			if (value.status !== 200) {
				return Promise.reject(value.status);
			}
			return value.json();
		})
		.then((output) => {
			let inner = '<h3 class="col-12 text-center text-info">Популярные за неделю</h3>';
			if (output.results.length === 0) {
				inner = `<h3 class="col-12 text-center text-info">По вашему запросу ничего не найдено</h3>`;
			}
			output.results.forEach(function (item) {
				let nameItem = item.name || item.title,
					releaseDate = item.release_date || item.first_air_date || "Неизвестно",
					imgSrc = item.poster_path ? ("https://image.tmdb.org/t/p/w185" + item.poster_path) : "./pic/No-photo.png",
					description = item.overview || "",
					rate = item.vote_average || "Неизвестно",
					mediaType = item.title ? "movie" : "tv";
					dataInfo = `data-id="${item.id}}" data-type="${mediaType}"`;

				inner += `
						<div class="movie-item" ${dataInfo}>
							<img class="poster-film float-left" 
									 src="${imgSrc}"
									 alt="${nameItem}"
							/>
							<div style="text-align: right; width: 100%;">
								<span class="badge badge-dark" style="font-size: large;">Rate: ${rate}</span>
							</div>
							<h4 class="text-left">${nameItem}</h4>
							<strong>(${releaseDate})</strong>
							<p style="margin-right: 10px;">${description}</p>
						</div>`;
			});
			if (inner !== '') {
				movie.innerHTML = inner;
			} else {
				movie.innerHTML = 'По вашему запросу ничего не найдено';
			}
			document.querySelector('.form-control').value = '';
			addEventMedia();
		})
		.catch((reason) => {
			movie.innerHTML = 'что-то пошло не так...';
			console.error(reason);
		})
});
/*
searchForm.addEventListener('submit', apiSearch);
searchForm.addEventListener('change', apiSearch);

function requestApi(url) {

    const request = new XMLHttpRequest(); // портатип xml для дальнейшего обращения к нему
    request.open('GET', url); // передал запрос GET
    request.send() // отослать запрос на сервер

    request.addEventListener('readystatechange', function() { // ожидание ответа от сервера
        if(request.readyState !== 4) return;

        if(request.status !== 200){
            console.log('error: ' + request.status);
            
        }

        const output = JSON.parse(request.responseText);

        let inner = '';
        output.results.forEach(function(item){
            let nameItem  = item.name || item.title;
            let dateItem  = item.first_date || item.release_date || 'Ничего нет';
            let dataItem = '';
            if (item.media_type !== 'person') dataInfo = `data-id="${item.id}" data-type="${item.media_type}"`; // проверка является ли "человеком" если да, то присваиваются те условия
            let poster = 'http://image.tmdb.org/t/p/w185/' + item.poster_path; 
            let overview = item.overview; 
            console.log(nameItem); 
            inner += '<div class = "col-12" style="margin-bottom: 30px; border: 1px solid #e3e3e3; padding: 0px;">'+'<div class = "image-content"><img id = "poster" src="'+poster+'" alt="Poster" class="float-left" style="margin-right: 20px; width:185px;" onerror="this.src=`https://www.isteducation.com/wp-content/plugins/learn..`;" ></img></div>'+'<div class = "info" style="padding-top: 10px;"><h5>'+nameItem+'</h5>'+'<p>'+dateItem+'</p>'+'<p>'+overview+'</p></div>'+'</div>';
        })
        movie.innerHTML = inner;
        

       // console.log(output);

    });   


}
// ЧЕКНУТЬ
//document.addEventListener('DOMContentLoaded', function(){ //как только страница загрузилась будет выполнятся 

  //  function requestApi(url) {
    //    fetch('https://api.themoviedb.org/3/trending/all/week?api_key=cab33ab172e5683b2960bbb5451115fd')

      //  const request = new XMLHttpRequest(); // портатип xml для дальнейшего обращения к нему
        //request.open('GET', url); // передал запрос GET
       // request.send() // отослать запрос на сервер
    
   //     request.addEventListener('readystatechange', function() { // ожидание ответа от сервера
     //       if(request.readyState !== 4) return;
    
       //     if(request.status !== 200){
         //       console.log('error: ' + request.status);
                
           // }
    
          //  const output = JSON.parse(request.responseText);
    
            
        //    output.results.forEach(function(item){
          //      let inner = '<h2 class="col-12 text-center text info">Популярные за неделю</h2>';
            //    
              //  let nameItem  = item.name || item.title;
    //            let dateItem  = item.first_date || item.release_date || 'Ничего нет';
    //            let dataItem = '';
     //           if (item.media_type !== 'person') dataInfo = `data-id="${item.id}" data-type="${item.media_type}"`; // проверка является ли "человеком" если да, то присваиваются те условия
      //          let poster = 'http://image.tmdb.org/t/p/w185/' + item.poster_path; 
       //         let overview = item.overview; 
         //       console.log(nameItem); 
          //      inner += '<div class = "col-12" style="margin-bottom: 30px; border: 1px solid #e3e3e3; padding: 0px;">'+'<div class = "image-content"><img id = "poster" src="'+poster+'" alt="Poster" class="float-left" style="margin-right: 20px; width:185px;" onerror="this.src=`https://www.isteducation.com/wp-content/plugins/learn..`;" ></img></div>'+'<div class = "info" style="padding-top: 10px;"><h5>'+nameItem+'</h5>'+'<p>'+dateItem+'</p>'+'<p>'+overview+'</p></div>'+'</div>';
         //   })
          //  movie.innerHTML = inner;
            
    
           // console.log(output);
    
    //    });   
    
    
  //  }
    

//});

*/


