document.addEventListener('DOMContentLoaded', () => {
    const products = [
        "Abacate", "Abacaxi", "Açúcar", "Água mineral", "Alface", "Alho", "Amaciante de roupas", "Amendoim",
        "Arroz", "Azeite", "Bacia plástica", "Biscoitos", "Bolacha", "Bombom", "Brócolis", "Café", "Calabresa",
        "Carne bovina", "Cenoura", "Cerveja", "Chocolate", "Côco", "Condicionador", "Creme dental", "Cuscuz",
        "Detergente", "Desinfetante", "Ervilha", "Espinafre", "Farinha de trigo", "Feijão", "Fermento em pó",
        "Fubá", "Gelatina", "Iogurte", "Isqueiro", "Ketchup", "Leite", "Leite condensado", "Limão", "Lixa de unha",
        "Macarrão", "Maionese", "Manteiga", "Margarina", "Melancia", "Morango", "Nabo", "Nescau", "Nescafé",
        "Óleo de cozinha", "Ovo", "Palmito", "Papel alumínio", "Papel higiênico", "Pão", "Peito de frango", "Picanha",
        "Pimenta", "Pipoca", "Pó de café", "Presunto", "Queijo", "Quiabo", "Refrigerante", "Repolho", "Sabão em barra",
        "Sabão em pó", "Sal", "Salsicha", "Shampoo", "Sorvete", "Suco", "Tomate", "Uva", "Vassoura", "Vela", "Vinagre",
        "Vodka", "Waffle", "Yakisoba", "Yogurt", "Zucchini (abobrinha)", "Bala", "Batata", "Batata doce", "Cebola",
        "Champignon", "Creme de leite", "Desodorante", "Espaguete", "Farofa", "Frango congelado", "Geléia",
        "Hambúrguer", "Laranja", "Maçã", "Mamão", "Manga", "Papel toalha"
    ];

    const productsBtn = document.getElementById('products-btn');
    const dashboardBtn = document.getElementById('dashboard-btn');
    const fillProductsBtn = document.getElementById('fill-products-btn');
    const supermarketInputContainer = document.getElementById('supermarket-input-container');
    const productsContainer = document.getElementById('products-container');
    const dashboardContainer = document.getElementById('dashboard-container');
    const supermarketNameInput = document.getElementById('supermarket-name');
    const savedSupermarkets = document.getElementById('saved-supermarkets');

    let savedData = [];

    productsBtn.addEventListener('click', () => {
        clearMiddleContent(); // Limpa o conteúdo do meio
        supermarketInputContainer.classList.remove('hidden'); // Exibe o input do supermercado
    });

    dashboardBtn.addEventListener('click', () => {
        clearMiddleContent(); // Limpa o conteúdo do meio
        dashboardContainer.classList.remove('hidden'); // Exibe o dashboard
        renderDashboard(); // Renderiza o dashboard
    });

    supermarketNameInput.addEventListener('input', () => {
        fillProductsBtn.disabled = !supermarketNameInput.value.trim();
    });

    fillProductsBtn.addEventListener('click', () => {
        const supermarketName = supermarketNameInput.value.trim();
        if (supermarketName) {
            clearMiddleContent(); // Limpa o conteúdo do meio
            productsContainer.classList.remove('hidden'); // Exibe a lista de produtos
            renderProducts(supermarketName); // Renderiza os produtos
        }
    });

    function renderProducts(supermarketName) {
        let tableHtml = `<h2>${supermarketName}</h2><table>`;
        tableHtml += `
            <tr>
                <th>Produto</th>
                <th>Quantidade Mínima</th>
                <th>Valor</th>
            </tr>
        `;

        products.forEach(product => {
            tableHtml += `
                <tr>
                    <td>${product}</td>
                    <td><input type="number" class="min-qty" data-product="${product}" min="0"></td>
                    <td><input type="number" class="price" data-product="${product}" min="0" step="0.01"></td>
                </tr>
            `;
        });

        tableHtml += `
            </table>
            <button id="save-btn">Salvar</button>
        `;
        
        productsContainer.innerHTML = tableHtml;

        document.getElementById('save-btn').addEventListener('click', () => {
            saveData(supermarketName);
        });
    }

    function saveData(supermarketName) {
        const minQtyInputs = document.querySelectorAll('.min-qty');
        const priceInputs = document.querySelectorAll('.price');

        const data = {
            supermarketName,
            products: []
        };

        minQtyInputs.forEach(input => {
            const product = input.getAttribute('data-product');
            const minQty = input.value;
            const price = document.querySelector(`.price[data-product="${product}"]`).value;
            
            if (minQty && price) {
                data.products.push({
                    product,
                    minQty: parseFloat(minQty),
                    price: parseFloat(price)
                });
            }
        });

        savedData.push(data);
        renderSavedSupermarkets();
        resetForm();
    }

    function renderSavedSupermarkets() {
        savedSupermarkets.innerHTML = '';
        savedData.forEach((data) => {
            const button = document.createElement('button');
            button.textContent = data.supermarketName;
            button.addEventListener('click', () => {
                clearMiddleContent(); // Limpa o conteúdo do meio
                productsContainer.classList.remove('hidden'); // Exibe a lista de produtos
                renderSavedProducts(data); // Renderiza os produtos salvos
            });
            savedSupermarkets.appendChild(button);
        });
    }

    function renderSavedProducts(data) {
        let tableHtml = `<h2>${data.supermarketName}</h2><table>`;
        tableHtml += `
            <tr>
                <th>Produto</th>
                <th>Quantidade Mínima</th>
                <th>Valor</th>
            </tr>
        `;

        data.products.forEach(product => {
            tableHtml += `
                <tr>
                    <td>${product.product}</td>
                    <td>${product.minQty}</td>
                    <td>R$ ${product.price.toFixed(2)}</td>
                </tr>
            `;
        });

        tableHtml += `
            </table>
        `;
        
        productsContainer.innerHTML = tableHtml;
    }

    function renderDashboard() {
        dashboardContainer.innerHTML = ''; // Limpa o dashboard antes de renderizar
        savedData.forEach((data) => {
            const totalValue = data.products.reduce((acc, product) => acc + (product.minQty * product.price), 0);
            const totalProducts = data.products.reduce((acc, product) => acc + product.minQty, 0);

            const dashboardItem = document.createElement('div');
            dashboardItem.className = 'dashboard-item';
            dashboardItem.innerHTML = `
                <h2>${data.supermarketName}</h2>
                <p>Quantidade Total de Produtos: ${totalProducts}</p>
                <p>Valor Total: R$ ${totalValue.toFixed(2)}</p>
                <div class="chart-container">
                    <canvas id="chart-${data.supermarketName.replace(/\s+/g, '-')}" width="400" height="200"></canvas>
                </div>
            `;

            dashboardContainer.appendChild(dashboardItem);
            renderChart(data, `chart-${data.supermarketName.replace(/\s+/g, '-')}`);
        });
    }

    function renderChart(data, chartId) {
        const ctx = document.getElementById(chartId).getContext('2d');
        const labels = data.products.map(product => product.product);
        const dataValues = data.products.map(product => product.minQty);

        const chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Quantidade de Produtos',
                    data: dataValues,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    function clearMiddleContent() {
        productsContainer.classList.add('hidden'); // Oculta a lista de produtos
        dashboardContainer.classList.add('hidden'); // Oculta o dashboard
        productsContainer.innerHTML = ''; // Limpa o conteúdo da lista de produtos
        dashboardContainer.innerHTML = ''; // Limpa o conteúdo do dashboard
    }

    function resetForm() {
        supermarketNameInput.value = '';
        fillProductsBtn.disabled = true;
        supermarketInputContainer.classList.remove('hidden'); // Exibe o input do supermercado novamente
    }
});
