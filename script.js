const config = {
    crashInterval: 300, // 5 min
    updateInterval: 1000, // 1s
    discountDuration: 30, // 30s
    priceFluctuation: { min: -0.001, max: 0.001 },
    indexFluctuation: { min: -0.0005, max: 0.0005 },
    discountProbability: 0.02, // 2%
    discountAmount: 0.2, // 20%
    crashPriceDrop: 0.3, // 30%
    crashIndexDrop: 0.4, // 40%
    minPrice: 2,
    minIndex: 500
};

const drinks = [
    { id: 1, name: "Mojito", price: 8, popularity: 0, category: "cocktails", prevPrice: 8, discount: false, icon: "icons/mojito.png", discountEnd: 0 },
    { id: 2, name: "Caipirinha", price: 7, popularity: 0, category: "cocktails", prevPrice: 7, discount: false, icon: "icons/caipirinha.png", discountEnd: 0 },
    { id: 3, name: "Gin Tonic", price: 9, popularity: 0, category: "cocktails", prevPrice: 9, discount: false, icon: "icons/gintonic.png", discountEnd: 0 },
    { id: 4, name: "Margarita", price: 8, popularity: 0, category: "cocktails", prevPrice: 8, discount: false, icon: "icons/margarita.png", discountEnd: 0 },
    { id: 5, name: "Negroni", price: 10, popularity: 0, category: "cocktails", prevPrice: 10, discount: false, icon: "icons/negroni.png", discountEnd: 0 },
    { id: 6, name: "Old Fashioned", price: 11, popularity: 0, category: "cocktails", prevPrice: 11, discount: false, icon: "icons/oldfashioned.png", discountEnd: 0 },
    { id: 7, name: "Daiquiri", price: 8.5, popularity: 0, category: "cocktails", prevPrice: 8.5, discount: false, icon: "icons/daiquiri.png", discountEnd: 0 },
    { id: 8, name: "Cerveza Artesanal", price: 5, popularity: 0, category: "beers", prevPrice: 5, discount: false, icon: "icons/artesanal.png", discountEnd: 0 },
    { id: 9, name: "IPA", price: 6, popularity: 0, category: "beers", prevPrice: 6, discount: false, icon: "icons/ipa.png", discountEnd: 0 },
    { id: 10, name: "Lager", price: 4.5, popularity: 0, category: "beers", prevPrice: 4.5, discount: false, icon: "icons/lager.png", discountEnd: 0 },
    { id: 11, name: "Stout", price: 6.5, popularity: 0, category: "beers", prevPrice: 6.5, discount: false, icon: "icons/stout.png", discountEnd: 0 },
    { id: 12, name: "Pilsner", price: 5, popularity: 0, category: "beers", prevPrice: 5, discount: false, icon: "icons/pilsner.png", discountEnd: 0 },
    { id: 13, name: "Weissbier", price: 5.5, popularity: 0, category: "beers", prevPrice: 5.5, discount: false, icon: "icons/weissbier.png", discountEnd: 0 },
    { id: 14, name: "Limonada", price: 3, popularity: 0, category: "non-alcoholic", prevPrice: 3, discount: false, icon: "icons/limonada.png", discountEnd: 0 },
    { id: 15, name: "Mojito Sin", price: 4, popularity: 0, category: "non-alcoholic", prevPrice: 4, discount: false, icon: "icons/mojitosin.png", discountEnd: 0 },
    { id: 16, name: "Té Helado", price: 3.5, popularity: 0, category: "non-alcoholic", prevPrice: 3.5, discount: false, icon: "icons/tehelado.png", discountEnd: 0 },
    { id: 17, name: "Agua Tónica", price: 2.5, popularity: 0, category: "non-alcoholic", prevPrice: 2.5, discount: false, icon: "icons/tonica.png", discountEnd: 0 },
    { id: 18, name: "Zumo Natural", price: 4, popularity: 0, category: "non-alcoholic", prevPrice: 4, discount: false, icon: "icons/zumo.png", discountEnd: 0 },
    { id: 19, name: "Kombucha", price: 4.5, popularity: 0, category: "non-alcoholic", prevPrice: 4.5, discount: false, icon: "icons/kombucha.png", discountEnd: 0 },
    { id: 20, name: "Smoothie", price: 5, popularity: 0, category: "non-alcoholic", prevPrice: 5, discount: false, icon: "icons/smoothie.png", discountEnd: 0 }
];

