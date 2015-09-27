(function (window, document) {
    'use strict';

    var Whig,
        Classy,
        Doc,
        $dialog = null,
        whig;

    function isAbsolutePath(path) {
        return /^https?:\/\//i.test(path);
    }

    function toCapFirst(string) {
        var str_array = string.split(' '), i;

        for (i = 0; i < str_array.length; i += 1) {
            str_array[i] = str_array[i].substr(0, 1).toUpperCase() + str_array[i].substr(1);
        }

        return str_array.join(' ');
    }

    function validate(form) {
        var n, valid = true;
        for (n = 0; n < form.length; n += 1) {
            if (Classy.has(form[n], 'validate-required')) {
                if (form[n].value === "") {
                    Classy.add(form[n], 'error');
                    if (valid) {
                        valid = false;
                    }
                } else {
                    Classy.remove(form[n], 'error');
                }
            }
        }

        return valid;
    }

    function getLinkHtml() {
        return '<div>' +
            '<label for="link_url">Link URL</label>' +
            '<input type="text" name="link_url" id="link_url" class="validate-required">' +
            '<label for="title_text">Title Text</label>' +
            '<input type="text" name="title_text" id="title_text" class="validate-required">' +
            '<label for="alt_text">Alt Text</label>' +
            '<input type="text" name="alt_text" id="alt_text" class="validate-required">' +
            '<label for="link_text">Link Text</label>' +
            '<input type="text" name="link_text" id="link_text" class="validate-required">' +
            '</div>';
    }

    function getImageHtml() {
        return '<div>' +
            '<label for="link_url">Image URL</label>' +
            '<input type="text" name="link_url" id="link_url" class="validate-required">' +
            '<label for="title_text">Title Text</label>' +
            '<input type="text" name="title_text" id="title_text" class="validate-required">' +
            '<label for="alt_text">Alt Text</label>' +
            '<input type="text" name="alt_text" id="alt_text" class="validate-required">' +
            '<label for="width">Width</label><input type="text" name="width" id="width">' +
            '<p class="help-text">Use numbers for pixels, use %, or leave blank for "auto".</p>' +
            '<label for="height">Height</label>' +
            '<input type="text" name="height" id="height">' +
            '<p class="help-text">Use numbers for pixels, use %, or leave blank for "auto".</p>' +
            '<fieldset class="float_wrap">' +
            '<legend>Float</legend>' +
            '<label for="float_left" class="inline-label">' +
            '<input type="radio" name="float" id="float_left" value="left">' +
            '<span>Left</span>' +
            '</label>' +
            '<label for="float_right" class="inline-label">' +
            '<input type="radio" name="float" id="float_right" value="right">' +
            '<span>Right</span>' +
            '</label>' +
            '<label for="float_none" class="inline-label">' +
            '<input type="radio" name="float" id="float_none" checked="checked" value="none">' +
            '<span>None</span>' +
            '</label>' +
            '</fieldset>' +
            '<fieldset class="float_wrap" id="margin_wrap">' +
            '<legend>Margin</legend>' +
            '<label for="margin_top" class="inline-label">' +
            '<span>&#x2191;</span>' +
            '<input type="text" name="margin_top" id="margin_top" value="">' +
            '</label>' +
            '<label for="margin_right" class="inline-label">' +
            '<span>&#x2192;</span>' +
            '<input type="text" name="margin_right" id="margin_right" value="">' +
            '</label>' +
            '<label for="margin_bottom" class="inline-label">' +
            '<span>&#x2193;</span>' +
            '<input type="text" name="margin_bottom" id="margin_bottom" value="">' +
            '</label>' +
            '<label for="margin_left" class="inline-label">' +
            '<span>&#x2190;</span>' +
            '<input type="text" name="margin_left" id="margin_left" value="">' +
            '</label>' +
            '<p class="help-text">Use numbers for pixels, use %, or leave blank for 0.</p>' +
            '</fieldset>' +
            '<div id="image_link_wrap">' +
            '<label for="image_link_toggle">Make Image a Link</label>' +
            '<input type="checkbox" id="image_link_toggle" name="image_link_toggle">' +
            '<div id="image_link_url_wrap">' +
            '<label for="image_link_url">Link URL</label>' +
            '<input type="text" id="image_link_url" name="image_link_url">' +
            '</div>' +
            '</div>' +
            '</div>';
    }

    function dia() {
        if ($dialog !== null) {
            return $dialog;
        }

        $dialog = {};

        var wrap = Doc.createElement('div', {'id': 'whig_dialog_wrap', 'style': 'display:none;'}),
            win = Doc.createElement('form', {'id': 'whig_dialog_window'}),
            header = Doc.createElement('h1', {'id': 'whig_dialog_header'}),
            content = Doc.createElement('div', {'id': 'whig_dialog_content'}),
            button_wrap = Doc.createElement('div', {'id': 'whig_button_wrap'}),
            confirm = Doc.createElement('button', {'type': 'submit', 'id': 'whig_dialog_confirm'}, 'Confirm'),
            cancel = Doc.createElement('button', {'type': 'button', 'id': 'whig_dialog_cancel'}, 'Cancel'),
            $options = {
                target: document.body,
                onCancel: null,
                onConfirm: null
            };

        win.appendChild(header);
        win.appendChild(content);
        button_wrap.appendChild(confirm);
        button_wrap.appendChild(cancel);
        win.appendChild(button_wrap);
        wrap.appendChild(win);

        $dialog.added_to_DOM = false;
        $dialog.visible = false;

        $dialog.init = function (options) {
            var _options = options || null;

            $options = {
                target: undefined !== _options.target ? _options.target.nodeName.toLowerCase() === 'iframe' ? _options.target.contentDocument.body : _options.target : document.body,
                onCancel: undefined !== _options.onCancel && typeof _options.onCancel === 'function' ? _options.onCancel : null,
                onConfirm: undefined !== _options.onConfirm && typeof _options.onConfirm === 'function' ? _options.onConfirm : null
            };

            $options.target.appendChild(wrap);
            $dialog.added_to_DOM = true;

            return $dialog;
        };

        $dialog.updateHeader = function (text, html) {
            if (undefined !== html && !!html) {
                Doc.setText(header, text, html);
            } else {
                Doc.setText(header, text);
            }

            return $dialog;
        };

        $dialog.updateContent = function (text, html, callback) {
            callback = callback || function () {
                    return false;
                };

            if (undefined !== html && !!html) {
                Doc.setText(content, text, html);
            } else {
                Doc.setText(content, text);
            }

            if (undefined !== win.elements.image_link_toggle && undefined !== win.elements.image_link_url) {
                var input = win.elements.image_link_url;
                win.elements.image_link_toggle.onchange = function () {
                    Classy.toggle(input, 'validate-required');
                    Classy.remove(input, 'error');
                    Classy.toggle(input.parentNode, 'visible');
                };
            }

            if (typeof callback === "function") {
                callback();
            }

            return $dialog;
        };

        $dialog.updateClass = function (klass) {
            if (typeof klass === "string") {
                win.setAttribute('class', klass);
            }

            return $dialog;
        };

        $dialog.show = function () {
            if (!$dialog.added_to_DOM) {
                $options.target.appendChild(wrap);
                $dialog.added_to_DOM = true;
            }

            Object(wrap).style.display = "block";
            $dialog.visible = true;

            return $dialog;
        };

        $dialog.hide = function () {
            if (!!$dialog.added_to_DOM) {
                Object(wrap).style.display = "none";
                $dialog.visible = false;
            }

            return $dialog;
        };

        $dialog.destroy = function () {
            $options.target.removeChild(wrap);
            $dialog = null;
        };

        Doc.event(cancel, 'click', function () {
            $dialog.hide();

            if (undefined !== $options.onCancel && $options.onCancel !== null) {
                $options.onCancel();
            }
        }, false);

        Doc.event(win, 'submit', function (event) {
            event.preventDefault();

            if (!validate(this.elements)) {
                win.scrollTop = 0;
                return false;
            }

            $dialog.hide();

            if (undefined !== $options.onConfirm && $options.onConfirm !== null) {
                $options.onConfirm(this);
            }
        }, false);

        Doc.event(wrap, 'click', function () {
            $dialog.hide();
        }, false);

        Doc.event(win, 'click', function (event) {
            Doc.stop(event);
        }, false);

        Doc.event(window, 'keyup', function (event) {
            var key = event.which || event.keyCode;

            if (key === 27) {
                $dialog.hide();
            }
        }, false);

        $options.target.appendChild(wrap);
        $dialog.added_to_DOM = true;

        return $dialog;
    }

    Doc = {
        ready: function (callback, iframe) {
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
        },

        createElement: function (type, attrs, text, html) {
            var el = document.createElement(type);

            if (undefined !== attrs) {
                Doc.setAttributes(el, attrs);
            }

            if (undefined !== text) {
                if (undefined !== html && !!html) {
                    Doc.setText(el, text, true);
                } else {
                    Doc.setText(el, text);
                }
            }

            return el;
        },

        setAttributes: function (el, attributes) {
            var attr;
            for (attr in attributes) {
                if (Object.prototype.hasOwnProperty.call(attributes, attr)) {
                    el.setAttribute(attr, attributes[attr]);
                }
            }
        },

        setText: function (el, text, html) {
            if (undefined !== html && !!html) {
                el.innerHTML = text;
            } else if (document.all) {
                el.innerText = text;
            } else {
                el.textContent = text;
            }
        },

        event: function (el, event, func, bubbles) {
            if (document.addEventListener) {
                el.addEventListener(event, func, !!bubbles ? bubbles : false);
            } else if (document.attachEvent) {
                el.attachEvent("on" + event, func);
            }
        },

        stop: function () {
            if (event.stopPropagation) {
                event.stopPropagation();
            } else {
                event.cancelBubble = true;
            }
        },

        remove: function (el, event, func, bubbles) {
            if (document.removeEventListener) {
                el.removeEventListener(event, func, !!bubbles ? bubbles : false);
            } else if (document.detachEvent) {
                el.detachEvent("on" + event, func);
            }
        }
    };

    Classy = {
        has: function (el, cls) {
            return el.hasAttribute('class') && el.getAttribute('class').indexOf(cls) !== -1;
        },

        add: function (el, cls) {
            if (this.has(el, cls)) {
                return;
            }

            el.setAttribute('class', (el.getAttribute('class') || '') + ' ' + cls);
        },

        remove: function (el, cls) {
            if (!this.has(el, cls)) {
                return;
            }

            el.setAttribute('class', el.getAttribute('class').replace(cls, ''));
        },

        toggle: function (el, cls) {
            if (this.has(el, cls)) {
                this.remove(el, cls);
            } else {
                this.add(el, cls);
            }
        }
    };

    Whig = {
        bold: function () {
            this.iframe.contentDocument.body.focus();
            this.iframe.contentDocument.execCommand('bold', false, null);
            this.current_element.value = this.iframe.contentDocument.body.innerHTML;
        },

        underline: function () {
            this.iframe.contentDocument.body.focus();
            this.iframe.contentDocument.execCommand('underline', false, null);
            this.current_element.value = this.iframe.contentDocument.body.innerHTML;
        },

        italicize: function () {
            this.iframe.contentDocument.body.focus();
            this.iframe.contentDocument.execCommand('italic', false, null);
            this.current_element.value = this.iframe.contentDocument.body.innerHTML;
        },

        ul: function () {
            this.iframe.contentDocument.body.focus();
            this.iframe.contentDocument.execCommand('InsertUnorderedList', false, null);
            this.current_element.value = this.iframe.contentDocument.body.innerHTML;
        },

        ol: function () {
            this.iframe.contentDocument.body.focus();
            this.iframe.contentDocument.execCommand('InsertOrderedList', false, null);
            this.current_element.value = this.iframe.contentDocument.body.innerHTML;
        },

        indent: function () {
            this.iframe.contentDocument.body.focus();
            this.iframe.contentDocument.execCommand('indent', false, null);
            this.current_element.value = this.iframe.contentDocument.body.innerHTML;
        },

        outdent: function () {
            this.iframe.contentDocument.body.focus();
            this.iframe.contentDocument.execCommand('outdent', false, null);
            this.current_element.value = this.iframe.contentDocument.body.innerHTML;
        },

        center: function () {
            this.iframe.contentDocument.body.focus();
            this.iframe.contentDocument.execCommand('JustifyCenter', false, null);
            this.current_element.value = this.iframe.contentDocument.body.innerHTML;
        },

        left: function () {
            this.iframe.contentDocument.body.focus();
            this.iframe.contentDocument.execCommand('JustifyLeft', false, null);
            this.current_element.value = this.iframe.contentDocument.body.innerHTML;
        },

        right: function () {
            this.iframe.contentDocument.body.focus();
            this.iframe.contentDocument.execCommand('JustifyRight', false, null);
            this.current_element.value = this.iframe.contentDocument.body.innerHTML;
        },

        full: function () {
            this.iframe.contentDocument.body.focus();
            this.iframe.contentDocument.execCommand('JustifyFull', false, null);
            this.current_element.value = this.iframe.contentDocument.body.innerHTML;
        },

        superscript: function () {
            this.iframe.contentDocument.body.focus();
            this.iframe.contentDocument.execCommand('superscript', false, null);
            this.current_element.value = this.iframe.contentDocument.body.innerHTML;
        },

        subscript: function () {
            this.iframe.contentDocument.body.focus();
            this.iframe.contentDocument.execCommand('subscript', false, null);
            this.current_element.value = this.iframe.contentDocument.body.innerHTML;
        },

        link: function () {
            var els = this,
                form_wrap = getLinkHtml(),
                href,
                template;

            els.iframe.contentDocument.body.focus();

            dia().init({
                target: els.wrapper,
                onConfirm: function (response) {
                    href = isAbsolutePath(response.link_url.value) ? response.link_url.value : [window.location.origin, window.location.pathname, response.link_url.value].join('');
                    template = '<a href="' + href + '">' + response.link_text.value + '</a>';
                    els.iframe.contentDocument.execCommand('InsertHTML', false, template);
                    els.current_element.value = els.iframe.contentDocument.body.innerHTML;
                }
            }).show().updateHeader('Insert Link').updateContent(form_wrap, true);
        },

        unlink: function () {
            this.iframe.contentDocument.execCommand('UnLink', false, null);
            this.current_element.value = this.iframe.contentDocument.body.innerHTML;
        },

        image: function () {
            var els = this,
                form_wrap = getImageHtml(),
                width,
                height,
                float,
                margin,
                el,
                link_url,
                template;

            els.iframe.contentDocument.body.focus();

            dia().init({
                target: els.wrapper,
                onConfirm: function (response) {
                    width = response.width.value === '' ? 'auto' : response.width.value.substr(response.width.value.length - 1) === "%" ? response.width.value : Number(response.width.value) + 'px';
                    height = response.height.value === '' ? 'auto' : response.height.value.substr(response.height.value.length - 1) === "%" ? response.height.value : Number(response.height.value) + 'px';
                    link_url = response.image_link_toggle.checked && response.image_link_url.value !== '' ? response.image_link_url.value : "";

                    for (el in response.float) {
                        if (response.float.hasOwnProperty(el) && response.float[el].checked) {
                            float = response.float[el].value;
                        }
                    }

                    margin = {
                        top: response.margin_top.value === '' ? 0 : response.margin_top.value.substr(response.margin_top.value.length - 1) === "%" ? response.margin_top.value : Number(response.margin_top.value) + 'px',
                        right: response.margin_right.value === '' ? 0 : response.margin_right.value.substr(response.margin_right.value.length - 1) === "%" ? response.margin_right.value : Number(response.margin_right.value) + 'px',
                        bottom: response.margin_bottom.value === '' ? 0 : response.margin_bottom.value.substr(response.margin_bottom.value.length - 1) === "%" ? response.margin_bottom.value : Number(response.margin_bottom.value) + 'px',
                        left: response.margin_left.value === '' ? 0 : response.margin_left.value.substr(response.margin_left.value.length - 1) === "%" ? response.margin_left.value : Number(response.margin_left.value) + 'px'
                    };

                    if (link_url !== "") {
                        template = '<a href="' + link_url + '" title="' + response.title_text.value + '"><img src="' + response.link_url.value + '" title="' + response.title_text.value + '" alt="' + response.alt_text.value + '" style="width:' + width + ';height:' + height + ';float:' + float + '; margin:' + margin.top + ' ' +margin.right + ' ' + margin.bottom + ' ' + margin.left + ';" /></a>';
                    } else {
                        template = '<img src="' + response.link_url.value + '" title="' + response.title_text.value + '" alt="' + response.alt_text.value + '" style="width:' + width + ';height:' + height + ';float:' + float + '; margin:' + margin.top + ' ' +margin.right + ' ' + margin.bottom + ' ' + margin.left + ';" />';
                    }

                    els.iframe.contentDocument.execCommand('InsertHTML', false, template);
                    els.current_element.value = els.iframe.contentDocument.body.innerHTML;
                }
            }).show().updateHeader('Insert Image').updateContent(form_wrap, true);
        },

        remove: function () {
            this.iframe.contentDocument.body.focus();
            this.iframe.contentDocument.execCommand('removeFormat', false, null);
            this.current_element.value = this.iframe.contentDocument.body.innerHTML;
        }
    };

    whig = function () {
        var whig_elements = document.querySelectorAll('.whig-field'),
            wrapper,
            objects = {},
            iframe,
            textarea,
            wrapper_class,
            buildToolbar,
            buildWhig,
            addListeners,
            initIFrame,
            i;

        if (whig_elements === null) {
            return false;
        }

        addListeners = function (els) {
            var el;

            els.iframe.contentDocument.designMode = 'on';

            for (el in els) {
                if (els.hasOwnProperty(el) && Whig.hasOwnProperty(el)) {
                    Doc.event(els[el], 'click', Whig[el].bind(els), false);
                }
            }

            Doc.event(els.iframe.contentDocument, 'keyup', function () {
                els.current_element.value = els.iframe.contentDocument.body.innerHTML;
            }, false);

            Doc.event(els.iframe.contentDocument, 'keydown', function (event) {
                var key = event.which || event.keyCode;

                if (key === 13) {
                    els.iframe.contentDocument.execCommand('formatBlock', false, 'p');
                }
                els.current_element.value = els.iframe.contentDocument.body.innerHTML;
            }, false);

            Doc.event(els.iframe.contentDocument.body, 'focus', function () {
                els.iframe.contentDocument.execCommand('formatBlock', false, 'p');
                els.current_element.value = els.iframe.contentDocument.body.innerHTML;
            }, false);

            return false;
        };

        buildToolbar = function () {
            var toolbar = Doc.createElement('div', {'class': 'whig-toolbar'}),
                template = ['toolbar', 'bold', 'underline', 'italicize', 'ul', 'ol', 'indent', 'outdent',
                    'center', 'left', 'right', 'full', 'superscript', 'subscript', 'link', 'unlink', 'image', 'remove'],
                els = {toolbar: toolbar},
                i,
                button,
                icon;


            for (i = 0; i < template.length; i += 1) {
                if (template[i] !== 'toolbar') {
                    button = Doc.createElement('button', {
                        'type': 'button',
                        'class': 'whig-' + template[i] + '-button',
                        'title': toCapFirst(template[i])
                    });
                    icon = Doc.createElement('span', {'class': 'icon ' + template[i]}, toCapFirst(template[i]));
                    button.appendChild(icon);
                    els[template[i]] = button;
                    toolbar.appendChild(button);
                }
            }

            return els;
        };

        buildWhig = function (el) {
            wrapper_class = Classy.has(el, 'dark') ? 'whig-wrapper dark' : 'whig-wrapper';

            wrapper = Doc.createElement('div', {'class': 'whig-wrapper'});
            iframe = Doc.createElement('iframe', {'class': 'whig-frame'});
            textarea = Doc.createElement('textarea', {'class': 'whig-textarea', 'style': 'display:none;'});

            Doc.setAttributes(wrapper, {'class': wrapper_class});

            objects = buildToolbar();

            wrapper.appendChild(objects.toolbar);
            wrapper.appendChild(iframe);

            el.parentNode.insertBefore(wrapper, el);
            el.style.display = 'none';

            objects.current_element = el;
            objects.wrapper = wrapper;
            objects.iframe = iframe;
            objects.textarea = textarea;

            return objects;
        };

        initIFrame = function () {
            if (undefined === this) {
                return;
            }

            var callback = this.current_element.getAttribute('data-init-callback') || null,
                path = this.current_element.getAttribute('data-css-path') || null;

            if (path !== null) {
                this.iframe.contentDocument.head.appendChild(
                    Doc.createElement('link', {'rel': 'stylesheet', 'type': 'text/css', 'href': path}));
            }

            Classy.add(this.iframe.contentDocument.body, Classy.has(this.wrapper, 'dark') ? 'whig-body dark' : 'whig-body');
            addListeners(this);

            this.iframe.contentDocument.body.innerHTML = this.current_element.value;

            if (callback !== null && typeof window[callback] === 'function') {
                window[callback]();
            }
        };

        for (i = 0; i < whig_elements.length; i += 1) {
            buildWhig(whig_elements[i]);
            Doc.ready(initIFrame.apply(objects), objects.iframe);
        }
    };

    Doc.ready(whig);
}(window, document));
