import { Component, OnInit } from '@angular/core';

type Hero = {
  id: number;
  name: string;
  power: string;
  alterEgo?: string;
};

@Component({
  selector: 'app-template-driven',
  templateUrl: './template-driven.component.html',
  styleUrls: ['./template-driven.component.css'],
})
export class TemplateDrivenComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  powers = ['Really Smart', 'Super Flexible', 'Super Hot', 'Weather Changer'];

  model: Hero = {
    id: 18,
    name: 'Dr IQ',
    power: this.powers[0],
    alterEgo: 'Chuck Overstreet',
  };

  submitted = false;

  onSubmit() {
    this.submitted = true;
  }

  newHero() {
    this.model = {
      id: 42,
      name: '',
      power: '',
    };
  }
}
