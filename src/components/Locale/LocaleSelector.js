var kind = require('enyo/kind');
var Select = require('../PseudoSelect/PseudoSelect');
var Signal = require('../../components/Signal');
var Locales = require('../../i18n/LocaleLoader')

module.exports = kind({
    name: 'LocaleSelectorNew',
    kind: Select,
    _setValueInternal: false,

    handlers: {
        onLocaleChange: 'handleLocaleChange'
    },

    create: function() {
        this.inherited(arguments);

        for(i in Locales) {
            if(!Locales[i] || !Locales[i].meta || !Locales[i].meta.lang_name_en) {
                continue;
            }

            var ldb = Locales[i].meta.debug || false;
            var langName = Locales[i].meta.lang_name || Locales[i].meta.lang_name_en;

            if(ldb && !this.app.debug && !this.app.configs.debugLocale) {
                continue;
            }

            this.createOptionComponent({
                content: langName + ' (' + i.toUpperCase() + ')',
                value: i
            });
        }

        this._setValueInternal = true; // or top option will push back into app as the selected locale!
        this.initOptions();
        this.app.debug && this.log('init locale on selector', this.app.get('locale'));
        this.setValueFromLocale();
    },

    change: function(inSender, inEvent) {
        this.inherited(arguments);
        this.app.set('locale', this.getValue());
        // Signal.send('onChangeLocaleManual');
    }, 
    _afterValueChanged: function(optionControl) {
        this.inherited(arguments);
        var val = this.get('value');

        if(!this._setValueInternal && val && val != null) {
            this.app.debug && this.log('backsetting locale', val);
            this.app.set('localeManual', true);
            this.app.set('locale', val);
        }
    },
    handleLocaleChange: function() {
        this.setValueFromLocale();
    },
    setValueInternal: function(value) {
        this._setValueInternal = true;
        this.set('value', value);
        this._setValueInternal = false;
    },
    setValueFromLocale: function() {
        this.setValueInternal(this.app.get('locale'));
    }
});