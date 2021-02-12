let CARS = [...DATA];
const carListEl = document.getElementById("carList");
const masonryBtnsEl = document.getElementById("masonryBtns")
const sortingSelectEl = document.getElementById("sortingSelect")

const searchFormEl = document.getElementById("searchForm")
const filterFormEl = document.getElementById("filterForm")

const filterFields = ['make', 'fuel', 'transmission']

// ================= CONVERT TIMW START =================
const dateFormatter = new Intl.DateTimeFormat()
const timeFormatter = new Intl.DateTimeFormat(undefined, {
  hour: '2-digit',
  minute: '2-digit',
})
// ================= CONVERT TIMW END =================

// ================= CONVERT CURRENCY START =================
const changeUSDtoUAH = 28.01
const defaultnumber = new Intl.NumberFormat(undefined, {
  maximumSignificantDigits: 3
})

const currencyFormatter = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "UAH",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
})
// ================= CONVERT CURRENCY END =================


// ================= CAR CARD GENERATE START ================= 
insertCards(carListEl, CARS);

function insertCards(whereEl, cars) {

  let html = "";
  cars.forEach((car) => {
    html += createCardElement(car);
  });
  whereEl.innerHTML = ""; //!!!
  whereEl.insertAdjacentHTML("beforeEnd", html);

}
// ================= CAR CARD GENERATE END ================= 

// ================= SORTING START ================= 
sortingSelectEl.addEventListener('change', event => {

  const [key, type] = event.target.value.split('-')

  CARS.sort((a,b) => {

    if (type == 'ab') {
      return a[key] - b[key] 

    } else if (type == 'ba'){
      return b[key] - a[key] 

    }
  })

  insertCards(carListEl, CARS);

})

// ================= SORTING END ================= 

// ================= SEARCH START ================= 
searchFormEl.addEventListener('submit', event => {
  
  event.preventDefault()

  const query = event.target.search.value.toLowerCase().trim().split(' ')
  const filterFields = ['make', 'model', 'transmission', 'engine_volume']

  const filterCars = CARS.filter(car => {
    return query.every(word => {
      return !word || filterFields.some(field => {
        return `${car[field]}`.toLowerCase().trim().includes(word)
      })
    })
  })

  event.target.reset()
  insertCards(carListEl, filterCars);

})

// ================= SEARCH END ================= 

// ================= FILTER START ================= 
renderFilterBlocks(filterFormEl, filterFields, CARS)
filterFormEl.addEventListener('submit', function (event) {
  
  event.preventDefault()
  const filterOptions = {}

  filterFields.forEach( field => {
    const checkedValues = [...this[field]].reduce((accu, input) => {
      if (input.checked) {
        return [...accu, input.value]
      } else {
        return accu
      }
    }, [])
    filterOptions[field] = checkedValues
  })    

    const filterCars = CARS.filter(car => {
      return filterFields.every(field => {
        return !filterOptions[field].length || filterOptions[field].some(value => {
          return `${car[field]}`.includes(value)
        })
      })
    })

    insertCards(carListEl, filterCars);

})

function renderFilterBlocks(whereEl, fields, cars) {
 
  let html = "";
  fields.forEach( field => {
    html += createFilterBlock(cars, field);
  })
  whereEl.insertAdjacentHTML("afterbegin", html);
}

function createFilterBlock(cars, field) {
 
  let inputs = ''

  const uValues = [...new Set(cars.map(car => car[field]).sort())]

  uValues.forEach((value) => {
    inputs += createFilterElement(field, value)
  });

  return `<fieldset class="filter-block border-top mb-3">
  <legend class="filter-fields fw-bold text-uppercase fs-4">${field}</legend>
  <div class="d-flex flex-column filter-elements fs-5">
  ${inputs}
  </div>
  </fieldset>`

}

function createFilterElement(field, value) {
  return `<label>
  <input type="checkbox" name="${field}" value="${value}">
  ${value}
  </label>`
}

// ================= FILTER END ================= 

// ================= BTN LIST CHANGEs START ================= 

masonryBtnsEl.addEventListener('click', function (event) {

  const btnEl = event.target.closest('.button')
  
  if (btnEl) {  
    const btnAction = btnEl.dataset.action
    if (btnAction == '1') {
      carListEl.classList.remove('row-cols-2')
      carListEl.classList.add('row-cols-1')

    } else if (btnAction == '2') {
      carListEl.classList.remove('row-cols-1')
      carListEl.classList.add('row-cols-2')
    }

    const currentBtnSiblings = Array.from(this.children).filter(element => element != btnEl)
    btnEl.classList.remove('btn-secondary')
    btnEl.classList.add('btn-success')
    currentBtnSiblings.forEach(element => {
      element.classList.remove('btn-success')
      element.classList.add('btn-secondary') 
    })
  }

})

