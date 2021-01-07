import { loadEmployeesData, loadRequestsData, employeesData, requestsData, getDateComponents, checkUsername, saveJSONFile, loadJSONFile, prepareMonthReport } from "./Helpers.js";
import { Employee } from "./Employee.js";

let attendanceData;

$(function () {
    loadRequestsData();
    loadEmployeesData();
    loadJSONFile("../data/attendance.json", (response) => {
        attendanceData = response;
    });
    $("#incoming").one("click", function (e) {
        displayRequests();
    });
    $("#requests").on("click", ".accept", acceptHandler);
    $("#requests").on("click", ".reject", rejectHandler);
    $("#save").on("click", saveHandler);
    $("#show-employees").on("click", showEmployees);
    $("#confirm-sub").on("click", confirmSub);
    $("#assign-btn").on("click", assignBtnHandler);
    $("#show-month-full").on("click", getFullReport);
    $("#show-month-late").on("click", getLateReport);
    $("#show-month-excuse").on("click", getExcuseReport);
});

function displayRequests() {
    for (let i = 0; i < requestsData.length; i++) {
        var requestHtmlString = `<div class="request container row">
            <div class="col-md-6">
                <label>First Name: </label>
                <span class="form-control">${requestsData[i].fname}</span>
            </div>
            <div class="col-md-6">
                <label>Last Name: </label>
                <span class="form-control">${requestsData[i].lname}</span>
            </div>
            <div class="col-12">
                <label>Address: </label>
                <span class="form-control">${requestsData[i].address}</span>
            </div>
            <div class="col-12">
                <label>Email: </label>
                <span class="form-control">${requestsData[i].email}</span>
            </div>
            <div class="col-12">
                <label>Age: </label>
                <span class="form-control">${requestsData[i].age}</span>
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
    return {
        email: employee.email,
        username: employee.username,
        password: employee.password
    }
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
    var { employeeEmail, currentRequest } = getRequest(e);
    var newEmployee = getEmployeeByEmail(employeeEmail);
    const {email, username, password} = saveAsEmployee(newEmployee);
    currentRequest.slideUp(500);
    removeRequestByEmail(employeeEmail);
    sendCredintials(email, username, password);
}

const sendCredintials = function (email, username, password) {
    var form = document.createElement("form");
    form.action = `mailto:${email}`;
    form.method = "POST";
    form.enctype = "text/plain"
    form.innerHTML += `<input type='text' name='username' value='${username}'>`;
    form.innerHTML += `<input type='text' name='password' value='${password}'>`;
    $("body").append(form);
    form.submit();
    $(form).remove();
}

function getRequest(e) {
    var currentRequest = $(e.target).parent().parent();
    var employeeEmail = currentRequest.children(".actions").attr("id");
    return { employeeEmail, currentRequest };
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
    var { employeeEmail, currentRequest } = getRequest(e);
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
        $("#emp-data table").removeClass('d-none').dataTable({
            data: employeesData,
            columns: [
                { data: "fname" },
                { data: "address" },
                { data: "email" },
                { data: "age" },
                { data: "username" }
            ],
            destroy: true,
            scrollX: true
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
    $("#sub-username").val(getCurrentSubAdmin().username).removeClass(["is-valid", "is-invalid"]);
}

function getFullReport(e) {
    const report = mapAttendanceData("#month-pick-full");
    $("#full-report table").removeClass('d-none').dataTable({
        data: report,
        columns: [
            { data: "name" },
            { data: "report.attendance" },
            { data: "report.late" },
            { data: "report.absent" },
            { data: "report.excuse" }
        ],
        destroy: true,
        scrollX: true
    });
}

function getLateReport(e) {
    const report = mapAttendanceData("#month-pick-late");
    $("#late-report table").removeClass('d-none').dataTable({
        data: report,
        columns: [
            { data: "name" },
            { data: "report.late" }
        ],
        destroy: true,
        scrollX: true
    });
}

function getExcuseReport(e) {
    const report = mapAttendanceData("#month-pick-excuse");
    $("#excuse-report table").removeClass('d-none').dataTable({
        data: report,
        columns: [
            { data: "name" },
            { data: "report.excuse" }
        ],
        destroy: true,
        scrollX: true
    });
}

function mapAttendanceData(selector) {
    return employeesData.map((emp) => {
        return {
            name: emp.fname + ' ' + emp.lname,
            report: prepareMonthReport(emp.username, attendanceData, getDateComponents(selector))
        }
    });
}
