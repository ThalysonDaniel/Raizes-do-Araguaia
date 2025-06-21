// animation.js - Sistema de Animações para o Site

// Classe principal do sistema de animação
class AnimationSystem {
    constructor() {
        this.observer = null;
        this.pageTransition = null;
        this.init();
    }
    
    init() {
        // Criar elemento de transição de página se não existir
        this.createPageTransition();
        
        // Configurar animações de entrada
        this.setupEntryAnimations();
        
        // Configurar transições de página
        this.setupPageTransitions();
        
        // Configurar animações ao rolar
        this.setupScrollAnimations();
    }
    
    createPageTransition() {
        // Verificar se o elemento já existe
        if (!document.getElementById('pageTransition')) {
            this.pageTransition = document.createElement('div');
            this.pageTransition.id = 'pageTransition';
            this.pageTransition.className = 'page-transition';
            document.body.prepend(this.pageTransition);
        } else {
            this.pageTransition = document.getElementById('pageTransition');
        }
    }
    
    setupEntryAnimations() {
        // Animação de fade-in para o body
        document.body.style.opacity = '0';
        document.body.style.animation = 'fadeIn 0.8s ease-out forwards';
        
        // Animação para elementos específicos do header
        this.animateHeaderElements();
    }
    
    animateHeaderElements() {
        const headerImg = document.querySelector('.header-img');
        const h1 = document.querySelector('h1');
        const navButtons = document.querySelectorAll('nav a button');
        
        if (headerImg) {
            headerImg.style.opacity = '0';
            headerImg.style.animation = 'slideInFromBottom 0.8s ease-out 0.3s forwards';
        }
        
        if (h1) {
            h1.style.opacity = '0';
            h1.style.animation = 'slideInFromBottom 0.8s ease-out 0.1s forwards';
        }
        
        navButtons.forEach((button, index) => {
            button.style.opacity = '0';
            button.style.animation = `slideInFromBottom 0.8s ease-out ${0.5 + index * 0.1}s forwards`;
        });
    }
    
    setupScrollAnimations() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('appear');
                }
            });
        }, options);
        
        // Observar todos os elementos com classes de animação
        document.querySelectorAll('.fade-in').forEach(element => {
            this.observer.observe(element);
        });
    }
    
    setupPageTransitions() {
        const links = document.querySelectorAll('a');
        links.forEach(link => {
            // Ignorar links que abrem em nova aba
            if (link.target === '_blank') return;
            
            // Ignorar links para âncoras na mesma página
            if (link.href.includes('#')) return;
            
            link.addEventListener('click', (e) => {
                // Impedir comportamento padrão
                e.preventDefault();
                
                // Animação de saída
                this.pageTransition.style.transform = 'translateY(0)';
                
                // Aguardar animação terminar e navegar
                setTimeout(() => {
                    window.location.href = link.href;
                }, 500);
            });
        });
    }
    
    resetAnimations() {
        // Remover classes de animação
        const animatedElements = document.querySelectorAll('.fade-in');
        animatedElements.forEach(el => {
            el.classList.remove('appear');
            
            // Reaplicar classe de direção baseada no tipo
            if (el.classList.contains('slide-in-left')) {
                el.classList.add('slide-in-left');
            } else if (el.classList.contains('slide-in-right')) {
                el.classList.add('slide-in-right');
            } else if (el.classList.contains('slide-in-bottom')) {
                el.classList.add('slide-in-bottom');
            }
        });
        
        // Aguardar reflow e observar novamente
        setTimeout(() => {
            animatedElements.forEach(el => {
                this.observer.observe(el);
            });
        }, 50);
    }
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    const animSystem = new AnimationSystem();
    
});