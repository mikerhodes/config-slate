// This is a Javascript Slate config. Documentation is here:
// https://github.com/jigish/slate/wiki/JavaScript-Configs

// Horizontal resolutions of the monitors in use.
var DELL_27 = 2560;
var DELL_24 = 1920;
var LAPTOP = 1366;

var DELL_27_SCREEN_ID = "2560x1440";
var LAPTOP_SCREEN_ID = "1366x768";
var DEFAULT_SCREEN_ID = "0";

//
//    DEFAULT SETTINGS
//
//

// pw() and fs() return functions to resize windows to a given size.
// The returned functions are called entered into app_resize_functions
// to be later called during automatic window positioning.

// Return a function to resize an window to a given position and size.
function pw(x, y, w, h, outer_screen_id) {
    return function (win, screen_id) {
        // Allow outer_screen_id to override screen_id
        if(typeof(outer_screen_id) !== 'undefined') {
            screen_id = outer_screen_id;
        }
        position_window(win, x, y, w, h, screen_id);
    };
}

// Return a function to resize a window to fill the screen.
function fs(outer_screen_id) {
    return function(win, screen_id) {
        // Allow outer_screen_id to override screen_id
        if(typeof(outer_screen_id) !== 'undefined') {
            screen_id = outer_screen_id;
        }
        full_screen(win, screen_id);
    };
}

// Each app to resize has an entry in this dictionary, keyed by application
// name. The entry consists of a resizing function for the windows of the
// application. The entry has three properties, each containing a resizing
// function. The resizing function is run on an application's windows during
// position().
//  - 27: position on 27" monitor
//  - 24: position on 24" monitor
//  - 11: position on 11" screen (laptop)
var app_resize_functions = {};


_.each([
    'Nightly',
    'Aurora',
    'Firefox',
    'FirefoxDeveloperEdition',
    'Google Chrome',
    'Evernote'
], function(name) {
    app_resize_functions[name] = {
        "27": pw(0, 22, 1366, 1019),  // top left
        "24": pw(0, 22, 1366, 1019),
        "11": fs()
    };
});

_.each([
    'LimeChat',
    '1Password'
], function(name) {
    app_resize_functions[name] = {
        "27": pw(1367, 22, 1193, 685),  // top right
        "24": pw(727, 22, 1193, 685),
        "11": fs()
    };
});

_.each([
    'Sublime Text',
    'IntelliJ IDEA',
    'Xcode'
], function(name) {
    app_resize_functions[name] = {
        "27": pw(258, 105, 1904, 1158),  // a kind of nice centering
        "24": fs(),
        "11": fs()
    };
});

_.each([
    'IBM Notes'
], function(name) {
    app_resize_functions[name] = {
        "27": pw(258, 83, 1071, 1158),  // some odd least-ugly placement
        "24": pw(258, 83, 1071, 1158),
        "11": fs()
    };
});

_.each([
    'GitHub',
    'SourceTree'
], function(name) {
    app_resize_functions[name] = {
        "27": pw(1367, 22, 1193, 900),
        "24": fs(),
        "11": fs()
    };
});

_.each([
    'Terminal'
], function(name) {
    app_resize_functions[name] = {
        "27": pw(0, 22, 1366, 685),
        "24": pw(0, 22, 1366, 685),
        "11": fs()
    };
});

app_resize_functions["Adium"] = {
    "27": pw(2105, 755, 455, 685),
    "24": pw(1465, 515, 455, 685),
    "11": pw(1366-455, 22, 455, 685)
};

app_resize_functions["Spotify"] = {
    "27": fs(LAPTOP_SCREEN_ID),
    "24": fs(LAPTOP_SCREEN_ID),
    "11": fs(LAPTOP_SCREEN_ID)
};

app_resize_functions["Sametime"] = {
    "27": function (win) {
        var is_buddy_list = win.title().indexOf("IBM Sametime") !== -1;
        (is_buddy_list ? pw(1575, 0, 339, 685) : pw(1915, 0, 648, 685))(win);
    },
    "24": function (win) {
        var is_buddy_list = win.title().indexOf("IBM Sametime") !== -1;
        (is_buddy_list ? pw(0, 0, 455, 685) : pw(456, 0, 648, 685))(win);
    },
    "11": function (win) {
        var is_buddy_list = win.title().indexOf("IBM Sametime") !== -1;
        (is_buddy_list ? pw(0, 0, 455, 685) : pw(456, 0, 648, 685))(win);
    }
};


