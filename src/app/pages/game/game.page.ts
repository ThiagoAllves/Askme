import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {
  keyboard = [
    {
      letters: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p']
    },
    {
      letters: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l']
    },
    {
      letters: ['z', 'x', 'c', 'v', 'b', 'n', 'm']
    }
  ];
  responseServeWords = [
    {
      category: 'technology',
      tip: 'tecnologia',
      word: 'monitor'
    },
    {
      category: 'Casa',
      tip: 'Tem em casa',
      word: 'Sofá'
    },
    {
      category: 'Compras',
      tip: 'Tem no mercado',
      word: 'Sabão em pó'
    }
  ];
  gameWord: any = {};
  selectedWord: any = [];
  tip = '';
  hits = 0;
  step = 0;
  qtdWords = 0;
  idxLife = 0;
  qtdLife = 5;
  gameOver = false;
  constructor() {}

  ngOnInit() {
    this.selectWord();
  }
  selectWord() {
    this.gameWord = this.responseServeWords[this.step];
    this.qtdWords = this.responseServeWords.length;
    this.tip = this.gameWord.tip;
    // tslint:disable-next-line: prefer-for-of
    for (let index = 0; index < this.gameWord.word.length; index++) {
      const a = this.gameWord.word[index];
      if (a === ' ') {
        this.selectedWord.push('-');
        this.hits++;
      } else {
        this.selectedWord.push(this.slug(this.gameWord.word[index]));
      }
    }
  }
  verifyLetter(letter) {
    letter = letter.toLowerCase();
    const idx = this.selectedWord.indexOf(letter) !== -1;
    if (idx) {
      this.hitWord(letter);
    } else {
      this.errorWord(letter);
    }
  }

  errorWord(letter) {
    const buttonLetter = document.querySelector(`.alphabet [data-letter="${letter}"`);
    const life = document.querySelectorAll('.life .heart');
    if (this.idxLife < life.length) {
      life[this.idxLife].classList.add('opacity');
    }
    this.idxLife++;
    buttonLetter.setAttribute('disabled', 'disabled');
    buttonLetter.classList.add('error');
    buttonLetter.setAttribute('color', 'danger');
    if (this.idxLife > this.qtdLife - 1) {
      this.resetGame();
      this.gameOver = true;
    }
  }

  hitWord(letter) {
    const visibleLetter = document.querySelectorAll(`.letters [data-letter="${letter}"`);
    const buttonLetter = document.querySelector(`.alphabet [data-letter="${letter}"`);
    buttonLetter.setAttribute('disabled', 'disabled');
    buttonLetter.setAttribute('color', 'success');
    buttonLetter.classList.add('hit');
    visibleLetter.forEach(element => {
      element.classList.add('visible');
    });
    this.hits = this.hits + visibleLetter.length;
    if (this.hits === this.selectedWord.length) {
      setTimeout(() => {
        this.nextWord();
      }, 1000);
    }
  }
  nextWord() {
    this.resetGame();
    if (this.step > this.qtdWords - 1) {
      alert('You Win');
    } else {
      this.selectWord();
    }
  }
  tryAgain() {
    this.tip = '';
    this.hits = 0;
    this.step = 0;
    this.qtdWords = 0;
    this.idxLife = 0;
    this.qtdLife = 5;
    this.gameOver = false;
    this.selectWord();
    this.fillLife();
  }
  fillLife() {
    const life = document.querySelectorAll('.life .heart');
    life.forEach(item => {
      item.classList.remove('opacity');
    });
  }
  resetGame() {
    const visibleLetter = document.querySelectorAll(`.letters .letter`);
    const buttonLetter = document.querySelectorAll(`.alphabet .alphabet-letter`);
    visibleLetter.forEach(element => {
      element.setAttribute('color', 'primary');
      element.classList.remove('visible');
    });
    buttonLetter.forEach(element => {
      element.setAttribute('color', 'primary');
      element.setAttribute('disabled', 'false');
    });
    this.selectedWord = [];
    this.gameWord = {};
    this.hits = 0;
    this.tip = '';
    this.step++;
  }
  slug(str) {
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();
    // remove accents, swap ñ for n, etc
    const from = 'ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;';
    const to   = 'aaaaaeeeeeiiiiooooouuuunc------';
    for (let i = 0, l = from.length ; i < l; i++) {
      str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }
    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
      .replace(/\s+/g, '-') // collapse whitespace and replace by -
      .replace(/-+/g, '-'); // collapse dashes
    return str;
  }
  isDash(letter) {
    if (letter === '-') {return true; }
    return false;
  }
}
