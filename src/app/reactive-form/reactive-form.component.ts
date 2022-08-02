import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { catchError, delay, map, merge, Observable, of, switchMap, tap } from 'rxjs';


function rangeValidator(min: number, max: number): ValidatorFn {
  return (control) => {
    if (control.value >= min && control.value <= max) {
      return null;
    }
    return { 'range': true };
  };
}

function emailValidator(http: HttpClient): ValidatorFn {
  return (control) => {
    return of(control.value).pipe(
      delay(500),
      switchMap(email => http.head("http://localhost:9090/api/is-email-taken", {
        params: {
          email: control.value
        }
      }).pipe(
        map(() => null),
        catchError(() => of({
          taken: true
        }))
      ))
    );

    // return http.head("http://localhost:9090/api/is-email-taken", {
    //   params: {
    //     email: control.value
    //   }
    // }).pipe(
    //   map(() => null),
    //   catchError(() => of({
    //     emailTaken: true
    //   }))
    // )
  };
}




@Component({
  selector: 'app-reactive-form',
  templateUrl: './reactive-form.component.html',
  styleUrls: ['./reactive-form.component.css'],
})
export class ReactiveFormComponent implements OnInit {


  constructor(private fb: FormBuilder, private http: HttpClient) { }

  ngOnInit(): void {
  }

  getSkills() {
    return this.profileForm.get('skills') as FormArray;
  }

  addSkill() {
    this.getSkills().push(this.fb.control(''));
  }

  nameValidator = Validators.compose([
    Validators.required,
    Validators.pattern(/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u),
  ]);

  profileForm = this.fb.group({
    firstName: ['', this.nameValidator],
    lastName: ['', this.nameValidator],
    age: [20, rangeValidator(18, 100)],
    email: ['', null, emailValidator(this.http)],
    gender: ['Female'],
    position: [''],
    address: this.fb.group({
      street: [''],
      city: [''],
      zip: ['', [rangeValidator(1000, 9999)]],
    }),
    skills: this.fb.array([]),
    isAccepted: [false, Validators.requiredTrue],
  });

  positions$ = this.http.get('http://localhost:9090/api/positions') as Observable<string[]>;


  value$ = merge(
    of(this.profileForm.value),
    this.profileForm.valueChanges
  ).pipe(tap(console.log));

  isError(path: string, errorName: string) {
    const formControl = this.profileForm.get(path) as any;
    return this.profileForm.hasError(errorName, path) && (formControl.dirty || formControl.touched);
  }

  errors$ =
    merge(
      of(this.profileForm.value),
      this.profileForm.valueChanges
    ).pipe(
      map(() => {
        const getErrors = (path: string) => this.profileForm.get(path)?.errors;
        return {
          firstName: getErrors('firstName'),
          lastName: getErrors('lastName'),
          phone: getErrors('phone'),
          email: getErrors('email'),
          gender: getErrors('gender'),
          position: getErrors('position'),
          address: {
            street: getErrors('address.street'),
            city: getErrors('address.city'),
            zip: getErrors('address.zip'),
          },
          skills: getErrors('skills'),
          isAccepted: getErrors('isAccepted'),
        };
      }),
    )


  onSubmit() {
    // TODO: Use EventEmitter with form value
    alert(JSON.stringify(this.profileForm.value));
  }
}


// profileForm = new FormGroup({
//   firstName: new FormControl('', [Validators.required, Validators.minLength(2), ageRangeValidator(10, 12)]),
//   lastName: new FormControl('', [Validators.required]),
//   age: new FormControl(20, ageRangeValidator(18, 100)),
//   email: new FormControl('', null, emailValidator),
//   gender: new FormControl('Male'),
//   position: new FormControl('B'),
//   address: new FormGroup({
//     street: new FormControl(''),
//     city: new FormControl(''),
//     zip: new FormControl('', [
//       Validators.min(1000),
//       Validators.max(10000),
//     ]),
//   }),
//   skills: new FormArray([new FormControl('')]),
//   isAccepted: new FormControl(false, Validators.requiredTrue),
// });