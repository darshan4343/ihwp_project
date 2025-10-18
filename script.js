document.addEventListener('DOMContentLoaded', () => {
    const tips = [
        "Start your day with a glass of warm water and lemon.",
        "Take a 10-minute walk after meals for better digestion.",
        "Spend 15 minutes in sunlight to boost Vitamin D.",
        "Practice gratitude every morning to improve mental well-being."
    ];

    const tipsList = document.getElementById('tips-list');
    tips.forEach(tip => {
        const li = document.createElement('li');
        li.textContent = tip;
        tipsList.appendChild(li);
    });

    document.getElementById('advice-btn').addEventListener('click', generateAdvice);
});

function generateAdvice() {
    const sleep = document.getElementById('sleep').value;
    const exercise = document.getElementById('exercise').value;
    const result = document.getElementById('quiz-result');

    if (!sleep || !exercise) {
        result.textContent = "Please select both options to receive advice.";
        return;
    }

    let advice = "Your wellness summary: ";

    if (sleep === "less") advice += "Try to improve your sleep quality — aim for at least 7 hours.";
    else if (sleep === "more") advice += "Too much sleep can affect energy levels — stay active!";
    else advice += "Good sleep pattern! Keep it up.";

    if (exercise === "none") advice += " Start light activities like walking or yoga.";
    else if (exercise === "occasional") advice += " Try to make exercise a consistent habit.";
    else advice += " Excellent! Regular exercise benefits both body and mind.";

    result.textContent = advice;
}
