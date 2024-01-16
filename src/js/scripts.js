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