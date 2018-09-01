/**
* NOTE:
* Some of the features of the  Web Audio API currently only work on Chrome, hence the 'webkit' prefix!
*/

(function() {
    // Create audio (context) container
    var audioCtx = new (AudioContext || webkitAudioContext)();

    // Table of notes with correspending keyboard codes. Frequencies are in hertz.
    // The notes start from middle C
    var notesByKeyCode = {
        65: { noteName: '', frequency: 261.6, keyName: 'a' },
        87: { noteName: '', frequency: 277.1, keyName: 'w' },
        83: { noteName: '', frequency: 293.7, keyName: 's' },
        69: { noteName: '', frequency: 311.1, keyName: 'e' },
        68: { noteName: '', frequency: 329.6, keyName: 'd' },
        70: { noteName: '', frequency: 349.2, keyName: 'f' },
        82: { noteName: '', frequency: 369.9, keyName: 'r' },        
        71: { noteName: '', frequency: 392, keyName: 'g' },
        89: { noteName: '', frequency: 415.3, keyName: 'y'},
        72: { noteName: '', frequency: 440, keyName: 'h' },
        85: { noteName: '', frequency: 466.16, keyName: 'u' },
        74: { noteName: '', frequency: 493.9, keyName: 'j' },
        75: { noteName: '', frequency: 523.3, keyName: 'k' },
        79: { noteName: '', frequency: 554.36, keyName: 'o' },
        76: { noteName: '', frequency: 587.3, keyName: 'l' },
        80: { noteName: '', frequency: 622.25, keyName: 'p' },
        78: { noteName:'', frequency: 659.3, keyName: 'n' },
        77: { noteName:'', frequency: 698.4, keyName: 'm' },
    };

    function Key(keyCode, noteName, keyName, frequency) {
        var keyHTML = document.createElement('div');
        var keySound = new Sound(frequency, 'sawtooth');
        
        /* Cheap way to map key on touch screens */
        keyHTML.setAttribute('data-key', keyCode);

        /* Style the key */

        keyHTML.className = 'key';
        keyHTML.innerHTML = noteName + '<br><span>' + keyName + '</span>';

        if(keyName == 'w'){
            keyHTML.className = 'key2';
            keyHTML.innerHTML = noteName + '<br><span>' + keyName + '</span>';
            
        }
        if(keyName == 'e'){
            keyHTML.className = 'key3';
            keyHTML.innerHTML = noteName + '<br><span>' + keyName + '</span>';
            
        }
        if(keyName == 'r'){
            keyHTML.className = 'key4';
            keyHTML.innerHTML = noteName + '<br><span>' + keyName + '</span>';
            
        }
        if(keyName == 'y'){
            keyHTML.className = 'key5';
            keyHTML.innerHTML = noteName + '<br><span>' + keyName + '</span>';
            
        }

        if(keyName == 'u'){
            keyHTML.className = 'key6';
            keyHTML.innerHTML = noteName + '<br><span>' + keyName + '</span>';
            
        }

        if(keyName == 'o'){
            keyHTML.className = 'key7';
            keyHTML.innerHTML = noteName + '<br><span>' + keyName + '</span>';
            
        }

        if(keyName == 'p'){
            keyHTML.className = 'key8';
            keyHTML.innerHTML = noteName + '<br><span>' + keyName + '</span>';
            
        }

        return {
            html: keyHTML,
            sound: keySound
        };
    }


    function Sound(frequency, type) {
        this.osc = audioCtx.createOscillator(); // Create oscillator node
        this.pressed = false; // flag to indicate if sound is playing

        /* Set default configuration for sound */
        if(typeof frequency !== 'undefined') {
            /* Set frequency. If it's not set, the default is used (440Hz) */
            this.osc.frequency.value = frequency;
        }

        /* Set waveform type. Default is actually 'sine' but triangle sounds better :) */
        this.osc.type = type || 'triangle';

        /* Start playing the sound. You won't hear it yet as the oscillator node needs to be
        piped to output (AKA your speakers). */
        this.osc.start(0);
    };

    Sound.prototype.play = function() {
        if(!this.pressed) {
            this.pressed = true;
            this.osc.connect(audioCtx.destination);
        }
    };

    Sound.prototype.stop = function() {
        this.pressed = false;
        this.osc.disconnect();
    };

    function createKeyboard(notes, containerId) {
        var sortedKeys = []; // Placeholder for keys to be sorted
        var waveFormSelector = document.getElementById('soundType');

        for(var keyCode in notes) {
            var note = notes[keyCode];

            /* Generate playable key */
            note.key = new Key(keyCode, note.noteName, note.keyName, note.frequency);

            /* Add new key to array to be sorted */
            sortedKeys.push(notes[keyCode]);
        }

        /* Sort keys by frequency so that they'll be added to the DOM in the correct order */
        sortedKeys = sortedKeys.sort(function(note1, note2) {
            if (note1.frequency < note2.frequency) return -1;
            if (note1.frequency > note2.frequency) return 1;

            return 0;
        });

        // Add those sorted keys to DOM
        for(var i = 0; i < sortedKeys.length; i++) {
            document.getElementById(containerId).appendChild(sortedKeys[i].key.html);
        }

        var playNote = function(event) {
            event.preventDefault();
          
            var keyCode = event.keyCode || event.target.getAttribute('data-key');

            if(typeof notesByKeyCode[keyCode] !== 'undefined') {
                // Pipe sound to output (AKA speakers)
                notesByKeyCode[keyCode].key.sound.play();

                // Highlight key playing
                notesByKeyCode[keyCode].key.html.className = 'key playing';

                 if(keyCode == 87){
                        notesByKeyCode[keyCode].key.html.className = 'key2 playing2';
                    }

                  if(keyCode == 69){
                        notesByKeyCode[keyCode].key.html.className = 'key3 playing2';
                    }  

                  if(keyCode == 82){
                        notesByKeyCode[keyCode].key.html.className = 'key4 playing2';
                    } 
                  if(keyCode == 89){
                        notesByKeyCode[keyCode].key.html.className = 'key5 playing2';
                    }   

                  if(keyCode == 85){
                        notesByKeyCode[keyCode].key.html.className = 'key6 playing2';
                    } 

                  if(keyCode == 79){
                        notesByKeyCode[keyCode].key.html.className = 'key7 playing2';
                    } 
                  if(keyCode == 80){
                        notesByKeyCode[keyCode].key.html.className = 'key8 playing2';
                    }       
            }
        };

        var endNote = function(event,keyName) {
            var keyCode = event.keyCode || event.target.getAttribute('data-key');

            if(typeof notesByKeyCode[keyCode] !== 'undefined') {
                // Kill connection to output
                notesByKeyCode[keyCode].key.sound.stop();

                // Remove key highlight

                    notesByKeyCode[keyCode].key.html.className = 'key';

                    if(keyCode == 87){
                        notesByKeyCode[keyCode].key.html.className = 'key2';
                    }
                    if(keyCode == 69){
                        notesByKeyCode[keyCode].key.html.className = 'key3';
                    }
                    if(keyCode == 82){
                        notesByKeyCode[keyCode].key.html.className = 'key4';
                    }

                    if(keyCode == 89){
                        notesByKeyCode[keyCode].key.html.className = 'key5';
                    }

                    if(keyCode == 85){
                        notesByKeyCode[keyCode].key.html.className = 'key6';
                    }
                    if(keyCode == 79){
                        notesByKeyCode[keyCode].key.html.className = 'key7';
                    }
                    if(keyCode == 80){
                        notesByKeyCode[keyCode].key.html.className = 'key8';
                    }
                
                
            }
        };

        var setWaveform = function(event) {
            for(var keyCode in notes) {
                notes[keyCode].key.sound.osc.type = this.value;
            }

            // Unfocus selector so value is not accidentally updated again while playing keys
            this.blur();
        };

        // Check for changes in the waveform selector and update all oscillators with the selected type
        waveFormSelector.addEventListener('change', setWaveform);

        window.addEventListener('keydown', playNote);
        window.addEventListener('keyup', endNote);
        window.addEventListener('touchstart', playNote);
        window.addEventListener('touchend', endNote);
    }

    window.addEventListener('load', function() {
        createKeyboard(notesByKeyCode, 'keyboard');
    });
})();