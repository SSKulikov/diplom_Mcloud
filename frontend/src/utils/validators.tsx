export function validatePassword(password: string) {
  if (!/[A-Z]+/.test(password)) {
    throw new Error("Нет большой буквы");
  }
  if (!/[0-9]+/.test(password)) throw new Error("Нет цифры");
  if (!/[!@#$%^&*)(+=._-]+/.test(password)) throw new Error("Нет спецсимвола");
  if (password.length <= 6) throw new Error("Больше 6 символов");
  return true;
}

export function validateLogin(login: string) {
  if (!/^[a-zA-Z][a-zA-Z0-9]+$/.test(login))
    throw new Error("Только латинские буквы и цифры, первый символ — буква");
  if (login.length < 4 || login.length >= 20)
    throw new Error("Длина от 4 до 20 символов");
  return true;
}

export function validateEmail(email: string) {
  if (!/^[A-Z0-9._%+-]+@[A-Z0-9-]+.[A-Z]{2,4}$/i.test(email))
    throw new Error("Неверный email");

  return true;
}
