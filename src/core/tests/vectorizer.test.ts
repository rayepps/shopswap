import { assert } from 'chai'
import { vectorize } from '../vectorizer'
import { QUESTIONS } from '../../qa'

describe('vectorizer module', () => {
  describe('vectorize()', () => {
    const profile = {
      timestamp: Date.now(),
      responses: [{
        question: QUESTIONS[0],
        answers: [{
          value: null,
          option: QUESTIONS[0].options[0].key
        }]
      }]
    }
    const other = {
      timestamp: Date.now(),
      responses: [{
        question: QUESTIONS[0],
        answers: [{
          value: null,
          option: QUESTIONS[0].options[1].key
        }]
      }]
    }
    test('produces deterministic results', () => {
      const first = vectorize(profile)
      const second = vectorize(profile)
      assert.isNotNull(first)
      assert.deepEqual(first, second)
    })
    test('produces different result for different profiles', () => {
      const first = vectorize(profile)
      const second = vectorize(other)
      assert.isNotNull(first)
      assert.notDeepEqual(first, second)
    })
  })
})
