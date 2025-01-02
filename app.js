// Default arrays
const defaultBackgrounds = [
    { name: "wassie_bird1.jpg", url: "assets/images/wassie_bird1.jpg" },
    { name: "wassie_kill1.png", url: "assets/images/wassie_kill1.png" },
    { name: "wassie_prosit1.jpg", url: "assets/images/wassie_prosit1.jpg" },
    { name: "wassie_trump1.jpg", url: "assets/images/wassie_trump1.jpg" }
];

const defaultStickers = [
    { name: "wassie-sticker_fed1.png", url: "assets/stickers/wassie-sticker_fed1.png" },
    { name: "wassie-sticker_gun1.png", url: "assets/stickers/wassie-sticker_gun1.png" },
    { name: "wassie-sticker_hair.png", url: "assets/stickers/wassie-sticker_hair.png" },
    { name: "wassie-sticker_monad1.jpg", url: "assets/stickers/wassie-sticker_monad1.jpg" },
    { name: "wassie-sticker_natural1.jpg", url: "assets/stickers/wassie-sticker_natural1.jpg" }
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
        const canvasWidth = canvas.getWidth();
        const canvasHeight = canvas.getHeight();

        // Calculate the ratio to fill the canvas entirely
        const scaleRatio = Math.max(
            canvasWidth / img.width,
            canvasHeight / img.height
        );

        // Scale the image
        img.scale(scaleRatio);

        // Position it in the center
        // (originX and originY "center" means we place image's center at given left/top)
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

    const colorPicker = document.getElementById('text-color-picker');
    const fontSizeInput = document.getElementById('text-font-size');
    const textAlignSelect = document.getElementById('text-align');

    const newColor = colorPicker.value;
    const newFontSize = parseInt(fontSizeInput.value, 10);
    const newTextAlign = textAlignSelect.value;

    selectedObject.set({
        fill: newColor,
        fontSize: newFontSize,
        textAlign: newTextAlign
    });

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
