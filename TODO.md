# TODO

1. Put a clear seperation between blocks control and inside the block styling.
2. Blocks actions:
    - [ ] Insert a(n): Image, Seperator, Code Block, embed.
    - [ ] Delete Block.
    - [ ] Move Block.
3. Inside the block styles:
    - [x] bold.
    - [x] italic.
    - [x] link.
    - [x] mark.
    - [x] code.
4. On mobile:
    - [x] Make sure to hide styles inside the mobile toolbar and show it when text is selected.
5. On desktop:
    - [ ] Make sure that the toolbar is working as expected.
    - [ ] Make sure adding different types of blocks with "/" is working as expected.

# ISSUES

- [x] For some reason when clicking bold to make some text bold it automatically select the next character.
- [ ] Test the toggleFormat function.
- [x] Removing styled text will make the cursor go back to the beginning.
- [ ] Selecting styled text then trying to destyle it won't work on first click, you need a second click for it to work.

# Features

- [ ] Add placeholder text for every block, let the user know that they can press "/" for a command menu.
- [ ] Code Block is very generic and we CANNOT write newlines in it.
    - [ ] Syntax highlighting.
    - [ ] Languages support.
    - [ ] Multiline support.

# CodeBase Enhancments

- [ ] Auth.tsx in the pages folder is too big, refactor.
