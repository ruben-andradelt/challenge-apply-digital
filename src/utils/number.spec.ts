import { roundToTwoDecimals } from './number';

describe('roundToTwoDecimals', () => {
  it('should round to two decimals', () => {
    expect(roundToTwoDecimals(1.2)).toBe(1.2);
    expect(roundToTwoDecimals(1.23)).toBe(1.23);
    expect(roundToTwoDecimals(1.234)).toBe(1.23);
  });

  it('should handle negative numbers', () => {
    expect(roundToTwoDecimals(-1.2)).toBe(-1.2);
    expect(roundToTwoDecimals(-1.23)).toBe(-1.23);
    expect(roundToTwoDecimals(-1.234)).toBe(-1.23);
  });

  it('should handle zero', () => {
    expect(roundToTwoDecimals(0)).toBe(0);
  });

  it('should handle integers', () => {
    expect(roundToTwoDecimals(1)).toBe(1);
    expect(roundToTwoDecimals(12)).toBe(12);
    expect(roundToTwoDecimals(123)).toBe(123);
  });

  it('should handle large numbers', () => {
    expect(roundToTwoDecimals(1234.56)).toBe(1234.56);
    expect(roundToTwoDecimals(12345.67)).toBe(12345.67);
    expect(roundToTwoDecimals(123456.78)).toBe(123456.78);
  });
});
