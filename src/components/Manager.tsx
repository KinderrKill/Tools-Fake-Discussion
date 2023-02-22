import './Manager.scss'
import * as constants from '../utils/constants'
import React, { useEffect, useState } from 'react'

export default function Manager(props: { sendItems: (inputList: constants.ITEM_TABLE) => void }) {
  const [selectedInputTypeId, setSelectedInputTypeId] = useState<number>(0)
  const [selectedItemId, setSelectedItemId] = useState<number>(-1)

  const [input, setInput] = useState<constants.DYNAMIC_VALUE>(false)
  const [items, setItems] = useState<constants.ITEM_TABLE>([])

  function handleSelectedInput(id: number) {
    if (selectedInputTypeId != id) setInput('')

    setSelectedInputTypeId(id)
  }

  function handleInputChange(value: constants.DYNAMIC_VALUE) {
    setInput(typeof value === 'boolean' ? value.toString() : value)
  }

  function addInput() {
    const itemId = items.length
    const value = typeof input === 'boolean' ? input.toString() : input

    const inputType = constants.getInputTypeFromID(selectedInputTypeId)
    const item = {
      id: itemId,
      type: inputType.type,
      label: inputType.label,
      value: value,
    }

    setItems((prevItems) => [...prevItems, item])
  }

  function removeInput(inputId: number) {
    const list = items.filter((item) => item.id != inputId)
    setItems(list)

    // Reset types buttons, selected item and input value
    setSelectedInputTypeId(0)
    setSelectedItemId(-1)
    setInput(false)
  }

  function modifyInput() {
    if (selectedItemId === -1) return

    const item = items.filter((item) => item.id === selectedItemId)[0]

    if (!item) return

    const index = items.findIndex((obj) => obj.id === item.id)
    if (index !== -1) {
      const convertedValue = typeof input === 'boolean' ? input.toString() : input
      item.value = convertedValue as constants.DYNAMIC_VALUE
      items.splice(index, 1, item)

      setItems(items)
    }
  }

  // useEffect for detect clicked row on table
  useEffect(() => {
    const selectedItem = items.filter((item) => item.id === selectedItemId)[0]

    if (selectedItem) {
      setSelectedInputTypeId(selectedItem.type)
      setInput(selectedItem.value)
    }
  }, [selectedItemId])

  // UseEffect for detect modification on items and update parent
  useEffect(() => {
    props.sendItems(items)
  }, [items])

  return (
    <section className='container'>
      <h2>Géstionnaire des entrées</h2>

      <article className='section-input'>
        <div className='section-input__buttons'>
          <span>Séléctionner un type d'entrée : </span>
          <div>
            {constants.INPUTS.slice(0, 3).map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  handleSelectedInput(item.id)
                }}
                className={selectedInputTypeId == item.id ? 'selected' : ''}>
                {item.label}
              </button>
            ))}
          </div>
          <div>
            {constants.INPUTS.slice(3, 6).map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  handleSelectedInput(item.id)
                }}
                className={selectedInputTypeId == item.id ? 'selected' : ''}>
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <p className='section-input__description'>
          <strong style={{ textDecoration: 'underline' }}>Utilisation</strong> :{' '}
          {constants.getInputTypeFromID(selectedInputTypeId)?.description}
        </p>
        <span>
          {getInputFromType(constants.getInputTypeFromID(selectedInputTypeId)?.type, handleInputChange, input)}
        </span>

        <div className='section-input__state_buttons'>
          <button onClick={addInput}>Ajouter</button>
          <button onClick={modifyInput}>Modifier</button>
        </div>
      </article>

      <article className='section-table'>
        <span>Liste des entrées :</span>
        <div className='table-frame'>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Value</th>
                <th style={{ width: '50px' }}>Supprimer</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => {
                return (
                  <tr
                    key={index}
                    onClick={() => setSelectedItemId(item.id)}
                    className={selectedItemId === item.id ? 'selected' : ''}>
                    <td>{item.id}</td>
                    <td>{item.label}</td>
                    <td className='truncate' style={{ maxWidth: '50px' }}>
                      {item.value}
                    </td>
                    <td onClick={() => removeInput(item.id)}>X</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  )
}

function getInputFromType(
  type: constants.DATA_TYPE,
  handleInputChange: (value: constants.DYNAMIC_VALUE) => void,
  actualValue: constants.DYNAMIC_VALUE | undefined
) {
  return type === constants.DATA_TYPE.ADD ? (
    <div className='section-input__data-input__checkbox'>
      <label htmlFor=''>Afficher à gauche</label>
      <input
        type='checkbox'
        className='section-input__data-input'
        onChange={(event) => handleInputChange(event.target.checked ? true : false)}
      />
    </div>
  ) : type === constants.DATA_TYPE.PAUSE ||
    type === constants.DATA_TYPE.DELETE ||
    type === constants.DATA_TYPE.REMOVE ? (
    <input
      type='number'
      className='section-input__data-input'
      placeholder='0'
      value={actualValue as number}
      onChange={(event) => handleInputChange(event.currentTarget.value)}
    />
  ) : (
    <input
      type='text'
      className='section-input__data-input'
      placeholder='Texte'
      value={actualValue as string}
      onChange={(event) => handleInputChange(event.currentTarget.value)}
    />
  )
}
