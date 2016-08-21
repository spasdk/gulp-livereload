/**
 * @author Stanislav Kalashnik <darkpark.main@gmail.com>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var tinylr   = require('tiny-lr'),
    chokidar = require('chokidar'),
    PluginTemplate = require('spa-plugin');


/**
 * @constructor
 * @extends PluginTemplate
 *
 * @param {Object} config init parameters (all inherited from the parent)
 */
function Plugin ( config ) {
    var self = this;

    // parent constructor call
    PluginTemplate.call(this, config);

    // create tasks for profiles
    this.profiles.forEach(function ( profile ) {
        var server, watcher, doneCallback;

        profile.task('watch', function ( done ) {
            var fn = function ( name ) {
                // reload
                server.changed({
                    body: {files: [name]}
                });

                // report
                profile.notify({
                    info: 'detect change ' + name,
                    tags: [self.entry]
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
                    title: self.entry,
                    info: 'start server on port ' + profile.data.tinylr.port
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
                    info: 'stop server'
                });
            }
        });
    });

    this.debug('tasks: ' + Object.keys(this.tasks).sort().join(', '));
}


// inheritance
Plugin.prototype = Object.create(PluginTemplate.prototype);
Plugin.prototype.constructor = Plugin;


// public
module.exports = Plugin;
