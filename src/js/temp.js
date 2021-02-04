var dataPath = 'data/APRT_Web_VN_ENG_Realtime_BAM-BA.csv';
var gAprtFilter;
// Unique value of the column to append to the filter value list
var gCeid;
var gL2;
var gEntity;
var gOperation;
var gProduct;
var isFilter = false;

// For shorten the appendFilterValue() function -> TODO
const filterFeature = ['gCeid', 'gL2', 'gEntity', 'gOperation', 'gProduct'];

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

function getUniqueValue(aprt) {
    return aprt.filter((item, i, ar) => ar.indexOf(item) === i);
}

function updateFilter() {
    // Update all the value of each filter whenever a filter is used
    gCeid = gAprtFilter.map(function(d) {return d.ceid});
    gCeid = getUniqueValue(gCeid);

    gL2 = gAprtFilter.map(function(d) {return d.ceid});
    gL2 = getUniqueValue(gL2);

    gEntity = gAprtFilter.map(function(d) {return d.entity});
    gEntity = getUniqueValue(gEntity);

    gOperation = gAprtFilter.map(function(d) {return d.operation});
    gOperation = getUniqueValue(gOperation);

    gProduct = gAprtFilter.map(function(d) {return d.prodgroup3});
    gProduct = getUniqueValue(gProduct);
}

function appendFilterValue() {
    // $('#selectCeid').find('option').not(':first').remove();
    // $('#selectL2').find('option').not(':first').remove();
    // $('#selectEntity').find('option').not(':first').remove();
    // $('#selectOperation').find('option').not(':first').remove();
    // $('#selectProduct').find('option').not(':first').remove();
    $('#selectCeid option:not(:first)').remove();
    $('#selectL2 option:not(:first)').remove();
    $('#selectEntity option:not(:first)').remove();
    $('#selectOperation option:not(:first)').remove();
    $('#selectProduct option:not(:first)').remove();
    for (var i = 0; i < gCeid.length; i++) {
        $('#selectCeid').append($('<option>',
        {
           value: gCeid[i],
           text : gCeid[i]
        }));
    }
    $('.selectpicker#selectCeid').selectpicker('refresh');

    for (var i = 0; i < gL2.length; i++) {
        $('#selectL2').append($('<option>',
        {
           value: gL2[i],
           text : gL2[i]
        }));
    }
    $('.selectpicker#selectL2').selectpicker('refresh');

    for (var i = 0; i < gEntity.length; i++) {
        $('#selectEntity').append($('<option>',
        {
           value: gEntity[i],
           text : gEntity[i]
        }));
    }
    $('.selectpicker#selectEntity').selectpicker('refresh');

    for (var i = 0; i < gOperation.length; i++) {
        $('#selectOperation').append($('<option>',
        {
           value: gOperation[i],
           text : gOperation[i]
        }));
    }
    $('.selectpicker#selectOperation').selectpicker('refresh');

    for (var i = 0; i < gProduct.length; i++) {
        $('#selectProduct').append($('<option>',
        {
           value: gProduct[i],
           text : gProduct[i]
        }));
    }
    $('.selectpicker#selectProduct').selectpicker('refresh');
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
    
    console.log(gAprtFilter);
    updateFilter();
    appendFilterValue();

    var aprtStartTime = aprt.map(function(d) {return d.aprt_start_time.split(' ')[0]});
    var sortTime = preprocessingTime(aprtStartTime);

    var aprtGrade = aprt.map(function(d) {return d.aprt_grade});

    const aprtGroupByProduct = groupBy(aprt, 'prodgroup3');
    
    var aprtData = [];
    console.log(gProduct);
    for (var i = 0; i < gProduct.length; i++) {
        var aprtGradeGrouped = aprtGroupByProduct[gProduct[i]].map(function(d) {return +d.aprt_grade});
        var aprtGradeGroupedTime = aprtGroupByProduct[gProduct[i]].map(function(d) {return d.aprt_start_time});
        var dataAprtTime = [];
        color = getRandomColor();

        for(var j = 0; j < aprtGradeGrouped.length; j++) {
            dataAprtTime.push(
                {
                    x: aprtGradeGroupedTime[j],
                    y: aprtGradeGrouped[j]
                }
            );
        }
        aprtData.push(
            {
                // plot setting for each product
                label: gProduct[i],
                borderColor: color,
                borderWidth: 4,
                lineTension: 0,
                pointStyle: 'line',
                fill:false,
                data: dataAprtTime
            }
        );
    }

    var chart = new Chart('myChart', {
        type: 'line',
        data: {
            // use slide() function for select the data in the range of the array
            // labels: sorted_time.slice(1).slice(-10),
            // labels: sorted_time,
            datasets: aprtData
        },
        options: {
            scales: {
              xAxes: [{
                type: 'time',
                time: {
                    displayFormats: {
                        day: 'MMM D'
                    }
                }
              }]
            }
        }
    });
}

function makeChartFilter(aprt, filterCol, filterVal) {
    /**
     * aprt: just map the data to get the feature array then use it in make chart
     * filterCol: filter feature
     * filterVal: filer value
     */
    var filterColValue;
    if (filterCol == "selectCeid") {
        filterColValue = "ceid";
    }
    else if (filterCol == "selectL2") {filterColValue = "ceid";}
    else if (filterCol == "selectEntity") {filterColValue = "entity";}
    else if (filterCol == "selectOperation") {filterColValue = "operation";}
    else if (filterCol == "selectProduct") {filterColValue = "prodgroup3";}
    else if (filterCol == "selectCascading") {filterColValue = "cascading";}
    if (filterVal == "All") {
        d3.csv(dataPath).then(makeChart);
    }
    else {
        gAprtFilter =  aprt.filter(function(item) {
            return item[filterColValue] == filterVal;
        });
        makeChart(gAprtFilter);
    }
    
    console.log(gAprtFilter);
    

}

$(document).ready(function() {
    /**
     * Get filter function for chart
     * Listen to every change of filter button
     * Call makeChartFilter() and pass the parameter into it
     * Remember to include updateFilter() in each filter function to update value of them
     */
    $('#filter-container').change(function(t) {
        console.log(t.target.name);
        console.log(t.target.value);
        makeChartFilter(gAprtFilter, t.target.name, t.target.value);
    });
});

// document.getElementById('filter-container').onchange = ({ target }) => {
//     console.log(target.value);
//     console.log(target.name);
//   };