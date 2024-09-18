# html-to-latex-listing

Convert code highlighted as html to LaTex listings. This library only works on a
small subset of html, but it is sufficient to handle the output of "Copy With
Highlighting" and "Paste as Html" from VSCode. Note that background color is not
preserved.

I got frustrated with the current state of the art of syntax highlighting in
LaTex. Both `minted` and `listing` does not provide satisfactory highlighting to
my taste. This package ensures that the highlighting is consistent with VSCode
at the price of some manual effort.

```sh
npm install html-to-latex-listing
npx html-to-latex-listing 'snippet/*.html'
```

```latex
\documentclass{article}
\usepackage{xcolor}
\usepackage{fancyvrb}
\begin{document}
\VerbatimInput[commandchars=\\\{\}]{snippet/foo.tex}
\end{document}
```
