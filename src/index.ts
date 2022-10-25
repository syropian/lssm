export interface ModifierConfig {
  ctrlKey?: boolean
  metaKey?: boolean
  shiftKey?: boolean
}

export class ListSelectionStateManager<T> {
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

      this.setSelectedItems(this.items.slice(0, index + 1))
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

      this.setSelectedItems([
        ...new Set([...primaryGroup, ...filteredGroup.flat()]),
      ])
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
    this.setSelectedItems(this.selectedItems.filter(i => i !== item))
  }

  private appendItemsToSelection(item: T) {
    if (!this.itemIsSelected(item)) {
      this.setSelectedItems([...this.selectedItems, item])
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

  private getItemGroup(item: T) {
    if (!this.itemIsSelected) return []

    return this.itemsAsGroups().find(group => group.includes(item)) ?? []
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
  // public nextItem(config: ModifierConfig = this.defaultConfig): this {
  //   config = { ...this.defaultConfig, ...config }
  //   const { shiftKey } = config
  //   let targetItem: T

  //   if (!this.selectedItems.length) {
  //     targetItem = this.items[0]

  //     this.setSelectedItems([targetItem])
  //     this.lastSelectedItem = targetItem
  //     this.lastNonShiftClickedItem = targetItem

  //     return this
  //   }

  //   const lastSelectedIndex = this.items.indexOf(this.lastSelectedItem as T)
  //   const lastNonShiftIndex = this.items.indexOf(
  //     this.lastNonShiftClickedItem as T
  //   )

  //   if (lastSelectedIndex >= this.items.length - 1) return this

  //   targetItem = this.items[lastSelectedIndex + 1] as T

  //   if (shiftKey) {
  //     // TODO: Are groups important here?
  //     if (lastSelectedIndex < lastNonShiftIndex) {
  //       targetItem = this.lastSelectedItem as T
  //       this.removeItemFromSelection(targetItem)
  //       this.lastSelectedItem = this.getSelectedItems().find(
  //         item => this.items.indexOf(item) > lastSelectedIndex
  //       ) as T
  //     } else {
  //       this.appendItemsToSelection(targetItem)
  //       const group = this.getItemGroup(targetItem)
  //       this.lastSelectedItem = group[group.length - 1]
  //     }

  //     return this
  //   }

  //   this.setSelectedItems([targetItem])
  //   this.lastSelectedItem = targetItem

  //   return this
  // }
  public nextItem(config: ModifierConfig = this.defaultConfig): this {
    config = { ...this.defaultConfig, ...config }
    const { shiftKey } = config
    let targetItem: T

    if (!this.selectedItems.length) {
      targetItem = this.items[0]

      this.setSelectedItems([targetItem])
      this.lastSelectedItem = targetItem
      this.lastNonShiftClickedItem = targetItem

      return this
    }

    const lastSelectedIndex = this.items.indexOf(this.lastSelectedItem as T)
    const lastNonShiftIndex = this.items.indexOf(
      this.lastNonShiftClickedItem as T
    )

    if (lastSelectedIndex >= this.items.length - 1) return this

    targetItem = this.items[lastSelectedIndex + 1] as T
    if (shiftKey) {
      if (lastSelectedIndex >= lastNonShiftIndex) {
        this.appendItemsToSelection(targetItem)
        const group = this.getItemGroup(targetItem)
        this.lastSelectedItem = group[group.length - 1]
      } else {
        targetItem = this.lastSelectedItem as T
        const group = this.getItemGroup(targetItem)

        this.removeItemFromSelection(targetItem)
        this.lastSelectedItem = group.length === 1 ? group[0] : group[1]
        this.lastNonShiftClickedItem = group[group.length - 1]
      }

      return this
    }

    this.setSelectedItems([targetItem])
    this.lastSelectedItem = targetItem

    return this
  }

  public previousItem(config: ModifierConfig = this.defaultConfig): this {
    config = { ...this.defaultConfig, ...config }
    const { shiftKey } = config
    let targetItem: T

    if (!this.selectedItems.length) {
      targetItem = this.items[this.items.length - 1]

      this.setSelectedItems([targetItem])
      this.lastSelectedItem = targetItem
      this.lastNonShiftClickedItem = targetItem

      return this
    }

    const lastSelectedIndex = this.items.indexOf(this.lastSelectedItem as T)
    const lastNonShiftIndex = this.items.indexOf(
      this.lastNonShiftClickedItem as T
    )

    if (lastSelectedIndex < 1) return this

    targetItem = this.items[lastSelectedIndex - 1] as T
    if (shiftKey) {
      if (lastSelectedIndex <= lastNonShiftIndex) {
        this.appendItemsToSelection(targetItem)
        const group = this.getItemGroup(targetItem)
        this.lastSelectedItem = group[0]
      } else {
        targetItem = this.lastSelectedItem as T
        const group = this.getItemGroup(targetItem)

        this.removeItemFromSelection(targetItem)
        this.lastNonShiftClickedItem = group[0]
        this.lastSelectedItem = group[Math.max(0, group.length - 2)]
      }

      return this
    }

    this.setSelectedItems([targetItem])
    this.lastSelectedItem = targetItem

    return this
  }

  public getSelectedItems() {
    return this.selectedItems.sort(
      (a, b) => this.items.indexOf(a) - this.items.indexOf(b)
    )
  }

  public getSelectedIndices() {
    return this.selectedItems.map(item => this.items.indexOf(item))
  }

  public setSelectedItems(items: T[]): this {
    this.selectedItems = items.sort(
      (a, b) => this.items.indexOf(a) - this.items.indexOf(b)
    )

    if (!this.selectedItems.length) {
      this.lastSelectedItem = null
      this.lastNonShiftClickedItem = null
    }

    return this
  }

  public clearSelection(): this {
    this.setSelectedItems([])

    return this
  }

  public selectAll(): this {
    this.setSelectedItems([...this.items])

    return this
  }
}
