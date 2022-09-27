let filterRadioButtons = document.querySelectorAll('.selection-value');
let selectionType = document.querySelector('#selection-type');
let activeFiltersDisplay = document.querySelector('.active-filters-display');
let activeFilters = document.querySelector('.active-filters');
let removeFilters = document.querySelector('.remove-filters');
let container = document.querySelector('.products-list');
let formSubmitGet = document.querySelector('.filter-submit');
let filterForm = document.querySelector('.filter-form');
let changeTaskForm = document.querySelector('.changeTaskForm');
let formSubmitPOST = document.querySelector("button[data-type='POST']");
let formSubmitPUT = document.querySelector("button[data-type='PUT']");
let addProduct = document.querySelector('.btn-add-product');
let dialog = document.querySelector('.dialog');
let dialogButtonTypes = document.querySelectorAll("button[type='submit']");

let dialogNameInput = dialog.querySelector('#name');
let dialogDescriptionInput = dialog.querySelector('#description');
let dialogCategoryInput = dialog.querySelector('#category');
let dialogPriceInput = dialog.querySelector('#price');
let dialogRatingInput = dialog.querySelector('#rating');

let LAST_EDITED_PARENT;

let priceFilter = document.querySelector('.price-filter');
let filterType = 'desc';
let filterElements = [
  `<i class="fa-solid fa-chevron-down chevron-filter"></i>`,
  `<i class="fa-solid fa-chevron-up chevron-filter"></i>`,
];
function sortDescending(allProducts) {
  return allProducts.sort(
    (a, b) =>
      parseInt(b.querySelector('.product-price').textContent) -
      parseInt(a.querySelector('.product-price').textContent)
  );
}
function sortAscending(allProducts) {
  return allProducts.sort(
    (a, b) =>
      parseInt(a.querySelector('.product-price').textContent) -
      parseInt(b.querySelector('.product-price').textContent)
  );
}
function sortProducts(wasClicked) {
  let allProducts = Array.from(document.querySelectorAll('[data-id]'));
  if (wasClicked) {
    if (filterType == 'desc') {
      filterType = 'asc';
      priceFilter.innerHTML = filterElements[1];
      allProducts = sortAscending(allProducts);
    } else {
      filterType = 'desc';
      priceFilter.innerHTML = filterElements[0];
      allProducts = sortDescending(allProducts);
    }
  } else {
    if (filterType == 'desc') allProducts = sortDescending(allProducts);
    if (filterType == 'asc') allProducts = sortAscending(allProducts);
  }
  container.innerHTML = '';
  allProducts.forEach((p) => {
    container.appendChild(p);
  });
}
priceFilter.addEventListener('click', () => {
  sortProducts(true);
});

const toggleDialogButtonType = (type) => {
  if (type === 0) {
    dialogButtonTypes[0].classList.remove('hidden');
    dialogButtonTypes[1].classList.add('hidden');
  } else {
    dialogButtonTypes[1].classList.remove('hidden');
    dialogButtonTypes[0].classList.add('hidden');
  }
};

filterRadioButtons.forEach((b) => {
  b.addEventListener('click', () => {
    filterRadioButtons.forEach((button) => button.setAttribute('sel', false));
    b.setAttribute('sel', true);
    selectionType.value = b.textContent;
  });
});
addProduct.addEventListener('click', () => {
  toggleDialogButtonType(0);
  dialog.style.setProperty('display', 'block');
  dialog.showModal();
});
function populateContainerWithCardData({
  _id,
  name,
  description,
  category,
  price,
  rating,
}) {
  let div = document.createElement('div');
  div.innerHTML = `<div class="product grid grid-cols-table">
  <p class='product-name'>${name}</p>
  <p class='product-category'>${category}</p>
  <p class='product-description'>${description}</p>
  <p class='product-price'>${price}</p>
  <p class='product-rating'>${rating}</p>
  <div class="icons">
  <i class="fa-solid fa-trash"></i>
  <i class="fa-solid fa-pen-to-square"></i>
</div>
</div>`;
  div.setAttribute('data-id', _id);
  container.appendChild(div);
  div
    .querySelector('.fa-trash')
    .addEventListener('click', (e) => onTaskDelete(e));
  div
    .querySelector('.fa-pen-to-square')
    .addEventListener('click', (e) => onTaskUpdate(e));
}
const getTasks = () => {
  return new Promise(async function (resolve, reject) {
    await fetch('http://localhost:3000/api/v1/products')
      .then((res) => res.json())
      .then((tasks) => {
        resolve(tasks);
      })
      .catch((err) => reject(err));
  });
};
async function loadInitialData() {
  let { data } = await getTasks();
  data.forEach(({ _id, name, description, category, price, rating }) => {
    populateContainerWithCardData({
      _id,
      name,
      description,
      category,
      price,
      rating,
    });
  });
  sortProducts(false);
}
removeFilters.addEventListener('click', async () => {
  activeFilters.classList.add('hidden');
  activeFiltersDisplay.innerHTML = '';
  container.innerHTML = '';
  await loadInitialData();
});

