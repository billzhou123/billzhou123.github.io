/*!
Next - HTML App Landing Page, v1.0
Main JS file
Copyright © 2016 5Studios.net
http://5studios.net
*/
'use strict';

(function() {
	// Avoid `console` errors in browsers that lack a console.
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
	
	// Fix skrollr behavoir when used more than one
	Pace.on("done", function() {
        setTimeout(function () {
            skrollr.init();
        }, 100);
    });
}());

// Place any jQuery/helper plugins in here.
$(function() {
    /**
     * Bootstrap default screen sizes.
    **/
    var screen_breakpoints = {
        screen_xs : 480,
        screen_sm: 768,
        screen_md: 992,
        screen_lg: 1200
    };

    var screen_size = {
        screen_xs_min: screen_breakpoints.screen_xs,
        screen_sm_min: screen_breakpoints.screen_sm,
        screen_md_min: screen_breakpoints.screen_md,
        screen_lg_min: screen_breakpoints.screen_lg,

        screen_xs_max: (screen_breakpoints.screen_sm - 1), //(screen_sm_min - 1),
        screen_sm_max: (screen_breakpoints.screen_md - 1), //(screen_md_min - 1),
        screen_md_max: (screen_breakpoints.screen_lg - 1)  //(screen_lg_min - 1),
    };

    var screen_devices = {
        screen_phone: screen_size.screen_xs_min,
        screen_tablet: screen_size.screen_sm_min,
        screen_desktop: screen_size.screen_md_min,
        screen_lg_desktop: screen_size.screen_lg_min,

        grid_float_breakpoint: screen_size.screen_sm_min,
        grid_float_breakpoint_max: (screen_size.screen_sm_min - 1) //(grid_float_breakpoint - 1)
    };

	/**
     * FIXED NAVBAR
     **/
    var $navbar = $("#site-navigation"),
        navTopPos = $navbar.offset().top,
        navFixedTop = $navbar.hasClass('navbar-fixed-top'),
        navStickyPoint = 180;
	
	function navBarFixToTop(scrollTop) {
        if (navFixedTop) {
            if (scrollTop >= navStickyPoint) {
                $navbar.addClass("navbar-sticky");
            } else {
                $navbar.removeClass("navbar-sticky");
            }
        } else {
            if(scrollTop >= navTopPos) {
                $navbar.addClass('navbar-sticky');

                setTimeout(function() {
                    $navbar.addClass('animate-children');
                }, 50);
            } else {
                $navbar.removeClass('navbar-sticky');

                setTimeout(function() {
                    $navbar.removeClass('animate-children');
                }, 50);
            }
        }
    }
	
    /**
     *  NAVBAR SIDE COLLAPSIBLE
     **/
    $(".navbar-toggle").on("click", function() {
        $navbar.toggleClass("navbar-expanded");
    });

    /**
     * SCROLLING NAVIGATION
     * Enable smooth transition animation when scrolling
     **/
    $('.navbar-nav a:not([target]), a.scrollto').on('click', function (event) {
        event.preventDefault();

        var scrollAnimationTime = 1200;
        var target = this.hash;
        $('html, body').stop().animate({
            scrollTop: $(target).offset().top
        }, scrollAnimationTime, 'easeInOutExpo', function () {
            window.location.hash = target;
        });
    });

    navBarFixToTop($(window).scrollTop());

    /** COLLAPSE MOBILE NAVIGATION
     * Collapse navbar menu when clicked an option (in mobile devices)
     **/
    $navbar.on('click', '.navbar-nav', function (e) {
        if ($(e.target).is('a')) {
            $navbar.removeClass("navbar-expanded");
        }
    });

    /**
     * FORMS STUFF
     **/
    $(".form").each(function(i, form) {
        var $form = $(form);
        var dataMsg = $form.data('msg');
        var mc = dataMsg && dataMsg !== 'this' ? $form.closest(dataMsg) : form;

        var $message = $("<div/>", {
            class: 'form-message alert'
        }).prependTo(mc);

        $(mc).on('click', 'button.close', function() {
            $(this).parent().removeClass('visible');
        });

        $form.data('message', $message);

        var options = {
            errorPlacement: function(error, element) {
                if (element.parent().hasClass("input-wrapper")) {
                    error.insertAfter(element.parent());
                } else {
                    error.insertAfter(element);
                }
            }
        };

        if ($form.data("validate-on") == "submit") {
            $.extend(options, {
                onfocusout: false,
                onkeyup: false
            });
        }

        // call to validate plugin
        $form.validate(options);
    });

    $(".form").submit(function(event) {
        function writeError (errors) {
            var $fm = $message
                .removeClass('alert-success')
                .addClass('alert-danger').addClass('visible')
                .html('<i class="fa-warning"></i><b>Oops!</b> Something went wrong');

            if (errors) {
                var ul = $("<ul class='list list-unstyled'></ul>");
                $.each(errors, function(i, v) {
                    ul.append("<li><b>" + i + ": </b>" + v + "</li>");
                });

                $fm.append(ul);
            }
        }

        // Submit the form
        event.preventDefault();
        var $form = $(this);
        var $submit = $("button[type=submit]", $form);
        var $message = $form.data('message');

        // Verify everything is OK
        // valid() method is part of jQuery.validation plugin
        if($form.valid()) {
            $submit.button('loading');
            var action = $form.attr('action');

            $.ajax({
                url: action,
                type: 'POST',
                data: $form.serializeArray(),
                dataType : 'json'
            }).done(function(data) {
                if (data.result) {
                    $("input, textarea", $form).removeClass("error");

                    $message
                        .removeClass('alert-danger')
                        .addClass('alert-success').addClass('visible')
                        .html('<i class="fa-check"></i><b> Thank you!</b>' + data.message);

                    $form[0].reset();
                } else {
                    writeError(data.errors);
                }
            }).fail(function() {
                writeError();
            }).always(function() {
                $submit.button('reset');
                $message.prepend('<button type="button" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>');
            });
        }

        return false;
    });

    $(".modal-dialog").on("click", ".modal-submit", function() {
        var target = $(this).data("target");
        if (target) {
            $(target).submit();
        }
    });

    /**
     * HEADER
     **/
    var $headerSite = $('#header-site');

    // HEADER SLIDER INSIDE MOCKUP
    var $headerSlidesWrapper = $(".images-wrapper", $headerSite);
    var headerCount = $headerSlidesWrapper.data("slides-count");
    var headerSlides = [];

    for (var h = 1; h <= headerCount; h++) {
        var img = "img/header/slider/" + h + ".jpg";

        headerSlides.push(
            $("<li/>", {
                html: $("<figure/>", {
                    class: "mockup",
                    html: $("<img/>", {
                        src: img
                    })
                })
            })
        );
    }

    $('.slides', $headerSlidesWrapper).append(headerSlides);

    $headerSlidesWrapper.flexslider({
        animation: "slide",
        controlsContainer: '#header-site .slides-wrapper',
        directionNav: false
    });

    // VIDEO TOUR PREVIEW
    $headerSite.on('click', '[data-toggle="tour"]', function(event) {
        event.preventDefault();

        // If you change this, also make sure to change it on CSS - #start-tour
        if($(window).outerWidth() < screen_devices.grid_float_breakpoint) {
            $('body, html').animate({'scrollTop': $('.video-tour').offset().top - 30 }, 200);
        } else {
            $headerSite.addClass('tour-started');
            playVideo($('.video-slides li:first-child'));
        }
    });

    $headerSite.on('click', '.slider-nav li', function() {
        goToSlider($(this));
    });

    function playVideo($li) {
        $li.addClass('active'); // set the <li/> as active
        $('ul li', $('.slider-nav')).eq($li.index()).addClass('active');

        var $activeVideo = $('video', $li);
        $('video', $li.siblings('li')).each(function() {
            $(this).get(0).pause();
        });

        if($activeVideo.length > 0) {
            // video already loaded, play it
            $activeVideo.get(0).currentTime = 0;
            $activeVideo.get(0).play();
        } else {
            // load video
            var loaded = false,
                url = $('.video-wrapper img', $li).data('video');

            var $video = $('<video>' +
                '<source src="' + url + '.mp4" type="video/mp4">' +
                '<source src="' + url + '.webm" type="video/webm">' +
                '<source src="' + url + '.ogv" type="video/ogg">Sorry, your browser does not support HTML5 video.</video>')
                .on({
                    canplaythrough: function() {
                        loaded = true;
                    },
                    ended: function() {
                        updateSlider($(this).closest('li'), 'next');
                    }
                })
                .appendTo($('.video-wrapper', $li));

            // check if video is loaded
			var timeout = setInterval(function() {
				if (loaded) {
					$video.get(0).play();
					clearInterval(timeout);
				} else {
					// video is not ready yet
					// console.log('loading...');
				}
			}, 500);
        }
    }

    function updateSlider($active, direction) {
        var $selected = (direction == 'next') ? $active.next() : $active.prev();

        setTimeout(function() {
            $active.removeClass('active');
            $('ul li', $('.slider-nav')).eq($active.index()).removeClass('active');
        }, 50);

        if ($active.is(':last-child')) {
            // No more videos to play
            $headerSite.removeClass('tour-started');
        } else {
            // load the video for the new slider
            playVideo($selected);
        }
    }

    function goToSlider($li) {
        var $active = $('li.active', $('.slider-nav')),
            $slides = $('li', $('.video-slides'));

        setTimeout(function() {
            $active.removeClass('active');
            $slides.eq($active.index()).removeClass('active');
        }, 50);

        playVideo($slides.eq($li.index()));
    }

    // HEADER FULL-WIDTH CSS SLIDER IMAGES
    var $headerFsSlidesWrapper = $(".header-slider .slides-wrapper");
    var headerFsSlidesCount = $headerFsSlidesWrapper.data("slides-count");
    var headerFsSlides = [];

    for (var i = 1; i <= headerFsSlidesCount; i++) {
        var src = "img/header/bg/" + i + ".jpg";

        headerFsSlides.push(
            $("<li/>", {
                html: $("<figure/>", {
                    class: "mockup",
                    html: $("<img/>", {
                        src: src
                    })
                })
            }).append(
                $("<div/>", {
                    class: "slides-progress",
                    html: $("<div/>", {
                        class: "progress-bar"
                    })
                })
            )
        );
    }

    $('.slides', $headerFsSlidesWrapper).append(headerFsSlides);

    /**
     * SKROLLR
     **/
    var initSkrollr = function() {
        if ($(window).outerWidth() > screen_devices.grid_float_breakpoint) {
            skrollr.init();
        } else {
            var sk = skrollr.get();

            if (sk !== undefined) {
                sk.destroy();
            }
        }
    };

    /**
     * CLIENTS
     **/
    var $clientSlidesWrapper = $(".clients .slides-wrapper");
    var clientCount = $clientSlidesWrapper.data("slides-count");
    var clientSlides = [];

    for (var i = 1; i <= clientCount; i++) {
        var src = "img/section/clients/" + i + ".svg";

        clientSlides.push(
            $("<li/>", {
                html: $("<figure/>", {
                    class: "mockup",
                    html: $("<img/>", {
                        src: src
                    })
                })
            })
        );
    }

    $('.slides', $clientSlidesWrapper).append(clientSlides);
    $clientSlidesWrapper.flexslider({
        animation: "slide",
        controlNav: false,
        directionNav: false,
        itemWidth: 120,
        itemMargin: 75
    });

    /**
     * PROCESS SLIDER
     **/
    var $processInner = $(".process .process-inner");

    $processInner.flexslider({
        animation: "slide",
        manualControls: ".process-nav li",
        animationLoop: false,
        useCSS: false,
        slideshowSpeed: 4000,
        pauseOnHover: true,
        directionNav: false,

        before: function(slider) {
            var cssClass = "loaded";
            var $target = slider.controlNav.filter('li:nth(' + slider.animatingTo + ')');

            $target.prevAll().addClass(cssClass);
            $target.nextAll().removeClass(cssClass);
        }
    });

    /**
     * FEATURES
     **/
    $('#features-mix').mixItUp({
        load: {
            filter: '.is-personal'
        }
    });

    /**
     * CIRCLIFUL ON STARTED SECTION
     **/
    $('.circle').each(function() {
        var $e = $(this);

        $e.circliful({
            animationStep: 5,
            foregroundBorderWidth: 12,
            backgroundBorderWidth: 6,
            percent: $e.data('percent')
        });
    });

    var equalHeight = function(elems, widthBreakpoint) {
        var elements = [],
            tallest = 0,
            applyWidth = $(window).outerWidth() > widthBreakpoint;

        $(elems).each(function(i, o) {
            var $el = $(o).height('auto');

            if (applyWidth) {
                var height = $el.outerHeight();

                elements.push({
                    "element": $el,
                    "height": height
                });

                elements.forEach(function (e) {
                    if (e.height > tallest) {
                        tallest = height;
                    }

                    e.height = tallest;
                });
            }
        });

        if (applyWidth) {
            elements.forEach(function (e) {
                e.element.height(e.height);
            });
        }
    };

    var processEqHeight = function () {
        var widthBreakpoint = screen_size.screen_sm_max;

        equalHeight('#features .col', widthBreakpoint);
        equalHeight('#started .tab-pane', widthBreakpoint);
    };

    processEqHeight();

    /**
     * SECTION FULL WIDTH VIDEO
     **/
    $('#video').videoplayer('video/comics', {
        play: "fa-play",
        pause: "fa-pause"
    });

    /**
     * SCREENSHOTS SLIDER
     **/
    /** ( ! ) This section could be done in html markup directly
     * since we are just generating HTML markup to make the slider.
     * You could just take this script off and write your own markup, in the following way
     * <a href="path/to/your/image"><img src="path/to/your/image"/></a>
     * write as many <a> tags as images you would like to show
     **/
    var themesVariations = ['#1B99B9', '#EB540A', '#C34444', '#9061C2', '#DE2184', '#CF1332', '#F2CE00', '#790EEB'];
    var $screenshotSlidesWrapper = $(".screenshots.slider .slides-wrapper");
    var screenshotCount = $screenshotSlidesWrapper.data("slides-count");
    var screenshotSlides = [], screenshotNav = [];

    for (var i = 1; i <= screenshotCount; i++) {
        var src = "img/section/screenshots/" + i + ".jpg";

        screenshotSlides.push(
            $("<li/>", {
                html: $("<figure/>", {
                    class: "mockup",
                    html: $("<img/>", {
                        src: src
                    })
                })
            })
        );

        screenshotNav.push(
            $("<li/>", {
                html: $("<span/>", {
                    html: '',
                    css: {
                        'background-color': themesVariations[i-1]
                    }
                })
            })
        );
    }

    $(".screenshots.slider .screenshots-control-nav").append(screenshotNav);
    $('.slides', $screenshotSlidesWrapper).append(screenshotSlides);

    $screenshotSlidesWrapper.flexslider({
        animation: "slide",
        manualControls: ".screenshots.slider .screenshots-control-nav li span",
        directionNav: false
    });

    /**
     * TESTIMONIALS SLIDER
     **/
    $('.testimonials .testimonials-wrapper').flexslider({
        animation: 'slide',
        selector: ".slides > .item",
        pauseOnHover: true,
        controlNav: false,
        prevText: "",
        nextText: ""
    });

    /**
     * DOWNLOAD SLIDER IMAGES
     **/
    var $downloadSlidesWrapper = $(".download .slides-wrapper");
    var downloadCount = $downloadSlidesWrapper.data("slides-count");
    var downloadSlides = [];

    for (var i = 1; i <= downloadCount; i++) {
        var src = "img/section/download/slider/" + i + ".jpg";

        downloadSlides.push(
            $("<li/>", {
                html: $("<figure/>", {
                    class: "mockup",
                    html: $("<img/>", {
                        src: src
                    })
                })
            })
        );
    }

    $('.slides', $downloadSlidesWrapper).append(downloadSlides);

    /**
     * PRICING BOX STUFF
     **/
    // Hover effect (tooltip)
    $(".pricing-box .info").each(function(i, e) {
        var $element = $(e);
        var pos = $element.position();

        $('a', $element).mouseenter(function() {
            var $a = $(this);
            var $content = $a.data('content');

            if (!$content || !$content.length) {
                $content = $a.next().prepend($a.clone());

                $a.data('content', $content);
            }

            $content
                .fadeIn("slow")
                .mouseleave(function() {
                    $content.fadeOut("slow");
                });
        });

        $('.info-content', $element).css({
            top: pos.top,
            left: pos.left
        });
    });

    function calculatePricingCardsPosition() {
        $(".pricing-box .info").each(function(i, e) {
            var $element = $(e);
            var pos = $element.position();

            $('.info-content', $element).css({
                top: pos.top,
                left: pos.left
            });
        });
    };

    // Slider prices
    $('.pricing [data-toggle="slider"]').each(function(i, e) {
        var $element = $(e);
        //TODO: data-rel, if exists take it
        var $price = $('.price', $element.parent().siblings('.plan-price'));
        var $value = $('.value', $element.next());

        var calculatePrice = function(val) {
            // Implement here your own price calculation function
            return (val * 9.99).toFixed(2);
        };

        $element.slider();
        $element.on('change', function(d) {
            var price = calculatePrice(d.value.newValue);

            $price.text(price);
            $value.text(d.value.newValue);
        });
    });

    /**
     * COUNTERS
     **/
    $('.counter').counterUp();

    /**
     * WINDOW EVENTS
     **/
    function windowScroll() {
        var scrollTop = $(window).scrollTop();

        navBarFixToTop(scrollTop);
    }

    $(window)
    .scroll(function () {
        windowScroll();
    })
    .resize(function(){
        initSkrollr();
        processEqHeight();
        calculatePricingCardsPosition();
    });
});
