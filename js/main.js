document.addEventListener('DOMContentLoaded', () => {
  const houseModel = document.getElementById('houseModel');
  const inspectBtn = document.getElementById('inspectBtn');
  const hero3dBox = document.getElementById('hero3dBox');
  const inspectText = inspectBtn?.querySelector('.inspect-text');

  // Налаштування камери після завантаження будинку
  if (houseModel) {
    houseModel.addEventListener('load', () => {
      houseModel.setAttribute('camera-orbit', '45deg 70deg auto');
      houseModel.setAttribute('bounds', 'tight');
      // Приховуємо напис завантаження
      const loader = houseModel.querySelector('.model-loader');
      if (loader) loader.style.display = 'none';
    });

    houseModel.addEventListener('error', (event) => {
      console.error('Помилка завантаження локальної 3D моделі:', event);
    });
  }

  // Режим огляду моделі
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

  // Модальне вікно дзвінка
  const callbackModal = document.getElementById('callbackModal');
  const heroCallbackBtn = document.getElementById('heroCallbackBtn');
  const headerPhoneBtn = document.getElementById('openCallbackModal');
  const closeCallbackModal = document.getElementById('closeCallbackModal');
  const callbackForm = document.getElementById('callbackForm');

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
  if (closeCallbackModal) closeCallbackModal.addEventListener('click', closeModal);

  if (callbackModal) {
    callbackModal.addEventListener('click', (e) => {
      if (e.target === callbackModal) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  if (callbackForm) {
    callbackForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const userName = document.getElementById('userName').value;
      const userPhone = document.getElementById('userPhone').value;

      alert(`Дякуємо, ${userName}! Ми зателефонуємо на номер ${userPhone} протягом 15 хвилин.`);
      callbackForm.reset();
      closeModal();
    });
  }
});