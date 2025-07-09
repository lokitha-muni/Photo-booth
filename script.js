document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const video = document.getElementById('camera');
    const canvas = document.getElementById('photoCanvas');
    const startButton = document.getElementById('startButton');
    const downloadButton = document.getElementById('downloadButton');
    const newSessionButton = document.getElementById('newSessionButton');
    const photoStrip = document.getElementById('photoStrip');
    const countdownElement = document.getElementById('countdown');
    const flashElement = document.getElementById('flash');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const boothContainer = document.querySelector('.booth-container');
    const resultContainer = document.querySelector('.result-container');

    // State variables
    let stream = null;
    let currentFilter = 'none';
    let photosTaken = 0;
    const maxPhotos = 4;
    const photoDelay = 1500; // Time between photos in ms
    const countdownTime = 3; // Countdown seconds before each photo
    const photos = [];

    // Initialize camera
    async function initCamera() {
        try {
            stream = await navigator.mediaDevices.getUserMedia({
                video: { 
                    width: { ideal: 640 },
                    height: { ideal: 480 },
                    facingMode: 'user'
                },
                audio: false
            });
            video.srcObject = stream;
            startButton.disabled = false;
        } catch (err) {
            console.error('Error accessing camera:', err);
            alert('Unable to access camera. Please make sure you have granted permission and that your camera is connected.');
        }
    }

    // Apply selected filter to video
    function applyFilter(filterName) {
        // Remove all filter classes
        video.className = '';
        
        // Reset any special styling
        video.style.border = '';
        video.style.boxShadow = '';
        
        // Add the selected filter class
        if (filterName !== 'none') {
            video.classList.add(`filter-${filterName}`);
            
            // Special case for polaroid filter
            if (filterName === 'polaroid') {
                video.style.border = '10px solid white';
                video.style.borderBottom = '40px solid white';
                video.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.2)';
            }
        }
        
        currentFilter = filterName;
    }

    // Take a photo
    function takePhoto() {
        const context = canvas.getContext('2d');
        
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw the video frame to the canvas with the current filter
        context.filter = getComputedStyle(video).filter;
        
        // Special handling for polaroid filter
        if (currentFilter === 'polaroid') {
            // Draw with a white border for polaroid effect
            const borderSize = 10;
            const bottomBorderSize = 40;
            
            // Draw white background (polaroid frame)
            context.fillStyle = 'white';
            context.fillRect(0, 0, canvas.width + (borderSize * 2), canvas.height + borderSize + bottomBorderSize);
            
            // Draw the actual image inside the frame
            context.drawImage(video, borderSize, borderSize, canvas.width - (borderSize * 2), canvas.height - borderSize - bottomBorderSize);
        } else {
            // Normal drawing for other filters
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
        }
        
        // Get the image data URL
        const imageDataURL = canvas.toDataURL('image/png');
        
        // Add to photos array
        photos.push(imageDataURL);
        
        // Flash effect
        flashEffect();
        
        return imageDataURL;
    }

    // Flash effect when taking photo
    function flashEffect() {
        flashElement.style.animation = 'none';
        setTimeout(() => {
            flashElement.style.animation = 'flash 0.5s';
        }, 10);
    }

    // Start the photo booth session
    async function startPhotoSession() {
        photosTaken = 0;
        photos.length = 0; // Clear previous photos
        
        // Hide booth controls and show countdown
        startButton.disabled = true;
        
        // Start taking photos with countdown
        await takePhotoWithCountdown();
    }

    // Take a photo with countdown
    async function takePhotoWithCountdown() {
        if (photosTaken >= maxPhotos) {
            finishSession();
            return;
        }
        
        // Show countdown
        countdownElement.style.display = 'block';
        
        // Countdown from 3
        for (let i = countdownTime; i > 0; i--) {
            countdownElement.textContent = i;
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        // Take photo
        countdownElement.style.display = 'none';
        takePhoto();
        photosTaken++;
        
        // Wait before taking next photo
        if (photosTaken < maxPhotos) {
            setTimeout(takePhotoWithCountdown, photoDelay);
        } else {
            finishSession();
        }
    }

    // Finish the photo session and display results
    function finishSession() {
        // Hide booth container and show result container
        boothContainer.style.display = 'none';
        resultContainer.style.display = 'block';
        
        // Clear previous photos
        photoStrip.innerHTML = '';
        
        // Always use strip layout (removing grid option)
        photoStrip.classList.remove('grid');
        
        // Create a container for the entire strip
        const stripContainer = document.createElement('div');
        stripContainer.className = 'strip-container';
        
        // Add each photo to the strip
        photos.forEach((photo, index) => {
            const photoFrame = document.createElement('div');
            photoFrame.className = 'photo-frame';
            
            const img = document.createElement('img');
            img.src = photo;
            photoFrame.appendChild(img);
            
            stripContainer.appendChild(photoFrame);
        });
        
        // Add a single date stamp at the bottom of the strip
        const dateStamp = document.createElement('div');
        dateStamp.className = 'date-stamp';
        
        // Get current date in a nice format
        const now = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        dateStamp.textContent = now.toLocaleDateString(undefined, options);
        
        stripContainer.appendChild(dateStamp);
        photoStrip.appendChild(stripContainer);
    }

    // Download the photo strip as a single image
    function downloadPhotoStrip() {
        // Create a new canvas to combine all photos
        const downloadCanvas = document.createElement('canvas');
        const ctx = downloadCanvas.getContext('2d');
        
        // Get all photo images
        const photoImages = photoStrip.querySelectorAll('img');
        const dateStamp = photoStrip.querySelector('.date-stamp');
        
        // Set canvas dimensions for a vertical strip
        const photoWidth = photoImages[0].width;
        const photoHeight = photoImages[0].height;
        const padding = 15;
        const dateHeight = 40;
        
        // Calculate canvas size for vertical strip
        const canvasWidth = photoWidth + (padding * 2);
        const canvasHeight = (photoHeight * maxPhotos) + (padding * (maxPhotos + 1)) + dateHeight;
        
        // Set canvas size
        downloadCanvas.width = canvasWidth;
        downloadCanvas.height = canvasHeight;
        
        // Fill background
        ctx.fillStyle = '#fff9fb'; // Light background color
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        
        // Draw border for the strip
        ctx.strokeStyle = '#a67c52'; // Warm brown
        ctx.lineWidth = 5;
        ctx.strokeRect(5, 5, canvasWidth - 10, canvasHeight - 10);
        
        // Draw each photo in the strip
        photoImages.forEach((img, i) => {
            const yPos = padding + (i * (photoHeight + padding));
            ctx.drawImage(img, padding, yPos, photoWidth, photoHeight);
        });
        
        // Draw single date stamp at the bottom
        ctx.font = '20px Pacifico';
        ctx.fillStyle = '#5a5a5a';
        ctx.textAlign = 'center';
        ctx.fillText(
            dateStamp.textContent,
            canvasWidth / 2,
            canvasHeight - (dateHeight / 2)
        );
        
        // Create download link
        const link = document.createElement('a');
        link.download = 'photo-strip.png';
        link.href = downloadCanvas.toDataURL('image/png');
        link.click();
    }

    // Start a new session
    function newSession() {
        // Reset UI
        boothContainer.style.display = 'flex';
        resultContainer.style.display = 'none';
        startButton.disabled = false;
        
        // Clear photos
        photos.length = 0;
        photosTaken = 0;
    }

    // Event listeners
    startButton.addEventListener('click', startPhotoSession);
    downloadButton.addEventListener('click', downloadPhotoStrip);
    newSessionButton.addEventListener('click', newSession);
    
    // Filter button listeners
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Apply the selected filter
            applyFilter(button.dataset.filter);
        });
    });

    // Initialize the app
    initCamera();
});
