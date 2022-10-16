import { describe, test, expect } from 'vitest'
import sum from '../src'

describe('my-module', () => {
  test('returns the sum of the arguments', () => {
    expect(sum(2, 3)).toBe(5)
  })
})
