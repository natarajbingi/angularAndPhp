/**
 * Created by Nataraj on 28-07-2018.
 */

(function () {
    var name = window.sessionStorage.name;
    if (name === undefined) {
        window.location = "index.html";
    }
})();


var appHome = angular.module("appHome", ['ui.bootstrap']);

//==========================================================
appHome.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function () {
                scope.$apply(function () {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);
// We can write our own fileUpload service to reuse it in the controller
appHome.service('fileUpload', ['$http', function ($http) {
    this.uploadFileToUrl = function (file, uploadUrl, name) {
        var fd = new FormData();
        fd.append('file', file);
        fd.append('name', name);
        fd.append('Type', "sevaGetTest");
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined, 'Process-Data': false}
        })
            .success(function (response) {

                console.log("Success");
                return response;
            })
            .error(function (response) {
                console.log("error");
            });
    }
}]);

//==========================================================
appHome.factory('Excel', function ($window) {
    var uri = 'data:application/vnd.ms-excel;base64,',
        template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
        base64 = function (s) {
            return $window.btoa(unescape(encodeURIComponent(s)));
        },
        format = function (s, c) {
            return s.replace(/{(\w+)}/g, function (m, p) {
                return c[p];
            })
        };
    return {
        tableToExcel: function (tableId, worksheetName) {
            var table = $(tableId),
                ctx = {worksheet: worksheetName, table: table.html()},
                href = uri + base64(format(template, ctx));
            return href;
        }
    };
});
appHome.controller("testCtrl", function ($scope, $rootScope, fileUpload, Excel, $timeout, $filter, $http, $window, $templateCache) {


    var method = 'POST';
    var url = 'phpFuncs/save_form.php';
    $scope.saveNewNameTest = function () {
        $(".request").text("Fetching details.....");
        $(".request").fadeIn(200);
        $scope.sevaGetTest = {};
        $scope.sevaGetTest.Type = "sevaGetTest";
        var FormData = $scope.sevaGetTest;
        $http({
            method: method,
            url: url,
            data: FormData,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            cache: $templateCache
        }).success(function (response) {
            if (response.success === 1) {
                $scope.sevaGetTestList = response;
            } else {
                console.log(response);
                $(".request").text("Something went wrong, please try again.....");
            }
        }).error(function (response) {
            $scope.codeStatus = response || "Request failed";
        });
        $(".request").fadeOut(6000);
        return false;
    };
    $scope.uploadFile = function () {
        var file = $scope.fileToUpload;
        console.log('file is ');
        console.dir(file);

        var uploadUrl = url;
        var text = $scope.name;
        var response = fileUpload.uploadFileToUrl(file, uploadUrl, text);
        console.log(response);
    };
});

