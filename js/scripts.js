"use strict";

window.onload = function() {

/* Landing page */
// end with adjective that is hard-coded into html on load
var descriptorList = ['adaptor', 'strategist', 'connector', 'perfectionist', 'wordsmith', 'psychologist', 'comedian', 'virtual farmer', 'californian', 'life-long learner'];
var currentDescriptorIndex = -1;

// function to chnage banner adjectives every 2 seconds
function changeDescriptor() {
    ++currentDescriptorIndex;
    if (currentDescriptorIndex >= descriptorList.length) {
        currentDescriptorIndex = 0;
    }
    document.getElementById("text-switch").innerHTML = descriptorList[currentDescriptorIndex];
}
// intervalID keeps track of time interval until cleared
var intervalID = setInterval(changeDescriptor, 2000);


}