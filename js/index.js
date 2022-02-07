"use strict";

window.onload = function() {

    console.log("js file working:");

var descriptorList = ['adaptor', 'strategist', 'connector', 'perfectionist', 'wordsmith', 'psychologist', 'comedian', 'virtual farmer', 'californian', 'life-long learner'];
var currentDescriptorIndex = -1;

function changeDescriptor() {
    ++currentDescriptorIndex;
    if (currentDescriptorIndex >= descriptorList.length) {
        currentDescriptorIndex = 0;
    }
    document.getElementById("text-switch").innerHTML = descriptorList[currentDescriptorIndex];
}
var intervalID = setInterval(changeDescriptor, 2000);


/*function advanceNewsItem() {
    ++curNewsIndex;
    if (curNewsIndex >= newsArray.length) {
        curNewsIndex = 0;
    }
    setTickerNews(newsArray[curNewsIndex]);   // set new news item into the ticker
}

var intervalID = setInterval(advanceNewsItem, 5000);*/

}