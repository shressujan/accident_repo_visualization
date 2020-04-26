const margin = {top: 40, right: 40, bottom: 60, left: 150};
const width = 1000 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;
const bar_width = 20;

function draw_bar_chart(data, x_label, y_label, chart_id) {
    // Defining scales and the axes
    let x_scale = d3.scale.linear()
        .domain([0, d3.max(data.map(d => d.x))])
        .range([0, width - 10]);

    let x_axis = d3.svg.axis().scale(x_scale).orient('bottom');

    let y_scale = d3.scale.linear()
        .domain([0, d3.max(data.map(d => d.y))])
        .range([height, 0]);

    let y_axis = d3.svg.axis().scale(y_scale).orient('left');

    // Select the body element and defining svg
    const svg = d3.select('#' + chart_id)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);

    const g = svg.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.right + ')');

    // Defining tooltip element
    const tooltip = d3.select('body').append('text').attr('class', 'tooltip').style('visibility', 'hidden');

    // appending x-axis
    g.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(10,' + height + ')')
        .call(x_axis)
        .append('text')
        .attr('class', 'label')
        .attr('x', width / 2)
        .attr('y', 40)
        .text(x_label);

    //appending y-axis
    g.append('g')
        .attr('class', 'y axis')
        .call(y_axis)
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('class', 'label')
        .attr('x', 0 - height / 2)
        .attr('y', -margin.left / 2)
        .text(y_label);

    //appending bars for each item inside data
    g.selectAll('.bar')
        .data(data)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', d => x_scale(d.x))
        .attr('width', bar_width)
        .attr('y', d => y_scale(d.y))
        .attr('height', d => height - y_scale(d.y))
        .attr('fill', 'steelblue')
        .on('mouseover', function (d) {
            d3.select(this).style('fill', 'orange');
            tooltip.style('visibility', 'visible');
            tooltip.html('size' + ': ' + d.y)
                .style('left', (d3.event.pageX - 30) + 'px')
                .style('top', (d3.event.pageY - 30) + 'px');
        })
        .on('mouseout', function (d) {
            d3.select(this).style('fill', '#9399a1');
            tooltip.style('visibility', 'hidden');
        });
}


function draw_line_charts(data, x_label, y_label, chart_id) {

    data.sort(function (a, b) {
        return a.x - b.x;
    });
    // Defining scales and the axes
    let x_scale = d3.scale.linear()
        .domain([0, d3.max(data.map(d => d.x))])
        .range([0, width - 10]);

    let x_axis = d3.svg.axis().scale(x_scale).orient('bottom');

    let y_scale = d3.scale.linear()
        .domain(d3.extent(data.map(d => d.y)))
        .range([height, 0]);

    let y_axis = d3.svg.axis().scale(y_scale).orient('left');

    // Select the body element and defining svg
    const svg = d3.select('#' + chart_id)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);

    const g = svg.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.right + ')');

    // Defining tooltip element
    const tooltip = d3.select('body').append('text').attr('class', 'tooltip').style('visibility', 'hidden');

    const line_data = d3.svg.line()
        .x(d => x_scale(d.x))
        .y(d => y_scale(d.y));

    // appending x-axis
    g.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(x_axis)
        .append('text')
        .attr('class', 'label')
        .attr('x', width / 2)
        .attr('y', 40)
        .text(x_label);

    //appending y-axis
    g.append('g')
        .attr('class', 'y axis')
        .call(y_axis)
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('class', 'label')
        .attr('x', 0 - height / 2)
        .attr('y', -margin.left / 2)
        .text(y_label);

    //appending lines
    g.append('path')
        .attr('class', 'line')
        .attr('d',line_data(data));
}


/**
 * Drawing the line chart based on silhouette score vs clusters
 * Drawing the bar chart for cluster sizes based on accident_severity vs speed_limit modeling
 * Drawing the line chart based on accident_severity vs speed_limit modeling to show the relation between those entities
 */

data = [];
silhouette_scores = {2: 0.8933522239552208, 3: 0.909040187585049, 4: 0.9140758956742945, 5: 0.9512695629463538, 6: 0.9743186712104074, 7: 0.9874752847848223, 8: 0.9881787217758102, 9: 0.9891196347474278, 10: 0.9953687101964523, 11: 0.9954572523877511, 12: 0.9957738051930589, 13: 0.996082714391585, 14: 0.9979147200814854};
Object.entries(silhouette_scores).forEach(entry => data.push({'x': parseInt(entry[0]), 'y': entry[1]}));

draw_line_charts(data, 'Clusters', 'Silhouette Scores', 'silhouette_score_speed');

