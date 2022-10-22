export interface ModifierConfig {
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
  private lastNonShiftClickedItem: T | null = null

  private defaultConfig: ModifierConfig = {
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
      const lastNonShiftItem = this.lastNonShiftClickedItem as T
      const lastNonShiftIndex = this.items.indexOf(lastNonShiftItem)

      const newIndex = this.items.indexOf(item)

      let startIndex = 0
      let endIndex = 0

      if (this.itemIsSelected(lastNonShiftItem)) {
        startIndex = Math.min(lastNonShiftIndex, newIndex)
        endIndex = Math.max(lastNonShiftIndex, newIndex)
      } else {
        // THINK IN GROUPS!!!

        const groups = this.itemsAsGroups()
        const selectedGroup = groups.find(group =>
          group.includes(this.items[newIndex])
        )
        if (selectedGroup) {
          // If the last clicked item was not selected (i.e it was toggled off) we need to set our end range to the first item of the next adjacent group
          if (lastNonShiftIndex > newIndex) {
            const nextGroupIndex = groups.indexOf(selectedGroup) + 1

            startIndex = newIndex
            endIndex = this.items.findIndex(
              item => item === groups[nextGroupIndex][0]
            )
          } else {
            startIndex = this.items.findIndex(item => item === selectedGroup[0])
            endIndex = newIndex
          }
        } else {
          const nextGroupIndex = groups.findIndex(group =>
            group.some(item => this.items.indexOf(item) > lastNonShiftIndex)
          )
          const nextGroupItem = this.items.findIndex(
            item => item === groups[nextGroupIndex][0]
          )

          if (lastNonShiftIndex > newIndex) {
            startIndex = newIndex
            endIndex = nextGroupItem
          } else {
            startIndex = nextGroupItem
            endIndex = newIndex
          }
        }
      }

      const primaryGroup = this.items.slice(startIndex, endIndex + 1)
      const filteredGroup = this.itemsAsGroups().filter(group => {
        return !primaryGroup.some(item => group.includes(item))
      })

      this.selectedItems = [
        ...new Set([...primaryGroup, ...filteredGroup.flat()]),
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

  private itemsAsGroups(): Array<T[]> {
    return this.items.reduce((items, item) => {
      if (!this.itemIsSelected(item) || items.flat().includes(item))
        return items

      let group = [] as T[]
      group = [...group, item]
      let index = this.items.indexOf(item)
      while (this.itemIsSelected(this.items[index + 1])) {
        group = [...group, this.items[index + 1]]
        index++
      }

      return [...items, group]
    }, [] as Array<T[]>)
  }

  /**
   * Constructor
   */
  constructor(items: T[]) {
    this.items = items
  }

  /**
   * Public functions
   */
  public selectItem(
    item: T,
    config: ModifierConfig = this.defaultConfig
  ): this {
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

    if (this.itemIsSelected(item)) {
      this.lastSelectedItem = item
    }

    if (!shiftKey) {
      this.lastNonShiftClickedItem = item
    }

    return this
  }

  public nextItem(config: ModifierConfig = this.defaultConfig): this {
    config = { ...this.defaultConfig, ...config }
    const { shiftKey } = config

    if (!this.selectedItems.length) {
      this.selectedItems = [this.items[0]]
    } else {
      const selectedIndex = this.items.indexOf(this.lastSelectedItem as T)

      if (selectedIndex < this.items.length - 1) {
        let nextItem

        if (
          selectedIndex < this.items.indexOf(this.lastNonShiftClickedItem as T)
        ) {
          nextItem = this.items[selectedIndex + 1]
        } else {
          nextItem = this.items.find(item => {
            return (
              this.items.indexOf(item) > selectedIndex &&
              !this.itemIsSelected(item)
            )
          }) as T
        }

        if (shiftKey) {
          if (this.itemIsSelected(nextItem)) {
            this.selectedItems = this.selectedItems.filter(
              item => item !== this.lastSelectedItem
            )
            this.lastSelectedItem = nextItem
          } else {
            this.selectedItems = [...this.selectedItems, nextItem]
            this.lastSelectedItem = nextItem
          }
        } else {
          this.selectedItems = [nextItem]
          this.lastSelectedItem = nextItem
        }
      }
    }

    return this
  }

  public previousItem(config: ModifierConfig = this.defaultConfig): this {
    config = { ...this.defaultConfig, ...config }
    const { shiftKey } = config

    if (!this.selectedItems.length) {
      this.selectedItems = [this.items[this.items.length - 1]]
    } else {
      const selectedIndex = this.items.indexOf(this.lastSelectedItem as T)

      if (selectedIndex > 0) {
        let previousItem
        if (
          selectedIndex > this.items.indexOf(this.lastNonShiftClickedItem as T)
        ) {
          previousItem = this.items[selectedIndex - 1]
        } else {
          previousItem = this.items
            .slice()
            .reverse()
            .find(item => {
              return (
                this.items.indexOf(item) <= selectedIndex &&
                !this.itemIsSelected(item)
              )
            }) as T
        }

        if (shiftKey) {
          if (this.itemIsSelected(previousItem)) {
            this.selectedItems = this.selectedItems.filter(
              item => item !== this.lastSelectedItem
            )
            this.lastSelectedItem = previousItem
          } else {
            this.selectedItems = [...this.selectedItems, previousItem]
            this.lastSelectedItem = previousItem
          }
        } else {
          this.selectedItems = [previousItem]
          this.lastSelectedItem = previousItem
        }
      }
    }

    return this
  }

  public getSelectedItems() {
    return this.selectedItems.sort(
      (a, b) => this.items.indexOf(a) - this.items.indexOf(b)
    )
  }

  public clearSelection(): this {
    this.selectedItems = []

    return this
  }

  public selectAll(): this {
    this.selectedItems = [...this.items]

    return this
  }
}
