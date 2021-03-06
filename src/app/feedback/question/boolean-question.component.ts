import { Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseQuestionComponent } from './question.base.component';

@Component({
    selector: 'app-boolean-question',
    templateUrl: './boolean-question.component.html',
    styleUrls: ['./boolean-question.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => BooleanQuestionComponent),
            multi: true
        }
    ]
})
export class BooleanQuestionComponent extends BaseQuestionComponent {
    constructor() {
        super();
    }
}