data = [];
cluster_sizes = {0: 66902, 1: 1407, 2: 7913, 3: 2695, 4: 2592, 5: 1622, 6: 10374, 7: 6061, 8: 434};
Object.entries(cluster_sizes).forEach(entry => data.push({'x': parseInt(entry[0]), 'y': entry[1]}));

draw_bar_chart(data, 'Clusters', 'Sizes', 'cluster_speed_limit');

// Chart for speed limit plotted against accident severity
d3.csv('accident_severity_vs_speed.csv', function (result) {
    let data = [];
    result.forEach(d => data.push({'x': parseInt(d.speed_limit), 'y': parseFloat(d.accident_severity)}));

    draw_line_charts(data, 'Speed limit', 'Accident Severity', 'accident_severity_vs_speed');
})


/**
 * Drawing the line chart based on silhouette score vs clusters
 * Drawing the bar chart for cluster sizes based on accident_severity vs time modeling
 * Drawing the line chart based on accident_severity vs time modeling to show the relation between those entities
 */

data = [];
silhouette_scores = {2: 0.6009759616222347, 3: 0.5337105936420904, 4: 0.5295183693603164, 5: 0.5558876246550153, 6: 0.5550868461118774, 7: 0.5520235286881143, 8: 0.5482429685065373, 9: 0.5534917310671479, 10: 0.5582592342143794, 11: 0.6160323986393491, 12: 0.5967690752892622, 13: 0.6127880553369283, 14: 0.660207715009597};
Object.entries(silhouette_scores).forEach(entry => data.push({'x': parseInt(entry[0]), 'y': entry[1]}));

draw_line_charts(data, 'Clusters', 'Silhouette Scores', 'silhouette_score_time');

data = [];
result = {2: 57201, 3: 7007, 4: 721, 5: 13455, 6: 13482, 8: 8134};
Object.entries(result).forEach(entry => data.push({'x': parseInt(entry[0]), 'y': entry[1]}));

draw_bar_chart(data, 'Clusters', 'Sizes', 'cluster_time');

// Chart for time plotted against accident severity
d3.csv('accident_severity_vs_time.csv', function (result) {
    let data = [];
    result.forEach(d => data.push({'x': parseInt(d.time), 'y': parseFloat(d.accident_severity)}));

    draw_bar_chart(data, 'Time', 'Accident Severity', 'accident_severity_vs_time');
})

/**
 * Drawing the line chart based on silhouette score vs clusters
 * Drawing the bar chart for cluster sizes based on accident_severity vs number of vehicles involved in accident modeling
 * Drawing the line chart based on accident_severity vs num_of_vehicles modeling to show the relation between those entities
 */

data = [];
silhouette_scores = {2: 0.7033426362459495, 3: 0.7764277220421356, 4: 0.899000453157279, 5: 0.9551603001679665, 6: 0.9703457634215089, 7: 0.9821245284282272, 8: 0.9848291779846035, 9: 0.9893226946300927, 10: 0.9951881578939313, 11: 0.997234224987967, 12: 0.9979198288667158, 13: 0.9988140420228583, 14: 0.9992516209663672};
Object.entries(silhouette_scores).forEach(entry => data.push({'x': parseInt(entry[0]), 'y': entry[1]}));

draw_line_charts(data, 'Clusters', 'Silhouette Scores', 'silhouette_score_num_vehicles');

data = [];
result = {0: 61183, 1: 7518, 2: 17597, 3: 262, 4: 5785, 5: 5135, 6: 721, 7: 1128, 8: 671};
Object.entries(result).forEach(entry => data.push({'x': parseInt(entry[0]), 'y': entry[1]}));

draw_bar_chart(data, 'Clusters', 'Sizes', 'cluster_num_vehicles');

// Chart for number of vehicles plotted against accident severity
d3.csv('accident_severity_vs_num_vehicles.csv', function (result) {
    let data = [];
    result.forEach(d => data.push({'x': parseInt(d.num_of_vehicles), 'y': parseFloat(d.accident_severity)}));

    draw_line_charts(data, 'Number of vehicles involved in accident', 'Accident Severity', 'accident_severity_vs_num_vehicles');
})

/**
 * Drawing the line chart based on silhouette score vs clusters
 * Drawing the bar chart for cluster sizes based on accident_severity vs road surface condition modeling
 * Drawing the line chart based on accident_severity vs road surface condition modeling to show the relation between those entities
 */

