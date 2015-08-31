(function (window, document) {
    'use strict';

    var Whig,
        Classy,
        whig;

    function ready(callback, iframe) {
        var target = document;

        if (undefined !== iframe && iframe.nodeName.toLowerCase() === 'iframe') {
            target = iframe;
        }

        if (typeof callback === "function") {
            if (target.readyState === "complete") {
                callback();
            } else {
                if (target.addEventListener) {
                    try {
                        target.addEventListener("DOMContentLoaded", callback, false);
                    } catch (e) {
                        target.addEventListener("load", callback, false);
                    }
                } else if (target.attachEvent) {
                    try {
                        target.attachEvent("onreadystatechange", callback);
                    } catch (e) {
                        window.attachEvent("onload", callback);
                    }
                }
            }
        }

        return false;
    }

    function setAttrs(el, attributes) {
        var attr;
        for (attr in attributes) {
            if (Object.prototype.hasOwnProperty.call(attributes, attr)) {
                el.setAttribute(attr, attributes[attr]);
            }
        }

        return false;
    }

    function setText(el, text, html) {
        if (undefined !== html && !!html) {
            el.innerHTML = text;
        } else if (document.all) {
            el.innerText = text;
        } else {
            el.textContent = text;
        }

        return false;
    }

    function createElement(type, attrs, text, html) {
        var el = document.createElement(type);

        if (undefined !== attrs) {
            setAttrs(el, attrs);
        }

        if (undefined !== text) {
            if (undefined !== html && !!html) {
                setText(el, text, true);
            } else {
                setText(el, text);
            }
        }

        return el;
    }

    Classy = {
        has: function (el, cls) {
            if (!el.hasAttribute('class')) {
                return false;
            }

            var re = new RegExp(cls, 'i');

            return re.test(el.getAttribute('class'));
        },

        add: function (el, cls) {
            if (this.has(el, cls)) {
                return false;
            }

            var class_list = el.getAttribute('class') || '';

            el.setAttribute('class', class_list + ' ' + cls);

            return false;
        },

        remove: function (el, cls) {
            if (!this.has(el, cls)) {
                return false;
            }

            el.setAttribute('class', el.getAttribute('class').replace(cls, ''));

            return false;
        },

        batchRemove: function (els, cls) {
            if (els.length === 0) {
                return false;
            }

            for (var i = 0; i < els.length; i += 1) {
                this.remove(els[i], cls);
            }

            return false;
        },

        toggle: function (el, cls) {
            if (this.has(el, cls)) {
                this.remove(el, cls);
            } else {
                this.add(el, cls);
            }

            return false;
        }
    };

    Whig = {
        bold: function () {
            this.iframe.contentDocument.execCommand('bold', false, null);
            this.current_element.value = this.iframe.contentDocument.body.innerHTML;
        },

        underline: function () {
            this.iframe.contentDocument.execCommand('underline', false, null);
            this.current_element.value = this.iframe.contentDocument.body.innerHTML;
        },

        italicize: function () {
            this.iframe.contentDocument.execCommand('italic', false, null);
            this.current_element.value = this.iframe.contentDocument.body.innerHTML;
        },

        ul: function () {
            this.iframe.contentDocument.execCommand('InsertUnorderedList', false, null);
            this.current_element.value = this.iframe.contentDocument.body.innerHTML;
        },

        ol: function () {
            this.iframe.contentDocument.execCommand('InsertOrderedList', false, null);
            this.current_element.value = this.iframe.contentDocument.body.innerHTML;
        },

        link: function () {
            var url = window.prompt('Enter the link URL:', 'http://');
            this.iframe.contentDocument.execCommand('CreateLink', false, url);
            this.current_element.value = this.iframe.contentDocument.body.innerHTML;
        },

        unlink: function () {
            this.iframe.contentDocument.execCommand('UnLink', false, null);
            this.current_element.value = this.iframe.contentDocument.body.innerHTML;
        },

        image: function () {
            var url = window.prompt('Enter the image URL:', 'http://');

            if (url !== null) {
                this.iframe.contentDocument.execCommand('insertimage', false, url);
                this.current_element.value = this.iframe.contentDocument.body.innerHTML;
            }
        }
    };

    whig = function () {
        var whig_elements = document.querySelectorAll('.whig-field'),
            wrapper,
            objects,
            iframe,
            wrapper_class,
            buildToolbar,
            addListeners,
            initIframe,
            i;

        if (whig_elements === null) {
            return false;
        }

        addListeners = function (els) {
            var el, func;

            els.iframe.contentDocument.designMode = 'on';

            for (el in els) {
                if (els.hasOwnProperty(el) && Whig.hasOwnProperty(el)) {
                    func = Whig[el];
                    if (document.addEventListener) {
                        els[el].addEventListener('click', func.bind(els), false);
                    } else {
                        els[el].attachEvent('click', func.bind(els));
                    }
                }
            }

            if (document.addEventListener) {
                els.iframe.contentDocument.addEventListener('keyup', function () {
                    els.current_element.value = els.iframe.contentDocument.body.innerHTML;
                }, false);
            } else {
                els.iframe.contentDocument.attachEvent('keyup', function () {
                    els.current_element.value = els.iframe.contentDocument.body.innerHTML;
                });
            }

            return false;
        };

        buildToolbar = function () {
            var toolbar = createElement('div', {'class': 'whig-toolbar'}),
                template = ['toolbar', 'bold', 'underline', 'italicize', 'ul', 'ol', 'link', 'unlink', 'image'],
                els = {toolbar: toolbar},
                i,
                button,
                icon;


            for (i = 0; i < template.length; i += 1) {
                if (template[i] !== 'toolbar') {
                    button = createElement('button', {'type': 'button', 'class': 'whig-' + template[i] + '-button'});
                    icon = createElement('span', {'class': 'icon ' + template[i]}, template[i].substr(0, 1).toUpperCase() + template[i].substr(1));
                    button.appendChild(icon);
                    els[template[i]] = button;
                    toolbar.appendChild(button);
                }
            }

            return els;
        };

        initIframe = function () {
            if (undefined === this || undefined === this.iframe || this.iframe.nodeName.toLowerCase() !== 'iframe') {
                return false;
            }

            var body_class;

            if (this.current_element.hasAttribute('data-css-path')) {
                body_class = Classy.has(this.wrapper, 'dark') ? 'whig-body dark' : 'whig-body';
                this.iframe.contentDocument.head.appendChild(createElement('link', {
                    'rel': 'stylesheet',
                    'type': 'text/css',
                    'href': this.current_element.getAttribute('data-css-path')
                }));
                Classy.add(this.iframe.contentDocument.body, body_class);
            }

            addListeners(this, this);

            return this;
        };

        for (i = 0; i < whig_elements.length; i += 1) {
            wrapper_class = Classy.has(whig_elements[i], 'dark') ? 'whig-wrapper dark' : 'whig-wrapper';

            wrapper = createElement('div', {'class': 'whig-wrapper'});
            objects = buildToolbar();
            iframe = createElement('iframe', {'class': 'whig-frame'});

            setAttrs(wrapper, {'class': wrapper_class});

            wrapper.appendChild(objects.toolbar);
            wrapper.appendChild(iframe);

            whig_elements[i].parentNode.insertBefore(wrapper, whig_elements[i]);

            whig_elements[i].style.display = 'none';

            objects.current_element = whig_elements[i];
            objects.wrapper = wrapper;
            objects.iframe = iframe;

            ready(initIframe.apply(objects), iframe);
        }

        return false;
    };

    ready(whig);
}(window, document));