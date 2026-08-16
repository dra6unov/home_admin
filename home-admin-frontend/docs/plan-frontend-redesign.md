# План: починка и новая визуальная идентичность home-admin-frontend

Статус: к выполнению (составлен 2026-08-16)

## Контекст

- Next.js 16 (App Router), React 19, Tailwind CSS v4, TypeScript, lucide-react, sonner
- Страницы: `/` (GoogleSearch + welcome + 3 карточки), `/passwords` (категории паролей),
  `/заметки` и `/settings` — в навигации есть, страниц нет (404)
- Бэкенд: `NEXT_PUBLIC_BASE_BACKEND_URL`, запросы ТОЛЬКО через `src/lib/helpers/fetchAPI.ts`
- Правила проекта (AGENTS.md): типы описывать через `type`, не `interface`;
  перед работой с Next 16 читать доки в `node_modules/next/dist/docs/`

## Принятые решения

- Объём: фаза 1 (баги) + фаза 2 (новая идентичность)
- Тема: только светлая (сломанный dark-свитч из CSS убирается)
- Акцент: тёмно-зелёный pine
- Карточки «Пользователи/Товары/Заказы» на главной — оставляем (перекрашиваем под палитру)
- Ссылки Настройки/Заметки не прячем — закрываем not-found.tsx

## Направление дизайна: «домашняя консоль»

Палитра (токены в `@theme` в `src/app/globals.css`):

| token     | hex     | роль                          |
| --------- | ------- | ----------------------------- |
| paper     | #FAF8F5 | фон                           |
| card      | #FFFFFF | поверхности                   |
| line      | #E5E1D8 | границы                       |
| ink       | #1B1B18 | текст                         |
| faint     | #6B675E | вторичный текст               |
| pine      | #1F5C46 | акцент, кнопки, focus-ring    |
| pine-deep | #10221B | сайдбар                       |
| amber     | #B45309 | статусы/ошибки (не акцент)    |

Шрифты (все с `subsets: ["cyrillic", "latin"]`):

- Unbounded — display: заголовки страниц, бренд (сдержанно)
- Golos Text — body: весь остальной текст
- JetBrains Mono — data: URL, логины, цифры, счётчики, статусы

Signature: «pulse дома» — моно-строка статуса (зелёная точка онлайн, версия) в футере
сайдбара + моно-данные в паролях. Motion минимальный: плавный аккордеон категорий
(grid-rows transition), лёгкий hover-lift карточек, respect `prefers-reduced-motion`.

## Фаза 1 — баги и консистентность

1. Заголовки по страницам: `src/app/components/Header/Header.tsx` — имя по pathname
   (карта: `/` → «Главная», `/passwords` → «Пароли», fallback «Home Admin»);
   удалить дублирующую `h1`-карточку «Пароли» из `src/app/passwords/ClientPasswords.tsx`
2. `src/app/globals.css`:
   - `body`: убрать `font-family: Arial...` (передавать через `font-sans` / тему)
   - удалить блок `@media (prefers-color-scheme: dark)`
   - удалить глобальные `@apply`-стили для `h1/h2/h3/p`
   - снять `min-height: 44px` со всех `button, a, [role=button]` (растягивает иконки copy/eye)
3. `src/app/layout.tsx`: у fonts добавить subset cyrillic
4. Состояния `/passwords`:
   - `src/app/passwords/loading.tsx` — скелетон
   - при сбое бэкенда: карточка ошибки с причиной и действием (сейчас
     `src/lib/api/password/getPasswords.ts` глотает catch и отдаёт `[]`)
5. `saving`: передать состояние в каждый `PasswordBlock` из `ClientPasswords`
   (сейчас проп `saving` не используется), блокировать повторное сохранение
6. Immutable-апдейты в `ClientPasswords.tsx`: заменить инплейс-мутации
   (onTitleChange/onItemChange) на `map`-копии блоков и паролей
7. `window.confirm` → переиспользуемый `ConfirmDialog` (components/),
   для удаления пароля и категории
8. `src/app/not-found.tsx`: «Раздел в разработке» (закрывает `/заметки`, `/settings`, 404)
9. Мелочи:
   - `src/app/components/Password/PasswordInput.tsx`: aria-label на «глаз»,
     `autoComplete="new-password"`
   - `UrlInput/LoginInput`: `autocapitalize="off" autocorrect="off"`
   - `PasswordBlock.tsx`: `aria-expanded` + button/tabIndex на шапке аккордеона
   - `src/app/components/Sidebar/Sidebar.tsx`: удалить закомментированный блок (91–98)
   - все `interface` (HeaderProps, AdminLayoutProps, SidebarProps, NavItem) → `type`
   - `src/app/components/GoogleSearch/GoogleSearch.tsx`: скрыть webkit-кнопку очистки
     у `type="search"` (`[&::-webkit-search-cancel-button]:hidden`) — она едет
     по «Поиск...»-индикатору

## Фаза 2 — новая идентичность

1. `globals.css`: токены палитры + шрифтов в `@theme inline`; `body` — paper/ink;
   focus-visible ring — pine
2. `layout.tsx`: подключить Unbounded / Golos Text / JetBrains Mono (next/font, cyrillic)
3. `Sidebar.tsx`: фон pine-deep, бренд «Home Admin» (Unbounded, заменив «Admin»),
   активный пункт — pine-пилюля + маркер, hover — brighter green,
   футер: `дом · v0.1.0` моно + зелёная точка статуса
4. `src/app/page.tsx`: 3 карточки сохраняем, акцентные полосы blue/green/purple →
   pine/amber/slate, цифры — JetBrains Mono
5. `GoogleSearch.tsx`: перекрасить под tokens (border line, focus pine, кнопка pine),
   «Поиск в Google» — eyebrow-метка (faint, mono, uppercase 11px)
6. Пароли: блоки — белые карточки (line border), раскрытая шапка — pine-deep/white,
   URL/логин/пароль — mono, заголовок категории — Golos semibold,
   кнопка «Создать» — pine solid; empty-state «Категорий пока нет — создайте первую»
7. `src/lib/helpers/toast.ts`: success — pine, error — red (#B91C1C)
8. Motion: аккордеон PasswordBlock по grid-rows, hover-lift карточек, reduced-motion
9. `not-found.tsx` в теме: большой 404 (Unbounded) + pine-акцент

## Проверка

- `npm run lint`, `npm run format:check`, `npm run build`
- ручной проход: `/`, `/passwords` (добавить/изменить/удалить/сохранить, empty-state,
  offline-бэкенд), `/settings` (not-found), mobile 375px, keyboard focus ring,
  светлая тема не ломается на машине с prefers-dark
