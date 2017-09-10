import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { ScriptService } from './../../../services';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from 'ng2-translate';
import { Configuration } from './../../../shared';
import { LocalStorageService } from 'angular-2-local-storage';

declare var jQuery: any;
declare var JACQUELINE_STORAGE: any;
declare var jacqueline_init_actions: any;
declare var initRevSlider: any;
declare var initEssGrid: any;
declare var itemsmenu: any;
declare var window: any;
declare var document: any;



@Component({
	selector: 'app-public-root',
	templateUrl: './public.component.html',
})

export class PublicComponent  {
	private subscription: Subscription;

	curRouting?: string;
	template:string;
	template_home: Array<any> = ['', 'home', 'trang-chu'];
	module_name: string;

	page_content_wrap: string = 'page_content_wrap page_paddings_no';

	// template_pic
	constructor(
		private _ScriptService: ScriptService,
		private _Router: Router,
		private _TranslateService: TranslateService,
		private _Configuration: Configuration,
		private _LocalStorageService: LocalStorageService
	) {
		JACQUELINE_STORAGE['theme_init_counter'] = 0;

	}

	ngAfterContentChecked() {
    	let routing = this._Router.url;
		if(this.curRouting != routing){
			this.curRouting = routing;
			var str = routing.substring(1);


			this.subscription = this._TranslateService.get('PUBLIC').subscribe((res: string) => {
				this.module_name = res[str];
			});

			this._Configuration.language_code = String(this._LocalStorageService.get('language_code'));
			this.template = 'default';
			if(this.template_home.indexOf(str) > -1) {
				this.template = 'slide';
			}
			console.log('erererr')
			// this._ScriptService.load('theme_shortcodes', 'widget', 'accordion', 'custom', 'core_init', 'core_googlemap', 'grid_layout').then(data => {
				// 

			// this.initLayout();
			setTimeout(() => {
				JACQUELINE_STORAGE['theme_init_counter'] = 0;
				jacqueline_init_actions();
				if (jQuery(".rev_slider").length > 0) { initRevSlider() };
				if (jQuery(".esg-grid").length > 0) { initEssGrid() };
				itemsmenu();
				
				
	            
			}, 1000)



	   //          //=========================
	   //          if (jQuery(".rev_slider").length > 0) {initRevSlider()};
				// if (jQuery(".esg-grid").length > 0) {initEssGrid()};
				// itemsmenu();

	        // }).catch(error => console.log(error));
			// jacqueline_init_actions();
		}
    }