// ================= BTN LIST CHANGEs END ================= 


function createCardElement(car) {

  // ======== STARTS RATING START ======== 

  let starsHtml = ''

  for (let i = 0; i < 5; i++) {
    if (i + .5 < car.rating) {
    starsHtml += `<i class="fas fa-star"></i>`
    } else if (i + .5 == car.rating){
    starsHtml += `<i class="fas fa-star-half-alt"></i>`
    } else{
    starsHtml += `<i class="far fa-star"></i>`
    }
  }

  // ======== STARTS RATING END ======== 

  return `<div class="col card mb-2">
    <div class="row g-0">
      <div class="col-4 position-relative card-img-wrap mt-3">
        <img width="1" height="1" loading="lazy" class="card-img" src="${car.img}" alt="${car.make} ${car.model} ${car.year}">
        ${car.vip ? `<p class="status status-vip bg-primary fw-bold text-light position-absolute">VIP</p>` : ''}
        ${car.top ? `<p class="status status-top bg-success fw-bold text-light position-absolute">TOP</p>` : ''}
        <div class="car-rating text-center mt-3 text-warning card-icons">${starsHtml} ${car.rating}</div>
      </div>
      <div class="col-8 card-body-wrap">
        <div class="card-body">
          <h2 class="col-9 card-title text-primary fw-bold fs-4">${car.make} ${car.model} ${car.engine_volume} (${car.year})</h2>
          <div class="col-3 d-flex align-items-center justify-content-end">
        </div>

        <div class="d-flex card-price">
        <h2 class="card-text fs-4 fw-bold text-success">${defaultnumber.format(car.price)} $</h3>
        <h3 class="card-text card-currency fs-6 text-muted">${currencyFormatter.format(car.price * changeUSDtoUAH)}</h3>
        </div>

        <div class="car-inf row row-cols-2 card-icons">
          <p class="col card-text card-odo"><i class="fas fa-tachometer-alt"></i>${defaultnumber.format(car.odo)} km</p>
          <p class="col card-text card-country"><i class="fas fa-map-marker-alt"></i>${car.country}</p>
          <p class="col card-text card-fuel engine-volume"><i class="fas fa-gas-pump"></i>${car.fuel}, ${car.engine_volume}L</p>
          <p class="col card-text card-transmission"><i class="fas fa-sitemap"></i>${car.transmission}</p>
        </div>

          <h4 class="car-inf card-consuption fs-6 fw-bolder">Fuel Consuption (L/100km)</h4>

        <div class="row row-cols-3 car-inf card-icons">
          <p class="col card-text card-odo"><i class="fas fa-road"></i>${car.consume?.road}</p>
          <p class="col card-text card-country"><i class="fas fa-city"></i>${car.consume?.city}</p>
          <p class="col card-text card-fuel engine-volume"><i class="fas fa-sync"></i>${car.consume?.mixed}</p>
        </div>

          ${car.vin ? `<p class="card-icons card-vin border border-2 rounded-end border-primary"><i class="fas fa-car-alt text-light p-2 bg-primary"></i>${car.vin}</p>` : `<p class="card-icons card-vin border border-2 rounded-end border-warning fw-bold text-uppercase"><i class="fas fa-exclamation-triangle p-2 bg-warning"></i>Autor didn't write a VIN</p>`}
          
        <div class="card-icons">
          <p class="car-inf"><i class="fas fa-fill-drip"></i>${car.color}</p>
          <p class="car-inf seller text-muted"><i class="fas fa-user-tie"></i>${car.seller}</p>
        </div>

        <div class="info-box">
        <button class="info-btn btn btn-outline-success" title="Buy"><i class="fas fa-shopping-cart"></i></button>
          <a href="tel:${car.phone}" class="info-btn btn btn-outline-primary fw-bold call-link" title="Call Seller"><i class="fas fa-phone-alt"></i></a>
          <button class="info-btn btn btn-outline-danger" title="Liked"><i class="far fa-heart"></i></button>
        </div>
        </div>
        </div>
      </div>
      <div class="col-12">
        <div class="card-footer card-icons">
            <small class="text-muted"><i class="far fa-clock"></i>${dateFormatter.format(car.timestamp)} ${timeFormatter.format(car.timestamp)}</small>
            <small class="text-muted"><i class="far fa-eye"></i>${car.views}</small>
        </div>
      </div>
    </div>
  </div>`;
}
