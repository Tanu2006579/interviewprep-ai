
// ==========================================
// AI MOCK INTERVIEW PLATFORM
// COMPLETE SCRIPT.JS
// LOCAL AUTOMATIC EVALUATION
// ==========================================


// ==========================================
// INTERVIEW QUESTIONS
// ==========================================

const sampleQuestions = {

    "Web Development": [
        "What is HTML and why is it used?",
        "What is the difference between HTML and CSS?",
        "What is JavaScript?",
        "What is the difference between id and class in CSS?",
        "What is responsive web design?",
        "What is the DOM?",
        "What is the difference between let, const and var?",
        "What is the purpose of CSS Flexbox?",
        "What is an API?",
        "What is the difference between frontend and backend development?"
    ],

    "Python": [
        "What is Python?",
        "What are the features of Python?",
        "What is the difference between a list and a tuple?",
        "What is a dictionary in Python?",
        "What is a function in Python?",
        "What is object-oriented programming?",
        "What is the difference between break and continue?",
        "What is exception handling?",
        "What are Python modules?",
        "What is the difference between == and is?"
    ],

    "Java": [
        "Why is Java called a platform-independent language?",
        "What is inheritance in Java?",
        "What is polymorphism?",
        "What is encapsulation?",
        "What is abstraction?",
        "What is the difference between JDK, JRE and JVM?",
        "What is a constructor in Java?",
        "What is method overloading?",
        "What is method overriding?",
        "What is the difference between an interface and an abstract class?"
    ],

    "SQL": [
        "What is SQL?",
        "What is a database?",
        "What is a primary key?",
        "What is a foreign key?",
        "What is the difference between DELETE and DROP?",
        "What is the purpose of the SELECT statement?",
        "What is normalization?",
        "What is a JOIN in SQL?",
        "What is the difference between WHERE and HAVING?",
        "What is a unique constraint?"
    ],

    "Data Structures and Algorithms": [
        "What is a data structure?",
        "What is an array?",
        "What is a linked list?",
        "What is a stack?",
        "What is a queue?",
        "What is a binary tree?",
        "What is linear search?",
        "What is binary search?",
        "What is sorting?",
        "What is time complexity?"
    ],

    "Machine Learning": [
        "What is machine learning?",
        "What are the types of machine learning?",
        "What is supervised learning?",
        "What is unsupervised learning?",
        "What is reinforcement learning?",
        "What is a dataset?",
        "What is overfitting?",
        "What is underfitting?",
        "What is classification?",
        "What is regression?"
    ],

    "HR Interview": [
        "Tell me about yourself.",
        "What are your strengths?",
        "What are your weaknesses?",
        "Why should we hire you?",
        "Why do you want to join our company?",
        "Where do you see yourself in five years?",
        "How do you handle challenges?",
        "Are you comfortable working in a team?",
        "What motivates you?",
        "Why did you choose Computer Science Engineering?"
    ]

};


// ==========================================
// HTML ELEMENT REFERENCES
// ==========================================

const homeSection = document.getElementById('homeSection');
const setupSection = document.getElementById('setupSection');
const interviewSection = document.getElementById('interviewSection');
const resultsSection = document.getElementById('resultsSection');

const generateBtn = document.getElementById('generateBtn');
const startBtn = document.getElementById('startBtn');

const domainSelect = document.getElementById('domain');
const questionCountSelect = document.getElementById('questionCount');

const questionDomainTitle = document.getElementById('questionDomainTitle');
const questionText = document.getElementById('questionText');

const progressText = document.getElementById('progressText');
const progressBar = document.getElementById('progressBar');

const userAnswer = document.getElementById('userAnswer');
const nextBtn = document.getElementById('nextBtn');

const micBtn = document.getElementById('micBtn');
const micStatus = document.getElementById('micStatus');

const scoreDisplay = document.getElementById('scoreDisplay');
const feedbackText = document.getElementById('feedbackText');
const summaryContainer = document.getElementById('summaryContainer');

const restartBtn = document.getElementById('restartBtn');


// ==========================================
// INTERVIEW VARIABLES
// ==========================================

