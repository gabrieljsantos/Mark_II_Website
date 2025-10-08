// =============================
// MARK II - EFEITO FOTOELÉTRICO
// JavaScript Principal
// =============================

class PhotoelectricApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initSmoothScroll();
        this.initLightbox();
        this.initLEDInteractions();
        this.initHeaderEffects();
        this.initAnimations();
    }

    // =============================
    // NAVEGAÇÃO SUAVE
    // =============================
    initSmoothScroll() {
        const navLinks = document.querySelectorAll('header nav a[href^="#"]');
        const heroButtons = document.querySelectorAll('.hero-buttons a[href^="#"]');
        const footerLinks = document.querySelectorAll('.footer-links a[href^="#"]');
        
        const allLinks = [...navLinks, ...heroButtons, ...footerLinks];
        
        allLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    // Calcular offset para header fixo
                    const headerHeight = document.querySelector('#header').offsetHeight;
                    const targetPosition = targetSection.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Adicionar classe ativa ao link
                    this.updateActiveNavLink(targetId);
                }
            });
        });
    }

    updateActiveNavLink(targetId) {
        // Remover classe ativa de todos os links
        document.querySelectorAll('header nav a').forEach(link => {
            link.classList.remove('active');
        });
        
        // Adicionar classe ativa ao link atual
        const activeLink = document.querySelector(`header nav a[href="${targetId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    // =============================
    // EFEITOS DO HEADER
    // =============================
    initHeaderEffects() {
        const header = document.querySelector('#header');
        let lastScrollY = window.scrollY;

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            // Header com fundo quando scrolled
            if (currentScrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            // Auto-hide header quando scrolling down (opcional)
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                header.classList.add('hidden');
            } else {
                header.classList.remove('hidden');
            }
            
            lastScrollY = currentScrollY;
            
            // Atualizar link ativo baseado na seção visível
            this.updateActiveNavOnScroll();
        });
    }

    updateActiveNavOnScroll() {
        const sections = document.querySelectorAll('section[id]');
        const headerHeight = document.querySelector('#header').offsetHeight;
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 50;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = '#' + section.getAttribute('id');
            }
        });
        
        if (current) {
            this.updateActiveNavLink(current);
        }
    }

    // =============================
    // LIGHTBOX AVANÇADO
    // =============================
    initLightbox() {
        const lightbox = document.querySelector('#lightbox');
        const lightboxImg = document.querySelector('#lightbox-img');
        const closeBtn = document.querySelector('#lightbox-close');
        
        // Imagens que podem abrir no lightbox
        const images = document.querySelectorAll(`
            .aparato-img, 
            .component-img, 
            .graph-img, 
            .model-img, 
            .led-image,
            .hero-image
        `);

        images.forEach(img => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', () => {
                this.openLightbox(img.src, img.alt);
            });
        });

        // Fechar lightbox
        closeBtn.addEventListener('click', () => this.closeLightbox());
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                this.closeLightbox();
            }
        });

        // Fechar com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeLightbox();
            }
        });
    }

    openLightbox(src, alt) {
        const lightbox = document.querySelector('#lightbox');
        const lightboxImg = document.querySelector('#lightbox-img');
        
        lightboxImg.src = src;
        lightboxImg.alt = alt;
        
        lightbox.classList.add('active');
        document.body.classList.add('lightbox-open');
        
        // Animação de entrada
        setTimeout(() => {
            lightboxImg.style.transform = 'scale(1)';
            lightboxImg.style.opacity = '1';
        }, 10);
    }

    closeLightbox() {
        const lightbox = document.querySelector('#lightbox');
        const lightboxImg = document.querySelector('#lightbox-img');
        
        lightboxImg.style.transform = 'scale(0.8)';
        lightboxImg.style.opacity = '0';
        
        setTimeout(() => {
            lightbox.classList.remove('active');
            document.body.classList.remove('lightbox-open');
        }, 300);
    }

    // =============================
    // INTERAÇÕES DOS LEDS
    // =============================
    initLEDInteractions() {
        const ledCards = document.querySelectorAll('.led-card');
        
        ledCards.forEach(card => {
            const wavelength = card.dataset.wavelength;
            const color = card.dataset.color;
            const name = card.dataset.name;
            const ledCircle = card.querySelector('.led-circle');
            const ledGlow = card.querySelector('.led-glow');
            
            // Hover effects
            card.addEventListener('mouseenter', () => {
                this.activateLED(card, color);
            });
            
            card.addEventListener('mouseleave', () => {
                this.deactivateLED(card);
            });
            
            // Click para destacar
            card.addEventListener('click', () => {
                this.toggleLEDSelection(card, color);
            });
        });
        
        // Inicializar espectro
        this.initSpectrum();
    }

    activateLED(card, color) {
        const ledGlow = card.querySelector('.led-glow');
        const ledCircle = card.querySelector('.led-circle');
        
        // Efeito de brilho
        ledGlow.style.background = `radial-gradient(circle, ${color}40, transparent)`;
        ledGlow.style.transform = 'scale(1.5)';
        ledGlow.style.opacity = '0.8';
        
        // Pulsação no LED
        ledCircle.style.transform = 'scale(1.1)';
        ledCircle.style.boxShadow = `0 0 20px ${color}80`;
        
        // Animação do card
        card.style.transform = 'translateY(-5px)';
        card.style.boxShadow = `0 10px 30px rgba(0,0,0,0.3), 0 0 0 2px ${color}40`;
    }

    deactivateLED(card) {
        const ledGlow = card.querySelector('.led-glow');
        const ledCircle = card.querySelector('.led-circle');
        
        if (!card.classList.contains('selected')) {
            ledGlow.style.transform = 'scale(1)';
            ledGlow.style.opacity = '0';
            
            ledCircle.style.transform = 'scale(1)';
            ledCircle.style.boxShadow = 'none';
            
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '';
        }
    }

    toggleLEDSelection(card, color) {
        const isSelected = card.classList.contains('selected');
        
        // Remover seleção de outros LEDs
        document.querySelectorAll('.led-card.selected').forEach(c => {
            if (c !== card) {
                c.classList.remove('selected');
                this.deactivateLED(c);
            }
        });
        
        if (!isSelected) {
            card.classList.add('selected');
            this.activateLED(card, color);
            
            // Mostrar informações detalhadas
            this.showLEDDetails(card);
        } else {
            card.classList.remove('selected');
            this.deactivateLED(card);
            this.hideLEDDetails();
        }
    }

    showLEDDetails(card) {
        const wavelength = card.dataset.wavelength;
        const name = card.dataset.name;
        
        // Criar ou atualizar painel de detalhes
        let detailsPanel = document.querySelector('.led-details-panel');
        if (!detailsPanel) {
            detailsPanel = document.createElement('div');
            detailsPanel.className = 'led-details-panel';
            card.parentNode.appendChild(detailsPanel);
        }
        
        // Calcular valores físicos
        const frequency = (3e8 / (wavelength * 1e-9) / 1e12).toFixed(2); // THz
        const energy = (1.24e3 / wavelength).toFixed(2); // eV
        
        detailsPanel.innerHTML = `
            <div class="led-detail-content">
                <h4>LED ${name} - Análise Detalhada</h4>
                <div class="led-properties">
                    <div class="property">
                        <label>Comprimento de Onda:</label>
                        <value>${wavelength} nm</value>
                    </div>
                    <div class="property">
                        <label>Frequência:</label>
                        <value>${frequency} THz</value>
                    </div>
                    <div class="property">
                        <label>Energia do Fóton:</label>
                        <value>${energy} eV</value>
                    </div>
                </div>
            </div>
        `;
        
        detailsPanel.style.display = 'block';
        setTimeout(() => detailsPanel.classList.add('active'), 10);
    }

    hideLEDDetails() {
        const detailsPanel = document.querySelector('.led-details-panel');
        if (detailsPanel) {
            detailsPanel.classList.remove('active');
            setTimeout(() => detailsPanel.style.display = 'none', 300);
        }
    }

    initSpectrum() {
        const spectrumBar = document.querySelector('.spectrum-bar');
        if (!spectrumBar) return;
        
        // Adicionar indicadores interativos
        const markers = spectrumBar.querySelectorAll('.spectrum-markers span');
        markers.forEach(marker => {
            marker.addEventListener('click', () => {
                const wavelength = marker.textContent.replace('nm', '');
                const ledCard = document.querySelector(`[data-wavelength="${wavelength}"]`);
                if (ledCard) {
                    ledCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    ledCard.click();
                }
            });
        });
    }

    // =============================
    // ANIMAÇÕES E EFEITOS
    // =============================
    initAnimations() {
        this.initScrollAnimations();
        this.initHeroEffects();
        this.initParticles();
    }

    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, observerOptions);
        
        // Elementos para animar
        const elementsToAnimate = document.querySelectorAll(`
            .aparato-item,
            .component-item,
            .led-card,
            .model-item,
            .graph-item,
            .problem-item
        `);
        
        elementsToAnimate.forEach(el => {
            observer.observe(el);
        });
    }

    initHeroEffects() {
        const heroTitle = document.querySelector('.hero-title');
        const heroSubtitle = document.querySelector('.hero-subtitle');
        const heroDescription = document.querySelector('.hero-description');
        const heroButtons = document.querySelector('.hero-buttons');
        
        // Animação sequencial dos elementos do hero
        setTimeout(() => heroTitle?.classList.add('animate'), 100);
        setTimeout(() => heroSubtitle?.classList.add('animate'), 300);
        setTimeout(() => heroDescription?.classList.add('animate'), 500);
        setTimeout(() => heroButtons?.classList.add('animate'), 700);
    }

    initParticles() {
        const particlesContainer = document.querySelector('.hero-particles');
        if (!particlesContainer) return;
        
        // Criar partículas animadas
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const size = Math.random() * 4 + 2;
            const x = Math.random() * 100;
            const animationDuration = Math.random() * 10 + 5;
            const delay = Math.random() * 5;
            
            particle.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${x}%;
                animation: floatUp ${animationDuration}s ease-in-out ${delay}s infinite;
            `;
            
            particlesContainer.appendChild(particle);
        }
    }

    // =============================
    // EVENT LISTENERS GERAIS
    // =============================
    setupEventListeners() {
        // Redimensionamento da janela
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));
        
        // Prevenção de scroll durante lightbox
        document.addEventListener('keydown', (e) => {
            if (document.body.classList.contains('lightbox-open') && 
                ['ArrowUp', 'ArrowDown', 'Space'].includes(e.code)) {
                e.preventDefault();
            }
        })

        // Controles de teclado para lightbox
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeLightbox();
            }
        });
        
        // Lazy loading para imagens
        this.setupLazyLoading();
        
        // Performance monitoring
        this.setupPerformanceMonitoring();
    }

    handleResize() {
        // Reajustar partículas no hero
        this.initParticles();
        
        // Recalcular posições dos elementos se necessário
        const activeDetails = document.querySelector('.led-details-panel.active');
        if (activeDetails) {
            this.repositionDetailsPanel(activeDetails);
        }
    }

    repositionDetailsPanel(panel) {
        // Garantir que o painel de detalhes permaneça visível
        const rect = panel.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        
        if (rect.right > viewportWidth) {
            panel.style.left = (viewportWidth - rect.width - 20) + 'px';
        }
        if (rect.left < 0) {
            panel.style.left = '20px';
        }
    }

    // =============================
    // LAZY LOADING
    // =============================
    setupLazyLoading() {
        const images = document.querySelectorAll('img[src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        this.loadImage(img);
                        imageObserver.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px'
            });
            
            images.forEach(img => {
                if (!img.complete) {
                    imageObserver.observe(img);
                }
            });
        }
    }

    loadImage(img) {
        img.addEventListener('load', () => {
            img.style.opacity = '1';
            img.classList.add('loaded');
        });
        
        img.addEventListener('error', () => {
            img.style.opacity = '0.5';
            img.alt = 'Erro ao carregar imagem';
        });
    }

    // =============================
    // PERFORMANCE MONITORING
    // =============================
    setupPerformanceMonitoring() {
        // Monitorar FPS das animações
        let lastTime = performance.now();
        let frames = 0;
        let fps = 0;
        
        const measureFPS = (currentTime) => {
            frames++;
            if (currentTime >= lastTime + 1000) {
                fps = Math.round((frames * 1000) / (currentTime - lastTime));
                frames = 0;
                lastTime = currentTime;
                
                // Se FPS muito baixo, reduzir animações
                if (fps < 30) {
                    document.body.classList.add('reduce-animations');
                } else {
                    document.body.classList.remove('reduce-animations');
                }
            }
            requestAnimationFrame(measureFPS);
        };
        
        requestAnimationFrame(measureFPS);
    }

    // =============================
    // FUNCIONALIDADES AVANÇADAS DOS LEDS
    // =============================
    initAdvancedLEDFeatures() {
        this.createLEDComparison();
        this.createPhotoelectricSimulator();
        this.createWavelengthCalculator();
    }

    createLEDComparison() {
        const compareButton = this.createButton('Comparar LEDs', 'compare-leds-btn');
        const ledsSection = document.querySelector('#leds .container');
        
        if (ledsSection) {
            ledsSection.appendChild(compareButton);
            
            compareButton.addEventListener('click', () => {
                this.showLEDComparison();
            });
        }
    }

    showLEDComparison() {
        const modal = this.createModal('LED Comparison');
        const modalContent = modal.querySelector('.modal-content');
        
        const ledData = [
            { name: 'Vermelho', wavelength: 625, energy: 1.98, color: '#DC143C' },
            { name: 'Laranja', wavelength: 580, energy: 2.14, color: '#FFD700' },
            { name: 'Verde', wavelength: 530, energy: 2.34, color: '#32CD32' },
            { name: 'Azul', wavelength: 450, energy: 2.76, color: '#4169E1' }
        ];
        
        const comparisonTable = document.createElement('div');
        comparisonTable.className = 'led-comparison-table';
        comparisonTable.innerHTML = `
            <div class="comparison-header">
                <h3>Comparação Detalhada dos LEDs</h3>
                <p>Análise das propriedades fotônicas de cada LED utilizado</p>
            </div>
            <div class="comparison-grid">
                ${ledData.map(led => `
                    <div class="comparison-item" style="border-left: 4px solid ${led.color}">
                        <div class="led-color-sample" style="background-color: ${led.color}"></div>
                        <h4>${led.name}</h4>
                        <div class="comparison-data">
                            <div class="data-row">
                                <span>Comprimento de onda:</span>
                                <strong>${led.wavelength} nm</strong>
                            </div>
                            <div class="data-row">
                                <span>Energia do fóton:</span>
                                <strong>${led.energy} eV</strong>
                            </div>
                            <div class="data-row">
                                <span>Frequência:</span>
                                <strong>${(3e8 / (led.wavelength * 1e-9) / 1e12).toFixed(2)} THz</strong>
                            </div>
                            <div class="data-row">
                                <span>Capacidade fotoemissiva:</span>
                                <strong>${led.energy > 2.3 ? 'Alta' : 'Baixa'}</strong>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="comparison-chart">
                <canvas id="wavelength-chart" width="400" height="200"></canvas>
            </div>
        `;
        
        modalContent.appendChild(comparisonTable);
        this.drawWavelengthChart(ledData);
    }

    createPhotoelectricSimulator() {
        const simulatorButton = this.createButton('Simulador Fotoelétrico', 'simulator-btn');
        const graphsSection = document.querySelector('#graficos .container');
        
        if (graphsSection) {
            graphsSection.appendChild(simulatorButton);
            
            simulatorButton.addEventListener('click', () => {
                this.showPhotoelectricSimulator();
            });
        }
    }

    showPhotoelectricSimulator() {
        const modal = this.createModal('Simulador do Efeito Fotoelétrico');
        const modalContent = modal.querySelector('.modal-content');
        
        const simulator = document.createElement('div');
        simulator.className = 'photoelectric-simulator';
        simulator.innerHTML = `
            <div class="simulator-controls">
                <h3>Parâmetros do Experimento</h3>
                <div class="control-group">
                    <label for="frequency-slider">Frequência da Luz (THz):</label>
                    <input type="range" id="frequency-slider" min="400" max="800" value="600" step="10">
                    <span id="frequency-value">600</span> THz
                </div>
                <div class="control-group">
                    <label for="intensity-slider">Intensidade:</label>
                    <input type="range" id="intensity-slider" min="1" max="10" value="5">
                    <span id="intensity-value">5</span>
                </div>
                <div class="control-group">
                    <label for="work-function">Função Trabalho (eV):</label>
                    <select id="work-function">
                        <option value="2.3">Césio (2.3 eV)</option>
                        <option value="4.7">Zinco (4.7 eV)</option>
                        <option value="5.1">Cobre (5.1 eV)</option>
                    </select>
                </div>
            </div>
            <div class="simulator-display">
                <div class="energy-diagram">
                    <canvas id="energy-diagram-canvas" width="300" height="200"></canvas>
                </div>
                <div class="results-panel">
                    <h4>Resultados:</h4>
                    <div class="result-item">
                        <span>Energia do Fóton:</span>
                        <span id="photon-energy">2.48 eV</span>
                    </div>
                    <div class="result-item">
                        <span>Energia Cinética Máx.:</span>
                        <span id="kinetic-energy">0.18 eV</span>
                    </div>
                    <div class="result-item">
                        <span>Emissão de Elétrons:</span>
                        <span id="emission-status">SIM</span>
                    </div>
                </div>
            </div>
        `;
        
        modalContent.appendChild(simulator);
        this.initSimulatorControls();
    }

    initSimulatorControls() {
        const frequencySlider = document.getElementById('frequency-slider');
        const intensitySlider = document.getElementById('intensity-slider');
        const workFunctionSelect = document.getElementById('work-function');
        
        const updateSimulation = () => {
            const frequency = parseFloat(frequencySlider.value) * 1e12; // Convert to Hz
            const intensity = parseFloat(intensitySlider.value);
            const workFunction = parseFloat(workFunctionSelect.value);
            
            const photonEnergy = (6.626e-34 * frequency) / (1.602e-19); // Convert to eV
            const kineticEnergy = Math.max(0, photonEnergy - workFunction);
            const canEmit = photonEnergy >= workFunction;
            
            document.getElementById('frequency-value').textContent = (frequency / 1e12).toFixed(0);
            document.getElementById('intensity-value').textContent = intensity;
            document.getElementById('photon-energy').textContent = photonEnergy.toFixed(2) + ' eV';
            document.getElementById('kinetic-energy').textContent = kineticEnergy.toFixed(2) + ' eV';
            document.getElementById('emission-status').textContent = canEmit ? 'SIM' : 'NÃO';
            document.getElementById('emission-status').style.color = canEmit ? '#32CD32' : '#DC143C';
            
            this.updateEnergyDiagram(photonEnergy, workFunction, kineticEnergy);
        };
        
        frequencySlider.addEventListener('input', updateSimulation);
        intensitySlider.addEventListener('input', updateSimulation);
        workFunctionSelect.addEventListener('change', updateSimulation);
        
        updateSimulation(); // Initial calculation
    }

    updateEnergyDiagram(photonEnergy, workFunction, kineticEnergy) {
        const canvas = document.getElementById('energy-diagram-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw energy levels
        const scale = canvas.height / 8; // 8 eV max
        const baseY = canvas.height - 20;
        
        // Work function level
        ctx.strokeStyle = '#DC143C';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(50, baseY - workFunction * scale);
        ctx.lineTo(canvas.width - 50, baseY - workFunction * scale);
        ctx.stroke();
        
        // Photon energy
        ctx.strokeStyle = '#FFD700';
        ctx.beginPath();
        ctx.moveTo(100, baseY);
        ctx.lineTo(100, baseY - photonEnergy * scale);
        ctx.stroke();
        
        // Kinetic energy
        if (kineticEnergy > 0) {
            ctx.strokeStyle = '#32CD32';
            ctx.beginPath();
            ctx.moveTo(150, baseY - workFunction * scale);
            ctx.lineTo(150, baseY - workFunction * scale - kineticEnergy * scale);
            ctx.stroke();
        }
        
        // Labels
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '12px Arial';
        ctx.fillText('Função Trabalho', 200, baseY - workFunction * scale - 5);
        ctx.fillText('E = hf', 105, baseY - photonEnergy * scale - 5);
        if (kineticEnergy > 0) {
            ctx.fillText('E cinética', 155, baseY - workFunction * scale - kineticEnergy * scale - 5);
        }
    }

    // =============================
    // UTILITÁRIOS
    // =============================
    createButton(text, className) {
        const button = document.createElement('button');
        button.textContent = text;
        button.className = `btn btn-primary ${className}`;
        button.style.marginTop = '20px';
        return button;
    }

    createModal(title) {
        const modal = document.createElement('div');
        modal.className = 'custom-modal';
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>${title}</h2>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <!-- Content will be added here -->
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close modal functionality
        const closeBtn = modal.querySelector('.modal-close');
        const overlay = modal.querySelector('.modal-overlay');
        
        closeBtn.addEventListener('click', () => this.closeModal(modal));
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                this.closeModal(modal);
            }
        });
        
        // Show modal with animation
        setTimeout(() => modal.classList.add('active'), 10);
        
        return modal;
    }

    closeModal(modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    }

    drawWavelengthChart(ledData) {
        const canvas = document.getElementById('wavelength-chart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Draw chart
        const barWidth = width / ledData.length * 0.7;
        const maxWavelength = Math.max(...ledData.map(led => led.wavelength));
        
        ledData.forEach((led, index) => {
            const x = (width / ledData.length) * index + (width / ledData.length - barWidth) / 2;
            const barHeight = (led.wavelength / maxWavelength) * (height - 40);
            const y = height - 20 - barHeight;
            
            // Draw bar
            ctx.fillStyle = led.color;
            ctx.fillRect(x, y, barWidth, barHeight);
            
            // Draw label
            ctx.fillStyle = '#FFFFFF';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(led.name, x + barWidth/2, height - 5);
            ctx.fillText(led.wavelength + 'nm', x + barWidth/2, y - 5);
        });
        
        // Chart title
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Comprimentos de Onda dos LEDs', width/2, 20);
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // =============================
    // INICIALIZAÇÃO FINAL
    // =============================
    static init() {
        return new PhotoelectricApp();
    }
}

// =============================
// ESTILOS ADICIONAIS PARA FUNCIONALIDADES AVANÇADAS
// =============================
const additionalStyles = `
    .custom-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 10001;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
    }
    
    .custom-modal.active {
        opacity: 1;
        visibility: visible;
    }
    
    .modal-overlay {
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px;
        backdrop-filter: blur(5px);
    }
    
    .modal-content {
        background: var(--bg-card);
        border-radius: 12px;
        max-width: 800px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: var(--shadow-large);
        transform: scale(0.9);
        transition: transform 0.3s ease;
    }
    
    .custom-modal.active .modal-content {
        transform: scale(1);
    }
    
    .modal-header {
        padding: 20px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .modal-close {
        background: none;
        border: none;
        color: var(--text-secondary);
        font-size: 1.5rem;
        cursor: pointer;
        padding: 5px 10px;
        border-radius: 50%;
        transition: all 0.2s ease;
    }
    
    .modal-close:hover {
        color: var(--text-primary);
        background-color: rgba(255, 255, 255, 0.1);
    }
    
    .modal-body {
        padding: 20px;
    }
    
    .led-comparison-table {
        width: 100%;
    }
    
    .comparison-header {
        text-align: center;
        margin-bottom: 30px;
    }
    
    .comparison-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 20px;
        margin-bottom: 30px;
    }
    
    .comparison-item {
        background: var(--bg-secondary);
        padding: 15px;
        border-radius: 8px;
        text-align: center;
    }
    
    .led-color-sample {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        margin: 0 auto 10px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }
    
    .comparison-data {
        text-align: left;
        margin-top: 10px;
    }
    
    .data-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
        padding: 4px 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }
    
    .data-row span {
        color: var(--text-secondary);
        font-size: 0.9rem;
    }
    
    .data-row strong {
        color: var(--text-primary);
        font-weight: 600;
    }
    
    .comparison-chart {
        margin-top: 30px;
        text-align: center;
        background: var(--bg-secondary);
        padding: 20px;
        border-radius: 8px;
    }
    
    .photoelectric-simulator {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 30px;
    }
    
    .simulator-controls {
        background: var(--bg-secondary);
        padding: 20px;
        border-radius: 8px;
    }
    
    .control-group {
        margin-bottom: 20px;
    }
    
    .control-group label {
        display: block;
        margin-bottom: 8px;
        color: var(--text-primary);
        font-weight: 500;
    }
    
    .control-group input[type="range"] {
        width: 100%;
        height: 6px;
        border-radius: 3px;
        background: var(--bg-primary);
        outline: none;
        margin-bottom: 5px;
    }
    
    .control-group input[type="range"]::-webkit-slider-thumb {
        appearance: none;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: var(--primary-color);
        cursor: pointer;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
    }
    
    .control-group select {
        width: 100%;
        padding: 8px 12px;
        border-radius: 6px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        background: var(--bg-primary);
        color: var(--text-primary);
        font-size: 0.9rem;
    }
    
    .simulator-display {
        background: var(--bg-secondary);
        padding: 20px;
        border-radius: 8px;
    }
    
    .energy-diagram {
        margin-bottom: 20px;
        text-align: center;
    }
    
    .results-panel {
        background: var(--bg-primary);
        padding: 15px;
        border-radius: 6px;
    }
    
    .result-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        padding: 5px 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }
    
    .result-item span:first-child {
        color: var(--text-secondary);
    }
    
    .result-item span:last-child {
        color: var(--text-primary);
        font-weight: 600;
    }
    
    .reduce-animations * {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
    }
    
    @media screen and (max-width: 768px) {
        .photoelectric-simulator {
            grid-template-columns: 1fr;
            gap: 20px;
        }
        
        .comparison-grid {
            grid-template-columns: 1fr;
        }
        
        .modal-content {
            margin: 10px;
            max-height: 95vh;
        }
    }
