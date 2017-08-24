var general = {
    checkElem: function(elem) {
        if ($(elem).length > 0) {
            return true;
        } else {
            return false;
        }
    },
    toggleMenu: function() {
        $('.menu-list li a').off('click');
        if ($(window).width() <= 768) {
            $('.menu-list li a').on('click', function() {
                var $this = $(this).parents('ul');
                $('.menu-list li ul').not($this).slideUp();
                if (!$(this).next('ul').is(':visible')) {
                    $(this).addClass('active');
                    $(this).next('ul').slideDown();
                } else {
                    $(this).removeClass('active');
                    $(this).next('ul').slideUp();
                }

                if ($('.dropdown-menu-usermenu').is(':visible')) {
                    $('.dropdown-menu-usermenu').hide();
                }

                return false;
            });
        }
    },
    mbShowMenu: function() {
        $('.menu-main-menu > li > a').unbind('click');
        $('.menu-main-menu > li > a').click(function() {
            var $p = $(this).next('.menu-list');
            $('.menu-list').not($p).hide();
            if (!$(this).next('.menu-list').is(':visible') || $(this).next('.menu-list').css('display') == 'none') {
                $(this).next('.menu-list').show();
            } else {
                $(this).next('.menu-list').hide();
            }

            if ($('.dropdown-menu-usermenu').is(':visible')) {
                $('.dropdown-menu-usermenu').hide();
            }

            return false;
        });

        $('.menu-main-menu > li').mouseleave(function() {
            $('.menu-list').hide();
        });
    },
    mbHideMenu: function() {
        $('.close-menu').click(function() {
            $('.menu-list').hide();
        });
    },
    toggleDropdownUser: function() {
        $('.dropdown-user > a').unbind('click');
        $('.dropdown-menu-usermenu > li > a').unbind('click');
        $('.dropdown-menu-usermenu > li > a').on('click', function(e) {
            $('.dropdown-menu-usermenu li ul').slideUp('fast');
            if (!$(this).next('ul').is(':visible') || $(this).next('ul').css('display') == 'none') {
                $(this).next('ul').slideDown('fast');
            } else {
                $(this).next('ul').slideUp('fast');
            }

            return false;
        });

        $('.dropdown-user').mouseleave(function() {
            $(this).find('.dropdown-menu').hide();
        });

        $('.dropdown-user > a').on('click', function(e) {
            if (!$('.dropdown-menu-usermenu').is(':visible') || $('.dropdown-menu-usermenu').css('display') == 'none') {
                $('.dropdown-menu-usermenu').show();
            } else {
                $('.dropdown-menu-usermenu').hide();
            }

            if ($('.menu-list').is(':visible') || $('.menu-list').css('display') != 'none') {
                $('.menu-list').hide();
            }

            return false;
        });
    },
    backToTop: function() {
        $('.back-to-top').click(function() {
            $('html, body').animate({
                    scrollTop: 0
                },
                1000);
            return false;
        });
    },
    showModalChangePW: function() {
        $('#modalChangePassword').modal('show');
    }

};

var proposal_create = {
    toggleMenu: function() {
        if ($('.btn-close-menu').length > 0) {
            $('.btn-close-menu').click(function() {
                if (!$('.g-proposal-g-button').is(':visible')) {
                    $('.g-proposal-g-button').slideDown('fast');
                    $(this).find('.hamburger--spin').addClass('is-active');
                } else {
                    $('.g-proposal-g-button').slideUp('fast');
                    $(this).find('.hamburger--spin').removeClass('is-active');
                }
                return false;
            });
        }
    },
    fixedMenu: function(o) {
        var s;
        if ($('.g-proposal-func').length > 0) {
            s = $(window).scrollTop();
            var h = $('.g-proposal-func').outerHeight();
            if (s >= o) {
                $('.g-proposal-func').addClass('fixed');
                $('.space').height(h);
            } else {
                $('.g-proposal-func').removeClass('fixed');
                $('.space').height(0);
            }
        }
    }
};

var o;

$(document).ready(function() {

    $(document).click(function() {
        if ($('.menu-list').is(':visible')) {
            $('.menu-list').hide();
        }

        if ($('.dropdown-menu-usermenu').is(':visible')) {
            $('.dropdown-menu-usermenu').hide();
        }

    });

    var temp = setInterval(function() {
        o = (general.checkElem('.g-proposal-func')) ? $('.g-proposal-func').offset().top : 0;
        if (general.checkElem('.g-proposal-func')) {
            clearInterval(temp);
        }
    }, 300);



    proposal_create.fixedMenu(o);
    $(window).scroll(function() {
        proposal_create.fixedMenu(o);

        if ($(window).scrollTop() > 200) {
            $('.back-to-top').css('opacity', 1);
        } else {
            $('.back-to-top').css('opacity', 0);
        }
    });

    $('.file-item .item p').matchHeight({
        byRow: true,
        property: 'height',
        target: null,
        remove: false
    });

    general.backToTop();

});

$(window).resize(function() {
    general.toggleMenu();

    if ($(window).width() >= 768) {
        $('.g-proposal-g-button').show();
    }

});


function applyCleaveJs(){
    $('.format_number').each(function(){
        var t = Date.now() + Math.floor(Math.random() * 10000);
        var newClass = 'format_number-' + t;
        $(this).removeClass('format_number').addClass(newClass);

        if($('.' + newClass).length){
            var cleaveCustom = new Cleave('.' + newClass, {
                            numeral: true,
                            numeralPositiveOnly: true
            });
        }
    })
    $('.format_number_decimal').each(function(){
        var t = Date.now() + Math.floor(Math.random() * 10000);
        var newClass = 'format_number_decimal-' + t;
        $(this).removeClass('format_number_decimal').addClass(newClass);
        if($('.' + newClass).length){
            var cleaveCustom = new Cleave('.' + newClass, {
                            numeral: true,
                            numeralPositiveOnly: true,
                            numeralDecimalScale: 1
            });
        }
    })
}
