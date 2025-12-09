type TId = string|number
type TState = TItem[]

interface TItem {
  id: TId,
  parent?: string|number|null,
  label: string
}

type TStateMap = Map<TId, {
  id: TId,
  index: number
}>

interface ITreeStore {
  getAll(): TItem[]
  getItem(id:TId): TItem|undefined
  getChildren(id:TId): TItem[]
  getAllChildren(id:TId): TItem[]
  getAllParents(id:TId): TItem[]
  addItem(data:object): void
  removeItem(id:TId): void
}
export default class TreeStore implements ITreeStore {

  private readonly state: TItem[]
  private indexMap: TStateMap
  private mapOutdated:boolean = true

  constructor(data:TItem[]) {
    this.state = this.deepClone(data)
    this.indexMap = new Map()
    this.validateState()
  }

  public getAll(): TItem[] {
    return this.deepClone(this.state)
  }

  public getItem(id:TId):TItem|undefined {
    const item = this.map().get(id)
    return item !== undefined ? this.state[item.index] : undefined
  }

  public getChildren(id:TId):TItem[] {
    return this.state.filter((item) => item.parent === id)
  }

  public getAllChildren(id:TId, skip:Set<TId> = new Set()):TItem[] {
    if (skip.has(id))
      return []

    skip.add(id)

    const children = this.getChildren(id)
    return [...children, ...children.flatMap(({ id}) => this.getAllChildren(id, skip))]
  }

  public getAllParents(id:TId):TItem[] {
    const result = []
    const item = this.getItem(id)
    if (item) {
      result.push(item)
      let parent = this.getParent(id)
      while (parent) {
        result.push(parent)
        parent = this.getParent(parent.id)
      }
    }
    return result as TItem[]
  }

  public addItem(data:TItem):void {
    if (this.guardItem(data) && !this.getItem(data.id)) {
      this.state.push({ ...data })
    }
  }

  public removeItem(id:TId):void {
    [id, ...this.getAllChildren(id).map(({ id }) => id)]
     .forEach((id) => this.removeItemById(id))
  }

  public updateItem(data:TItem):void {
    if (this.guardItem(data)) {
      const item = this.getItem(data.id)
      if (item) {
        const index = this.map().get(item.id)?.index
        if (index !== undefined) {
          this.state[index] = { ...item, ...data }
          this.mapOutdated = true
        }
      }
    }
  }

  private guardItem<T>(data: T|object): data is T {

    const metaValid = (data
      && typeof data === 'object'
      && 'id' in data
      && 'label' in data
      && typeof data.label === 'string'
      && 'parent' in data
    )
    if (!metaValid)
      return false

    const id = (data as TItem).id
    if (!this.isValidField(id))
      return false

    const parent = (data as TItem).parent
    const parentDefined = parent !== undefined
    const parentNull = parent === null
    const parentValid = this.isValidField(parent)

    if (!parentDefined || !(parentValid || parentNull))
      return false

    if (!parentNull) {
      if (!this.getItem(parent))
        return false

      if (parent === id)
        return false

      if (this.ancestorCheck(id, parent))
        return false
    }

    return true
  }

  private ancestorCheck(direct:TId, possible: TId):boolean {
    let current = this.getItem(possible)
    const skip = new Set<TId>()

    while (current) {
      const { id } = current

      if (id === direct)
        return true

      if (skip.has(id))
        break

      skip.add(id)
      current = this.getParent(id)
    }
    return false
  }


  private isValidField(field:unknown): field is TId {
    return typeof field === 'string' || typeof field === 'number'
  }

  private getParent(id:TId):TItem|undefined {
    const parent = this.getItem(id)?.parent
    return parent !== null && parent !== undefined ? this.getItem(parent) : undefined
  }

  private removeItemById(id:TId):void {
    const item = this.map().get(id)
    if (item !== undefined) {
      this.state.splice(item.index, 1)
      this.mapOutdated = true
    }
  }

  private validateState() {
    const idsSet = new Set<TId>()

    for (const item of this.state) {
      if (!this.guardItem(item))
        throw new Error('Invalid initial data')
      if (idsSet.has(item.id))
        throw new Error('Initial data contains duplicates')

      idsSet.add(item.id)
    }
    this.mapOutdated = true
    this.map()
  }

  private map():TStateMap {
    if (!this.mapOutdated && this.indexMap.size === this.state.length)
      return this.indexMap

    this.indexMap = new Map(this.state.map((item, index) => [item.id, { ...item, index }]))
    this.mapOutdated = false
    console.log('new MAP')
    return this.indexMap
  }

  private deepClone<T>(data: T): T {
    return typeof structuredClone === 'function'
      ? structuredClone(data) as T
      : JSON.parse(JSON.stringify(data)) as T
  }
}
