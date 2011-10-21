/**
 * jQuery.gpTile 1.0
 * http://ginpen.com/jquery/gptile/
 * https://github.com/ginpei/jQuery.gpTile
 *
 * Copyright (c) 2011 Takanashi Ginpei
 * http://ginpen.com
 *
 * Released under the MIT License.
 * http://www.opensource.org/licenses/mit-license.php
 */
;(function($) {
    try {
        if (window.com.ginpen.gpTile) { return; }
    } catch (e) {}

    if (!window.com) { window.com = {}; }
    if (!com.ginpen) { com.ginpen = {}; }

    var gpTile = com.ginpen.gpTile = {
        /**
         * The version of this application.
         * @type String
         */
        VERSION: '1.0',

        /**
         * Default settings.
         * @type Object
         */
        DEFAULT: {
            direction: 'xy',
            height: null,
            width: null
        },

        /**
         * @param {Object} settings
         * @returns {Object}
         */
        mergeSettings: function(settings) {
            return $.extend({}, this.DEFAULT, settings);
        },

        /**
         * Called by jQuery interface.
         * @param {HtmlElement} $el Target element.
         * @param {Object} settings Settings map.
         */
        exec: function($el, settings) {
            var url = this._getUrl($el, settings);
            if (!url) {
                return;
            }

            if (this._hasSize(settings)) {
                this._applySize($el, settings, settings);
            }
            else {
                var that = this;
                this._getImgSize(url, function(status, imgSize) {
                    if (status == 'load') {
                        that._applySize($el, settings, imgSize);
                    }
                });
            }
        },

        /**
         * Return true if settings has size informations completely.
         * @param {Object} settings Settings map.
         */
        _hasSize: function(settings) {
            return (
                settings
                && (
                    (this._hasDirectionY(settings)
                        && !isNaN(settings.height)
                        && settings.height > 0)
                    ||
                    (this._hasDirectionX(settings)
                        && !isNaN(settings.width)
                        && settings.width > 0)
                    )
                );
        },

        /**
         * Return true if direction setting hax 'x'.
         * @param {Object} settings
         * @returns {Boolean}
         */
        _hasDirectionX: function(settings) {
            return (
                settings
                && settings.direction
                && $.isFunction(settings.direction.toLowerCase)
                && settings.direction.toLowerCase().indexOf('x') >= 0
                );
        },

        /**
         * Return true if direction setting hax 'y'.
         * @param {Object} settings
         * @returns {Boolean}
         */
        _hasDirectionY: function(settings) {
            return (
                settings
                && settings.direction
                && $.isFunction(settings.direction.toLowerCase)
                && settings.direction.toLowerCase().indexOf('y') >= 0
                );
        },

        /**
         * Find gackground-image of $el.
         * @param {HtmlElement} $el Target element.
         * @param {Object} settings Settings map.
         */
        _getUrl: function($el, settings) {
            var url = $el.css('background-image');
            if (url) {
                var matched = url.match(/^url\("?([^"]+)"?\)$/) || [];
                url = matched[1];
            }
            return url || '';
        },

        /**
         * Return image size at callback.
         * @param {String} url Image's URL.
         * @param {Function} callback Called when image is loaded.
         */
        _getImgSize: function(url, callback) {
            $('<img />')
                .one('load', function(event) {
                    callback('load', {
                        height: this.height,
                        url: url,
                        width: this.width
                    });
                })
                .one('error', function(event) {
                    callback('error', {
                        url: url
                    });
                })
                .attr({ src: url });
        },

        /**
         * Update size for own and image size.
         * @param {HtmlElement} $el Target element.
         * @param {Object} settings
         * @param {Object} imgSize
         */
        _applySize: function($el, settings, imgSize) {
            var ownSize = this._getOwnSize($el);
            var size = this._calclateOwnSize(ownSize, imgSize, settings);
            this._setSize($el, size);
        },

        /**
         * Return target block size.
         * @param {HtmlElement} $el Target.
         * @returns {Object} Size data.
         */
        _getOwnSize: function($el) {
            return {
                height: $el.innerHeight(),
                width: $el.innerWidth()
            };
        },

        /**
         * Return target block size to be.
         * @param {Object} ownSize
         * @param {Object} imgSize
         * @param {Object} settings Settings map.
         * @returns {Object} Size data.
         */
        _calclateOwnSize: function(ownSize, imgSize, settings) {
            settings = settings || {};
            settings.direction = settings.direction || gpTile.DEFAULT.direction;

            var height = undefined;
            if (settings.direction
                && settings.direction.toLowerCase().indexOf('y') >= 0
            ) {
                height = Math.max(ownSize.height, 1);
                if (height % imgSize.height != 0) {
                    height += - height % imgSize.height + imgSize.height;
                }
            }

            var width = undefined;
            if (settings.direction
                && settings.direction.toLowerCase().indexOf('x') >= 0
            ) {
                width = Math.max(ownSize.width, 1);
                if (width % imgSize.width != 0) {
                    width += - width % imgSize.width + imgSize.width;
                }
            }

            return {
                height: height,
                width: width
            };
        },

        /**
         * Set size to element except padding style.
         */
        _setSize: function($el, size) {
            var height = size.height
                - parseInt($el.css('padding-top'))
                - parseInt($el.css('padding-bottom'));

            var width = size.width
                - parseInt($el.css('padding-left'))
                - parseInt($el.css('padding-right'));

            $el.css({
                height: height,
                width: width
            });
        },

        banpei: null
    };

    // jQuery method interface
    $.fn.gpTile = function(settings) {
        settings = gpTile.mergeSettings(settings);
        for (var i = 0, l = this.length; i < l; i++) {
            gpTile.exec(this.eq(i), settings);
        }

        return this;
    };
}(jQuery));
