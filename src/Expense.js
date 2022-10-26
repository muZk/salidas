import { useReducer } from "react";
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
    price: 0,
  };
}

function newFriend() {
  return {
    id: nanoid(),
    name: "",
  };
}

function reducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM":
      return {
        ...state,
        splits: state.splits.concat(
          state.friends.map((friend) => ({
            friendId: friend.id,
            itemId: action.payload.id,
            amount: 0,
          }))
        ),
        items: [...state.items, action.payload],
      };
    case "ADD_FRIEND":
      return {
        ...state,
        splits: state.splits.concat(
          state.items.map((item) => ({
            friendId: action.payload.id,
            itemId: item.id,
            amount: 0,
          }))
        ),
        friends: [...state.friends, action.payload],
      };
    case "UPDATE_ITEM":
      return {
        ...state,
        items: state.items.map((item) => {
          if (item.id === action.payload.id) {
            return { ...item, ...action.payload };
          }
          return item;
        }),
      };
    case "UPDATE_FRIEND":
      return {
        ...state,
        friends: state.friends.map((friend) => {
          if (friend.id === action.payload.id) {
            return { ...friend, ...action.payload };
          }
          return friend;
        }),
      };
    case "UPDATE_SPLIT":
      return {
        ...state,
        splits: state.splits.map((split) => {
          if (
            split.itemId === action.payload.itemId &&
            split.friendId === action.payload.friendId
          ) {
            return { ...split, ...action.payload };
          }
          return split;
        }),
      };
    case "DELETE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload.id),
        splits: state.splits.filter(
          (split) => split.itemId !== action.payload.id
        ),
      };
    case "DELETE_FRIEND":
      return {
        ...state,
        friends: state.friends.filter(
          (friend) => friend.id !== action.payload.id
        ),
        splits: state.splits.filter(
          (split) => split.friendId !== action.payload.id
        ),
      };
    default:
      return state;
  }
}

export default function Expense() {
  const [state, dispatch] = useReducer(reducer, {
    items: [newItem()],
    friends: [],
    splits: [],
  });

  const { items, friends, splits } = state;

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

  const getTotalConsumption = () => {
    let totalConsumption = 0
    items.forEach((item) => {
      totalConsumption += item.price;
    })
    return totalConsumption;
  }

  const getTip = (mount) => {
    const tipValue = 0.1;
    return mount * tipValue;
  }

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
                    dispatch({
                      type: "UPDATE_FRIEND",
                      payload: { id, name: event.target.value },
                    });
                  }}
                />
                <button
                  onClick={() => {
                    dispatch({ type: "DELETE_FRIEND", payload: { id } });
                  }}
                >
                  x
                </button>
              </th>
            ))}
            <th>
              <button
                onClick={() =>
                  dispatch({ type: "ADD_FRIEND", payload: newFriend() })
                }
              >
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
                    dispatch({
                      type: "UPDATE_ITEM",
                      payload: { id, name: event.target.value },
                    });
                  }}
                />
              </td>
              <td>
                <input
                  type="number"
                  placeholder="precio"
                  value={price}
                  onChange={(event) => {
                    dispatch({
                      type: "UPDATE_ITEM",
                      payload: {
                        id,
                        name,
                        price: parseInt(event.target.value),
                      },
                    });
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
                      dispatch({
                        type: "UPDATE_SPLIT",
                        payload: {
                          itemId: id,
                          friendId: friend.id,
                          amount: parseInt(event.target.value),
                        },
                      });
                    }}
                  />
                </td>
              ))}
              <td>
                <button
                  onClick={() => {
                    dispatch({ type: "DELETE_ITEM", payload: { id } });
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
            <td>Total Consumo</td>
            <td>{formatAmount(getTotalConsumption())}</td>
            {friends.map((friend) => (
              <td key={friend.id}>{formatAmount(getFriendTotal(friend.id))}</td>
            ))}
            <td></td>
          </tr>
          <tr>
            <td>Propina (10%)</td>
            <td>{formatAmount(getTip(getTotalConsumption()))}</td>
            {friends.map((friend) => (
              <td key={friend.id}>{formatAmount(getTip(getFriendTotal(friend.id)))}</td>
            ))}
            <td></td>
          </tr>
          <tr>
            <td>Total a pagar</td>
            <td>{formatAmount(getTotalConsumption() + getTip(getTotalConsumption()))}</td>
            {friends.map((friend) => (
              <td key={friend.id}>
                {formatAmount(getFriendTotal(friend.id) + getTip(getFriendTotal(friend.id)))}
              </td>
            ))}
            <td></td>
          </tr>
        </tfoot>
      </table>
      <div style={{ textAlign: "left" }}>
        <button
          onClick={() => dispatch({ type: "ADD_ITEM", payload: newItem() })}
        >
          Agregar item
        </button>
      </div>
    </>
  );
}
