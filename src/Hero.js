import { has, reset } from "./storage";

export default function Hero({ onClick }) {
  const hasSavedExpense = has();

  return (
    <div>
      <h1 className="fw-bold mt-3">Salidas 🍔</h1>
      <p>¿Saliste y pagaste tu la cuenta? 😱</p>
      <p>No te preocupes. Divide la cuenta de manera fácil.</p>
      <button className="btn btn-primary" onClick={onClick}>
        {hasSavedExpense ? "Editar Gasto" : "Nuevo Gasto"}
      </button>
      {hasSavedExpense && (
        <button
          className="btn btn-secondary ms-2"
          onClick={() => {
            if (
              window.confirm(
                "Esto borrará tu gasto guardado, ¿quieres continuar?"
              )
            ) {
              reset();
              onClick();
            }
          }}
        >
          Nuevo Gasto
        </button>
      )}
    </div>
  );
}
