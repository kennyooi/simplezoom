/**
 *   simplezoom.JS 
 *   - Responsive image lightbox jQuery plugin
 *   
 *   Description    : A simple and lightweight jQuery plugin for responsive image lightbox effect inspired by medium.com using CSS3 transitions
 *   Demo URI       : http://www.inwebson.com
 *   Author         : Kenny
 *   Author URI     : http://www.inwebson.com
 *   Version        : 1.0.0
 *   License        : GPLv2 or later
 */
(function($){

    /*
    * plugin default options
    */
    var defaults = {
        classie         : '',
        offset          : 40,     //padding offset
        scrollclose     : true,
        imgclass        : 'img',
        duration        : 0,
        modalTmpl       : null,
        loaderTmpl      : null
    };


    /*
    * simplezoom modal template
    * # will be overwrited by passing modalTmpl attribute to option
    * # NOTE:
    *   .simplezoom-item must be defined inside modalTmpl for simplezoom to work
    *   {{img}} tag will be replaced with default image url 
    */
    var TEMPLATE  = '<div class="modal-simplezoom modal">'+
                        '<div class="modal-bg"></div>'+
                        '<div class="modal-content">'+
                            '<div class="simplezoom-item">'+
                                '<img src="{{img}}" alt="simplezoom-img" />'+
                            '</div>'+
                        '</div>'+
                    '</div>';

    var LOADER = '<div class="simplezoom-loader loader"><i></i></div>';


    /*
    * simplezoom base constructor
    */
    function SimpleZoom(el, options) {
        
        //define variables
        this.$el = $(el);
        this.options = $.extend(true, {}, defaults, options, this.$el.data());
        
        this.$img = this.$el.find( this.options.imgclass );
        if ( this.$img.length === 0 ) return;
        this.$img = this.$img.first();  //get first element only
        
        this.img_lg = this.$el.attr('href');
        this.img_sm = this.$img.attr('src');
        if ( !this.img_lg || !this.img_sm || this.img_lg == '#' ) return;  //check if img available

        var self = this;
        //bind event
        this.$el.on('click.simplezoom', function(e) {
            e.preventDefault();

            self.showModal();
        });
    }

    $.extend(SimpleZoom.prototype, {

        /*
        * show simplezoom modal
        */
        showModal: function() {
            var self = this,
                timer = null;

            this.$modal = this.createModal( this.img_sm );
            this.$content = this.$modal.find('.simplezoom-item');
            this.setInitPosition();

            //set duration 
            if ( this.options.duration ) 
                this.$content.css('transitionDuration', this.options.duration + 'ms');

            //hide original img 
            this.$img.css('visibility', 'hidden');

            //load img_sm
            this.loadImageMeta(this.img_sm, function(meta) {
                //in case of user cancelled modal 
                if (!self.$modal || self.isClosing) return;

                //update content img
                self.setFullPosition( meta );

                //show loading state
                self.$content.append( self.options.loaderTmpl || LOADER );
                self.$modal.addClass('in loading');

                //load img_lg
                self.loadImageMeta(self.img_lg, function(meta) {
                    //in case of user cancelled modal 
                    if (!self.$modal || self.isClosing) return;
                    self.$modal.removeClass('loading');

                    //if image load failure
                    if (!meta) return;

                    //update img src
                    self.$content.find('img').attr('src', self.img_lg);

                    //update content img again
                    self.setFullPosition( meta );

                    //trigger onImageLoaded event
                    self.evtTrigger('onImageLoaded');
                });

                //bind resize event
                $(window).on('resize.simplezoom', function(e) {
                    clearTimeout(timer);
                    timer = setTimeout(function() {
                        self.setFullPosition( meta );
                    }, 100);
                });                

                //bind close events
                self.$modal.on('click', function(e) {
                    self.closeModal();
                });

                //enable close modal on scroll
                if (self.options.scrollclose) {
                    $(window).on('scroll.simplezoom', function(e) {
                        self.closeModal();
                    });
                }
            });

            //trigger onModalInit event
            self.evtTrigger('onModalInit');
        },


        /*
        * remove modal
        */
        closeModal: function() {
            var self = this;
            //update state
            this.isClosing = true;

            //fade out modal
            this.$modal.removeClass('in');

            //not working in FF?
            this.$content.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function() {
                //remove modal
                self.$modal.remove();
                self.$modal = null;
                //show default img
                self.$img.css('visibility', 'visible');
                //kill event
                $(window).off('resize.simplezoom').off('scroll.simplezoom');
                //reset state
                self.isClosing = false;
            });

            //reset modal to init state
            this.setInitPosition();

            //trigger onModalClosed event
            this.evtTrigger('onModalClosed');
        },


        /*
        * create modal
        * @ img     : default image url
        *
        * # return  : jQuery object
        */
        createModal: function(img) {
            var html = this.options.modalTmpl || TEMPLATE;

            //replace content
            html = html.replace('{{img}}', img);

            return $(html).addClass(this.options.classie).appendTo('body');
        },


        /*
        * set $content to init position
        */
        setInitPosition: function() {
            //get img init css
            var initCSS = {
                width: this.$img.width(),
                height: this.$img.height(),
                left: this.$img.offset().left,
                top: this.$img.offset().top - $(window).scrollTop()
            };

            this.$content.css(initCSS);
        },


        /*
        * update $content to full position
        * @ meta    : image meta (w, h)
        */
        setFullPosition: function(meta) {
            var i_width, i_height, w_width, w_height, i_ratio, w_ratio, offsetX, offsetY;

            i_width = meta.w;
            i_height = meta.h;
            i_ratio = i_width / i_height;
            w_width = $(window).width() - this.options.offset * 2;
            w_height = $(window).height() - this.options.offset * 2;
            w_ratio = w_width / w_height;

            if (w_ratio > i_ratio) {  //fix height, set width
                i_height = Math.min(w_height, i_height);
                i_width = i_height * i_ratio;
            }
            else {  //fix width, set height
                i_width = Math.min(w_width, i_width);
                i_height = i_width / i_ratio;
            }
            offsetX = ($(window).width() - i_width) / 2;
            offsetY = ($(window).height() - i_height) / 2;

            this.$content.css({
                width: i_width,
                height: i_height,
                left: offsetX,
                top: offsetY
            });
        },


        /*
        * load image meta
        * @ url     : image url
        * @ callback(imgMeta)
        */
        loadImageMeta: function(url, callback) {
            var self = this;

            $('<img />')
            .load(function() {
                callback({ 
                    w: this.width, 
                    h: this.height 
                });
            })
            .error(function() {
                //trigger onImageError event
                self.evtTrigger('onImageError');

                callback(null);
            })
            .attr('src', url);
        },


        /*
        * event trigger handler
        * @ name    : event name
        */
        evtTrigger: function(name) {
            if ( !name || 
                    !this.options[name] || 
                    (typeof this.options[name] != 'function') ) 
                return;

            //trigger method
            this.options[name].call(this, this.$el, this.$modal);
        }

        
    });

    $.fn.simplezoom = function(options) {
        var attribute = 'iws_simplezoom';

        return this.each( function() {
            var instance = $.data(this, attribute);
            if (!instance) {
                instance = new SimpleZoom( this, options );
                $.data(this, attribute, instance);
            }
        });
    }

})(jQuery);