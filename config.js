/**
 * HTTP static server configuration for static gulp task.
 *
 * @author Stanislav Kalashnik <darkpark.main@gmail.com>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var path     = require('path'),
    extend   = require('extend'),
    config   = require('spasdk/config'),
    profiles = {};


// main
profiles.default = extend(true, {}, config, {
    // livereload options
    tinylr: {
        port: 0,
        liveCSS: true,
        liveJs:  true,
        liveImg: true
    },

    // false to prevent watch task creation
    // otherwise array of globs to monitor
    watch: [
        path.join(config.target, '**', '*'),
        '!' + path.join(config.target, '**', '*.md')
    ],

    // info channels
    notifications: {
        popup: {
            info: {icon: path.join(__dirname, 'media', 'info.png')},
            warn: {icon: path.join(__dirname, 'media', 'warn.png')},
            fail: {icon: path.join(__dirname, 'media', 'fail.png')}
        }
    }
});


// public
module.exports = profiles;
