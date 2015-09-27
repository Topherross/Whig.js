# Whig.js

Whig.js is a pure javascript WYSIWYG text editor widget for HTML textarea elements.

The Whig editor provides the following functionality:

1. Bold.
2. Underline.
3. Italicize.
4. Unordered Lists.
5. Ordered Lists.
6. Indent.
7. Un-Indent (Outdent).
8. Align Text Center.
9. Align Text Left.
10. Align Text Right.
11. Justify Text.
12. Superscript.
13. Subscript.
14. Link/Unlink.
15. Image/Image Link. Both with CSS float, and margin options.
16. Remove Formatting.

**********************************

## Usage

To use the Whig editor:

1. Add a directory named `whig` to your project's static directory.
2. Copy `whig.js`, the Whig.js `img` directory,  and `whig.css` into the newly created `whig` directory.
3. Adjust the background image URL paths in `whig.css` to the current location of the `whig/img/` directory.
4. Add `whig.js`, and `whig.css` to the head of your HTML document.
5. Add `class="whig-field"` to the textarea(s) you want to convert to a Whig editor.
If you wish to use the optional 'dark' theme add `class="whig-field dark"` to the textarea(s).
6. Add `data-css-path="your_static_directory/whig/whig.css"` to the target textarea(s) so that the dialog window will inherit the correct styles.
7. Optionally you can add `data-init-callback="myCallbackFunction"` to call your `myCallbackFunction` after the Whig editor has initialized.
8. Refresh the target page, and you should see the Whig editor in place of the plain old textarea(s).
