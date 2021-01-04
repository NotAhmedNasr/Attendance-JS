import { loadEmployeesData, employeesData, loadJSONFile, LATE, SYSTEM_CLOSE, compareTimes } from "./Loaders.js";

let attendanceData;
let user = sessionStorage.getItem("user");
$(document).ready(function () {
    loadEmployeesData();
    loadJSONFile("../data/Attendance.json", getAttendanceData);
    setTimeout(() => {
        displayEmployeeInfo();
    }, 500);
    $("#toAttendance").on("click", AttendanceHandler);
    $("#show-month").on("click", showMonthhandler);
    $("#show-day").on("click", showDayhandler);
});

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
    var attendanceReport = prepareMonthReport(user, date);
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

function getDateComponents(selector) {
    var date = $(selector).val().split("-");
    return {
        year: Number(date[0]),
        month: Number(date[1]),
        day: Number(date[2]) ? Number(date[2]) : undefined
    };
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

function prepareMonthReport(username, attendanceData, { year, month }) {
    var attendance = 0, absent = 0, late = 0;
    var months = attendanceData[year];
    if (months) {
        var days = months[month];
        if (days) {
            for (const [day, users] of Object.entries(days)) {
                let time = users[username];
                if (time) {
                    if (compareTimes(time, SYSTEM_CLOSE + ':30:00 AM') >= 0) {
                        absent++;

                    } else if (compareTimes(time, LATE) > 0) {
                        late++;
                    } else {
                        attendance++;
                    }
                }
            }
            return { attendance, late, absent };
        }
    }

    return { attendance, late, absent };
}