export default function Hero({ onClick }) {
  return (
    <div>
      <h1 className="fw-bold mt-3">Salidas 🍔</h1>
      <p>¿Saliste y pagaste tu la cuenta? 😱</p>
      <p>No te preocupes. Divide la cuenta de manera fácil.</p>
      <button className="btn btn-primary" onClick={onClick}>Nuevo gasto</button>
    </div>
  );
}
