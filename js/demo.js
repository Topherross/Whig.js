(function (window, document) {
    'use strict';

    var form = document.querySelector('form'),
        output = document.querySelector('#output'),
        toggle = document.querySelector('#theme_toggle'),
        toggle_display = document.querySelector('#theme_display'),
        back = document.querySelector('#back_button'),
        whig,
        whig_body,
        manager;

    function StateManager() {
        if (undefined === this) {
            window.console.error("stateManager must be created with the 'new' keyword.");
        }

        var state_els = document.querySelectorAll('.page-state'),
            states = {},
            state,
            page,
            default_page = null,
            $state = null,
            hide = function (el) {
                el.style.display = 'none';
            },
            show = function (el) {
                el.style.display = 'block';
            };

        if (state_els !== null) {
            for (state = 0; state < state_els.length; state += 1) {
                page = state_els[state].getAttribute('data-state');
                states[page] = state_els[state];

                if (state_els[state].classList.contains('default-state') && $state === null && default_page === null) {
                    default_page = page;
                }
            }
        }

        this.setState = function (state) {
            if (states.hasOwnProperty(state)) {
                if ($state !== null) {
                    hide(states[$state]);
                }

                show(states[state]);
                $state = state;
            }

            return this;
        };

        this.getCurrentState = function () {
            return $state;
        };

        if (default_page !== null) {
            this.setState(default_page);
        }
    }

    manager = new StateManager();

    function initToggle() {
        whig = document.querySelector('.whig-wrapper');
        whig_body = whig.querySelector('iframe').contentDocument.body;

        if (toggle !== null && toggle_display !== null) {
            toggle.onchange = function () {
                toggle_display.innerHTML = this.checked ? 'Dark Theme' : 'Light Theme';
                this.parentNode.setAttribute('class', this.checked ? 'dark' : '');

                if (whig !== null && whig_body !== null) {
                    if (this.checked) {
                        whig.classList.add('dark');
                        whig_body.classList.add('dark');
                    } else {
                        whig.classList.remove('dark');
                        whig_body.classList.remove('dark');
                    }
                }
            };
        }
    }

    if (form !== null && output !== null) {
        form.onsubmit = function (event) {
            event.preventDefault();

            output.innerHTML = '<div><h2>Output</h2>' + form.whig_input.value + '</div>';
            manager.setState('output');
        }
    }

    if (back !== null) {
        back.onclick = function (event) {
            event.preventDefault();

            output.innerHTML = '';
            manager.setState('form');
        }
    }

    window.initToggle = initToggle;
}(window, document));
