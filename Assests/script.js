window.addEventListener('load', function () {
    // call saved history from local storage 
     let savedHistory;
    if (!JSON.parse(localStorage.getItem(`history`))) {
      savedHistory = [];
    } else {
      savedHistory = JSON.parse(localStorage.getItem(`history`));
    }
  
    let historyItems = [];
  
    // Function to get forecast, and return data to the page.
    function getForecast(city) {
      if (!city) {
        return;
      }
      var forecast = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=91a02f731d160ea776c47556170a3960&units=imperial`;
      fetch(forecast)
        .then((res) => res.json())
        .then((data) => {
          console.log(data)
          // Select  forecast element and add a title.
          var forecastEl = document.querySelector('#forecast');
          forecastEl.innerHTML = '<h4 class="mt-3">5-Day Forecast:</h4>';
  
          // Create a div and a row class.
          forecastRowEl = document.createElement('div');
          forecastRowEl.className = '"row"';
  
          // Loop over all forecasts.
          for (var i = 0; i < data.list.length; i++) {
            // Render forecasts around 9:00 am (also available every 3 hours at API).
            if (data.list[i].dt_txt.indexOf('9:00:00') !== -1) {
              // Create HTML elements in the bootstrap card.
              var colEl = document.createElement('div');
              colEl.classList.add('col-md-2');
              var cardEl = document.createElement('div');
              cardEl.classList.add('card', 'bg-primary', 'text-white');
              var windEl = document.createElement('p');
              windEl.classList.add('card-text');
              windEl.textContent = `Wind Speed: ${data.list[i].wind.speed} MPH`;
              var humidityEl = document.createElement('p');
              humidityEl.classList.add('card-text');
              humidityEl.textContent = `Humidity : ${data.list[i].main.humidity} %`;
              var bodyEl = document.createElement('div');
              bodyEl.classList.add('card-body', 'p-2');
              var titleEl = document.createElement('h5');
              titleEl.classList.add('card-title');
              titleEl.textContent = new Date(data.list[i].dt_txt).toDateString();               
              var imgEl = document.createElement('img');
              imgEl.setAttribute('src',`https://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png`);
              var p1El = document.createElement('p');
              p1El.classList.add('card-text');
              p1El.textContent = `Temp: ${data.list[i].main.temp_max} °F`;
              var p2El = document.createElement('p');
              p2El.classList.add('card-text');
              p2El.textContent = `Humidity: ${data.list[i].main.humidity}%`;
  
              // Add created elements to the page.
              colEl.appendChild(cardEl);
              bodyEl.appendChild(titleEl);
              bodyEl.appendChild(imgEl);
              bodyEl.appendChild(windEl);
              bodyEl.appendChild(humidityEl);
              bodyEl.appendChild(p1El);
              bodyEl.appendChild(p2El);
              cardEl.appendChild(bodyEl);
              forecastEl.appendChild(colEl);
            }
          }
        });
    }
  
    // fetch and display the UV index.
    function getUVIndex(lat, lon) {
      fetch(
        `https://api.openweathermap.org/data/2.5/uvi?appid=91a02f731d160ea776c47556170a3960&lat=${lat}&lon=${lon}`
      )
        .then((res) => res.json())
        .then((data) => {
          console.log(data)
          var bodyEl = document.querySelector('.card-body');
          var uvEl = document.createElement('p');
          uvEl.id = 'uv';
          uvEl.textContent = 'UV Index: ';
          var buttonEl = document.createElement('span');
          buttonEl.classList.add('btn', 'btn-sm');
          buttonEl.innerHTML = data.value;

      // Set different button colors according to uv indexes.
          if (data.value <= 3) {
            buttonEl.classList.add('btn-success');
          }
          else if (data.value > 3 && data.value <= 7) {
            buttonEl.classList.add('btn-warning');
          }
          else {
            buttonEl.classList.add('btn-danger');
          }
  
          bodyEl.appendChild(uvEl);
          uvEl.appendChild(buttonEl);
        });
    }
  
    let handleHistory = (term) => {
      if (savedHistory && savedHistory.length > 0) {
        var existingEntries = JSON.parse(localStorage.getItem('history'));
        var newHistory = [existingEntries, term];
        localStorage.setItem('history', JSON.stringify(newHistory));
        //  Save new history to localStorage.
      } else {
        historyItems.push(term);
        localStorage.setItem('history', JSON.stringify(historyItems));
      }
    };
  
    //Function to get current weather and return data to the page.
    function searchWeather(city) {
      var weather = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=91a02f731d160ea776c47556170a3960&units=imperial`;
      fetch(weather)
        .then((res) => res.json())
        .then((data) => {
          console.log(data)
          // Call saved history method.
          if (!savedHistory.includes(city)) {
            handleHistory(city);
          }
          // Clear old content
          todayEl = document.querySelector('#today');
          todayEl.textContent = ' ';
  
          // Create, dynamically, html title content for current weather.
          var titleEl = document.createElement('h3');
          titleEl.classList.add('card-title');
          titleEl.textContent = `${
            data.name
          } 
          (${new Date().toLocaleDateString()})`;
          var cardEl = document.createElement('div');
          cardEl.classList.add('card');
          var windEl = document.createElement('p');
          windEl.classList.add('card-text');
          var humidEl = document.createElement('p');
          humidEl.classList.add('card-text');
          var tempEl = document.createElement('p');
          tempEl.classList.add('card-text');
          humidEl.textContent = `Humidity: ${data.main.humidity} %`;
          tempEl.textContent = `Temperature: ${data.main.temp} °F`;
          var cardBodyEl = document.createElement('div');
          cardBodyEl.classList.add('card-body');
          var imgEl = document.createElement('img');
          imgEl.setAttribute(
            'src',
            `https://openweathermap.org/img/w/${data.weather[0].icon}.png`
              );
              console.log(data.weather[0].icon)
          // Append all content created.
          titleEl.appendChild(imgEl);
          cardBodyEl.appendChild(titleEl);
          cardBodyEl.appendChild(tempEl);
          cardBodyEl.appendChild(humidEl);
          cardBodyEl.appendChild(windEl);
          cardEl.appendChild(cardBodyEl);
          todayEl.appendChild(cardEl);
  
          // Call forecast & UV functions.
          getForecast(city);
          getUVIndex(data.coord.lat, data.coord.lon);
        });
    }
  
    //  function to create new row in search list.
    function makeRow(searchValue) {
      // Create a new `li` element and add classes/text to it
      var liEl = document.createElement('li');
      liEl.classList.add('list-group-item', 'list-group-item-action');
      liEl.id = searchValue;
      var text = searchValue;
      liEl.textContent = text;
  
      // Select the history element and add an event to it.
      liEl.addEventListener('click', (e) => {
        if (e.target.tagName === 'LI') {
          searchWeather(e.target.textContent);
        }
      });
      document.getElementById('history').appendChild(liEl);
    }
  
    // Render saved history to the page.
    if (savedHistory && savedHistory.length > 0) {
      savedHistory.forEach((item) => makeRow(item));
    }
  
    // Function to get a search value.
    function getSearchVal() {
      var searchValue = document.querySelector('#search-value').value;
      if (searchValue) {
        searchWeather(searchValue);
        makeRow(searchValue);
        document.querySelector('#search-value').value = '';
      }
    }
  
    // Attach  getSearchVal function to the search button.
    document
      .querySelector('#search-button')
      .addEventListener('click', getSearchVal);
  });

  //Create and enable Clear List button.
  $("#clearList").click(function(event) {
    event.preventDefault();
    $("#history").empty();
    localStorage.clear(); 
  }) 