/**
 Enumerate all windows, setting their sizes from the `sizes` array,
 with a couple of special cases, based on screen layout.
 */
function position() {

    slate.log('Entered: postition()');

    var screen_count = slate.screenCount();
    slate.log("Using " + screen_count + " screen default.");

    var current_screen_size = slate.screen().vrect();
    var w = current_screen_size.width;
    var h = current_screen_size.height;
    slate.log("Current screen info: w: " + w + "; h: " + h);

    var screen_width = current_screen_size.width;

    var moved_windows = 0;

    var monitor_layout;
    switch (screen_width) {
        case DELL_27:
            monitor_layout = "27";
            break;
        case DELL_24:
            monitor_layout = "24";
            break;
        case LAPTOP:
            monitor_layout = "11";
            break;
        default:
            monitor_layout = "11";
            break;
    }

    slate.eachApp(function(app) {

        var app_name = app.name();

        if (_.has(app_resize_functions, app_name)) {
            var resize_function = app_resize_functions[app_name][monitor_layout];
            app.eachWindow(function(win) {
                resize_function(win);
                moved_windows++;
            });
        }

    });

    slate.log('Moved ' + moved_windows + ' windows.');
    slate.log('Exited: postition()');
}


//
// Hotkeys
//
//


// Left, half
slate.bind("1:space,ctrl", function(){
    var win = slate.window();
    var current_screen_size = slate.screen().vrect();
    var w = current_screen_size.width;
    var h = current_screen_size.height;
    position_window(win, 0, 22, w/2, h);
});

// Right, half
slate.bind("2:space,ctrl", function(){
    var win = slate.window();
    var current_screen_size = slate.screen().vrect();
    var w = current_screen_size.width;
    var h = current_screen_size.height;
    position_window(win, w/2, 22, w/2, h);
});

// Full screen
slate.bind("3:space,ctrl", function(){
    var win = slate.window();
    full_screen(win);
});

// Centre on large monitor
slate.bind("4:space,ctrl", function(){
    var win = slate.window();
    var current_screen_size = slate.screen().vrect();
    var w = current_screen_size.width;

    if (w === DELL_27) {
        position_window(win, 258, 105, 1904, 1158);
    } else if (w === LAPTOP || w === DELL_24) {
        full_screen(win);
    }
});

// Set up defaults for different screen configs
slate.bind("0:space,ctrl", function(){
    position();
});


//
// HELPERS
//
//

/**
 Position a window. If screen_id is provided, that screen is used,
 otherwise a default of DEFAULT_SCREEN_ID is used.
 */
function position_window(win, x, y, w, h, screen_id) {
    if(typeof(screen_id) === 'undefined') { screen_id = DEFAULT_SCREEN_ID; }

    if (win.title() === "") { return; }

    slate.log("* Moving " + win.app().name() + " -- " + win.title());
    slate.log("  -> " + " x" + x + " y" + y + " w" + w + " h" + h);
    slate.log("  -> " + " screen " + screen_id);

    var success = win.move({ "x" : x, "y" : y, "screen" : screen_id });
    success = win.resize({ "width": w, "height": h });

    // if (!success) { slate.log("  -> Issue moving window!")}
}


/**
 Make a window full screen.
 */
function full_screen(win, screen_id) {
    if(typeof(screen_id) === 'undefined') { screen_id = DEFAULT_SCREEN_ID; }
    var p = slate.screenForRef(screen_id).vrect();
    position_window(win, p.x, p.y, p.width, p.height, screen_id);
}

/**
 Log number and sizes of connected screens.
 */
function log_screens() {
    slate.eachScreen(function(screenObj) {
        var size = screenObj.vrect();
        slate.log(
            "screen " + screenObj.id() +
            ": " + size.width +
            ", " + size.height +
            ", " + size.x +
            ", " + size.y);
    });
}

/**
 Log an application's windows.
 */
function log_application(app) {
    slate.log(app.name());
    app.eachWindow(function(win) {
        var size = win.rect();
        slate.log(
            " -> " + win.title() +
            " x" + size.x +
            " y" + size.y +
            " w" + size.width +
            " h" + size.height);
    });
}
