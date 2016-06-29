$(function() {
    var slideimg = $(".slideimg").slippry({});
    $(".slideimg").on("swipeleft", function() {
        slideimg.goToNextSlide();
        return false
    });
    $(".slideimg").on("swiperight", function() {
        slideimg.goToPrevSlide();
        return false
    });
    var num = 0;
    $("#btns").click(function() {
        if ($("#btns .btns-con .btn-teach").hasClass('hide')) {
            $("#btns .btns-con .btn-remove").rotate({
                animateTo: 90
            });
            var imageLeft = $("#btns .btns-con .btn-remove").offset().left;
            var imageTop = $("#btns .btns-con .btn-remove").offset().top;
            $("#btns .btns-con .btn-teach").removeClass('hide');
            $("#btns .btns-con .btn-teach").animate({
                bottom: 75,
                left: -95
            }).animate({
                bottom: 70,
                left: -90
            }).rotate({
                angle: 0,
                animateTo: 360
            });
            $("#btns .btns-con .btn-require").animate({
                bottom: 75,
                left: 95
            }).animate({
                bottom: 70,
                left: 90
            }).rotate({
                animateTo: 360
            });
            $("#btns .btns-con .btn-learn").animate({
                bottom: 105,
                left: 0
            }).animate({
                bottom: 100,
                left: 0
            }).rotate({
                animateTo: 360
            });
            $('#fullbutton').show()
        } else {
            var imageLeft = $("#btns .btns-con .btn-teach").offset().left;
            var imageTop = $("#btns .btns-con .btn-teach").offset().top;
            $("#btns .btns-con .btn-teach").addClass('hide');
            $("#btns .btns-con .btn-teach").rotate({
                angle: 0,
                animateTo: 720
            });
            $("#btns .btns-con .btn-teach").animate({
                bottom: 80,
                left: -100
            }).animate({
                bottom: 10,
                left: 0
            });
            $("#btns .btns-con .btn-require").addClass('hide');
            $("#btns .btns-con .btn-require").rotate({
                angle: 0,
                animateTo: 720
            });
            $("#btns .btns-con .btn-require").animate({
                bottom: 80,
                left: 100
            }).animate({
                bottom: 10,
                left: 0
            });
            $("#btns .btns-con .btn-learn").addClass('hide');
            $("#btns .btns-con .btn-learn").rotate({
                angle: 0,
                animateTo: 720
            });
            $("#btns .btns-con .btn-learn").animate({
                bottom: 110,
                left: 0
            }).animate({
                bottom: 10,
                left: 0
            });
            $('#fullbutton').hide()
        }
    })

    $('#search .xueicon-classify').click(function() {
        /* Act on the event */
        $("#sliderrt").animate({
            left: '0'
        }, 500);
        $('#fullbutton').show();
    });
    $('#fullbutton').click(function() {
        $("#sliderrt").animate({
            left: '-80%'
        }, 500, function() {
            $('#fullbutton').hide();
        });

    });

    getLocation();
});
