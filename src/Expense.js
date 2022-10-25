import { useState } from "react";
import { nanoid } from "nanoid";

const CLPFormat = new Intl.NumberFormat("es", {
  style: "currency",
  currency: "CLP",
});

function formatAmount(number) {
  return `$${CLPFormat.format(number.toFixed(2)).replace("CLP", "").trim()}`;
}

function newItem() {
  return {
    id: nanoid(),
    name: "",
    amount: 0,
  };
}

function newFriend() {
  return {
    id: nanoid(),
    name: "",
  };
}

export default function Expense() {
  const [items, setItems] = useState(() => [newItem()]);
  const [friends, setFriends] = useState([]);
  const [splits, setSplits] = useState([]);

  const getContribution = (itemId, friendId) => {
    return (
      splits.find(
        (split) => split.itemId === itemId && split.friendId === friendId
      )?.amount || 0
    );
  };

  const getFriendTotal = (friendId) => {
    let total = 0;

    items.forEach((item) => {
      const totalDistribution = splits
        .filter((split) => split.itemId === item.id)
        .reduce((total, { amount }) => total + amount, 0);
      const cuota =
        totalDistribution === 0 ? 0 : item.price / totalDistribution;
      total += cuota * getContribution(item.id, friendId);
    });

    return total;
  };

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
                    setFriends(friends.filter((friend) => friend.id !== id));
                    setSplits(splits.filter((split) => split.friendId !== id));
                  }}
                >
                  x
                </button>
              </th>
            ))}
            <th>
              <button onClick={() => setFriends(friends.concat(newFriend()))}>
                Nuevo Integrante
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map(({ id, price, name }) => (
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
                    value={getContribution(id, friend.id)}
                    min={0}
                    onChange={(event) => {
                      const newAmount = parseInt(event.target.value);
                      const existingSplit = splits.find(
                        ({ itemId, friendId }) =>
                          itemId === id && friendId === friend.id
                      );

                      if (existingSplit) {
                        setSplits(
                          splits.map((split) =>
                            split === existingSplit
                              ? { ...split, amount: newAmount }
                              : split
                          )
                        );
                      } else {
                        setSplits(
                          splits.concat({
                            itemId: id,
                            friendId: friend.id,
                            amount: newAmount,
                          })
                        );
                      }
                    }}
                  />
                </td>
              ))}
              <td>
                <button
                  onClick={() => {
                    setItems(items.filter((item) => item.id !== id));
                    setSplits(splits.filter((split) => split.itemId !== id));
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
            {friends.map((friend) => (
              <td key={friend.id}>{formatAmount(getFriendTotal(friend.id))}</td>
            ))}
            <td></td>
          </tr>
        </tfoot>
      </table>
      <div style={{ textAlign: "left" }}>
        <button onClick={() => setItems(items.concat(newItem()))}>
          Agregar item
        </button>
      </div>
    </>
  );
}
