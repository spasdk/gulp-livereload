/**
 * Serve files in the build directory.
 *
 * @author Stanislav Kalashnik <darkpark.main@gmail.com>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var //path     = require('path'),
    tinylr   = require('tiny-lr'),
    Plugin   = require('spa-gulp/lib/plugin'),
    plugin   = new Plugin({name: 'livereload', entry: 'watch', context: module}),
    chokidar = require('chokidar');


// create tasks for profiles
plugin.profiles.forEach(function ( profile ) {
    var server, watcher, doneCallback;

    profile.task('watch', function ( done ) {
        var fn = function ( name ) {
            // reload
            server.changed({
                body: {files: [name]}
            });

            // report
            profile.notify({
                title: plugin.entry,
                message: name
            });
        };

        server = tinylr({
            liveCSS: profile.data.live.css,
            liveJs:  profile.data.live.js,
            liveImg: profile.data.live.img
        });

        doneCallback = done;

        server.listen(profile.data.port, function () {
            // port can be 0 from the start
            profile.data.port = server.port;

            watcher = chokidar.watch(profile.data.watch, {ignoreInitial: true});
            watcher
                .on('change', fn)
                .on('unlink', fn)
                .on('add', fn);

            // report
            profile.notify({
                info: 'start '.green + ('server on port ' + profile.data.port).bold,
                title: plugin.entry,
                message: 'server on port ' + profile.data.port
            });
        });
    });

    profile.task('stop', function () {
        if ( server ) {
            server.close();
            watcher.close();
            doneCallback();

            // report
            profile.notify({
                info: 'stop '.green + 'server'.bold,
                title: 'stop',
                message: 'ok'
            });
        }
    });
});


// public
module.exports = plugin;
