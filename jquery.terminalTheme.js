/* 
 * Copyright (C) 2014 Sergio Gómez
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.
 * 
 */

/*
 * @link    http://terminal.sergio.im Terminal Project
 * @author  Sergio Gómez
 */



var ErrorDispatcher = function() {
    this.error = {
        typeError: function(obj, type) {
            return "Object[" + obj.constructor + "] IS NOT :" + type + "";
        }
    };
    this.throw = function(e) {
        throw new Error(e);
    };
};
/**
 * Event Simulator Class whichs can make any subclass being able to listen or register events.
 * @returns {BarkEcho}
 */
var BarkEcho = function() {
    // Adds base class to this object
    this.prototype = new ErrorDispatcher();
    /**
     * Object containing the barks registered for listening.
     */
    this.barksRegistered = {};
    /**
     * This functions creates a listener for any bark dispatchers in an object with parent prototype BarkEcho
     * @param {String} bark Bark Name
     * @param {function} fn <i>(optional)</i>Callback function carring as parameter the <b><i>1. Bark Name, 2. Target Object, 3. Args from dispatch</i></b>.
     * @param {BarkEcho} bubbled <i>(optional)</i>The bark echo object to which this bark will be bubbled to.
     * @returns {undefined}
     */
    this.addBarkListener = function(bark, fn, bubbled) {
        if (!this.barksRegistered[bark]) {
            this.barksRegistered[bark] = [];
        }
        if (bubbled) {
            if (!this.barksRegistered[bark].buble instanceof BarkEcho) {
                this.errors.typeError(bubbled, "BarkEcho");
            }
        }
        this.barksRegistered[bark].push({callback: fn, buble: bubbled});
    };
    /**
     * Triggers the bark
     * @param {type} bark Bark Name
     * @returns {undefined}
     */
    this.dispatchBark = function(bark, args) {
        if (this.barksRegistered[bark]) {
            if (this.barksRegistered[bark].fn) {
                this.barksRegistered[bark].fn(bark, this, args);
            }
            if (this.barksRegistered[bark].buble && this.barksRegistered[bark].buble instanceof BarkEcho) {
                this.barksRegistered[bark].buble.dispatchBark(bark, this.barksRegistered[bark].buble, args);
            }
        }
    };

};
var Dogger = function() {
    // Adds base class to this object
    this.prototype = new BarkEcho();
    /**
     * DOMObject that reflects this Javascript Object. 
     */
    this.dom = null;
    /**
     * Evaluates the type of this class by it's parameter
     * @param {String} sClass class name
     * @returns {Boolean}
     */
    this.is = function(sClass){
        return (this instanceof sClass);
    };
};

