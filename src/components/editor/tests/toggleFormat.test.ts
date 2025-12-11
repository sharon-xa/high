import { describe, it, expect, beforeEach } from 'vitest';
import { toggleFormat } from "../helpers";

function setSelection(startNode: Node, startOffset: number, endNode: Node, endOffset: number) {
    const sel = window.getSelection()!;
    const range = document.createRange();

    range.setStart(startNode, startOffset);
    range.setEnd(endNode, endOffset);

    sel.removeAllRanges();
    sel.addRange(range);
}

describe("toggleFormat (DOM-based)", () => {

    beforeEach(() => {
        document.body.innerHTML = `
            <div id="ed" contenteditable="true">Hello World</div>
        `;
    });

    it("bold: wrap selected text in <strong>", () => {
        const editor = document.getElementById("ed")!;
        const text = editor.firstChild!;

        setSelection(text, 0, text, 5); // "Hello"

        toggleFormat("bold");

        expect(editor.innerHTML).toBe("<strong>Hello</strong> World");
    });

    it("bold: unwrap if already wrapped", () => {
        const editor = document.getElementById("ed")!;
        editor.innerHTML = "<strong>Hello</strong> World";

        const strong = editor.querySelector("strong")!;
        const text = strong.firstChild!;

        setSelection(text, 0, text, 5);

        toggleFormat("bold");

        expect(editor.innerHTML).toBe("Hello World");
    });

    it("italic: wrap selection in <em>", () => {
        const editor = document.getElementById("ed")!;
        const node = editor.firstChild!;

        setSelection(node, 6, node, 11); // "World"

        toggleFormat("italic");

        expect(editor.innerHTML).toBe("Hello <em>World</em>");
    });

    it("italic: unwrap existing <em>", () => {
        const editor = document.getElementById("ed")!;
        editor.innerHTML = "Hello <em>World</em>";

        const em = editor.querySelector("em")!;
        const text = em.firstChild!;

        setSelection(text, 0, text, 5);

        toggleFormat("italic");

        expect(editor.innerHTML).toBe("Hello World");
    });

    it("code: wrap text in <code>", () => {
        const editor = document.getElementById("ed")!;
        const node = editor.firstChild!;

        setSelection(node, 0, node, 5);

        toggleFormat("code");

        expect(editor.innerHTML).toBe("<code>Hello</code> World");
    });

    it("code: unwrap existing <code>", () => {
        const editor = document.getElementById("ed")!;
        editor.innerHTML = "<code>Hello</code> World";

        const code = editor.querySelector("code")!;
        const text = code.firstChild!;

        setSelection(text, 0, text, 5);

        toggleFormat("code");

        expect(editor.innerHTML).toBe("Hello World");
    });

    it("mark: wrap in <mark>", () => {
        const editor = document.getElementById("ed")!;
        const node = editor.firstChild!;

        setSelection(node, 0, node, 5);

        toggleFormat("mark");

        expect(editor.innerHTML).toBe("<mark>Hello</mark> World");
    });

    it("mark: unwrap <mark>", () => {
        const editor = document.getElementById("ed")!;
        editor.innerHTML = "<mark>Hello</mark> World";

        const mark = editor.querySelector("mark")!;
        const text = mark.firstChild!;

        setSelection(text, 0, text, 5);

        toggleFormat("mark");

        expect(editor.innerHTML).toBe("Hello World");
    });

    it("link: wrap in <a href='...'>", () => {
        const editor = document.getElementById("ed")!;
        const node = editor.firstChild!;

        setSelection(node, 6, node, 11); // "World"

        toggleFormat("link", "https://google.com");

        expect(editor.innerHTML).toBe(
            `Hello <a href="https://google.com">World</a>`
        );
    });

    it("link: unwrap <a>", () => {
        const editor = document.getElementById("ed")!;
        editor.innerHTML = `Hello <a href="https://google.com">World</a>`;

        const a = editor.querySelector("a")!;
        const text = a.firstChild!;

        setSelection(text, 0, text, 5);

        toggleFormat("link");

        expect(editor.innerHTML).toBe("Hello World");
    });

    it("partial selection inside styled text splits correctly", () => {
        const editor = document.getElementById("ed")!;
        editor.innerHTML = "<strong>Hello World</strong>";

        const strong = editor.querySelector("strong")!;
        const text = strong.firstChild!;

        setSelection(text, 6, text, 11); // "World"

        toggleFormat("bold");

        expect(editor.innerHTML).toBe("<strong>Hello </strong>World");
    });

});
