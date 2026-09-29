window.onload = function() {
    var images = document.querySelectorAll('.dither'); // Select only images with 'dither' class
    
    images.forEach(function(img) {
        // Hide the original image
        img.style.display = 'none';

        // Create and insert canvas for the image
        createCanvasForImage(img);

        img.onload = function() {
            var canvas = img.nextElementSibling;
            var ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            atkinsonDithering(ctx, img.width, img.height);
        };

        // If the image is already loaded, manually trigger onload
        if (img.complete) {
            img.onload();
        }
    });
};

function createCanvasForImage(img) {
    var canvas = document.createElement('canvas');
    canvas.className = 'output-canvas w-full';
    img.parentNode.insertBefore(canvas, img.nextSibling);
}

function atkinsonDithering(ctx, width, height) {
    var imageData = ctx.getImageData(0, 0, width, height);
    var pixels = imageData.data;

    // Convert to grayscale
    for (var i = 0; i < pixels.length; i += 4) {
        var gray = 0.3 * pixels[i] + 0.59 * pixels[i + 1] + 0.11 * pixels[i + 2];
        pixels[i] = gray;     // Red
        pixels[i + 1] = gray; // Green
        pixels[i + 2] = gray; // Blue
    }

    // Apply Atkinson Dithering on grayscale
    for (var y = 0; y < height; y++) {
        for (var x = 0; x < width; x++) {
            var idx = (y * width + x) * 4;
            var oldPixel = pixels[idx];
            var newPixel = oldPixel < 128 ? 0 : 255;
            pixels[idx] = newPixel; // Red
            pixels[idx + 1] = newPixel; // Green
            pixels[idx + 2] = newPixel; // Blue

            var quantError = oldPixel - newPixel;
            spreadError(pixels, idx, width, quantError);
        }
    }

    ctx.putImageData(imageData, 0, 0);
}

function spreadError(pixels, idx, width, error) {
    var errorFraction = error / 8;

    // Spread the error to neighboring pixels
    if ((idx + 4) < pixels.length) pixels[idx + 4] += errorFraction; // Right
    if ((idx + 8) < pixels.length) pixels[idx + 8] += errorFraction; // Right + 1
    if ((idx + 4 * width - 4) < pixels.length) pixels[idx + 4 * width - 4] += errorFraction; // Bottom left
    if ((idx + 4 * width) < pixels.length) pixels[idx + 4 * width] += errorFraction; // Bottom
    if ((idx + 4 * width + 4) < pixels.length) pixels[idx + 4 * width + 4] += errorFraction; // Bottom right
    if ((idx + 8 * width) < pixels.length) pixels[idx + 8 * width] += errorFraction; // Bottom + 1
}

var $aContainer = document.getElementById("animation-container");

// Check if the element exists
if ($aContainer) {
    var aContainerRect = $aContainer.getBoundingClientRect();
    var start = aContainerRect.top;
    var length = (aContainerRect.height + 200) * 8; // Height of the container plus an offset for better presentation

    scrollAnimate({
        frames: {
            path: "/images/slc2/",
            prefix: "",
            extension: "jpeg",
            amount: 255,
            pad: ""
        },
        parent: $aContainer,
        scroll: {
            start: start,
            length: length
        }
    });
}


  // Initialize Alpine.js
  document.addEventListener('alpine:init', () => {
    // Define a global store in Alpine.js
    Alpine.store('background', {
      imageNumber: Math.floor(Math.random() * 25) + 1,

      // Function to update the image number
      updateImageNumber() {
        this.imageNumber = Math.floor(Math.random() * 25) + 1;
      }
    });
  });

  // Listen for HTMX load events
  document.body.addEventListener('htmx:load', () => {
    // Update the image number in the global store
    Alpine.store('background').updateImageNumber();
  });


  document.addEventListener('DOMContentLoaded', function() {
    var lastScrollTop = 0;
    var scalingFactor = 2; // Adjust this factor to control the speed

    window.addEventListener('scroll', function() {
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Directly calculate and apply the background position
        var scrollDiff = (scrollTop - lastScrollTop) * scalingFactor;
        var scroller = document.querySelector('.scroller');
        var bgX = parseInt(window.getComputedStyle(scroller).backgroundPosition.split(' ')[0]);
        var newBgPosition = bgX + scrollDiff;
        scroller.style.backgroundPosition = `${newBgPosition}px 0px`;

        lastScrollTop = scrollTop;
    });
});
document.body.addEventListener('htmx:beforeRequest', function() {
    document.body.classList.add('busy');
});

document.body.addEventListener('htmx:afterRequest', function() {
    document.body.classList.remove('busy');
});

let lastEscapePressTime = 0;
    const doublePressThreshold = 500; // Time in milliseconds; adjust as needed

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const currentTime = new Date().getTime();
            
            // Check if the current press is within the threshold of the last press
            if (currentTime - lastEscapePressTime <= doublePressThreshold) {
                // Prevent the default action to avoid conflicts
                event.preventDefault();
                
                // The URL you want to open
                const url = '/bbc';
                
                // Open the URL in a new tab
                window.open(url);
                
                // Reset the last press time to prevent immediate re-triggering
                lastEscapePressTime = 0;
            } else {
                // Update the last press time
                lastEscapePressTime = currentTime;
            }
        }
    });