let cart = [];
let index = 1000;
let history = [];
let crashTime = config.crashInterval;
let soundEnabled = false;
let isDrinksOnly = false;
let lastNotification = 0;
let lastUpdate = 0;

const cocktailsList = document.getElementById('cocktails-list');
const beersList = document.getElementById('beers-list');
const nonAlcoholicList = document.getElementById('non-alcoholic-list');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const buyButton = document.getElementById('buy-button');
const historyList = document.getElementById('history-list');
const indexValue = document.getElementById('index-value');
const crashTimer = document.getElementById('crash-timer');
const tickerContent = document.getElementById('ticker-content');
const indexSection = document.querySelector('.index');
const soundToggle = document.getElementById('sound-toggle');
const themeToggle = document.getElementById('theme-toggle');
const modeToggle = document.getElementById('mode-toggle');
const fullscreenToggle = document.getElementById('fullscreen-toggle');
const tickerToggle = document.getElementById('ticker-toggle');
const exportHistory = document.getElementById('export-history');
const crashSound = document.getElementById('crash-sound');
const offerSound = document.getElementById('offer-sound');
const notifications = document.getElementById('notifications');

function syncState() {
    console.log('Guardando estado en localStorage');
    const state = {
        drinks: drinks.map(d => ({ id: d.id, price: d.price, prevPrice: d.prevPrice, discount: d.discount, popularity: d.popularity, discountEnd: d.discountEnd })),
        index,
        crashTime
    };
    localStorage.setItem('downJonesState', JSON.stringify(state));
}

function loadState() {
    console.log('Cargando estado desde localStorage');
    const saved = localStorage.getItem('downJonesState');
    if (saved) {
        const data = JSON.parse(saved);
        drinks.forEach(d => {
            const savedDrink = data.drinks.find(s => s.id === d.id);
            if (savedDrink) {
                d.price = savedDrink.price;
                d.prevPrice = savedDrink.prevPrice;
                d.discount = savedDrink.discount;
                d.popularity = savedDrink.popularity;
                d.discountEnd = savedDrink.discountEnd;
            }
        });
        index = data.index || 1000;
        crashTime = data.crashTime || config.crashInterval;
    }
    updateDrinks();
    updateTicker();
    if (!isDrinksOnly) {
        updateIndex();
        updateCart();
        updateHistory();
    }
}

