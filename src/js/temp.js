var gAprtFilter;
// Unique value of the column to append to the filter value list
var gCeid;
var gL2;
var gEntity;
var gOperation;
var gProduct;


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

function updateFilter(aprt) {
    // TODO: update all the value of each filter whenever a filter is used
}

function preprocessingTime(arrTime) {
    // TODO: Preprocessing time value (aprt_start_time)

    /**
     * Convert date value from string to Date
     * Have to convert to Date type because it will be sorted later
     * Sort result only correct with Date type
     */
    arrTime.forEach(function(d, index, arr) {
        var parts = d.split('-');
        arr[index] = new Date(parts[0], parts[1] - 1, parts[2]);
    });

    // Sort time in ascending order
    var sorted_time = arrTime.sort((a, b) => a - b);
    /**
     * Convert "Wed Jul 01 2020 00:00:00 GMT+0700 (Indochina Time)" to "2020-07-01"
     * Date type to string with format "YYYY-MM-DD"
     */ 
    sorted_time.forEach(function(d, index, arr) { 
        arr[index] = d.toISOString().split('T')[0];
    });

    // Filter unique value of aprt_time_start only
    sorted_time = sorted_time.filter((item, i, ar) => ar.indexOf(item) === i);

    return sorted_time;
}

function makeChart(aprt) {
    // Clear a chart from a canvas so that hover events cannot be triggered (it appears when we call makeChart() many times)
    $("#myChart").remove();
    $('#graph-container').append('<canvas id="myChart"></canvas>');
    
    gAprtFilter = aprt;

    var aprtStartTime = aprt.map(function(d) {return d.aprt_start_time.split(' ')[0]});
    var sortTime = preprocessingTime(aprtStartTime);

    var aprtGrade = aprt.map(function(d) {return d.aprt_grade});

    var prodGroup = aprt.map(function(d) {return d.prodgroup3});
    gProduct = prodGroup.filter((item, i, ar) => ar.indexOf(item) === i);
    
    
    var aprtData = [];

    for (var i = 0; i < gProduct.length; i++) {

    }
}

function makeChartFilter(aprt, filterCol, filterVal) {
    /**
     * aprt: just map the data to get the feature array then use it in make chart
     * filterCol: filter feature
     * filterVal: filer value
     */
}

$(document).ready(function() {
    /**
     * Filter function for chart
     * Call updateFilter() to append the value to each filer
     */

});

$(document).ready(function() {
    /**
     * Get filter function for chart
     * Listen to every change of filter button
     * Call makeChartFilter() and pass the parameter into it
     * Remember to include updateFilter() in each filter function to update value of them
     */
});