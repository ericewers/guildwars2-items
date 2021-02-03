import React from 'react';
import ItemPopup from './ItemPopup'

const Items = ({ data }) => {

  const items = data.map(item => (
    <tr key={item.id}>
      <td><ItemPopup
        id={item.id}
        desc={item.description}
        name={item.name}
        rarity={item.rarity}
        icon={item.icon} />
      </td>
      <td>{item.name}</td>
      <td>{item.level}</td>
      <td>{item.rarity}</td>
      <td>{item.type} {item.details && item.details['type'] ? ' - ' + item.details['type'] : ''}</td>
    </tr>
  ))

  return <div>

    <table id="items">
      <thead>
        <tr>
          <th></th>
          <th>Item Name</th>
          <th>Required Level</th>
          <th>Rarity</th>
          <th>Category</th>
        </tr>
      </thead>
      <tbody>
        {items}
      </tbody>
    </table>

  </div>

}

export default Items
