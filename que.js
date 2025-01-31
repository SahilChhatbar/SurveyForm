document.addEventListener('DOMContentLoaded', () => {
  fetch('questions.json')
    .then(response => response.json())
    .then(data => {
      const container = document.createElement('div');
      container.className = 'div'; 
      document.body.appendChild(container);

      const questions = Object.values(data.survey).flat();
      let currentIndex = 0;
      const responses = {};

      const renderQuestion = () => {
        const question = questions[currentIndex];
        container.innerHTML = `
          <form id="surveyForm">
            <p class="p">${question.question}</p>
            ${question.options.map(option => `
              <label>
                <input type="radio" name="question_${currentIndex}" value="${option}">
                ${option}
              </label><br>
            `).join('')}
            <div class="b">
              <button class="bu" type="button" id="prevButton" ${currentIndex === 0 ? 'disabled' : ''}>Previous</button>
              <button class="bu" type="button" id="nextButton" ${currentIndex === questions.length - 1 ? 'disabled' : ''}>Next</button>
              ${currentIndex === questions.length - 1 ? '<button class="bu" type="submit">Submit</button>' : ''}
            </div>
          </form>
        `;

        document.getElementById('prevButton').addEventListener('click', () => {
          if (currentIndex > 0) {
            currentIndex--;
            renderQuestion();
          }
        });

        document.getElementById('nextButton').addEventListener('click', () => {
          const selectedOption = container.querySelector('input[type="radio"]:checked');
          if (selectedOption) {
            responses[questions[currentIndex].question] = selectedOption.value;
            if (currentIndex < questions.length - 1) {
              currentIndex++;
              renderQuestion();
            }
          } else {
            alert('Please select an option before proceeding.');
          }
        });

        if (currentIndex === questions.length - 1) {
          document.getElementById('surveyForm').addEventListener('submit', (event) => {
            event.preventDefault();
            const selectedOption = container.querySelector('input[type="radio"]:checked');
            if (selectedOption) {
              responses[questions[currentIndex].question] = selectedOption.value;
              console.log(responses);
              showResponses();
            } else {
              alert('Please select an option before submitting.');
            }
          });
        }
      };

      const showResponses = () => {
        container.innerHTML = `<pre>${JSON.stringify(responses,null, 2)}<pre>`;
      };

      renderQuestion();
    });
});