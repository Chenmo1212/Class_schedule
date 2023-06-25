let myDate = new Date()
document.getElementById('copyRightYear').innerText = myDate.getFullYear().toString();

const fadeContent = (element, opacity, duration = 300) => {
  return new Promise(res => {
    [...element.children].forEach((child) => {
      requestAnimationFrame(() => {
        child.style.transition = `opacity ${duration}ms linear`
        child.style.opacity = opacity
      })
    })
    setTimeout(res, duration)
  })
}

const getCardContent = (info) => {
  // let url = 'https://www.google.com/maps/search/'
  return `
				<div class="card-content">
					<div class="close"><span id="closeButton">X</span></div>
					<h2>(${info.attr}) ${info.title}</h2>
					<p>Course Name: ${info.title}</p>
					<p>Course Code: ${info.code}</p>
					<p>Course Time: ${info.start} - ${info.end}</p>
					<p>Course Type: ${info.type}</p>
					<p>Lecturers(s): ${info.lecturer}</p>
					<p>Building: <a href="${info.locationUrl}" target="_blank">${info.building}</a></p>
					<p>Location:<a href="${info.locationUrl}" target="_blank">${info.location}</a></p>
				</div>
			`
}

const toggleExpansion = (element, to, duration = 350) => {
  return new Promise((res) => {
    element.animate([
      {
        top: to.top,
        left: to.left,
        width: to.width,
        height: to.height
      }
    ], {
      duration, fill: 'forwards', ease: 'ease-out'
    })
    setTimeout(res, duration)
  })
}

const onCardClick = async (e) => {
  const cardInfo = sessionList[e.target.dataset.index]
  const card = e.currentTarget
  const cardClone = card.cloneNode(true)
  const {top, left, width, height} = card.getBoundingClientRect()

  cardClone.style.position = 'fixed'
  cardClone.style.top = top + 'px'
  cardClone.style.left = left + 'px'
  cardClone.style.width = width + 'px'
  cardClone.style.height = height + 'px'
  cardClone.style.zIndex = '100000'
  card.parentNode.appendChild(cardClone)

  const mask = document.createElement('div')
  mask.className = 'card-mask'
  fadeContent(cardClone, '0')
    .then(() => {
      [...cardClone.children].forEach(child => child.style.display = 'none')
    })

  await toggleExpansion(cardClone, {
    top: '200px',
    left: (window.innerWidth / 2 - 175) + 'px',
    width: '350px',
    height: '430px'
  })
  const content = getCardContent(cardInfo)
  // cardClone.style.display = 'block'

  document.body.appendChild(mask)
  cardClone.insertAdjacentHTML('afterbegin', content)

  let closeButton = document.getElementById('closeButton')
  closeButton.onclick = function () {
    closeFunc(cardClone, card, mask, {top, left, width, height})
  }
  mask.onclick = function () {
    closeFunc(cardClone, card, mask, {top, left, width, height})
  }
}

let closeFunc = async (cardClone, card, mask, from) => {
  cardClone.style.removeProperty('display')
  cardClone.style.removeProperty('padding');

  // [...cardClone.children].forEach(child => child.style.removeProperty('display'))
  await fadeContent(cardClone, '0')
  await toggleExpansion(cardClone, {
    top: `${from.top}px`,
    left: `${from.left}px`,
    width: `${from.width}px`,
    height: `${from.height}px`
  }, 300)

  card.style.removeProperty('opacity');
  cardClone.remove();
  mask.classList.add('fade-out');
  setTimeout(()=>{
    mask.remove();
  }, 500)
}

let sessionStr = ''
sessionList.forEach((e, index) => {
  sessionStr += `
  <div class="session ${e.color}" style="grid-column: ${e.column}; grid-row: ${e.row};" data-index="${index}">
    <h3 class="session__title" data-index="${index}">
        <span class="attr" data-index="${index}">${e.attr}</span>
        <span class="title" data-index="${index}">${e.title}</span>
    </h3>
    <p class='location' data-index="${index}">${e.building}</p>
  </div>`
})
document.getElementById('schedule').insertAdjacentHTML('afterbegin', sessionStr)

const cards = document.querySelectorAll('.session')
cards.forEach(card => card.addEventListener('click', onCardClick))