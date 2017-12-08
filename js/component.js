/**
 * Adapt Learning component to display interactive
 * animations built with external editor and included
 * as an assets into the Adapt AT.
 * Animation assets can be included as single HTML file
 * or as a .OAM package (see Adobe Animate CC 2017).
 *
 * @author Fabio Beoni: https://github.com/fabiobeoni | https://it.linkedin.com/in/fabio-beoni-6a7848101
 */
define(function(require) {

    // generate and assign a unique id to
    // the component instance. ID is printed
    // also on HTML code of the view
    var uuidv4 = require('../libraries/uuidv4');

    //adapt api modules
    var ComponentView = require('coreViews/componentView');
    var Adapt = require('coreJS/adapt');

    var guid;

    // jquery reference to the iframe
    // hosting the animation
    var $frame;

    var component = ComponentView.extend({

        // binds to "inview" event fired by adapt
        events: {
            'inview': 'onComponentInView'
        },

        onComponentInView: function(event, visible) {
            if (visible) {
                this.setCompletionStatus();
            }
        },

        preRender: function () {

            // register a listener to be able to change
            // the iframe size when the view resize
            // to properly display the hosted animation
            this.listenTo(Adapt, 'device:changed', this.resizeAnimationFrame);

            // model prop defining the iframe URL and
            // animation entry point file (can be
            // index.html or any file with .OAM extension)
            var entryPointUrl;

            // gets the assets url
            var animation = this.model.get('animation');

            // .OAM files are compressed files with custom
            // extension. The Adapt AT unpack them into the
            // course assets folder but the reference in the
            // model points to the orginal OAM file. So here
            // you check the animation file extension, when OAM
            // you look for the index.html that is always available
            // inside an unpacked OAM folder.
            if(animation.indexOf('.oam')!==-1) {
                entryPointUrl = animation.replace('.oam','/index.html');
            }
            else { // regular single page animation (HTML)
                entryPointUrl = animation;
            }

            this.model.set('guid', uuidv4());
            this.model.set('entryPointUrl', entryPointUrl);
        },

        postRender: function () {
            guid = this.model.get('guid');
            $frame = this.$('#adaptAnimationFrame_'+guid+' iframe');

            // first size stetting, default one
            this.resizeAnimationFrame(Adapt.device.screenSize);
            this.setReadyStatus();
        },

        resizeAnimationFrame: function(size) {
            var height = $frame.attr('data-height-' + size);
            $frame.height(height);
        }
    });

    Adapt.register('adaptAnimationFrame', component);

    return component;
});
