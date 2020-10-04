$('.sidebar').css({
    'margin-left': -$('.sidebar').width()
});
$('.container-inner').css({
    'width': '100%',
    'right': 0
});

$(document).ready(function () {
    updateSidebarHeight()
});
$(function () {
    $(window).resize(function () {
        updateSidebarHeight();
    });
    $('.show_hide').click(function () {
        showHideSidebar();
    });
});

function updateSidebarHeight() {
    $('.sidebar').css('height', $(window).height());
}

function showHideSidebar() {
    if (!$('.sidebar').hasClass('hidden')) {
        $('.sidebar').addClass('hidden');
        $('.sidebar').css({
            'margin-left': -$('.sidebar').width()
        });
        $('.container-inner').css({
            'width': '100%',
            'left': 0
        });
    } else {
        $('.sidebar')
            .removeClass('hidden')
            .removeAttr('style');
        $('.container-inner').removeAttr('style');
        updateSidebarHeight();
    }
}