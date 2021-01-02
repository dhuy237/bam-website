function groupBy(array, key) {
    // Accepts the array and key
    return array.reduce((result, currentValue) => {
        // If an array already present for key, push it to the array. Else create an array and push the object
        (result[currentValue[key]] = result[currentValue[key]] || []).push(
        currentValue
        );
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
    // Remove time with split(' ') to get date only of aprt_start_time
    var aprtStartTime = aprt.map(function(d) {return d.aprt_start_time.split(' ')[0]});
    var aprtGrade = aprt.map(function(d) {return d.aprt_grade});
    var prodGroup = aprt.map(function(d) {return d.prodgroup3});
    
    console.log(aprtStartTime)
    // sort time not correct because it type is string not Date
    var sorted_time = aprtStartTime.sort((a, b) => b.date - a.date);
    sorted_time = sorted_time.filter((item, i, ar) => ar.indexOf(item) === i);


    // Get unique prodGroup item
    // item --> item in array
    // i --> index of item
    // ar --> array reference, (in this case "list")
    let unique = prodGroup.filter((item, i, ar) => ar.indexOf(item) === i);

    console.log(unique);

    // Group by prodgroup3 as key to the aprt array
    const personGroupedByColor = groupBy(aprt, 'prodgroup3');
    console.log(personGroupedByColor['EHL']);
    var temp_dataset = [];

    for (var i = 0; i < unique.length; i++) {
        console.log(unique[i]);
        var aprtGradeGrouped = personGroupedByColor[unique[i]].map(function(d) {return d.aprt_grade});
        color = getRandomColor();
        temp_dataset.push(
            {
                label: unique[i],
                borderColor: color,
                fill:false,
                data: aprtGradeGrouped
            }
        );
    }
    console.log(temp_dataset);


    
    var aprtGradeGrouped_EHL = personGroupedByColor['EHL'].map(function(d) {return d.aprt_grade});
    var aprtGradeGrouped_JSL = personGroupedByColor['JSL'].map(function(d) {return d.aprt_grade});
    // console.log(aprtGradeGrouped);

    var chart = new Chart('myChart', {
        type: 'line',
        data: {
            labels: sorted_time,
            datasets: temp_dataset
        }
    });

    // var chart = new Chart('myChart', {
    //     type: 'line',
    //     data: {
    //     labels: aprtStartTime.slice(0, 2),
    //     datasets: [
    //         {
    //             label: 'EHL',
    //             borderColor: "rgba(220,0,0,0.2)",
    //             fill:false,
    //             data: aprtGradeGrouped_EHL
    //         },
    //         {
    //             label: 'JSL',
    //             borderColor: "rgba(0,220,0,0.2)",
    //             fill:false,
    //             data: aprtGradeGrouped_JSL
    //         },
    //     ]
    //     }
    // });
}