    onActivate(componentRef){
		let action = componentRef.getAction();
		switch (action) {
			case 'list':
				this.page_content_wrap = 'page_content_wrap';
				break;
			case 'contact':
			case 'detail':
				this.page_content_wrap = 'page_content_wrap page_paddings_yes';
				break;
			default:
				// code...
				break;
		}
    }

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	initLayout() {
		document.documentElement.className += " js_active ", document.documentElement.className += "ontouchstart" in document.documentElement ? " sc_mobile " : " sc_desktop ",
	    function() {
	        for (var prefix = ["-webkit-", "-moz-", "-ms-", "-o-", ""], i = 0; i < prefix.length; i++) prefix[i] + "transform" in document.documentElement.style && (document.documentElement.className += " sc_transform ")
	    }(), "function" != typeof window.sc_plugin_flexslider && (window.sc_plugin_flexslider = function($parent) {
	        var $slider = $parent ? $parent.find(".flexslider") : jQuery(".flexslider");
	        $slider.each(function() {
	            var this_element = jQuery(this),
	                sliderSpeed = 800,
	                sliderTimeout = 1e3 * parseInt(this_element.attr("data-interval")),
	                sliderFx = this_element.attr("data-flex_fx"),
	                slideshow = !0;
	            0 === sliderTimeout && (slideshow = !1), this_element.is(":visible") && this_element.flexslider({
	                animation: sliderFx,
	                slideshow: slideshow,
	                slideshowSpeed: sliderTimeout,
	                sliderSpeed: sliderSpeed,
	                smoothHeight: !0
	            })
	        })
	    }), "function" != typeof window.sc_googleplus && (window.sc_googleplus = function() {
	        0 < jQuery(".googleplus").length && ! function() {
	            var po = document.createElement("script");
	            po.type = "text/javascript", po.async = !0, po.src = "//apis.google.com/js/plusone.js";
	            var s = document.getElementsByTagName("script")[0];
	            s.parentNode.insertBefore(po, s)
	        }()
	    }), "function" != typeof window.sc_pinterest && (window.sc_pinterest = function() {
	        0 < jQuery(".pinterest").length && ! function() {
	            var po = document.createElement("script");
	            po.type = "text/javascript", po.async = !0, po.src = "//assets.pinterest.com/js/pinit.js";
	            var s = document.getElementsByTagName("script")[0];
	            s.parentNode.insertBefore(po, s)
	        }()
	    }), "function" != typeof window.sc_progress_bar && (window.sc_progress_bar = function() {
	        "undefined" != typeof jQuery.fn.waypoint && jQuery(".sc_progress_bar").waypoint(function() {
	            jQuery(this).find(".sc_single_bar").each(function(index) {
	                var $this = jQuery(this),
	                    bar = $this.find(".sc_bar"),
	                    val = bar.data("percentage-value");
	                setTimeout(function() {
	                    bar.css({
	                        width: val + "%"
	                    })
	                }, 200 * index)
	            })
	        }, {
	            offset: "85%"
	        })
	    }), "function" != typeof window.sc_waypoints && (window.sc_waypoints = function() {
	        "undefined" != typeof jQuery.fn.waypoint && jQuery(".animate_when_almost_visible:not(.start_animation)").waypoint(function() {
	            jQuery(this).addClass("start_animation")
	        }, {
	            offset: "85%"
	        })
	    }), "function" != typeof window.sc_toggleBehaviour && (window.sc_toggleBehaviour = function($el) {
	        function event(e) {
	            e && e.preventDefault && e.preventDefault();
	            var title = jQuery(this),
	                element = title.closest(".sc_toggle"),
	                content = element.find(".sc_toggle_content");
	            element.hasClass("sc_toggle_active") ? content.slideUp({
	                duration: 300,
	                complete: function() {
	                    element.removeClass("sc_toggle_active")
	                }
	            }) : content.slideDown({
	                duration: 300,
	                complete: function() {
	                    element.addClass("sc_toggle_active")
	                }
	            })
	        }
	        $el ? $el.hasClass("sc_toggle_title") ? $el.unbind("click").click(event) : $el.find(".sc_toggle_title").unbind("click").click(event) : jQuery(".sc_toggle_title").unbind("click").on("click", event)
	    }),  "function" != typeof window.sc_teaserGrid && (window.sc_teaserGrid = function() {
	        var layout_modes = {
	            fitrows: "fitRows",
	            masonry: "masonry"
	        };
	        jQuery(".grid .teaser_grid_container:not(.carousel), .filtered_grid .teaser_grid_container:not(.carousel)").each(function() {
	            var $container = jQuery(this),
	                $thumbs = $container.find(".thumbnails"),
	                layout_mode = $thumbs.attr("data-layout-mode");
	            $thumbs.isotope({
	                itemSelector: ".isotope-item",
	                layoutMode: "undefined" == typeof layout_modes[layout_mode] ? "fitRows" : layout_modes[layout_mode]
	            }), $container.find(".categories_filter a").data("isotope", $thumbs).click(function(e) {
	                e.preventDefault();
	                var $thumbs = jQuery(this).data("isotope");
	                jQuery(this).parent().parent().find(".active").removeClass("active"), jQuery(this).parent().addClass("active"), $thumbs.isotope({
	                    filter: jQuery(this).attr("data-filter")
	                })
	            }), jQuery(window).bind("load resize", function() {
	                $thumbs.isotope("layout")
	            })
	        })
	    }), "function" != typeof window.sc_slidersBehaviour && (window.sc_slidersBehaviour = function() {
	        jQuery(".gallery_slides").each(function(index) {
	            var $imagesGrid, this_element = jQuery(this);
	            if (this_element.hasClass("slider_nivo")) {
	                var sliderSpeed = 800,
	                    sliderTimeout = 1e3 * this_element.attr("data-interval");
	                0 === sliderTimeout && (sliderTimeout = 9999999999), this_element.find(".nivoSlider").nivoSlider({
	                    effect: "boxRainGrow,boxRain,boxRainReverse,boxRainGrowReverse",
	                    slices: 15,
	                    boxCols: 8,
	                    boxRows: 4,
	                    animSpeed: sliderSpeed,
	                    pauseTime: sliderTimeout,
	                    startSlide: 0,
	                    directionNav: !0,
	                    directionNavHide: !0,
	                    controlNav: !0,
	                    keyboardNav: !1,
	                    pauseOnHover: !0,
	                    manualAdvance: !1,
	                    prevText: "Prev",
	                    nextText: "Next"
	                })
	            } else this_element.hasClass("image_grid") && (jQuery.fn.imagesLoaded ? $imagesGrid = this_element.find(".image_grid_ul").imagesLoaded(function() {
	                $imagesGrid.isotope({
	                    itemSelector: ".isotope-item",
	                    layoutMode: "fitRows"
	                })
	            }) : this_element.find(".image_grid_ul").isotope({
	                itemSelector: ".isotope-item",
	                layoutMode: "fitRows"
	            }))
	        })
	    }), "function" != typeof window.sc_prettyPhoto && (window.sc_prettyPhoto = function() {
	        try {
	            jQuery && jQuery.fn && jQuery.fn.prettyPhoto && jQuery('a.prettyphoto, .gallery-icon a[href*=".jpg"]').prettyPhoto({
	                animationSpeed: "normal",
	                hook: "data-rel",
	                padding: 15,
	                opacity: .7,
	                showTitle: !0,
	                allowresize: !0,
	                counter_separator_label: "/",
	                hideflash: !1,
	                deeplinking: !1,
	                modal: !1,
	                callback: function() {
	                    var url = location.href,
	                        hashtag = url.indexOf("#!prettyPhoto") ? !0 : !1;
	                    hashtag && (location.hash = "")
	                },
	                social_tools: ""
	            })
	        } catch (err) {
	            window.console && window.console.log && console.log(err)
	        }
	    }), "function" != typeof window.sc_google_fonts && (window.sc_google_fonts = function() {
	        return !1
	    }), window.scParallaxSkroll = !1, "function" != typeof window.sc_rowBehaviour && (window.sc_rowBehaviour = function() {
	        function fullWidthRow() {
	            var $elements = $('[data-sc-full-width="true"]');
	            $.each($elements, function(key, item) {
	                var $el = $(this);
	                $el.addClass("sc_hidden");
	                var $el_full = $el.next(".sc_row-full-width");
	                if ($el_full.length || ($el_full = $el.parent().next(".sc_row-full-width")), $el_full.length) {
	                    var el_margin_left = parseInt($el.css("margin-left"), 10),
	                        el_margin_right = parseInt($el.css("margin-right"), 10),
	                        offset = 0 - $el_full.offset().left - el_margin_left,
	                        width = $(window).width();
	                    if ($el.css({
	                            position: "relative",
	                            left: offset,
	                            "box-sizing": "border-box",
	                            width: $(window).width()
	                        }), !$el.data("scStretchContent")) {
	                        var padding = -1 * offset;
	                        0 > padding && (padding = 0);
	                        var paddingRight = width - padding - $el_full.width() + el_margin_left + el_margin_right;
	                        0 > paddingRight && (paddingRight = 0), $el.css({
	                            "padding-left": padding + "px",
	                            "padding-right": paddingRight + "px"
	                        })
	                    }
	                    $el.attr("data-sc-full-width-init", "true"), $el.removeClass("sc_hidden")
	                    console.log('tét')
	                }
	            }), $(document).trigger("sc-full-width-row", $elements)
	        }

	        function fullHeightRow() {
	            var $element = $(".sc_row-o-full-height:first");
	            if ($element.length) {
	                var $window, windowHeight, offsetTop, fullHeight;
	                $window = $(window), windowHeight = $window.height(), offsetTop = $element.offset().top, windowHeight > offsetTop && (fullHeight = 100 - offsetTop / (windowHeight / 100), $element.css("min-height", fullHeight + "vh"))
	            }
	            $(document).trigger("sc-full-height-row", $element)
	        }

	        function fixIeFlexbox() {
	            var ua = window.navigator.userAgent,
	                msie = ua.indexOf("MSIE ");
	            (msie > 0 || navigator.userAgent.match(/Trident.*rv\:11\./)) && $(".sc_row-o-full-height").each(function() {
	                "flex" === $(this).css("display") && $(this).wrap('<div class="sc_ie-flexbox-fixer"></div>')
	            })
	        }
	        var $ = window.jQuery;
	        $(window).off("resize.scRowBehaviour").on("resize.scRowBehaviour", fullWidthRow).on("resize.scRowBehaviour", fullHeightRow), fullWidthRow(), fullHeightRow(), fixIeFlexbox()
	    }), "function" != typeof window.sc_gridBehaviour && (window.sc_gridBehaviour = function() {
	        jQuery.fn.scGrid && jQuery("[data-sc-grid]").scGrid()
	    }), "function" != typeof window.getColumnsCount && (window.getColumnsCount = function(el) {
	        for (var find = !1, i = 1; !1 === find;) {
	            if (el.hasClass("columns_count_" + i)) return find = !0, i;
	            i++
	        }
	    });
	
	}
}
