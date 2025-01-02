// Default arrays
const defaultBackgrounds = [
    { name: "pic1.jpg", url: "assets/images/pic1.jpg" },
    { name: "pic2.jpg", url: "assets/images/pic2.jpg" },
    { name: "pic3.jpg", url: "assets/images/pic3.jpg" },
    { name: "pic4.jpg", url: "assets/images/pic4.jpg" },
    { name: "pic5.jpg", url: "assets/images/pic5.jpg" },
    { name: "pic6.jpg", url: "assets/images/pic6.jpg" },
    { name: "pic7.jpg", url: "assets/images/pic7.jpg" },
    { name: "pic8.jpg", url: "assets/images/pic8.jpg" },
    { name: "pic9.jpg", url: "assets/images/pic9.jpg" },
    { name: "pic10.jpg", url: "assets/images/pic10.jpg" },
    { name: "pic11.jpg", url: "assets/images/pic11.jpg" },
    { name: "pic12.jpg", url: "assets/images/pic12.jpg" },
    { name: "pic13.jpg", url: "assets/images/pic13.jpg" },
    { name: "pic14.jpg", url: "assets/images/pic14.jpg" },
    { name: "pic15.jpg", url: "assets/images/pic15.jpg" },
    { name: "pic16.jpg", url: "assets/images/pic16.jpg" },
    { name: "pic17.jpg", url: "assets/images/pic17.jpg" },
    { name: "pic18.jpg", url: "assets/images/pic18.jpg" },
    { name: "pic19.jpg", url: "assets/images/pic19.jpg" },
    { name: "pic20.jpg", url: "assets/images/pic20.jpg" },
    { name: "pic21.jpg", url: "assets/images/pic21.jpg" },
    { name: "pic22.jpg", url: "assets/images/pic22.jpg" },
    { name: "pic23.jpg", url: "assets/images/pic23.jpg" },
    { name: "pic24.jpg", url: "assets/images/pic24.jpg" },
    { name: "pic25.jpg", url: "assets/images/pic25.jpg" },
    { name: "pic26.jpg", url: "assets/images/pic26.jpg" },
    { name: "pic27.png", url: "assets/images/pic27.png" },
    { name: "pic28.jpg", url: "assets/images/pic28.jpg" },
    { name: "pic29.jpg", url: "assets/images/pic29.jpg" }
];

const defaultStickers = [
    { name: "sticker1.png", url: "assets/stickers/sticker1.png" },
    { name: "sticker2.png", url: "assets/stickers/sticker2.png" },
    { name: "sticker3.png", url: "assets/stickers/sticker3.png" },
    { name: "sticker4.png", url: "assets/stickers/sticker4.png" },
    { name: "sticker5.png", url: "assets/stickers/sticker5.png" },
    { name: "sticker6.png", url: "assets/stickers/sticker6.png" },
    { name: "sticker7.png", url: "assets/stickers/sticker7.png" },
    { name: "sticker8.png", url: "assets/stickers/sticker8.png" },
    { name: "sticker9.png", url: "assets/stickers/sticker9.png" },
    { name: "sticker10.png", url: "assets/stickers/sticker10.png" },
    { name: "sticker11.png", url: "assets/stickers/sticker11.png" },
    { name: "sticker12.png", url: "assets/stickers/sticker12.png" },
];

// Fabric.js canvas reference
let canvas;
let selectedObject = null;

document.addEventListener('DOMContentLoaded', () => {
    // 1) Initialize Fabric canvas
    canvas = new fabric.Canvas('meme-canvas', {
        preserveObjectStacking: true,
    });
    canvas.setBackgroundColor('#ffffff', canvas.renderAll.bind(canvas));

    // 2) Initialize tabs
    initTabs();

    // 3) Add default backgrounds and stickers to the galleries
    defaultBackgrounds.forEach(bg => {
        addToGallery({
            url: bg.url,
            galleryId: "background-gallery",
            onclickFunction: `selectBackground('${bg.url}')`,
            altText: bg.name
        });
    });

    defaultStickers.forEach(sticker => {
        addToGallery({
            url: sticker.url,
            galleryId: "sticker-gallery",
            onclickFunction: `addSticker('${sticker.url}')`,
            altText: sticker.name
        });
    });

    // 4) Initialize file uploads
    initUploads();

    // 5) Fabric events for selection
    canvas.on('selection:created', handleSelection);
    canvas.on('selection:updated', handleSelection);
    canvas.on('selection:cleared', () => {
        selectedObject = null;
    });
});

// -------------------------
// SELECTION HANDLER
// -------------------------
function handleSelection(e) {
    const activeObject = e.selected[0];
    selectedObject = activeObject;
}

// -------------------------
// SELECT BACKGROUND
// -------------------------
function selectBackground(imgUrl) {
    fabric.Image.fromURL(imgUrl, function(img) {
        // Canvas is square: 800 x 800 (or whatever you set)
        const canvasWidth = canvas.getWidth();
        const canvasHeight = canvas.getHeight();

        // scaleRatio ensures the image fits within the canvas
        const scaleRatio = Math.min(
            canvasWidth / img.width,
            canvasHeight / img.height
        );

        img.scale(scaleRatio);

        // Center the image
        canvas.setBackgroundImage(
            img,
            canvas.renderAll.bind(canvas),
            {
                originX: 'center',
                originY: 'center',
                left: canvasWidth / 2,
                top: canvasHeight / 2
            }
        );
    });
}

// -------------------------
// BAR PICTURE
// -------------------------

