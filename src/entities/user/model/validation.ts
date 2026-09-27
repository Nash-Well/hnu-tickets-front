import { z } from 'zod'

export const userNameSchema = z
  .string()
  .trim()
  .min(2, 'Ім’я має містити щонайменше 2 символи')
  .max(100, 'Ім’я має містити не більше 100 символів')

export const userEmailSchema = z
  .string()
  .trim()
  .min(1, 'Введіть email')
  .pipe(z.email('Некоректна адреса електронної пошти'))

export const userPasswordSchema = z.string().min(8, 'Пароль має містити щонайменше 8 символів')

export const userErrorFields = {
  EMAIL_ALREADY_EXISTS: 'email',
  INVALID_EMAIL: 'email',
  INVALID_NAME: 'name',
  INVALID_PASSWORD: 'password',
}
