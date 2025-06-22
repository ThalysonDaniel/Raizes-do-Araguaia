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
            // Sistema de filtros de documentos
        document.addEventListener('DOMContentLoaded', function() {
            // Selecionar elementos
            const filterButtons = document.querySelectorAll('.filter-btn');
            const documents = document.querySelectorAll('.document');
            const categories = document.querySelectorAll('.category');
            const downloadLinks = document.querySelectorAll('.download-link');
            const downloadModal = document.getElementById('downloadModal');
            const closeModal = document.getElementById('closeModal');
            const cancelBtn = document.getElementById('cancelBtn');
            const downloadBtn = document.getElementById('downloadBtn');
            const modalTitle = document.getElementById('modalTitle');
            const modalDescription = document.getElementById('modalDescription');
            const downloadProgress = document.getElementById('downloadProgress');
            
            // Variável para controlar o download
            let currentDownload = null;
            let downloadTimer = null;
            
            // Função para filtrar documentos
            function filterDocuments(filter) {
                // Atualizar botões ativos
                filterButtons.forEach(btn => {
                    btn.classList.remove('active');
                    if (btn.getAttribute('data-filter') === filter) {
                        btn.classList.add('active');
                    }
                });
                
                // Filtrar documentos
                documents.forEach(doc => {
                    const docType = doc.getAttribute('data-type');
                    
                    if (filter === 'todos' || docType === filter) {
                        doc.style.display = 'block';
                        doc.parentElement.style.display = 'block';
                    } else {
                        doc.style.display = 'none';
                        
                        // Verificar se toda a categoria deve ser escondida
                        const category = doc.closest('.category');
                        const visibleDocs = category.querySelectorAll('.document[style*="display: block"]');
                        if (visibleDocs.length === 0) {
                            category.style.display = 'none';
                        }
                    }
                });
                
                // Garantir que as categorias com documentos visíveis sejam mostradas
                categories.forEach(category => {
                    const visibleDocs = category.querySelectorAll('.document[style*="display: block"]');
                    if (visibleDocs.length > 0) {
                        category.style.display = 'block';
                    }
                });
            }
            
            // Adicionar eventos aos botões de filtro
            filterButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const filter = button.getAttribute('data-filter');
                    filterDocuments(filter);
                });
            });
            
            // Função para simular download
            function simulateDownload(title, filename) {
                // Atualizar o modal
                modalTitle.textContent = `Baixando: ${title}`;
                modalDescription.textContent = `Preparando "${filename}" para download...`;
                downloadBtn.style.display = 'none';
                
                // Mostrar o modal
                downloadModal.classList.add('active');
                
                // Simular progresso de download
                let progress = 0;
                downloadProgress.style.width = '0%';
                
                downloadTimer = setInterval(() => {
                    progress += Math.floor(Math.random() * 10) + 5;
                    if (progress >= 100) {
                        progress = 100;
                        clearInterval(downloadTimer);
                        
                        // Mostrar botão de download
                        modalDescription.textContent = `"${filename}" está pronto para download!`;
                        downloadBtn.style.display = 'block';
                        
                        // Configurar o download real
                        downloadBtn.onclick = function() {

                            const blob = new Blob([`Conteúdo simulado de ${filename}`], {type: 'application/pdf'});
                            const url = URL.createObjectURL(blob);
                            
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = filename;
                            document.body.appendChild(a);
                            a.click();
                            
                            // Limpar
                            setTimeout(() => {
                                document.body.removeChild(a);
                                URL.revokeObjectURL(url);
                                downloadModal.classList.remove('active');
                            }, 100);
                        };
                    }
                    downloadProgress.style.width = `${progress}%`;
                }, 200);
            }
            
            // Adicionar eventos aos links de download
            downloadLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    const title = this.getAttribute('data-title');
                    const filename = this.getAttribute('data-filename');
                    
                    currentDownload = {
                        title: title,
                        filename: filename
                    };
                    
                    simulateDownload(title, filename);
                });
            });
            
            // Fechar o modal
            closeModal.addEventListener('click', () => {
                downloadModal.classList.remove('active');
                if (downloadTimer) clearInterval(downloadTimer);
            });
            
            cancelBtn.addEventListener('click', () => {
                downloadModal.classList.remove('active');
                if (downloadTimer) clearInterval(downloadTimer);
            });
            
            // Fechar modal ao clicar fora do conteúdo
            downloadModal.addEventListener('click', (e) => {
                if (e.target === downloadModal) {
                    downloadModal.classList.remove('active');
                    if (downloadTimer) clearInterval(downloadTimer);
                }
            });
            
            // Sistema de animações ao rolar
            const animateElements = document.querySelectorAll('.animate-in');
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('appear');
                    }
                });
            }, { threshold: 0.1 });
            
            animateElements.forEach(element => {
                observer.observe(element);
            });
            
            // Verificar elementos já visíveis
            animateElements.forEach(element => {
                const rect = element.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom >= 0) {
                    element.classList.add('appear');
                }
            });
            
            // Transições entre páginas
            const pageTransition = document.getElementById('pageTransition');
            const links = document.querySelectorAll('a[href]:not([target="_blank"]):not([href^="#"])');
            
            links.forEach(link => {
                link.addEventListener('click', function(e) {
                    if (this.href && this.href !== '#' && !this.classList.contains('download-link')) {
                        e.preventDefault();
                        pageTransition.style.transform = 'translateY(0)';
                        
                        setTimeout(() => {
                            window.location.href = this.href;
                        }, 400);
                    }
                });
            });
        });