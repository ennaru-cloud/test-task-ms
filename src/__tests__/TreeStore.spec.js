import TreeStore from '@/store/TreeStore.ts'
import { describe, it, expect } from 'vitest'

const testData = [
  { id: 1, parent: null, label: 'Айтем 1' },
  { id: '91064cee', parent: 1, label: 'Айтем 2' },
  { id: 3, parent: 1, label: 'Айтем 3' },
  { id: 4, parent: '91064cee', label: 'Айтем 4' },
  { id: 5, parent: '91064cee', label: 'Айтем 5' },
  { id: 6, parent: '91064cee', label: 'Айтем 6' },
  { id: 7, parent: 4, label: 'Айтем 7' },
  { id: 8, parent: 4, label: 'Айтем 8' },
]

const createStore = () => new TreeStore(testData)

describe('TreeStore', () => {
  it('getAll', () => {
    const store = createStore()
    expect(store.getAll()).toEqual(testData)
  })

  it('getItem', () => {
    const store = createStore()
    expect(store.getItem(1)).toEqual(testData[0])
    expect(store.getItem('91064cee')).toEqual(testData[1])
    expect(store.getItem('name')).toBeUndefined()
  })

  it('getAllChildren', () => {
    const store = createStore()
    expect(store.getAllChildren(1).map(({ id }) => id)).toEqual(['91064cee', 3, 4, 5, 6, 7, 8])
    expect(store.getAllChildren(4).map(({ id }) => id)).toEqual([7, 8])
  })

  it('getAllParents', () => {
    const store = createStore()
    const parents = store.getAllParents(7)
    expect(parents.map(({ id }) => id)).toEqual([7, 4, '91064cee', 1])
  })

  it('addItem no duplicates', () => {
    const store = createStore()
    store.addItem({ id: 9, parent: 3, label: 'New' })
    expect(store.getItem(9)).toEqual({ id: 9, parent: 3, label: 'New' })

    store.addItem({ id: 9, parent: 1, label: 'Duplicate' })
    expect(store.getChildren(1).find(({ id }) => id === 9)).toBeUndefined()
  })

  it('addItem no parent cycles', () => {
    const store = createStore()
    store.addItem({ id: 10, parent: 10, label: 'self cycle' })
    expect(store.getItem(10)).toBeUndefined()

    store.updateItem({ id: 1, parent: 7, label: 'parent cycle' })
    expect(store.getItem(1)?.parent).toBeNull()
  })

  it('addItem null parent and no parent', () => {
    const store = createStore()
    store.addItem({ id: 11, parent: null, label: 'new Root' })
    expect(store.getItem(11)).toEqual({ id: 11, parent: null, label: 'new Root' })

    store.addItem({ id: 12, parent: 9999, label: 'no parent' })
    expect(store.getItem(12)).toBeUndefined()
  })

  it('updateItem', () => {
    const store = createStore()
    store.updateItem({ id: 3, parent: 1, label: 'Updated' })
    expect(store.getItem(3)).toEqual({ id: 3, parent: 1, label: 'Updated' })
  })

  it('removeItem', () => {
    const store = createStore()
    store.removeItem(4)
    const remainingIds = store.getAll().map(({ id }) => id)
    expect(remainingIds).toEqual([1, '91064cee', 3, 5, 6])
  })
})
