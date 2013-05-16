/* Character progress box

 Shows progress of length of input against a meter.

 maxLength: max # of characters
 warnLength: # of characters at which we should "warn" that it's close to full
 okStyle: css class name put on input element to show length is ok
 warnStyle: css class name put on input element to show length is in warning zone
 maxStyle: css class name put on input element to show at maximum length
 compensateWindowsNL: compensate for the fact that Windows newlines are 2 characters?
 block: display meter as a block? defaults to true for input, else false

 Copyright ©2013 by Joel Burton <joel@joelburton.com>.

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.

 */

(function ($) {
    $.fn.charprogress = function (options) {
        var css;

        // In our handler, we'll want to know if this is a Windows client --
        // let's calculate it here, so it's done just once
        var isWindows = navigator.appVersion.toLowerCase().indexOf('win') != -1;

        $(this).each(function (index, value) {
            var input = $(value);

            var defaults = {
                maxLength: 140,
                warnLength: 110,
                okStyle: 'charprogressOk',
                warnStyle: 'charprogressWarn',
                maxStyle: 'charprogressMax',
                compensateWindowsNL: true,
                block: input.is("textarea")
            };

            var opts = $.extend(defaults, options);

            // In block mode, put meter on separate line and make it the same width
            // as the input element. Current browsers seem to jog it over by a few pixels;
            // let's try to compensate for that.

            if (opts.block) {
                css = {
                    display: 'block',
                    marginLeft: 3,
                    width: input.innerWidth()
                }
            } else {
                css = {};
            }

            // Create the HTML meter. Since browsers don't adjust the meter color until
            // *after* the "high" attribute, let's set that to 1 less than our warnLength.

            var meter = $('<meter></meter>',
                {   min: 0,
                    max: opts.maxLength,
                    low: 0,
                    high: opts.warnLength - 1,
                    css: css
                }).insertAfter(input);

            // Immediately assign proper class based on content
            adjustProgress(0);

            input.keydown(handleKeystroke);

            function handleKeystroke(event) {
                var key = event.which;
                var allowKey;
                var adjustment = 1;

                console.log(key);

                // Keystrokes that won't actually change the input length and should always
                // be allowed without having to recalculate size
                if ((key >= 37 && key <= 40) || key === 9       // arrows,tab
                    || key === 18 || key === 16 || key === 27   // alt, shift, esc
                    || event.ctrlKey || event.metaKey)          // ctrl-any, meta-any
                {
                    return true;
                }

                // Backspace and delete will *reduce* not increase length of input
                if (key === 46 || key === 8) {
                    adjustment = -1;
                }

                // On Windows, a RETURN adds 2 characters, not 1
                if (isWindows && key === 13) {
                    adjustment = 2;
                }

                allowKey = adjustProgress(adjustment);

                // Do we allow this keystroke to go into box? Only if < max or if reduces
                return adjustment === -1 || allowKey;
            }

            function adjustProgress(adjustment) {
                // Adjust CSS of input box. Returns true if new length < max.

                var nNewlines, effectiveLength;
                var content = input.val();

                // In order to fairly treat Windows, we should recognize that
                // it puts in 2 characters for a newline, whereas Mac/Unix put
                // in just one. Let's compensate for that if in options.
                if (opts.compensateWindowsNL && isWindows) {
                    nNewlines = content.split("\n").length;
                    effectiveLength = content.length - nNewlines;
                } else {
                    effectiveLength = content.length;
                }

                // This is the length before this keystroke, now add in effects of
                // the incoming keystroke
                effectiveLength += adjustment;

                meter.val(effectiveLength);

                // Reduce box back down to size
                // We *shouldn't* even be above size (we're blocking bubbling of events
                // that might increase us over limit), but to be cautious...
                if (effectiveLength > opts.maxLength) {
                    input.val(content.slice(0, opts.maxLength));
                }

                input.removeClass(opts.okStyle + " " + opts.warnStyle + " " + opts.maxStyle);
                if (effectiveLength >= opts.maxLength) {
                    input.addClass(opts.maxStyle);
                } else if (effectiveLength >= opts.warnLength) {
                    input.addClass(opts.warnStyle);
                } else {
                    input.addClass(opts.okStyle);
                }

                // Do we think this key should be allowed?
                return effectiveLength <= opts.maxLength;
            }
        });
    };

})(jQuery);

