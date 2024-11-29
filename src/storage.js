const STORAGE_KEY = "expense";

export function has() {
  return Boolean(localStorage.getItem(STORAGE_KEY));
}

export function set(state) {
  localStorage.setItem("expense", JSON.stringify(state));
}

export function get() {
  if (has()) {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY));
    } catch (error) {
      return null;
    }
  }
}

export function reset() {
  localStorage.removeItem(STORAGE_KEY);
}
