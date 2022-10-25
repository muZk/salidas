import { useState } from "react";
import { nanoid } from "nanoid";

const CLPFormat = new Intl.NumberFormat("es", {
  style: "currency",
  currency: "CLP",
});

function formatAmount(number) {
  return `$${CLPFormat.format(number.toFixed(2)).replace("CLP", "").trim()}`;
}

export default function Expense() {
  // fila = producto
  // columna = persona

  const [items, setItems] = useState([
    {
      id: nanoid(),
      name: "",
      price: 0,
      distribution: {},
    },
  ]);

  const [friends, setFriends] = useState([]); // { name: 'Nico', id: '...' }

  // State:
  // - cada item: name, price, participación de cada persona dentro del item (person => number)
  // - listado de personas

  // funcionalidades:
  // - Poder modificar el nombre / precio (item)
  // - Poder agregar un nuevo item
  // - Eliminar un item

  // TODO:
  // - revisar si es más "lindo" usar Immer para actualizar el estado
  // - agregar prettier (para formatear el código de forma auto)
  // - cambiar la lógica de "distribution" a true/false

  console.log(items);

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>$</th>
            {friends.map(({ id, name }) => (
              <th key={id}>
                <input
                  type="text"
                  placeholder="Nombre"
                  value={name}
                  onChange={(event) => {
                    setFriends(
                      friends.map((friend) =>
                        friend.id === id
                          ? { id, name: event.target.value }
                          : friend
                      )
                    );
                  }}
                />
                <button
                  onClick={() => {
                    setFriends(friends.filter((item) => item.id !== id));
                    setItems(
                      items.map((item) => {
                        const distribution = { ...item.distribution };
                        delete distribution[id];
                        return {
                          ...item,
                          distribution,
                        };
                      })
                    );
                  }}
                >
                  x
                </button>
              </th>
            ))}
            <th>
              <button
                onClick={() => {
                  const newFriend = { id: nanoid(), name: "" };

                  setItems(
                    items.map((item) => ({
                      ...item,
                      distribution: { ...item.distribution, [newFriend.id]: 0 },
                    }))
                  );

                  setFriends([...friends, newFriend]);
                }}
              >
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
                    setItems(
                      items.map((item) =>
                        item.id === id
                          ? { ...item, name: event.target.value }
                          : item
                      )
                    );
                  }}
                />
              </td>
              <td>
                <input
                  type="number"
                  placeholder="precio"
                  value={price}
                  onChange={(event) => {
                    setItems(
                      items.map((item) =>
                        item.id === id
                          ? { ...item, price: parseInt(event.target.value) }
                          : item
                      )
                    );
                  }}
                />
              </td>
              {friends.map((friend) => (
                <td key={friend.id}>
                  <input
                    type="number"
                    value={distribution[friend.id]}
                    min={0}
                    onChange={(event) => {
                      const newValue = parseInt(event.target.value);
                      setItems(
                        items.map((item) =>
                          item.id === id
                            ? {
                                ...item,
                                distribution: {
                                  ...distribution,
                                  [friend.id]: newValue,
                                },
                              }
                            : item
                        )
                      );
                    }}
                  />
                </td>
              ))}
              <td>
                <button
                  onClick={() => {
                    setItems(items.filter((item) => item.id !== id));
                  }}
                >
                  Borrar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={2}>Total</td>
            {friends.map((friend) => {
              let total = 0;

              items.forEach((item) => {
                const totalDistribution = Object.values(item.distribution)
                  .map((a) => a || 0)
                  .reduce((a, b) => a + b, 0);
                const cuota =
                  totalDistribution === 0 ? 0 : item.price / totalDistribution;
                total += cuota * (item.distribution[friend.id] || 0);
              });

              return <td key={friend.id}>{formatAmount(total)}</td>;
            })}
            <td></td>
          </tr>
        </tfoot>
      </table>
      <div style={{ textAlign: "left" }}>
        <button
          onClick={() => {
            setItems([
              ...items,
              {
                id: nanoid(),
                name: "",
                price: 0,
                distribution: friends.reduce(
                  (distribution, { id }) =>
                    Object.assign(distribution, { [id]: 0 }),
                  {}
                ),
              },
            ]);
          }}
        >
          Agregar item
        </button>
      </div>
    </>
  );
}
