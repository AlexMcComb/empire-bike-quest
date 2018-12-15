// this is mock data, but when I create my API
// I'll have it return data that looks like this
var MOCK_JOB_REQUESTS = {
	"jobRequests": [
        {
            "Company": "Green Hub",
            "companyId": "aaaaaa",
            "Description": "30 letters weighing 1lb",
            "pickupLocation":"75 9th Ave, New York, NY 10011",
            "dropoffLocation":"131 W 3rd St, New York, NY 10012",
            "publishedAt": 1470016976609,
            "messenger":  "John",
            "comment": "arriving in 20 mins."
        },
        {
            "Company": "Blue Hub",
            "companyId": "bbbbbb",
            "Description": "1 box 3x3 in. 2lbs",
            "pickupLocation":"228 Park Ave S, New York, NY 10003",
            "dropoffLocation":"126 2nd Ave, New York, NY 10003",
            "publishedAt": 1470012976609,
            "messenger":  "Jeff",
            "comment": "arriving in 10 mins."
        },
        {
            "Company": "Orange Hub",
            "companyId": "oooooo",
            "Description": "1 box 5x3 in. 4lbs",
            "pickupLocation":"151 W 46th St, New York, NY 10036",
            "dropoffLocation":"205 E 99th St, New York, NY 10029",
            "publishedAt": 1470011976609,
            "messenger":  "Tim",
            "comment": "arriving in 10 mins."
        },
        {
            "Company": "Purple Hub",
            "companyId": "ppppppp",
            "Description": "2 boxes 2x3 in. 6lbs",
            "pickupLocation":"1000 5th Ave, New York, NY 10028",
            "dropoffLocation":"Second Ave. bet. E. 59 St. to, E 60th St, New York, NY 10022",
            "publishedAt": 1470009976609,
            "messenger":  "Tim",
            "comment": "left with Kathy at front desk"
        }
    ]
};

// this function's name and argument can stay the
// same after we have a live API, but its internal
// implementation will change. Instead of using a
// timeout function that returns mock data, it will
// use jQuery's AJAX functionality to make a call
// to the server and then run the callbackFn
function getJobRequests(callbackFn) {
    // we use a `setTimeout` to make this asynchronous
    // as it would be with a real AJAX call.
	setTimeout(function(){ callbackFn(MOCK_JOB_REQUESTS)}, 1);
}

// this function stays the same when we connect
// to real API later
function displayJobRequests(data) {
    for (index in data.jobRequests) {
	   $('body').append(
        '<p>' + data.jobRequests[index].Company + '</p>',
        '<p>' + data.jobRequests[index].Description + '</p>',
        '<p>' + data.jobRequests[index].pickupLocation + '</p>',
        '<p>' + data.jobRequests[index].dropoffLocation + '</p>');
    }
}

// this function can stay the same even when we
// are connecting to real API
function getAndDisplayJobRequests() {
	getJobRequests(displayJobRequests);
}

//  on page load do this
$(function() {
	getAndDisplayJobRequests();
})