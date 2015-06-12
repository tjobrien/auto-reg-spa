
$(document).ready(function () {
  console.log("Hello jquery");
  
    "use strict";

    //this is for the sections within index.html that show the results after the modals
    // $("#fee-summary").hide();
    // $("#error-response").hide();

    $("#helpBlock").hide();

    $('#new_renewal input:radio').change(function() {
      if ($(this).val() === '1') {
        $("#helpBlock").show();
      }
      else{
        $("#helpBlock").hide();

      }
    });

    $('#secondary_renewal input:radio').change(function() {
      if ($(this).val() === '1') {
        alert("You must be member of the military on active duty and provide military ID to receive any Non-Resident Military Discounts");
      }
    });
    
  $('#new_renewal').submit(function(event){

        $('#check').button('loading');
          var str = $("#new_renewal").serializeArray();
          var submit_form = $.ajax({
              url: "https://ca-auto-reg.herokuapp.com/renewals/mobile_create.json",
              type: "post",
              data: str,
              dataType: 'json'

          });
          submit_form.done(handleDone);



          return false;



      });

      $('#secondary_renewal').submit(function(event){

        $('#secondary_check').button('loading');
          var str = $("#secondary_renewal").serializeArray();
          var submit_form = $.ajax({
              url: "https://ca-auto-reg.herokuapp.com/renewals/mobile_create.json",
              type: "post",
              data: str,
              dataType: 'json'

          });
          submit_form.done(handleDone);



          return false;



      });

      function handleDone(jqXHR, textStatus){
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
          $(".modal-body #hint").html("Please double check that both the License Plate and Last 3 of your Vehichle Identification Number are correct for your vehicle.");
          $("#response_status").html(dmv_response.status);
          $("#response_error_code").html(dmv_response.error_code);
          $("#response_api_error_code").html(dmv_response.api_error_code);
          $("#response_message").html(dmv_response.error_message);
          $("#error-response").show();
          $("error-options").html(error_description(dmv_response.error_code));
          //$("body").scrollTo("#summary");
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

    }

      // $('#contact-form').submit(function(event){
      //   console.log("hello-contact");
      //   var url = "http://glorious-pup-38-214709.usw1.nitrousbox.com/contacts.json";
      //   //var url = "https://ca-auto-reg.herokuapp.com/contacts.json"
      //   $('#contact').button('loading');
      //     var str = $("#contact-form").serializeArray();
      //     console.log(str);
      //     var submit_form = $.ajax({
      //         url: url,
      //         type: "post",
      //         data: str,
      //         dataType: 'json'

      //     });
      //     submit_form.done(function(jqXHR, textStatus){
      //        alert("Thanks for your input!");
      //        $("#contact").button('reset');
      //     });
      //     return false;



      // });
});