let player_name, player_phone, energy_score;
let date = new Date();
let dateStr = date.getDay() + " " + date.getMonth() + " " + date.getFullYear();

var $form = $('form#mainform'),
  url = 'https://script.google.com/macros/s/AKfycbxKsZnJtoXmb6dWe1qoeeqpPBsVMFbrik6-nXF0Lx6cOEIe2vI/exec';

$('#submit-form').on('click', function (e) {
  e.preventDefault();
  player_name = document.getElementById('nickname').value;
  player_phone = document.getElementById('phone').value;
  window.doSendInfs
  console.log(dateStr);

  // var jqxhr = $.ajax({
  //   url: url,
  //   method: "GET",
  //   dataType: "json",
  //   data: $form.serializeObject(),
  // }).success(
  //   // do something
  //   function(){
  //     console.log($form.serializeObject())
  //   }
  // )

  // send_ajax(url, player_name, player_phone, '10');
});

function send_ajax(url, nickname, phone, score) {
  if (player_name && player_phone) {
    var jqxhr = $.ajax({
      url: url,
      method: "GET",
      dataType: "json",
      data: { nickname: player_name, phone: player_phone, time: dateStr, score: score }
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
