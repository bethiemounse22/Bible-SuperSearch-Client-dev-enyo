var kind = require('enyo/kind');
var ResultsBase = require('./ResultsBase');
var CopyPane = require('./CopyPane');
var CopySettings = require('../../components/dialogs/CopySettings');

module.exports = kind({
    name: 'ResultsCopyBase',
    kind: ResultsBase,
    container: null,
    // newLine: '\n',
    newLine: '<br />',

    create: function() {
        this.inherited(arguments);

        this.$.DialogsContainer.createComponent({
            kind: CopySettings
        });
    },

    renderHeader: function() {
        this.app.debug && this.log();
        this.container = this._createContainer();
        var headerComponents = [];
        var copyComponents = [];
        var displayedBible = 0;

        for(i in this.bibles) {
            var module = this.bibles[i];
            var bible_info = this.selectBible(module);

            if(!bible_info) {
                continue;
            }

            var name = this._getBibleComponentName(i);
            displayedBible ++;

            if(this.multiBibles) {            
                headerComponents.push({
                    tag: 'th',
                    content: this._getBibleDisplayName(bible_info)
                });
            }

            copyComponents.push({
                kind: CopyPane,
                owner: this.container,
                name: name,
                displayedBible: displayedBible,
                classes: (this.selectedBible.rtl) ? 'biblesupersearch_copy_pane rtl' : 'biblesupersearch_copy_pane ltr'
            });
        }

        this.multiBibles && this.container.createComponent({tag: 'tr', components: headerComponents});
        this.container.createComponent({tag: 'tr', components: copyComponents});
    },
    renderFooter: function() {

    },
    renderSingleVerseSingleBible: function(passage) {
        this.renderSingleVerseParallelBible(passage);
    },    
    renderSingleVerseParallelBible: function(passage) {
        for(chapter in passage.verse_index) {
            passage.verse_index[chapter].forEach(function(verse) {
                for(i in this.bibles) {
                    var module = this.bibles[i];
                    var bible_info = this.selectBible(module);

                    if(!bible_info) {
                        continue;
                    }

                    if(passage.verses[module] && passage.verses[module][chapter] && passage.verses[module][chapter][verse]) {
                        var content  = this.processSingleVerseContent(passage, passage.verses[module][chapter][verse]);
                        this._appendBibleComponent(content, i);
                    }
                }
            }, this);
        }
    },
    renderPassageParallelBible: function(passage) {        
        var omitExtraBr = this.app.UserConfig.get('copy_omit_extra_br'),
            passageLayout = this.app.UserConfig.get('copy_passage_format'),
            br = (omitExtraBr) ? this.newLine : this.newLine + this.newLine,
            bookName = this.app.UserConfig.get('copy_abbr_book') && passage.book_short ? passage.book_short : passage.book_name,
            bookName = this.app.getLocaleBookName(passage.book_id, bookName, this.app.UserConfig.get('copy_abbr_book'));
            reference = bookName + ' ' + passage.chapter_verse;

        if(passageLayout == 'reference_passage') {        
            for(i in this.bibles) {
                this._appendBibleComponent(reference + br, i);
            }
        }

        for(chapter in passage.verse_index) {
            passage.verse_index[chapter].forEach(function(verse) {
                var components = [];

                for(i in this.bibles) {
                    var module = this.bibles[i];
                    var bible_info = this.selectBible(module);

                    if(!bible_info) {
                        continue;
                    }

                    if(passage.verses[module] && passage.verses[module][chapter] && passage.verses[module][chapter][verse]) {
                        var content = this.processPassageVerseContent(passage, passage.verses[module][chapter][verse]);
                        this._appendBibleComponent(content, i);
                    }
                }
            }, this);
        }

        if(passageLayout == 'passage_reference') {        
            referenceHtml = (omitExtraBr) ? reference + this.newLine : this.newLine + reference + this.newLine;

            for(i in this.bibles) {
                this._appendBibleComponent(referenceHtml, i);
            }
        }

        if(!omitExtraBr) {        
            for(i in this.bibles) {
                this._appendBibleComponent(this.newLine, i);
            }
        }
    },    
    renderPassageSingleBible: function(passage) {
        this.renderPassageParallelBible(passage);
    },
    _getBibleComponentName: function(index) {
        return 'Bible_' + index.toString();
    },
    _appendBibleComponent: function(content, index) {
        var compName = this._getBibleComponentName(index);
        this.container.$[compName] && this.container.$[compName].appendText(content);    
    },
    processAssembleVerse: function(reference, verse) {
        var format = this.app.UserConfig.get('copy_text_format'),
            line = this.app.UserConfig.get('copy_separate_line') ? this.newLine : ' ',
            text = this.processText(verse.text);

        switch(format) {
            case 'text_only':
                return text;
                break;            
            case 'reference_only':
                return reference;
                break;
            case 'text_reference':
                return text + line + reference;
                break;
            case 'reference_text':
            default:
                return reference + line + text;
        }

        // return reference + '  ' + this.processText(verse.text);
    },

    processAssembleSingleVerse: function(reference, verse) {
        var nl = this.app.UserConfig.get('copy_omit_extra_br') ? this.newLine : this.newLine + this.newLine;
        return this.processAssembleVerse(reference, verse) + nl;
    }, 
    processAssemblePassageVerse: function(reference, verse) {
        // var processed = this.processAssembleVerse(reference, verse);
        var processed = (this.app.UserConfig.get('copy_passage_verse_number')) ? reference + ' ' : '';
            processed += this.processText(verse.text);

        if(this.isParagraphView) {
            processed += '  ';

            if(this.isNewParagraph(verse)) {
                processed = this.newLine + this.newLine + processed;
            }
        }
        else {
            processed += this.newLine;
        }

        return processed;
    },

    // Overrides bottom copyright row to embed it in the copyable text
    _renderCopyrightBottom: function() {
        for(i in this.bibles) {
            var module = this.bibles[i];

            if(typeof this.app.statics.bibles[module] == 'undefined') {
                continue;
            }
            
            var bible_info = this.app.statics.bibles[module];
            var content = bible_info.name + ' (' + bible_info.shortname + ')\n\n' + bible_info.copyright_statement;

            if(bible_info.research) {
                content += '\n\nThis Bible is provided for research purposes only.';
            }

            this._appendBibleComponent(content, i);
        }

        this.showingCopyrightBottom = true;
    },
    proccessSingleVerseReference: function(passage, verse) {
        var bookName = this.app.UserConfig.get('copy_abbr_book') && passage.book_short ? passage.book_short : passage.book_name;
        bookName = this.app.getLocaleBookName(passage.book_id, bookName, this.app.UserConfig.get('copy_abbr_book'));
        return bookName + ' ' + verse.chapter + ':' + verse.verse;
    },    
});
