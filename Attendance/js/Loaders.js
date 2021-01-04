export let employeesData;
export let requestsData;

export const LATE = "9:00:00 AM";
export const SYSTEM_OPEN = "16";
export const SYSTEM_CLOSE = "9";

export function loadEmployeesData() {
    var url = "../data/Employees.json";
    $.ajax({
        type: "GET",
        url: url,
        success: function (response) {
            employeesData = response;
        },
        error: function (error) {
            employeesData = false;
        }
    });
}

export function loadRequestsData() {
    var url = "../data/Requests.json";
    $.ajax({
        type: "GET",
        url: url,
        success: function (response) {
            requestsData = response;
        },
        error: function (error) {
            requestsData = false;
        }
    });
}

export function loadJSONFile(url, callback) {
    $.ajax({
        type: "GET",
        url: url,
        success: function (response) {
            callback(response);
        },
        error: function (error) {
            callback(false);
        }
    });
}

export function checkUsername(username, data) {
    for (let i = 0; i < data.length; i++) {
        if (data[i].username == username) {
            return data[i];
        }
    }
    return false;
}

export function saveJSONFile(data, filename) {
    var dataToSave = new Blob([JSON.stringify(data)], { type: "application/json" });
    var link = document.createElement("a");
    link.href = window.webkitURL.createObjectURL(dataToSave);
    link.setAttribute("download", filename);
    document.getElementsByTagName("body")[0].appendChild(link);
    link.click();
    $(link).remove();
}


export function msToTime(s) {
    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;

    return (hrs < 10 ? '0' + hrs : hrs)
        + ' : ' + (mins < 10 ? '0' + mins : mins)
        + ' : ' + (secs < 10 ? '0' + secs : secs);
}

export function compareTimes(time1, time2) {
    time1 = time1.split(':');
    time2 = time2.split(':');
    debugger;
    if (time1[2].split(' ')[1] === time2[2].split(' ')[1]) {
        if (+time1[0] === +time2[0]) {
            if (+time1[1] === +time2[1]) {
                if (+time1[2].split(' ')[0] === +time2[2].split(' ')[0]) {
                    return 0;
                } else if (+time1[2].split(' ')[0] > +time2[2].split(' ')[0]) {
                    return 1;
                } else {
                    return -1;
                }
            } else if (+time1[1] > +time2[1]) {
                return 1;
            } else {
                return -1;
            }    
        } else if (+time1[0] > +time2[0]) {
            return 1;
        } else {
            return -1;
        }
    } else if (time1[2].split(' ')[1] === 'PM') {
        return 1;
    } else {
        return -1;
    }
}