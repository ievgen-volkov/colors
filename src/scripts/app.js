const cols = document.querySelectorAll('.col');

setRandomColors(true);

document.addEventListener('keydown', (event) => {
  event.preventDefault();
  if (event.code === 'Space') {
    setRandomColors();
  }
});

document.addEventListener('click', (event) => {
  const type = event.target.dataset.type;

  if (type === 'lock') {
    const node = event.target.tagName.toLocaleLowerCase() === 'i'
      ? event.target
      : event.target.children[0];

    node.classList.toggle('fa-lock-open');
    node.classList.toggle('fa-lock');
  } else if (type === 'copy') {
    copyToClipBoard(event.target.textContent);
  }
});

function setRandomColors(isInitial) {
  const color = chroma.random();
  const colors = isInitial ? getColorsFromHash() : [];

  cols.forEach((col, index) => {
    const text = col.querySelector('.text')
    const button = col.querySelector('.button');
    const isLocked = col.querySelector('i')
        .classList.contains('fa-lock');

    const randomColor = isInitial
        ? colors[index]
          ? colors[index]
          : generateRandomColor()
        : generateRandomColor();

    if (isLocked) {
      colors.push(text.textContent)
      return;
    }

    if (!isInitial) {
      colors.push(randomColor);
    }

    text.textContent = randomColor;
    col.style.backgroundColor = randomColor;

    setTextColor(text, color);
    setTextColor(button, color);
  })

  getColorsHash(colors);
}

function copyToClipBoard(text) {
  return navigator.clipboard.writeText(text);
}

function generateRandomColor() {
  let color = '';
  const hexCode = '0123456789ABCDEF';

  for (let i = 0; i < 6; i++) {
    color += hexCode[Math.floor(Math.random() * hexCode.length)];
  }

  return `#${color}`;
}

function setTextColor(text, color) {
  const luminance = chroma(color).luminance();
  text.style.color = luminance > 0.5 ? 'black' : 'white';
}

function getColorsHash(colors = []) {
  document.location.hash = colors.map(col => col.toString().substring(1)).join('-');
}

function getColorsFromHash() {
  if (document.location.hash.length > 1) {
    return document.location.hash
        .substring(1)
        .split('-')
        .map(col => `#${col}`);
  }

  return [];
}
