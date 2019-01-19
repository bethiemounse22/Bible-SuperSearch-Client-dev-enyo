var kind = require('enyo/kind');
var FormBase = require('./FormBaseExpanding');
var Button = require('enyo/Button');
var Input = require('enyo/Input');
var TextArea = require('enyo/TextArea');
var Checkbox = require('enyo/Checkbox');
var BibleSelect = require('../../components/BibleSelect/MultiSelect');
var SearchType = require('../../components/SearchType');
var Shortcuts = require('../../components/Shortcuts');

module.exports = kind({
    name: 'Expanding',
    kind: FormBase,

    components: [
        {
            classes: 'biblesupersearch_expanding_form expanding',
            components: [
                {classes: 'input_row_wide', components: [
                    {name: 'request', kind: TextArea, placeholder:'Enter search keyword(s) or passage reference(s)'},
                ]},
                {classes: 'input_row', components: [
                    {classes: 'label', content: 'Bible Version(s):'},
                    {classes: 'element', components: [
                        {
                            name: 'bible', 
                            kind: BibleSelect, 
                            parallelStart: 1, 
                            parallelLimit: 1,
                            selectorWidth: 500
                        }
                    ]}
                ]},      
                
                {name: 'Expansion', classes: 'wrapper', showing: false, components: [
                    {classes: 'input_row', components: [
                        {classes: 'label', content: 'Limit Search To:'},
                        {classes: 'element', components: [
                            {kind: Shortcuts, name: 'shortcut'}
                        ]}
                    ]},                
                    {classes: 'input_row', components: [
                        {classes: 'label', content: 'Passages:'},
                        {classes: 'element', components: [
                            {kind: TextArea, name: 'reference'}
                        ]}
                    ]},                
                    {classes: 'input_row', components: [
                        {classes: 'label', content: 'Match:'},
                        {classes: 'element', components: [
                            {kind: SearchType, name: 'search_type'}
                        ]}
                    ]},                
                    {classes: 'input_row', components: [
                        {classes: 'label', content: 'Whole Words Only:'},
                        {classes: 'element', components: [
                            {kind: Checkbox, name: 'whole_words'}
                        ]}
                    ]},               
                    {classes: 'input_row', components: [
                        {classes: 'label', content: 'Exact Case:'},
                        {classes: 'element', components: [
                            {kind: Checkbox, name: 'exact_case'}
                        ]}
                    ]},
                    {classes: 'input_row_wide', components: [
                        {
                            kind: Button, 
                            content: 'Random Chapter', 
                            ontap: 'submitRandom', 
                            random_type: 'Random Chapter', 
                            style: 'margin-right: 4px', 
                            // classes: 'user_friendly_random'
                        },
                        {
                            kind: Button, 
                            content: 'Random Verse', 
                            ontap: 'submitRandom', 
                            random_type: 'Random Verse', 
                            // classes: 'user_friendly_random'
                        }
                    ]},
                ]},
                {classes: 'input_row_wide', components: [
                    {kind: Button, content: 'Search', ontap: 'submitForm'},
                ]},                
                {classes: 'expander_row', components: [
                    {name: 'Expand1', kind: Button, content: "&#9660;", ontap: 'toggleExpanded', allowHtml: true},
                    {name: 'Expand0', kind: Button, content: "&#9650;", ontap: 'toggleExpanded', allowHtml: true, showing: false}
                ]}, 
            ],
        }
    ], 

    expandedChanged: function(was, is) {
        this.inherited(arguments);
    }

});