`;

// Inserir estilos adicionais
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// =============================
// AUTO-INICIALIZAÇÃO
// =============================
document.addEventListener('DOMContentLoaded', () => {
    PhotoelectricApp.init();
});

// =============================
// FUNCIONALIDADES EXTRAS
// =============================

// Preloader personalizado
class PreLoader {
    constructor() {
        this.createPreloader();
        this.init();
    }
    
    createPreloader() {
        const preloader = document.createElement('div');
        preloader.id = 'preloader';
        preloader.innerHTML = `
            <div class="preloader-content">
                <div class="atom-loader">
                    <div class="electron-orbit orbit-1">
                        <div class="electron"></div>
                    </div>
                    <div class="electron-orbit orbit-2">
                        <div class="electron"></div>
                    </div>
                    <div class="electron-orbit orbit-3">
                        <div class="electron"></div>
                    </div>
                    <div class="nucleus"></div>
                </div>
                <h2>Mark II</h2>
                <p>Carregando experimento...</p>
                <div class="progress-bar">
                    <div class="progress-fill"></div>
                </div>
            </div>
        `;
        
        const preloaderStyles = `
            #preloader {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: linear-gradient(135deg, #000000, #1a1a2e, #16213e);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10002;
                transition: opacity 0.5s ease;
            }
            
            .preloader-content {
                text-align: center;
                color: white;
            }
            
            .atom-loader {
                position: relative;
                width: 100px;
                height: 100px;
                margin: 0 auto 30px;
            }
            
            .electron-orbit {
                position: absolute;
                border: 2px solid rgba(33, 150, 243, 0.3);
                border-radius: 50%;
                animation: rotate 2s linear infinite;
            }
            
            .orbit-1 {
                width: 100px;
                height: 100px;
                top: 0;
                left: 0;
                animation-duration: 1.5s;
            }
            
            .orbit-2 {
                width: 70px;
                height: 70px;
                top: 15px;
                left: 15px;
                animation-duration: 2s;
                transform: rotateX(60deg);
            }
            
            .orbit-3 {
                width: 40px;
                height: 40px;
                top: 30px;
                left: 30px;
                animation-duration: 1s;
                transform: rotateY(60deg);
            }
            
            .electron {
                position: absolute;
                width: 8px;
                height: 8px;
                background: var(--primary-color);
                border-radius: 50%;
                top: -4px;
                left: 50%;
                transform: translateX(-50%);
                box-shadow: 0 0 10px var(--primary-color);
            }
            
            .nucleus {
                position: absolute;
                width: 16px;
                height: 16px;
                background: var(--secondary-color);
                border-radius: 50%;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                box-shadow: 0 0 15px var(--secondary-color);
            }
            
            .preloader-content h2 {
                font-size: 2.5rem;
                margin-bottom: 10px;
                background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }
            
            .preloader-content p {
                color: var(--text-secondary);
                margin-bottom: 30px;
            }
            
            .progress-bar {
                width: 200px;
                height: 4px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 2px;
                margin: 0 auto;
                overflow: hidden;
            }
            
            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
                border-radius: 2px;
                animation: fillProgress 3s ease-out forwards;
            }
            
            @keyframes rotate {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            
            @keyframes fillProgress {
                from { width: 0%; }
                to { width: 100%; }
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = preloaderStyles;
        document.head.appendChild(styleSheet);
        
        document.body.insertBefore(preloader, document.body.firstChild);
    }
    
    init() {
        // Simular carregamento
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                setTimeout(() => this.hidePreloader(), 500);
            }
        }, 200);
    }
    
    hidePreloader() {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => preloader.remove(), 500);
        }
    }
}

