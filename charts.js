function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    const samples = data.samples;

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    // 5. Create a variable that holds the first sample in the array.
    const firstSample = samples.filter(s => s.id === sample)[0];
    console.log(samples)

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    const ids = firstSample.otu_ids;
    const labels = firstSample.otu_labels;
    const values = firstSample.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    const topIds = ids
      .sort((a, b) => a > b)
      .slice(0, 10)
      .map(val => 'OTU ' + val)
      .reverse();
    const topLabels = labels
      .sort((a, b) => a > b)
      .slice(0, 10)
      .reverse();
    const topValues = values
      .sort((a, b) => a > b)
      .slice(0, 10)
      .map(val => parseInt(val))
      .reverse();

    var yticks = topIds;


    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: topValues,
      y: yticks,
      type: 'bar',
      orientation: 'h',
      text: topLabels
    }];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
     title: 'Top 10 Bacteria Cultures Found',
     yaxis: { tickvals: yticks }
    };

    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot('bar', barData, barLayout);


    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: ids,
      y: values,
      text: labels,
      mode: 'markers',
      marker: {
        size: values,
        color: ids,
        colorscale: 'Earth'
      }
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Cultures per Sample',
      xaxis: { title: 'OTU ID' },
      hovermode:'closest'
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);
  });
}
