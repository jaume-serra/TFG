var videoElement;
// Define a variable to track whether there are ads loaded and initially set it to false
var adsLoaded = false;
var adContainer;
var adDisplayContainer;
var adsLoader;

var adsManager;


window.addEventListener('load', function (event) {
    videoElement = document.getElementById('video-element');
    initializeIMA();
    videoElement.addEventListener('play', function (event) {
        loadAds(event);
    });
    var playButton = document.getElementById('play-button');
    playButton.addEventListener('click', function (event) {
        videoElement.play();
    });
});

window.addEventListener('resize', function (event) {
    console.log("window resized");
    if (adsManager) {
        var width = videoElement.clientWidth;
        var height = videoElement.clientHeight;
        adsManager.resize(width, height, google.ima.ViewMode.NORMAL);
    }
});

function initializeIMA() {
    adContainer = document.getElementById('ad-container');

    adDisplayContainer = new google.ima.AdDisplayContainer(adContainer, videoElement);
    adsLoader = new google.ima.AdsLoader(adDisplayContainer);

    // Let the AdsLoader know when the video has ended
    videoElement.addEventListener('ended', function () {
        adsLoader.contentComplete();
    });

    var adsRequest = new google.ima.AdsRequest();
    adsRequest.adTagUrl = 'https://pubads.g.doubleclick.net/gampad/ads?' +
        'iu=/21775744923/external/single_ad_samples&sz=640x480&' +
        'cust_params=sample_ct%3Dlinear&ciu_szs=300x250%2C728x90&' +
        'gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=';

    // Specify the linear and nonlinear slot sizes. This helps the SDK to
    // select the correct creative if multiple are returned.
    adsRequest.linearAdSlotWidth = videoElement.clientWidth;
    adsRequest.linearAdSlotHeight = videoElement.clientHeight;
    adsRequest.nonLinearAdSlotWidth = videoElement.clientWidth;
    adsRequest.nonLinearAdSlotHeight = videoElement.clientHeight / 3;

    // Pass the request to the adsLoader to request ads
    adsLoader.requestAds(adsRequest);
    adsLoader.addEventListener(
        google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
        onAdsManagerLoaded,
        false);
    adsLoader.addEventListener(
        google.ima.AdErrorEvent.Type.AD_ERROR,
        onAdError,
        false);

}

function loadAds(event) {
    // Prevent this function from running on if there are already ads loaded
    if (adsLoaded) {
        return;
    }
    adsLoaded = true;

    // Prevent triggering immediate playback when ads are loading
    event.preventDefault();

    // Initialize the container. Must be done via a user action on mobile devices.
    videoElement.load();
    adDisplayContainer.initialize();

    var width = videoElement.clientWidth;
    var height = videoElement.clientHeight;
    try {

        adsManager.init(width, height, google.ima.ViewMode.NORMAL);
        adsManager.start();

    } catch (adError) {
        // Play the video without ads, if an error occurs
        videoElement.play();

    }

}



function initializeIMA() {
    adContainer = document.getElementById('ad-container');
    adDisplayContainer = new google.ima.AdDisplayContainer(adContainer, videoElement);
    adsLoader = new google.ima.AdsLoader(adDisplayContainer);
    adsLoader.addEventListener(
        google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
        onAdsManagerLoaded,
        false);
    adsLoader.addEventListener(
        google.ima.AdErrorEvent.Type.AD_ERROR,
        onAdError,
        false);

    // Let the AdsLoader know when the video has ended
    videoElement.addEventListener('ended', function () {
        adsLoader.contentComplete();
    });

    var adsRequest = new google.ima.AdsRequest();
    adsRequest.adTagUrl = 'https://pubads.g.doubleclick.net/gampad/ads?' +
        'iu=/21775744923/external/single_ad_samples&sz=640x480&' +
        'cust_params=sample_ct%3Dlinear&ciu_szs=300x250%2C728x90&' +
        'gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=';

    // Specify the linear and nonlinear slot sizes. This helps the SDK to
    // select the correct creative if multiple are returned.
    adsRequest.linearAdSlotWidth = videoElement.clientWidth;
    adsRequest.linearAdSlotHeight = videoElement.clientHeight;
    adsRequest.nonLinearAdSlotWidth = videoElement.clientWidth;
    adsRequest.nonLinearAdSlotHeight = videoElement.clientHeight / 3;

    // Pass the request to the adsLoader to request ads
    adsLoader.requestAds(adsRequest);

}

function onAdsManagerLoaded(adsManagerLoadedEvent) {
    // Instantiate the AdsManager from the adsLoader response and pass it the video element
    adsManager = adsManagerLoadedEvent.getAdsManager(
        videoElement);
    adsManager.addEventListener(
        google.ima.AdErrorEvent.Type.AD_ERROR,
        onAdError);
    adsManager.addEventListener(
        google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED,
        onContentPauseRequested);
    adsManager.addEventListener(
        google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED,
        onContentResumeRequested);
    adsManager.addEventListener(
        google.ima.AdEvent.Type.LOADED,
        onAdLoaded);
    adsManager.addEventListener(
        google.ima.AdEvent.Type.STARTED,
        onAdEvent);
    adsManager.addEventListener(
        google.ima.AdEvent.Type.ALL_ADS_COMPLETED,
        onAdEvent);
}

function onAdLoaded(adEvent) {
    var ad = adEvent.getAd();
    if (!ad.isLinear()) {
        videoElement.play();
    }
}

function onContentPauseRequested() {
    videoElement.pause();
}

function onContentResumeRequested() {
    videoElement.play();
}


function onAdError(adErrorEvent) {
    // Handle the error logging.
    console.log(adErrorEvent.getError());
    if (adsManager) {
        adsManager.destroy();
    }
}
function onAdsManagerLoaded(adsManagerLoadedEvent) {
    // Instantiate the AdsManager from the adsLoader response and pass it the video element
    adsManager = adsManagerLoadedEvent.getAdsManager(
        videoElement);
}

function onAdError(adErrorEvent) {
    // Handle the error logging.
    console.log(adErrorEvent.getError());
    if (adsManager) {
        adsManager.destroy();
    }
}
function onAdEvent(adEvent) {


    var ad = adEvent.getAd();
    switch (adEvent.type) {
        case google.ima.AdEvent.Type.STARTED:
            // This event indicates the ad has started - the video player
            // can adjust the UI, for example display a pause button and
            // remaining time.
            if (ad.isLinear()) {
                // For a linear ad, a timer can be started to poll for
                // the remaining time.

                intervalTimer = setInterval(

                    function () {
                        var remainingTime = adsManager.getRemainingTime();
                        console.log(remainingTime)
                    },
                    300); // every 300ms
            }
            break;
        case google.ima.AdEvent.Type.COMPLETE:
            // This event indicates the ad has finished - the video player
            // can perform appropriate UI actions, such as removing the timer for
            // remaining time detection.
            if (ad.isLinear()) {
                clearInterval(intervalTimer);
            }
            break;
    }

}