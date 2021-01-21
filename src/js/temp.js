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

var gAprtFilter;

function makeChart(aprt) {
    // Clear a chart from a canvas so that hover events cannot be triggered (it appears when we call makeChart() many times)
    $("#myChart").remove();
    $('#graph-container').append('<canvas id="myChart"></canvas>');
    
    gAprtFilter = aprt;

    var aprtStartTime = aprt.map(function(d) {return d.aprt_start_time.split(' ')[0]});
    var aprtGrade = aprt.map(function(d) {return d.aprt_grade});
    var prodGroup = aprt.map(function(d) {return d.prodgroup3});
    
}

