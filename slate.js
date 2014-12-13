// This is a Javascript Slate config. Documentation is here:
// https://github.com/jigish/slate/wiki/JavaScript-Configs

// Set up logging
// var log = true;

var DELL = 2560;
var LAPTOP = 1366;

/**
 Check whether a window has been resized to target up to 3 times.
 */
function confirmResize(win, target, acc){
    if (acc >= 3) {
        slate.log("    confirmResize: acc > 3, giving up");
        return;
    }
    if (win.app().name() == "Terminal") {    // Terminal resizes to nearest line
        return;
    }

    var s = win.size();
    var resized = s.width == target.width && s.height == target.height;

    if (!resized) {
        slate.log("   confirmResize, BAD: " + win.title());
        win.resize(target);
        confirmResize(win, target, acc+1);
    }
}



//
// Hotkeys
//
//


// Left, half
slate.bind("1:space,ctrl", function(){
    var win = slate.window();
    var w = slate.screen().vrect().width;
    var h = slate.screen().vrect().height;
    position_window(win, 0, 22, w/2, h);
});

// Right, half
slate.bind("2:space,ctrl", function(){
    var win = slate.window();
    var w = slate.screen().vrect().width;
    var h = slate.screen().vrect().height;
    position_window(win, w/2, 22, w/2, h);
});

// Full screen
slate.bind("3:space,ctrl", function(){
    var win = slate.window();
    var w = slate.screen().vrect().width;
    var h = slate.screen().vrect().height;
    position_window(win, 0, 22, w, h);
});

// Centre on large monitor
slate.bind("4:space,ctrl", function(){
    var win = slate.window();
    var w = slate.screen().vrect().width;
    var h = slate.screen().vrect().height;

    if (w === DELL) {
        position_window(win, 258, 105, 1904, 1158);
    } else if (w === LAPTOP) {
        // full screen
        position_window(win, 0, 22, w, h);
    }
});

// Set up defaults for different screen configs
slate.bind("0:space,ctrl", function(){
    var count = slate.screenCount();
    slate.log("================== "+count+" screen default ==================");

    var w = slate.screen().vrect().width;
    var h = slate.screen().vrect().height;
    slate.log("w: " + w + "; h: " + h);

    position();
});



//
//    DEFAULT SETTINGS
//
//


/**
 Position a window on screen "0"
 */
function position_window(win, x, y, w, h) {
    position_window_on_screen(win, "0", x, y, w, h);
}


/**
 Position a window on a given screen.
 */
function position_window_on_screen(win, screen_id, x, y, w, h) {
    if (win.title() === "") { return; }
    slate.log(" * moving " + win.app().name() + " -- " + win.title());
    slate.log("   -> " + " x" + x + " y" + y + " w" + w + " h" + h);

    var success = win.move({ "x" : x, "y" : y, "screen" : screen_id });
    success = win.resize({ "width": w, "height": h });

    confirmResize(win, { "width": w, "height": h }, 0);
}


/**
 Make a window full screen on the MBA 11"
 */
function make_full_screen_laptop(win) {
    var height = 685;  // screen with dock
    height = 742;  // screen without dock
    position_window(win, 0, 22, 1366, height);
}


/**
 The main positioning function: enumerate windows, settings things up
 appropriately.
 */
function position() {

    var w = slate.screen().vrect().width;
    var h = slate.screen().vrect().height;
    // slate.log("w: " + w + "; h: " + h);

    slate.eachScreen(function(screenObj) {
        slate.log(
            "screen " + screenObj.id() +
            ": " + screenObj.vrect().width +
            ", " + screenObj.vrect().height +
            ", " + screenObj.vrect().x +
            ", " + screenObj.vrect().y
        );
    });

    slate.eachApp(function(app) {

        slate.log(app.name());
        app.eachWindow(function(win) {
            slate.log(
                " -> " + win.title() +
                " x" + win.rect().x +
                " y" + win.rect().y +
                " w" + win.rect().width +
                " h" + win.rect().height
            );
        });

        //slate.log(" -> Should we move app?");

        var normals = [
            'Nightly',
            'Aurora',
            'FirefoxDeveloperEdition',
            'Google Chrome',
            'Evernote'
        ];
        if (_.contains(normals, app.name())) {
            app.eachWindow(function(win) {
                if (w === DELL) {
                    position_window(win, 0, 22, 1366, 1019);
                } else if (w === LAPTOP) {
                    make_full_screen_laptop(win);
                }
            });
        }

        var top_rights = [
            'LimeChat',
            '1Password',
        ];
        if (_.contains(top_rights, app.name())) {
            // x1365 y22 w1195 h685
            app.eachWindow(function(win) {
                if (w === DELL) {
                    position_window(win, 1367, 22, 1193, 685);
                } else if (w === LAPTOP) {
                    make_full_screen_laptop(win);
                }
            });
        }

        var editors = [
            'Sublime Text',
            'IntelliJ IDEA',
            'Xcode'
        ];
        if (_.contains(editors, app.name())) {
            app.eachWindow(function(win) {
                if (w === DELL) {
                    position_window(win, 258, 105, 1904, 1158);
                } else if (w === LAPTOP) {
                    make_full_screen_laptop(win);
                }
            });
        }

        var notes = [
            'IBM Notes'
        ];
        if (_.contains(notes, app.name())) {
            app.eachWindow(function(win) {
                if (w === DELL) {
                    position_window(win, 258, 83, 1071, 1158);
                } else if (w === LAPTOP) {
                    make_full_screen_laptop(win);
                }
            });
        }

        var scm = ['GitHub', 'SourceTree'];
        if (_.contains(scm, app.name())) {
            app.eachWindow(function(win) {
                if (w === DELL) {
                    position_window(win, 1367, 22, 1193, 900);
                } else if (w === LAPTOP) {
                    make_full_screen_laptop(win);
                }
            });
        }

        if (app.name() === "Terminal") {
            app.eachWindow(function(win) {
                if (w === DELL) {
                    position_window(win, 0, 22, 1366, 685);
                } else if (w === LAPTOP) {
                    make_full_screen_laptop(win);
                }
            });
        }

        if (_.contains(['Adium'], app.name())) {
            // x2105 y755 w455 h685
            app.eachWindow(function(win) {
                if (w === DELL) {
                    position_window(win, 2105, 755, 455, 685);
                } else if (w === LAPTOP) {
                    position_window(win, 1366-455, 22, 455, 685);
                }
            });
        }

        if (_.contains(['Sametime'], app.name())) {
            // x2105 y755 w455 h685
            app.eachWindow(function(win) {
                var title = win.title();
                if (title.indexOf("IBM Sametime") !== -1) {  // buddy list
                    if (w === DELL) {
                        position_window(win, 1575, 0, 339, 685);
                    } else if (w === LAPTOP) {
                        position_window(win, 0, 0, 455, 685);
                    }
                } else {  // chat window(s)
                    if (w === DELL) {
                        position_window(win, 1915, 0, 648, 685);
                    } else if (w === LAPTOP) {
                        position_window(win, 456, 0, 648, 685);
                    }
                }
            });
        }

        second_screen = [
            'Spotify'
        ];
        if (slate.screenCount() == 2 && _.contains(second_screen, app.name())) {
            var screen_id = "0";
            var scr = slate.screenForRef(screen_id);
            var bounds = scr.vrect();
            app.eachWindow(function(win) {
                position_window_on_screen(
                    win,
                    screen_id,
                    bounds.x+80,
                    bounds.y+40,
                    bounds.width-160,
                    bounds.height-80
                );
            });
        }

    });

    slate.log('postition() complete.');
}
