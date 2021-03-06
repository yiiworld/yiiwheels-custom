ace.define("ace/keyboard/emacs", ["require", "exports", "module", "ace/lib/dom", "ace/keyboard/hash_handler", "ace/lib/keys"], function (e, t, n) {
    var r = e("../lib/dom"), i = function (e, t) {
        var n = this.scroller.getBoundingClientRect(), r = Math.floor((e + this.scrollLeft - n.left - this.$padding) / this.characterWidth), i = Math.floor((t + this.scrollTop - n.top) / this.lineHeight);
        return this.session.screenToDocumentPosition(i, r)
    }, s = e("./hash_handler").HashHandler;
    t.handler = new s;
    var o = !1, u, a;
    t.handler.attach = function (e) {
        o || (o = !0, r.importCssString("            .emacs-mode .ace_cursor{                border: 2px rgba(50,250,50,0.8) solid!important;                -moz-box-sizing: border-box!important;                -webkit-box-sizing: border-box!important;                box-sizing: border-box!important;                background-color: rgba(0,250,0,0.9);                opacity: 0.5;            }            .emacs-mode .ace_cursor.ace_hidden{                opacity: 1;                background-color: transparent;            }            .emacs-mode .ace_overwrite-cursors .ace_cursor {                opacity: 1;                background-color: transparent;                border-width: 0 0 2px 2px !important;            }            .emacs-mode .ace_text-layer {                z-index: 4            }            .emacs-mode .ace_cursor-layer {                z-index: 2            }", "emacsMode")), u = e.session.$selectLongWords, e.session.$selectLongWords = !0, a = e.session.$useEmacsStyleLineStart, e.session.$useEmacsStyleLineStart = !0, e.session.$emacsMark = null, t.markMode = function () {
            return e.session.$emacsMark
        }, t.setMarkMode = function (t) {
            e.session.$emacsMark = t
        }, e.on("click", l), e.on("changeSession", f), e.renderer.screenToTextCoordinates = i, e.setStyle("emacs-mode")
    }, t.handler.detach = function (e) {
        delete e.renderer.screenToTextCoordinates, e.session.$selectLongWords = u, e.session.$useEmacsStyleLineStart = a, e.removeEventListener("click", l), e.removeEventListener("changeSession", f), e.unsetStyle("emacs-mode")
    };
    var f = function (e) {
        e.oldSession && (e.oldSession.$selectLongWords = u, e.oldSession.$useEmacsStyleLineStart = a), u = e.session.$selectLongWords, e.session.$selectLongWords = !0, a = e.session.$useEmacsStyleLineStart, e.session.$useEmacsStyleLineStart = !0, e.session.hasOwnProperty("$emacsMark") || (e.session.$emacsMark = null)
    }, l = function (e) {
        e.editor.session.$emacsMark = null
    }, c = e("../lib/keys").KEY_MODS, h = {C: "ctrl", S: "shift", M: "alt"};
    ["S-C-M", "S-C", "S-M", "C-M", "S", "C", "M"].forEach(function (e) {
        var t = 0;
        e.split("-").forEach(function (e) {
            t |= c[h[e]]
        }), h[t] = e.toLowerCase() + "-"
    }), t.handler.bindKey = function (e, t) {
        if (!e)return;
        var n = this.commmandKeyBinding;
        e.split("|").forEach(function (e) {
            e = e.toLowerCase(), n[e] = t, e = e.split(" ")[0], n[e] || (n[e] = "null")
        }, this)
    }, t.handler.handleKeyboard = function (e, n, r, i) {
        if (n == -1) {
            t.setMarkMode(null);
            if (e.count) {
                var s = Array(e.count + 1).join(r);
                return e.count = null, {command: "insertstring", args: s}
            }
        }
        if (r == "\0")return;
        var o = h[n];
        if (o == "c-" || e.universalArgument) {
            var u = parseInt(r[r.length - 1]);
            if (u)return e.count = u, {command: "null"}
        }
        e.universalArgument = !1, o && (r = o + r), e.keyChain && (r = e.keyChain += " " + r);
        var a = this.commmandKeyBinding[r];
        e.keyChain = a == "null" ? r : "";
        if (!a)return;
        if (a == "null")return{command: "null"};
        if (a == "universalArgument")return e.universalArgument = !0, {command: "null"};
        if (typeof a != "string") {
            var f = a.args;
            a = a.command, a == "goorselect" && (a = f[0], t.markMode() && (a = f[1]), f = null)
        }
        typeof a == "string" && ((a == "insertstring" || a == "splitline" || a == "togglecomment") && t.setMarkMode(null), a = this.commands[a] || e.editor.commands.commands[a]), !a.readonly && !a.isYank && (e.lastCommand = null);
        if (e.count) {
            var u = e.count;
            return e.count = 0, {args: f, command: {exec: function (e, t) {
                for (var n = 0; n < u; n++)a.exec(e, t)
            }}}
        }
        return{command: a, args: f}
    }, t.emacsKeys = {"Up|C-p": {command: "goorselect", args: ["golineup", "selectup"]}, "Down|C-n": {command: "goorselect", args: ["golinedown", "selectdown"]}, "Left|C-b": {command: "goorselect", args: ["gotoleft", "selectleft"]}, "Right|C-f": {command: "goorselect", args: ["gotoright", "selectright"]}, "C-Left|M-b": {command: "goorselect", args: ["gotowordleft", "selectwordleft"]}, "C-Right|M-f": {command: "goorselect", args: ["gotowordright", "selectwordright"]}, "Home|C-a": {command: "goorselect", args: ["gotolinestart", "selecttolinestart"]}, "End|C-e": {command: "goorselect", args: ["gotolineend", "selecttolineend"]}, "C-Home|S-M-,": {command: "goorselect", args: ["gotostart", "selecttostart"]}, "C-End|S-M-.": {command: "goorselect", args: ["gotoend", "selecttoend"]}, "S-Up|S-C-p": "selectup", "S-Down|S-C-n": "selectdown", "S-Left|S-C-b": "selectleft", "S-Right|S-C-f": "selectright", "S-C-Left|S-M-b": "selectwordleft", "S-C-Right|S-M-f": "selectwordright", "S-Home|S-C-a": "selecttolinestart", "S-End|S-C-e": "selecttolineend", "S-C-Home": "selecttostart", "S-C-End": "selecttoend", "C-l": "recenterTopBottom", "M-s": "centerselection", "M-g": "gotoline", "C-x C-p": "selectall", "C-Down": {command: "goorselect", args: ["gotopagedown", "selectpagedown"]}, "C-Up": {command: "goorselect", args: ["gotopageup", "selectpageup"]}, "PageDown|C-v": {command: "goorselect", args: ["gotopagedown", "selectpagedown"]}, "PageUp|M-v": {command: "goorselect", args: ["gotopageup", "selectpageup"]}, "S-C-Down": "selectpagedown", "S-C-Up": "selectpageup", "C-s": "findnext", "C-r": "findprevious", "M-C-s": "findnext", "M-C-r": "findprevious", "S-M-5": "replace", Backspace: "backspace", "Delete|C-d": "del", "Return|C-m": {command: "insertstring", args: "\n"}, "C-o": "splitline", "M-d|C-Delete": {command: "killWord", args: "right"}, "C-Backspace|M-Backspace|M-Delete": {command: "killWord", args: "left"}, "C-k": "killLine", "C-y|S-Delete": "yank", "M-y": "yankRotate", "C-g": "keyboardQuit", "C-w": "killRegion", "M-w": "killRingSave", "C-Space": "setMark", "C-x C-x": "exchangePointAndMark", "C-t": "transposeletters", "M-u": "touppercase", "M-l": "tolowercase", "M-/": "autocomplete", "C-u": "universalArgument", "M-;": "togglecomment", "C-/|C-x u|S-C--|C-z": "undo", "S-C-/|S-C-x u|C--|S-C-z": "redo", "C-x r": "selectRectangularRegion"}, t.handler.bindKeys(t.emacsKeys), t.handler.addCommands({recenterTopBottom: function (e) {
        var t = e.renderer, n = t.$cursorLayer.getPixelPosition(), r = t.$size.scrollerHeight - t.lineHeight, i = t.scrollTop;
        Math.abs(n.top - i) < 2 ? i = n.top - r : Math.abs(n.top - i - r * .5) < 2 ? i = n.top : i = n.top - r * .5, e.session.setScrollTop(i)
    }, selectRectangularRegion: function (e) {
        e.multiSelect.toggleBlockSelection()
    }, setMark: function (e) {
        var n = t.markMode();
        if (n) {
            cp = e.getCursorPosition();
            if (e.selection.isEmpty() && n.row == cp.row && n.column == cp.column) {
                t.setMarkMode(null);
                return
            }
        }
        n = e.getCursorPosition(), t.setMarkMode(n), e.selection.setSelectionAnchor(n.row, n.column)
    }, exchangePointAndMark: {exec: function (e) {
        var t = e.selection.getRange();
        e.selection.setSelectionRange(t, !e.selection.isBackwards())
    }, readonly: !0, multiselectAction: "forEach"}, killWord: {exec: function (e, n) {
        e.clearSelection(), n == "left" ? e.selection.selectWordLeft() : e.selection.selectWordRight();
        var r = e.getSelectionRange(), i = e.session.getTextRange(r);
        t.killRing.add(i), e.session.remove(r), e.clearSelection()
    }, multiselectAction: "forEach"}, killLine: function (e) {
        t.setMarkMode(null);
        var n = e.getCursorPosition();
        n.column == 0 && e.session.doc.getLine(n.row).length == 0 ? e.selection.selectLine() : (e.clearSelection(), e.selection.selectLineEnd());
        var r = e.getSelectionRange(), i = e.session.getTextRange(r);
        t.killRing.add(i), e.session.remove(r), e.clearSelection()
    }, yank: function (e) {
        e.onPaste(t.killRing.get()), e.keyBinding.$data.lastCommand = "yank"
    }, yankRotate: function (e) {
        if (e.keyBinding.$data.lastCommand != "yank")return;
        e.undo(), e.onPaste(t.killRing.rotate()), e.keyBinding.$data.lastCommand = "yank"
    }, killRegion: function (e) {
        t.killRing.add(e.getCopyText()), e.commands.byName.cut.exec(e)
    }, killRingSave: function (e) {
        t.killRing.add(e.getCopyText())
    }});
    var p = t.handler.commands;
    p.yank.isYank = !0, p.yankRotate.isYank = !0, t.killRing = {$data: [], add: function (e) {
        e && this.$data.push(e), this.$data.length > 30 && this.$data.shift()
    }, get: function () {
        return this.$data[this.$data.length - 1] || ""
    }, pop: function () {
        return this.$data.length > 1 && this.$data.pop(), this.get()
    }, rotate: function () {
        return this.$data.unshift(this.$data.pop()), this.get()
    }}
})