function showNotification(message, type = 'info') {
    if (isDrinksOnly || !notifications) return;
    const now = Date.now();
    if (now - lastNotification < 1000) return;
    lastNotification = now;
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notifications.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

function updateDrinks() {
    console.log('Actualizando bebidas');
    if (!cocktailsList || !beersList || !nonAlcoholicList) {
        console.error('Error: Listas de bebidas no encontradas');
        return;
    }
    drinks.forEach(drink => {
        const id = `drink-${drink.id}`;
        let drinkLi = document.getElementById(id);
        if (!drinkLi) {
            drinkLi = document.createElement('li');
            drinkLi.id = id;
            drinkLi.classList.add('drink-item');
            if (drink.category === 'cocktails') cocktailsList.appendChild(drinkLi);
            else if (drink.category === 'beers') beersList.appendChild(drinkLi);
            else if (drink.category === 'non-alcoholic') nonAlcoholicList.appendChild(drinkLi);
        }
        const currentPrice = drink.discount ? (drink.price * (1 - config.discountAmount)).toFixed(2) : drink.price.toFixed(2);
        const currentDiscount = drink.discount;
        const currentPopularity = drink.popularity;
        const arrowClass = drink.price > drink.prevPrice ? 'arrow-up' : drink.price < drink.prevPrice ? 'arrow-down' : '';

        if (
            drinkLi.dataset.price !== currentPrice ||
            drinkLi.dataset.discount !== currentDiscount.toString() ||
            drinkLi.dataset.popularity !== currentPopularity.toString()
        ) {
            drinkLi.classList.toggle('discount', drink.discount);
            drinkLi.innerHTML = `
                <span class="name"><img src="${drink.icon}" class="drink-icon" alt="${drink.name}" onerror="this.style.display='none'">${drink.name}${drink.discount ? `<span class="discount-text"> (Oferta -${config.discountAmount * 100}%)</span>` : ''}</span>
                <span class="price">€${currentPrice}</span>
                <span class="popularity">${drink.popularity}</span>
                <span class="price-change ${arrowClass}"></span>
                ${isDrinksOnly ? '' : `<button onclick="addToCart(${drink.id})">Añadir</button>`}
            `;
            drinkLi.dataset.price = currentPrice;
            drinkLi.dataset.discount = currentDiscount;
            drinkLi.dataset.popularity = currentPopularity;
        }
    });
}

function addToCart(drinkId) {
    if (isDrinksOnly) return;
    const drink = drinks.find(d => d.id === drinkId);
    if (drink) {
        const cartItem = { ...drink, price: drink.discount ? drink.price * (1 - config.discountAmount) : drink.price };
        cart.push(cartItem);
        updateCart();
        showNotification(`${drink.name} añadido al carrito`, 'success');
        syncState();
    }
}

function updateCart() {
    if (isDrinksOnly || !cartItems || !cartTotal) return;
    cartItems.innerHTML = '';
    let total = 0;
    cart.forEach((item) => {
        const li = document.createElement('li');
        li.textContent = `${item.name}${item.discount ? ` (Oferta -${config.discountAmount * 100}%)` : ''} - €${item.price.toFixed(2)}`;
        cartItems.appendChild(li);
        total += item.price;
    });
    cartTotal.textContent = total.toFixed(2);
}

if (buyButton) {
    buyButton.addEventListener('click', () => {
        if (cart.length === 0) {
            showNotification('El pedido está vacío.', 'error');
            return;
        }

        cart.forEach(item => {
            const drink = drinks.find(d => d.id === item.id);
            drink.popularity += 1;
            drink.prevPrice = drink.price;
            drink.price = drink.price * 1.05;
            drink.discount = false;
            drink.discountEnd = 0;
        });

        index += cart.length * 10;
        updateIndex();

        const transaction = {
            items: [...cart],
            total: cart.reduce((sum, item) => sum + item.price, 0),
            date: new Date().toLocaleString()
        };
        history.push(transaction);

        showNotification(`Compra realizada por €${transaction.total.toFixed(2)}!`, 'success');
        updateHistory();
        cart = [];
        updateCart();
        updateDrinks();
        updateTicker();
        syncState();
    });
}

function updateHistory() {
    if (isDrinksOnly || !historyList) return;
    historyList.innerHTML = '';
    history.forEach((trans, index) => {
        const li = document.createElement('li');
        li.textContent = `Compra ${index + 1} (${trans.date}): ${trans.items.map(item => item.name + (item.discount ? ` (Oferta -${config.discountAmount * 100}%)` : '')).join(', ')} - Total: €${trans.total.toFixed(2)}`;
        historyList.appendChild(li);
    });
}

function simulateMarket() {
    const now = Date.now();
    if (now - lastUpdate < config.updateInterval) return;
    lastUpdate = now;
    const currentTime = Math.floor(now / 1000);
    console.log('Simulando fluctuaciones del mercado');

    drinks.forEach(drink => {
        drink.prevPrice = drink.price;
        const fluctuation = Math.random() * (config.priceFluctuation.max - config.priceFluctuation.min) + config.priceFluctuation.min;
        drink.price = Math.max(config.minPrice, drink.price * (1 + fluctuation));

        if (drink.discount && currentTime >= drink.discountEnd) {
            drink.discount = false;
            drink.discountEnd = 0;
        } else if (!drink.discount && Math.random() < config.discountProbability) {
            drink.discount = true;
            drink.discountEnd = currentTime + config.discountDuration;
            showNotification(`¡Oferta flash en ${drink.name}! -${config.discountAmount * 100}%`, 'info');
            if (soundEnabled && offerSound) {
                offerSound.play().catch(err => console.error('Error al reproducir sonido de oferta:', err));
            }
        }
    });

    const indexFluctuation = Math.random() * (config.indexFluctuation.max - config.indexFluctuation.min) + config.indexFluctuation.min;
    index = Math.max(config.minIndex, index * (1 + indexFluctuation));
    updateIndex();
    updateDrinks();
    updateTicker();
    syncState();
}

function updateIndex() {
    if (isDrinksOnly || !indexValue) return;
    indexValue.textContent = index.toFixed(2);
    console.log('Índice actualizado:', index);
}

function updateCrashTimer() {
    crashTime--;
    const minutes = Math.floor(crashTime / 60);
    const seconds = crashTime % 60;
    if (crashTimer) crashTimer.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    if (crashTime <= 0) {
        crashMarket();
        crashTime = config.crashInterval;
    }
    syncState();
}

function crashMarket() {
    console.log('Ejecutando crash del mercado');
    drinks.forEach(drink => {
        drink.prevPrice = drink.price;
        drink.price = drink.price * (1 - config.crashPriceDrop);
        drink.discount = false;
        drink.discountEnd = 0;
    });
    index *= (1 - config.crashIndexDrop);
    updateIndex();
    if (indexSection) indexSection.classList.add('crash');
    setTimeout(() => indexSection && indexSection.classList.remove('crash'), 3000);
    if (soundEnabled && crashSound) {
        crashSound.play().catch(err => console.error('Error al reproducir sonido de crash:', err));
    }
    showNotification(`¡Crash! Precios caídos un ${config.crashPriceDrop * 100}%.`, 'error');
    updateDrinks();
    updateTicker();
    syncState();
}

function updateTicker() {
    if (!tickerContent) return;
    const currentContent = drinks.map(drink => {
        const arrowClass = drink.price > drink.prevPrice ? 'arrow-up' : drink.price < drink.prevPrice ? 'arrow-down' : '';
        const displayPrice = drink.discount ? (drink.price * (1 - config.discountAmount)).toFixed(2) : drink.price.toFixed(2);
        return `<span class="ticker-item">${drink.name}${drink.discount ? ` (-${config.discountAmount * 100}%)` : ''}: €${displayPrice} <span class="${arrowClass}"></span> | </span>`;
    }).join('');
    if (tickerContent.innerHTML !== currentContent) {
        tickerContent.innerHTML = currentContent;
        console.log('Ticker actualizado');
    }
}

if (soundToggle) {
    soundToggle.addEventListener('change', () => {
        soundEnabled = soundToggle.checked;
        console.log('Sonido:', soundEnabled ? 'activado' : 'desactivado');
    });
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        console.log('Tema cambiado a', document.body.classList.contains('light-theme') ? 'claro' : 'oscuro');
    });
}

