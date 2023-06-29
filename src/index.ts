export interface ModifierConfig {
  ctrlKey?: boolean
  metaKey?: boolean
  shiftKey?: boolean
}

export type Comparator<T> = (original: T, selected: T) => boolean

export class ListSelectionStateManager<T> {
  /**
   * Private members
   */
  private items = [] as T[]
  private comparator: Comparator<T> | undefined = undefined

  private selected = [] as T[]

  private lastSelected: T | null = null
  private lastNonShiftToggled: T | null = null

  private defaultConfig: ModifierConfig = {
    ctrlKey: false,
    metaKey: false,
    shiftKey: false,
  }

  /**
   * Private functions
   */

  private indexOfItem(item: T) {
    return this.comparator
      ? this.items.findIndex(i => this.comparator?.(i, item))
      : this.items.indexOf(item)
  }

  private includesItem(items: T[], item: T) {
    return this.comparator
      ? items.some(i => this.comparator?.(i, item))
      : items.includes(item)
  }

  private setRange(item: T) {
    if (!this.selected.length) {
      const index = this.indexOfItem(item)

      if (index < 0) return

      this.set(this.items.slice(0, index + 1))
    } else {
      const lastNonShiftItem = this.lastNonShiftToggled as T
      const lastNonShiftIndex = this.indexOfItem(lastNonShiftItem)

      const newIndex = this.indexOfItem(item)

      let startIndex = 0
      let endIndex = 0

      if (this.isSelected(lastNonShiftItem)) {
        startIndex = Math.min(lastNonShiftIndex, newIndex)
        endIndex = Math.max(lastNonShiftIndex, newIndex)
      } else {
        // THINK IN GROUPS!!!

        const groups = this.asGroups()
        const selectedGroup = groups.find(group =>
          this.includesItem(group, this.items[newIndex])
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
            group.some(item => this.indexOfItem(item) > lastNonShiftIndex)
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
      const filteredGroup = this.asGroups().filter(group => {
        return !primaryGroup.some(item => this.includesItem(group, item))
      })

      this.set([...new Set([...primaryGroup, ...filteredGroup.flat()])])
    }
  }

  private setSingle(item: T) {
    this.selected = [item]
  }

  private toggle(item: T) {
    if (this.isSelected(item)) {
      this.remove(item)
    } else {
      this.append(item)
    }
  }

  private remove(item: T) {
    if (this.comparator !== undefined) {
      this.set(
        this.selected.filter(
          selectedItem => !this.comparator?.(selectedItem, item) ?? false
        )
      )
    } else {
      this.set(this.selected.filter(i => i !== item))
    }
  }

  private append(item: T) {
    if (!this.isSelected(item)) {
      this.set([...this.selected, item])
    }
  }

  private isSelected(item: T) {
    return this.includesItem(this.selected, item)
  }

  private asGroups(): Array<T[]> {
    return this.items.reduce((items, item) => {
      if (!this.isSelected(item) || this.includesItem(items.flat(), item))
        return items

      let group = [item] as T[]
      let index = this.indexOfItem(item)

      while (this.isSelected(this.items[index + 1])) {
        group = [...group, this.items[index + 1]]
        index++
      }

      return [...items, group]
    }, [] as Array<T[]>)
  }

  private getGroup(item: T) {
    if (!this.isSelected) return []

    return this.asGroups().find(group => this.includesItem(group, item)) ?? []
  }

  /**
   * Constructor
   */
  constructor(items: T[], comparator?: Comparator<T>) {
    this.items = items
    this.comparator = comparator
  }

  /**
   * Public functions
   */
  public select(item: T, config: ModifierConfig = this.defaultConfig): this {
    config = { ...this.defaultConfig, ...config }
    const { ctrlKey, shiftKey } = config
    const metaKey = config.metaKey || ctrlKey

    if (metaKey) {
      this.toggle(item)
    } else if (shiftKey && !metaKey) {
      this.setRange(item)
    } else {
      this.setSingle(item)
    }

    if (this.isSelected(item)) {
      this.lastSelected = item
    }

    if (!shiftKey) {
      this.lastNonShiftToggled = item
    }

    return this
  }

  public next(config: ModifierConfig = this.defaultConfig): this {
    config = { ...this.defaultConfig, ...config }
    const { shiftKey } = config
    let targetItem: T

    if (!this.selected.length) {
      targetItem = this.items[0]

      this.set([targetItem])
      this.lastSelected = targetItem
      this.lastNonShiftToggled = targetItem

      return this
    }

    const lastSelectedIndex = this.indexOfItem(this.lastSelected as T)
    const lastNonShiftIndex = this.indexOfItem(this.lastNonShiftToggled as T)

    targetItem = this.items[lastSelectedIndex + 1] as T

    if (shiftKey) {
      if (lastSelectedIndex >= lastNonShiftIndex) {
        this.append(targetItem)
        const group = this.getGroup(targetItem)
        this.lastSelected = group[group.length - 1]
      } else {
        targetItem = this.lastSelected as T
        const group = this.getGroup(targetItem)

        this.remove(targetItem)
        this.lastSelected = group.length === 1 ? group[0] : group[1]
        this.lastNonShiftToggled = group[group.length - 1]
      }

      return this
    } else {
      if (lastSelectedIndex === this.items.length - 1) {
        this.set([this.items[this.items.length - 1]])
      } else {
        this.set([targetItem])
      }

      this.lastSelected = targetItem
    }

    return this
  }

  public previous(config: ModifierConfig = this.defaultConfig): this {
    config = { ...this.defaultConfig, ...config }
    const { shiftKey } = config
    let targetItem: T

    if (!this.selected.length) {
      targetItem = this.items[this.items.length - 1]

      this.set([targetItem])
      this.lastSelected = targetItem
      this.lastNonShiftToggled = targetItem

      return this
    }

    const lastSelectedIndex = this.indexOfItem(this.lastSelected as T)
    const lastNonShiftIndex = this.indexOfItem(this.lastNonShiftToggled as T)

    targetItem = this.items[lastSelectedIndex - 1] as T

    if (shiftKey) {
      if (lastSelectedIndex <= lastNonShiftIndex) {
        this.append(targetItem)
        const group = this.getGroup(targetItem)
        this.lastSelected = group[0]
      } else {
        targetItem = this.lastSelected as T
        const group = this.getGroup(targetItem)

        this.remove(targetItem)
        this.lastNonShiftToggled = group[0]
        this.lastSelected = group[Math.max(0, group.length - 2)]
      }

      return this
    } else {
      if (lastSelectedIndex < 1) {
        this.set([this.items[0]])
      } else {
        this.set([targetItem])
      }

      this.lastSelected = targetItem
    }

    return this
  }

  public get() {
    return this.selected.sort(
      (a, b) => this.indexOfItem(a) - this.indexOfItem(b)
    )
  }

  public getIndices() {
    return this.selected.map(item => this.indexOfItem(item))
  }

  public set(items: T[]): this {
    this.selected = items.sort(
      (a, b) => this.indexOfItem(a) - this.indexOfItem(b)
    )

    if (!this.selected.length) {
      this.lastSelected = null
      this.lastNonShiftToggled = null
    }

    return this
  }

  public selectAll(): this {
    this.set([...this.items])

    return this
  }

  public clear(): this {
    this.set([])

    return this
  }
}