appHome.controller("homeCtrl", function ($scope, $rootScope, Excel, $timeout, $filter, $http, $window, $templateCache) {

    $scope.logout = function () {

        alert("You logged out, your session over.");
        sessionStorage.clear();
        sessionStorage.removeItem("name");
        sessionStorage.removeItem("empid");
        sessionStorage.removeItem("category");
        sessionStorage.removeItem("phno");
        window.location = "index.html";

    };
    $scope.accessNot = false;
    if (sessionStorage.category === "SENIOR_MANAGER") {
        $scope.accessNot = true;
    }
    // -------------------------------------- //
    var method = 'POST';
    var url = 'phpFuncs/getValues.php';
    $scope.GetCountsList = [];
    $scope.getGetCounts = function () {
        $(".request").text("Fetching details.....");
        $(".request").fadeIn(200);
        $scope.sevaGetMembers = {};
        $scope.sevaGetMembers.Type = "getGetCounts";
        var FormData = $scope.sevaGetMembers;
        //{"success":1,"data":[{"memberCount":"5","biilingCount":"3","sevasCount":"11"}],"message":"All count Fetched successfully."}
        $http({
            method: method,
            url: url,
            data: FormData,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            cache: $templateCache
        }).success(function (response) {
            if (response.success === 1) {
                $scope.GetCountsList = response.data;
            } else {
                console.log(response);
                $(".request").text("Something went wrong, please try again.....");
            }
        }).error(function (response) {
            $scope.codeStatus = response || "Request failed";
        });
        $(".request").fadeOut(6000);
        return false;
    };
    $scope.getGetCounts();
});
appHome.controller("sevaCtrl", function ($scope, $rootScope, Excel, $timeout, $filter, $http, $window, $templateCache) {
    $scope.logout = function () {
        alert("You logged out, your session over.");
        sessionStorage.clear();
        sessionStorage.removeItem("name");
        sessionStorage.removeItem("empid");
        sessionStorage.removeItem("category");
        sessionStorage.removeItem("phno");
        window.location = "index.html";

    };
    $scope.accessNot = false;
    if (sessionStorage.category === "SENIOR_MANAGER") {
        $scope.accessNot = true;
    }
    // -------------------------------------- //
    $scope.sevaMember = {};
    $scope.invoiceBill = {};
    $scope.invoiceBill1 = {};
    $scope.invoiceBillResponse = {};
    $scope.sevaEditMem = {};
    $scope.BillReceiptInvoiceShowHide = true;
    $scope.memberSevaAddEditShowHide = true;
    $scope.sevaEditVal = {};
    $scope.memberEditVal = {};
    $scope.sevaMember.entered_date = new Date();// $filter('date')(new Date(), "dd-MM-yyyy");
    $scope.invoiceBill.entered_date_invoice = new Date();//$filter('date')(new Date(), "dd-MM-yyyy");
    $scope.sevaName = {};
    $scope.BillingSeavs = [];
    $scope.sevaNamesList = [];
    $scope.sevaMemberList = [];
    $scope.nakshatraList = ["ಅಶ್ವಿನಿ (Ashwini)", "ಭರಣಿ (Bharani)", "ಕೃತ್ತಿಕಾ( Krittika)", "ರೋಹಿಣಿ (Rohini)",
        "ಮೃಗಶಿರ (Mrigcira)", "ಆರಿದ್ರಾ (Aridra)", "ಪುನರ್ವಸು (Punarvasu)", "ಪುಷ್ಯ (Pushya)", "ಆಶ್ಲೇಷ (ASHLESHA)",
        "ಮಘಾ (Magha)", "ಪೂರ್ವಾ ಫಲ್ಗುಣಿ (Poorva Phalguni)", "ಉತ್ತರಾ ಫಲ್ಗುಣಿ (Uttara Phalguni)", "ಹಸ್ತಾ (Hasta)",
        "ಚಿತ್ತಾ (Chitta)", "ಸ್ವಾತಿ (Swati)", "ವಿಶಾಖಾ (Vishaka)", "ಅನುರಾಧ (Anuradha)", "ಜ್ಯೇಷ್ಠಾ (Jyeshta)", "ಮೂಲ (Moola)",
        "ಪೂರ್ವಾಶಾಢ (Poorvashadha)", "ಉತ್ತರಾಶಾಢ (Uttarashadha)", "ಶ್ರವಣ (Sharavan)", "ಧನಿಷ್ಠ (Dhanishta)",
        "ಶತಭಿಷ (Satbhij)", "ಪೂರ್ವಾಭಾದ್ರ (Poorva Bhadrpada)", "ಉತ್ತರಾ ಭಾದ್ರ (Uttara Bhadrapada)", "ರೇವತಿ (Revathi)"];

    $scope.tithiList = ["ಪಾಡ್ಯ (Padya)","ಬಿದಿಗೆ (Bidige)","ತೃತೀಯ (Trutiya)","ಚತುರ್ಥಿ (Chaturthi)",
					"ಪಂಚಮಿ (Panchami)","ಷಷ್ಠಿ (Shshthi)","ಸಪ್ತಮಿ (Saptami)","ಅಷ್ಟಮಿ (Ashtami)","ನವಮಿ (Navami)",
				    "ದಶಮಿ (Dashmi)","ಎಕಾದಶಿ (Ekadashi)","ದ್ವಾದಶಿ (Dwadashi)","ತ್ರಯೋದಶಿ (Trayodashi)",
				    "ಚತುರ್ದಶಿ (Chturdashi)","ಹುಣ್ಣಿಮೆ (Pournime)","ಅಮವಾಸ್ಯೆ (Amavasye)"	];
    $scope.rashiList = ["ಮೇಷ (Mesha)", "ವೃಷಭ (Vrushabha)", "ಮಿಥುನ (Mithuna)",
        "ಕರ್ಕ (Karka)", "ಸಿಂಹ (Simha)", "ಕನ್ಯಾ (Kanya)", "ತುಲಾ (Tula)", "ವೃಶ್ಚಿಕ (Vrischika)",
        "ಧನು (Dhanu)", "ಮಕರ (Makara)", "ಕುಂಭ (Kumbha)", "ಮೀನ (Meena)"];
    $scope.sevaMember.permanent = "NO";
    $scope.sevaMember.state = "Karnataka";
    var method = 'POST';
    var url = 'phpFuncs/insertValues.php';
    $scope.codeStatus = "";

    $scope.BillingSeavsID = [];
    $scope.BillingSeavsIDAmt = 0;
    $scope.resetForm = function () {
        $scope.invoiceBill1.sevaId = "";
        $scope.invoiceBill1.seva_name = "";
        $scope.invoiceBill1.seva_amount = "";
        $scope.invoiceBill1.discount = "";
    };
    $scope.addItem = function () {
        $scope.errortext = "";
        if ($scope.invoiceBill1.seva_name == undefined || $scope.invoiceBill1.seva_name == "") {
            alert("please select seva");
            return;
        }
        if ($scope.BillingSeavsID.indexOf($scope.invoiceBill1.sevaId) == -1) {
            $scope.BillingSeavsID.push($scope.invoiceBill1.sevaId);
            $scope.BillingSeavs.push({
                id: $scope.invoiceBill1.sevaId,
                seva_name: $scope.invoiceBill1.seva_name.seva_name,
                seva_amount: $scope.invoiceBill1.seva_amount,
                discount: $scope.invoiceBill1.discount
            });
            $scope.resetForm();
        } else {
            $scope.errortext = "The item is already in your Seva list.";
        }
    };
    $scope.removeItem = function (x) {
        $scope.errortext = "";
        $scope.BillingSeavsID.pop(x.id);
        $scope.BillingSeavs.splice(x, 1);
    };
    $scope.printDiv = function (divName) {
        var innerContents = document.getElementById(divName).innerHTML;
        var popupWinindow = window.open('', '_blank', 'width=600,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
        popupWinindow.document.open();
        popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="css/basic.css" /></head><body onload="window.print()">' + innerContents + '</html>');
        popupWinindow.document.close();
    };

    $scope.backToList = function () {
        $scope.BillReceiptInvoiceShowHide = true;
        $scope.invoiceBillResponse = [];
        $scope.invoiceBill = {};
        $scope.BillingSeavsID = [];
        $scope.BillingSeavs = [];
        $scope.invoiceBill.entered_date_invoice = new Date();
        $scope.BillingSeavsIDAmt = 0;
    };
    $scope.saveNewInvoice = function () {

        if ($scope.invoiceBill.memberName.firstname == undefined) {

            alert("Please Enter Proper Seva Member to Generate Bill");
            return;
        }
        if ($scope.BillingSeavs.length == 0) {
            alert("Please select at least one seva to Generate Bill");
            return;
        }
        for (var k = 0; k < $scope.BillingSeavs.length; k++) {
            $scope.BillingSeavsIDAmt += parseInt($scope.BillingSeavs[k].seva_amount);
        }

        $scope.invoiceBill.entered_by = sessionStorage.empid;
        $scope.invoiceBill.entered_date_invoice = $filter('date')($scope.invoiceBill.entered_date_invoice, "dd-MM-yyyy");
        $scope.invoiceBill.Type = "sevaNewInvoice";
        //$scope.invoiceBill.memberId = $scope.invoiceBill.memberName.id;
        //$scope.invoiceBill.memberName = $scope.invoiceBill.memberName.firstname + " " + $scope.invoiceBill.memberName.lastname;
        $scope.invoiceBill.sevaList = $scope.BillingSeavs;
        $scope.invoiceBill.BillingSeavsIDs = $scope.BillingSeavsID.toString();
        $scope.invoiceBill.BillingSeavsIDAmt = $scope.BillingSeavsIDAmt;
        var FormData = $scope.invoiceBill;
        $(".request").text("Please wait.....");
        $(".request").fadeIn(200);
        $http({
            method: method,
            url: url,
            data: FormData,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            cache: $templateCache
        }).success(function (response) {
            console.log(response)
            //  var response = JSON.parse(res);
            if (response.success === 1) {
                alert("Bill Generated successfully.");
                $scope.invoiceBillResponse = response.data;
                $scope.BillReceiptInvoiceShowHide = false;
                $scope.invoiceNo = response.last_id;
                //$scope.sevaMember = {};
                //$scope.sevaMember.entered_date = new Date();
                $(".request").text("Bill Generated successfully.");
            } else {
                console.log(response);
                $(".request").text("Something went wrong,please try again.....");
            }
            $(".request").fadeOut(3000);
        }).error(function (response) {
            $scope.codeStatus = response || "Request failed";
        });
        return false;
    };
    $scope.saveNewMember = function () {
        $scope.sevaMember.entered_by = sessionStorage.empid;
        $scope.sevaMember.entered_date = $filter('date')($scope.sevaMember.entered_date, "dd-MM-yyyy");
        $scope.sevaMember.Type = "sevaMember";
        if ($scope.sevaMember.phone == undefined) {
            $scope.sevaMember.phone = "_";
        }
        if ($scope.sevaMember.midname == undefined) {
            $scope.sevaMember.midname = "_";
        }
        if ($scope.sevaMember.email == undefined) {
            $scope.sevaMember.email = "_";
        }
        var FormData = $scope.sevaMember;
        $(".request").text("Please wait.....");
        $(".request").fadeIn(200);
        $http({
            method: method,
            url: url,
            data: FormData,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            cache: $templateCache
        }).success(function (response) {
            //  var response = JSON.parse(res);
            if (response.success === 1) {
                alert("Member Added successfully.");
                $scope.sevaMember = {};
                $scope.getMembersNames();
                $scope.sevaMember.permanent = "NO";
                $scope.sevaMember.entered_date = new Date();
                $(".request").text("Member Added successfully.");
            } else {
                console.log(response);
                $(".request").text("Something went wrong,please try again.....");
            }
            $(".request").fadeOut(3000);
        }).error(function (response) {
            $(".request").text("Something went wrong,please try again.....");
            $scope.codeStatus = response || "Request failed";
            $(".request").fadeOut(5000);
        });
        return false;
    };
    $scope.saveNewName = function () {
        $scope.sevaName.entered_by = sessionStorage.empid;
        $scope.sevaName.Type = "sevaName";
        var FormData = $scope.sevaName;
        $(".request").text("Please wait.....");
        $(".request").fadeIn(200);
        $http({
            method: method,
            url: url,
            data: FormData,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            cache: $templateCache
        }).success(function (response) {
            /* $scope.codeStatus = response.data;*/
            // var response = JSON.parse(res);
            if (response.success === 1) {
                alert("Seva Added successfully.");
                $(".request").text("Seva Added successfully.");
                $scope.sevaName = {};
            } else {
                console.log(response);
                $(".request").text("Something went wrong,please try again.....");
            }
            $(".request").fadeOut(3000);
        }).error(function (response) {
            $scope.codeStatus = response || "Request failed";
            $(".request").text("Something went wrong,please try again.....");
            $(".request").fadeOut(5000);
        });
        return false;
    };

    $scope.EditSevaName = function ($event, $index, seva) {
        $scope.sevaEditVal = seva;
    };
    $scope.EditSevaMember = function ($event, $index, member) {
        $scope.sevaMember = member;
        $scope.sevaMember.entered_date = new Date(member.entered_date);
        $scope.sevaMember.phone = parseInt(member.phone);
        $scope.sevaMember.mobile = parseInt(member.mobile);
        $scope.sevaMember.seva_amount = parseInt(member.seva_amount);
        $scope.sevaMember.discount = parseInt(member.discount);
        $scope.memberSevaAddEditShowHide = false;
    };
    $scope.EditCancelSevaMember = function () {
        $scope.sevaMember = {};
        $scope.sevaMember.permanent = "NO";
        $scope.memberSevaAddEditShowHide = true;
        $scope.sevaMember.entered_date = new Date();// $filter('date')(new Date(), "dd-MM-yyyy");
    };
    $scope.DeleteSevaName = function ($event, $index, seva) {
        $scope.sevaEditVal = seva;
    };
    $scope.DeleteSevaMember = function ($event, $index, member) {
        $scope.sevaEditMem = member;
    };

    $scope.setDefaultVals = function (vals) {

        $scope.invoiceBill1.sevaId = parseInt(vals.id);
        $scope.invoiceBill1.seva_amount = parseInt(vals.seva_amount);
        $scope.invoiceBill1.discount = parseInt(vals.discount);
    };

    $scope.updateSaveMember = function () {

        /* if ($scope.sevaMember.seva_name === undefined || $scope.sevaMember.seva_name === "") {
         alert("Please Select Seva Name.")
         return
         }*/
        /*else {
         alert($scope.sevaMember.seva_name);
         }*/

        $scope.sevaMember.entered_by = sessionStorage.empid;
        $scope.sevaMember.Type = "sevaEditMember";
        if ($scope.sevaMember.midname == undefined) {
            $scope.sevaMember.midname = "_";
        }

        $(".request").text("Please wait.....");
        $(".request").fadeIn(200);
        var FormData = $scope.sevaMember;
        $http({
            method: method,
            url: url,
            data: FormData,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            cache: $templateCache
        }).success(function (response) {
            /* $scope.codeStatus = response.data;*/
            // var response = JSON.parse(res);
            if (response.success === 1) {
                alert("Seva Member Updated successfully.");
                $scope.sevaMemberList = response.data;
                $scope.EditCancelSevaMember();
                $(".request").text("Seva Member Updated successfully.");
            } else {
                console.log(response);
                $(".request").text("Something went wrong,please try again.....");
            }
            $(".request").fadeOut(3000);
        }).error(function (response) {
            $scope.codeStatus = response || "Request failed";
            $(".request").text("Something went wrong,please try again.....");
            $(".request").fadeOut(5000);
        });
        return false;
    };
    $scope.updateSaveName = function () {
        $scope.sevaEditVal.entered_by = sessionStorage.empid;
        $scope.sevaEditVal.Type = "sevaEditName";
        var FormData = $scope.sevaEditVal;
        $(".request").text("Please wait.....");
        $(".request").fadeIn(200);
        $http({
            method: method,
            url: url,
            data: FormData,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            cache: $templateCache
        }).success(function (response) {
            /* $scope.codeStatus = response.data;*/
            // var response = JSON.parse(res);
            if (response.success === 1) {
                alert("Seva Updated successfully.");
                $('#mySevaModal').modal('hide');
                $scope.sevaEditVal = {};
                $scope.sevaNamesList = response.data;
                $(".request").text("Seva Updated successfully.");
            } else {
                console.log(response);
                $(".request").text("Something went wrong,please try again.....");
            }
            $(".request").fadeOut(3000);
        }).error(function (response) {
            $scope.codeStatus = response || "Request failed";
            $(".request").text("Something went wrong,please try again.....");
            $(".request").fadeOut(5000);
        });
        return false;
    };
    $scope.DeleteSavedName = function () {
        $scope.sevaEditVal.entered_by = sessionStorage.empid;
        $scope.sevaEditVal.Type = "sevaDeleteName";
        var FormData = $scope.sevaEditVal;
        $(".request").text("Please wait.....");
        $(".request").fadeIn(200);
        $http({
            method: method,
            url: url,
            data: FormData,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            cache: $templateCache
        }).success(function (response) {
            /* $scope.codeStatus = response.data;*/
            // var response = JSON.parse(res);
            if (response.success === 1) {
                alert("Seva Deleted successfully.");
                $scope.sevaEditVal = {};
                $('#mySevaModalDelete').modal('hide');
                $scope.sevaNamesList = response.data;
            } else {
                console.log(response);
                $(".request").text("Something went wrong,please try again.....");
            }
            $(".request").fadeOut(3000);
        }).error(function (response) {
            $scope.codeStatus = response || "Request failed";
            $(".request").text("Something went wrong,please try again.....");
            $(".request").fadeOut(5000);
        });
        return false;
    };
    $scope.DeleteSavedMember = function () {
        $scope.sevaEditMem.entered_by = sessionStorage.empid;
        $scope.sevaEditMem.Type = "sevaDeleteMember";
        var FormData = $scope.sevaEditMem;
        $(".request").text("Please wait.....");
        $(".request").fadeIn(200);
        $http({
            method: method,
            url: url,
            data: FormData,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            cache: $templateCache
        }).success(function (response) {
            /* $scope.codeStatus = response.data;*/
            // var response = JSON.parse(res);
            if (response.success === 1) {
                alert("Member Deleted successfully.");
                $scope.sevaEditMem = {};
                $('#mymemberModalDelete').modal('hide');
                $scope.sevaMemberList = response.data;
                $(".request").text("Member Deleted successfully.");
            } else {
                console.log(response);
                $(".request").text("Something went wrong,please try again.....");
            }
            $(".request").fadeOut(3000);
        }).error(function (response) {
            $scope.codeStatus = response || "Request failed";
            $(".request").text("Something went wrong,please try again.....");
            $(".request").fadeOut(5000);
        });
        return false;
    };
    $scope.getMembersNames = function () {
        $scope.sevaGetMembers = {};
        $scope.sevaGetMembers.Type = "sevaGetMembers";
        var FormData = $scope.sevaGetMembers;
        $(".request").text("Please wait.....");
        $(".request").fadeIn(200);
        $http({
            method: method,
            url: 'phpFuncs/getValues.php',
            data: FormData,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            cache: $templateCache
        }).success(function (response) {
            if (response.success === 1) {
                $scope.sevaMemberList = response.data;
            } else {
                console.log(response);
                $(".request").text("Something went wrong,please try again.....");
            }
            $(".request").fadeOut(3000);
        }).error(function (response) {
            $scope.codeStatus = response || "Request failed";
            $(".request").text("Something went wrong,please try again.....");
            $(".request").fadeOut(5000);
        });
        return false;
    };
    $scope.getSaveNames = function () {
        $scope.sevaGetNames = {};
        $scope.sevaGetNames.Type = "sevaGetNames";
        var FormData = $scope.sevaGetNames;
        $(".request").text("Please wait.....");
        $(".request").fadeIn(200);
        $http({
            method: method,
            url: 'phpFuncs/getValues.php',
            data: FormData,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            cache: $templateCache
        }).success(function (response) {
            if (response.success === 1) {
                $scope.sevaNamesList = response.data;
            } else {
                console.log(response);
                $(".request").text("Something went wrong,please try again.....");
            }
            $(".request").fadeOut(3000);
        }).error(function (response) {
            $scope.codeStatus = response || "Request failed";
            $(".request").text("Something went wrong,please try again.....");
            $(".request").fadeOut(5000);
        });
        return false;
    };
    $scope.getMembersNames();
    $scope.getSaveNames();
    $scope.backToList();

});

appHome.controller("OnlineCtrl", function ($scope, $rootScope, Excel, $timeout, $filter, $http, $window, $templateCache) {
    // -------------------------------------- //

    $scope.logout = function () {

        alert("You logged out, your session over.");
        sessionStorage.clear();
        sessionStorage.removeItem("name");
        sessionStorage.removeItem("empid");
        sessionStorage.removeItem("category");
        sessionStorage.removeItem("phno");
        window.location = "index.html";

    };

    $scope.accessNot = false;
    if (sessionStorage.category === "SENIOR_MANAGER") {
        $scope.accessNot = true;
    }

});


appHome.controller("viewDownloadCtrl", function ($scope, $rootScope, Excel, $timeout, $filter, $http, $window, $templateCache) {
    $scope.logout = function () {
        alert("You logged out, your session over.");
        sessionStorage.clear();
        sessionStorage.removeItem("name");
        sessionStorage.removeItem("empid");
        sessionStorage.removeItem("category");
        sessionStorage.removeItem("phno");
        window.location = "index.html";

    };
    $scope.accessNot = false;
    if (sessionStorage.category === "SENIOR_MANAGER") {
        $scope.accessNot = true;
    }
    // -------------------------------------- //
    $scope.sevaMemberList = [];
    $scope.sevaBillsList = [];
    $scope.sevaNamesList = [];
    var method = 'POST';
    var url = 'phpFuncs/getValues.php';
    $scope.exportToExcel = function (tableId) { // ex: '#my-table'
        $scope.exportHref = Excel.tableToExcel(tableId, '' + tableId);
        $timeout(function () {
            location.href = $scope.exportHref;
        }, 100); // trigger download
    };

    $scope.getMembersNames = function () {
        $(".request").text("Fetching details.....");
        $(".request").fadeIn(200);
        $scope.sevaGetMembers = {};
        $scope.sevaGetMembers.Type = "sevaGetMembers";
        var FormData = $scope.sevaGetMembers;
        $http({
            method: method,
            url: url,
            data: FormData,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            cache: $templateCache
        }).success(function (response) {
            if (response.success === 1) {
                $scope.sevaMemberList = response.data;
            } else {
                console.log(response);
                $(".request").text("Something went wrong, please try again.....");
            }
        }).error(function (response) {
            $scope.codeStatus = response || "Request failed";
        });
        $(".request").fadeOut(6000);
        return false;
    };
    $scope.getSaveNames = function () {
        $(".request").text("Fetching details.....");
        $(".request").fadeIn(200);
        $scope.sevaGetNames = {};
        $scope.sevaGetNames.Type = "sevaGetNames";
        var FormData = $scope.sevaGetNames;
        $http({
            method: method,
            url: url,
            data: FormData,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            cache: $templateCache
        }).success(function (response) {
            if (response.success === 1) {
                $scope.sevaNamesList = response.data;
            } else {
                console.log(response);
                $(".request").text("Something went wrong, please try again.....");
            }
        }).error(function (response) {
            $scope.codeStatus = response || "Request failed";
        });
        $(".request").fadeOut(6000);
        return false;
    };
    $scope.sevaGetBills = function () {
        $(".request").text("Fetching details.....");
        $(".request").fadeIn(200);
        $scope.sevaGetBills = {};
        $scope.sevaGetBills.Type = "sevaGetBills";
        var FormData = $scope.sevaGetBills;
        $http({
            method: method,
            url: url,
            data: FormData,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            cache: $templateCache
        }).success(function (response) {
            if (response.success === 1) {
                $scope.sevaBillsList = response.data;
            } else {
                console.log(response);
                $(".request").text("Something went wrong, please try again.....");
            }
        }).error(function (response) {
            $scope.codeStatus = response || "Request failed";
        });
        $(".request").fadeOut(6000);
        return false;
    };

    $scope.getSaveNames();
    $scope.getMembersNames();
    $scope.sevaGetBills();
});

appHome.controller("manageEmployeeCtrl", function ($scope, $rootScope, Excel, $timeout, $filter, $http, $window, $templateCache) {
    $scope.logout = function () {
        alert("You logged out, your session over.");
        sessionStorage.clear();
        sessionStorage.removeItem("name");
        sessionStorage.removeItem("empid");
        sessionStorage.removeItem("category");
        sessionStorage.removeItem("phno");
        window.location = "index.html";

    };

    $scope.accessNot = false;
    if (sessionStorage.category === "SENIOR_MANAGER") {
        $scope.accessNot = true;
    }
    // -------------------------------------- //
    var method = 'POST';
    var url = 'phpFuncs/insertValues.php';
    var urlGet = 'phpFuncs/getValues.php';
    $scope.access_login = {};
    $scope.access_loginGet = {};
    $scope.accessList = [];
    $scope.access_login.doj = new Date();
    $scope.genderArr = ["MALE", "FEMALE", "TRANSGENDER"];
    $scope.AssignManageArr = ["JUNIOR_MANAGER", "SENIOR_MANAGER"];
    $scope.employeeAddEditShowHide = new Date();

    $scope.saveNewEmployee = function () {
        $scope.access_login.entered_by = sessionStorage.empid;
        $scope.access_login.Type = "newEmployee";
        $scope.access_login.doj = $filter('date')($scope.access_login.doj, "dd-MM-yyyy");

        var FormData = $scope.access_login;
        $(".request").text("Please wait.....");
        $(".request").fadeIn(200);
        $http({
            method: method,
            url: url,
            data: FormData,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            cache: $templateCache
        }).success(function (response) {
            if (response.success === 1) {
                alert("Employee Added successfully.");
                $(".request").text("Employee Added successfully.");
                $scope.access_login = {};
                $scope.access_login.doj = new Date();
            } else {
                console.log(response);
                $(".request").text("Something went wrong,please try again.....");
            }
            $(".request").fadeOut(3000);
        }).error(function (response) {
            $scope.codeStatus = response || "Request failed";
            $(".request").text("Something went wrong,please try again.....");
            $(".request").fadeOut(5000);
        });
        return false;
    };

    $scope.getAllEmployees = function () {
        $scope.access_loginGet.Type = "accessGetAll";

        var FormData = $scope.access_loginGet;
        $(".request").text("Please wait.....");
        $(".request").fadeIn(200);
        $http({
            method: method,
            url: urlGet,
            data: FormData,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            cache: $templateCache
        }).success(function (response) {
            if (response.success === 1) {
                $scope.accessList = response.data;
            } else {
                console.log(response);
                $(".request").text("Something went wrong,please try again.....");
            }
            $(".request").fadeOut(3000);
        }).error(function (response) {
            $scope.codeStatus = response || "Request failed";
            $(".request").text("Something went wrong,please try again.....");
            $(".request").fadeOut(5000);
        });
        return false;
    };
    $scope.getAllEmployees();


});