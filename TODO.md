# TODO

1. Put a clear seperation between blocks control and inside the block styling.
2. Blocks actions:
    - [x] Insert a(n): Image, Seperator, Code Block, embed.
    - [ ] Delete Block.
    - [ ] Move Block.
3. Inside the block styles:
    - [x] bold.
    - [x] italic.
    - [x] mark.
    - [x] code.
    - [ ] link.
4. On mobile:
    - [x] Make sure to hide styles inside the mobile toolbar and show it when text is selected.
    - [x] Make sure block buttons actually add blocks.
    - [ ] Navigation through blocks is bad on mobile.
5. On desktop:
    - [ ] Make sure that the toolbar is working as expected.
    - [x] Make sure adding different types of blocks with "/" is working as expected.
    - [x] Delete the "/" when changing the block type.

# ISSUES

- [x] For some reason when clicking bold to make some text bold it automatically select the next character.
- [ ] Test the toggleFormat function.
- [x] Removing styled text will make the cursor go back to the beginning.
- [x] Selecting styled text then trying to destyle it won't work on first click, you need a second click for it to work.
- [x] User cannot press arrow down or up to navigate blocks when the focus is on the image block.
- [x] Review the styles in "index.css" specifically "text-editor-input" styles.
- [ ] Writing " " emptyspace and then removing it will cause the placeholder to be gone.

# Features

- [x] Add placeholder text for every block, let the user know that they can press "/" for a command menu.
- [ ] Code Block is very generic and we CANNOT write newlines in it.
    - [ ] Syntax highlighting.
    - [ ] Languages support.
    - [ ] Multiline support.
- [ ] Add a global notification center, so everytime something happen we can just call the center and notify the user (not only errors, user can be notified about successes, and maybe other things).

# CodeBase Enhancments

- [x] Auth.tsx in the pages folder is too big, refactor.
