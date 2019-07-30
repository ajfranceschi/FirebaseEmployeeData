const firebaseConfig = {
    apiKey: "AIzaSyAPJgLNPaiDBUdThgnr1V-0zDqJ1i9Ur_Q",
    authDomain: "employee-data-management-c3100.firebaseapp.com",
    databaseURL: "https://employee-data-management-c3100.firebaseio.com",
    projectId: "employee-data-management-c3100",
    storageBucket: "",
    messagingSenderId: "213116870474",
    appId: "1:213116870474:web:bb3dc78d83300f01"
}

firebase.initializeApp(firebaseConfig);

const database = firebase.database();

$('form').on('submit', (event) => {
    event.preventDefault();
    const employeeName = $('#employeeNameTextField').val().trim();
    const role = $('#roleTextField').val().trim();
    const startDate = moment($('#startDateTextField').val().trim()).format('MM/DD/YYYY');
    const monthlyRate = $('#monthlyRateTextField').val().trim();
    const formatter = new Intl.NumberFormat('en-us', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    });

    const formattedMonthlyRate = formatter.format(monthlyRate);

    //calculate months worked:
    const startDateMoment = moment($('#startDateTextField').val().trim());
    const currentDate = moment()
    const monthsWorked = currentDate.diff(startDateMoment, 'months');

    const totalBilled = monthsWorked * monthlyRate;

    const newEmployee = {
        employeeName: employeeName,
        role: role,
        startDate: startDate,
        monthsWorked: monthsWorked,
        monthlyRate: formattedMonthlyRate,
        totalBilled: formatter.format(totalBilled)
    }

    console.log(newEmployee);



    firebase.database().ref('/employees/').push(newEmployee, (error) => {
        if (error) {
            alert("Couldn't add employee");
        } else {
            alert('Added employee successfully');

            // clear inputs
            $('#employeeNameTextField').val('');
            $('#roleTextField').val('');
            $('#startDateTextField').val('');
            $('#monthlyRateTextField').val('');

        }
    })

});

firebase.database().ref('/employees/').on('value', (snapshot) => {
    $('tbody').empty();
    for (const employee in snapshot.val()) {
        generateTableRow(snapshot.child(employee).val(), employee);
    }
})


const generateTableRow = (employee, id) => {
    const tableRow = $('<tr>');
    const empName = $('<th>').text(employee.employeeName);
    const empRole = $('<td>').text(employee.role);
    const startDate = $('<td>').text(employee.startDate);
    const monthsWorked = $('<td>').text(employee.monthsWorked);
    const monthlyRate = $('<td>').text(employee.monthlyRate);
    const totalBilled = $('<td>').text(employee.totalBilled);
    const deleteBtn = $('<button>');
    deleteBtn.addClass('btn btn-sm btn-danger deleteBtn');
    deleteBtn.text('X')
    deleteBtn.attr('value', id)
    const deleteCell = $('<td>').append(deleteBtn);
    tableRow.append(empName, empRole, startDate, monthsWorked, monthlyRate, totalBilled, deleteCell);
    $('tbody').append(tableRow);
}

$('tbody').on('click', 'button', (event) => {
    if (confirm('Delete this row?')) {
        firebase.database().ref('/employees').child(event.target.value).remove().then((error) => {
            if (error) {
                alert("Couldn't delete row.")
            } else {
                alert("Row deleted")
            }
        });

    } else {
        alert("Delete row cancelled.")
    }
})



