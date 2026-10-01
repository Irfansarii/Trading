document.addEventListener('DOMContentLoaded', () => {
    
    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('glass');
            navbar.style.padding = '0.5rem 0';
        } else {
            navbar.classList.remove('glass');
            navbar.style.padding = '1.5rem 0';
            navbar.style.background = 'transparent';
            navbar.style.boxShadow = 'none';
            navbar.style.border = 'none';
        }
    });

    // Mock Market Data
    const initialAssets = [
        { id: 'btc', name: 'Bitcoin', symbol: 'BTC', price: 69420.50, change: 3.2 },
        { id: 'eth', name: 'Ethereum', symbol: 'ETH', price: 3680.75, change: 2.1 },
        { id: 'sol', name: 'Solana', symbol: 'SOL', price: 165.90, change: 8.5 },
        { id: 'bnb', name: 'Binance Coin', symbol: 'BNB', price: 590.20, change: -1.2 },
        { id: 'xrp', name: 'Ripple', symbol: 'XRP', price: 0.62, change: -0.5 },
        { id: 'ada', name: 'Cardano', symbol: 'ADA', price: 0.45, change: 1.8 }
    ];

    const marketGrid = document.getElementById('marketGrid');
    
    // Render Function
    const renderAssets = (assets) => {
        marketGrid.innerHTML = '';
        assets.forEach(asset => {
            const changeClass = asset.change >= 0 ? 'change-up' : 'change-down';
            const changeSign = asset.change >= 0 ? '+' : '';
            
            const card = document.createElement('div');
            card.className = 'asset-card glass';
            card.id = `asset-${asset.id}`;
            
            card.innerHTML = `
                <div class="asset-header">
                    <div class="asset-name">
                        ${asset.name} <span class="asset-symbol">${asset.symbol}</span>
                    </div>
                    <div class="asset-change ${changeClass}">
                        ${changeSign}${asset.change.toFixed(2)}%
                    </div>
                </div>
                <div class="asset-price" id="price-${asset.id}">
                    $${asset.price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 4})}
                </div>
                
                <!-- Mock Mini Sparkline Canvas -->
                <canvas id="chart-${asset.id}" width="250" height="60" style="width:100%; margin-top: 1rem;"></canvas>
            `;
            
            marketGrid.appendChild(card);
            drawSparkline(`chart-${asset.id}`, asset.change >= 0);
        });
    };

    // Draw Mock Sparklines
    const drawSparkline = (canvasId, isPositive) => {
        const canvas = document.getElementById(canvasId);
        if(!canvas) return;
        const ctx = canvas.getContext('2d');
        const points = 20;
        const width = canvas.width;
        const height = canvas.height;
        
        ctx.beginPath();
        let x = 0;
        let y = isPositive ? height : 0;
        ctx.moveTo(x, y);

        for(let i=1; i<=points; i++) {
            x = (width / points) * i;
            let randomOffset = (Math.random() - 0.5) * 20;
            // Tendency upwards if positive, downwards if negative
            if(isPositive) {
                y = Math.max(0, y - (height / points) + randomOffset);
            } else {
                y = Math.min(height, y + (height / points) + randomOffset);
            }
            ctx.lineTo(x, y);
        }
        
        ctx.strokeStyle = isPositive ? 'hsl(150, 100%, 40%)' : 'hsl(350, 100%, 55%)';
        ctx.lineWidth = 2;
        ctx.shadowColor = ctx.strokeStyle;
        ctx.shadowBlur = 10;
        ctx.stroke();
    };

    renderAssets(initialAssets);

    // Simulate Live Data Updates
    setInterval(() => {
        initialAssets.forEach(asset => {
            // Randomly pick some assets to update
            if(Math.random() > 0.5) {
                const volatility = asset.price * 0.002; // 0.2% volatility
                const changeAmt = (Math.random() - 0.5) * volatility;
                asset.price += changeAmt;
                
                // Update change percentage slightly
                asset.change += (changeAmt / asset.price) * 100;

                const priceEl = document.getElementById(`price-${asset.id}`);
                if(priceEl) {
                    priceEl.innerText = `$${asset.price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 4})}`;
                    
                    // Flash effect
                    const color = changeAmt >= 0 ? 'hsl(150, 100%, 40%)' : 'hsl(350, 100%, 55%)';
                    priceEl.style.color = color;
                    priceEl.style.textShadow = `0 0 10px ${color}`;
                    
                    setTimeout(() => {
                        priceEl.style.color = 'var(--text-primary)';
                        priceEl.style.textShadow = 'none';
                    }, 500);
                }
            }
        });
    }, 2000);

});
