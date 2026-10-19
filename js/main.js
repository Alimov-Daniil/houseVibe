document.addEventListener('DOMContentLoaded', () => {

  // 1. КЕРУВАННЯ ГОЛОВНОЮ 3D-МОДЕЛЛЮ (HERO)
  const houseModel = document.getElementById('houseModel');
  const inspectBtn = document.getElementById('inspectBtn');
  const hero3dBox = document.getElementById('hero3dBox');
  const inspectText = inspectBtn?.querySelector('.inspect-text');

  if (houseModel) {
    houseModel.addEventListener('load', () => {
      houseModel.setAttribute('camera-orbit', '45deg 70deg auto');
      houseModel.setAttribute('bounds', 'tight');
      const loader = houseModel.querySelector('.model-loader');
      if (loader) loader.style.display = 'none';
    });
  }

  let isInspectMode = false;
  if (inspectBtn && houseModel) {
    inspectBtn.addEventListener('click', () => {
      isInspectMode = !isInspectMode;

      if (isInspectMode) {
        houseModel.removeAttribute('auto-rotate');
        hero3dBox.classList.add('expanded');
        inspectText.innerText = 'Зафіксувати модель';
      } else {
        houseModel.setAttribute('auto-rotate', '');
        hero3dBox.classList.remove('expanded');
        inspectText.innerText = 'Роздивитися проєкт';
      }
    });
  }

  // 2. МОДАЛЬНЕ ВІКНО «ЗВОРОТНИЙ ЗВ'ЯЗОК»
  const callbackModal = document.getElementById('callbackModal');
  const closeCallbackModal = document.getElementById('closeCallbackModal');
  const consultationForm = document.getElementById('consultationForm');

  const heroCallbackBtn = document.getElementById('heroCallbackBtn');
  const headerPhoneBtn = document.getElementById('openCallbackModal');
  const widgetPhoneBtn = document.getElementById('widgetPhoneBtn');

  function openModal() {
    if (callbackModal) {
      callbackModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal() {
    if (callbackModal) {
      callbackModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  if (heroCallbackBtn) heroCallbackBtn.addEventListener('click', openModal);
  if (headerPhoneBtn) headerPhoneBtn.addEventListener('click', openModal);
  if (widgetPhoneBtn) widgetPhoneBtn.addEventListener('click', openModal);

  if (closeCallbackModal) closeCallbackModal.addEventListener('click', closeModal);

  if (callbackModal) {
    callbackModal.addEventListener('click', (e) => {
      if (e.target === callbackModal) closeModal();
    });
  }
 // ============================================================
  // СЛАЙДЕР ПОРІВНЯННЯ «ДО / ПІСЛЯ»
  // ============================================================
  const comparisonSlider = document.getElementById('beforeAfterSlider');

  if (comparisonSlider) {
    const badgeBefore = comparisonSlider.querySelector('.badge-before');
    const badgeAfter = comparisonSlider.querySelector('.badge-after');
    let isSliding = false;

    const setSliderPosition = (clientX) => {
      const rect = comparisonSlider.getBoundingClientRect();
      let percentage = ((clientX - rect.left) / rect.width) * 100;

      // Обмежуємо значення в межах від 0% до 100%
      if (percentage < 0) percentage = 0;
      if (percentage > 100) percentage = 100;

      comparisonSlider.style.setProperty('--position', `${percentage}%`);

      // 1. Якщо повзунок СПРАВА (>= 85%) -> зникає напис "ДО" (який зліва)
      if (badgeBefore) {
        if (percentage >= 85) {
          badgeBefore.classList.add('is-hidden');
        } else {
          badgeBefore.classList.remove('is-hidden');
        }
      }

      // 2. Якщо повзунок ЗЛІВА (<= 15%) -> зникає напис "ПІСЛЯ" (який справа)
      if (badgeAfter) {
        if (percentage <= 15) {
          badgeAfter.classList.add('is-hidden');
        } else {
          badgeAfter.classList.remove('is-hidden');
        }
      }
    };

    // Підтримка мишки та сенсорних екранів
    comparisonSlider.addEventListener('pointerdown', (e) => {
      isSliding = true;
      comparisonSlider.setPointerCapture(e.pointerId);
      setSliderPosition(e.clientX);
    });

    comparisonSlider.addEventListener('pointermove', (e) => {
      if (!isSliding) return;
      setSliderPosition(e.clientX);
    });

    const stopSliding = (e) => {
      if (isSliding) {
        isSliding = false;
        try {
          comparisonSlider.releasePointerCapture(e.pointerId);
        } catch (err) {}
      }
    };

    comparisonSlider.addEventListener('pointerup', stopSliding);
    comparisonSlider.addEventListener('pointercancel', stopSliding);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  if (consultationForm) {
    consultationForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const userName = document.getElementById('userName').value;
      const userPhone = document.getElementById('userPhone').value;

      alert(`Дякуємо, ${userName}! Ми зателефонуємо на номер ${userPhone} протягом 15 хвилин.`);
      consultationForm.reset();
      closeModal();
    });
  }

});