let selectedQuestions = [];
let currentQuestionIndex = 0;
let answers = [];
let selectedDomain = '';


// ==========================================
// OPEN INTERVIEW SETUP
// ==========================================

function openInterviewSetup() {

    if (homeSection) homeSection.classList.add('hidden');
    if (setupSection) setupSection.classList.remove('hidden');
    if (interviewSection) interviewSection.classList.add('hidden');
    if (resultsSection) resultsSection.classList.add('hidden');

}

if (startBtn) {
    startBtn.addEventListener('click', openInterviewSetup);
}


// ==========================================
// GENERATE INTERVIEW QUESTIONS
// ==========================================

function generateInterviewQuestions() {

    if (!domainSelect || !questionCountSelect) {
        alert('Interview selection is not available.');
        return;
    }

    selectedDomain = domainSelect.value;

    const count = Number(questionCountSelect.value);

    if (!sampleQuestions[selectedDomain]) {
        alert('Please select a valid interview domain.');
        return;
    }

    if (![3, 5, 8].includes(count)) {
        alert('Please select 3, 5 or 8 questions.');
        return;
    }

    selectedQuestions = [...sampleQuestions[selectedDomain]]
        .sort(() => Math.random() - 0.5)
        .slice(0, count);

    currentQuestionIndex = 0;
    answers = [];

    if (homeSection) homeSection.classList.add('hidden');
    if (setupSection) setupSection.classList.add('hidden');
    if (resultsSection) resultsSection.classList.add('hidden');
    if (interviewSection) interviewSection.classList.remove('hidden');

    if (questionDomainTitle) {
        questionDomainTitle.textContent = selectedDomain + ' Interview';
    }

    showQuestion();

}

if (generateBtn) {
    generateBtn.addEventListener('click', generateInterviewQuestions);
}


// ==========================================
// DISPLAY CURRENT QUESTION + PROGRESS BAR
// ==========================================

function showQuestion() {

    const totalQuestions = selectedQuestions.length;

    if (totalQuestions === 0) {
        alert('No interview questions are available.');
        openInterviewSetup();
        return;
    }

    if (currentQuestionIndex >= totalQuestions) {

        if (progressText) {
            progressText.textContent =
                'All ' + totalQuestions + ' questions completed!';
        }

        if (progressBar) {
            progressBar.style.width = '100%';
        }

        showResults();
        return;
    }

    if (progressText) {
        progressText.textContent =
            'Question ' + (currentQuestionIndex + 1) +
            ' of ' + totalQuestions;
    }

    if (progressBar) {
        const progress =
            (currentQuestionIndex / totalQuestions) * 100;

        progressBar.style.width = progress + '%';
    }

    if (questionText) {
        questionText.textContent =
            'Question ' + (currentQuestionIndex + 1) +
            ': ' + selectedQuestions[currentQuestionIndex];
    }

    if (userAnswer) {
        userAnswer.value = '';
    }

    if (micStatus) {
        micStatus.textContent = '';
    }

    if (nextBtn) {
        nextBtn.textContent =
            currentQuestionIndex === totalQuestions - 1
                ? 'Submit Answer'
                : 'Submit Answer & Next';
    }

}


// ==========================================
// SUBMIT ANSWER AND MOVE TO NEXT QUESTION
// ==========================================

if (nextBtn) {

    nextBtn.addEventListener('click', function(event) {

        event.preventDefault();

        if (currentQuestionIndex >= selectedQuestions.length) {
            return;
        }

        const answer = userAnswer
            ? userAnswer.value.trim()
            : '';

        if (answer === '') {
            alert('Please enter your answer before continuing.');
            return;
        }

        answers.push({
            question: selectedQuestions[currentQuestionIndex],
            answer: answer
        });

        currentQuestionIndex++;

        showQuestion();

    });

}


// ==========================================
// SPEECH TO TEXT
// ==========================================

