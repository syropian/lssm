import { describe, test, expect, beforeEach } from 'vitest'
import { ListSelectionStateManager, ModifierConfig } from '../src'

const range = (start: number, end: number) =>
  Array.from({ length: end - start + 1 }, (_, i) => start + i)

describe('lssm', () => {
  const listFixture = range(0, 19)
  const lm = new ListSelectionStateManager(listFixture)
  const shiftConfig: ModifierConfig = {
    shiftKey: true,
  }
  const metaConfig: ModifierConfig = {
    metaKey: true,
  }

  beforeEach(() => {
    lm.clear()
  })

  describe('Single-selection', () => {
    test('Selecting a single item with no modifier key pressed ', () => {
      lm.select(5)
      expect(lm.get()).toEqual([5])

      lm.select(9)
      expect(lm.get()).toEqual([9])
    })

    test('Selecting a single unselected item with the meta key pressed appends the item to the current selection', () => {
      lm.select(5, metaConfig)
      expect(lm.get()).toEqual([5])

      lm.select(9, metaConfig)
      expect(lm.get()).toEqual([5, 9])
    })

    test('Selecting a single selected item with the meta key pressed removes the item to the current selection', () => {
      lm.select(5, metaConfig)
      lm.select(6, metaConfig)
      lm.select(9, metaConfig)
      lm.select(5, metaConfig)
      expect(lm.get()).toEqual([6, 9]) //nice
    })
  })

  describe('Multi-selection', () => {
    test('If no item is selected, all items from index 0 to the item that was clicked should be selected', () => {
      lm.select(5, shiftConfig)
      expect(lm.get()).toEqual(range(0, 5))
    })

    test('If an item is already selected and a non-selected item is clicked, it should select all items between them, inclusive to both the initial selected item, and the item clicked', () => {
      lm.select(5)
      lm.select(10, shiftConfig)
      expect(lm.get()).toEqual(range(5, 10))

      lm.select(13, shiftConfig)
      expect(lm.get()).toEqual(range(5, 13))

      lm.clear()

      lm.select(15)
      lm.select(10, shiftConfig)
      expect(lm.get()).toEqual(range(10, 15))

      lm.select(7, shiftConfig)
      expect(lm.get()).toEqual(range(7, 15))
    })

    test('Monkey test #1', () => {
      lm.select(2)
      lm.select(6, metaConfig)
      expect(lm.get()).toEqual([2, 6])

      lm.select(12, shiftConfig)
      expect(lm.get()).toEqual([2, ...range(6, 12)])

      lm.clear()

      lm.select(2)
      lm.select(12, metaConfig)
      lm.select(7, shiftConfig)
      expect(lm.get()).toEqual([2, ...range(7, 12)])

      lm.clear()

      lm.select(10)
      lm.select(4, metaConfig)
      lm.select(14, shiftConfig)
      expect(lm.get()).toEqual(range(4, 14))

      lm.clear()

      lm.select(10)
      lm.select(14, metaConfig)
      lm.select(4, shiftConfig)
      expect(lm.get()).toEqual(range(4, 14))
    })

    test('Monkey test #2', () => {
      lm.select(10)
      lm.select(14, shiftConfig)
      lm.select(6, shiftConfig)
      expect(lm.get()).toEqual(range(6, 10))

      lm.clear()

      lm.select(2)
      lm.select(10, metaConfig)
      lm.select(14, shiftConfig)
      lm.select(6, shiftConfig)
      expect(lm.get()).toEqual([2, ...range(6, 10)])

      lm.clear()

      lm.select(18)
      lm.select(10, metaConfig)
      lm.select(14, shiftConfig)
      lm.select(6, shiftConfig)
      expect(lm.get()).toEqual([...range(6, 10), 18])

      lm.clear()

      lm.select(15)
      lm.select(10, metaConfig)
      lm.select(14, shiftConfig)
      lm.select(6, shiftConfig)
      expect(lm.get()).toEqual(range(6, 10))

      lm.clear()

      lm.select(10)
      lm.select(6, shiftConfig)
      lm.select(14, shiftConfig)
      expect(lm.get()).toEqual(range(10, 14))

      lm.select(18)
      lm.select(10, metaConfig)
      lm.select(6, shiftConfig)
      lm.select(14, shiftConfig)
      expect(lm.get()).toEqual([...range(10, 14), 18])
    })

    test('Monkey test #3', () => {
      lm.select(4)
      lm.select(12, shiftConfig)
      lm.select(8, shiftConfig)
      expect(lm.get()).toEqual(range(4, 8))

      lm.clear()

      lm.select(2)
      lm.select(18, shiftConfig)
      lm.select(16, metaConfig)
      lm.select(15, metaConfig)
      lm.select(12, metaConfig)
      lm.select(11, metaConfig)
      lm.select(6, shiftConfig)
      expect(lm.get()).toEqual([...range(6, 13), 17, 18])

      lm.clear()

      lm.select(18)
      lm.select(2, shiftConfig)
      lm.select(4, metaConfig)
      lm.select(5, metaConfig)
      lm.select(8, metaConfig)
      lm.select(9, metaConfig)
      lm.select(14, shiftConfig)
      expect(lm.get()).toEqual([2, 3, 6, 7, ...range(10, 14)])

      lm.clear()

      lm.select(10)
      lm.select(16, shiftConfig)
      lm.select(14, metaConfig)
      lm.select(4, shiftConfig)
      expect(lm.get()).toEqual(range(4, 15))

      lm.clear()

      lm.select(8)
      lm.select(2, shiftConfig)
      lm.select(6, metaConfig)
      lm.select(14, shiftConfig)
      expect(lm.get()).toEqual([...range(2, 5), ...range(7, 14)])
    })
  })

  describe('Next and previous selection', () => {
    describe('Next selection', () => {
      test('When no item is selected, it selects the first item', () => {
        lm.next()
        expect(lm.get()).toEqual([0])
      })

      test('When a single item is currently selected, it selects the next available item', () => {
        lm.select(6)
        lm.next()
        expect(lm.get()).toEqual([7])
      })

      test('When the last item of the list is selected, it does nothing', () => {
        lm.select(19)
        lm.next()
        expect(lm.get()).toEqual([19])

        lm.clear()

        lm.select(19)
        lm.next().next()
        lm.next()

        expect(lm.get()).toEqual([19])
      })

      test('When there is multiple items currently selected, it selects the next item after the last selected item', () => {
        lm.select(4)
        lm.select(8, shiftConfig)
        lm.next()
        expect(lm.get()).toEqual([9])

        lm.clear()

        lm.select(4)
        lm.select(8, shiftConfig)
        lm.select(6, metaConfig)
        lm.next()
        expect(lm.get()).toEqual([9])

        lm.clear()

        lm.select(4)
        lm.select(8, shiftConfig)
        lm.select(12, metaConfig)
        lm.next()
        expect(lm.get()).toEqual([13])
      })
    })

    describe('Next adjacent selection', () => {
      test('When no item is selected, it selects the first item', () => {
        lm.next(shiftConfig)
        expect(lm.get()).toEqual([0])
      })

      test('When one or more items are selected, it toggles the next available item after the last selected item', () => {
        lm.select(4)
        lm.next(shiftConfig)
        expect(lm.get()).toEqual([4, 5])

        lm.next(shiftConfig)
        expect(lm.get()).toEqual([4, 5, 6])
      })

      test('When more than one item is selected, and the last selected index is less than the last non-shift clicked index, it should deselect the next item', () => {
        lm.select(14)
        lm.select(10, shiftConfig)
        lm.select(6, metaConfig)
        lm.select(2, shiftConfig)

        lm.next(shiftConfig)
        expect(lm.get()).toEqual([...range(3, 6), ...range(10, 14)])
        lm.next(shiftConfig)
        expect(lm.get()).toEqual([...range(4, 6), ...range(10, 14)])
        lm.next(shiftConfig)
        expect(lm.get()).toEqual([5, 6, ...range(10, 14)])
        lm.next(shiftConfig)
        expect(lm.get()).toEqual([6, ...range(10, 14)])
      })

      test('When more than one item is selected, and the last selected index is greater than, or equal to than the last non-shift clicked index, it should select the closest deselected item', () => {
        lm.select(12)
        lm.select(10, metaConfig)
        lm.select(8, shiftConfig)

        lm.next(shiftConfig)
        lm.next(shiftConfig)
        lm.next(shiftConfig)
        expect(lm.get()).toEqual(range(10, 12))

        lm.next(shiftConfig)
        expect(lm.get()).toEqual(range(10, 13))
      })

      test('When there are multiple groups of selected items', () => {
        lm.select(2)
        lm.select(6, shiftConfig)
        lm.select(4, metaConfig)

        lm.previous(shiftConfig)
        lm.previous(shiftConfig)

        lm.next(shiftConfig)
        lm.next(shiftConfig)
        lm.next(shiftConfig)
        expect(lm.get()).toEqual([5])

        lm.clear()

        lm.select(2)
        lm.select(8, shiftConfig)
        lm.select(6, metaConfig)
        lm.select(4, metaConfig)

        lm.previous(shiftConfig)
        lm.previous(shiftConfig)

        lm.next(shiftConfig)
        lm.next(shiftConfig)
        expect(lm.get()).toEqual([2, 3, 7])
      })
    })

    describe('Previous selection', () => {
      test('When no item is selected, it selects the last item', () => {
        lm.previous()

        expect(lm.get()).toEqual([19])
      })

      test('When an item is currently selected, it selects the next available item', () => {
        lm.select(6)
        lm.previous()
        expect(lm.get()).toEqual([5])
      })

      test('When the first item of the list is selected, it does nothing', () => {
        lm.select(0)
        lm.previous()
        expect(lm.get()).toEqual([0])

        lm.clear()

        lm.select(2)
        lm.previous().previous().previous()
        lm.next()

        expect(lm.get()).toEqual([1])
      })

      test('When there is multiple items currently selected, it selects the previous item before the last selected item', () => {
        lm.select(4)
        lm.select(8, shiftConfig)
        lm.previous()
        expect(lm.get()).toEqual([7])

        lm.clear()

        lm.select(4)
        lm.select(8, shiftConfig)
        lm.select(6, metaConfig)
        lm.previous()
        expect(lm.get()).toEqual([7])

        lm.clear()

        lm.select(4)
        lm.select(8, shiftConfig)
        lm.select(12, metaConfig)
        lm.previous()
        expect(lm.get()).toEqual([11])
      })
    })

    describe('Previous adjacent selection', () => {
      test('When no item is selected, it selects the last item', () => {
        lm.previous(shiftConfig)
        expect(lm.get()).toEqual([19])
      })

      test('When one or more items are selected, it toggles the next available item before the last selected item', () => {
        lm.select(4)
        lm.previous(shiftConfig)
        expect(lm.get()).toEqual([3, 4])

        lm.previous(shiftConfig)
        expect(lm.get()).toEqual(range(2, 4))
      })

      test('When more than one item is selected, and the last selected index is greater than or equal to the last non-shift clicked index, it should deselect the next item', () => {
        lm.select(2)
        lm.select(6, shiftConfig)
        lm.select(10, metaConfig)
        lm.select(14, shiftConfig)

        lm.previous(shiftConfig)
        expect(lm.get()).toEqual([...range(2, 6), ...range(10, 13)])
        lm.previous(shiftConfig)
        expect(lm.get()).toEqual([...range(2, 6), ...range(10, 12)])
        lm.previous(shiftConfig)
        expect(lm.get()).toEqual([...range(2, 6), 10, 11])
        lm.previous(shiftConfig)
        expect(lm.get()).toEqual([...range(2, 6), 10])
      })

      test('When more than one item is selected, and the last selected index is greater than, or equal to than the last non-shift clicked index, it should select the closest deselected item', () => {
        lm.select(8)
        lm.select(10, metaConfig)
        lm.select(12, shiftConfig)

        lm.previous(shiftConfig)
        lm.previous(shiftConfig)
        lm.previous(shiftConfig)
        expect(lm.get()).toEqual(range(8, 10))

        lm.previous(shiftConfig)
        expect(lm.get()).toEqual(range(7, 10))

        lm.clear()

        lm.select(6)
        lm.select(12, shiftConfig)
        lm.select(10, metaConfig)
        lm.previous(shiftConfig)
        lm.previous(shiftConfig)
        lm.previous(shiftConfig)
        expect(lm.get()).toEqual(range(5, 11))
      })

      test('When there are multiple groups of selected items', () => {
        lm.select(8)
        lm.select(2, shiftConfig)
        lm.select(4, metaConfig)
        lm.select(6, metaConfig)

        lm.next(shiftConfig)
        lm.next(shiftConfig)

        lm.previous(shiftConfig)
        lm.previous(shiftConfig)
        expect(lm.get()).toEqual([3, 7, 8])
      })
    })
  })

  test('Select all', () => {
    lm.selectAll()
    expect(lm.get()).toEqual(range(0, 19))
  })

  test('Clearing selection', () => {
    lm.select(1, metaConfig)
    lm.select(3, metaConfig)
    lm.select(5, metaConfig)
    lm.clear()
    expect(lm.get()).toEqual([])
  })

  test('Selected indices', () => {
    lm.select(1, metaConfig)
    lm.select(3, metaConfig)
    lm.select(5, metaConfig)
    expect(lm.getIndices()).toEqual([1, 3, 5])
  })
})
