const pollTitleElement = document.getElementById('poll__title');
const pollAnswersElement = document.getElementById('poll__answers');
const pollVotesElement = document.getElementById('poll__votes');

const xhr = new XMLHttpRequest();
xhr.addEventListener("loadstart", onLoadAnswersStart);
xhr.addEventListener("loadend", onLoadAnswersEnd);
xhr.addEventListener("load", onLoadAnswers);
xhr.open("GET", "https://students.netoservices.ru/nestjs-backend/poll");
xhr.send();

function onLoadAnswersStart(e) {
    pollAnswersElement.classList.remove('poll__answers_active');
    pollAnswersElement.querySelectorAll('.poll__answer').forEach(el => el.remove());

    pollVotesElement.classList.remove('poll__votes_active');
    pollVotesElement.querySelectorAll('.poll__votes').forEach(el => el.remove());
}

function onLoadAnswersEnd(e) {
    pollAnswersElement.classList.add('poll__answers_active');
}

function onLoadAnswers() {
    const poll = JSON.parse(this.responseText);

    pollTitleElement.innerText = poll.data.title;
    pollTitleElement.dataset.id = poll.id;

    poll.data.answers.forEach((el, index) => insertAnswerHTML(el, index))

    pollAnswersElement.querySelectorAll('.poll__answer').forEach(el => el.onclick = onClickAnswer)
}

function onLoadVotes() {
    const votes = JSON.parse(this.responseText);
    const votesCount = votes.stat.reduce((sum, current) => sum + current.votes, 0);

    votes.stat.forEach(el => insertVoteHTML(el.answer, el.votes, votesCount))
}

function onClickAnswer() {
    if (pollTitleElement.dataset.status === 'used') {
        alert('Вы уже принимали участие в этом голосовании!');
        return;
    }

    pollTitleElement.dataset.status = 'used';
    alert('Спасибо, ваш голос засчитан!');

    const xhr = new XMLHttpRequest();
    xhr.addEventListener("load", onLoadVotes);
    xhr.open("POST", "https://students.netoservices.ru/nestjs-backend/poll");
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send(`vote=${pollTitleElement.dataset.id}&answer=${this.dataset.id}`);
}

function insertAnswerHTML(value, id) {
    pollAnswersElement.insertAdjacentHTML(
        'beforeend', `
        <button class="poll__answer" data-id="${id}">
            ${value}
        </button>
        `
    )
}

function insertVoteHTML(answer, votes, votesCount) {
    pollAnswersElement.insertAdjacentHTML(
        'beforeend', `
        <div class="poll__votes_item">
            <div class="poll__votes_item__answer">
                ${answer}:
            </div>
            <div class="poll__votes_item__votes">
                ${(votes/votesCount*100).toFixed(2)}%
            </div>
        </div>
        `
    )
}