if (micBtn) {

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    if (SpeechRecognition) {

        const recognition = new SpeechRecognition();

        recognition.lang = 'en-IN';
        recognition.continuous = false;
        recognition.interimResults = false;

        micBtn.addEventListener('click', function() {

            try {

                recognition.start();

                if (micStatus) {
                    micStatus.textContent =
                        'Listening... Speak now.';
                }

            } catch (error) {

                if (micStatus) {
                    micStatus.textContent =
                        'Microphone is already active. Please try again.';
                }

            }

        });

        recognition.onresult = function(event) {

            const spokenText =
                event.results[0][0].transcript;

            if (userAnswer) {
                userAnswer.value +=
                    (userAnswer.value ? ' ' : '') + spokenText;
            }

            if (micStatus) {
                micStatus.textContent =
                    'Speech converted to text.';
            }

        };

        recognition.onerror = function() {

            if (micStatus) {
                micStatus.textContent =
                    'Could not recognise speech. Please try again.';
            }

        };

    } else {

        micBtn.disabled = true;

        if (micStatus) {
            micStatus.textContent =
                'Speech recognition is not supported in this browser.';
        }

    }

}


// ==========================================
// AUTOMATIC ANSWER EVALUATION
// ==========================================

function evaluateAnswer(question, answer) {

    const words =
        answer.toLowerCase().match(/[a-z0-9]+/g) || [];

    const questionWords =
        question.toLowerCase().match(/[a-z0-9]+/g) || [];

    const stopWords = [
        "what", "is", "are", "the", "a", "an",
        "in", "of", "to", "and", "for", "how",
        "why", "explain", "difference", "between",
        "does", "tell", "me", "about", "you"
    ];

    const keywords = questionWords.filter(function(word) {
        return !stopWords.includes(word) && word.length > 2;
    });

    const matchedWords = keywords.filter(function(word) {
        return words.includes(word);
    });

    if (words.length === 0) return 0;

    if (words.length < 3) return 0.25;

    if (matchedWords.length >= 2 && words.length >= 8) return 1;

    if (matchedWords.length >= 1 && words.length >= 8) return 0.75;

    if (matchedWords.length >= 1) return 0.5;

    if (words.length >= 8) return 0.5;

    return 0.25;

}


// ==========================================
// SHOW INTERVIEW RESULTS
// ==========================================

