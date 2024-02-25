var kind = require('enyo/kind');
var Button = require('enyo/Button');
var Anchor = require('enyo/Anchor');
var utils = require('enyo/utils');
var Dialog = require('./Dialog');
var LinkBuilder = require('../Link/LinkBuilder');
var i18n = require('../Locale/i18nContent');
var EditDialog = require('./BookmarkEdit');

// If the global enyo.Signals is available, use it. This is needed to allow 
// bi-directional communitation with Apps of older Enyo versions
var Signal = require('enyo/Signals');
var Signal = (enyo && enyo.Signals) ? enyo.Signals : Signal;

module.exports = kind({
    name: 'BookmarksDialog',
    kind: Dialog,
    maxWidth: '400px',
    height: '300px',
    classes: 'help_dialog history_dialog',
    
    titleComponents: [
        {classes: 'header', components: [
            {kind: i18n, classes: 'bss_dialog_title', content: 'Bookmarks'}
        ]}
    ],

    bodyComponents: [
        {classes: 'bss_history_list', name: 'ListContainer'}
    ],

    buttonComponents: [
        {name: 'Add', kind: Button, ontap: 'add', components: [
            {kind: i18n, content: 'Add'},
        ]},
        {tag: 'span', classes: 'spacer'},
        {name: 'Clear', kind: Button, ontap: 'clear', components: [
            {kind: i18n, content: 'Clear'},
        ]},
        {tag: 'span', classes: 'spacer'},
        {name: 'Close', kind: Button, ontap: 'close', components: [
            {kind: i18n, content: 'Close'},
        ]}
    ],

    handlers: {
        onLocaleChange: 'localeChanged',
        onEditBookmark: 'handleEditBookmark'
    },

    create: function() {
        if(this.multiColumn) {
            this.width = '1200px';
        }

        this.inherited(arguments);
        this.populateList();
        this.createComponent({
            name: 'EditDialog',
            kind: EditDialog,
            showing: false
        });

        this.log('localstor', localStorage.getItem('BibleSuperSearchBookmarks'));
    },

    close: function() {
        this.app.setDialogShowing('BookmarkDialog', false);
    },
    showingChanged: function(was, is) {
        this.inherited(arguments);

        if(is) {
            this.populateList(); // redraww the list because the URLs have changed
            this.$.ListContainer.render();
            this.processDimensions();
        }
    },
    add: function(inSender, inEvent) {
        this.$.EditDialog.openNew();
    },
    edit: function(inSender, inEvent) {
        this.log('pk', inSender.get('pk'));
        this.$.EditDialog.openEdit(inSender.get('pk'));

        this.app.bookmarks.list();
    },
    delete: function(inSender, inEvent) {

    },
    populateList: function() {
        this.$.ListContainer.destroyClientControls();

        this.app.bookmarks.forEach(function(item) {
            var content = item.get('title') || '(no title?)',
                title = item.get('pageTitle'),
                lim = 60;

            if(content.length > lim) {
                content = content.substring(0, lim) + ' ...';
            }

            this.$.ListContainer.createComponent({
                owner: this,
                classes: 'bss_list_item bss_history_item', components: [
                    {classes: 'verses', components: [
                        {
                            kind: Anchor, 
                            href: item.get('link'), 
                            content: content,
                            title: title, 
                            pk: item.get('pk'),
                            ontap: 'handleBookmarkTap',
                            style: 'float: left',
                        }, 
                        // {
                        //     // kind: Anchor, 
                        //     kind: i18n,
                        //     tag: 'a',
                        //     attributes: {
                        //         href: 'JavaScript:void(0)',
                        //     },
                        //     style: 'float: right',
                        //     content: 'Edit',
                        //     pk: item.get('pk'),
                        //     ontap: 'edit'
                        // },
                        {
                            kind: i18n,
                            ontap: 'edit',
                            style: 'float: right',
                            attributes: {title: 'Edit'},
                            pk: item.get('pk'),
                            components: [
                                {tag: 'span', classes: 'material-icons icon', content: 'edit'}
                            ],
                        },                        
                        {
                            kind: i18n,
                            ontap: 'move',
                            style: 'float: right',
                            attributes: {title: 'Move'},
                            pk: item.get('pk'),
                            components: [
                                {tag: 'span', classes: 'material-icons icon', content: 'edit_location'}
                            ],
                        },                        
                        {
                            kind: i18n,
                            ontap: 'delete',
                            style: 'float: right',
                            attributes: {title: 'Delete'},
                            pk: item.get('pk'),
                            components: [
                                {tag: 'span', classes: 'material-icons icon', content: 'delete'}
                            ],
                        },
                        {classes: 'clear-both'}
                    ]},
                ]
            });
        }, this);

        var count = this.$.ListContainer.getClientControls().length;

        while(count < 7) {
            this.$.ListContainer.createComponent({
                owner: this,
                content: '&nbsp;',
                allowHtml: true,
                classes: 'bss_list_item bss_history_item'
            });

            count ++;
        }
    },
    handleBookmarkTap: function(inSender, inEvent) {
        this.app.bookmarks.setCurrent(inSender.get('pk'));
        this.close();
    },
    handleEditBookmark: function(inSender, inEvent) {
        this.refreshList();
    },
    localeChanged: function(inSender, inEvent) {
        this.refreshList();
    },
    refreshList: function() {
        this.populateList();
        this.render();
    },
    move: function(inSender, inEvent) {
        this.app.alert('This feature hasn\'t been built yet');
    },
    delete: function(inSender, inEvent) {
        var t = this;
            model = this.app.bookmarks.findByPk( inSender.get('pk') ),
            msg = this.app.t('Are you sure you want to delete');

        this.app.confirm(msg + ': ' + model.get('title'), function(confirm) {
            if(confirm) {
                t.app.bookmarks.remove(model);
                t.app.bookmarks.commit();
                t.refreshList();
            } 
        });
    },
    clear: function() {
        var t = this,
            msg = this.app.t('Are you sure?') + ' ' +
                this.app.t('This will delete all bookmarks.');

        this.app.confirm(msg, function(confirm) {
            if(confirm) {
                t.app.bookmarks.empty();
                t.app.bookmarks.commit();
                t.refreshList();
            }
        });
    },
    populate: function() {
        this.app.copyHistoryToBookmarks();
        this.refreshList();
    }
});
