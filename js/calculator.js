document.addEventListener('DOMContentLoaded', () => {

  // Базові тарифи комплектацій ($ за 1 м²) за ринком України
  const PACKAGE_RATES = {
    box: 510,        // Коробка (фундамент, стіни, перекриття, дах)
    whitebox: 840,   // White Box (коробка + фасад, вікна, електрика, опалення, штукатурка)
    turnkey: 1350    // Під ключ (повний чистовий дизайнерський ремонт)
  };

  // Коефіцієнти матеріалу стін
  const MATERIAL_MULTIPLIERS = {
    aerocrete: 1.0,    // Газобетон D400 (базовий)
    ceramoblock: 1.09, // Керамоблок (+9%)
    monolith: 1.18     // Монолітний каркас (+18%)
  };

  // Коефіцієнти поверховості
  const FLOOR_MULTIPLIERS = {
    '1': 1.04,  // 1 поверх (більша площа фундаменту і покрівлі на м²)
    '2': 1.00,  // 2 поверхи (найоптимальніше співвідношення)
    '2.5': 1.12 // 2 поверхи + експлуатована тераса-покрівля
  };

  // Орієнтовний курс USD/UAH
  const USD_TO_UAH = 41.5;

  // Елементи форми
  const areaRange = document.getElementById('areaRange');
  const areaTextValue = document.getElementById('areaTextValue');

  // Елементи виводу
  const totalUsdEl = document.getElementById('totalUsd');
  const totalUahEl = document.getElementById('totalUah');
  const pricePerM2El = document.getElementById('pricePerM2');

  const sumAreaEl = document.getElementById('sumArea');
  const sumFloorsEl = document.getElementById('sumFloors');
  const sumMaterialEl = document.getElementById('sumMaterial');
  const sumPackageEl = document.getElementById('sumPackage');
  const sumTimelineEl = document.getElementById('sumTimeline');

  function calculate() {
    const area = parseInt(areaRange.value, 10);
    areaTextValue.innerText = area;

    // Отримуємо вибрані опції
    const selectedFloor = document.querySelector('input[name="floors"]:checked')?.value || '1';
    const selectedMaterial = document.querySelector('input[name="wallMaterial"]:checked')?.value || 'aerocrete';
    const selectedPackage = document.querySelector('input[name="packageLevel"]:checked')?.value || 'whitebox';

    // Підсумок додаткових опцій
    let additionalCosts = 0;
    document.querySelectorAll('.options-checklist input[type="checkbox"]:checked').forEach(cb => {
      additionalCosts += parseFloat(cb.value) || 0;
    });

    // Розрахунок вартості за 1 м²
    const baseRate = PACKAGE_RATES[selectedPackage];
    const matMul = MATERIAL_MULTIPLIERS[selectedMaterial];
    const floorMul = FLOOR_MULTIPLIERS[selectedFloor];

    const effectiveRatePerM2 = Math.round(baseRate * matMul * floorMul);
    const houseBasePrice = area * effectiveRatePerM2;
    const finalTotalUsd = houseBasePrice + additionalCosts;
    const finalTotalUah = Math.round(finalTotalUsd * USD_TO_UAH);

    // Оновлення підсумкових цифр
    totalUsdEl.innerText = `$${finalTotalUsd.toLocaleString('en-US')}`;
    totalUahEl.innerText = finalTotalUah.toLocaleString('uk-UA');
    pricePerM2El.innerText = `$${effectiveRatePerM2}`;

    // Оновлення текстового звіту
    sumAreaEl.innerText = `${area} м²`;

    const floorNames = { '1': '1 поверх', '2': '2 поверхи', '2.5': '2 пов. + лаундж-покрівля' };
    sumFloorsEl.innerText = floorNames[selectedFloor];

    const matNames = { aerocrete: 'Газобетон D400', ceramoblock: 'Керамоблок', monolith: 'Монолітний каркас' };
    sumMaterialEl.innerText = matNames[selectedMaterial];

    const packageNames = { box: 'Коробка будинку', whitebox: 'White Box (під чистове)', turnkey: 'Під ключ (Turnkey)' };
    sumPackageEl.innerText = packageNames[selectedPackage];

    // Орієнтовні терміни
    let months = 4;
    if (selectedPackage === 'whitebox') months = 6;
    if (selectedPackage === 'turnkey') months = 8;
    if (area > 220) months += 2;
    sumTimelineEl.innerText = `${months}-${months + 1} місяців`;
  }

  // Слухачі подій
  if (areaRange) areaRange.addEventListener('input', calculate);
  document.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(input => {
    input.addEventListener('change', calculate);
  });

  // Заявка на збереження кошторису
  const calcOrderForm = document.getElementById('calcOrderForm');
  if (calcOrderForm) {
    calcOrderForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('calcClientName').value;
      const phone = document.getElementById('calcClientPhone').value;
      const total = totalUsdEl.innerText;
      const area = sumAreaEl.innerText;

      alert(`Дякуємо, ${name}!\nВаш попередній розрахунок на суму ${total} (площа: ${area}) зафіксовано.\nМи надішлемо повну специфікацію на номер ${phone}.`);
      calcOrderForm.reset();
    });
  }

  // Первинний запуск
  calculate();
});