/**
 * @author Stanislav Kalashnik <darkpark.main@gmail.com>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var //path     = require('path'),
    tinylr   = require('tiny-lr'),
    Plugin   = require('spasdk/lib/plugin'),
    plugin   = new Plugin({name: 'livereload', entry: 'watch', config: require('./config')}),
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

        server = tinylr(profile.data.tinylr);

        doneCallback = done;

        server.listen(profile.data.tinylr.port, function () {
            // port can be 0 from the start
            profile.data.tinylr.port = server.port;

            watcher = chokidar.watch(profile.data.watch, {ignoreInitial: true});
            watcher
                .on('change', fn)
                .on('unlink', fn)
                .on('add', fn);

            // report
            profile.notify({
                title: plugin.entry,
                message: 'start server on port ' + profile.data.tinylr.port
            });
        });
    });

    profile.task('unwatch', function () {
        if ( server ) {
            server.close();
            watcher.close();
            doneCallback();

            // report
            profile.notify({
                title: 'stop',
                message: 'stop server'
            });
        }
    });
});


// public
module.exports = plugin;
