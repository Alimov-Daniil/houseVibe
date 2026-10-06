document.addEventListener('DOMContentLoaded', () => {
  // База даних проєктів
  const HOUSES_DB = {
    vianney: {
      title: "Villa Vianney",
      badge: "Сучасний котедж",
      desc: "Витончений двоповерховий котедж у мінімалістичному стилі. Панорамне скління енергозберігаючими склопакетами, навіс для двох автомобілів та простора зона для літнього барбекю.",
      area: "240 м²",
      floors: "2 поверхи",
      time: "5-6 місяців",
      price: "від $145 000",
      model: "vianney_house_2.glb"
    },
    mobius: {
      title: "Mobius Residence",
      badge: "Архітектурний хай-тек",
      desc: "Незвичайне геометричне рішення для цінителів сміливої сучасної архітектури. Інтегрований цокольний рівень, плоска покрівля з можливістю встановлення сонячних панелей та лаундж-тераси.",
      area: "320 м²",
      floors: "2 поверхи + цоколь",
      time: "7 місяців",
      price: "від $195 000",
      model: "mobius_house.glb"
    },
    luxury: {
      title: "Grand Luxury Villa",
      badge: "Преміальна вілла",
      desc: "Велична садиба з відкритим басейном та терасами на обох рівнях. Продумане планування з другим світлом у вітальні, майстер-спальнями та сучасними системами клімат-контролю.",
      area: "410 м²",
      floors: "2 поверхи",
      time: "8-9 місяців",
      price: "від $260 000",
      model: "modern_luxury_villa_house_home_building.glb"
    }
  };

  // Зчитуємо ?id=... з адресного рядка
  const params = new URLSearchParams(window.location.search);
  const houseId = params.get('id') || 'vianney';
  const house = HOUSES_DB[houseId] || HOUSES_DB.vianney;

  // Підставляємо дані в сторінку
  document.getElementById('houseTitle').innerText = house.title;
  document.getElementById('houseBadge').innerText = house.badge;
  document.getElementById('houseDesc').innerText = house.desc;
  document.getElementById('specArea').innerText = house.area;
  document.getElementById('specFloors').innerText = house.floors;
  document.getElementById('specTime').innerText = house.time;
  document.getElementById('specPrice').innerText = house.price;
  document.title = `${house.title} | homeVibe`;

  // Підключаємо відповідну 3D-модель
  const modelViewer = document.getElementById('detailedHouseModel');
  if (modelViewer) {
    modelViewer.setAttribute('src', house.model);
    modelViewer.setAttribute('alt', house.title);
  }

  // Обробка форми дзвінка
  const form = document.getElementById('houseCallForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('clientName').value;
      const phone = document.getElementById('clientPhone').value;
      alert(`Дякуємо, ${name}! Ми підготуємо розрахунок по проєкту "${house.title}" та зателефонуємо на ${phone}.`);
      form.reset();
    });
  }
});