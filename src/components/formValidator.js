import { FormMock } from "./formMock.js";

export class FormValidator {
  constructor(form) {
    this.form = form;
    this.inputs = form.querySelectorAll(".form__input");
    this.checkbox = form.querySelector(".form__checkbox");
    this.submitButton = form.querySelector(".form__submit");
    this.phoneInput = form.querySelector('input[name="phone"]');
    this.init();
  }

  init() {
    this.inputs.forEach((input) => {
      if (input.name === "phone") {
        input.addEventListener("input", (e) => this.formatPhone(e));
        input.addEventListener("keydown", (e) => this.handlePhoneKeydown(e));
      }
      input.addEventListener("input", () => this.validateField(input));
      input.addEventListener("blur", () => this.validateField(input));
    });

    if (this.checkbox) {
      this.checkbox.addEventListener("change", () => this.updateSubmitButton());
    }

    this.form.addEventListener("submit", (e) => this.handleSubmit(e));
  }

  formatPhone(e) {
    const input = e.target;
    let value = input.value.replace(/\D/g, "");

    if (value.startsWith("8")) {
      value = "7" + value.slice(1);
    }

    if (value.length > 11) {
      value = value.slice(0, 11);
    }

    let formattedValue = "";
    if (value) {
      formattedValue = "+7 ";

      if (value.length > 1) {
        formattedValue += "(" + value.slice(1, 4);
      }
      if (value.length > 4) {
        formattedValue += ") " + value.slice(4, 7);
      }
      if (value.length > 7) {
        formattedValue += "-" + value.slice(7, 9);
      }
      if (value.length > 9) {
        formattedValue += "-" + value.slice(9, 11);
      }
    }

    input.value = formattedValue;
    this.validateField(input);
  }

  handlePhoneKeydown(e) {
    if (
      [46, 8, 9, 27, 13].includes(e.keyCode) ||
      (e.keyCode === 65 && e.ctrlKey === true) ||
      (e.keyCode === 67 && e.ctrlKey === true) ||
      (e.keyCode === 86 && e.ctrlKey === true) ||
      (e.keyCode === 88 && e.ctrlKey === true) ||
      (e.keyCode >= 35 && e.keyCode <= 39)
    ) {
      return;
    }

    if (
      (e.keyCode < 48 || e.keyCode > 57) &&
      (e.keyCode < 96 || e.keyCode > 105)
    ) {
      e.preventDefault();
    }
  }

  validateField(field) {
    const errorElement = field.closest("label")?.querySelector(".form__error");

    if (!errorElement) {
      console.warn("Error element not found for field:", field.name);
      return;
    }

    this.validateInput(field, errorElement);
    this.updateSubmitButton();
  }

  validateInput(input, errorElement) {
    let isValid = true;
    let errorMessage = "";

    if (!input.value.trim()) {
      isValid = false;
      errorMessage = "Это поле обязательно для заполнения";
    } else if (input.name === "name") {
      isValid = this.validateName(input.value);
      if (!isValid)
        errorMessage = "Имя должно содержать только буквы (2-30 символов)";
    } else if (input.name === "phone") {
      isValid = this.validatePhone(input.value);
      if (!isValid) errorMessage = "Введите корректный номер телефона";
    }

    this.setFieldState(input, errorElement, isValid, errorMessage);
  }

  setFieldState(field, errorElement, isValid, errorMessage) {
    if (!field || !errorElement) {
      console.warn("Field or error element is null");
      return;
    }

    field.classList.remove("valid", "invalid");
    errorElement.classList.remove("show");

    if (field.value) {
      if (isValid) {
        field.classList.add("valid");
      } else {
        field.classList.add("invalid");
        errorElement.textContent = errorMessage;
        errorElement.classList.add("show");
      }
    }
  }

  validateName(name) {
    const regex = /^[a-zA-Zа-яА-ЯёЁ\s]{2,30}$/;
    return regex.test(name.trim());
  }

  validatePhone(phone) {
    const regex = /^\+7\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/;
    return regex.test(phone.trim());
  }

  updateSubmitButton() {
    const allValid = Array.from(this.inputs).every((input) => {
      return input.value.trim() && !input.classList.contains("invalid");
    });

    if (this.submitButton) {
      this.submitButton.disabled = !allValid;
    }
  }

  getFormData() {
    let cleanPhone = this.form.phone.value.replace(/\D/g, "");
    if (cleanPhone.startsWith("7")) {
      cleanPhone = "+7" + cleanPhone.slice(1);
    } else if (cleanPhone) {
      cleanPhone = "+7" + cleanPhone;
    }

    return {
      name: this.form.name.value,
      phone: cleanPhone,
      agreement: this.form.agreement.checked,
    };
  }

  async handleSubmit(e) {
    e.preventDefault();

    let allValid = true;
    this.inputs.forEach((input) => {
      const errorElement = input
        .closest("label")
        ?.querySelector(".form__error");
      if (!errorElement) return;

      this.validateInput(input, errorElement);
      if (!input.value.trim() || input.classList.contains("invalid")) {
        allValid = false;
      }
    });

    if (!allValid) {
      const firstError = this.form.querySelector(".invalid");
      if (firstError) firstError.focus();
      return;
    }

    this.setLoadingState(true);
    this.hideMessage();

    try {
      const formData = this.getFormData();
      const result = await FormMock.submitForm(formData);

      if (result.success) {
        this.showSuccessMessage(result.message);
        this.form.reset();
        this.inputs.forEach((input) =>
          input.classList.remove("valid", "invalid")
        );
        this.updateSubmitButton();
      }
    } catch (error) {
      this.showErrorMessage(error.message || "Произошла непредвиденная ошибка");
    } finally {
      this.setLoadingState(false);
    }
  }

  setLoadingState(isLoading) {
    if (!this.submitButton) return;

    if (isLoading) {
      this.submitButton.disabled = true;
      this.submitButton.textContent = "Отправка...";
    } else {
      this.updateSubmitButton();
      this.submitButton.textContent = "Отправить";
    }
  }

  showSuccessMessage(message) {
    this.showMessage("✅ " + message, "success");
  }

  showErrorMessage(message) {
    this.showMessage("❌ " + message, "error");
  }

  showMessage(text, type) {
    if (!this.messageContainer) {
      this.messageContainer = document.createElement("div");
      this.messageContainer.className = "form__message";
      this.form.appendChild(this.messageContainer);
    }

    this.messageContainer.textContent = text;
    this.messageContainer.className = `form__message show ${type}`;

    setTimeout(() => {
      this.hideMessage();
    }, 5000);
  }

  hideMessage() {
    if (this.messageContainer) {
      this.messageContainer.classList.remove("show", "success", "error");
    }
  }
}
