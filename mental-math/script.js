let timer;
let timeLeft = 120;

document.getElementById('start-game').addEventListener('click', startGame);
document.getElementById('submit-answer').addEventListener('click', checkAnswer);

async function startGame() {
    document.getElementById('start-game').classList.add('hidden');
    document.getElementById('game-section').classList.remove('hidden');
    loadNewQuestion();
    startTimer();
}

async function loadNewQuestion() {
    try {
        const mathQuestion = await generateQuestion();

        const response = await fetch('/validate-question', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ question: mathQuestion }),
        });

        const result = await response.json();
        const isAppropriate = result.isAppropriate;

        if (isAppropriate) {
            document.getElementById('question').textContent = mathQuestion;
        } else {
            loadNewQuestion();
        }
    } catch (error) {
        console.error('Error validating question:', error);
        document.getElementById('question').textContent = await generateQuestion();
    }
}

function checkAnswer() {
    const userAnswer = document.getElementById('answer').value;
    const question = document.getElementById('question').textContent;
    const correctAnswer = eval(question.replace('x', '*'));

    if (parseFloat(userAnswer) === correctAnswer) {
        document.getElementById('feedback').textContent = "Correct!";
        document.getElementById('answer').value = '';
        loadNewQuestion();
    } else {
        document.getElementById('feedback').textContent = "Try again!";
    }
}

async function generateQuestion() {
    const operations = ['+', '-', '*', '/'];
    const operation = operations[Math.floor(Math.random() * operations.length)];

    let num1 = Math.floor(Math.random() * 90) + 10;
    let num2 = Math.floor(Math.random() * 90) + 10;

    if (operation === '/') {
        num2 = Math.floor(Math.random() * 9) + 1;
        num1 = num2 * Math.floor(Math.random() * 9 + 1);
    }

    return `${num1} ${operation} ${num2}`;
}

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').textContent = `Time Left: ${timeLeft}`;
        if (timeLeft <= 0) {
            clearInterval(timer);
            alert("Time's up! Game Over!");
            location.reload();
        }
    }, 1000);
}
