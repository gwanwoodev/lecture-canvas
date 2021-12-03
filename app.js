/* DOMS */
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const colors = document.querySelectorAll(".color");
const copyButton = document.querySelector(".copyButton");

/* FINAL VALUES */
const DEFAULT_COLOR = "#000000";
const SIZE = 600;

/* RECYCLE VALUES */
let active = false;

/* init event listener */

const activePaint = () => {
  active = true;
};

const disablePaint = () => {
  active = false;
};

const handlePallete = (evt) => {
  const selectedColor = evt.target.style.backgroundColor;
  ctx.strokeStyle = selectedColor;
};

const handleMouseMove = (evt) => {
  const x = evt.offsetX;
  const y = evt.offsetY;

  if (!active) {
    ctx.beginPath();
    ctx.moveTo(x, y);
  } else {
    ctx.lineTo(x, y);
    ctx.stroke();
  }
};

const handlePaste = (evt) => {
  const items = evt.clipboardData;
  const file = items.files[0];
  const reader = new FileReader();
  reader.readAsDataURL(file);

  reader.onloadend = () => {
    const result = reader.result;
    const image = new Image();
    image.src = result;
    let width, height;

    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;

      ctx.drawImage(image, 0, 0);
    };
  };
};

/* initialize */
const init = () => {
  canvas.width = SIZE;
  canvas.height = SIZE;

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, SIZE, SIZE);
  ctx.strokeStyle = DEFAULT_COLOR;
  ctx.lineWidth = 4;

  canvas.addEventListener("mousemove", handleMouseMove);
  canvas.addEventListener("mousedown", activePaint);
  canvas.addEventListener("mouseup", disablePaint);
  canvas.addEventListener("mouseleave", disablePaint);

  const toArray = Array.from(colors);
  toArray.forEach((item) => {
    item.addEventListener("click", handlePallete);
  });

  copyButton.addEventListener("click", () => {
    canvas.toBlob((blob) => {
      const item = new ClipboardItem({ "image/png": blob });
      navigator.clipboard.write([item]);
    });
  });

  document.addEventListener("paste", handlePaste);
};

init();
