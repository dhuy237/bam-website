// Dataset path
var dataPath = 'data/APRT_Web_VN_ENG_Realtime_BAM-BA.csv';
var unique = [];
var aprtStartTime;
var aprtGrade;
var prodGroup;
var personGroupedByColorGlobal;

function groupBy(array, key) {
    // Accepts the array and key
    return array.reduce((result, currentValue) => {
        // If an array already present for key, push it to the array. Else create an array and push the object
        (result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue);
        // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
        return result;
    }, {}); // empty object is the initial value for result object
}

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    // Transparent of 30% - 4D (hex values)
    color += '4D';
    return color;
}

function makeChart(aprt) {
    // Clear a chart from a canvas so that hover events cannot be triggered
    $("#myChart").remove();
    $('#graph-container').append('<canvas id="myChart"></canvas>');
    // Remove time with split(' ') to get date only of aprt_start_time
    aprtStartTime = aprt.map(function(d) {return d.aprt_start_time.split(' ')[0]});
    aprtGrade = aprt.map(function(d) {return d.aprt_grade});
    prodGroup = aprt.map(function(d) {return d.prodgroup3});
    
    // console.log(aprtStartTime);
    // sort time not correct because it type is string not Date
    var sorted_time = aprtStartTime.sort((a, b) => b.date - a.date);
    sorted_time = sorted_time.filter((item, i, ar) => ar.indexOf(item) === i);


    // Get unique prodGroup item
    // item --> item in array
    // i --> index of item
    // ar --> array reference, (in this case "list")
    unique = prodGroup.filter((item, i, ar) => ar.indexOf(item) === i);

    // console.log(unique);

    // Group by prodgroup3 as key to the aprt array
    const personGroupedByColor = groupBy(aprt, 'prodgroup3');
    // console.log(personGroupedByColor['EHL']);
    personGroupedByColorGlobal = personGroupedByColor;
    var aprtData = [];

    for (var i = 0; i < unique.length; i++) {
        console.log(unique[i]);
        var aprtGradeGrouped = personGroupedByColor[unique[i]].map(function(d) {return d.aprt_grade});
        color = getRandomColor();
        aprtData.push(
            {
                // plot setting for each product
                label: unique[i],
                borderColor: color,
                lineTension: 0,
                fill:false,
                data: aprtGradeGrouped
            }
        );
    }
    // console.log(aprtData);

    // var aprtGradeGrouped_EHL = personGroupedByColor['EHL'].map(function(d) {return d.aprt_grade});
    // var aprtGradeGrouped_JSL = personGroupedByColor['JSL'].map(function(d) {return d.aprt_grade});
    // console.log(aprtGradeGrouped);

    var chart = new Chart('myChart', {
        type: 'line',
        data: {
            // use slide() function for select the data in the range of the array
            labels: sorted_time.slice(1).slice(-10),
            datasets: aprtData
        }
    });
}

function makeChartFilter(filterVal) {
    // Clear a chart from a canvas so that hover events cannot be triggered
    $("#myChart").remove();
    $('#graph-container').append('<canvas id="myChart"></canvas>');
    // Remove time with split(' ') to get date only of aprt_start_time
    
    // console.log(aprtStartTime);
    // sort time not correct because it type is string not Date
    var sorted_time = aprtStartTime.sort((a, b) => b.date - a.date);
    sorted_time = sorted_time.filter((item, i, ar) => ar.indexOf(item) === i);


    // Get unique prodGroup item
    // item --> item in array
    // i --> index of item
    // ar --> array reference, (in this case "list")
    unique = prodGroup.filter((item, i, ar) => ar.indexOf(item) === i);

    // console.log(unique);

    // Group by prodgroup3 as key to the aprt array

    // console.log(personGroupedByColor['EHL']);
    var aprtData = [];

    for (var i = 0; i < filterVal.length; i++) {
        var aprtGradeGrouped = personGroupedByColorGlobal[filterVal[i]].map(function(d) {return d.aprt_grade});
        color = getRandomColor();
        aprtData.push(
            {
                // plot setting for each product
                label: filterVal[i],
                borderColor: color,
                lineTension: 0,
                fill:false,
                data: aprtGradeGrouped
            }
        );
    }
    
    
    console.log(aprtData);

    // var aprtGradeGrouped_EHL = personGroupedByColor['EHL'].map(function(d) {return d.aprt_grade});
    // var aprtGradeGrouped_JSL = personGroupedByColor['JSL'].map(function(d) {return d.aprt_grade});
    // console.log(aprtGradeGrouped);

    var chart = new Chart('myChart', {
        type: 'line',
        data: {
            // use slide() function for select the data in the range of the array
            labels: sorted_time.slice(0, 10),
            datasets: aprtData
        }
    });
}

// For Product Filter
$(document).ready(function() {
    // Event "show.bs.select": This event fires immediately when the show instance method is called.
    $('#select1').one('show.bs.select', function() {
        for (var i = 0; i < unique.length; i++) {
            $(this).append(`<option value="${unique[i]}">${unique[i]}</option>`);
        }
        $('.selectpicker#select1').selectpicker('refresh');
    })
});

$(document).ready(function() {
    // Get filter function for chart
    $('#select1').change(function() {
        var select = $("#select1").val();
        var selectLength = select.length;

        if (selectLength >= 1 && select.includes("All")) {
            $('.selectpicker#select1').selectpicker('deselectAll');
            d3.csv(dataPath).then(makeChart);
        }
        // if (select == "All") {
        //     d3.csv('data/APRT_Web_VN_ENG_Realtime_BAM-BA.csv').then(makeChart);
        // }
        else {
            console.log(select);
            makeChartFilter(select);
        }
    })
});

// For Operation Filter
$(document).ready(function() {
    // Event "show.bs.select": This event fires immediately when the show instance method is called.
    $('#selectOperation').one('show.bs.select', function() {
        for (var i = 0; i < unique.length; i++) {
            $(this).append(`<option value="${unique[i]}">${unique[i]}</option>`);
        }
        $('.selectpicker#selectOperation').selectpicker('refresh');
    })
});

$(document).ready(function() {
    // Get filter function for chart
    $('#selectOperation').change(function() {
        var select = $("#selectOperation").val();
        var selectLength = select.length;

        if (selectLength >= 1 && select.includes("All")) {
            $('.selectpicker#selectOperation').selectpicker('deselectAll');
            d3.csv(dataPath).then(makeChart);
        }
        // if (select == "All") {
        //     d3.csv('data/APRT_Web_VN_ENG_Realtime_BAM-BA.csv').then(makeChart);
        // }
        else {
            console.log(select);
            makeChartFilter(select);
        }
    })
});