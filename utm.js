function getUTMParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const utmParams = {};
    
    // Lista de parâmetros UTM para capturar
    const utmTags = [
        'utm_source',
        'utm_medium',
        'utm_campaign',
        'utm_term',
        'utm_content'
    ];
    
    // Primeiro, tenta obter os parâmetros UTM da URL atual
    utmTags.forEach(tag => {
        const value = urlParams.get(tag);
        if (value) {
            utmParams[tag] = value;
            console.log(`UTM Capturado da URL: ${tag} = ${value}`); // Log para debug
        }
    });
    
    // Se não encontrou na URL, tenta obter do sessionStorage
    if (Object.keys(utmParams).length === 0) {
        utmTags.forEach(tag => {
            const value = sessionStorage.getItem(tag);
            if (value) {
                utmParams[tag] = value;
                console.log(`UTM Recuperado do sessionStorage: ${tag} = ${value}`); // Log para debug
            }
        });
    }
    
    return utmParams;
}

function appendUTMToUrl(url) {
    const utmParams = getUTMParameters();
    const urlObj = new URL(url, window.location.href);
    
    // Adiciona os parâmetros UTM à URL
    Object.entries(utmParams).forEach(([key, value]) => {
        urlObj.searchParams.set(key, value);
        console.log(`UTM Adicionado à URL: ${key} = ${value}`); // Log para debug
    });
    
    console.log('URL Final:', urlObj.href); // Log para debug
    return urlObj.href;
}

function utmify() {
    console.log('Utmify iniciado - Procurando links...'); // Log para debug
    // Captura todos os links da página
    const links = document.querySelectorAll('a');
    console.log(`Encontrados ${links.length} links`); // Log para debug
    
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
            const novaUrl = appendUTMToUrl(href);
            link.setAttribute('href', novaUrl);
            console.log(`Link atualizado: ${href} -> ${novaUrl}`); // Log para debug
        }
    });
}

// Executa quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', utmify);

// Função para redirecionar mantendo os parâmetros UTM
function redirectWithUTM(url) {
    console.log('Redirecionando para:', url); // Log para debug
    
    // Obtém a URL com os parâmetros UTM
    const urlWithUTM = appendUTMToUrl(url);
    
    // Armazena os parâmetros UTM no sessionStorage antes de redirecionar
    const utmParams = getUTMParameters();
    Object.entries(utmParams).forEach(([key, value]) => {
        sessionStorage.setItem(key, value);
        console.log(`UTM Armazenado no sessionStorage: ${key} = ${value}`); // Log para debug
    });
    
    // Redireciona para a URL com os parâmetros UTM
    window.location.href = urlWithUTM;
} 