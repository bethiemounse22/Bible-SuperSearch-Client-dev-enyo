// ContentPane displays a form with results in a 'standard' manner
// That is, a form on top, and if applicable, results rendered below
// WARNING: This Base kind is NOT intended to be used directly, and should be extended

var kind = require('enyo/kind');
var FormController = require('./FormController');
var GridView = require('../results/GridView');
var ErrorView = require('../results/ErrorView');
var ResultsController = require('../results/ResultsController');
var FormatButtons = require('./FormatButtonsBase');

var forms = {
    // populate forms in child kinds
};

module.exports = kind({
    name: 'ContentPaneBase',
    classes: 'biblesupersearch_content',
    forms: forms,
    displayFormOnCreate: false,
    formatButtonsView: FormatButtons,

    published: {
        formView: null // This is a string representing a kind reference in this.forms
    },

    handlers: {
        onFormResponseSuccess: 'handleFormResponse',
        onFormResponseError: 'handleFormError'
    },

    components: [
        {content: 'content view'},
        { components: [
            {name: 'FormController', kind: FormController, view: null},
        ]},        
        { name: 'ResultsContainer', components: [
            {name: 'ResultsController', kind: ResultsController, view: null},
        ]},
        
        // {name: 'ResultsContainer', ind: ResultsView}, // need a ViewController here!
        {name: 'ErrorsContainer', showing: false, kind: ErrorView}
    ],

    create: function() {
        this.inherited(arguments);
        
        if(this.displayFormOnCreate) {
            this.formViewProcess(this.formView);
        }
    },
    formViewProcess: function(formView) {
        this.log('formView', formView);

        if(this.forms && this.forms[formView]) {
            this.$.FormController.set('view', this.forms[formView]);
        }
    },
    formViewChanged: function(was, is) {
        this.formViewProcess(is);
        this.$.FormController && this.$.FormController.render();
    },
    handleFormResponse: function(inSender, inEvent) {
        this.$.ErrorsContainer.set('showing', false);
        //this.log(results);
        this.log(inEvent);

        if(inEvent.results.error_level == 4) {
            return this.handleFormError(inSender, inEvent);
        }

        this.$.ResultsController.set('resultsData', inEvent.results);
        this.$.ResultsController.set('formData', inEvent.formData);
        //  ==>> this.$.ResultsController.view.render(); // ??

        // this.$.ResultsContainer.destroyComponents();
        // this.$.ResultsContainer.createComponent({
        //     kind: this.formatButtonsView,
        //     name: 'FormatButtons'
        // });

        // inEvent.results.forEach(function(passage) {
        //     this.$.ResultsContainer.createComponent({
        //         kind: GridView,
        //         passageData: passage,
        //         bibleCount: 1,
        //         formData: inEvent.formData,
        //     });
        // }, this);

        //this.$.ResultsContainer.setShowing(true);
        //this.$.Errors.setShowing(false);
        this.$.ResultsContainer.set('showing', true);
    },
    handleFormError: function(inSender, inEvent) {
        this.log('error');
        this.log(inEvent);

        this.$.ResultsContainer.set('showing', false);
        
        this.$.ErrorsContainer.set('content', 
            inEvent.response.errors.join('<br><br>')
        );
        
        this.$.ErrorsContainer.set('showing', true);
    }
});