const getFilteredTasks = ({ type, value }) => {
  let queryString = type === 'Category' ? `${value}` : `product/${value}`;
  return new Promise(async function (resolve, reject) {
    await fetch(`http://localhost:3000/api/v1/products/${queryString}`)
      .then((res) => res.json())
      .then((tasks) => {
        console.log(tasks);
        resolve(tasks);
      })
      .catch((err) => reject(err));
  });
};
formSubmitGet.addEventListener('click', async (e) => {
  e.preventDefault();
  let entries = [];
  new FormData(filterForm).forEach((v) => entries.push(v));
  if (entries[0] && entries[1]) {
    filterForm.reset();
    console.log(entries[1], entries[0]);
    let { data } = await getFilteredTasks({
      type: entries[1],
      value: entries[0],
    });
    if (data) {
      activeFiltersDisplay.innerHTML = `${entries[1]} <span style="margin-inline: 0.25rem;"><i class="fa-solid fa-arrow-right"></i></span> ${entries[0]}`;
      activeFilters.classList.remove('hidden');
      container.innerHTML = '';
      data.forEach((filteredData) => {
        populateContainerWithCardData(filteredData);
      });
      sortProducts(false);
    }
  }
});
const postTask = (data) => {
  return new Promise(async function (resolve, reject) {
    await fetch('http://localhost:3000/api/v1/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((task) => {
        resolve(task);
      })
      .catch((err) => reject(err));
  });
};
formSubmitPOST.addEventListener('click', async (e) => {
  e.preventDefault();
  let entries = [];
  new FormData(changeTaskForm).forEach((v) => entries.push(v));
  if (entries.every((v) => v.length > 0)) {
    dialog.style.setProperty('display', 'none');
    dialog.close();
    changeTaskForm.reset();
    let {
      data: { _id, name, description, category, price, rating },
    } = await postTask({
      name: entries[0],
      description: entries[1],
      category: entries[2],
      price: entries[3],
      rating: entries[4],
    });
    populateContainerWithCardData({
      _id,
      name,
      description,
      category,
      price,
      rating,
    });
    sortProducts(false);
  }
});
const deleteTask = (_id) => {
  return new Promise(async function (resolve, reject) {
    await fetch('http://localhost:3000/api/v1/products', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ _id }),
    })
      .then((res) => res.json())
      .then((task) => {
        resolve(task);
      })
      .catch((err) => reject(err));
  });
};
const onTaskDelete = async (e) => {
  let parent = e.target?.parentElement?.parentElement?.parentElement;
  let deletedTask = await deleteTask(parent.getAttribute('data-id'));
  if (deletedTask) parent.remove();
};
const updateTask = ({ _id, name, description, category, price, rating }) => {
  return new Promise(async function (resolve, reject) {
    await fetch('http://localhost:3000/api/v1/products', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ _id, name, description, category, price, rating }),
    })
      .then((res) => res.json())
      .then((task) => {
        resolve(task);
      })
      .catch((err) => reject(err));
  });
};
formSubmitPUT.addEventListener('click', async (e) => {
  e.preventDefault();
  let entries = [];
  new FormData(changeTaskForm).forEach((v) => entries.push(v));
  if (entries.every((v) => v.length > 0)) {
    dialog.style.setProperty('display', 'none');
    dialog.close();
    changeTaskForm.reset();
    let {
      data: { _id, name, description, category, price, rating },
    } = await updateTask({
      _id: LAST_EDITED_PARENT.getAttribute('data-id'),
      name: entries[0],
      description: entries[1],
      category: entries[2],
      price: entries[3],
      rating: entries[4],
    });
    LAST_EDITED_PARENT.querySelector('.product-name').textContent = name;
    LAST_EDITED_PARENT.querySelector('.product-description').textContent =
      description;
    LAST_EDITED_PARENT.querySelector('.product-category').textContent =
      category;
    LAST_EDITED_PARENT.querySelector('.product-price').textContent = price;
    LAST_EDITED_PARENT.querySelector('.product-rating').textContent = rating;
  }
});
const onTaskUpdate = async (e) => {
  toggleDialogButtonType(1);
  dialog.style.setProperty('display', 'block');
  dialog.showModal();
  let parent = e.target?.parentElement?.parentElement?.parentElement;
  LAST_EDITED_PARENT = parent;
  dialogNameInput.value = parent.querySelector('.product-name').textContent;
  dialogDescriptionInput.value = parent
    .querySelector('.product-description')
    .textContent.trim();
  dialogCategoryInput.value =
    parent.querySelector('.product-category').textContent;
  dialogPriceInput.value = parent.querySelector('.product-price').textContent;
  dialogRatingInput.value = parent.querySelector('.product-rating').textContent;
};
loadInitialData();
