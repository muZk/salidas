import { useState } from "react"

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
        name: null,
        price: null,
        distribution: []
      },
    ]
  )

  const [people, setPeople] = useState([])

  // State:
  // - cada item: name, price, participación de cada persona dentro del item (person => number)
  // - listado de personas

  // funcionalidades:
  // - Poder modificar el nombre / precio (item)
  // - Poder agregar un nuevo item
  // - Eliminar un item

  // TODO:
  // - generar ID cuando agregue un nuevo item o integrante

  console.log(items);

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>$</th>
            {people.map((name, index) => (
              <th key={index}>
                <input
                  type="text"
                  placeholder="Nombre"
                  value={name}
                  onChange={(event) => {
                    const newPeople = [...people];
                    newPeople[index] = event.target.value;
                    setPeople(newPeople);
                  }}
                />
              </th>
            ))}
            <th>
              <button
                onClick={() => {
                  setPeople([...people, ''])
                  setItems(items.map(item => ({
                    ...item,
                    distribution: [...item.distribution, 0]
                  })))
                }}>
                Nuevo Integrante
              </button>
            </th>
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
              <td></td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={2}>Total</td>
            {people.map((_, personIndex) => {
              let total = 0

              items.forEach((item) => {
                const totalDistribution = item.distribution.reduce((a, b) => a + b, 0);
                const cuota = totalDistribution === 0 ? 0 : item.price / totalDistribution;
                total += cuota * item.distribution[personIndex];
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
