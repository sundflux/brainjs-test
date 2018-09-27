/**
 * Brain.js testing
 *
 * Try to teach Brain.js network to guess if given values for
 * events and given time of the day is a weekend.
 */

var NeuralNetworkClient = {

    brain: new brain.NeuralNetwork(),

    init: function() {
        NeuralNetworkClient.output('Initializing skynet, hold on (ㆆ _ ㆆ) ...');

        Papa.parse('http://sundstrom.io/dev/ml/input/data.csv', {
            download: true,
            header: true,
            worker: true,
            delimeter: ';',
            complete: function(results) {
                NeuralNetworkClient.trainNetwork(results);
            }
        });
    },

    /**
     * Parse CSV data to Brain.js format and teach the network.
     */
    trainNetwork: function(input) {
        var learningData = [];

        NeuralNetworkClient.output('Parsing learning data ƪ(ړײ)‎ƪ​​ ...');

        input.data.forEach(function(e) {
            learningData.push(
                {
                    input: {
                        events: NeuralNetworkClient.normalizeValue(e.Events),
                        hour: NeuralNetworkClient.normalizeValue(e.Hour)
                    },
                    output: { 
                        weekend: (e.Day > 5 ? 1 : 0)
                    }
                }
            );
        });

        this.brain.train(learningData);
        NeuralNetworkClient.output('Training done, bring it on (ง •̀_•́)ง');
    },

    /**
     * There's probably some proper way of normalizing values
     * to 0-1 for Brain.js, but simple float divide works for 
     * testing purposes. Sorry for the hack :P
    */
    normalizeValue: function(v) {
        return parseFloat( parseFloat(v) / 10000 );
    },

    /**
     * Print to page
     */
    output: function(v) {
        var div = document.getElementById('output');
        div.innerHTML += v + "\n";
    },

    /**
     * Helper to call the brain
     */
    run: function(e, h) {
        var v = this.brain.run({
            events: NeuralNetworkClient.normalizeValue(e), 
            hour: NeuralNetworkClient.normalizeValue(h)
        });
        if (v.weekend < 0.5) {
            console.log('Day is likely a week day');
        } else {
            console.log('Day is likely a weekend');
        }
    }

}

document.addEventListener("DOMContentLoaded", function(event) {
    NeuralNetworkClient.init();
});
