jquery.inputMeter
=================

This plugin provides an HTML5 meter below or next to an `<input>` or `<textarea>`.
The meter is updated to reflect the length of the input, and stops accepting
characters when above a given maximum limit.

Example:

    <textarea id="mytext"></textarea>

    <script>
      $("#mytext").inputMeter( {maxLength: 10, warnLength: 7} );
    </script>

This will put a meter below this textbox. As characters are entered, the meter
will be green until the 7th character is entered, at which point it will turn
amber. It will not accept characters after the 10th character.

CSS classes are added to the input area to reflect whether the input is in
the ok range, in the warning range, or at capacity. You can use these classes
to stylize your element.

This will put a red border around the progress element that is created and
make the background of your input red:

    .inputMeterMax + meter { border: solid 2px red; }
    .inputMeterMax { background-color: red };

Options
-------

Options are passed to the inputMeter method:

- **maxLength**: maximum length of input
- **warnLength**: # of characters at which the styling should switch to "warn" mode
- **okStyle**: name of CSS class that is added if input is less than the warning length.
  This defaults to "inputMeterOk".
- **warnStyle**: name of CSS class that is added if input is in the warning range.
  This defaults to "inputMeterWarn".
- **maxStyle**: name of CSS class that is added if input is at capacity.
  This defaults to "inputMeterMax".
- **compensateWindowsNL**: Windows browsers add two characters when RETURN is
  entered. In many cases, you may want to treat this as if it was only 1 character long,
  since on the server-side, you'll normalize this to a single newline. If so,
  set this to true. If this is false, Windows newlines count as two characters.
  The default is true.
- **block**: If true, puts the meter in `{display:block}` mode, and makes it the same
  width as the input element. This is most useful for textareas, which are often on their
  own line already. If this is false, the meter is in `{display: inline}` mode and
  has no width set. This defaults to true if the input element is a `textarea`.