data = [];
silhouette_scores = {2: 0.7733607111452621, 3: 0.9095495733237546, 4: 0.9572628981497365, 5: 0.9802038393620872, 6: 0.9882656344005917, 7: 0.9909426846687183, 8: 0.9945948807488202, 9: 0.9976101665371647, 10: 0.9989990146641439, 11: 0.9995568211878272, 12: 0.9997860697643103, 13: 0.999960078125, 14: 1.0};
Object.entries(silhouette_scores).forEach(entry => data.push({'x': parseInt(entry[0]), 'y': entry[1]}));

draw_line_charts(data, 'Clusters', 'Silhouette Scores', 'silhouette_score_road_surface_condition');

data = [];
result = {0: 59666, 1: 24591, 2: 3627, 3: 9652, 4: 1209, 5: 511, 6: 301, 7: 248, 8: 195};
Object.entries(result).forEach(entry => data.push({'x': parseInt(entry[0]), 'y': entry[1]}));

draw_bar_chart(data, 'Clusters', 'Sizes', 'cluster_road_condition');

// Chart for road surface condition plotted against accident severity
d3.csv('accident_severity_vs_road_condition.csv', function (result) {
    let data = [];
    result.forEach(d => data.push({'x': parseInt(d.road_surface_condition), 'y': parseFloat(d.accident_severity)}));

    draw_line_charts(data, 'Road Surface condition', 'Accident Severity', 'accident_severity_vs_road_condition');
})

/**
 * Drawing the line chart based on silhouette score vs clusters
 * Drawing the bar chart for cluster sizes based on accident_severity vs light condition modeling
 * Drawing the line chart based on accident_severity vs light_condition modeling to show the relation between those entities
 */

data = [];
silhouette_scores = {2: 0.9045755402958956, 3: 0.9339840407750977, 4: 0.9293787212215159, 5: 0.9655008828784827, 6: 0.9750350591586692, 7: 0.9816960066309875, 8: 0.9874139614918962, 9: 0.9926069033537529, 10: 0.9950154685240866, 11: 0.9981632606996671, 12: 0.9990968975982518, 13: 0.9997540551927533, 14: 0.9999085106382978};
Object.entries(silhouette_scores).forEach(entry => data.push({'x': parseInt(entry[0]), 'y': entry[1]}));

draw_line_charts(data, 'Clusters', 'Silhouette Scores', 'silhouette_score_light_condition');

data = [];
result = {0: 18844, 1: 63778, 2: 9317, 3: 658, 4: 3758, 5: 1575, 6: 1251, 7: 470, 8: 349};
Object.entries(result).forEach(entry => data.push({'x': parseInt(entry[0]), 'y': entry[1]}));

draw_bar_chart(data, 'Clusters', 'Sizes', 'cluster_light_condition');

// Chart for road surface condition plotted against accident severity
d3.csv('accident_severity_vs_light_condition.csv', function (result) {
    let data = [];
    result.forEach(d => data.push({'x': parseInt(d.light_condition), 'y': parseFloat(d.accident_severity)}));

    draw_line_charts(data, 'Light condition', 'Accident Severity', 'accident_severity_vs_light_condition');
})

/**
 * Drawing the bar chart for cluster sizes based on accident_severity vs weather condition modeling
 * Drawing the line chart based on accident_severity vs weather condition modeling to show the relation between those entities
 */

data = [];
silhouette_scores = {2: 0.8449409211763586, 3: 0.8885712002772882, 4: 0.9277882496213088, 5: 0.9317815030009386, 6: 0.9405178570984501, 7: 0.9624754707762546, 8: 0.9716358964847577, 9: 0.9787228949947187, 10: 0.9827114769294679, 11: 0.9846216283401525, 12: 0.9879569885691357, 13: 0.9914446504971296, 14: 0.9938557934615392};
Object.entries(silhouette_scores).forEach(entry => data.push({'x': parseInt(entry[0]), 'y': entry[1]}));

draw_line_charts(data, 'Clusters', 'Silhouette Scores', 'silhouette_score_weather_condition');

data = [];
result = {0: 68692, 1: 11747, 2: 2727, 3: 11133, 4: 1228, 5: 1628, 6: 1447, 7: 792, 8: 606};
Object.entries(result).forEach(entry => data.push({'x': parseInt(entry[0]), 'y': entry[1]}));

draw_bar_chart(data, 'Clusters', 'Sizes', 'cluster_weather_condition');

// Chart for road surface condition plotted against accident severity
d3.csv('accident_severity_vs_weather_condition.csv', function (result) {
    let data = [];
    result.forEach(d => data.push({'x': parseInt(d.weather_condition), 'y': parseFloat(d.accident_severity)}));

    draw_line_charts(data, 'Weather condition', 'Accident Severity', 'accident_severity_vs_weather_condition');
})
