import React from 'react';

const Items = ({ data, pageNumber, pageSize }) => {

  const minIndex = (pageNumber - 1) * pageSize
  const maxIndex = (pageNumber * pageSize) - 1
  const items = data.slice(minIndex, maxIndex).map(r => (
    <tr key={r.id}>
      <td><img className={r.rarity} src={r.icon} alt={r.name}></img></td>
      <td>{r.name}</td>
      <td>{r.level != null ? r.level : 0}</td>
      <td>{r.rarity}</td>
      <td>{r.type != null ? r.type : ''} - {r.details}</td>
    </tr>
  ))

  return <div>

          <table id="items">
            <thead>
              <tr>
                <th></th>
                <th width="50%">Item Name</th>
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