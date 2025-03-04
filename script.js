document.addEventListener("DOMContentLoaded", () => {
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const messageInput = document.getElementById("message");

  nameInput.addEventListener("input", function () {
    validateName();
  });

  emailInput.addEventListener("input", function () {
    validateEmail();
  });

  messageInput.addEventListener("input", function () {
    validateMessage();
  });

  document
    .getElementById("contactForm")
    .addEventListener("submit", async function (e) {
      e.preventDefault();

      if (validateForm()) {
        const form = e.target;
        const formData = {
          name: nameInput.value.trim(),
          email: emailInput.value.trim(),
          message: messageInput.value.trim(),
        };

        try {
          const response = await fetch(form.action, {
            method: form.method,
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify(formData),
          });

          if (response.ok) {
            document.getElementById("successMessage").style.display = "block";
            form.reset();
            clearValidationErrors();
          } else {
            alert(
              "There was a problem with your submission. Please try again."
            );
          }
        } catch (error) {
          alert(
            "Error: Could not send your message. Please check your connection and try again."
          );
        }
      }
    });

  function validateName() {
    const name = nameInput.value.trim();
    if (!/^[A-Za-z\s]+$/.test(name)) {
      showError(nameInput, "validation.name");
      return false;
    } else {
      clearError(nameInput);
      return true;
    }
  }

  function validateEmail() {
    const email = emailInput.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showError(emailInput, "validation.email");
      return false;
    } else {
      clearError(emailInput);
      return true;
    }
  }

  function validateMessage() {
    const message = messageInput.value.trim();
    if (message.length < 20) {
      showError(messageInput, "validation.message");
      return false;
    } else {
      clearError(messageInput);
      return true;
    }
  }

  function validateForm() {
    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isMessageValid = validateMessage();

    return isNameValid && isEmailValid && isMessageValid;
  }

  function showError(input, translationKey) {
    let errorDiv = input.nextElementSibling;
    if (!errorDiv || !errorDiv.classList.contains("validation-error")) {
      errorDiv = document.createElement("div");
      errorDiv.classList.add("validation-error");
      errorDiv.style.color = "var(--red-munsell)";
      errorDiv.style.marginTop = "5px";
      input.parentNode.appendChild(errorDiv);
    }

    errorDiv.setAttribute("data-translation-key", translationKey);

    getTranslation(translationKey, (message) => {
      errorDiv.textContent = message;
    });
  }

  function updateValidationErrors() {
    const errorDivs = document.querySelectorAll(".validation-error");

    errorDivs.forEach((errorDiv) => {
      const translationKey = errorDiv.getAttribute("data-translation-key");

      if (translationKey) {
        getTranslation(translationKey, (message) => {
          errorDiv.textContent = message;
        });
      }
    });
  }

  function getTranslation(key, callback) {
    const lang = defaultLanguage || "es";
    loadTranslations((translations) => {
      const keys = key.split(".");
      let translation = translations[lang];

      keys.forEach((k) => {
        if (translation && translation[k]) {
          translation = translation[k];
        }
      });

      if (translation) {
        callback(translation);
      } else {
        callback("Translation not found");
      }
    });
  }

  function clearError(input) {
    const errorDiv = input.nextElementSibling;
    if (errorDiv && errorDiv.classList.contains("validation-error")) {
      errorDiv.remove();
    }
  }

  function clearValidationErrors() {
    document.querySelectorAll(".validation-error").forEach((el) => el.remove());
  }

  function loadTranslations(callback) {
    fetch("data/translations.json")
      .then((response) => response.json())
      .then((data) => {
        callback(data);
      })
      .catch((error) =>
        console.error("Error al cargar el archivo de traducciones:", error)
      );
  }

  function changeLanguage(lang) {
    loadTranslations((translations) => {
      const elements = document.querySelectorAll("[data-i18n]");
      elements.forEach((element) => {
        const key = element.getAttribute("data-i18n");
        const keys = key.split(".");
        let translation = translations[lang];

        keys.forEach((k) => {
          if (translation && translation[k]) {
            translation = translation[k];
          }
        });

        if (translation) {
          element.innerHTML = translation;
        }
      });

      const placeholders = document.querySelectorAll("[data-i18n-placeholder]");
      placeholders.forEach((element) => {
        const key = element.getAttribute("data-i18n-placeholder");
        const keys = key.split(".");
        let translation = translations[lang];

        keys.forEach((k) => {
          if (translation && translation[k]) {
            translation = translation[k];
          }
        });

        if (translation) {
          element.setAttribute("placeholder", translation);
        }
      });
      updateValidationErrors();
    });
  }

  let defaultLanguage = "es";

  document
    .getElementById("changeLangEn")
    .addEventListener("click", function () {
      defaultLanguage = "en";
      changeLanguage(defaultLanguage);
    });

  document
    .getElementById("changeLangEs")
    .addEventListener("click", function () {
      defaultLanguage = "es";
      changeLanguage(defaultLanguage);
    });

  changeLanguage(defaultLanguage);
});
