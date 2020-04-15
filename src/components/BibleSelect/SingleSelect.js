var kind = require('enyo/kind');
var Sel = require('../Select');
var OptionGroup = require('enyo.OptionGroup');
// var Option = require('enyo.Option');

module.exports = kind({
    name: 'SingleSelect',
    kind: Sel,
    width: 270,
    shortWidthThreshold: 250, // viewport width (pixels) at which menu displays short names
    shortWidthWidth: 160,
    isShort: false,
    alwaysShort: false,
    parallelNumber: 0,
    classes: 'biblesupersearch_bible_selector',
    _currentGroup: null,

    handlers: {
        resize: 'handleResize',
    },

    create: function() {
        this.inherited(arguments);
        // this.isShort = (this.shortWidthThreshold <= window.innerWidth) ? false : true;
        // this.isShort = (this.alwaysShort) ? true : this.isShort;

        var statics = this.app.get('statics'),
            bibles = statics.bibles,
            configs = this.app.get('configs'),
            enabled = configs.enabledBibles,
            noSelectLabel = 'Select a Bible',
            width = (this.isShort) ? this.shortWidthWidth : this.width;

        if(this.parallelNumber && this.parallelNumber != 0) {
            var noSelectLabel = 'Paralell Bible #' + this.parallelNumber.toString();
        }

        if(!this.app.singleBibleEnabled()) {        
            this.createComponent({
                content: noSelectLabel,
                value: '0'
            });
        }

        if(Array.isArray(enabled) && enabled.length) {
            for(i in enabled) {
                bibles[enabled[i]] && this._addBibleHelper(bibles[enabled[i]]);
            }
        }
        else {        
            for(i in bibles) {
                this._addBibleHelper(bibles[i]);
            }
        }

        if(width && width != 0) {
            this.addStyles('width:100%; max-width:' + this.width.toString() + 'px');
            // this.style = 'width:100%; max-width:' + this.width.toString() + 'px';
        }
        else {
            this.addStyles('width:100%');
            // this.style = 'width:100%';
        }

        this.checkShort();
        this.resetValue();
    },
    // rendered: function() {
    //     this.inherited(arguments);
    //     this.resetValue();
    // },
    resetValue: function() {
        window.select = this;

        if(this.parallelNumber == 0 || this.parallelNumber == 1) {
            // this.log(this.app.configs.defaultBible);
            this.setSelectedValue(this.app.configs.defaultBible);
            // this.set('value', this.app.configs.defaultBible);
        }
    },
    applyDefaultValue: function() {
        var value = this.getValue();

        this.app.debug && this.log(value);

        if(!value || value == 0) {
            this.resetValue();
        }
    },
    _addBibleHelper: function(bible) {
        if(bible.lang != this._lastLang) {
            // do something?
        }

        this._lastLang = bible.lang;
        var narrow = this.isShort,
            group = null;

        // this.app.configs.bibleGrouping = null;

        if(this.app.configs.bibleGrouping && this.app.configs.bibleGrouping != 'none') {
            var contentShort = bible.shortname,
                contentLong = bible.name,
                content = narrow ? contentShort : contentLong;

            switch(this.app.configs.bibleGrouping) {
                case 'language':
                    group = bible.lang_short;
                    groupContent = bible.lang_native + ' - (' + bible.lang_short.toUpperCase() + ')';
                    break;
                case 'language_english':
                    group = bible.lang_short;
                    groupContent = bible.lang + ' - (' + bible.lang_short.toUpperCase() + ')';
                    break;
                default:
                    alert('Invalid bibleGrouping: ' + this.app.configs.bibleGrouping);
            }

            var compName = 'group' + group;

            if(!this.$[compName]) {
                this.createComponent({
                    tag: 'optgroup',
                    // kind: OptionGroup,
                    attributes: {label: groupContent},
                    name: compName,
                });
            }

            this.$[compName].createComponent({
                // kind: Option,
                tag: 'option',
                content: content,
                value: bible.module,
                attributes: {value: bible.module},
                contentShort: contentShort,
                contentLong: contentLong,
                // owner: this
            });
        }
        else {
            var contentShort = bible.shortname + ' (' + bible.lang + ')',
                contentLong = bible.name + ' (' + bible.lang + ')',
                content = narrow ? contentShort : contentLong;

            this.createComponent({
                content: content,
                value: bible.module,
                contentShort: contentShort,
                contentLong: contentLong
            });
        }
    },
    _lastLang: null,
    valueChanged: function(was, is) {
        this.inherited(arguments);
    },
    setSelectedValue: function(value) {
        var value = value || 0
            controls = this.getClientControls();

        this.log(value);

        if(this.setSelectedByValue) {
            this.setSelectedByValue(value);
            return;
        }

        this.log('here');
        this.set('value', value);

        for(i in controls) {
            if(controls[i].get('value') == value) {
                this.setSelected(i);
                break;
            }
        }
    },
    isShortChanged: function(was, is) {
        this.log(was, is);
        var width = (is) ? this.shortWidthWidth : this.width;
        var comp = this.getClientControls();

        comp.forEach(function(option) {
            var content = (is) ? option.contentShort : option.contentLong;
            content && option.set('content', content);
        }, this);

        // this.app.debug && this.log('width', width);

        if(width && width != 0) {
            // this.log('applying max-width', width.toString());
            this.applyStyle('max-width', null);
            this.applyStyle('max-width', width.toString() + 'px' );
            this.render();
        }
    },
    checkShort: function() {
        var isShort = (this.shortWidthThreshold <= window.innerWidth) ? false : true;
        isShort = (this.alwaysShort) ? true : isShort;
        this.set('isShort', isShort);
        // this.log('shortWidthThreshold', this.shortWidthThreshold);
        // this.log('alwaysShort', this.alwaysShort);
        // this.log('isShort', isShort);
    },
    handleResize: function(inSender, inEvent) {
        this.checkShort();
    }
});
