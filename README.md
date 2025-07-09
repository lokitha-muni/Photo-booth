# Vintage Photo Booth Web Application

A browser-based photo booth application that uses your webcam to create classic photo strips with various filters and effects.

## Features

- **Webcam Integration**: Takes four sequential photos using your laptop's webcam
- **10 Aesthetic Filters**: Choose from a variety of filters including:
  - Normal
  - Black & White
  - Sepia
  - Vintage
  - Soft Pastel
  - Warm Glow
  - Cool Tone
  - Dramatic
  - Retro
  - Polaroid (with classic white borders)
- **Photo Strip Layout**: Displays photos in a vertical strip with a single date stamp
- **Download Option**: Save your photo strip as a single PNG image
- **Responsive Design**: Works on both laptops and tablets
- **Vintage Brown Aesthetic**: Warm, earthy color scheme for a nostalgic feel

## Installation

No installation required! This is a client-side web application that runs directly in your browser.

1. Clone this repository or download the files
2. Open `index.html` in a modern web browser (Chrome, Firefox, Edge recommended)
3. Grant permission to access your webcam when prompted

## Usage

1. **Start the Application**: Open `index.html` in your browser
2. **Choose a Filter**: Select from 10 different aesthetic filters
3. **Take Photos**: Click "Start Photo Booth" to begin the photo session
4. **Countdown**: A 3-second countdown will appear before each photo is taken
5. **View Results**: After all four photos are taken, they'll be displayed as a vertical strip
6. **Download**: Click "Download Photo Strip" to save your creation
7. **New Session**: Click "New Session" to start over

## Technical Details

- **HTML5**: Structure and webcam access via MediaDevices API
- **CSS3**: Styling with custom filters and animations
- **JavaScript**: Camera handling, photo capture, and image processing
- **No External Dependencies**: Built with vanilla JavaScript for simplicity

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Edge
- Safari (limited filter support)

## Screenshots

![Screenshot 2025-07-09 124047](https://github.com/user-attachments/assets/73aebc21-bc82-4360-96f7-d925a04cca0d)

![photo-strip (4)](https://github.com/user-attachments/assets/37f83140-2e44-4c65-b7a9-c8e4f5ce1de5)

## Customization

You can customize this application by:

- Modifying the CSS variables in `styles.css` to change the color scheme
- Adding new filters by extending the CSS filter classes
- Changing the number of photos taken by modifying the `maxPhotos` variable in `script.js`
- Adjusting the countdown time with the `countdownTime` variable

## Privacy Note

This application runs entirely in your browser. No photos are uploaded to any server - all processing happens locally on your device.

## License

This project is open source and available under the MIT License.

## Credits

- Fonts: Google Fonts (Pacifico, Quicksand)
- Created by: [Lokitha]
=======
# Photo-booth
A pastel-themed web photo booth app that captures 4 aesthetic webcam photos with filter options. It displays the date below each image and arranges them in a stylish layout. Users can download the final photo strip, making it a fun, creative, and cozy way to capture memories.

