var kind = require('enyo/kind');
var Model = require('enyo/Model');
var LocalStorageSource = require('../sources/LocalStorage');

module.exports = kind({
    name: 'UserConfig',
    kind: Model,
    source: LocalStorageSource,
    primaryKey: 'id',
    url: '', ///,
    
    attributes: {
        id: null,
                                // Configs used by the formatting buttons:
        paragraph: false,       //  - Paragraph render on or off
        copy: false,            //  - Render mode: copy if true, read if false
        single_verses: false,   //  - Force rendering as single verses
        text_size: 0,           //  - Text size: translated to ...
        font: 'sans-serif',     //  - Font: serif, sans-serif, or monospace
        advanced_toggle: false, //  - (Classic interfaces): indicates if the advanced form is toggled to display
        render_style: 'passage', // Maps to paragraph and single verse flags 
        italics: true,
        strongs: true,
        red_letter: true,
        highlight: true,
        context_range: 5,
        page_limit: 30,
        copy_separate_line: false,
        copy_omit_extra_br: false,
        copy_abbr_book: false,
        copy_text_format: 'reference_text',
        copy_passage_format: 'reference_passage',
        copy_passage_verse_number: true,
        copy_preset: 'word_processor'
    },

    getUrl: function() {
        // do something?
    }
});

