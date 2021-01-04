import { loadEmployeesData, loadRequestsData, employeesData, requestsData, saveJSONFile } from "./Loaders.js";
import { NewEmployee } from "./Employee.js";

$(document).ready(function () {
    loadEmployeesData();
    loadRequestsData();
    let registerForm = $($(".needs-validation")[0]);
    registerForm.on("submit", registerHandler);
    $("#save").on("click", saveHandler);
});

function registerHandler(e) {
    var email = $("#email");
    if (e.target.checkValidity() === false) {
        e.preventDefault();
        e.stopPropagation();
    } else if (checkIfEmailExists(email.val(), employeesData) || checkIfEmailExists(email.val(), requestsData)) {
        e.preventDefault();
        e.stopPropagation();
        $("#emailExists").modal("show");
        email.val("");
    } else {
        var request = makeNewEmployee();
        requestsData.push(request);
        e.preventDefault();
        e.stopPropagation();
    }
    $(e.target).addClass("was-validated");
}

function checkIfEmailExists(email, data) {
    for (let i = 0; i < data.length; i++) {
        if (data[i].email == email) {
            return true;
        }
    }
    return false;
}

function makeNewEmployee() {
    let fname = $("#fname").val();
    let lname = $("#lname").val();
    let address = $("#address").val();
    let email = $("#email").val();
    let age = $("#age").val();
    return new NewEmployee(fname, lname, address, email, age);
}

function saveHandler() {
    saveJSONFile(requestsData, "Requests");
}