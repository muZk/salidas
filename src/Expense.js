import { useState } from "react"

export default function Expense() {
  // fila = producto
  // columna = persona

  const [items, setItems] = useState(
    [
      {
        name: 'Tricarne',
        price: 19900,
        distribution: [
          1,
          1,
          2,
          1,
        ]
      },
    ]
  )

  const people = [
    'Nico',
    'Eli',
    'Gio',
    'Pancho'
  ]

  // State:
  // - cada item: name, price, participación de cada persona dentro del item (person => number)
  // - listado de personas

  // funcionalidades:
  // - Poder modificar el nombre / precio (item)
  // - Poder agregar un nuevo item
  // - Eliminar un item

  // TODO: revisar si es buena idea ocupar

  console.log(items);

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>$</th>
            {people.map(name => <th key={name}>{name}</th>)}
          </tr>
        </thead>
        <tbody>
          {items.map((item, itemIndex) => (
            <tr>
              <td>
                <input
                  type="text"
                  placeholder="Nombre de item"
                  value={item.name}
                  onChange={(event) => {
                    const newState = [...items];
                    newState[itemIndex] = {
                      ...item,
                      name: event.target.value,
                    }
                    setItems(newState);
                  }}
                />
              </td>
              <td>
                <input
                  type="number"
                  placeholder="precio"
                  value={item.price}
                  onChange={(event) => {
                    const newState = [...items];
                    newState[itemIndex] = {
                      ...item,
                      price: parseInt(event.target.value),
                    }
                    setItems(newState);
                  }}
                />
              </td>
              {item.distribution.map((count, distributionIndex) => (
                <td>
                  <input
                    type="number"
                    value={count}
                    min={0}
                    onChange={(event) => {
                      const newValue = parseInt(event.target.value);
                      const newState = [...items]; // <--- Revisar esto
                      newState[itemIndex].distribution[distributionIndex] = newValue;
                      setItems(newState);
                    }}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ textAlign: 'left' }}>
        <button
          onClick={() => {
            setItems([
              ...items,
              {
                name: null,
                price: null,
                distribution: people.map(() => 0)
              }
            ])
          }}
        >
          Agregar item
        </button>
      </div>
    </>
  )
}
