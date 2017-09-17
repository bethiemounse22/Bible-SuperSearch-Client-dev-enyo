var kind = require('enyo/kind');
//var Button = require('enyo/Button');
var Application = require('enyo/Application');
var options = require('enyo/options');
var Ajax = require('enyo/Ajax');
var defaultConfig = require('./config/default');
var buildConfig = require('./config/build');
var systemConfig = require('./config/system');
var utils = require('enyo/utils');
var DefaultInterface = require('./view/interfaces/twentytwenty/TwentyTwenty');
var Interfaces = require('./view/Interfaces');

//var MainView = require('./view/Content');

// If the global enyo.Signals is available, use it. This is needed to allow 
// bi-directional communitation with Apps of older Enyo versions
var Signal = require('enyo/Signals');
var Signal = (enyo && enyo.Signals) ? enyo.Signals : Signal;

var App = Application.kind({
    name: 'BibleSuperSearch',

    view: DefaultInterface,
    //renderTarget: 'biblesupersearch_container',
    configs: {},
    build: {},
    system: {},
    renderOnStart: false, // We need to load configs first
    rootDir: null,
    testing: false, // Indicates unit tests are running
    statics: {},
    maximumBiblesDisplayed: 8, // This holds the absolute maximum number of parallel bibles that can be possibly displayed
    bibleDisplayLimit: 8, // Maximum number of paralell Bibles that can be displayed, calculated based on screen size
    resetView: true,

    create: function() {
        this.inherited(arguments);
        this.log('defaultConfig', defaultConfig);
        this.configs = defaultConfig;
        this.build = buildConfig;
        this.system = systemConfig;
        this.rootDir = (typeof biblesupersearch_root_directory == 'string') ? biblesupersearch_root_directory : '/biblesupersearch';

        // If user provided a config path, use it.
        var config_path = (typeof biblesupersearch_config_path == 'string') ? biblesupersearch_config_path + '/config.json' : this.rootDir + '/config.json';

        if(this.build.dynamicConfig == true) {
            config_path = this.build.dynamicConfigUrl;
        }

        var loader = new Ajax({
            url: config_path,
            method: 'GET'
        });

        loader.go(); // for GET
        loader.response(this, 'handleConfigLoad');
        loader.error(this, 'handleConfigError');
    },
    handleConfigError: function() {
        alert('Error: Failed to load application config data.  Error code 1');
        this.handleConfigFinal();
    },
    handleConfigLoad: function(inSender, inResponse) {
        utils.mixin(this.configs, inResponse);
        this.log('configs - loaded', utils.clone(this.configs));
        this.handleConfigFinal();
    },
    handleConfigFinal: function() {
        if(this.configs.target) {
            this.renderTarget = this.configs.target;
        }

        // this.render();
        this.log(this.configs);
        var view = null;

        if(this.configs.interface) {
            this.log('Interface ', this.configs.interface);

            if(Interfaces[this.configs.interface]) {
                this.log('secondary view found');
                // this.set('view', Interfaces[this.configs.interface]);
                view = Interfaces[this.configs.interface];
            }
            else {
                this.log('Config error: interface \'' + this.configs.interface + '\' not found, using default interface');
            }
        }


        // Load Static Data (Bibles, Books, ect)
        var ajax = new Ajax({
            url: this.configs.apiUrl + '/statics',
            method: 'GET'
        });

        //this.$.LoadingDialog.setShowing(true);
        this.log('loading statics');
        ajax.go();
        ajax.response(this, function(inSender, inResponse) {
            //this.$.LoadingDialog.setShowing(false);
            this.log(inResponse);
            this.test();
            this.log('statics loaded');
            this.set('statics', inResponse.results);
            this.waterfall('onStaticsLoaded');

            if(view && view != null) {
                this.log('view set');
                this.set('view', view);
            }
            
            this.render();
        });    

        ajax.error(this, function(inSender, inResponse) {
            //this.$.LoadingDialog.setShowing(false);
            alert('Error: Failed to load application static data.  Error code 2');
        });    
    },
    /*  Used to run unit tests within app */
    test: function() {
        if(!this.testing || !QUnit) {
            return;
        }

        this.log();
        var t = this;

        //QUnit && QUnit.module("Basic Tests");

        QUnit.test( "Post Rendering", function( assert ) {
            assert.ok( t.viewReady, "The view should be rendered by the time we get here" );
        });

        // Test form stuff

        // Test AJAX calls
    }
});

module.exports = App;
