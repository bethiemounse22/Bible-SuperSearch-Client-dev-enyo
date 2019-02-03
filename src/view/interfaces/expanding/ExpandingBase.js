var kind = require('enyo/kind');
var ViewController = require('enyo/ViewController');
var formView = require('../../../forms/expanding/Expanding');
var InterfaceBase = require('../InterfaceBase');
var ContentPane = require('./ContentPane');
// var FormatButtons = require('../../../components/FormatButtons/classic/FormatButtonsClassic');
// var advancedFormView = require('../../../forms/ClassicAdvanced');
var Pager = require('../../../components/Pagers/CleanPager');

module.exports = kind({
    name: 'ExpandingBase',
    kind: InterfaceBase,
    formView: formView,
    advancedFormView: null, //advancedFormView,
    PagerControl: Pager,
    classes: 'interface_expanding',
    expanded: false,

    create: function() {
        this.inherited(arguments);
        this.log();

        this.createComponent({
            name: 'Content',
            kind: ContentPane,
            formView: this.formView,
            displayFormOnCreate: true
        });        
    }
});