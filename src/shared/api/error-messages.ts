import { isApiError } from './api-error'

const messagesByCode: Record<string, string> = {
  INTERNAL_ERROR: 'На сервері сталася помилка. Спробуйте пізніше.',
  NETWORK_ERROR: 'Не вдалося з’єднатися із сервером. Перевірте підключення.',
  INVALID_JSON: 'Сервер не зміг обробити запит.',
  INVALID_ID: 'Некоректний ідентифікатор.',
  INVALID_FILTER: 'Некоректні параметри фільтрації.',
  INVALID_PERIOD: 'Некоректний період: дата початку пізніша за дату завершення.',
  UNAUTHORIZED: 'Потрібна авторизація.',
  INVALID_TOKEN: 'Сесія завершилась. Увійдіть повторно.',
  INVALID_CREDENTIALS: 'Невірний email або пароль.',
  INVALID_PASSWORD: 'Пароль має містити щонайменше 8 символів.',
  EMAIL_ALREADY_EXISTS: 'Користувач з таким email вже існує.',
  INVALID_NAME: 'Ім’я має містити від 2 до 100 символів.',
  INVALID_EMAIL: 'Некоректна адреса електронної пошти.',
  INVALID_ROLE: 'Некоректна роль.',
  USER_NOT_FOUND: 'Користувача не знайдено.',
  FORBIDDEN: 'Недостатньо прав для виконання цієї дії.',
  CATEGORY_NOT_FOUND: 'Категорію не знайдено.',
  CATEGORY_NAME_EXISTS: 'Категорія з такою назвою вже існує.',
  CATEGORY_IN_USE: 'Категорію не можна видалити, оскільки вона використовується в заявках.',
  INVALID_CATEGORY_NAME: 'Назва категорії має містити від 2 до 100 символів.',
  TICKET_NOT_FOUND: 'Заявку не знайдено.',
  INVALID_TITLE: 'Назва має містити від 3 до 255 символів.',
  INVALID_DESCRIPTION: 'Опис є обов’язковим.',
  INVALID_CATEGORY: 'Оберіть існуючу категорію.',
  INVALID_REFERENCE: 'Категорія або спеціаліст не існує.',
  INVALID_PRIORITY: 'Некоректний пріоритет.',
  INVALID_STATUS: 'Некоректний статус.',
  INVALID_ORDER: 'Некоректний напрямок сортування.',
  INVALID_SORT: 'Некоректне поле сортування.',
  INVALID_SPECIALIST: 'Спеціаліста не знайдено.',
  SPECIALIST_REQUIRED: 'Призначити можна лише користувача з роллю «Спеціаліст».',
  TERMINAL_TICKET: 'Закриту або скасовану заявку не можна призначити.',
  INVALID_STATUS_TRANSITION: 'Такий перехід статусу недопустимий.',
  INVALID_COMMENT: 'Коментар має містити від 1 до 5000 символів.',
  ROUTE_NOT_FOUND: 'Ресурс не знайдено.',
  METHOD_NOT_ALLOWED: 'Операція не підтримується.',
}

export function getErrorMessage(error: unknown, fallback = 'Щось пішло не так. Спробуйте ще раз.'): string {
  if (isApiError(error)) {
    return messagesByCode[error.code] ?? error.message ?? fallback
  }
  return fallback
}
