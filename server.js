// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Predefined order updates based on your provided data
const orderUpdates = [
    { "AppOrderID": 1111075075, "price": 2, "triggerPrice": 4, "priceType": "MKT", "productType": "I", "status": "complete", "CumulativeQuantity": 0, "LeavesQuantity": 1, "OrderGeneratedDateTimeAPI": "23-07-2024 10:16:17", "transaction": "buy", "AlgoID": "", "exchange": "NSE", "symbol": "IDEA"},
    { "AppOrderID": 1111075075, "price": 2, "triggerPrice": 4, "priceType": "MKT", "productType": "I", "status": "complete", "CumulativeQuantity": 0, "LeavesQuantity": 1, "OrderGeneratedDateTimeAPI": "23-07-2024 10:16:17", "transaction": "buy", "AlgoID": "", "exchange": "NSE", "symbol": "IDEA"}, // Duplicate
    { "AppOrderID": 1111075075, "price": 2, "triggerPrice": 4, "priceType": "MKT", "productType": "I", "status": "complete", "CumulativeQuantity": 0, "LeavesQuantity": 1, "OrderGeneratedDateTimeAPI": "23-07-2024 10:16:17", "transaction": "buy", "AlgoID": "", "exchange": "NSE", "symbol": "IDEA"}, // Duplicate
    { "AppOrderID": 1111075076, "price": 3, "triggerPrice": 5, "priceType": "MKT", "productType": "I", "status": "complete", "CumulativeQuantity": 0, "LeavesQuantity": 1, "OrderGeneratedDateTimeAPI": "23-07-2024 10:16:18", "transaction": "buy", "AlgoID": "", "exchange": "NSE", "symbol": "RELIANCE"},
    { "AppOrderID": 1111075076, "price": 3, "triggerPrice": 5, "priceType": "MKT", "productType": "I", "status": "complete", "CumulativeQuantity": 0, "LeavesQuantity": 1, "OrderGeneratedDateTimeAPI": "23-07-2024 10:16:18", "transaction": "buy", "AlgoID": "", "exchange": "NSE", "symbol": "RELIANCE"}, // Duplicate
    { "AppOrderID": 1111075077, "price": 4, "triggerPrice": 6, "priceType": "LMT", "productType": "I", "status": "open", "CumulativeQuantity": 0, "LeavesQuantity": 1, "OrderGeneratedDateTimeAPI": "23-07-2024 10:16:19", "transaction": "buy", "AlgoID": "", "exchange": "NSE", "symbol": "TATA"},
    { "AppOrderID": 1111075078, "price": 5, "triggerPrice": 7, "priceType": "LMT", "productType": "I", "status": "cancelled", "CumulativeQuantity": 0, "LeavesQuantity": 1, "OrderGeneratedDateTimeAPI": "23-07-2024 10:16:20", "transaction": "sell", "AlgoID": "", "exchange": "NSE", "symbol": "BAJAJ"},
    { "AppOrderID": 1111075079, "price": 6, "triggerPrice": 8, "priceType": "MKT", "productType": "I", "status": "complete", "CumulativeQuantity": 0, "LeavesQuantity": 1, "OrderGeneratedDateTimeAPI": "23-07-2024 10:16:21", "transaction": "buy", "AlgoID": "", "exchange": "NSE", "symbol": "WIPRO"},
    { "AppOrderID": 1111075079, "price": 6, "triggerPrice": 8, "priceType": "MKT", "productType": "I", "status": "complete", "CumulativeQuantity": 0, "LeavesQuantity": 1, "OrderGeneratedDateTimeAPI": "23-07-2024 10:16:21", "transaction": "buy", "AlgoID": "", "exchange": "NSE", "symbol": "WIPRO"}, // Duplicate
    { "AppOrderID": 1111075080, "price": 7, "triggerPrice": 9, "priceType": "LMT", "productType": "I", "status": "open", "CumulativeQuantity": 0, "LeavesQuantity": 1, "OrderGeneratedDateTimeAPI": "23-07-2024 10:16:22", "transaction": "buy", "AlgoID": "", "exchange": "NSE", "symbol": "ONGC"}
];

io.on('connection', (socket) => {
    console.log('Client connected');

    function sendUpdates(updates, delay) {
        setTimeout(() => {
            updates.forEach(update => {
                const timestamp = new Date().toISOString(); 
                console.log(`Sending update at ${timestamp}: ${JSON.stringify(update)}`);
                socket.emit('orderUpdate', update);
            });
        }, delay);
    }

    sendUpdates(orderUpdates.slice(0, 10), 1000); // First 10 updates after 1 second
    sendUpdates(orderUpdates.slice(10, 30), 2000); // Next 20 updates after 2 seconds 
    sendUpdates(orderUpdates.slice(30, 70), 3000); // 40 updates after 3 seconds
    sendUpdates(orderUpdates.slice(70, 100), 5000); // Final 30 updates after 5 seconds

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(3000, () => {
    console.log('WebSocket server listening on port 3000');
});