var JQTerminalGlobals = {
    /**
     * Set of rules that the terminal process will use to navigate the DOM and to respond to user.
     * @type Object
     */
    rules: {
        /**
         * This property sets if the terminal will be able to navigate into inner elements or just list all the renderable items directly.
         * @type Boolean
         */
        navigation: true,
        /**
         * Property name for which the terminal will look and list the navigatable elements, like a folder in a file system. Ex. "id", "class", "<something of your own>"
         * @type String
         */
        navigatable: "jqnav",
        /**
         * Property name for which the terminal will look and list the renderable elements, like files in a file system. Ex. "id", "class", "<something of your own>"
         * @type String
         */
        renderable: "jqrender",
        /**
         * Selector or Object that will be listening to keyboard typing events.
         * @type Object|String
         */
        target:body,
        /**
         * This match will determine that a command's option is about to be called"
         * @type RegExp
         */
        commandOption: /\-/,
        /**
         * This match will determine the limits between a command and/or an option. Default: "White space RegExp (/\s/ig) "
         * @type RegExp
         */
        separator: /\s/gi,
        /**
         * This match will be used for all commands as the request for command's help info"
         * @type RegExp
         */
        help: /\help|h/i

    },
    commands: {
        /**
         * Command that will call for render on the next string after the separator "Ex. open contactinfo"
         * @type Object|String|RegExp
         */
        render: {
            match: /open/i,
            help: "Displays the information from an available section",
            options: [
                {
                    match: /\*|all/i,
                    help: "Force the display of all the renderable objects within range"
                },
                {
                    match: /t/i,
                    help: "Displays the selected section as plain text"
                }
            ],
            overridenative:null
        },
        /**
         * Command that will call for navigation to the next string after the separator "Ex. cd aboutus"
         * @type Object|String|RegExp
         */
        navigateTo: {
            match: /cd/i,
            help: "Navigates to the selected available category"
        },
        /**
         * Command that will call for render navigation back to parent "Ex. cd .."
         * @type Object|String|RegExp
         */
        navigateBack: /cd[\s|]\.\./i,
        /**
         * Command that will show the list of navigationable objects and renderable objects
         * @type Object|String|RegExp
         */
        showlist: {
            match: /ls/i,
            help: "Shows the list of current available categories for navigation or sections for opening them"
        },
        /**
         * This object contains a list of properties corresponding to any custom command. 
         * This object should be named with the string command and should also contain properties:<ul>
         * <li>fn {function} The function that will return the commnad's response. This functions recieves as argument the Array of options typed by the user.
         * <li>help {String} (Optional) The help string that will show upong asking for help about this command.
         * 
         * @type Object
         */
        custom: {
            "showanswer": {
                fn: function(opt) {
                    if (opt[0] && (/\*|all/i.test(opt[0].option) || /life|universe|everything/i.test(opt[0].value))) {
                        return "42";
                    }
                    return "Answer to what?";
                },
                help: "Use for the ultimate question..."
            }
        }
    },
    messages:{
        commandNotfound:"Command \"[c]\" Not Found",
        welcomeMessage:"Welcome to mi site",
        notnavigational:"[p] is not navigational. Try open",
        notrenderable:"[p] cannot be displayed. Try cd"
    },
    graphics: {
        username: null,
        terminalPrefix: "$>",
        backgroundColor: "rgba(0,0,0,0.7)",
        foregroundColor: "#fff",
        navigatableColor: null,
        renderableColor: "#42ca54",
        customColor: function(element) {
            return "#fff";
        },
        modal: false,
        fullsize: false
    },
    classes: {
        typer: "jqt_typer",
        recordedline: "jqt_recorded"
    }

};

var JQTBarks = {
    EXECUTE: "command_execute",
    COMMAND_NOT_FOUND: "command_not_found",
    NAV_SUGGEST:"navigation_suggest"

};

var JQTCommand = function(string, configs) {
    // Base class association
    this.prototype = new Dogger();
    //Unique properties
    this.commandsArray = null;
    this.command = null;
    this.notfound = false;
    this.options = [];

    this.text = string;
    this.configs = configs;


    this.init = function() {
        if (this.configs.rules.separator) {
            this.commandsArray = this.text ? this.text.split(this.configs.rules.separator) : null;
        }
        this.command = this.processCommandRequest();
        if (!this.notfound) {
            this.processOption(this.commandsArray,1,this.options);
        }

    };
    this.processCommandRequest = function() {
        if (this.commandsArray[0]) {
            for (var i in this.configs.rules.commands) {
                if (this.configs.rules.commands[i] instanceof RegExp) {
                    if (this.configs.rules.commands[i].test(this.commandsArray[0])) {
                        return i;
                    }
                } else if (this.configs.rules.commands[i] instanceof String) {
                    if (this.commandsArray[0] === this.configs.rules.commands[i]) {
                        return i;
                    }
                } else if (this.configs.rules.commands[i].match) {
                    if (this.configs.rules.commands[i].match instanceof RegExp) {
                        if (this.configs.rules.commands[i].match.test(this.commandsArray[0])) {
                            return i;
                        }
                    } else if (this.configs.rules.commands[i].match instanceof String) {
                        if (this.commandsArray[0] === this.configs.rules.commands[i].match) {
                            return i;
                        }
                    }
                }
            }
        }
        this.dispatchBark(JQTBarks.COMMAND_NOT_FOUND, this.commandsArray[0]);
        this.notfound = true;
        return this.commandsArray[0];
    };
    this.processOption = function(array, index, opt) {
        var current = null;
        if (this.commandsArray[index]) {
            var nextIndex = index+1;
            var next = this.processOption(array,nextIndex,opt);
            if (this.configs.rules.commandOption.match(this.commandsArray[index][0])) {
                current = {option: this.commandsArray[index].substr(1, this.commandsArray[index].length), values:null};
                opt.push(current);
                if(next){
                    if(next instanceof Object){
                        opt.push(next);
                    }else if(next instanceof String){
                        current.values = next.split(/\s/gi);
                    }
                }
            }
            else {
                current = this.commandsArray[index].substr(index, this.commandsArray[index].length);
                if (next) {
                    if (next instanceof String) {
                        current + " " + next;
                    }
                }
            }

        }
        return current;

    };
    this.init();
};


