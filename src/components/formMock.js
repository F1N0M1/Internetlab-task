export class FormMock {
  static async submitForm(formData) {
    return new Promise((resolve, reject) => {
      console.log("Отправка данных формы:", formData);

      const delay = 1000 + Math.random() * 2000;

      setTimeout(() => {
        const isSuccess = Math.random() > 0.15;

        if (isSuccess) {
          console.log("✅ Форма успешно отправлена!", formData);
          resolve({
            success: true,
            message:
              "Форма успешно отправлена! Мы свяжемся с вами в ближайшее время.",
            data: formData,
          });
        } else {
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

  static simulateNetworkConditions() {
    return {
      latency: Math.floor(Math.random() * 200) + 50,
      successRate: 0.85,
    };
  }
}
