const searchForm = document.querySelector('#search-form'); // метод я хочу найти элемент с помощью селектора
const movie = document.querySelector('#movies');

function apiSearch(e) {
   e.preventDefault();
   
   const searchText = document.querySelector('.form-control').value;
   movie.innerHTML = '<div class="spinner"></div>'
   const server = 'https://api.themoviedb.org/3/search/multi?api_key=cab33ab172e5683b2960bbb5451115fd&language=ru&query=' + searchText;
   requestApi(server); 
   if (searchText.trim().length === 0) { //trim на наличие пробелов
       movie.innerHTML = '<h2 class="col-12 text-center text-danger">Поле не должно быть пустым!</h2>'
       return;
   }

}

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



