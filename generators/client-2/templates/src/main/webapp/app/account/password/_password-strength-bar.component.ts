import {Component, Input, ElementRef} from '@angular/core';

@Component({
    selector: 'password-strength-bar',
    template: `
        <div id="strength">
            <small<% if (enableTranslation) { %> data-translate="global.messages.validate.newpassword.strength"<% } %>>Password strength:</small>
            <ul id="strengthBar">
                <li class="point"></li>
                <li class="point"></li>
                <li class="point"></li>
                <li class="point"></li>
                <li class="point"></li>
            </ul>
        </div>`
})
export class PasswordStrengthBarComponent {
    strength: any;

    constructor(private el: ElementRef) {
        this.strength = {
            colors: ['#F00', '#F90', '#FF0', '#9F0', '#0F0'],
            mesureStrength: (p) => {

                var _force = 0;
                var _regex = /[$-/:-?{-~!"^_`\[\]]/g; // "

                var _lowerLetters = /[a-z]+/.test(p);
                var _upperLetters = /[A-Z]+/.test(p);
                var _numbers = /[0-9]+/.test(p);
                var _symbols = _regex.test(p);

                var _flags = [_lowerLetters, _upperLetters, _numbers, _symbols];
                var _passedMatches = $.grep(_flags, (el) => {
                    return el === true;
                }).length;

                _force += 2 * p.length + ((p.length >= 10) ? 1 : 0);
                _force += _passedMatches * 10;

                // penality (short password)
                _force = (p.length <= 6) ? Math.min(_force, 10) : _force;

                // penality (poor variety of characters)
                _force = (_passedMatches === 1) ? Math.min(_force, 10) : _force;
                _force = (_passedMatches === 2) ? Math.min(_force, 20) : _force;
                _force = (_passedMatches === 3) ? Math.min(_force, 40) : _force;

                return _force;

            },
            getColor: function (s) {

                var idx = 0;
                if (s <= 10) {
                    idx = 0;
                }
                else if (s <= 20) {
                    idx = 1;
                }
                else if (s <= 30) {
                    idx = 2;
                }
                else if (s <= 40) {
                    idx = 3;
                }
                else {
                    idx = 4;
                }

                return {idx: idx + 1, col: this.colors[idx]};
            }
        };
    }

    @Input()
    set passwordToCheck(password: string) {
        if (password) {
            var c = this.strength.getColor(this.strength.mesureStrength(password));
            this.el.nativeElement.className = "";
            let lis = this.el.nativeElement.getElementsByTagName("li");
            for (var i = 0; i < lis.length; i++) {
                if(i < c.idx) {
                    lis[i].style.backgroundColor = c.col;
                } else {
                    lis[i].style.backgroundColor = '#DDD';
                }
            }
        }
    }
}
