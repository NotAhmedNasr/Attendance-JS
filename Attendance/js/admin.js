import { loadEmployeesData, loadRequestsData, employeesData, requestsData, checkUsername, saveJSONFile } from "./Loaders.js";
import { Employee } from "./Employee.js";
$(document).ready(function () {
    loadRequestsData();
    loadEmployeesData();
    $("#incoming").on("click", function (e) {
        displayRequests();
    });
    $("#requests").on("click", ".accept", acceptHandler);
    $("#requests").on("click", ".reject", rejectHandler);
    $("#save").on("click", saveHandler);
    $("#show-employees").on("click", showEmployees);
    $("#confirm-sub").on("click", confirmSub);
    $("#assign-btn").on("click", assignBtnHandler);
});

function displayRequests() {
    for (let i = 0; i < requestsData.length; i++) {
        var requestHtmlString = `<div class="request container row">
            <div class="col-md-6">
                <label>First Name: </label>
                <span>${requestsData[i].fname}</span>
            </div>
            <div class="col-md-6">
                <label>Last Name: </label>
                <span>${requestsData[i].lname}</span>
            </div>
            <div class="col-12">
                <label>Address: </label>
                <span>${requestsData[i].address}</span>
            </div>
            <div class="col-12">
                <label>Email: </label>
                <span>${requestsData[i].email}</span>
            </div>
            <div class="col-12">
                <label>Age: </label>
                <span>${requestsData[i].age}</span>
            </div>
            <div class="offset-2 col-8 text-center actions" id=${requestsData[i].email}>
                <button type="button" class="btn btn-success accept">Accept</button>
                <button type="button" class="btn btn-danger reject">Reject</button>
            </div>
        </div>`;
        $("#requests").append(requestHtmlString);
    }
}

function saveAsEmployee(newEmployee) {
    var employee = new Employee(
        newEmployee.fname, newEmployee.lname, newEmployee.address,
        newEmployee.email, newEmployee.age,
        generateUsername(newEmployee),
        generatePassword()
    );

    employeesData.push(employee);
}

function generateUsername(employee) {
    var username = employee.fname.substring(0, 3) + employee.lname.substring(0, 3);
    var randomSuffix = Math.floor(Math.random() * 10000);
    username += randomSuffix;
    if (checkUsername(username, employeesData)) {
        username = generateUsername(employee);
    }
    else {
        return username;
    }
}

function generatePassword() {
    return Math.floor(Math.random() * 100000000) + 100000000;
}

function getEmployeeByEmail(email) {
    for (let i = 0; i < requestsData.length; i++) {
        if (requestsData[i].email == email)
            return requestsData[i];
    }
}

function acceptHandler(e) {
    var currentRequest = $(e.target).parent().parent();
    var employeeEmail = currentRequest.children(".actions").attr("id");
    var newEmployee = getEmployeeByEmail(employeeEmail);
    saveAsEmployee(newEmployee);
    currentRequest.slideUp(500);
    removeRequestByEmail(employeeEmail);
}

function removeRequestByEmail(email) {
    for (let i = 0; i < requestsData.length; i++) {
        if (requestsData[i].email == email) {
            requestsData.splice(i, 1);
            break;
        }
    }
}

function rejectHandler(e) {
    var currentRequest = $(e.target).parent().parent();
    var employeeEmail = currentRequest.children(".actions").attr("id");
    currentRequest.slideUp(500);
    removeRequestByEmail(employeeEmail);
}

function saveHandler() {
    saveJSONFile(requestsData, "Requests");
    saveJSONFile(employeesData, "Employees");
}

let loadedEmpData = false;
function showEmployees() {
    if (!loadedEmpData) {
        loadedEmpData = true;
        //fillEmployeesData(employeesData);
        $("#emp-data table").dataTable({
            data: employeesData,
            columns : [
                {data: "fname"},
                {data: "address"},
                {data: "email"},
                {data: "age"},
                {data: "username"}
            ]
        });
    }
}

function confirmSub(e) {
    var username = $("#sub-username");
    var toBeSub = checkUsername(username.val(), employeesData);
    if (toBeSub) {
        employeesData.filter((emp) => {
            emp.subAdmin = false;
        });
        toBeSub.subAdmin = true;
        username.removeClass("is-invalid").addClass("is-valid");
    } else {
        username.removeClass("is-valid").addClass("is-invalid");
    }
}

function getCurrentSubAdmin() {
    return employeesData.filter((emp) => {
        return emp.subAdmin == true;
    })[0];
}

function assignBtnHandler(e) {
    $("#sub-username").val(getCurrentSubAdmin().username);
}