if (modeToggle) {
    modeToggle.addEventListener('click', () => {
        toggleMode();
    });
}

document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.key.toLowerCase() === 'm') {
        event.preventDefault();
        toggleMode();
    }
});

function toggleMode() {
    isDrinksOnly = !isDrinksOnly;
    document.body.classList.toggle('drinks-only');
    if (modeToggle) modeToggle.textContent = isDrinksOnly ? 'Modo Completo' : 'Modo Solo Bebidas';
    console.log('Modo cambiado a:', isDrinksOnly ? 'Solo Bebidas' : 'Completo');
    updateDrinks();
    updateTicker();
    if (!isDrinksOnly) {
        updateCart();
        updateHistory();
        updateIndex();
    }
    if (isDrinksOnly && !document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => console.error('Error al entrar en pantalla completa:', err));
    }
}

if (fullscreenToggle) {
    fullscreenToggle.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => console.error('Error al entrar en pantalla completa:', err));
        } else {
            document.exitFullscreen();
        }
    });
}

if (tickerToggle) {
    tickerToggle.addEventListener('click', () => {
        const isPaused = tickerContent.classList.toggle('paused');
        tickerToggle.textContent = isPaused ? 'Reanudar Ticker' : 'Pausar Ticker';
        console.log('Ticker:', isPaused ? 'pausado' : 'reanudado');
    });
}

if (exportHistory) {
    exportHistory.addEventListener('click', () => {
        if (isDrinksOnly) return;
        const csv = ['Fecha,Bebidas,Total'];
        history.forEach(t => {
            csv.push(`${t.date},"${t.items.map(i => i.name).join(';')}",€${t.total.toFixed(2)}`);
        });
        const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'historial_bar_down_jones.csv';
        a.click();
        URL.revokeObjectURL(url);
        console.log('Historial exportado como CSV');
    });
}

function startMarketSimulation() {
    console.log('Iniciando simulación del mercado');
    loadState();
    updateDrinks();
    updateTicker();
    if (!isDrinksOnly) {
        updateIndex();
        updateCart();
        updateHistory();
    }
    setInterval(() => {
        updateDrinks();
        updateTicker();
        if (!isDrinksOnly) {
            simulateMarket();
            updateCrashTimer();
        }
    }, config.updateInterval);
}

window.addEventListener('storage', () => {
    console.log('Cambio detectado en localStorage, recargando estado');
    loadState();
});

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM completamente cargado, iniciando aplicación');
    startMarketSimulation();
});