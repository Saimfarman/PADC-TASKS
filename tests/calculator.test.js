const { evaluate } = require('../server');

describe('expression evaluator', () => {
  test.each([
    ['128 + 64', 192],
    ['9 * 7', 63],
    ['450 / 15', 30],
    ['82 - 37', 45],
    ['-2 + 5', 3]
  ])('calculates %s', (expression, expected) => {
    expect(evaluate(expression)).toBe(expected);
  });

  test('rejects unsupported characters', () => {
    expect(() => evaluate('2 ** 3')).toThrow('Incomplete expression');
  });
});