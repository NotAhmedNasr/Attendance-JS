"use strict";

var employeesData = [];
$(document).ready(function () {
  loadEmployeesData();
  $("#login").on("click", loginHandler);
});

function loadEmployeesData() {
  var url = "../data/Employees.json";
  $.ajax({
    type: "GET",
    url: url,
    success: function success(response) {
      employeesData = response;
    }
  });
}

function checkUsername(username) {
  for (var i = 0; i < employeesData.length; i++) {
    if (employeesData[i].username == username) {
      return employeesData[i];
    }
  }

  return false;
}

function checkPassword(empData, password) {
  return empData.password == password;
}

function loginHandler(e) {
  var forms = $(".needs-validation");
  console.log(forms.childrenAll());
  forms.addClass("was-validated");
}