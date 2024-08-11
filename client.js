// client.js
const { io } = require('socket.io-client');

const socket = io('http://localhost:3000');

const orders = new Map();

// let lastSentUpdateTime = 0;
function isRedundant(update) {
    const key = `${update.AppOrderID}_${update.price}_${update.triggerPrice}_${update.priceType}_${update.productType}_${update.status}_${update.exchange}_${update.symbol}`;
    if (orders.has(key)) {
        return true;
    }
    orders.set(key, update);
    return false;
}

function determineAction(update) {
    const { priceType, status, AppOrderID } = update;
    const key = `${AppOrderID}_${update.price}_${update.triggerPrice}_${priceType}_${update.productType}_${status}_${update.exchange}_${update.symbol}`;
    const orderExists = orders.has(key);
    if (!orderExists) {
        if (
            (priceType === 'MKT' && status === 'complete') ||
            (priceType === 'LMT' && status === 'open') ||
            ((priceType === 'SL-LMT' || priceType === 'SL-MKT') && status === 'pending')
        ) {
            return 'placeOrder';
        }
    } else {
        if (
            (priceType === 'MKT' && status === 'complete') ||
            (priceType === 'LMT' && status === 'open') ||
            ((priceType === 'SL-LMT' || priceType === 'SL-MKT') && status === 'pending')
        ) {
            return 'modifyOrder';
        }
    }
    if (
        status === 'cancelled' &&
        (priceType === 'LMT' || priceType === 'SL-LMT' || priceType === 'SL-MKT')
    ) {
        return 'cancelOrder';
    }

    return null; 
}

function handleUpdate(update) {
    const action = determineAction(update);
    if (action) {
        console.log(`For AppOrderId:${update.AppOrderID}: ${action} `)
        sendToUpdater(update, action);
    } else {
        console.log(`No action needed for order ${update.AppOrderID}`);
    }
}

function sendToUpdater(update, action) {
    console.log(`Logged action: ${action} for order:`, update);
}

socket.on('orderUpdate', (update) => {
    console.log(`Received update: ${JSON.stringify(update)}`);

    if (isRedundant(update)) {
        console.log(`Filtered redundant update for order ${update.AppOrderID}`);
        return;
    }

    // const currentTime = Date.now();
    // if (currentTime - lastSentUpdateTime > 1000) {
    //     lastReceivedUpdate = update;
    //     lastSentUpdateTime = currentTime;
    //     return;
    // }

    // if (lastReceivedUpdate) {
    //     handleUpdate(lastReceivedUpdate);
    //     lastReceivedUpdate = null;
    // } else {
    //     handleUpdate(update);
    // }
    handleUpdate(update);
    // lastSentUpdateTime = currentTime;
});

socket.on('connect', () => {
    console.log('Connected to WebSocket server');
});