function addBar() {
    // Get the chosen color
    const barColorInput = document.getElementById('bar-color-picker');
    const barColor = barColorInput.value || '#000000';

    // Create a rectangle in Fabric
    const rectObj = new fabric.Rect({
        left: canvas.width / 2,
        top: canvas.height / 2,
        originX: 'center',
        originY: 'center',
        width: 200,
        height: 50,
        fill: barColor,
        selectable: true,
        hasRotatingPoint: true,
    });

    // Add rectangle to canvas
    canvas.add(rectObj);

    // Bring rectangle to the frontmost layer
    canvas.bringToFront(rectObj);

    // Render the canvas so we see the new bar
    canvas.renderAll();
}

function applyBarColor() {
    const activeObj = canvas.getActiveObject();
    if (!activeObj || activeObj.type !== 'rect') {
        alert('Please select a bar (rectangle) first!');
        return;
    }
    const barColorInput = document.getElementById('bar-color-picker').value;
    activeObj.set({ fill: barColorInput });
    canvas.renderAll();
}

// -------------------------
// DELETE
// -------------------------

function deleteSelected() {
    const activeObj = canvas.getActiveObject();
    if (activeObj) {
        canvas.remove(activeObj);
        canvas.discardActiveObject(); // deselect after removing
        canvas.renderAll();
    }
}

document.addEventListener('keydown', (e) => {
    // Check if user is in a text field, you might want to skip
    if (e.key === 'Delete' || e.key === 'Backspace') {
        const activeObj = canvas.getActiveObject();
        if (activeObj) {
            canvas.remove(activeObj);
            canvas.discardActiveObject();
            canvas.renderAll();
        }
    }
});

// -------------------------
// ADD STICKER
// -------------------------
function addSticker(stickerUrl) {
    fabric.Image.fromURL(stickerUrl, function(stickerImg) {
        stickerImg.scaleToWidth(100);
        stickerImg.set({
            left: canvas.width / 2,
            top: canvas.height / 2,
            originX: 'center',
            originY: 'center',
            selectable: true
        });
        canvas.add(stickerImg);
        canvas.renderAll();
    });
}


// -------------------------
// ADD TEXT
// -------------------------
function addText() {
    const textInput = document.getElementById("meme-text-input");
    const textValue = textInput.value.trim();
    if (!textValue) return;

    const textObj = new fabric.Text(textValue, {
        left: canvas.width / 2,
        top: canvas.height / 2,
        originX: 'center',
        originY: 'center',
        fill: '#000000',
        fontSize: 40,
        fontFamily: 'Impact',
        textAlign: 'center',
        selectable: true
    });

    canvas.add(textObj);
    canvas.bringToFront(textObj);
    canvas.renderAll();
    textInput.value = '';
}

// -------------------------
// USE SUGGESTION
// -------------------------
function useSuggestion(text) {
    const inputField = document.getElementById('meme-text-input');
    inputField.value = text;
}

// -------------------------
// APPLY TEXT FORMAT
// -------------------------
function applyTextFormat() {
    if (!selectedObject ||
        (!selectedObject.isType('text') && !selectedObject.isType('textbox'))) {
        alert("Please select a text object first!");
        return;
    }

    // 1) Get color and font
    const colorPicker = document.getElementById('text-color-picker');
    const newColor = colorPicker.value;

    const fontSelect = document.getElementById('font-family-select');
    const newFontFamily = fontSelect.value;

    // 2) Apply them to the active text object
    selectedObject.set({
        fill: newColor,
        fontFamily: newFontFamily
    });

    // 3) Re-render canvas
    canvas.renderAll();
}


// -------------------------
// UPLOAD HANDLER
// -------------------------
function initUploads() {
    const bgUploadInput = document.getElementById('uploadBackgroundImages');
    const stickerUploadInput = document.getElementById('uploadStickers');

    bgUploadInput.addEventListener('change', (e) => {
        const files = e.target.files;
        if (!files || !files.length) return;

        for (const file of files) {
            const imageUrl = URL.createObjectURL(file);
            addToGallery({
                url: imageUrl,
                galleryId: 'background-gallery',
                onclickFunction: `selectBackground('${imageUrl}')`,
                altText: file.name
            });
        }
        e.target.value = '';
    });

    stickerUploadInput.addEventListener('change', (e) => {
        const files = e.target.files;
        if (!files || !files.length) return;

        for (const file of files) {
            const stickerUrl = URL.createObjectURL(file);
            addToGallery({
                url: stickerUrl,
                galleryId: 'sticker-gallery',
                onclickFunction: `addSticker('${stickerUrl}')`,
                altText: file.name
            });
        }
        e.target.value = '';
    });
}

// -------------------------
// ADD TO GALLERY
// -------------------------
function addToGallery({ url, galleryId, onclickFunction, altText }) {
    const gallery = document.getElementById(galleryId);
    if (!gallery) return;

    const img = document.createElement('img');
    img.src = url;
    img.alt = altText;
    img.style.width = '120px';
    img.style.cursor = 'pointer';
    img.setAttribute('onclick', onclickFunction);
    gallery.appendChild(img);
}

// -------------------------
// INIT TABS
// -------------------------
function initTabs() {
    const tabItems = document.querySelectorAll('.tab-item');
    const tabContents = document.querySelectorAll('.tab-content');

    tabItems.forEach(item => {
        item.addEventListener('click', () => {
            tabItems.forEach(el => el.classList.remove('active'));
            tabContents.forEach(el => el.classList.remove('active'));

            item.classList.add('active');
            const tabTarget = item.getAttribute('data-tab');
            document.getElementById(tabTarget).classList.add('active');
        });
    });
}

// -------------------------
// EXPORT MEME
// -------------------------
function exportMeme() {
    const dataURL = canvas.toDataURL({ format: 'png', quality: 1 });
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'meme.png';
    link.click();
}
