import React from 'react'
import { Popup } from 'semantic-ui-react'

const ItemPopup = ({ id, desc, name, rarity, icon }) => (
    <Popup
        key={id}
        content={desc}
        header={name}
        trigger={<img className={rarity} src={icon} alt={name} />}
        wide
        position='right center'
    />
)

export default ItemPopup