var JQTerminalClass = function(options) {
    // Adds base class to this object
    this.prototype = new Dogger();
    /**
     * Last typed command called for execution.
     */
    this.lastCommand = null;
    /**
     * Application options
     */
    this.options = $.extend(JQTerminalGlobals, options);

};

var JQTerminalTyper = function(options) {
    // Adds base class to this object
    this.prototype = new JQTerminalClass(options);
    // Commnad backlog
    this.backlog = [];
    // Current Commnad
    this.command = null;
    // Pointer
    this.pointer = null;

    this.init = function() {
        this.dom = this.createTyperDom();
        this.pointer = new JQTPointer();
        
        // TODO 31072014
    };
    this.createTyperDom = function() {
        return this.setTyperEvents($(document.createElement('div')).addClass(JQTerminalGlobals.classes.typer));
    };
    this.setTyperEvents = function() {
        var me = this;
        $(this.options.rules.target).on('keydown' ,function(e){
            switch(e.which){
                // Enter
                case 13:
                    me.execute();
                    break;
                // Tab
                case 9:
                    me.suggestNavigation();
                    break;
                // Backspace
                case 8:
                    me.clear(1);
                    break;
                // Backlog back
                case 38:
                    me.lookBacklog(-1);
                    break;
                    // Backlog forward
                case 40:
                    me.lookBacklog(1);
                    break;
                // Backlog back
                case 37:
                    me.movePointer(-1);
                    break;
                    // Backlog back
                case 39:
                    me.movePointer(1);
                    break;
            }
        });
    };
    this.suggestNavigation = function(){
        this.dispatch(JQTBarks.NAV_SUGGEST,this.command);
    };
    this.write = function(char) {
        if (char) {
            this.command += char;
        }
        return this.command;
    };
    this.clear = function(range) {
        if (range !== null) {
            this.command = this.command.substr(0, this.command.length - range);
        } else {
            this.command = "";
        }
        return this.command;
    };
    this.recordline = function(lineString) {
        var r = $(document.createElement('div')).addClass(JQTerminalGlobals.classes.recordedline);
        r.text(lineString);
        return r;
    };
    this.execute = function() {
        this.lastCommand = new JQTCommand(this.command, this.options);
        this.lastCommand.addBarkListener(JQTBarks.COMMAND_NOT_FOUND, null, this);
        this.backlog.push(this.lastCommand);
        this.clear();

        return this.lastCommand;

    };
    //Class init call.
    this.init();
};

var JQTerminalReader = function(options) {
    // Adds base class to this object
    this.prototype = new JQTerminalClass(options);

};


var JQueryTerminalTheme = function(options) {
    // Adds base class to this object
    this.prototype = new JQTerminalClass(options);
    this.dom = this.options.dom;
    this.reader = new JQTerminalReader(this.options);
    this.typer = new JQTerminalTyper();
};



if($||JQuery){
    ($||JQuery).fn.terminalTheme = function(options){
        if(options){
            options.dom = this;
            return this.terminalThemeObject = new JQueryTerminalTheme(options);
        }
        if(!options){
            return this.terminalThemeObject;
        }
    };
}else{
    throw "JQuery needed to run jquery.terminal.js";
}


