const cols = document.querySelectorAll('.col');

setRandomColors(true);

document.addEventListener('click', (event) => {
  const wave = event.target.dataset.type;

  if (wave === 'wave') {
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
  const colors = isInitial ? getColorsFromHash() : [];

  cols.forEach((col, index) => {
    const text = col.querySelector('.text');
    const button = col.querySelector('.button');
    const isLocked = col.querySelector('i').classList.contains('fa-lock');

    if (isLocked) {
      colors.push(text.textContent);
      return;
    }

    const randomColors = isInitial
      ? colors[index]
        ? colors[index]
        : chroma.random()
      : chroma.random();

    if (!isInitial) {
      colors.push(randomColors);
    }

    col.style.backgroundColor = randomColors;
    text.textContent = randomColors;

    setTextColor(text, randomColors);
    setTextColor(button, randomColors)
  });

  addColorsHash(colors);
}

function setTextColor(text, color) {
  const luminance = chroma(color).luminance();
  text.style.color = luminance > 0.5 ? '#000' : '#fff';
}

function addColorsHash(colors = []) {
  document.location.hash = colors
      .map(color => color.toString().substring(1))
      .join('-');
}

function getColorsFromHash() {
  if (document.location.hash.length > 1) {
    return document.location.hash.substring(1).split('-')
        .map(col => `#${col}`);
  }

  return [];
}

function copyToClipBoard(text) {
  return navigator.clipboard.writeText(text);
}
