'use strict';

!(function () {
  function isString(str) {
    return typeof str === 'string';
  }
  function createElement({
    tagName = 'div',
    classes = [],
    dataAttributes = {},
    textContent = '',
  }) {
    if (!isString(tagName)) {
      console.warn('tagName createElement method of app must be string');
      let errorElement = document.createElement('div');
      errorElement.textContent =
        'tagName createElement method of app must be string';
      return errorElement;
    }

    let element = document.createElement(tagName);

    if (isString(textContent)) {
      element.textContent = textContent;
    } else {
      console.warn('textContent createElement method of app must be string');
    }

    if (Array.isArray(classes)) {
      classes.forEach((className) => {
        if (isString(className)) {
          element.classList.add(className);
        } else {
          console.warn(
            'classes element of app createElement method must be string'
          );
        }
      });
    }

    if (typeof dataAttributes === 'object' && dataAttributes) {
      Object.entries(dataAttributes).forEach((pair) => {
        if (isString(pair[0]) || isString(pair[1])) {
          element.setAttribute(pair[0], pair[1]);
        } else {
          console.warn(
            'dataAttributes element of app createElement method must be string'
          );
        }
      });
    }
    return element;
  }

  class App {
    constructor() {
      this.cardsArr = [];
      this.init = function () {
        this._init();
      };

      this._body = document.querySelector('body');
    }

    _appendBlocks = () => {
      this.undoneArr = [];
      this.doneArr = [];
      this.importantUndoneArr = [];
      this.importantDoneArr = [];
			
      this.cardsArr.forEach((card) => {
        if (card.isDone && !card.isImportant) {
          this.doneArr.push(card);
        }
      });

      this.cardsArr.forEach((card) => {
        if (!card.isDone && !card.isImportant) {
          this.undoneArr.push(card);
        }
      });

      this.cardsArr.forEach((card) => {
        if (!card.isDone && card.isImportant) {
          this.importantUndoneArr.push(card);
        }
      });

      this.cardsArr.forEach((card) => {
        if (card.isDone && card.isImportant) {
          this.importantDoneArr.push(card);
        }
      });

      this.undoneArr.forEach((card) => {
        if (!card.isDone && !card.isImportant) {
          this._undoneCardsBlock.prepend(card.element);
        }
      });

      this.doneArr.forEach((card) => {
        if (card.isDone && !card.isImportant) {
          this._doneCardsBlock.prepend(card.element);
        }
      });

      this.importantUndoneArr.forEach((card) => {
        if (card.isImportant && !card.isDone) {
          this._importantUndoneCardsBlock.prepend(card.element);
        }
      });

      this.importantDoneArr.forEach((card) => {
        if (card.isImportant && card.isDone) {
          this._importantDoneCardsBlock.prepend(card.element);
        }
      });
    };

    _getCards = () => {
      let cardsSortJSON = localStorage.getItem('sort');

      let cardsJSON = localStorage.getItem('cards');
      if (cardsJSON) {
        let cardsDataArr = JSON.parse(cardsJSON);
        this.cardsArr = cardsDataArr.map((cardData) => {
          return new Card({
            cardTittle: cardData.tittle,
            cardText: cardData.text,
            isImportant: cardData.isImportant,
            isDone: cardData.isDone,
          });
        });

        this._appendBlocks();

        if (cardsSortJSON) {
          this.cardsSortData = JSON.parse(localStorage.getItem('sort'));
          this.selectSortBlock.value = this.cardsSortData;
          this._sortCards();
        }
      }
    };

    _init = () => {
      this._createApp();
      this._getCards();
      this._atachEvents();
    };

    _sortCards = () => {
      this.selectValue = this.selectSortBlock.value;
      localStorage.setItem('sort', JSON.stringify(this.selectValue));
      if (this.selectValue === '1') {
        this.importantUndoneArr.sort((a, b) => (b.tittle > a.tittle ? 1 : -1));
        this.importantUndoneArr.forEach((card) => {
          this._importantUndoneCardsBlock.prepend(card.element);
        });

        this.undoneArr.sort((a, b) => (b.tittle > a.tittle ? 1 : -1));
        this.undoneArr.forEach((card) => {
          this._undoneCardsBlock.prepend(card.element);
        });

        this.importantDoneArr.sort((a, b) => (b.tittle > a.tittle ? 1 : -1));
        this.importantDoneArr.forEach((card) => {
          this._importantDoneCardsBlock.prepend(card.element);
        });

        this.doneArr.sort((a, b) => (b.tittle > a.tittle ? 1 : -1));
        this.doneArr.forEach((card) => {
          this._doneCardsBlock.prepend(card.element);
        });
      } else if (this.selectValue === '2') {
        this.importantUndoneArr.reverse();
        this.importantUndoneArr.forEach((card) => {
          this._importantUndoneCardsBlock.prepend(card.element);
        });

        this.undoneArr.reverse();
        this.undoneArr.forEach((card) => {
          this._undoneCardsBlock.prepend(card.element);
        });

        this.importantDoneArr.reverse();
        this.importantDoneArr.forEach((card) => {
          this._importantDoneCardsBlock.prepend(card.element);
        });

        this.doneArr.reverse();
        this.doneArr.forEach((card) => {
          this._doneCardsBlock.prepend(card.element);
        });
      }
    };
    _atachEvents = () => {
      this.formButton.addEventListener('click', this._formAction);
      this.selectSortBlock.addEventListener('change', this._sortCards);
    };

    _createApp = () => {
      let appBlock = createElement({ classes: ['container'] });
      let tittle = createElement({
        tagName: 'h1',
        textContent: 'Awesome TODO app',
      });
      this.formButton = createElement({
        tagName: 'button',
        classes: ['btn', 'btn-primary'],
        textContent: 'Create card',
        dataAttributes: { 'data-role': 'create' },
      });
      this._undoneCardsBlock = createElement({
        classes: ['container', 'cards-block', 'undone'],
      });
      this._doneCardsBlock = createElement({
        classes: ['container', 'cards-block', 'done'],
      });
      this._importantUndoneCardsBlock = createElement({
        classes: ['container', 'cards-block', 'undone', 'important'],
      });
      this._importantDoneCardsBlock = createElement({
        classes: ['container', 'cards-block', 'done', 'important'],
      });
      this._cardsBlock = createElement({
        classes: ['container', 'cards-block'],
      });
      this.cardTittle = createElement({
        tagName: 'input',
        classes: ['form-control'],
        dataAttributes: { placeholder: 'Name', autocomplete: 'autocomplete' },
      });
      this.cardText = createElement({
        tagName: 'textarea',
        classes: ['form-control'],
        dataAttributes: {
          placeholder: 'Description',
          autocomplete: 'autocomplete',
        },
      });

      this.selectSortBlock = createElement({
        tagName: 'select',
        classes: ['form-select', 'form-select-sm'],
        dataAttributes: {
          'aria-label': '.form-select-sm example',
        },
      });

      let sortOption = createElement({
        tagName: 'option',
        dataAttributes: {
          value: '1',
        },
        textContent: 'Сортировка в алфавитном порядке А-Я',
      });
      let reverseSortOption = createElement({
        tagName: 'option',
        dataAttributes: {
          value: '2',
        },
        textContent: 'Сортировка в алфавитном порядке Я-А',
      });

      this.selectSortBlock.prepend(sortOption, reverseSortOption);
      this._cardsBlock.prepend(this._undoneCardsBlock);
      this._cardsBlock.prepend(this._importantUndoneCardsBlock);
      this._cardsBlock.append(this._importantDoneCardsBlock);
      this._cardsBlock.append(this._doneCardsBlock);
      appBlock.append(
        tittle,
        this.cardTittle,
        this.cardText,
        this.formButton,
        this.selectSortBlock,
        this._cardsBlock
      );

      this._body.append(appBlock);
    };

    _checkingSuchCard = (cardTittle) => {
      return this.cardsArr.some((card) => card.tittle === cardTittle);
    };

    _validateForm = () => {
      let textFieldStates = [];
      textFieldStates.push(this._validateTextFields(this.cardTittle));
      textFieldStates.push(this._validateTextFields(this.cardText));

      return textFieldStates.some((state) => state === false);
    };

    _formAction = () => {
      let cardTittle = this.cardTittle.value;
      let cardText = this.cardText.value;
      let isCreate;
      if (this._validateForm()) {
        return;
      }

      if (this._checkingSuchCard(cardTittle)) {
        isCreate = confirm(
          'Do you have such a card, do you want to make one more?'
        );
        if (!isCreate) {
          return;
        }
      }

      if (this.formButton.dataset.role === 'create') {
        this.card = new Card({ cardTittle, cardText });
        this.cardsArr.push(this.card);
        this._updateLS();
      } else if (this.formButton.dataset.role === 'update') {
        this.editableCard.tittle = cardTittle;
        this.editableCard.text = cardText;
        this._updateLS();
        this.editableCard._updateCard();
        this._resetForm();
      }
      document.querySelector('body').innerHTML = '';
      this._init();
    };

    _resetForm = () => {
      this.cardTittle.value = '';
      this.cardText.value = '';
      this.formButton.setAttribute('data-role', 'create');
      this.formButton.innerText = 'Create card';
    };

    _updateLS = () => {
      this.cardsStates = this.cardsArr.map((card) => {
        return {
          tittle: card.tittle,
          text: card.text,
          isImportant: card.isImportant,
          isDone: card.isDone,
        };
      });
      localStorage.setItem('cards', JSON.stringify(this.cardsStates));
    };

    _validateTextFields = (field) => {
      if (field.value === '') {
        field.classList.add('is-invalid');
        return false;
      } else {
        field.classList.remove('is-invalid');
        return true;
      }
    };

    deleteCard = (card) => {
      this.cardsArr = this.cardsArr.filter((appCard) => {
        return card !== appCard;
      });
      this._updateLS();
    };

    updateCard = (card, importanceChange) => {
      if (importanceChange) {
        this._updateLS();
      }
      this.cardTittle.value = card.tittle;
      this.cardText.value = card.text;
      this.formButton.textContent = 'Save card';
      this.formButton.setAttribute('data-role', 'update');
      this.editableCard = card;
    };

    compliteCard = (card) => {
      if (card.isDone === false) {
        card.isDone = true;
      } else if (card.isDone === true) {
        card.isDone = false;
      }
    };
  }

  class Card {
    constructor({
      cardTittle = '',
      cardText = '',
      isImportant = false,
      isDone = false,
    }) {
      this.tittle = cardTittle;
      this.text = cardText;
      this.isImportant = isImportant;
      this.isDone = isDone;
      this._init();
    }

    _init() {
      this.element = this._createElement();
      this._atachEvents();
    }
    _createElement = () => {
      let cardElement = createElement({ classes: ['card'] });
      this.tittleElement = createElement({
        tagName: 'h5',
        classes: ['card-tittle'],
        textContent: this.tittle,
      });
      this.textElement = createElement({
        tagName: 'p',
        classes: ['card-text'],
        textContent: this.text,
      });

      let controlsContainer = createElement({
        classes: ['controls-container'],
      });

      this._updateButton = createElement({
        tagName: 'button',
        classes: ['btn', 'btn-primary'],
        textContent: 'Update card',
      });
      this._deleteButton = createElement({
        tagName: 'button',
        classes: ['btn', 'btn-primary'],
        textContent: 'Delete card',
      });
      this._importanceCheckbox = createElement({
        tagName: 'input',
        classes: ['form-check-input'],
        dataAttributes: {
          Type: 'checkbox',
          id: 'flexCheckDefault',
        },
      });
      if (this.isImportant) {
        this._importanceCheckbox.setAttribute('checked', 'checked');
        cardElement.classList.add('card--important');
      }
      let importanceCheckboxLabel = createElement({
        tagName: 'label',
        classes: ['form-check-label'],
        dataAttributes: { for: 'flexCheckDefault' },
        textContent: 'Important',
      });
      this._doneButton = createElement({
        tagName: 'button',
        classes: ['btn', 'btn-warning'],
        textContent: 'Done',
      });
      if (this.isDone) {
        cardElement.classList.add('btn', 'btn-lg', 'btn-primary');
        this._updateButton.setAttribute('disabled', 'disabled');
        this._deleteButton.setAttribute('disabled', 'disabled');
        this._importanceCheckbox.setAttribute('disabled', 'disabled');
      }

      controlsContainer.append(
        this._updateButton,
        this._deleteButton,
        this._importanceCheckbox,
        importanceCheckboxLabel,
        this._doneButton
      );
      cardElement.append(
        this.tittleElement,
        this.textElement,
        controlsContainer
      );
      return cardElement;
    };

    _atachEvents = () => {
      this._doneButton.addEventListener('click', this._сompleteСard);
      this._deleteButton.addEventListener('click', this._deleteCard);
      this._updateButton.addEventListener('click', this._updateCard);
      this._importanceCheckbox.addEventListener('change', (event) => {
        this.isImportant = this._importanceCheckbox.checked;
        app.updateCard(this, true);
        if (this.isImportant) {
          this.element.classList.add('card--important');
        } else {
          this.element.classList.remove('card--important');
        }
        document.querySelector('body').innerHTML = '';
        app._init();
      });
    };

    _updateCard = () => {
      this.tittleElement.innerHTML = this.tittle;
      this.textElement.innerHTML = this.text;
      app.updateCard(this);
    };

    _deleteCard = () => {
      this.element.remove();
      app.deleteCard(this);
      document.querySelector('body').innerHTML = '';
      app._init();
    };
    _сompleteСard = () => {
      app.compliteCard(this);
      app._updateLS(this);
      document.querySelector('body').innerHTML = '';
      app._init();
    };
  }

  let app = new App();
  app.init();
})();

let cards;
