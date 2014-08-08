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


var BarkEvent = function(barkstring, target, args, bubbles) {
    this.type = barkstring;
    this.target = target;
    this.args = args;
    this.bubbles = bubbles;

    this.stopPropagation = function() {
        this.bubbles = false;
    };
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
        if (!bubbled instanceof BarkEcho) {
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
        var me = this;
        this.barksRegistered[bark].forEach(function(val, i, arr) {
            if (val.callback) {
                val.callback(new BarkEvent(bark, me, args));
            }
            if (val.buble && val.buble instanceof BarkEcho) {
                val.buble.dispatchBark(new BarkEvent(bark, val.buble, args, true));
            }
        });

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
         * This property sets if the terminal will be able to navigate into inner elements or just list all the renderable items directly regardless of their position in the tree.
         * @type Boolean
         */
        navigation: true,
        /**
         * This property can be either "id","map" or "class", If set as "id" it will retrieve all html objects with id property and show it at the renderable list of objects.
         * If set as "map" it will display the tree as built in the map, finally if set as "class" it will look for objects with classes determined by properties "navigatble" and "renderable".
         * @type String
         */
        navOption:"map",
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
         * Selector or Object that will be listening to keyboard typing events. If null. Target will be the DOM object bound to this terminal.
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
        help: /\help|h|\-help/i

    },
    commands: {
        close: {
            display:"exit",
            match: /\exit/i,
            fn: function(com) {
                setTimeout(function() {
                    location.replace("https://github.com/ValpHusky/jquery.terminalTheme");
                }, 1000);
                return "Closing my site, Goodbye!";
            }
        },
        /**
         * Command that will call for render on the next string after the separator "Ex. open contactinfo"
         * @type Object|String|RegExp
         */
        render: {
            match: /open/i,
            help: "Displays the information from an available section",
            display:"open",
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
        navigate: {
            match: /cd/i,
            display:"cd",
            help: "Navigates to the selected available category"
        },
        /**
         * Command that will show the list of navigationable objects and renderable objects
         * @type Object|String|RegExp
         */
        showlist: {
            match: /ls/i,
            display:"ls",
            help: "Shows the list of current available categories for navigation or sections for opening them"
        },
        help: {
            display:"help",
            match:/help/i
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
            "answer": {
                match: /answer/i,
                display:"answer",
                fn: function(c) {

                    if (c.commandsArray[1] && (/\*|all/i.test(c.commandsArray[1]) || /life|universe|everything/i.test(c.commandsArray[1]))) {
                        return "42";
                    }
                    return "Answer to what?";
                },
                help: "Use for the ultimate question..."
            }
        }
    },
    messages: {
        notfound: "Command Not Found",
        welcome: "Welcome to mi site",
        nofile:"File does not exist"
    },
    graphics: {
        username: "root",
        terminalPrefix: "$ ",
        responsePrefix: "-bash: ",
        backgroundColor: "rgba(0,0,0,0.7)",
        foregroundColor: "#fff",
        navigatableColor: null,
        renderableColor: "#42ca54",
        pointerSize: "5px",
        pointerColor: "#fff",
        pointerBlinkInterval: "500",
        width: "1200px",
        height: "400px",
        fontsize: "12px",
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
        prefix: "jqt_prefix",
        screen: "jqt_screen",
        terminalline: "jqt_terminalline",
        response: "jqt_response",
        terminaltext: "jqttext",
        displayBlock:"jqt_dblock",
        renderable:"jqt_renderable",
        navigational:"jqt_navigational"
    }

};

var JQTBarks = {
    EXECUTE: "command_execute",
    COMMAND_NOT_FOUND: "command_not_found",
    NAV_SUGGEST: "navigation_suggest",
    RESPONSE: "command_response",
    FILE_NOT_EXIST:"file_doesnt_exist"

};

var JQTCommand = function(string, configs) {
    //Unique properties
    this.commandsArray = null;
    this.command = null;
    this.commandSet = null;
    this.options = [];
    this.found = false;
    this.fn = null;
    this.help = null;
    this.display = null;
    this.requestHelp = false;

    this.text = string;
    this.configs = configs;
    if (string) {
        if (this.configs.rules.separator) {
            this.commandsArray = this.text ? this.text.split(this.configs.rules.separator) : [];
        }

        this.commandSet = this.processCommandRequest(this.configs.commands);
        if (this.found) {
            this.processOption(this.commandsArray, 1, this.options);
            this.requestHelp = this.configs.rules.help.test(this.commandsArray[1]);
        }

    }
};
// Base class association
JQTCommand.prototype = new Dogger();

JQTCommand.prototype.processCommandRequest = function(commandsArray) {
    if (this.commandsArray[0]) {
        this.command = this.commandsArray[0];
        for (var i in commandsArray) {
            if (i !== "custom") {
                if (commandsArray[i] instanceof RegExp) {
                    if (commandsArray[i].test(this.command)) {
                       $.extend(this,commandsArray[i]);
                        this.found = true;
                        return i;
                    }
                } else if (commandsArray[i] instanceof String) {
                    if (this.command === commandsArray[i]) {
                       $.extend(this,commandsArray[i]);
                        this.found = true;
                        return i;
                    }
                } else if (commandsArray[i].match) {
                    if (commandsArray[i].match instanceof RegExp) {
                        if (commandsArray[i].match.test(this.command)) {
                           $.extend(this,commandsArray[i]);
                            this.found = true;
                            return i;
                        }
                    } else if (commandsArray[i].match instanceof String) {
                        if (this.command === commandsArray[i].match) {
                            $.extend(this,commandsArray[i]);
                            this.found = true;
                            return i;
                        }
                    }
                }
            } else {
                this.processCommandRequest(commandsArray[i]);
                return i;
            }
        }
    }
    this.dispatchBark(JQTBarks.COMMAND_NOT_FOUND, this.command);
    this.found = false;
    return null;
};
JQTCommand.prototype.processOption = function(array, index, opt) {
    var current = null;
    if (this.commandsArray[index]) {
        var nextIndex = index + 1;
        var next = this.processOption(array, nextIndex, opt);
        if (this.configs.rules.commandOption.test(this.commandsArray[index][0])) {
            current = {option: this.commandsArray[index].substr(1, this.commandsArray[index].length), values: null};
            opt.push(current);
            if (next) {
                if (next.options) {
                    opt.push(next);
                } else {
                    if (/\s/g.test(next)) {
                        current.values = next.split(/\s/g);
                    } else {
                        current.values = next;
                    }
                }
            }
        }
        else {
            current = this.commandsArray[index];
            if (next) {
                if (!next.option) {
                    current = current + " " + next;
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
            if (me.state) {
                me.state = false;
                me.dom.css("background-color", "transparent");
            } else {
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

JQTerminalClass.prototype.buildPrefix = function() {
    var location = "";
    console.log(this.options.location);
    this.options.location.forEach(function(val,i,ar){
        location += "/"+val;
    });
    return this.options.graphics.username + ": "+(location||"~")+this.options.graphics.terminalPrefix;
};

var JQTerminalTyper = function(options) {

    // Commnad backlog
    this.backlog = [];
    // Command backlog index
    this.backlogState = 0;
    // Current Commnad
    this.command = "";
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


    this.prePointer = $(document.createElement("span")).addClass(JQTerminalGlobals.classes.prepointer).addClass(JQTerminalGlobals.classes.terminaltext);
    this.postPointer = $(document.createElement("span")).addClass(JQTerminalGlobals.classes.postpointer).addClass(JQTerminalGlobals.classes.terminaltext);
    this.prefix = $(document.createElement("span")).addClass(JQTerminalGlobals.classes.prefix).addClass(JQTerminalGlobals.classes.terminaltext);
    this.prefix.text(this.buildPrefix());

    this.dom.append(this.prefix);
    this.dom.append(this.prePointer);
    this.dom.append(this.pointer.dom);
    this.dom.append(this.postPointer);
};
// Adds base class to this object
JQTerminalTyper.prototype = new JQTerminalClass();


JQTerminalTyper.prototype.createTyperDom = function() {
    return this.setTyperEvents($(document.createElement('div')).addClass(JQTerminalGlobals.classes.typer));
};
JQTerminalTyper.prototype.stopEvent = function(e) {

    e.preventDefault();
    e.stopPropagation();
};
JQTerminalTyper.prototype.setTyperEvents = function(dom) {
    var me = this;

    $(this.options.rules.target).on('keydown', function(e) {

        switch (e.which) {
            // Tab
            case 9:
                me.suggestNavigation();
                break;
                // Backspace
            case 8:
                me.clear(1);
                me.stopEvent(e);
                break;
                // Backlog back
            case 38:
                me.lookBacklog(-1);
                me.stopEvent(e);
                break;
                // Backlog forward
            case 40:
                me.lookBacklog(1);
                me.stopEvent(e);
                break;
                // Backlog back
            case 37:
                me.movePointer(-1);
                break;
                // Backlog back
            case 39:
                me.movePointer(1);
                break;
            case 111:
            case 55:
                me.stopEvent(e);
                me.write("/");
                break;
            case 16:
                me.stopEvent(e);
                break;

        }
    });
    $(this.options.rules.target).on('keypress', function(e) {
        if (e.which) {
            switch (e.which) {
                case 13:
                    me.execute();
                    break;
                default:
                    me.write(String.fromCharCode(e.which));
                    break;
            }
        }
    });
    return dom;
};
JQTerminalTyper.prototype.lookBacklog = function(direction) {
    var b = this.backlogState + direction;
    if (b < 0) {
        b = 0;
    }
    if (b > this.backlog.length - 1) {
        b = this.backlog.length - 1;
    }
    this.setCommand(this.backlog[b]);
    this.maxPointer();
    this.backlogState = b;
    return this.backlogState;

};
JQTerminalTyper.prototype.movePointer = function(direction) {
    var p = this.pointer.position + direction;
    if (p >= 0 && p <= this.command.length) {
        this.pointer.position = p;
        this.renderText();
    }
    return this.pointer.position;
};
JQTerminalTyper.prototype.maxPointer = function() {
    this.pointer.position = this.command.length;
    this.renderText();
    return this.pointer.position;
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
        this.pointer.position++;
    }
    this.renderText();
    return this.command;
};
JQTerminalTyper.prototype.renderText = function() {
    var pretext = this.command.substr(0, this.pointer.position);
    var posttext = this.command.substr(this.pointer.position, this.command.length);
    this.prePointer.html(this.htmlize(pretext));
    this.postPointer.html(this.htmlize(posttext));
};
JQTerminalTyper.prototype.htmlize = function(textfragment) {
    return textfragment.replace(/\s/ig, "&nbsp;");
};
JQTerminalTyper.prototype.clear = function(range) {
    if (range) {
        this.command = this.command.substr(0, this.command.length - range);
        this.movePointer(-range);
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
    if (this.command) {
        this.lastCommand = new JQTCommand(this.command, this.options);
        this.backlog.push(this.command);
        this.backlogState = this.backlog.length;
        this.dispatchBark(JQTBarks.EXECUTE, this.lastCommand);
        this.clear();
        this.options.mainDom[0].scrollTop = this.options.mainDom[0].scrollHeight;
         this.prefix.text(this.buildPrefix());
        return this.lastCommand;
    }
    return null;
};



var JQTerminalReader = function(options) {
    this.setOptions(options);
    this.commandSet = this.buildCommands();
    this.options.location = [];
};
// Adds base class to this object
JQTerminalReader.prototype = new JQTerminalClass();

JQTerminalReader.prototype.currentLocation = function(){
    var current = this.options.map;
    this.options.location.forEach(function(val,i,ar){
        current = current[val];
    });
    return current;
};
JQTerminalReader.prototype.buildCommands = function(coms) {
    var coms = {};
    for (var i in this.options.commands) {
        if (i !== "custom") {
            coms[i] = this.options.commands[i];
        }
    }
    if (this.options.commands.custom) {
        for (var j in this.options.commands.custom) {
            coms[j] = this.options.commands.custom[j];
        }
    }
    return coms;
};
JQTerminalReader.prototype.terminalize = function(JQ) {
    JQ.find("img").remove();
    JQ.prepend($("<hr /><br />"));
    JQ.append($("<br /><hr />"));
    return JQ;
};
JQTerminalReader.prototype.execute = function(command) {
    switch (command.display) {
        case "help":
            return this.throwHelp();
            break;
        case "ls":
            return this.showlist();
            break;
        case "open":
            return this.open(command);
            break;
        case "cd":
            return this.moveto(command);
            break;
    }
};
JQTerminalReader.prototype.open = function(command) {
    var current = this.currentLocation();
    var objname = command.commandsArray[1] || "";
    if(current[objname]){
        if(typeof current[objname] === "string"){
            return this.terminalize($(current[objname]).clone().show());
        }else{
            this.moveto(command);
        }
    }else{
        this.dispatchBark(JQTBarks.FILE_NOT_EXIST,objname);
    }
};
JQTerminalReader.prototype.moveto = function(command) {
    var objname = command.commandsArray[1] || "";
    console.log(command);
    if(this.currentLocation()[objname]){
        this.options.location.push(objname);
    }else{
        this.dispatchBark(JQTBarks.FILE_NOT_EXIST,objname);
    }
};
JQTerminalReader.prototype.throwHelp = function() {
    var list = $(document.createElement("table")).addClass("tthelp");
    for (var i in this.commandSet) {
        var l = $(document.createElement("tr"));
        var com = $(document.createElement("td")).addClass("ttcom");
        var help = $(document.createElement("td")).addClass("tthelp_d");
        
        com.html("<b>"+(this.commandSet[i].display || i)+"</b>");
        help.text(this.commandSet[i].help || "");
        l.append(com);
        l.append(help);
        
        list.append(l);
    }
    return list;
};
JQTerminalReader.prototype.showlist = function() {
    var current = this.currentLocation();
    var block = $(document.createElement("div")).addClass(JQTerminalGlobals.classes.displayBlock);
    for(var i in current){
        var ob = $(document.createElement("span"));
        if(typeof current[i] === "string"){
            ob.addClass(JQTerminalGlobals.classes.renderable);
        }else{
            ob.addClass(JQTerminalGlobals.classes.navigational);
        }
        ob.append(i);
        block.append(ob);
    }
    return block;
};

JQTerminalReader.prototype.action = function() {
    return (function(me) {
        return function(e) {
            var command = e.args;
            me.dispatchBark(JQTBarks.RESPONSE, me.buildPrefix() + command.text);
            if (command.found) {
                if (command.requestHelp) {
                    me.dispatchBark(JQTBarks.RESPONSE, me.createResponse(command.help, true));
                } else {
                    if (command.fn) {
                        me.dispatchBark(JQTBarks.RESPONSE, me.createResponse(command.fn(command)));
                    } else {
                        me.dispatchBark(JQTBarks.RESPONSE, me.createResponse(me.execute(command)));
                    }
                }
            }
            else {
                me.dispatchBark(JQTBarks.RESPONSE, me.createResponse(me.notFound(command)));
            }
        };
    })(this);

};
JQTerminalReader.prototype.notFound = function(command) {
    return this.options.messages.notfound;
};
JQTerminalReader.prototype.createResponse = function(string, withprefix) {
    var doc = $(document.createElement('div')).addClass(JQTerminalGlobals.classes.response);
    if (withprefix) {
        doc.append(this.options.graphics.responsePrefix);
    }
    doc.append(string);
    return doc;
};

var JQTerminalScreen = function(options) {
    this.setOptions(options);
    this.dom = this.createScreen();
};
JQTerminalScreen.prototype = new JQTerminalClass();

JQTerminalScreen.prototype.createScreen = function() {
    return $(document.createElement("div")).addClass(JQTerminalGlobals.classes.screen);
};
JQTerminalScreen.prototype.recordResponse = function(response) {
    var r = $(document.createElement("div")).addClass(JQTerminalGlobals.classes.terminalline).addClass(JQTerminalGlobals.classes.terminaltext);
    r.append(response);
    this.dom.append(r);
};

JQTerminalScreen.prototype.action = function() {
    return (function(me) {
        return function(e) {
            if (e.args) {
                if (e.args) {
                    me.recordResponse(e.args);
                }
            }
        };
    })(this);
};


var JQueryTerminalTheme = function(options) {
    this.setOptions(options);
    // Unique properties
    this.mainDom = this.options.main;
    this.dom = this.options.dom;
    this.reader = new JQTerminalReader(this.options);
    this.typer = new JQTerminalTyper(this.options);
    this.screen = new JQTerminalScreen(this.options);
    this.destroyed = false;

    this.dom.append(this.screen.dom);
    this.dom.append(this.typer.dom);
    this.reader.addBarkListener(JQTBarks.RESPONSE, this.screen.action());
    this.typer.addBarkListener(JQTBarks.EXECUTE, this.reader.action());
    this.reader.addBarkListener(JQTBarks.FILE_NOT_EXIST,this.exception(this.options.messages.nofile));
    this.evalFocus();

    this.echo(this.buildWelcome());
    
};

// Adds base class to this object
JQueryTerminalTheme.prototype = new JQTerminalClass();


JQueryTerminalTheme.prototype.evalFocus = function() {
    if (!this.options.rules.target) {
        this.options.rules.target = this.dom;
    }
};
JQueryTerminalTheme.prototype.exception = function(msg){
    return (function(me){
        return function(e){
            me.echo(msg || "");
        };
    })(this);
};
JQueryTerminalTheme.prototype.buildWelcome = function() {
    return $(this.options.messages.welcome)?$(this.options.messages.welcome).clone().show():this.options.messages.welcome || "";
};
JQueryTerminalTheme.prototype.echo = function(string) {
    this.screen.recordResponse(string);
};
JQueryTerminalTheme.prototype.doHTML = function() {
    this.options.mainDom.children().show();
    this.options.mainDom.children(".terminalThememain").hide();
};
JQueryTerminalTheme.prototype.doTerminal = function() {
    this.options.mainDom.children().hide();
    this.options.mainDom.children(".terminalThememain").show();
};




if ($ || JQuery) {
    ($ || JQuery).fn.terminalTheme = function(options) {
        if (!options) {
            options = {};
        }
        if (!this.terminalThemeObject) {
            this.children().hide();
            options.mainDom = this;
            options.dom = $(document.createElement("div")).addClass("terminalThememain");
            options.mainDom.append(options.dom);
            this.terminalThemeObject = new JQueryTerminalTheme(options);
        }
        return this.terminalThemeObject;


    };
} else {
    throw "JQuery needed to run jquery.terminal.js";
}
