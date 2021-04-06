'use strict';

var map = document.querySelector('.map');
map.classList.remove('map--faded');

// Получает ширину карты
var mapWidth = map.offsetWidth;

// Получает высоту карты
// var mapHeight = map.offsetHeight;


//  «y»: случайное число, координата y метки на карте от 130 до 630.
var indentPinY = 40;
var minPositionMapY = 130 + indentPinY;
var maxPositionMapY = 630;

var indentPinX = 45;


//  Получает содержимое шаблона пин из разметки
var similarPinTamplate = document.querySelector('#pin').content.querySelector('.map__pin');

//  Отрисуйте сгенерированные DOM-элементы в блок .map__pins. Для вставки элементов используйте
var mapPins = document.querySelector('.map__pins');

//  Получает шаблон #card для создания DOM-элемента объявления
var similarCardTamplate = document.querySelector('#card').content.querySelector('.map__card');
var avatars = [1, 2, 3, 4, 5, 6, 7, 8];

var titles = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];

// var addresses = [];
var types = ['palace', 'flat', 'house', 'bungalo'];

var checkin = ['12:00', '13:00', '14:00'];
var checkout = ['12:00', '13:00', '14:00'];

var features = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

var photos = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg',
];


/**
 * Получаем случайный элемент массива
 *
 * @param {arr} arr - массив с данными
 * @return {string} - случайный элемент массива
 */
var getArrayRandElement = function (arr) {
  var rand = Math.floor(Math.random() * arr.length);
  return arr[rand];
};

// Получает число в заданном диапазоне
var getRandomInRange = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Получает массив с элементамии в виде строк случайной длинны
var getArrRandLength = function (arr) {
  var res = [];
  var randLentghArr = Math.floor(Math.random() * arr.length);

  for (var i = 0; i <= randLentghArr; i++) {
    res.push(arr[i]);
  }
  return res;
};

/* Получает массив с элементами в случайном порядке,
   slice использован, чтобы менять не исходный объект по ссылке, а менять по значению,
   при сборе массива объектов необходимо будет проходить циклом */
var getArrayShuffle = function (photos) {
  var res = photos.slice();
  res.sort(function (a, b) {
    return 0.5 - Math.random();
  });
  return res;
};


// функция для геннерации массива объектов с предложения аренды
var offers = (function () {
  var result = [];

  for (var i = 0; i < 8; i++) {
    result.push({
      'author': {
        'avatar': 'img/avatars/user' + 0 + avatars[i] + '.png',
      },
      'offer': {
        'title': titles[i],
        'address': getRandomInRange(0, 1000) + ', '
          + getRandomInRange(0, 1000),
        'price': getRandomInRange(1000, 100000),
        'type': getArrayRandElement(types),
        'rooms': getRandomInRange(0, 5),
        'guests': getRandomInRange(1, 20),
        'checkin': getArrayRandElement(checkin),
        'checkout': getArrayRandElement(checkout),
        'features': getArrRandLength(features),
        'description': '',
        'photos': getArrayShuffle(photos),
      },
      'location': {
        'x': getRandomInRange(indentPinX, mapWidth - indentPinX),
        'y': getRandomInRange(minPositionMapY, maxPositionMapY),
      },

    });
  }
  return result;
})();


// Функция для создания наполняемого шаблонна меток
var renderPin = function (offer) {
  var itemElement = similarPinTamplate.cloneNode(true);

  itemElement.style.cssText = 'top: ' + offer.location.y + 'px' + ';'
    + 'left: ' + offer.location.x + 'px';
  itemElement.querySelector('.map__pin img').src = offer.author.avatar;
  itemElement.querySelector('.map__pin img').alt = offer.offer.title;
  return itemElement;
};

// функция для добавления в разметку фрагмета с шаблонами с метками
var fragmentPin = document.createDocumentFragment();
for (var i = 0; i < offers.length; i++) {
  fragmentPin.appendChild(renderPin(offers[i]));
}

mapPins.appendChild(fragmentPin);


var getTranslateTypeOffer = function (typeOffer) {
  var res = '';
  if (typeOffer === 'flat') {
    res = 'Квартира';
  } else if (typeOffer === 'bungalo') {
    res = 'Бунгало';
  } else if (typeOffer === 'house') {
    res = 'Дом';
  } else if (typeOffer === 'palace') {
    res = 'Дворец';
  }
  return res;
};

var renderCard = function (card) {
  var cardElement = similarCardTamplate.cloneNode(true);

  cardElement.querySelector('.popup__title').textContent = card.offer.title;
  cardElement.querySelector('.popup__text--address').textContent = card.offer.address;
  cardElement.querySelector('.popup__text--price').textContent = card.offer.price + '₽/ночь';
  cardElement.querySelector('.popup__type').textContent = getTranslateTypeOffer(card.offer.type);
  cardElement.querySelector('.popup__text--capacity').textContent = card.offer.rooms + ' комнаты для '
    + card.offer.guests + ' гостей';
  cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + card.offer.checkin
    + ', выезд до ' + card.offer.checkout;
  cardElement.querySelector('.popup__features').textContent = card.offer.features;
  cardElement.querySelector('.popup__description').textContent = card.offer.description;

  // получаем div - блок для фотографий.
  var blockPhotos = cardElement.querySelector('.popup__photos');

  var fragmentPhotos = document.createDocumentFragment();

  for (i = 0; i < card.offer.photos.length; i++) {
    var img = cardElement.querySelector('.popup__photo').cloneNode(true);
    img.src = card.offer.photos[i];
    fragmentPhotos.appendChild(img);
  }
  blockPhotos.appendChild(fragmentPhotos);

  cardElement.querySelector('.popup__photos').firstElementChild.remove();

  cardElement.querySelector('.popup__avatar').src = card.author.avatar;
  return cardElement;
};


// получает блок фильтрации объявлений
var mapFiltersContainer = document.querySelector('.map__filters-container');


var createCard = function (offer) {
  map.insertBefore(renderCard(offer), mapFiltersContainer);
};

// выводит случайную карточку предложения на сайт
createCard(offers[getRandomInRange(0, offers.length - 1)]);
