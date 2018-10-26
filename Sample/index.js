var minutes = (new Date()).getMinutes() + 30;
var currentTimeLeft = 30;

function Quiz(questions) {
    this.score = 0;
    this.questions = questions;
    this.currentQuestionIndex = 0;
}

Quiz.prototype.guess = function(answer) {
    if(this.getCurrentQuestion().isCorrectAnswer(answer)) {
        this.score++;
    }
    this.currentQuestionIndex++;
};

Quiz.prototype.getCurrentQuestion = function() {
    return this.questions[this.currentQuestionIndex];
};

Quiz.prototype.hasEnded = function() {
    return this.currentQuestionIndex >= this.questions.length;
};
function Question(text, choices, answer) {
    this.text = text;
    this.choices = choices;
    this.answer = answer;
}

Question.prototype.isCorrectAnswer = function (choice) {
    return this.answer === choice;
};
var QuizUI = {
    displayNext: function () {
        if (quiz.hasEnded()) {
            this.displayScore();
        } else {
            this.displayQuestion();
            this.displayChoices();
            this.displayProgress();
        }
    },
    displayQuestion: function() {
        this.populateIdWithHTML("question", quiz.getCurrentQuestion().text);
    },
    displayChoices: function() {
        var choices = quiz.getCurrentQuestion().choices;

        for(var i = 0; i < choices.length; i++) {
            this.populateIdWithHTML("choice" + i, choices[i]);
            this.guessHandler("guess" + i, choices[i]);
        }
    },
    displayScore: function() {
        var gameOverHTML = "<h1> На жаль, ви не відповіли вірно на 20 із 25 запитань :( </h1>";
        gameOverHTML += "<h2> Ваш результат: " + quiz.score + "</h2>";
        gameOverHTML += "<img src='https://ichef.bbci.co.uk/news/660/cpsprodpb/1999/production/_92935560_robot976.jpg'></img>";
        gameOverHTML += "<p> Схоже, Вам варто трохи підтягнути знання. Наші тренери раді допомогти в цьому на курсах і готові довести Ваші знання до абсолюту, тож наступого року Ви станете конкурентним учасником Asimov Challenge. </p>";

        var gameWinHTML = "<h1> Вітаємо з успішним проходженням 1 етапу! </h1>";
        gameWinHTML += "<h2> Ваш результат: " + quiz.score + "</h2>";
        gameWinHTML += "<img src='https://hipertextual.com/files/2018/06/robot-1964072_960_720.jpg'></img>";
        gameWinHTML += "<p> Очевидно, ви - спражній знавець робототехніки, гідний боротися за звання Asimov Choice! А отже, ми раді бачити вас на другому турі олімпіади. Із Вами зв'яжеться наш менеджер. До зустрічі! </p>";

        if (quiz.score < 20)
          this.populateIdWithHTML("quiz", gameOverHTML);

        else {
          this.populateIdWithHTML("quiz", gameWinHTML);
          let winnerData = window.location.href;
          winerData = winnerData.substring(winnerData.indexOf("#") + 1);
          winnerData = winnerData.replace(/%20/g, " ");

          var url = 'https://script.google.com/macros/s/AKfycbz06p8seLE-4uhj4iDjoCKJqikTRbfwsl5TDi0KdrCx6fs7pm5s/exec'

          // e.preventDefault();
          var jqxhr = $.ajax({
            url: url,
            method: "GET",
            dataType: "json",
            data: {name: "Переможець!!!", message: "-------", email: winnerData, phone: "Час: " + (30.0-currentTimeLeft).toString() + " хвилин", _gotcha: ""}
            // data: "ПЕРЕМОЖЕЦЬ! Час: " + (30-currentTimeLeft).toString()
            // data: '{name: "ПЕРЕМОЖЕЦЬ", message: ""' + winnerData + '", email: "---------", phone: "'+ (30 - currentTimeLeft).toString() +' хвилин", _gotcha: ""}'
          });
        }
    },

    populateIdWithHTML: function(id, text) {
        var element = document.getElementById(id);
        element.innerHTML = text;
    },
    guessHandler: function(id, guess) {
        var button = document.getElementById(id);
        button.onclick = function() {
            quiz.guess(guess);
            QuizUI.displayNext();
        }
    },

    displayProgress: function() {
        var currentQuestionNumber = quiz.currentQuestionIndex + 1;
        currentTimeLeft = minutes - (new Date()).getMinutes();
        this.populateIdWithHTML("progress", "Питання " + currentQuestionNumber + " з " + quiz.questions.length);


        this.populateIdWithHTML("timed", currentTimeLeft + " хвилин(а) лишилося");

        if (currentTimeLeft < 0) {
          this.populateIdWithHTML("quiz", gameOverHTML);
        }
    }
};
//Create Questions
var questions = [
    new Question("Підготовлену програму для плати Arduino називають...", [ "Алгоритм", "Скетч", "Setup" ], "Скетч"),
    new Question("Плату Arduino UNO можна підключити до блоку живлення...", ["До 12 В","7 - 12 В", "До 5 В"], "7 - 12 В"),
    new Question("При запуску Arduino процедура setup виконується...", ["У нескінченному циклі","Один раз", "Кожні 20 мілісекунд"], "Один раз"),
    new Question("Для збирання электричних схем без паяння використовують...", ["Breadboard","Клемники", "Друковану плату"], "Breadboard"),
    new Question("Відтворення звуку на Makeblock виконується командою...", ["delay()","delay(1000)", "play tone on note"], "play tone on note"),

    new Question("При роботі плати Arduino, блок програми 'Завжди' виконується...", [ "Один раз", "Кожні 1000 мілісекунд", "У нескінченному циклі" ], "У нескінченному циклі"),
    new Question("Щоб керувати світлодіодами на Scratch, використовується команда...", ["set led","set led on board", "set led strip"], "set led on board"),
    new Question("Аналоговий сигнал характеризуєтся тим, що... ", ["Неперервно змінюється в часі","Не зазнає змін при передачі", "Передаєтся у вигляді одиниць та нулів"], "Неперервно змінюється в часі"),
    new Question("Аналогові сигнали чутливі до впливу...  ", ["Шумів","Перешкод", "Шумів та перешкод"], "Шумів та перешкод"),
    new Question("Максимальне значення яскравості світлодіода 'analogwrite'...  ", ["100","255", "155"], "255"),

    new Question("Робоча напруга на платах Arduino NANO...", [ "3 B", "5 B", "12 B" ], "5 B"),
    new Question("Значення напруги з потенціометра знімають...", ["Із середньої ніжки","З лівої ніжки", "З правої ніжки"], "Із середньої ніжки"),
    new Question("Потенціометр регулює напругу за рахунок...", ["Зміни опору","Зміни свої ємності", "Зміни своєї індуктивності"], "Зміни опору"),
    new Question("Фоторезистор – це датчик...", ["Освітленості","Температури", "Звуку"], "Освітленості"),
    new Question("Arduino здатна отримувати значення на аналогових входах-пінах... ", ["від 0 до 1023","від 0 до 255", "від 0 до 1024"], "від 0 до 1023"),

    new Question("Умовний оператор 'If' дозволяє визначити дію...", [ "Якщо істинні дві умови", "Якщо умова хибна", "Якщо умова істинна" ], "Якщо умова істинна"),
    new Question("Умовний оператор 'else' визначає дію...", ["Коли умова хибна","Кoли умова істинна", "Коли істинні дві умови"], "Коли умова хибна"),
    new Question("Функція 'повторити ___ range' використовується...", ["Для повторення блоку виразів нескінченно","Для повторення блоку виразів задану кількість разів", "Для повторення блоку виразів один раз"], "Для повторення блоку виразів задану кількість разів"),
    new Question("Команда 'поставити змінну      в __ '... ", ["Змінює  значення змінної на задане","Збільшує значення змінної на задане", "Зменшує значення змінної на задане"], "Змінює значення змінної на задане"),
    new Question("Сервопривод (сервомотор) Micro Servo 9g може обертатися на...", ["180° і 360°","360°", "180°"], "180°"),

    new Question("Команда “встановити серво кут 10” ...", [ "Прив'язує сервопривод до Pin 10", "Задає паузу в 10 мілісекунд", "Задає кут повороту в 10°" ], "Задає кут повороту в 10°"),
    new Question("Команда 'змінити змінну на __ '...", ["Змінює  значення змінної на задане","Збільшує значення змінної на задане", "Зменшує значення змінної на задане "], "Збільшує значення змінної на задане"),
    new Question("Ультразвуковий датчик відстані HC-SR04 може побачити перешкоду на відстані...", ["0 – 1000 см","5 – 500 см", "2 – 400 см"], "2 – 400 см"),
    new Question("PIR-датчик - це...", ["Датчик руху","Датчик відстані", "Датчик звуку"], "Датчик руху"),
    new Question("Команда 'delay __ '...", ["Повертає кількість мілісекунд, що пройшли з моменту старти програми Ардуїно.","Призупиняє виконання програми на вказаний проміжок часу (в мікросекундах)", "Призупиняє виконання програми на вказаний проміжок часу (в мілісекундах)"], "Призупиняє виконання програми на вказаний проміжок часу (в мілісекундах)")
];

//Create Quiz
var quiz = new Quiz(questions);

//Display Quiz
QuizUI.displayNext();
