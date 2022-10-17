export interface Config {
  altKey?: boolean
  ctrlKey?: boolean
  metaKey?: boolean
  shiftKey?: boolean
}

export default class<T> {
  /**
   * Private members
   */
  private items = [] as T[]

  private selectedItems = [] as T[]

  private lastSelectedItem: T | null = null
  private lastNonShiftSelectedItem: T | null = null

  private defaultConfig: Config = {
    ctrlKey: false,
    metaKey: false,
    shiftKey: false,
  }

  /**
   * Private functions
   */

  private setSelectedItemRange(item: T) {
    if (!this.selectedItems.length) {
      const index = this.items.indexOf(item)

      if (index < 0) return

      this.selectedItems = this.items.slice(0, index + 1)
    } else {
      const lastItem = this.lastSelectedItem as T
      const lastIndex = this.items.indexOf(lastItem)
      const lastNonShiftItem = this.lastNonShiftSelectedItem as T
      const lastNonShiftIndex = this.items.indexOf(lastNonShiftItem)
      const newIndex = this.items.indexOf(item)
      const startIndex = Math.min(lastNonShiftIndex, newIndex)
      const endIndex = Math.max(lastNonShiftIndex, newIndex) + 1

      // We want to keep any items selected items that are not adjacent to the range
      const keepItems = this.selectedItems.filter(item => {
        const index = this.items.indexOf(item)
        if (newIndex < lastNonShiftIndex) {
          return index <= newIndex || index >= lastIndex + 2
        } else {
          return index < lastIndex - 2 || index > newIndex + 1
        }
      })

      this.selectedItems = [
        ...new Set([...keepItems, ...this.items.slice(startIndex, endIndex)]),
      ].sort((a, b) => this.items.indexOf(a) - this.items.indexOf(b))
    }
  }

  private setSingleSelectedItem(item: T) {
    this.selectedItems = [item]
  }

  private toggleItem(item: T) {
    if (this.itemIsSelected(item)) {
      this.removeItemFromSelection(item)
    } else {
      this.appendItemsToSelection(item)
    }
  }

  private removeItemFromSelection(item: T) {
    this.selectedItems = this.selectedItems.filter(i => i !== item)
  }

  private appendItemsToSelection(item: T) {
    if (!this.itemIsSelected(item)) {
      this.selectedItems = [...this.selectedItems, item]
    }
  }

  private itemIsSelected(item: T) {
    return this.selectedItems.includes(item)
  }

  // private createRange(start: number, end: number) {
  //   return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  // }

  // private clamp(value: number, min: number, max: number) {
  //   return Math.max(min, Math.min(value, max))
  // }

  /**
   * Constructor
   */
  constructor(items: T[]) {
    this.items = items
  }

  /**
   * Public functions
   */
  public selectItem(item: T, config: Config = this.defaultConfig): T[] {
    config = { ...this.defaultConfig, ...config }
    const { ctrlKey, shiftKey } = config
    const metaKey = config.metaKey || ctrlKey

    if (metaKey) {
      this.toggleItem(item)
    } else if (shiftKey && !metaKey) {
      this.setSelectedItemRange(item)
    } else {
      this.setSingleSelectedItem(item)
    }

    this.lastSelectedItem = item
    // console.log('Last selection is', item)
    if (!shiftKey) {
      // console.log('Last non-shift selection is', item)
      this.lastNonShiftSelectedItem = item
    }

    return this.selectedItems
  }

  public getSelectedItems() {
    return this.selectedItems
  }

  public clearSelection() {
    this.selectedItems = []
  }
}
