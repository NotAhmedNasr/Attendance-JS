import { loadEmployeesData, employeesData, loadJSONFile, prepareMonthReport, getDateComponents } from "./Helpers.js";

let attendanceData;
let user = sessionStorage.getItem("user");
$(document).ready(function () {
    loadEmployeesData();
    loadJSONFile("../data/Attendance.json", getAttendanceData);
    setTimeout(() => {
        displayEmployeeInfo();
    }, 100);
    $("#toAttendance").on("click", AttendanceHandler);
    $("#show-month").on("click", showMonthhandler);
    $("#show-day").on("click", showDayhandler);
    $("#logout").on("click", logout);
});

function logout(e) {
    sessionStorage.clear();
    window.close();
}

function getAttendanceData(response) {
    attendanceData = response;
}

function getCurrentEmployeeData(username) {
    let employee = employeesData.filter((emp) => {
        if (emp.username == username)
            return true;
        else
            return false;
    });
    return employee[0];
}

function displayEmployeeInfo() {
    var employee = getCurrentEmployeeData(user);
    if (!employee) { return; }
    fillEmployeeData(employee);
    if (employee.subAdmin) {
        $("#toAttendance").removeClass("d-none");
    }
}

function AttendanceHandler(e) {
    var link = document.createElement("a");
    link.href = "Attendance.html";
    link.setAttribute("target", "_blank");
    $("body").append(link);
    link.click();
}

function showMonthhandler(e) {
    fillMonthData("No Data", "No Data", "No Data");
    var date = getDateComponents("#month-pick");
    var attendanceReport = prepareMonthReport(user, attendanceData, date);
    if (attendanceReport) {
        fillMonthData(attendanceReport);
    }
}

function fillMonthData({ attendance, late, absent }) {
    $("#attendance").text(attendance);
    $("#late").text(late);
    $("#absent").text(absent);
}

function showDayhandler(e) {
    var date = getDateComponents("#day-pick");
    var arrival = getArriveTime(user, date);
    if (!arrival) {
        arrival = "Didn't Show up";
    }
    $("#arrive-time").text(arrival);
}

function fillEmployeeData({ fname, lname, address, email, age, username }) {
    $("#fname").text(fname);
    $("#lname").text(lname);
    $("#address").text(address);
    $("#email").text(email);
    $("#age").text(age);
    $("#username").text(username);
}

function getArriveTime(username, { year, month, day }) {
    var months = attendanceData[year];
    if (months) {
        var days = months[month];
        if (days) {
            var times = days[day];
            if (times) {
                return times[username];
            }
            return false;
        }
        return false;
    }
    return false;
}
