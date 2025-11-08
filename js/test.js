cheers = [
    "Правильно!",
    "(правильно) Конечно!",
    "(правильно) Да!",
    "(правильно) Верно!"
]

testData = [{
    question: "А голос у него был не такой, как у почтальона Печкина, дохленький. У Гаврюши голосище был, как у электрички. Он _____ _____ на ноги поднимал.",
    correct: "Пол деревни, за раз",
    explanation: "Раздельно существительное будет писаться в случае наличия дополнительного слова между существительным и частицей. Правильный ответ: полдеревни пишется слитно. Зараз (ударение на второй слог) — это обстоятельственное наречие, пишется слитно. Означает быстро, одним махом.",
    answers: [
        "Пол деревни, за раз",
        "Полдеревни, зараз",
        "Пол-деревни, за раз"
    ]
},
{
    question: "А эти слова как пишутся?",
    correct: "Капучино и эспрессо",
    explanation: "По орфографическим нормам русского языка единственно верным написанием будут «капучино» и «эспрессо».",
    answers: [
        "Капучино и эспрессо",
        "Капуччино и эспрессо",
        "Каппуччино и экспресо"
    ]
},
{
    question: "Как нужно писать?",
    correct: "Чересчур",
    explanation: "Это слово появилось от соединения предлога «через» и древнего слова «чур», которое означает «граница», «край». Но слово претерпело изменения, так что правильное написание учим наизусть — «чересчур».",
    answers: [
        "Чересчур",
        "Черезчур",
        "Черес-чур"]
},
{
    question: "Где допущена ошибка?",
    correct: "Эпелепсия",
    explanation: "Это слово пишется так: «эпИлепсия».",
    answers: [
        "Эпелепсия",
        "Аккордеон",
        "Белиберда"]
}]

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

testData.forEach(element => {
    shuffle(element.answers);
});
shuffle(testData);
shuffle(cheers);

function idToLetter(id) {
    return String.fromCharCode(97 + id);
}

var clickListeners = new Map();
var answers = [];
var isAbleToProceed = false;

function revealAnswer(questionDiv, questionIndex) {
    const right = questionDiv.querySelector(".quiz__answer--right");
    const explanation = document.createElement('div');
    right.style.setProperty("--target-height", right.clientHeight+ "px")
    
    explanation.append(cheers[questionIndex] + " " + testData[questionIndex].explanation);
    isAbleToProceed = true;
    right.appendChild(explanation);

    requestAnimationFrame( () => {
        right.style.setProperty("--target-height", right.scrollHeight+ "px")
    })
}

function selectCallback(answer, label, questionDiv, questionIndex) {
    const wrapper = questionDiv.querySelector(".quiz__answers");
    wrapper.style.minHeight = wrapper.scrollHeight + "px";
    const elements = questionDiv.querySelectorAll(".quiz__answer");
    const correct = testData[questionIndex].correct == answer;

    clickListeners.forEach((item, key) => {
        
            key.removeEventListener("click", item);
    }
    )

    elements.forEach(
        (item, index) => {
            item.style.setProperty("--delay", (elements.length - index) * 0.1 + "s");
            item.style.top = item.offsetTop + "px";
        });
    

    elements.forEach(
        (item) => {
            if (label != item || !correct) {
                item.style.position = "absolute";
            }
            else
            {
                item.style.position = "relative";
                item.style.order = "1";
            }
        });

    //We need to reflow to update transition value
    requestAnimationFrame(() => {
        elements.forEach(
            (item, index) => {
                if (label != item || !correct) {
                    item.classList.add("quiz__answer--move");
                }
                else {
                    item.classList.add("quiz__answer--right");
                }
            }
        )
    });

    answers = [...answers, correct];

    if (correct) {
        setTimeout(() => { revealAnswer(questionDiv, questionIndex) }, 500);
        questionDiv.classList.add("quiz__question--correct")
    }
    else {
        isAbleToProceed = true;
        questionDiv.classList.add("quiz__question--incorrect")
    }
}

function buildAnswers(questionDiv, questionIndex) {
    const answersBox = document.createElement('div');
    answersBox.className = 'quiz__answers';
    testData[questionIndex].answers.forEach(
        (answer, id) => {
            const label = document.createElement('label');
            label.className = "quiz__answer"
            const callback = () => {
                selectCallback(answer, label, questionDiv, questionIndex);
            }
            clickListeners.set(label,callback);
            label.addEventListener("click", callback);

            label.append(`${idToLetter(id)}) ${answer}`);
            answersBox.appendChild(label);
        }
    )
    questionDiv.appendChild(answersBox)
}

function questionCallback() {
    if (!isAbleToProceed) {
        return;
    }
    document.getElementById('quiz__container').replaceChildren();
    if (answers.length < testData.length) {
        buildQuestion(testData[answers.length], answers.length)
    }
    else {
        const root = document.getElementById('quiz__container');
        const endDiv = document.createElement('div');
        endDiv.className = 'quiz__end';

        const correctAnswers = answers.filter((x) => x == true).length;

        endDiv.append(`Больше вопросов нет, но вы можете их снова посмотреть. Верно отвечено: ${correctAnswers} / ${answers.length}`);

        root.appendChild(endDiv);

        buildQuestions();
    }

}

function buildQuestion(question, index) {
    let root = document.getElementById('quiz__container');

    const questionDiv = document.createElement('div');
    questionDiv.className = 'quiz__question-block';

    // Create question text
    const questionText = document.createElement('div');
    questionText.textContent = `${index + 1}). ${question.question}`;
    questionText.className = 'quiz__question-title';
    questionDiv.appendChild(questionText);

    buildAnswers(questionDiv, index)

    questionText.addEventListener("click", questionCallback)
    root.appendChild(questionDiv);
}

function buildQuestions() {
    let root = document.getElementById('quiz__container');
    testData.forEach((question, index) => {
        const el = document.createElement('div');
        el.className = 'quiz__question-block ' + (answers[index] ?  " quiz__question--correct" : "quiz__question--incorrect");

        // Create question text
        const questionText = document.createElement('div');
        questionText.textContent = `${index + 1}) ${question.question}`;
        questionText.className = 'quiz__question-title';
        el.appendChild(questionText);


        const answerText = document.createElement('div');
        answerText.textContent = `${question.correct}`;
        answerText.className = 'quiz__question-correct';
        el.appendChild(answerText);

        const explanationText = document.createElement('div');
        explanationText.textContent = `${question.explanation}`;
        explanationText.className = 'quiz__question-explanation';
        el.appendChild(explanationText);


        el.addEventListener("click", () => {
            if (!el.classList.contains("quiz__question--active")) {
                el.closest(".quiz").querySelectorAll(".quiz__question-block").forEach((item) => {
                    item.classList.remove("quiz__question--active")
                    item.style.maxHeight = `${item.querySelector(".quiz__question-title").clientHeight + 24}px`
                })
                el.classList.add("quiz__question--active")
                el.style.maxHeight = `${el.scrollHeight}px`
            }
            else {
                el.classList.remove("quiz__question--active")
                el.style.maxHeight = `${el.querySelector(".quiz__question-title").clientHeight + 24}px`
            }
        })

        root.appendChild(el);

    });
    //We need to reflow to get height of title
    requestAnimationFrame(() => {
        document.querySelectorAll(".quiz__question-block").forEach((el) => {
            el.style.maxHeight = `${el.querySelector(".quiz__question-title").clientHeight + 24}px`
        });
    });


}

buildQuestion(testData[0], 0)