// Inicializar preloader
if (document.readyState === 'loading') {
    new PreLoader();
}

// =============================
// EASTER EGGS E INTERAÇÕES ESPECIAIS
// =============================
class EasterEggs {
    constructor() {
        this.konamiCode = [
            'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
            'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
            'KeyB', 'KeyA'
        ];
        this.konamiIndex = 0;
        this.setupKonamiCode();
        this.setupSecretClicks();
    }
    
    setupKonamiCode() {
        document.addEventListener('keydown', (e) => {
            if (e.code === this.konamiCode[this.konamiIndex]) {
                this.konamiIndex++;
                if (this.konamiIndex === this.konamiCode.length) {
                    this.activateQuantumMode();
                    this.konamiIndex = 0;
                }
            } else {
                this.konamiIndex = 0;
            }
        });
    }
    
    setupSecretClicks() {
        let clickCount = 0;
        const title = document.querySelector('.hero-title');
        
        if (title) {
            title.addEventListener('click', () => {
                clickCount++;
                if (clickCount === 7) {
                    this.showSecretMessage();
                    clickCount = 0;
                }
            });
        }
    }
    
    activateQuantumMode() {
        document.body.classList.add('quantum-mode');
        
        const quantumStyles = `
            .quantum-mode {
                animation: quantumFlicker 0.1s infinite alternate;
            }
            
            .quantum-mode .led-circle {
                animation: quantumGlow 1s ease-in-out infinite alternate;
            }
            
            .quantum-mode .hero-particles .particle {
                animation: quantumFloat 2s ease-in-out infinite;
                background: radial-gradient(circle, #ff00ff, #00ffff, #ffff00) !important;
            }
            
            @keyframes quantumFlicker {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }
            
            @keyframes quantumGlow {
                0% { box-shadow: 0 0 5px currentColor; }
                100% { box-shadow: 0 0 25px currentColor, 0 0 50px currentColor; }
            }
            
            @keyframes quantumFloat {
                0%, 100% { transform: translateY(0) rotate(0deg) scale(1); }
                25% { transform: translateY(-20px) rotate(90deg) scale(1.2); }
                50% { transform: translateY(-10px) rotate(180deg) scale(0.8); }
                75% { transform: translateY(-30px) rotate(270deg) scale(1.5); }
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = quantumStyles;
        document.head.appendChild(styleSheet);
        
        // Notificação
        this.showNotification('🚀 Modo Quântico Ativado!', 'Você descobriu o segredo dos fótons!');
        
        // Desativar após 10 segundos
        setTimeout(() => {
            document.body.classList.remove('quantum-mode');
        }, 10000);
    }
    
    showSecretMessage() {
        this.showNotification('🔬 Físico Curioso!', 'Einstein ficaria orgulhoso da sua persistência!');
    }
    
    showNotification(title, message) {
        const notification = document.createElement('div');
        notification.className = 'easter-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <h4>${title}</h4>
                <p>${message}</p>
            </div>
        `;
        
        const notificationStyles = `
            .easter-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
                color: white;
                padding: 20px;
                border-radius: 12px;
                box-shadow: var(--shadow-large);
                z-index: 10003;
                animation: slideInNotification 0.5s ease-out;
            }
            
            .notification-content h4 {
                margin-bottom: 8px;
                font-size: 1.1rem;
            }
            
            .notification-content p {
                margin: 0;
                font-size: 0.9rem;
                opacity: 0.9;
            }
            
            @keyframes slideInNotification {
                from {
                    opacity: 0;
                    transform: translateX(100%);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
        `;
        
        if (!document.querySelector('#notification-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'notification-styles';
            styleSheet.textContent = notificationStyles;
            document.head.appendChild(styleSheet);
        }
        
        document.body.appendChild(notification);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideInNotification 0.5s ease-out reverse';
            setTimeout(() => notification.remove(), 500);
        }, 5000);
    }
}

// Inicializar Easter Eggs
document.addEventListener('DOMContentLoaded', () => {
    new EasterEggs();
});

// =============================
// EXPORTAÇÃO E CLEANUP
// =============================
window.PhotoelectricApp = PhotoelectricApp;

// Cleanup ao descarregar a página
window.addEventListener('beforeunload', () => {
    // Limpar intervals e timeouts se houver
    const highFreqElements = document.querySelectorAll('[data-interval]');
    highFreqElements.forEach(el => {
        const intervalId = el.dataset.interval;
        if (intervalId) clearInterval(parseInt(intervalId));
    });
});

console.log('🚀 Mark II - Efeito Fotoelétrico carregado com sucesso!');
console.log('💡 Dica: Tente clicar 7 vezes no título ou use o código Konami para surpresas!');