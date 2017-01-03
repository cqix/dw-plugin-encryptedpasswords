/**
  * Encrypted Passwords Plugin: Store encrypted passwords with syntax <decrypt></decrypt>
  *
  * @license    GPL2 (http://www.gnu.org/licenses/gpl.html)
  * @author     Wolfgang Reszel <reszel@werbeagentur-willers.de>
  * @author     Christian Koller <admin@iecw.net>
  */

/* DOKUWIKI:include sjcl.js */
/* DOKUWIKI:include jsencryption.js */

// Add a toolbar button to insert a encrypted password
function addBtnActionEncryptButtonClick(btn, props, edid) {

    jQuery(btn).click(function(){
        //Get selected text
        var selectedText = '';
        if (typeof DWgetSelection == 'function') {
            var selection = DWgetSelection(document.getElementById('wiki__text'));
        } else {
            var selection = getSelection(document.getElementById('wiki__text'));
        }
        if (selection.getLength()) {
            selectedText = selection.getText();
        }
        if (selectedText=='') {
            alert(LANG.plugins.encryptedpasswords['noSelection']);
            return false;
        }
        
        //De-/Encrypt
        if (selectedText.indexOf('<decrypt>') == 0 && selectedText.indexOf('</decrypt>') == selectedText.length-10) {
            vcPrompt(LANG.plugins.encryptedpasswords['enterKey'], LANG.plugins.encryptedpasswords['decrypt'], 1, vcFunc = function(a) {
                if (a) {
                    document.getElementById('wiki__text').focus();
                    try {
                        decText = sjcl.decrypt(passElt.value, window.atob(selectedText.substr(9,selectedText.length-19)) );
                    } catch(err) { decText = null }
                    if (decText) {
                        pasteText(selection, decText);
                        vcClick_func(0);
                        decText = null;
                    } else {
                        alert(LANG.plugins.encryptedpasswords['invalidKey'])
                    }
                } else { 
                    vcClick_func(0);
                    document.getElementById('wiki__text').focus();
                };
            });
        } else {
            vcPrompt(LANG.plugins.encryptedpasswords['encryptKey'], LANG.plugins.encryptedpasswords['encrypt'], 2, vcFunc = function(a) {
                if (a) {
                    if (passElt.value !== passElt2.value) {
                        alert(LANG.plugins.encryptedpasswords['keyErr']);
                        return false;
                    }
                    if (passElt.value == '') {
                        alert(LANG.plugins.encryptedpasswords['emptyKey']);
                        return false;
                    }
                    document.getElementById('wiki__text').focus();
                    pasteText(selection,'<decrypt>'+window.btoa(sjcl.encrypt(passElt.value, selectedText, {mode:'gcm'}))+'</decrypt>');
                    vcClick_func(0);
                } else { 
                    vcClick_func(0);
                    document.getElementById('wiki__text').focus();
                };
            });

        }
        return false;
    });
    return true;
}
