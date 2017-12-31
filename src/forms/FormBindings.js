module.exports = {
    whole_words: {from: 'formData.whole_words', to: '$.whole_words.checked', oneWay: false, transform: function(value, dir) {
        // this.log('whole_words', value, dir);

        // if(dir == 1) {
            return (value && value != 0 && value != false) ? true : false;
        // }
        // return value || null;
    }},        
    request: {from: 'formData.request', to: '$.request.value', oneWay: false, transform: function(value, dir) {
        // this.log('request', value, dir);
        return value || null;
    }},
    // reference binding MUST be before the shortcut binding!
    reference: {from: 'formData.reference', to: '$.reference.value', oneWay: false, transform: function(value, dir) {
        // this.log('reference', value, dir);
        // if(dir === 2) {
        //     if(value && value != '0' && value != '') {
        //         this.$.shortcut.set('selected', 1);
        //     }
        //     else {
        //         this.$.shortcut.set('selected', 0);
        //     }
        // }

        this._referenceChangeHelper(value || null);

        return value || null;
    }},
    shortcut: {from: 'formData.shortcut', to: '$.shortcut.value', oneWay: false, transform: function(value, dir) {
        // this.log('shortcut', value, dir);

        if(dir === 1) {
            if(value || value === 0) {
                this.$.shortcut.setSelectedByValue(value, 0);
            }
            else {
                this.$.shortcut.setSelected(0);
            }
        }
        else {
            if(value && value != '0' && value != '1') {
                this.$.reference.set('value', value);
            }
            else if (value != '1') {
                this.$.reference.set('value', null);
            }
            
            if(!value || value == '') {
                this.$.shortcut.setSelected(0); // Hack to prevent selector from showing 'blank'
            }
        }

        return value || null;
    }},           
    search_type: {from: 'formData.search_type', to: '$.search_type.value', oneWay: false, transform: function(value, dir) {
        // this.log('search_type', value, dir);
        if(dir == 1) {
            this.$.search_type.setSelectedByValue(value, 0);
        }

        return value || null;
    }},            
    proximity_limit: {from: 'formData.proximity_limit', to: '$.proximity_limit.value', oneWay: false, transform: function(value, dir) {
        // this.log('proximity_limit', value, dir);
        if(dir == 1) {
            this.$.proximity_limit.setSelectedByValue(value, 0);
        }

        return value || null;
    }},        
    search: {from: 'formData.search', to: '$.search.value', oneWay: false, transform: function(value, dir) {
        // this.log('search', value, dir);
        return value || null;
    }},    
    search_all: {from: 'formData.search_all', to: '$.search_all.value', oneWay: false, transform: function(value, dir) {
        // this.log('search_all', value, dir);
        return value || null;
    }},    
    search_any: {from: 'formData.search_any', to: '$.search_any.value', oneWay: false, transform: function(value, dir) {
        // this.log('search_any', value, dir);
        return value || null;
    }},    
    search_one: {from: 'formData.search_one', to: '$.search_one.value', oneWay: false, transform: function(value, dir) {
        // this.log('search_one', value, dir);
        return value || null;
    }},    
    search_none: {from: 'formData.search_none', to: '$.search_none.value', oneWay: false, transform: function(value, dir) {
        // this.log('search_none', value, dir);
        return value || null;
    }},    
    search_phrase: {from: 'formData.search_phrase', to: '$.search_phrase.value', oneWay: false, transform: function(value, dir) {
        // this.log('search_phrase', value, dir);
        return value || null;
    }},
    bible: {from: 'formData.bible', to: '$.bible.value', oneWay: false, transform: function(value, dir) {
        // this.log('biblesel', value, dir);
        return value || null;
    }}
};
