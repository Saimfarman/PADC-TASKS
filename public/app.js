const expressionElement = document.querySelector('#expression');
const resultElement = document.querySelector('#result');
const expressionInput = document.querySelector('#expression-input');
const cardResultElement = document.querySelector('.card-result');
const cardExpressionElement = document.querySelector('#card-expression');
const executionTimeElement = document.querySelector('#execution-time');
const messageElement = document.querySelector('#message');
let expression = expressionInput.value;

function render() {
  expressionInput.value = expression;
  expressionElement.textContent = expression || 'Ready for input';
  cardExpressionElement.textContent = expression || 'No expression yet';
}

async function calculate() {
  if (!expression) return;
  messageElement.textContent = 'Calculating...';
  executionTimeElement.textContent = 'Execution time: -- ms';
  try {
    const response = await fetch('/api/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ expression })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || 'Unable to calculate expression');
    resultElement.textContent = data.result;
    cardResultElement.textContent = data.result;
    executionTimeElement.textContent = `Execution time: ${data.executionTimeMs.toFixed(3)} ms`;
    messageElement.textContent = 'Result returned by the local API.';
  } catch (error) {
    messageElement.textContent = error.message;
  }
}

document.querySelector('.keypad').addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;
  const { action } = button.dataset;
  if (action === 'clear') {
    expression = '';
    resultElement.textContent = '0';
    cardResultElement.textContent = '0';
    executionTimeElement.textContent = 'Execution time: -- ms';
    messageElement.textContent = 'Enter an expression to begin.';
  } else if (action === 'backspace') {
    expression = expression.slice(0, -1);
  } else if (action === 'calculate') {
    calculate();
  } else {
    expression += button.dataset.value;
  }
  render();
});

document.querySelector('.calculate-button').addEventListener('click', calculate);

document.addEventListener('keydown', (event) => {
  if (/^[0-9.+\-*/%()]$/.test(event.key)) expression += event.key;
  else if (event.key === 'Enter') calculate();
  else if (event.key === 'Backspace') expression = expression.slice(0, -1);
  else if (event.key === 'Escape') expression = '';
  else return;
  render();
});

expressionInput.addEventListener('input', (event) => {
  expression = event.target.value;
  render();
});

render();