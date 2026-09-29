const express = require('express');
const path = require('path');
const { performance } = require('node:perf_hooks');

const app = express();

app.use(express.json({ limit: '16kb' }));
app.use(express.static(path.join(__dirname, 'public')));

function tokenize(expression) {
  const tokens = [];
  let index = 0;

  while (index < expression.length) {
    const character = expression[index];
    if (/\s/.test(character)) {
      index += 1;
      continue;
    }
    if (/\d|\./.test(character)) {
      const match = expression.slice(index).match(/^(?:\d+(?:\.\d*)?|\.\d+)/);
      if (!match) throw new Error('Invalid number');
      tokens.push({ type: 'number', value: Number(match[0]) });
      index += match[0].length;
      continue;
    }
    if ('+-*/%()'.includes(character)) {
      tokens.push({ type: character, value: character });
      index += 1;
      continue;
    }
    throw new Error('Only numbers, operators, and parentheses are allowed');
  }

  return tokens;
}

function evaluate(expression) {
  const tokens = tokenize(expression);
  const values = [];
  const operators = [];
  const precedence = { '+': 1, '-': 1, '*': 2, '/': 2, '%': 2, 'u-': 3 };
  let expectsValue = true;

  const applyOperator = () => {
    const operator = operators.pop();
    if (operator === 'u-') {
      if (values.length < 1) throw new Error('Incomplete expression');
      values.push(-values.pop());
      return;
    }
    if (values.length < 2) throw new Error('Incomplete expression');
    const right = values.pop();
    const left = values.pop();
    if (operator === '/' && right === 0) throw new Error('Cannot divide by zero');
    const result = operator === '+' ? left + right
      : operator === '-' ? left - right
        : operator === '*' ? left * right
          : operator === '/' ? left / right
            : left % right;
    values.push(result);
  };

  for (const token of tokens) {
    if (token.type === 'number') {
      values.push(token.value);
      expectsValue = false;
    } else if (token.type === '(') {
      operators.push('(');
      expectsValue = true;
    } else if (token.type === ')') {
      while (operators.length && operators.at(-1) !== '(') applyOperator();
      if (operators.pop() !== '(') throw new Error('Mismatched parentheses');
      expectsValue = false;
    } else {
      const operator = expectsValue && token.type === '-' ? 'u-' : token.type;
      if (expectsValue && operator !== 'u-') throw new Error('Incomplete expression');
      while (operators.length && operators.at(-1) !== '(' && precedence[operators.at(-1)] >= precedence[operator]) {
        applyOperator();
      }
      operators.push(operator);
      expectsValue = true;
    }
  }

  if (!tokens.length || expectsValue) throw new Error('Enter a complete expression');
  while (operators.length) {
    if (operators.at(-1) === '(') throw new Error('Mismatched parentheses');
    applyOperator();
  }
  if (values.length !== 1 || !Number.isFinite(values[0])) throw new Error('Could not calculate expression');
  return Number(values[0].toFixed(10));
}

app.get('/api/health', (_request, response) => {
  response.json({
    status: 'healthy',
    services: { api: { status: 'healthy' } }
  });
});

app.get('/api/openapi.json', (_request, response) => {
  response.json({
    openapi: '3.0.3',
    info: { title: 'Calculation Desk API', version: '1.0.0' },
    paths: {
      '/api/health': { get: { responses: { 200: { description: 'API health' } } } },
      '/api/calculate': { post: { requestBody: { required: true }, responses: { 200: { description: 'Calculated result' }, 422: { description: 'Validation error' } } } }
    }
  });
});

app.post('/api/calculate', (request, response) => {
  const { expression } = request.body || {};
  if (typeof expression !== 'string' || expression.length > 200) {
    return response.status(422).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Provide an expression shorter than 200 characters',
        details: null
      }
    });
  }
  try {
    const startedAt = performance.now();
    const result = evaluate(expression);
    const executionTimeMs = Number((performance.now() - startedAt).toFixed(3));
    return response.json({ expression, result, executionTimeMs });
  } catch (error) {
    return response.status(422).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: error.message,
        details: null
      }
    });
  }
});

if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Calculation Desk running at http://localhost:${port}`);
  });
}

module.exports = { app, evaluate, tokenize };