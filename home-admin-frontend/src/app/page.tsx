export default function Home() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Добро пожаловать!
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          Это стартовая страница админ-панели. Навигация доступна в боковом меню.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {[
          { title: "Пользователи", value: "0", color: "bg-blue-500" },
          { title: "Товары", value: "0", color: "bg-green-500" },
          { title: "Заказы", value: "0", color: "bg-purple-500" },
        ].map((card) => (
          <div
            key={card.title}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6"
          >
            <p className="text-xs sm:text-sm text-gray-500">{card.title}</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{card.value}</p>
            <div className={`h-1 mt-3 sm:mt-4 rounded-full ${card.color}`} />
          </div>
        ))}
      </div>
    </div>
  );
}
