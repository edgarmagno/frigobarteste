// ===== CONFIGURAÇÃO DOS PRODUTOS =====
const products = [
    { id: 'water', name: 'Água', price: 12.00 },
    { id: 'water-gas', name: 'Água com Gás', price: 12.00 },
    { id: 'soda', name: 'Refrigerante', price: 10.00 },
    { id: 'beer', name: 'Cerveja', price: 15.00 },
    { id: 'Chocomilk', name: 'Achocolatado', price: 9.00 }
];

// Objeto para armazenar quantidades
const quantities = {};

// Inicializar quantidades e gerar HTML dos produtos
function initializeApp() {
    const container = document.getElementById('items-container');
    
    products.forEach(product => {
        quantities[product.id] = 0;
        
        const productHTML = `
            <div class="bg-white rounded-2xl shadow-lg p-4">
                <div class="flex items-center justify-between">
                    <div>
                        <h3 class="font-semibold text-gray-800">${product.name}</h3>
                        <p class="text-blue-600 font-bold">R$ ${product.price.toFixed(2).replace('.', ',')}</p>
                    </div>
                    <div class="flex items-center space-x-3">
                        <button 
                            onclick="updateQuantity('${product.id}', -1)" 
                            class="w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center font-bold transition-colors"
                        >-</button>
                        <span id="${product.id}-qty" class="text-xl font-semibold w-8 text-center">0</span>
                        <button 
                            onclick="updateQuantity('${product.id}', 1)" 
                            class="w-10 h-10 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center font-bold transition-colors"
                        >+</button>
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML += productHTML;
    });
}

function updateQuantity(productId, change) {
    const newQuantity = Math.max(0, quantities[productId] + change);
    quantities[productId] = newQuantity;
    document.getElementById(`${productId}-qty`).textContent = newQuantity;
    updateGrandTotal();
}

function updateGrandTotal() {
    let total = 0;
    products.forEach(product => {
        total += product.price * quantities[product.id];
    });
    document.getElementById('grand-total').textContent = 
        `R$ ${total.toFixed(2).replace('.', ',')}`;
}

function sendToWhatsApp() {
    const apartmentNumber = document.getElementById('apartmentNumber').value.trim();
    
    if (!apartmentNumber) {
        alert('Por favor, preencha o número do apartamento!');
        document.getElementById('apartmentNumber').focus();
        return;
    }

    const consumedItems = products.filter(product => quantities[product.id] > 0);
    
    if (consumedItems.length === 0) {
        alert('Selecione pelo menos um item do frigobar!');
        return;
    }

    let message = `*CONSUMO*\n\n`;
    message += `*UH:* ${apartmentNumber}\n`;
    message += `*Itens Consumidos:*\n`;
    
    let total = 0;
    consumedItems.forEach(product => {
        const quantity = quantities[product.id];
        const subtotal = product.price * quantity;
        total += subtotal;
        message += `• ${product.name}: ${quantity}x - R$ ${subtotal.toFixed(2).replace('.', ',')}\n`;
    });
    
    message += `\n*TOTAL: R$ ${total.toFixed(2).replace('.', ',')}*`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
}

document.addEventListener('DOMContentLoaded', initializeApp);
