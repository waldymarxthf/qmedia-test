const answer = document.querySelector(".answer") as HTMLHeadingElement
const quiz = document.querySelector(".questions") as HTMLDivElement
const backBtn = document.querySelector('.btn-back') as HTMLButtonElement
const nextBtn = document.querySelector('.next-btn') as HTMLButtonElement
const resultsElement = document.querySelector('.results') as HTMLElement;
const results = document.querySelector('.results') as HTMLElement
const resultsItemsElement = resultsElement.querySelector('.results__items') as HTMLElement;


interface ProductData {
  id: number;
  title: string;
  image: string;
  price: number;
  oldPrice: string;
}

const questions = [
  {
    question: 'Сколько вам лет?',
    answers: ['Нужны средства для ребёнка младше 10 лет', 'Мне меньше 25 лет', 'От 25 до 35 лет', "От 35 до 45 лет", "Мне больше 45 лет"]
  },
  {
    question: 'Какой у вас тип кожи?',
    answers: ['Сухая', 'Нормальная', 'Комбинированная', "Жирная"]
  },
  {
    question: "Беспокоят ли воспаления на лице?",
    answers: ['Да', 'Нет', 'Иногда']
  }
];

const BUTTON_TEXT = {
  NEXT: 'Дальше',
  CHECK: 'Узнать результат'
}

let currentQuestionIndex = 0;
let isAnswerSelected = false;

function updateAnswerStatus() {
  const radios = document.querySelectorAll('.form-check-input') as NodeListOf<HTMLInputElement>;
  radios.forEach((radio) => {
    radio.addEventListener('change', () => {
      isAnswerSelected = true;
      nextBtn.disabled = false;
    });
  });
}

function render() {
  const questionsContainer = document.querySelector('.questions-container') as HTMLDivElement;
  const circles = document.querySelectorAll('.circle') as NodeListOf<HTMLElement>;
  const numberOfQuestion = document.querySelector(".question-number") as HTMLSpanElement;
  
  const answerText = questions[currentQuestionIndex].question;
  const currentQuestionNumber = currentQuestionIndex + 1;
  const backBtnDisplay = currentQuestionIndex === 0 ? 'none' : 'block';
  const nextBtnText = currentQuestionIndex === questions.length - 1 ? BUTTON_TEXT.CHECK : BUTTON_TEXT.NEXT;
  answer.textContent = answerText;
  numberOfQuestion.textContent = String(currentQuestionNumber);
  
  circles.forEach((circle, index) => {
    circle.classList.remove('active');
    if (index === currentQuestionIndex) {
      circle.classList.add('active');
    }
  });
  
  questionsContainer.replaceChildren();

  questions[currentQuestionIndex].answers.forEach((option, index) => {
    const input = document.createElement('input');
    const label = document.createElement('label');
    const div = document.createElement('div');
    
    input.type = 'radio';
    input.name = 'flexRadioDefault';
    input.id = `flexRadioDefault${index}`;
    input.className = "form-check-input";
    label.htmlFor = input.id;
    label.textContent = option;
    label.className = "form-check-label";
    
    div.className = 'form-check';
    div.appendChild(input);
    div.appendChild(label);
    
    questionsContainer.appendChild(div);
  });
  
  updateAnswerStatus();
  nextBtn.disabled = !isAnswerSelected;

  backBtn.style.display = backBtnDisplay;
  nextBtn.textContent = nextBtnText;

}

async function showResults() {
  quiz.className = 'hidden';
  results.classList.remove("hidden")
  resultsItemsElement.innerHTML = "";

  const response = await fetch('./products.json');
  const productData = await response.json();

  productData.forEach((product: ProductData) => {
    const itemElement = document.createElement('div');
    itemElement.className = 'item';

    const imgElement = document.createElement('img');
    imgElement.className = 'item-img';
    imgElement.src = product.image;
    imgElement.alt = 'product';

    const titleElement = document.createElement('p');
    titleElement.className = 'item-title';
    titleElement.textContent = product.title;

    const priceElement = document.createElement('div');
    priceElement.className = 'item-price';

    const oldPriceElement = document.createElement('p');
    oldPriceElement.className = 'item-price__old';
    oldPriceElement.textContent = product.oldPrice && product.oldPrice;

    const newPriceElement = document.createElement('p');
    newPriceElement.className = 'item-price__new';
    newPriceElement.textContent = `${product.price} руб.`;

    priceElement.appendChild(oldPriceElement);
    priceElement.appendChild(newPriceElement);

    itemElement.appendChild(imgElement);
    itemElement.appendChild(titleElement);
    itemElement.appendChild(priceElement);

    resultsItemsElement.appendChild(itemElement);
  });
}

backBtn.addEventListener('click', () => {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    isAnswerSelected = false;
    render();
  }
});

nextBtn.addEventListener('click', async () => {
  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    isAnswerSelected = false;
    render();
  } else {
    await showResults();
  }
});

render();