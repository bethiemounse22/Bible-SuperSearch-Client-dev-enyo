var kind = require('enyo/kind');
var Button = require('enyo/Button');
var Input = require('enyo/Input');
var TextArea = require('enyo/TextArea');
var Checkbox = require('enyo/Checkbox');
var Signal = require('../Signal');
var Help = require('../dialogs/Help');

module.exports = kind({
    name: 'FormatButtonsBase',
    classes: 'format_buttons',
    // Whether to include the toggle button for advanced search
    // Should be disabled if already displaying the advanced search button
    includeAdvancedToggle: true,
    uc: null,

    handlers: {
        onkeydown: 'handleKey'
    },

    bindings: [
        {from: 'app.UserConfig', to: 'uc'}
    ],

    observers: [
        {method: 'watchRenderStyle', path: ['uc.render_style']},
        {method: 'watchStyleFlags', path: ['uc.paragraph', 'uc.single_line']}
    ],

    create: function() {
        this.inherited(arguments);

        this.createComponent({
            name: 'Dialogs', components: [
                {name: 'HelpDialog', kind: Help, showing: false}
            ]
        });
    },
    rendered: function() {
        this.inherited(arguments);
        this._initAdvancedToggle();
    },

    _initAdvancedToggle: function() {
        var advancedView = this.app.getViewProp('FormatButtonsIncludeAdvancedToggle');

        this.app.debug && this.log('advancedToggle - CONFIG', this.app.configs.toggleAdvanced, this.app.configs);
        this.app.debug && this.log('advancedToggle - Interface', advancedView, this.app.view.FormatButtonsIncludeAdvancedToggle);
        this.app.debug && this.log('advancedToggle - Format Buttons Toggle', this.app.configs.formatButtonsToggle);

        if(!this.includeAdvancedToggle || !advancedView || !this.app.configs.toggleAdvanced || this.app.configs.formatButtonsToggle) {
            this.$.advanced_toggle && this.$.advanced_toggle.destroy();
        }
    },
    handleFontChange: function(inSender, inEvent) {
        val = inSender.val || 'serif';
        this.app.UserConfig.set('font', val);
        // this.log(this.app.UserConfig.getAttributes());
    },    
    handleRenderStyle: function(inSender, inEvent) {
        val = inSender.val || 'passage';
        this.log(val);
        this.app.UserConfig.set('render_style', val);
        // this.log(this.app.UserConfig.getAttributes());
    },
    handleSizeChange: function(inSender, inEvent) {
        var curVal = this.app.UserConfig.get('text_size');
        var newVal = 0;

        if(inSender.val == 'plus') {
            newVal = curVal + 1;
        }        

        if(inSender.val == 'minus') {
            newVal = curVal - 1;
        }

        this.app.UserConfig.set('text_size', newVal);
        // this.log(this.app.UserConfig.getAttributes());
    },
    handleHelp: function(inSender, inEvent) {
        this.app.showHelp(null);
    },
    handlePrint: function(inSender, inEvent) {
        Signal.send('onResultsPrint');
    },
    handleSos: function(inSender, inEvent) {
        this.app.set('sosShowing', true);
    },    
    handleStart: function(inSender, inEvent) {
        this.app.set('startShowing', true);
    },    
    handleDownload: function(inSender, inEvent) {
        this.app.set('downloadShowing', true);
    },    
    handleShare: function(inSender, inEvent) {
        this.app.set('shareShowing', true);
    },    
    handleLink: function(inSender, inEvent) {
        this.app.set('linkShowing', true);
    },    
    handleSettings: function(inSender, inEvent) {
        this.app.set('settingsShowing', true);
    },
    handleClearForm: function() {
        Signal.send('onClearForm');
    },
    handleCopyInstant: function(inSender, inEvent) {
        this.app.UserConfig.set('copy', true);
        Signal.send('onTriggerCopy', {inSender: inSender, inEvent: inEvent});
        this.app.UserConfig.set('copy', false);
    },
    handkeKey: function(inSender, inEvent) {
        this.log(inEvent);
    },
    watchRenderStyle: function(pre, cur, prop) {
        if(cur == 'verse') {
            this.app.UserConfig.set('single_verses', true);
        }
        else {
            this.app.UserConfig.set('single_verses', false);
            this.app.UserConfig.set('paragraph', !!(cur == 'paragraph'));
        }

        this.$.renderstyle_paragraph && this.$.renderstyle_paragraph.addRemoveClass('selected', cur == 'paragraph');
        this.$.renderstyle_passage && this.$.renderstyle_passage.addRemoveClass('selected', cur == 'passage');
        this.$.renderstyle_verse && this.$.renderstyle_verse.addRemoveClass('selected', cur == 'verse');
    },    
    watchStyleFlags: function(pre, cur, prop) {
        this.app.debug && this.log(pre, cur, prop);
    },
    _hideExtras: function() {
        var softConfig = this.app.configs.extraButtonsSeparate,
            supported = this.app.view.FormatButtonsHideExtrasSupported || false;

        if(!supported) {
            return false;
        }

        if(softConfig === true || softConfig == 'true') {
            return true;
        }
        else if (softConfig === false || softConfig == 'false') {
            return false;
        }
        else {
            return this.app.view.FormatButtonsHideExtras;
        }
    }
});
