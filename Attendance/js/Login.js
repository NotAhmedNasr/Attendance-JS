import { loadEmployeesData, employeesData, checkUsername } from "./Loaders.js";

const ADMIN = {
    username: "admin",
    password: "@dmin"
};

$(document).ready(function () {
    loadEmployeesData();
    $("#login").on("click", loginHandler);
});


function checkPassword(empData, password) {
    return empData.password == password;
}

function loginHandler(e) {
    let loginForm = $($(".needs-validation")[0]);
    var username = $("#username");
    var password = $("#password");

    var checkedUser = checkUsername(username.val(), employeesData);
    if (checkedUser) {    // If user exists 
        username.addClass("is-valid").removeClass("is-invalid");
        if (checkPassword(checkedUser, password.val())) {  // If password is correct
            loginForm.attr("action", "Profile.html");
            initializeSession(username.val());
            loginForm.trigger("submit");
        }
        else {
            password.addClass("is-invalid").removeClass("is-valid");  // Display invalid password feedback
        }
    }
    else if (username.val() == ADMIN.username) {
        if (password.val() == ADMIN.password) {
            loginForm.attr("action", "Admin.html");
            initializeSession(username.val());
            loginForm.trigger("submit");
        } else {
            password.addClass("is-invalid").removeClass("is-valid");  // Display invalid password feedback
        }
    } else {
        username.addClass("is-invalid").removeClass("is-valid"); // Display invalid username feedback
        password.val("").removeClass("is-valid").removeClass("is-invalid");
    }
}

function initializeSession(username) {  
    sessionStorage.setItem("user", username);
}