import { checkUsername, loadEmployeesData, employeesData, saveJSONFile, loadJSONFile, msToTime, SYSTEM_CLOSE, SYSTEM_OPEN } from './Helpers.js';

let attendanceData = {};

$(document).ready(function () {
    loadEmployeesData();
    loadJSONFile("../data/Attendance.json", getAttendanceData);
    $("#confirm").on("click", confirmHandler);
    $("#excuse").on("click", confirmHandler);
    $("#save").on("click", saveAllHandler);
    StartTimer();
});

function getAttendanceData(response) {
    attendanceData = response;
}

function confirmHandler(e) {
    var username = $("#username");
    var confirmationModal = $("#confirmation");
    var employee = checkUsername(username.val(), employeesData);
    let arrival = new Date();
    
    if (employee) {
        const savedTime = saveEmployeeAttendance(username.val(), arrival, e.target);
        if (!savedTime) {
            $("#alreadyTaken").modal("show");
        } else {
            username.removeClass("is-invalid").addClass("is-valid");
            $("#fullname").text(employee.fname + " " + employee.lname);
            $("#arrival").text(savedTime);
            confirmationModal.modal("show");
        }
    } else {
        username.removeClass("is-valid").addClass("is-invalid");
    }
}

function saveEmployeeAttendance(username, date, button) {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let time = button.id === 'confirm' ? date.toLocaleTimeString() : 'excuse';
    if (!attendanceData[year]) {
        attendanceData[year] = {
            [month]: {
                [day]: {
                    [username]: time
                }
            }
        };
    } else if (!attendanceData[year][month]) {
        attendanceData[year][month] = {
            [day]: {
                [username]: time
            }
        };
    } else if (!attendanceData[year][month][day]) {
        attendanceData[year][month][day] = {
            [username]: time
        };
    } else if (attendanceData[year][month][day][username]) {
        return false;
    } else {
        attendanceData[year][month][day][username] = time;
    }
    return time;
}

function saveAllHandler(e) {
    saveJSONFile(attendanceData, "Attendance");
}

function StartTimer() {
    let opening = new Date();
    let closing = new Date();
    let now = new Date();
    opening.setHours(SYSTEM_OPEN, '0', '0');
    closing.setHours(SYSTEM_CLOSE, '0', '0');
    let open, timeRemaining;
    open = opening.getTime() <= now.getTime() && now.getTime() < closing.getTime();
    if (open) {
        $("#attend-div").removeClass('d-none');
        let timer = setInterval(() => {
            now = new Date();
            timeRemaining = closing.getTime() - now.getTime();
            $("#timer").text(msToTime(timeRemaining));
            if (timeRemaining <= 0) {
                clearInterval(timer);
                setAbsentEmployees();
                $("#save").trigger("click");
                $("#attend-div").addClass('d-none');
            }
        }, 1000);
    } else {
        $("#attend-div").addClass('d-none');
    }
}

document.DOCUMENT_POSITION_CONTAINED_BY

function setAbsentEmployees() {  
    employeesData.filter((emp) => {
        saveEmployeeAttendance(emp.username, new Date())
    });
}
