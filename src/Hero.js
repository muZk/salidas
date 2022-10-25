export default function Hero({ onClick }) {
  return (
    <div>
      <h1>Salidas 🍔</h1>
      <p>¿Saliste y pagaste tu la cuenta? 😱</p>
      <p>No te preocupes. Divide la cuenta de manera fácil.</p>
      <button onClick={onClick}>Nuevo gasto</button>
    </div>
  );
}
