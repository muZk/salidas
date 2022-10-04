import { useState } from "react"
import { nanoid } from 'nanoid'

const CLPFormat = new Intl.NumberFormat("es", {
  style: "currency",
  currency: "CLP",
});

function formatAmount(number) {
  return  `$${CLPFormat.format(number.toFixed(2)).replace("CLP", "").trim()}`;
}

export default function Expense() {
  // fila = producto
  // columna = persona

  const [items, setItems] = useState(
    [
      {
        id: nanoid(),
        name: '',
        price: 0,
        distribution: {}
      },
    ]
  )

  const [people, setPeople] = useState([]) // { name: 'Nico', id: '...' }

  // State:
  // - cada item: name, price, participación de cada persona dentro del item (person => number)
  // - listado de personas

  // funcionalidades:
  // - Poder modificar el nombre / precio (item)
  // - Poder agregar un nuevo item
  // - Eliminar un item

  // TODO:
  // - generar ID cuando agregue un nuevo item o integrante
  // - revisar si es más "lindo" usar Immer para actualizar el estado
  // - agregar prettier (para formatear el código de forma auto)

  console.log(items);

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>$</th>
            {people.map(({ id, name }) => (
              <th key={id}>
                <input
                  type="text"
                  placeholder="Nombre"
                  value={name}
                  onChange={(event) => {
                    setPeople(people.map(person => person.id === id ? { id, name: event.target.value } : person))
                  }}
                />
              </th>
            ))}
            <th>
              <button
                onClick={() => {
                  const newPerson =  { id: nanoid(), name: '' };

                  setItems(items.map(item => ({
                    ...item,
                    distribution: { ...item.distribution, [newPerson.id]: 0 }
                  })))

                  setPeople([...people, newPerson])
                }}>
                Nuevo Integrante
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map(({ id, price, name, distribution }) => (
            <tr key={id}>
              <td>
                <input
                  type="text"
                  placeholder="Nombre de item"
                  value={name}
                  onChange={(event) => {
                    setItems(items.map(item => item.id === id ? { ...item, name: event.target.value } : item))
                  }}
                />
              </td>
              <td>
                <input
                  type="number"
                  placeholder="precio"
                  value={price}
                  onChange={(event) => {
                    setItems(items.map(item => item.id === id ? { ...item, price: parseInt(event.target.value) } : item))
                  }}
                />
              </td>
              {people.map(person => (
                <td>
                  <input
                    type="number"
                    value={distribution[person.id]}
                    min={0}
                    onChange={(event) => {
                      const newValue = parseInt(event.target.value);
                      setItems(items.map(item => item.id === id ? { ...item, distribution: { ...distribution, [person.id]: newValue } } : item))
                    }}
                  />
                </td>
              ))}
              <td></td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={2}>Total</td>
            {people.map(person => {
              let total = 0

              items.forEach((item) => {
                const totalDistribution = Object.values(item.distribution).reduce((a, b) => a + b, 0);
                const cuota = totalDistribution === 0 ? 0 : item.price / totalDistribution;
                total += cuota * item.distribution[person.id];
              })

              return <td>{formatAmount(total)}</td>
            })}
            <td></td>
          </tr>
        </tfoot>
      </table>
      <div style={{ textAlign: 'left' }}>
        <button
          onClick={() => {
            setItems([
              ...items,
              {
                id: nanoid(),
                name: '',
                price: 0,
                distribution: people.reduce((distribution, { id }) => Object.assign(distribution, { [id]: 0 }), {})
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
