// formMock.js
export class FormMock {
  static async submitForm(formData) {
    return new Promise((resolve, reject) => {
      console.log("Отправка данных формы:", formData);

      // Имитация задержки сети (1-3 секунды)
      const delay = 1000 + Math.random() * 2000;

      setTimeout(() => {
        // 85% успешных отправок, 15% ошибок
        const isSuccess = Math.random() > 0.15;

        if (isSuccess) {
          // Имитация успешного ответа от сервера
          console.log("✅ Форма успешно отправлена!", formData);
          resolve({
            success: true,
            message:
              "Форма успешно отправлена! Мы свяжемся с вами в ближайшее время.",
            data: formData,
          });
        } else {
          // Имитация различных ошибок сервера
          const errors = [
            { message: "Ошибка сервера: попробуйте еще раз", code: 500 },
            { message: "Таймаут соединения", code: 408 },
            { message: "Сервер временно недоступен", code: 503 },
            { message: "Ошибка валидации данных", code: 400 },
          ];
          const randomError = errors[Math.floor(Math.random() * errors.length)];
          console.log("❌ Ошибка отправки:", randomError);
          reject(randomError);
        }
      }, delay);
    });
  }

  // Дополнительная функция для тестирования
  static simulateNetworkConditions() {
    return {
      latency: Math.floor(Math.random() * 200) + 50, // 50-250ms
      successRate: 0.85, // 85% успеха
    };
  }
}
