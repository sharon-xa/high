# TODO

1. Put a clear seperation between blocks control and inside the block styling.
2. Blocks actions:
    - [x] Insert a(n): Image, Seperator, Code Block, embed.
    - [x] Delete Block.
    - [x] Move Block.
    - [ ] Undo Actions.
3. Inside the block styles:
    - [x] bold.
    - [x] italic.
    - [x] mark.
    - [x] code.
    - [x] link.
4. On mobile:
    - [x] Make sure to hide styles inside the mobile toolbar and show it when text is selected.
    - [x] Make sure block buttons actually add blocks.
    - [ ] Navigation through blocks is bad on mobile.
    - [ ] Maybe add a plus button on phones to create a new block.
5. On desktop:
    - [x] Make sure adding different types of blocks with "/" is working as expected.
    - [x] Delete the "/" when changing the block type.
    - [ ] Make sure that the toolbar is working as expected.

# ISSUES

- [x] For some reason when clicking bold to make some text bold it automatically select the next character.
- [x] Removing styled text will make the cursor go back to the beginning.
- [x] Selecting styled text then trying to destyle it won't work on first click, you need a second click for it to work.
- [x] User cannot press arrow down or up to navigate blocks when the focus is on the image block.
- [x] Review the styles in "index.css" specifically "text-editor-input" styles.
- [x] Writing anything and then removing it will cause the placeholder to be gone from the paragrapgh block and header block.
- [x] When selecting text to style the toolbar appears in weird places, only when the user already scrolled.
- [ ] Test the toggleFormat function.
- [ ] Fix the authenticaiton, saving the state of authentication will result in static state, so we're just gonna keep being authenticated even if the user actually isn't authenticated (session expired).
- [ ] The discard and upload buttons in new-post is non functional.

# Features

- [x] Add placeholder text for every block, let the user know that they can press "/" for a command menu.
- [ ] Code Block is very generic and we CANNOT write newlines in it.
    - [ ] Syntax highlighting.
    - [ ] Languages support.
    - [x] Multiline support.
- [ ] Add a global notification center, so everytime something happen we can just call the center and notify the user (not only errors, user can be notified about successes, and maybe other things).
- [ ] Add the ability to go to links in editing mode, Ctrl and mouse click.
- [ ] Add shortcuts to apply styles, like Ctrl+b for bold.
- [ ] Add shortcuts to reorder blocks.

# CodeBase Enhancments

- [x] Auth.tsx in the pages folder is too big, refactor.
- [x] The action parameter on keyDownOnBlock function is too ambiguous, might delete later.
