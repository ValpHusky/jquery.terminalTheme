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
    //constructor
};
ErrorDispatcher.prototype.error = {
    typeError: function(obj, type) {
        return "Object[" + obj.constructor + "] IS NOT :" + type + "";
    }
};
ErrorDispatcher.prototype.throw = function(e) {
    throw new Error(e);
};
/**
 * Event Simulator Class whichs can make any subclass being able to listen or register events.
 * @returns {BarkEcho}
 */
var BarkEcho = function() {
    //Constructor

};
// Adds base class to this object
BarkEcho.prototype = new ErrorDispatcher();
/**
 * Object containing the barks registered for listening.
 */
BarkEcho.prototype.barksRegistered = {};
/**
 * This functions creates a listener for any bark dispatchers in an object with parent prototype BarkEcho
 * @param {String} bark Bark Name
 * @param {function} fn <i>(optional)</i>Callback function carring as parameter the <b><i>1. Bark Name, 2. Target Object, 3. Args from dispatch</i></b>.
 * @param {BarkEcho} bubbled <i>(optional)</i>The bark echo object to which this bark will be bubbled to.
 * @returns {undefined}
 */
BarkEcho.prototype.addBarkListener = function(bark, fn, bubbled) {
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
 * @param {String} bark Bark Name
 * @param {Mixed} args custom argument returned by bark dispatch.
 * @returns {undefined}
 */
BarkEcho.prototype.dispatchBark = function(bark, args) {
    if (this.barksRegistered[bark]) {
        if (this.barksRegistered[bark].fn) {
            this.barksRegistered[bark].fn(bark, this, args);
        }
        if (this.barksRegistered[bark].buble && this.barksRegistered[bark].buble instanceof BarkEcho) {
            this.barksRegistered[bark].buble.dispatchBark(bark, this.barksRegistered[bark].buble, args);
        }
    }
};



/**
 * DOGGER CLASS
 * @returns {Dogger}
 */
var Dogger = function() {
    //Constructor
};
// Adds base class to this object
Dogger.prototype = new BarkEcho();
/**
 * DOMObject that reflects this Javascript Object. 
 */
Dogger.prototype.dom = null;
/**
 * Evaluates the type of this class by it's parameter
 * @param {String} sClass class name
 * @returns {Boolean}
 */
Dogger.prototype.is = function(sClass) {
    return (this instanceof sClass);
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
        target: "body",
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
            overridenative: null
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
    messages: {
        commandNotfound: "Command \"[c]\" Not Found",
        welcomeMessage: "Welcome to mi site",
        notnavigational: "[p] is not navigational. Try open",
        notrenderable: "[p] cannot be displayed. Try cd"
    },
    graphics: {
        username: "root",
        terminalPrefix: "$>",
        backgroundColor: "rgba(0,0,0,0.7)",
        foregroundColor: "#fff",
        navigatableColor: null,
        renderableColor: "#42ca54",
        pointerSize: "5px",
        pointerColor: "#fff",
        pointerBlinkInterval: "500",
        width:"1200px",
        height:"400px",
        fontsize:"12px",
        customColor: function(element) {
            return "#fff";
        },
        modal: false,
        fullsize: false
    },
    classes: {
        typer: "jqt_typer",
        recordedline: "jqt_recorded",
        prepointer: "jqt_prepointer",
        postpointer: "jqt_postpointer",
        prefix:"jqt_prefix"
    }

};

var JQTBarks = {
    EXECUTE: "command_execute",
    COMMAND_NOT_FOUND: "command_not_found",
    NAV_SUGGEST: "navigation_suggest"

};

var JQTCommand = function(string, configs) {
    //Unique properties
    this.commandsArray = null;
    this.command = null;
    this.notfound = false;
    this.options = [];

    this.text = string;
    this.configs = configs;

    if (this.configs.rules.separator) {
        this.commandsArray = this.text ? this.text.split(this.configs.rules.separator) : null;
    }
    this.command = this.processCommandRequest();
    if (!this.notfound) {
        this.processOption(this.commandsArray, 1, this.options);
    }
};
// Base class association
JQTCommand.prototype = new Dogger();

JQTCommand.prototype.processCommandRequest = function() {
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
JQTCommand.prototype.processOption = function(array, index, opt) {
    var current = null;
    if (this.commandsArray[index]) {
        var nextIndex = index + 1;
        var next = this.processOption(array, nextIndex, opt);
        if (this.configs.rules.commandOption.match(this.commandsArray[index][0])) {
            current = {option: this.commandsArray[index].substr(1, this.commandsArray[index].length), values: null};
            opt.push(current);
            if (next) {
                if (next instanceof Object) {
                    opt.push(next);
                } else if (next instanceof String) {
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

var JQTPointer = function(options) {
    //Unique properties.
    this.options = options;
    this.position = 0;
    this.interval = null;
    this.state = true;
    this.createDOM();
    this.initIntervals();
};
// Adds base class to this object
JQTPointer.prototype = new Dogger();


JQTPointer.prototype.createDOM = function() {
    this.dom = $(document.createElement('span'));
    this.dom.css("padding-left", this.options.graphics.pointerSize);
    this.dom.css("background-color", this.options.graphics.pointerColor);
    this.dom.css("height", this.options.graphics.fontsize);
};
JQTPointer.prototype.initIntervals = function() {
    var me = this;
    if (this.options.graphics.pointerBlinkInterval) {
        if (this.interval) {
            clearInterval(this.interval);
        }
        this.interval = setInterval(function() {
            if(me.state){
                me.state = false;
                me.dom.css("background-color", "transparent");
            }else{
                me.state = true;
                me.dom.css("background-color", me.options.graphics.pointerColor);
            }
        }, parseInt(this.options.graphics.pointerBlinkInterval));
    }

};


var JQTerminalClass = function(options) {
};
// Adds base class to this object
JQTerminalClass.prototype = new Dogger();
/**
 * Last typed command called for execution.
 */
JQTerminalClass.prototype.lastCommand = null;
/**
 * Sets the aplication options on all objects childs.
 * @param {Object} options
 * @returns {undefined}
 */
JQTerminalClass.prototype.setOptions = function(options) {
    this.options = $.extend(JQTerminalGlobals, options);
};

var JQTerminalTyper = function(options) {

    // Commnad backlog
    this.backlog = [];
    // Current Commnad
    this.command = null;
    // Pointer
    this.pointer = null;
    // Text Pre-pointer
    this.prePointer = "";
    // Text Post-pointer
    this.postPointer = "";
    //Options
    this.setOptions(options);


    //Class init call.
    this.dom = this.createTyperDom();
    this.pointer = new JQTPointer(this.options);
    
    this.prefixText = this.createPrefix();
    
    this.prePointer = $(document.createElement("span")).addClass(JQTerminalGlobals.classes.prepointer);
    this.postPointer = $(document.createElement("span")).addClass(JQTerminalGlobals.classes.postpointer);
    this.prefix = $(document.createElement("span")).addClass(JQTerminalGlobals.classes.prefix);
    this.prefix.text(this.prefixText);
    
    this.dom.append(this.prefix);
    this.dom.append(this.prePointer);
    this.dom.append(this.pointer.dom);
    this.dom.append(this.postPointer);
};
// Adds base class to this object
JQTerminalTyper.prototype = new JQTerminalClass();

JQTerminalTyper.prototype.createPrefix = function(){
    return this.options.graphics.username + this.options.graphics.terminalPrefix;
};

JQTerminalTyper.prototype.createTyperDom = function() {
    return this.setTyperEvents($(document.createElement('div')).addClass(JQTerminalGlobals.classes.typer));
};
JQTerminalTyper.prototype.setTyperEvents = function(dom) {
    var me = this;
    $(this.options.rules.target).on('keydown', function(e) {
        switch (e.which) {
            // Enter
            case 13:
                console.log(me.execute());
                break;
                // Tab
            case 9:
                console.log(me.suggestNavigation());
                break;
                // Backspace
            case 8:
                console.log(me.clear(1));
                break;
                // Backlog back
            case 38:
                console.log(me.lookBacklog(-1));
                break;
                // Backlog forward
            case 40:
                console.log(me.lookBacklog(1));
                break;
                // Backlog back
            case 37:
                console.log(me.movePointer(-1));
                break;
                // Backlog back
            case 39:
                console.log(me.movePointer(1));
                break;
            default:
                console.log(me.write(String.fromCharCode(e.which)));
                break;
        }
    });
    return dom;
};
JQTerminalTyper.prototype.lookBacklog = function(direction) {
    var b = this.backlogState + direction;
    if (this.backlog[b]) {
        this.setCommand(this.backlog[b]);
        this.backlogState = b;
    }

};
JQTerminalTyper.prototype.movePointer = function(direction) {
    var p = this.pointer.position + direction;
    if (this.command[p]) {
        this.pointer.position = p;
        this.renderText();
    }
};
JQTerminalTyper.prototype.setCommand = function(command) {
    this.clear();
    this.write(command);
};
JQTerminalTyper.prototype.suggestNavigation = function() {
    this.dispatch(JQTBarks.NAV_SUGGEST, this.command);
};
JQTerminalTyper.prototype.write = function(char) {
    if (char) {
        this.command += char;
    }
    this.pointer.position++;
    this.renderText();
    return this.command;
};
JQTerminalTyper.prototype.renderText = function() {
    var pretext = this.command.substr(0, this.pointer.position);
    var posttext = this.command.substr(this.pointer.position, this.command.length);
    this.prePointer.text(pretext);
    this.postPointer.text(posttext);
};
JQTerminalTyper.prototype.clear = function(range) {
    if (range !== null) {
        this.command = this.command.substr(0, this.command.length - range);
        this.prePointer.text(this.command);
    } else {
        this.resetTyper();
    }

    return this.command;
};
JQTerminalTyper.prototype.resetTyper = function() {
    this.command = "";
    this.prePointer.text("");
    this.postPointer.text("");
    this.pointer.position = 0;
};
JQTerminalTyper.prototype.recordline = function(lineString) {
    var r = $(document.createElement('div')).addClass(JQTerminalGlobals.classes.recordedline);
    r.text(lineString);
    return r;
};
JQTerminalTyper.prototype.execute = function() {
    this.lastCommand = new JQTCommand(this.command, this.options);
    this.lastCommand.addBarkListener(JQTBarks.COMMAND_NOT_FOUND, null, this);
    this.backlog.push(this.command);
    this.clear();

    return this.lastCommand;

};

var JQTerminalReader = function(options) {
    this.setOptions(options);
};
// Adds base class to this object
JQTerminalReader.prototype = new JQTerminalClass();


var JQueryTerminalTheme = function(options) {
    this.setOptions(options);
    // Unique properties
    this.dom = this.options.dom;
    this.reader = new JQTerminalReader(this.options);
    this.typer = new JQTerminalTyper();

    this.dom.append(this.typer.dom);
    this.buildCSS();
};

// Adds base class to this object
JQueryTerminalTheme.prototype = new JQTerminalClass();

JQueryTerminalTheme.prototype.buildCSS = function(){
    this.dom.css("background-color",this.options.graphics.backgroundColor);
    this.dom.css("color",this.options.graphics.foregroundColor);
};




if ($ || JQuery) {
    ($ || JQuery).fn.terminalTheme = function(options) {
        if (!options) {
            options = {};
        }
        if (!this.terminalThemeObject) {
            options.dom = this;
            this.terminalThemeObject = new JQueryTerminalTheme(options);
        }
        return this.terminalThemeObject;


    };
} else {
    throw "JQuery needed to run jquery.terminal.js";
}


