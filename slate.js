// This is a Javascript Slate config. Documentation is here:
// https://github.com/jigish/slate/wiki/JavaScript-Configs

// Screen sizes we use
var DELL_27 = 2560;
var DELL_24 = 1920;
var LAPTOP = 1366;


//
//    DEFAULT SETTINGS
//
//

// The default settings are stored in an array of pseudo-objects
// with the following properties:
//  - names: names of applications for sizing
//  - position_27: position on 27" monitor
//  - position_24: position on 24" monitor
//  - position_11: position on 11" screen (laptop)

// Array for all different sizes. This is looped over when positioning
// windows.
var sizes = [];

var normals = new Object();
normals.names = [
    'Nightly',
    'Aurora',
    'Firefox',
    'FirefoxDeveloperEdition',
    'Google Chrome',
    'Evernote'
];
normals.position_27 = [0, 22, 1366, 1019];
normals.position_24 = [0, 22, 1366, 1019];
normals.position_11 = "full_screen";
sizes.push(normals);

var top_rights = new Object();
top_rights.names = [
    'LimeChat',
    '1Password',
];
top_rights.position_27 = [1367, 22, 1193, 685];
top_rights.position_24 = [727, 22, 1193, 685];
top_rights.position_11 = "full_screen"
sizes.push(top_rights);

var editors = new Object();
editors.names = [
    'Sublime Text',
    'IntelliJ IDEA',
    'Xcode'
];
editors.position_27 = [258, 105, 1904, 1158];
editors.position_24 = "full_screen";
editors.position_11 = "full_screen";
sizes.push(editors);

var notes = new Object();
notes.names = ['IBM Notes'];
notes.position_27 = [258, 83, 1071, 1158];
notes.position_24 = [258, 83, 1071, 1158];
notes.position_11 = "full_screen";
sizes.push(notes);

var scm = new Object();
scm.names = ['GitHub', 'SourceTree'];
scm.position_27 = [1367, 22, 1193, 900];
scm.position_24 = "full_screen";
scm.position_11 = "full_screen";
sizes.push(scm);

var terminal = new Object();
terminal.names = ["Terminal"];
terminal.position_27 = [0, 22, 1366, 685];
terminal.position_24 = [0, 22, 1366, 685];
terminal.position_11 = "full_screen";
sizes.push(terminal);

var adium = new Object();
adium.names = ["Adium"];
adium.position_27 = [2105, 755, 455, 685];
adium.position_24 = [1465, 515, 455, 685];
adium.position_11 = [1366-455, 22, 455, 685];
sizes.push(adium);


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

    var current_screen_size = slate.screen().vrect();
    var screen_width = current_screen_size.width;

    var moved_windows = 0;

    slate.eachApp(function(app) {

        var app_name = app.name();

        // The simple defaults where all windows of the app end up in
        // the same place.
        _.each(sizes, function(apps) {
            if (_.contains(apps.names, app_name)) {
                app.eachWindow(function(win) {

                    var p;

                    if (screen_width === DELL_27) {
                        p = apps.position_27;
                    } else if (screen_width === DELL_24) {
                        p = apps.position_24;
                    } else if (screen_width === LAPTOP) {
                        p = apps.position_11;
                    }

                    if (p === "full_screen") {
                        full_screen(win);
                    } else {
                        position_window(win, p[0], p[1], p[2], p[3]);
                    }

                    moved_windows++;

                });
            }
        });

        // For Sametime, put the Buddy List to the left of the chat
        // window.
        if (_.contains(['Sametime'], app_name)) {
            // x2105 y755 w455 h685
            app.eachWindow(function(win) {
                var title = win.title();
                var is_buddy_list = title.indexOf("IBM Sametime") !== -1;
                if (is_buddy_list) {

                    if (screen_width === DELL_27) {
                        position_window(win, 1575, 0, 339, 685);
                    } else if (screen_width === DELL_24) {
                        position_window(win, 0, 0, 455, 685);
                    } else if (screen_width === LAPTOP) {
                        position_window(win, 0, 0, 455, 685);
                    }

                    moved_windows++;
                } else {

                    if (screen_width === DELL_27) {
                        position_window(win, 1915, 0, 648, 685);
                    } else if (screen_width === DELL_24) {
                        position_window(win, 456, 0, 648, 685);
                    } else if (screen_width === LAPTOP) {
                        position_window(win, 456, 0, 648, 685);
                    }

                    moved_windows++;
                }
            });
        }

        // Spotify lives on the laptop screen if we've a two screen set up
        second_screen = ['Spotify'];
        if (slate.screenCount() == 2 && _.contains(second_screen, app_name)) {
            app.eachWindow(function(win) {
                full_screen(win, "0");
                moved_windows++;
            });
        }

    });

    slate.log('Moved ' + moved_windows + ' windows.');
    slate.log('Exited: postition()');
}


//
// HELPERS
//
//

/**
 Position a window. If screen_id is provided, that screen is used,
 otherwise a default of "0" is used.
 */
function position_window(win, x, y, w, h, screen_id) {
    if(typeof(screen_id) === 'undefined') { screen_id = "0"; }

    if (win.title() === "") { return; }

    // slate.log("* Moving " + win.app().name() + " -- " + win.title());
    // slate.log("  -> " + " x" + x + " y" + y + " w" + w + " h" + h);

    var success = win.move({ "x" : x, "y" : y, "screen" : screen_id });
    success = win.resize({ "width": w, "height": h });

    // if (!success) { slate.log("  -> Issue moving window!")}
}


/**
 Make a window full screen.
 */
function full_screen(win, screen_id) {
    if(typeof(screen_id) === 'undefined') { screen_id = "0"; }
    var p = slate.screen().vrect();
    position_window(win, p.x, p.y, p.width, p.height, screen_id);
}

/**
 Log number and sizes of connected screens.
 */
function log_screens() {
    slate.eachScreen(function(screenObj) {
        var size = screenObj.vrect()
        slate.log(
            "screen " + screenObj.id() +
            ": " + size.width +
            ", " + size.height +
            ", " + size.x +
            ", " + size.y
        );
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
            " h" + size.height
        );
    });
}
