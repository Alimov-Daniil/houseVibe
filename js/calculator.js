document.addEventListener('DOMContentLoaded', () => {

  const PACKAGE_RATES = {
    box: 510,
    whitebox: 840,
    turnkey: 1350
  };

  const MATERIAL_MULTIPLIERS = {
    aerocrete: 1.0,
    ceramoblock: 1.09,
    monolith: 1.18
  };

  const FLOOR_MULTIPLIERS = {
    '1': 1.04,
    '2': 1.00,
    '2.5': 1.12
  };

  const USD_TO_UAH = 41.5;
  const MIN_FEASIBLE_BUDGET = 35000;

  // Лівий блок
  const budgetInput = document.getElementById('budgetInput');
  const calcUahVal = document.getElementById('calcUahVal');
  const calcRateVal = document.getElementById('calcRateVal');
  const budgetErrorBox = document.getElementById('budgetErrorBox');
  const priceDisplayBox = document.getElementById('priceDisplayBox');
  const applyEstimateBtn = document.getElementById('applyEstimateBtn');

  // Площа
  const areaInput = document.getElementById('areaInput');
  const areaRange = document.getElementById('areaRange');

  // Правий блок («Орієнтовний кошторис»)
  const summaryTargetBox = document.getElementById('summaryTargetBox');
  const summaryTotalUsd = document.getElementById('summaryTotalUsd');
  const summaryTotalUah = document.getElementById('summaryTotalUah');
  const summaryPricePerM2 = document.getElementById('summaryPricePerM2');

  const sumAreaEl = document.getElementById('sumArea');
  const sumFloorsEl = document.getElementById('sumFloors');
  const sumMaterialEl = document.getElementById('sumMaterial');
  const sumPackageEl = document.getElementById('sumPackage');
  const sumTimelineEl = document.getElementById('sumTimeline');

  let isManualBudgetMode = false;

  // Розрахунок параметрів у лівий блок
  function calculateParams() {
    if (isManualBudgetMode) return;

    let area = parseFloat(areaInput?.value || areaRange?.value) || 160;
    if (area < 20) area = 20;

    const selectedFloor = document.querySelector('input[name="floors"]:checked')?.value || '1';
    const selectedMaterial = document.querySelector('input[name="wallMaterial"]:checked')?.value || 'aerocrete';
    const selectedPackage = document.querySelector('input[name="packageLevel"]:checked')?.value || 'whitebox';

    let additionalCosts = 0;
    document.querySelectorAll('.options-checklist input[type="checkbox"]:checked').forEach(cb => {
      additionalCosts += parseFloat(cb.value) || 0;
    });

    const rate = Math.round(PACKAGE_RATES[selectedPackage] * MATERIAL_MULTIPLIERS[selectedMaterial] * FLOOR_MULTIPLIERS[selectedFloor]);
    const totalUsd = Math.round(area * rate + additionalCosts);
    const totalUah = Math.round(totalUsd * USD_TO_UAH);

    if (budgetInput) budgetInput.value = totalUsd;
    if (calcUahVal) calcUahVal.innerText = totalUah.toLocaleString('uk-UA');
    if (calcRateVal) calcRateVal.innerText = `$${rate}`;

    checkBudget(totalUsd);
    updateSpecs(area, selectedFloor, selectedMaterial, selectedPackage);
  }

  // Зворотний розрахунок при ручному введенні бюджету
  function calculateFromBudget() {
    isManualBudgetMode = true;
    const budget = parseFloat(budgetInput.value) || 0;

    if (checkBudget(budget)) {
      if (calcUahVal) calcUahVal.innerText = '0';
      isManualBudgetMode = false;
      return;
    }

    let pkg = 'whitebox';
    let mat = 'aerocrete';
    let flr = '1';

    if (budget < 65000) {
      pkg = budget < 48000 ? 'box' : 'whitebox';
    } else if (budget < 130000) {
      mat = budget > 95000 ? 'ceramoblock' : 'aerocrete';
      flr = budget > 85000 ? '2' : '1';
    } else if (budget < 220000) {
      pkg = budget > 175000 ? 'turnkey' : 'whitebox';
      mat = budget > 170000 ? 'monolith' : 'ceramoblock';
      flr = '2';
    } else {
      pkg = 'turnkey';
      mat = 'monolith';
      flr = '2.5';
    }

    setRadio('packageLevel', pkg);
    setRadio('wallMaterial', mat);
    setRadio('floors', flr);

    let addCosts = 0;
    document.querySelectorAll('.options-checklist input[type="checkbox"]:checked').forEach(cb => {
      addCosts += parseFloat(cb.value) || 0;
    });

    const rate = Math.round(PACKAGE_RATES[pkg] * MATERIAL_MULTIPLIERS[mat] * FLOOR_MULTIPLIERS[flr]);
    let area = Math.round(Math.max(0, budget - addCosts) / rate);
    if (area < 40) area = 40;

    if (areaInput) areaInput.value = area;
    if (areaRange) areaRange.value = Math.min(area, 500);

    const totalUah = Math.round(budget * USD_TO_UAH);
    if (calcUahVal) calcUahVal.innerText = totalUah.toLocaleString('uk-UA');
    if (calcRateVal) calcRateVal.innerText = `$${rate}`;

    updateSpecs(area, flr, mat, pkg);
    isManualBudgetMode = false;
  }

  function checkBudget(budget) {
    if (budget < MIN_FEASIBLE_BUDGET) {
      if (budgetErrorBox) budgetErrorBox.style.display = 'block';
      if (priceDisplayBox) priceDisplayBox.classList.add('has-error');
      return true;
    } else {
      if (budgetErrorBox) budgetErrorBox.style.display = 'none';
      if (priceDisplayBox) priceDisplayBox.classList.remove('has-error');
      return false;
    }
  }

  function setRadio(name, val) {
    const el = document.querySelector(`input[name="${name}"][value="${val}"]`);
    if (el) el.checked = true;
  }

  function updateSpecs(area, flr, mat, pkg) {
    if (sumAreaEl) sumAreaEl.innerText = `${area} м²`;
    const fNames = { '1': '1 поверх', '2': '2 поверхи', '2.5': '2 пов. + лаундж-покрівля' };
    if (sumFloorsEl) sumFloorsEl.innerText = fNames[flr] || `${flr} пов.`;
    const mNames = { aerocrete: 'Газобетон D400', ceramoblock: 'Керамоблок', monolith: 'Монолітний каркас' };
    if (sumMaterialEl) sumMaterialEl.innerText = mNames[mat] || mat;
    const pNames = { box: 'Коробка будинку', whitebox: 'White Box (під чистове)', turnkey: 'Під ключ (Turnkey)' };
    if (sumPackageEl) sumPackageEl.innerText = pNames[pkg] || pkg;

    let months = pkg === 'turnkey' ? 8 : (pkg === 'whitebox' ? 6 : 4);
    if (area > 200) months += 2;
    if (sumTimelineEl) sumTimelineEl.innerText = `${months}-${months + 1} місяців`;
  }

  // КНОПКА: ПЕРЕНОСИТЬ ЦІНУ В ПРАВИЙ БЛОК "ОРІЄНТОВНИЙ КОШТОРИС"
  if (applyEstimateBtn) {
    applyEstimateBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const budget = parseFloat(budgetInput.value) || 0;

      if (budget < MIN_FEASIBLE_BUDGET) {
        checkBudget(budget);
        return;
      }

      // Перенесення значень
      if (summaryTotalUsd) summaryTotalUsd.innerText = `$${Math.round(budget).toLocaleString('en-US')}`;
      if (summaryTotalUah) summaryTotalUah.innerText = calcUahVal ? calcUahVal.innerText : Math.round(budget * USD_TO_UAH).toLocaleString('uk-UA');
      if (summaryPricePerM2) summaryPricePerM2.innerText = calcRateVal ? calcRateVal.innerText : '$874';

      // Анімація правого блоку
      if (summaryTargetBox) {
        summaryTargetBox.classList.remove('flash-transfer');
        void summaryTargetBox.offsetWidth;
        summaryTargetBox.classList.add('flash-transfer');
      }

      applyEstimateBtn.classList.add('applied');
      applyEstimateBtn.innerHTML = '<span>✓ Кошторис зафіксовано!</span>';

      setTimeout(() => {
        applyEstimateBtn.classList.remove('applied');
        applyEstimateBtn.innerHTML = '<span>📌 Зафіксувати цей кошторис</span>';
      }, 2500);
    });
  }

  // Події інпутів
  if (budgetInput) budgetInput.addEventListener('input', calculateFromBudget);

  if (areaInput && areaRange) {
    areaInput.addEventListener('input', () => {
      areaRange.value = areaInput.value;
      calculateParams();
    });
    areaRange.addEventListener('input', () => {
      areaInput.value = areaRange.value;
      calculateParams();
    });
  }

  document.querySelectorAll('input[name="floors"], input[name="wallMaterial"], input[name="packageLevel"]').forEach(r => {
    r.addEventListener('change', calculateParams);
  });

  document.querySelectorAll('.options-checklist input[type="checkbox"]').forEach(c => {
    c.addEventListener('change', calculateParams);
  });

  // Первинний запуск
  calculateParams();
});