function showResults() {

    if (interviewSection) {
        interviewSection.classList.add('hidden');
    }

    if (resultsSection) {
        resultsSection.classList.remove('hidden');
    }

    let totalScore = 0;

    if (summaryContainer) {
        summaryContainer.innerHTML = '';
    }

    // Evaluate each answer and display summary

    answers.forEach(function(item, index) {

        const marks = evaluateAnswer(
            item.question,
            item.answer
        );

        item.marks = marks;
        totalScore += marks;

        let questionFeedback;
        let suggestion;

        if (marks >= 1) {

            questionFeedback =
                'Very good answer. Relevant keywords and sufficient explanation were provided.';

            suggestion =
                'Continue giving clear and detailed answers.';

        } else if (marks >= 0.75) {

            questionFeedback =
                'Good answer. You included relevant information.';

            suggestion =
                'Try to include more important concepts to make your answer stronger.';

        } else if (marks >= 0.5) {

            questionFeedback =
                'Partially correct answer. Some relevant information was identified.';

            suggestion =
                'Add more technical details and explain the concept clearly.';

        } else {

            questionFeedback =
                'Your answer needs improvement.';

            suggestion =
                'Revise the basic concepts and practise explaining them in your own words.';

        }

        const questionElement = document.createElement('p');
        const answerElement = document.createElement('p');
        const marksElement = document.createElement('p');
        const feedbackElement = document.createElement('p');
        const suggestionElement = document.createElement('p');

        questionElement.textContent =
            'Q' + (index + 1) + ': ' + item.question;

        answerElement.textContent =
            'Your Answer: ' + item.answer;

        marksElement.textContent =
            'Marks: ' + marks + ' / 1';

        feedbackElement.textContent =
            'Feedback: ' + questionFeedback;

        suggestionElement.textContent =
            'Improvement Suggestion: ' + suggestion;

        if (summaryContainer) {

            summaryContainer.appendChild(questionElement);
            summaryContainer.appendChild(answerElement);
            summaryContainer.appendChild(marksElement);
            summaryContainer.appendChild(feedbackElement);
            summaryContainer.appendChild(suggestionElement);

            summaryContainer.appendChild(
                document.createElement('hr')
            );

        }

    });

    // Calculate score percentage

    const maximumScore = answers.length;

    const percentage = maximumScore > 0
        ? (totalScore / maximumScore) * 100
        : 0;

    // Display final score

    if (scoreDisplay) {
        scoreDisplay.textContent =
            'Your Score: ' + totalScore.toFixed(2) +
            ' / ' + maximumScore;
    }

    // Generate overall feedback

    let strengths;
    let improvements;
    let recommendation;

    if (percentage >= 80) {

        strengths =
            'Excellent performance! Your answers show good understanding of the interview topics.';

        improvements =
            'Continue practising advanced questions and explaining technical concepts in detail.';

        recommendation =
            'You are performing well. Keep practising to maintain your progress and confidence.';

    } else if (percentage >= 60) {

        strengths =
            'Good effort! You have a reasonable understanding of the interview topics.';

        improvements =
            'Work on improving answer clarity and including more technical details.';

        recommendation =
            'Practise more interview questions to improve your confidence and accuracy.';

    } else if (percentage >= 40) {

        strengths =
            'You have demonstrated some understanding of the topics.';

        improvements =
            'Focus on strengthening your basic concepts and giving more complete answers.';

        recommendation =
            'Revise the fundamentals and practise answering questions regularly.';

    } else {

        strengths =
            'You attempted the interview and identified topics that need more preparation.';

        improvements =
            'Improve your basic concepts and provide more relevant and detailed answers.';

        recommendation =
            'Start with fundamental topics and gradually practise more interview questions.';

    }

    // Display strengths, improvements and recommendation

    if (feedbackText) {

        feedbackText.innerHTML = '';

        const feedbackItems = [
            ['Strengths', strengths],
            ['Areas for Improvement', improvements],
            ['Recommendation', recommendation]
        ];

        feedbackItems.forEach(function(item) {

            const paragraph = document.createElement('p');
            const heading = document.createElement('strong');

            heading.textContent = item[0] + ': ';

            paragraph.appendChild(heading);

            paragraph.appendChild(
                document.createTextNode(item[1])
            );

            feedbackText.appendChild(paragraph);

        });

    }

    // Save result in database

    saveInterviewResult(totalScore);

}


// ==========================================
// SAVE INTERVIEW RESULT IN DATABASE
// ==========================================

async function saveInterviewResult(score) {

    try {

        const response = await fetch('/api/save-interview', {

            method: 'POST',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                domain: selectedDomain,
                score: score
            })

        });

        if (response.status === 401) {

            alert(
                'Your login session has expired. Please login again.'
            );

            window.location.href = 'login.html';
            return;

        }

        if (!response.ok) {
            console.error('Could not save interview result.');
        }

    } catch (error) {

        console.error('Database connection error:', error);

    }

}


// ==========================================
// RESTART INTERVIEW
// ==========================================

if (restartBtn) {

    restartBtn.addEventListener('click', function() {

        window.location.href = 'dashboard.html';

    });

}


// ==========================================
// DIRECT INTERVIEW LOADING
// FROM interview.html
// ==========================================

const interviewParams =
    new URLSearchParams(window.location.search);

if (interviewParams.get('generate') === '1') {

    const requestedDomain =
        interviewParams.get('domain');

    const requestedCount =
        interviewParams.get('count');

    if (
        requestedDomain &&
        sampleQuestions[requestedDomain] &&
        ['3', '5', '8'].includes(requestedCount)
    ) {

        if (domainSelect) {
            domainSelect.value = requestedDomain;
        }

        if (questionCountSelect) {
            questionCountSelect.value = requestedCount;
        }

        generateInterviewQuestions();

    } else {

        openInterviewSetup();

        alert(
            'Invalid interview selection. Please choose again.'
        );

    }

}
