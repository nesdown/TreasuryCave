let player_name, player_phone, energy_score;
let date = new Date();
let dateStr = date.getDay() + " " + date.getMonth() + " " + date.getFullYear();

var _language = window.language ? window.language : 'ru';
let lang;
var url = 'assets/translation-' + _language + '.json';
fetch(url, { method: 'GET' })
  .then(data => data.json())
  .then(data => {
    lang = data;

  });

var $form = $('form#mainform'),
  url = 'https://script.google.com/macros/s/AKfycbxKsZnJtoXmb6dWe1qoeeqpPBsVMFbrik6-nXF0Lx6cOEIe2vI/exec';

window.clkc = false;

$('#submit-form').on('click', function (e) {
  e.preventDefault();
  player_name = document.getElementById('nickname').value;
  player_phone = document.getElementById('phone').value;
  window.doSendInfs = true;
  // console.log(dateStr);
  show_instructions();
});

$('#disclaimer').on('click', function() {
  player_name = player_phone = undefined;
  show_instructions();
});


function send_ajax(url, nickname, phone, score) {
  if (player_name && player_phone && window.doSendInfs) {
    var jqxhr = $.ajax({
      url: url,
      method: "GET",
      dataType: "json",
      data: { nickname, phone, time: dateStr, score: score }
    }).success(
      // do something
      function () {
        console.log("Sent Successfully!")
      }
    )
  }
}

export default (energy) => {
  send_ajax(url, player_name, player_phone, energy);
}

function show_instructions() {
  let element = document.getElementById('mainform');
  element.parentNode.removeChild(element);
  document.body.innerHTML += lang.rules;
}
