let player_name, player_phone, energy_score;
let date = new Date();
let dateStr = date.getDay() + " " + date.getMonth() + " " + date.getFullYear();

var $form = $('form#mainform'),
    url = 'https://script.google.com/macros/s/AKfycbxKsZnJtoXmb6dWe1qoeeqpPBsVMFbrik6-nXF0Lx6cOEIe2vI/exec'

$('#submit-form').on('click', function(e) {
  e.preventDefault();
  player_name = document.getElementById('nickname').value;
  player_phone = document.getElementById('phone').value;
  console.log(dateStr);
  console.log(player_name + " " + player_phone);

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

  // send_ajax(url, player_name, player_phone, 10);
  show_instructions();
});

function send_ajax(url, nickname, phone, score) {
  var jqxhr = $.ajax({
    url: url,
    method: "GET",
    dataType: "json",
    data: {nickname: player_name, phone: player_phone, time: dateStr, score: score}
  }).success(
    // do something
    function(){
      console.log("Sent Successfully!")
    }
  )
}


function show_instructions() {
  let element = document.getElementById('mainform');
  element.parentNode.removeChild(element);
  document.body.innerHTML += `
      <div><h2 style='width:500px; font-size:16px; text-align:justify; margin-top: -20px;'>
        <center><u><p style='font-size:24px;'>ПРАВИЛА ИГРЫ</p></u></center>
        Lorem ipsum dolor sit amet consectetur sit amet consectetur sit amet
        consectetur adipisicing elit. Molestias, fugit sit amet consectetur
        sit amet consectetur Lorem ipsum dolor sit amet consectetur adipisicing elit.
        Magni quos delectus nostrum officia? Dolores omnis aut cupiditate iusto sunt
        ex molestias debitis suscipit ullam sed? Natus, esse quos? Ab illo neque autem et quod.
        Numquam, quasi ab distinctio saepe consequuntur est voluptate earum facere, incidunt
        quae esse. Suscipit, accusamus. Ipsum labore tempora voluptatibus hic dolor maxime
        dolorum doloremque! Nostrum, eius!
        <br>
        <center><button id='submit-form' onclick='show_animation()'>Понятно, начинаем!</button></center>
      </h2></div>
  `;
}
