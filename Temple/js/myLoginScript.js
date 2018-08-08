/**
 * Created by nataraj-pc on 27-Jul-18.
 */
(function () {
    var name = window.sessionStorage.name;
    if (name !== undefined) {
      //  window.location = "home.html";
    }
})();
$(document).ready(function () {

    functions = {
        logging: function () {

            $(".loginHere").on('submit', (function (e) {
                e.preventDefault();
                $(".request").text("Singing.....");
                $(".request").fadeIn(200);
                $.ajax({
                    url: "phpFuncs/login.php", // Url to which the request is send
                    type: "POST",             // Type of request to be send, called as method
                    data: new FormData(this), // Data sent to server, a set of key/value pairs (i.e. form fields and values)
                    contentType: false,       // The content type used when sending data to the server.
                    cache: false,             // To unable request pages to be cached
                    processData: false,        // To send DOMDocument or non processed data file it is set to false
                    success: function (res) {   // A function to be called if request succeeds
                        var response = JSON.parse(res);
                        if (response.success === 1) {
                            $(".request").text(res.message);
                            sessionStorage.name = response.data[0].name;
                            sessionStorage.empid = response.data[0].empid;
                            sessionStorage.category = response.data[0].category;
                            sessionStorage.phno = response.data[0].phno;
                            window.location = "home.html";
                        } else {
                            console.log(response);
                            $(".request").text("Username or Password wrong please try again.....");
                        }
                    }
                });

                $(".request").fadeOut(3000);
            }));
        }
    };
    functions.logging();

});
