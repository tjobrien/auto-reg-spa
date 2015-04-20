
// makes sure the whole site is loaded
$(window).load(function () {
// will first fade out the loading animation
    $(".loaded").fadeOut();
    // will fade out the whole DIV that covers the website.
    $(".loader").delay(1000).fadeOut("slow");
});




$(document).ready(function () {
    "use strict";


    /*---------------------------------------------*
     * STICKY TRANSPARENT NAVIGATION 
     ---------------------------------------------*/


    var windowWidth = $(window).width();

    if (windowWidth > 767) {
        $(".navbar-1").addClass('custom-nav');
        $(".hide-nav").hide('');
// fade in .sticky_navigation
        $(window).scroll(function () {
            if ($(this).scrollTop() > 100) {
                $('.navbar-1').addClass('scroll-nav animated fadeIn');
                $('.navbar-1').removeClass('custom-nav');
            } else {
                $('.navbar-1').addClass('custom-nav');
                $('.navbar-1').removeClass('scroll-nav animated fadeIn');
            }
        });
    }


    /*---------------------------------------------*
     * STICKY HIDE NAVIGATION 
     ---------------------------------------------*/

    var windowWidth = $(window).width();
    if (windowWidth > 767) {
// hide .sticky_navigation first
        $(".hide-nav").hide();
// fade in .sticky_navigation
        $(window).scroll(function () {
            if ($(this).scrollTop() > 100) {
                $('.hide-nav').fadeIn(1000);
            } else {
                $('.hide-nav').fadeOut(1000);
            }
        });

    }




    /*---------------------------------------------*
     * LOCAL SCROLL
     ---------------------------------------------*/

    $('#main-navbar').localScroll();
    $('.anchor').localScroll();




    /*---------------------------------------------*
     * WOW
     ---------------------------------------------*/
    var wow = new WOW({
        mobile: false, // trigger animations on mobile devices (default is true)
    });
    wow.init();




    /* ------------------------------------------------=
     ---=  MAILCHIMP                 ------
     ---------------------------------------------------= */

    $('#mailchimp').ajaxChimp({
        callback: mailchimpCallback,
        url: "http://facebook.us8.list-manage.com/subscribe/post-json?u=85f515a08b87483d03fee7755&id=dff5d2324f" //Replace this with your own mailchimp post URL. Don't remove the "". Just paste the url inside "".  
    });
    function mailchimpCallback(resp) {
        if (resp.result === 'success') {
            $('.subscription-success').html('<h4><i class="fa fa-check"></i> ' + resp.msg + '</h4>').fadeIn(1000);
            $('.subscription-error').fadeOut(500);
        } else if (resp.result === 'error') {
            $('.subscription-error').html('<h4><i class="fa fa-times-circle"></i> ' + resp.msg + '</h4>').fadeIn(1000);
        }
    }




    /* ------------------------------------------------=
     ---=  ACCORDIAN                 ------
     ---------------------------------------------------= */

    function toggleChevron(e) {
        $(e.target)
                .prev('.panel-heading')
                .find("i.indicator")
                .toggleClass('glyphicon-plus-sign glyphicon-minus-sign');
    }
    $('#accordion').on('hidden.bs.collapse', toggleChevron);
    $('#accordion').on('shown.bs.collapse', toggleChevron);
    $('#accordion2').on('hidden.bs.collapse', toggleChevron);
    $('#accordion2').on('shown.bs.collapse', toggleChevron);

    /* new renewal form*/
    $("#fee-summary").hide();
    $("#error-response").hide();
    //
        console.log("submit"); 
    $('#new_renewal').submit(function(event){
      $('#check').button('loading');
        var str = $("#new_renewal").serializeArray();
        var submit_form = $.ajax({
            url: "https://ca-auto-reg.herokuapp.com/renewals/mobile_create.json",
            type: "post",
            data: str,
            dataType: 'json'

        });
        submit_form.done(function(jqXHR, textStatus){
                var blnError = false;
                console.debug(jqXHR);
                dmv_response = jqXHR.dmv_response;
                renewal = jqXHR.renewal;
                fees = jqXHR.fees;

                   if(dmv_response.status == "FR"){
                   
                    console.log("status FR if fired");
                    if (fees.length > 2){
                    var dmv_fees = parseFloat(dmv_response.total_fees);
                    var service_fee = parseFloat(dmv_response.service_fee);
                    var total_before_shipping = parseFloat(dmv_response.total_fees) + parseFloat(dmv_response.service_fee);
            
                    if(renewal.non_resident_military){
                      var flt_cvlf = parseFloat(cvlf(fees));
                      var flt_cvlfp = parseFloat(cvlfp(fees));
                      var flt_nrm = flt_cvlf + flt_cvlfp
                      total_before_shipping = total_before_shipping - flt_nrm;
                      $("#cvlf").html(flt_nrm);

                    }
                    else{
                      $(".nrm_discount").hide();
                    }
                    var total = total_before_shipping + 0.49

                    $(".modal-body h1").html("Fees:  "  + "$" + total.toFixed(2));
                    $('#fee-summary h1').html("Fees:  " + "$" + total.toFixed(2));
                    //All fees listed on in the div.
                    $('#fee-summary').show();
                    populateFees(fees);
                    //TODO populate total table
                    $("#dmv_total").html(dmv_fees);
                    $("#service_fee").html(service_fee);
                    $("#total").html(total);

                    $("body").scrollTo("#totals");
                    //this little bit of code to encode fees if needed
                    // var strFees = JSON.stringify(fees);
                    // var strEncode = jQuery.base64.encode(strFees);
                    //$('body').scrollTo("#fee-summary", 800);

                  //$("#renew_now").attr("href", "auto-reg-order.html?fees&" + strEncode);
                    $("#renew_now").attr("href", "https://ca-auto-reg.herokuapp.com/orders/new?response_id=" + dmv_response.id);
                    $("#renew_now_body").attr("href", "https://ca-auto-reg.herokuapp.com/orders/new?response_id=" + dmv_response.id);

                    } else {
                      console.log("DMV Fees are empty");
                    blnError = true; //not an error - but want to show the simpler modal
                    $(".modal-title").html("The DMV responded with the following:");
                    $(".modal-body p").html("Good News!  No Fees Due at this time.");
                    $(".modal-body #hint").html("Thanks for using our app!");
                    $("#modal-error button").last().html("OK");

                    }
                
                  } 
                  else { //status not equal to "FR"

                  blnError = true;
				  debugger;
                  $(".modal-title").html("Sorry, there was a problem with your registration:")
                  $(".modal-body p").html("DMV Response:  " + dmv_response.status + "  " + dmv_response.error_code + " " + dmv_response.api_error_code + " " + dmv_response.error_message);
                  $(".modal-body #hint").html("Please double check that both the License Plate and Last 3 of your Vehichle Identification Number are correct for you vehicle.");
                  $("#response_status").html(dmv_response.status);
                  $("#response_error_code").html(dmv_response.error_code);
                  $("#response_api_error_code").html(dmv_response.api_error_code);
                  $("#response_message").html(dmv_response.error_message);
                  $("#error-response").show();
                  $("error-options").html(error_description(dmv_response.error_code));
                  $("body").scrollTo("#summary");
                  $("#more_info").attr("href", "https://ca-auto-reg.herokuapp.com/orders/1/moreinfo?response_id=" + dmv_response.id);
                  }

              $("#check").button('reset');
              if (blnError){
                 $('#modal-error').modal();
                      }
              else
              {
                 $('#modal-success').modal();
              }
            });
        return false;



    });

    /* ------------------------------------------------=
     ---=  FITVIDS              ------
     ---------------------------------------------------= */


    // Target your .container, .wrapper, .post, etc.
    $('.describe-video').fitVids();



    /* ------------------------------------------------=
     ---=  COMMING SOON                 ------
     ---------------------------------------------------= */

//JUST EDIT Date(2015, 0, 1, 9, 30) 2015 YEAR, 0 MONTH, 1 DATE, 30 SECOND
    $('#myCounter').mbComingsoon({expiryDate: new Date(2015, 3, 5, 9, 30), speed: 100});



});



/* ------------------------------------------------=
 ---=  COUNTER                 ------
 ---------------------------------------------------= */

$('.statistic-counter').counterUp({
    delay: 10,
    time: 2000
});


/* ---------------------------------------------------------------------
 NIVO LIGHT BOX
 ---------------------------------------------------------------------= */


// $('.screenshots a').nivoLightbox({
//     effect: 'fadeScale'
// });


// $('.portfolio a').nivoLightbox({
//     effect: 'fadeScale'
// });




/* ------------------------------------------------=
 ---=  Video Player                ------
 ---------------------------------------------------= */

// $(function(){
//      $(".player").YTPlayer();
//    });


/* ------------------------------------------------=
 ---=  Skills                ------
 ---------------------------------------------------= */

$(function () {
    $('.chart').easyPieChart({
        easing: 'easeOutBounce',
        animate: 2000,
        scaleColor: false,
        lineWidth: 12,
        lineCap: 'square',
        size: 150,
        trackColor: '#EDEDED',
        barColor: '#1ac6ff',
        onStep: function (from, to, percent) {
            $(this.el).find('.percent').text(Math.round(percent));
        }
    });

});




