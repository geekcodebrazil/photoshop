
// --- script.js (para index.html) ---
document.addEventListener('DOMContentLoaded', () => {
    console.log('--- DOMContentLoaded INICIOU (v4.4.9 - Tema Escuro Aplicado) ---');

    // --- Elementos do DOM ---
    const imageLoader = document.getElementById('imageLoader');
    const imagePreview = document.getElementById('imagePreview');
    const imageCanvas = document.getElementById('imageCanvas');
    const tempCanvas = document.getElementById('tempCanvas');
    const editingControls = document.getElementById('editingControls');
    const canvasArea = document.querySelector('.canvas-area'); // Referência à área visível/scrollável
    const cropOverlay = document.getElementById('cropOverlay');
    const imageOverlayLoader = document.getElementById('imageOverlayLoader');
    const createBlankCanvasBtn = document.getElementById('createBlankCanvasBtn');

    // Verificação essencial
    if (!imageLoader || !imageCanvas || !tempCanvas || !canvasArea || !cropOverlay || !createBlankCanvasBtn) {
        console.error('!!! ERRO CRÍTICO: Um ou mais elementos essenciais do DOM não foram encontrados.');
        alert("Erro crítico na inicialização do editor. Verifique o console para detalhes.");
        return;
    }

    let ctx, tempCtx;
    try {
        // willReadFrequently é importante para operações como getImageData (conta-gotas, corte)
        ctx = imageCanvas.getContext('2d', { willReadFrequently: true, alpha: true });
        tempCtx = tempCanvas.getContext('2d', { willReadFrequently: false, alpha: true }); // Temp canvas não precisa ler frequentemente
    } catch (e) {
        console.error("!!! ERRO CRÍTICO: Não foi possível obter o contexto 2D do canvas.", e);
        alert("Erro ao inicializar o canvas. Seu navegador pode não suportar esta funcionalidade.");
        return;
    }

    // --- Botões ---
    const rotateLeftBtn = document.getElementById('rotateLeft'); const rotateRightBtn = document.getElementById('rotateRight');
    const flipHorizontalBtn = document.getElementById('flipHorizontal'); const flipVerticalBtn = document.getElementById('flipVertical');
    const cropBtn = document.getElementById('cropBtn'); const confirmCropBtn = document.getElementById('confirmCropBtn'); const cancelCropBtn = document.getElementById('cancelCropBtn');
    const resizeBtn = document.getElementById('resizeBtn'); const downloadBtn = document.getElementById('downloadBtn');
    const resetAllBtn = document.getElementById('resetAllBtn'); const addEmojiBtn = document.getElementById('addEmojiBtn');
    const addTextBtn = document.getElementById('addTextBtn'); const undoBtn = document.getElementById('undoBtn'); const redoBtn = document.getElementById('redoBtn');
    const deleteLayerBtn = document.getElementById('deleteLayerBtn');

    // --- Controles de Ferramentas ---
    const eyedropperBtn = document.getElementById('eyedropperBtn');
    const eyedropperResultContainer = document.getElementById('eyedropperResultContainer');
    const eyedropperPreview = document.getElementById('eyedropperPreview');
    const eyedropperColorCode = document.getElementById('eyedropperColorCode');
    const copyColorBtn = document.getElementById('copyColorBtn');
    const selectToolBtn = document.getElementById('selectToolBtn');
    const penToolBtn = document.getElementById('penToolBtn');
    const lineToolBtn = document.getElementById('lineToolBtn');
    const arrowToolBtn = document.getElementById('arrowToolBtn');
    const rectToolBtn = document.getElementById('rectToolBtn');
    const circleToolBtn = document.getElementById('circleToolBtn');
    const eraserToolBtn = document.getElementById('eraserToolBtn');
    const shapeColorPicker = document.getElementById('shapeColorPicker');
    const lineWidthSlider = document.getElementById('lineWidthSlider');
    const lineWidthValueSpan = document.getElementById('lineWidthValue');
    const lineWidthLabel = document.getElementById('lineWidthLabel');
    const fillShapeCheckbox = document.getElementById('fillShapeCheckbox');
    const fillShapeCheckboxContainer = document.getElementById('fillShapeCheckboxContainer');

    // --- Inputs & Selects ---
    const brightnessSlider = document.getElementById('brightness'); const contrastSlider = document.getElementById('contrast');
    const mainOpacitySlider = document.getElementById('mainOpacity');
    const mainScaleSlider = document.getElementById('mainScaleSlider');
    const overlayOpacitySlider = document.getElementById('overlayOpacity');
    const qualitySlider = document.getElementById('quality'); const widthInput = document.getElementById('widthInput');
    const heightInput = document.getElementById('heightInput'); const aspectRatioCheckbox = document.getElementById('aspectRatio');
    const downloadFormatSelect = document.getElementById('downloadFormatSelect');
    const filterSelect = document.getElementById('filterSelect');

    // --- Spans e Labels para Valores ---
    const brightnessValueSpan = document.getElementById('brightnessValue'); const contrastValueSpan = document.getElementById('contrastValue');
    const mainOpacityValueSpan = document.getElementById('mainOpacityValue');
    const mainScaleValueSpan = document.getElementById('mainScaleValue');
    const overlayOpacityValueSpan = document.getElementById('overlayOpacityValue');
    const overlayOpacityLabel = document.getElementById('overlayOpacityLabel');
    const qualityValueSpan = document.getElementById('qualityValue'); const fileSizeEstimateSpan = document.getElementById('fileSizeEstimate');
    const qualityLabel = document.getElementById('qualityLabel');

    // --- Elementos do Modal ---
    const emojiModalBackdrop = document.getElementById('emojiModalBackdrop'); const emojiModal = document.getElementById('emojiModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn'); const emojiGrid = document.getElementById('emojiGrid');

    // --- Constantes ---
    const HANDLE_SIZE = 10; const ROTATION_HANDLE_OFFSET = 25; const MAX_HISTORY_SIZE = 30;
    const ARROW_HEAD_LENGTH = 15; const ARROW_HEAD_ANGLE = Math.PI / 6; // Aprox 30 graus

    // --- LISTA DE EMOJIS ---
    // (Mesma lista gigante de antes - mantida por brevidade na resposta, mas está aqui)
    const EMOJI_LIST = [ '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '😎', '🤓', '🧐', '😕', '😟', '🙁', '😮', '😯', '😲', '😳', '🥺', '😦', '😧', '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣', '😞', '😓', '😩', '😫', '🥱', '😤', '😡', '😠', '🤬', '😈', '👿', '💀', '💩', '🤡', '👹', '👺', '👻', '👽', '👾', '🤖', '👋', '🤚', '🖐', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🙏', '🤝', '💅', '🤳', '⭐', '💬', '❤️', '←', '→', '↑', '↓', '↔', '↕', '↖', '↗', '↘', '↙', '↩', '↪', '⤿', '⤾', '➔', '➘', '➙', '➚', '★', '☆', '⚫', '⚪', '■', '□', '▲', '△', '▼', '▽', '◆', '◇', '●', '○', '◼️', '◻️', '▪️', '▫️', '±', '×', '÷', '√', '∞', '≈', '≠', '≤', '≥', '∑', '∫', '∆', 'Ω', 'µ', 'π', '°', '′', '″', '©', '®', '™', '§', '¶', '•', '…', '†', '‡', '‰', '‱', '‹', '›', '«', '»', '„', '‟', '€', '$', '£', '¥', '₹', '₽', '¢', '¤', '♠', '♡', '♢', '♣', '♤', '♥', '♦', '♧', '♪', '♫', '♭', '♯', '♮', '✔️', '✅', '❌', '❎', '❓', '❔', '❗', '❕', '⚠️', '➕', '➖', '➗', '✖️', '💯', '☮️', '✝️', '☪️', '🕉️', '☸️', '✡️', '☯️', '☦️', '⚛️', '⚜️', '♿', '⚓', '⚡', '⚙️', '⚖️', '🔗', '💡', '🔑', '🔒', '🔓', '🔔', '🔊', '🔇', '⏳', '⏰', '⊕', '⊖', '⊗', '⊘', '⏪', '⏫', '↙️', '⛔', '🚫', '💯', '🚭', '🔞', '🚱', '🚳', '⚠️', '✳️', '❎', '💤', '0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', '🔢', '#️⃣', '⏮️', '⏩', '⏪', '⏫', '⏬', '◀️', '🔼', '⏸️', '⏯️', '🔽', '➡️', '⏹️', '⏺️', '⬅️', '⬆️', '⏭️', '⤵️', '⤴️', '↩️', '↪️', '↔️', '↕️', '↖️', '↙️', '↘️', '↗️', '⬇️', '🔟', '🆓', '🚺', '🚹', '🛜', '♿', '♻️', '©️', '®️', '♠️', '♣️', '♥️', '♦️', '🇧🇷', '🚩', '🇨🇦', '🇺🇸', '🇬🇧', '🇺🇾', '🕒', '💔', '❤️‍🩹', '💞', '💓', '🔒', '🔓', '🧷', '📬', '⏳', '☎️', '📟', '📷', '🖥️', '💾', '📀', '🕹️', '🖱️', '🚑', '🚓', '🏎️', '🚎', '🚜', '🚚', '🛵', '🚲', '🛴' ];


    // --- PRESETS DE FILTROS ---
    // (Mesma lista - mantida por brevidade)
    const filterPresets = { none: '', grayscale: 'grayscale(1)', clarendon: 'contrast(1.2) saturate(1.35) brightness(1.05)', gingham: 'brightness(1.05) contrast(0.9) saturate(0.85) sepia(0.05) hue-rotate(-5deg)', moon: 'grayscale(1) contrast(1.1) brightness(1.1)', lark: 'contrast(0.9) brightness(1.1) saturate(1.2) sepia(0.1)', reyes: 'sepia(0.4) contrast(0.85) brightness(1.1) saturate(0.75)', juno: 'contrast(1.1) brightness(1.05) saturate(1.4) sepia(0.2) hue-rotate(-10deg)', slumber: 'saturate(0.6) brightness(1.05) contrast(0.9) sepia(0.1)', crema: 'sepia(0.25) contrast(0.95) brightness(1.15) saturate(0.9)', ludwig: 'brightness(1.1) saturate(0.8) contrast(1.1) sepia(0.15)', aden: 'hue-rotate(-20deg) contrast(0.9) saturate(0.85) brightness(1.2) sepia(0.1)' };


    // --- Variáveis de Estado ---
    let originalImage = null; // Guarda a imagem carregada original
    let imageState = {
        // Ajustes da imagem principal
        brightness: 100,
        contrast: 100,
        mainOpacity: 1,    // Opacidade da imagem base (0 a 1)
        mainScale: 1,      // Zoom visual da imagem base (sem afetar dimensões reais)
        // Transformações da imagem principal
        rotation: 0,       // Graus de rotação
        scaleX: 1,         // Espelhamento horizontal (-1 para espelhado)
        scaleY: 1,         // Espelhamento vertical (-1 para espelhado)
        filter: 'none',    // Filtro aplicado (nome da chave em filterPresets)
        // Camadas (Formas, Texto, Imagens sobrepostas)
        shapes: [],        // Array de objetos representando cada camada
        // Estado do download
        downloadFormat: 'jpeg',
        quality: 0.9,      // Qualidade para JPEG/WEBP (0 a 1)
        // Padrões para novas formas/ferramentas
        currentShapeDefaults: {
            color: '#ff79c6', // Rosa Neon como padrão
            lineWidth: 5,
            fill: false
        }
    };
    let isMouseDrawing = false; // Flag: o mouse está pressionado sobre o canvas?
    let isCropping = false;     // Flag: estamos no modo de seleção de corte?
    let cropStartX, cropStartY, cropEndX, cropEndY; // Coordenadas para a área de corte
    let selectedShapeIndex = -1; // Índice da forma selecionada no array imageState.shapes (-1 = nenhuma)
    let draggingShape = false; // Flag: estamos arrastando a forma selecionada?
    let resizingShape = false; // Flag: estamos redimensionando a forma selecionada?
    let rotatingShape = false; // Flag: estamos rotacionando a forma selecionada?
    let dragOffsetX, dragOffsetY; // Diferença entre o clique e o ponto (x,y) da forma arrastada
    let lastX, lastY; // Última posição conhecida do mouse sobre o canvas
    let isDraggingCanvas = false; // Flag: estamos arrastando o fundo/canvas (pan)?
    let isApplyingHistory = false; // Flag: para evitar salvar estado enquanto carrega um estado anterior
    let fileSizeCalculationTimeout = null; // Timer para debounce do cálculo de tamanho
    let imageOverlayCache = {}; // Cache para imagens sobrepostas carregadas
    let currentDrawingMode = 'select'; // Modo atual ('select', 'pen', 'line', 'rect', 'circle', 'arrow', 'eraser', 'crop', 'eyedropper')
    let isEyedropperActive = false; // Flag: conta-gotas está ativo?
    let isDrawingNewShape = false; // Flag: estamos desenhando uma nova forma geométrica?
    let isDrawingPenStroke = false; // Flag: estamos desenhando um traço à mão livre?
    let drawingStartX, drawingStartY; // Ponto inicial para desenho de forma/linha/caneta
    let currentPenStroke = []; // Pontos do traço de caneta atual
    let isErasing = false; // Flag: modo borracha ativo e mouse pressionado?

    // --- Variáveis do Histórico ---
    let history = [];        // Array para armazenar os estados (snapshots)
    let historyIndex = -1;   // Índice do estado atual no array de histórico

    // --- Inicialização Visual ---
    if (emojiModal) emojiModal.style.display = 'none';
    if (emojiModalBackdrop) emojiModalBackdrop.style.display = 'none';
    deleteLayerBtn.disabled = true;
    eyedropperResultContainer.style.display = 'none';

    // --- Funções Utilitárias ---

    /**
     * Cria uma cópia profunda de um objeto usando JSON.
     * @param {object} obj - O objeto a ser copiado.
     * @returns {object | null} Uma cópia profunda do objeto ou null em caso de erro.
     */
    function deepCopy(obj) {
        try {
            return JSON.parse(JSON.stringify(obj));
        } catch (e) {
            console.error("Erro no deep copy:", e);
            return null;
        }
    }

    /**
     * Cria uma função debounced (atrasa a execução até parar de ser chamada por um tempo).
     * @param {function} func - A função a ser debounced.
     * @param {number} wait - O tempo de espera em milissegundos.
     * @returns {function} A função debounced.
     */
    function debounce(func, wait) {
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

     /**
      * Formata bytes em KB, MB, GB etc.
      * @param {number} bytes - Número de bytes.
      * @param {number} [decimals=1] - Número de casas decimais.
      * @returns {string} String formatada (ex: "1.2 MB").
      */
     function formatBytes(bytes, decimals = 1) {
        if (!+bytes || bytes < 0) return '0 Bytes'; // Trata 0, NaN, undefined e negativos
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        // Garante que o índice não exceda o tamanho do array 'sizes'
        const i = Math.max(0, Math.floor(Math.log(bytes) / Math.log(k)));
        const eff_i = Math.min(i, sizes.length -1); // Índice efetivo dentro dos limites
        // Converte e formata o número
        const formattedNumber = parseFloat((bytes / Math.pow(k, eff_i)).toFixed(dm));
        return `${formattedNumber} ${sizes[eff_i]}`;
    }

    /**
     * Converte RGBA para Hex ou retorna 'Transparente'.
     * @param {number} r - Vermelho (0-255)
     * @param {number} g - Verde (0-255)
     * @param {number} b - Azul (0-255)
     * @param {number} [a=255] - Alfa (0-255)
     * @returns {string} Código Hex (#RRGGBB) ou "Transparente".
     */
    function rgbaToHex(r, g, b, a = 255) {
        if (a === 0) return "Transparente";
        // Converte para hex e garante 2 dígitos para cada componente
        const toHex = (c) => ('0' + c.toString(16)).slice(-2);
        const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
        return hex.toUpperCase();
    }

    // --- Funções do Histórico (Undo/Redo) ---

    /**
     * Salva o estado atual no histórico.
     * Chamada após ações significativas concluídas (ex: soltar mouse após arrastar).
     */
    function saveState() {
        // Não salva se estivermos carregando um estado, ou se não houver nada para salvar,
        // ou durante uma ação incompleta (arrastar, desenhar, etc.)
        if (isApplyingHistory || (!originalImage && imageState.shapes.length === 0 && !ctx?.canvas.width)) return;
        if (isDrawingNewShape || isDrawingPenStroke || isCropping || isErasing || isDraggingCanvas || draggingShape || resizingShape || rotatingShape || isMouseDrawing) return;

        console.log("Tentando salvar estado...");
        // Cria uma cópia profunda do estado atual
        const stateDataCopy = deepCopy(imageState);
        if (!stateDataCopy) {
            console.error("Falha ao criar cópia profunda do estado para histórico.");
            return; // Aborta se a cópia falhar
        }

        // Remove estados futuros se estivermos 'no meio' do histórico
        history = history.slice(0, historyIndex + 1);
        // Adiciona o novo estado
        history.push({ stateData: stateDataCopy });
        // Limita o tamanho do histórico
        if (history.length > MAX_HISTORY_SIZE) {
            history.shift(); // Remove o estado mais antigo
        } else {
            historyIndex++; // Avança o índice se não removemos
        }
        // Garante que o índice não ultrapasse o tamanho do array
        if (historyIndex >= history.length) {
             historyIndex = history.length - 1;
        }

        console.log(`Estado salvo. Histórico: ${history.length} itens, Índice: ${historyIndex}`);
        updateUndoRedoButtons(); // Atualiza a UI dos botões Desfazer/Refazer
        updateFileSizeEstimateDebounced(); // Atualiza estimativa de tamanho (debounced)
    }

    /**
     * Carrega um estado salvo do histórico.
     * @param {object} stateSnapshot - O snapshot do estado a ser carregado (do array `history`).
     */
    function loadState(stateSnapshot) {
        if (!stateSnapshot) return;
        console.log(`Carregando estado do índice ${historyIndex}`);
        isApplyingHistory = true; // Sinaliza que estamos carregando

        // Cria cópia profunda do estado a ser carregado
        const newStateData = deepCopy(stateSnapshot.stateData);
        if (!newStateData) {
             console.error("Falha ao copiar estado para carregamento.");
             isApplyingHistory = false;
             return;
        }

        // Atualiza imageState com os valores do estado carregado
        imageState.brightness = newStateData.brightness;
        imageState.contrast = newStateData.contrast;
        imageState.mainOpacity = newStateData.mainOpacity !== undefined ? newStateData.mainOpacity : 1;
        imageState.mainScale = newStateData.mainScale !== undefined ? newStateData.mainScale : 1;
        imageState.rotation = newStateData.rotation;
        imageState.scaleX = newStateData.scaleX;
        imageState.scaleY = newStateData.scaleY;
        imageState.shapes = newStateData.shapes || [];
        imageState.downloadFormat = newStateData.downloadFormat || 'jpeg';
        imageState.quality = newStateData.quality || 0.9;
        imageState.filter = newStateData.filter || 'none';
        // Recupera ou define padrões de forma
        if (newStateData.currentShapeDefaults) {
             imageState.currentShapeDefaults = newStateData.currentShapeDefaults;
        } else { // Fallback se não existia no estado salvo
             imageState.currentShapeDefaults = { color: '#ff79c6', lineWidth: 5, fill: false };
        }

        // Garante propriedades essenciais e carrega imagens de sobreposição se necessário
        imageState.shapes.forEach(shape => {
            if (shape.opacity === undefined) shape.opacity = 1; // Garante opacidade
            if (shape.type === 'pen' && !Array.isArray(shape.points)) shape.points = []; // Garante array de pontos
            if (shape.type === 'image' && shape.imgSrc && !imageOverlayCache[shape.imgSrc]) {
                 loadImageOverlayForDrawing(shape.imgSrc); // Carrega se não estiver no cache
            }
        });

        selectedShapeIndex = -1; // Desseleciona qualquer forma
        deactivateAllModes();    // Volta para o modo 'select'

        // Verifica se há imagem base ou canvas existente para redesenhar
        const hasBaseContent = originalImage || (imageCanvas && imageCanvas.width > 0 && imageCanvas.height > 0);
        if (hasBaseContent) {
            // Aplica o estado carregado à UI e ao canvas
             redrawCanvas();
             updateUIFromState();
             updateShapeControlsFromSelection(); // Atualiza controles de cor/linha/etc.
             updateUndoRedoButtons();
             centerCanvasView(); // Centraliza a visão do canvas
             updateFileSizeEstimate(); // Atualiza estimativa de tamanho
             deleteLayerBtn.disabled = true; // Botão deletar desabilitado (nada selecionado)
        } else {
             // Se não há imagem base, reseta tudo completamente
             resetAllStates(true);
        }

        isApplyingHistory = false; // Finaliza o processo de carregamento
        console.log("Estado carregado com sucesso.");
    }

    /** Atualiza o estado (habilitado/desabilitado) dos botões Desfazer/Refazer. */
    function updateUndoRedoButtons() {
        undoBtn.disabled = historyIndex <= 0; // Desabilita se estiver no início
        redoBtn.disabled = historyIndex >= history.length - 1; // Desabilita se estiver no fim
    }

    // Listeners para os botões Desfazer/Refazer
    undoBtn.addEventListener('click', () => {
        if (!undoBtn.disabled && historyIndex > 0) {
            historyIndex--;
            loadState(history[historyIndex]);
        }
    });
    redoBtn.addEventListener('click', () => {
        if (!redoBtn.disabled && historyIndex < history.length - 1) {
            historyIndex++;
            loadState(history[historyIndex]);
        }
    });


    // --- Funções de Interface e Estado (UI) ---

    /** Atualiza todos os controles da UI (sliders, selects, etc.) com base no `imageState` atual. */
    function updateUIFromState() {
        // Ajustes
        brightnessSlider.value = imageState.brightness; brightnessValueSpan.textContent = imageState.brightness;
        contrastSlider.value = imageState.contrast; contrastValueSpan.textContent = imageState.contrast;
        mainOpacitySlider.value = imageState.mainOpacity * 100; mainOpacityValueSpan.textContent = Math.round(imageState.mainOpacity * 100);
        mainScaleSlider.value = imageState.mainScale * 100; mainScaleValueSpan.textContent = Math.round(imageState.mainScale * 100);
        // Filtro
        filterSelect.value = imageState.filter;
        // Download
        downloadFormatSelect.value = imageState.downloadFormat;
        const showQualityControls = ['jpeg', 'webp'].includes(imageState.downloadFormat);
        qualitySlider.style.display = showQualityControls ? 'block' : 'none';
        qualityLabel.style.display = showQualityControls ? 'block' : 'none';
        fileSizeEstimateSpan.style.display = showQualityControls ? 'inline' : 'none'; // Span da estimativa
        qualitySlider.disabled = !showQualityControls;
        qualitySlider.value = imageState.quality * 100;
        qualityValueSpan.textContent = qualitySlider.value; // Span do valor da qualidade
        // Redimensionar
        widthInput.value = ''; heightInput.value = ''; // Limpa inputs
        updateUIPlaceholders(); // Define placeholders com dimensões atuais
        aspectRatioCheckbox.checked = true; // Default para manter proporção
        // Controles de Forma
        shapeColorPicker.value = imageState.currentShapeDefaults.color;
        lineWidthSlider.value = imageState.currentShapeDefaults.lineWidth;
        lineWidthValueSpan.textContent = imageState.currentShapeDefaults.lineWidth;
        fillShapeCheckbox.checked = imageState.currentShapeDefaults.fill;
        // Opacidade da Camada (atualizado separadamente pela seleção)
        updateOverlayOpacityUI();
        // Botão Deletar (habilitado apenas se houver seleção)
        deleteLayerBtn.disabled = selectedShapeIndex === -1;
        // Botão de ferramenta ativa
        updateActiveToolButton();
    }

    /** Define os placeholders dos inputs de Largura/Altura com base na imagem atual. */
    function updateUIPlaceholders() {
        let currentWidth = 0;
        let currentHeight = 0;

        if (originalImage && (originalImage.naturalWidth || originalImage.width) > 0) {
            currentWidth = originalImage.naturalWidth || originalImage.width;
            currentHeight = originalImage.naturalHeight || originalImage.height;
        } else if (imageCanvas && imageCanvas.width > 0 && imageCanvas.height > 0 && !originalImage) {
            // Caso seja uma tela em branco já definida
            currentWidth = imageCanvas.width;
            currentHeight = imageCanvas.height;
        }

        widthInput.placeholder = currentWidth > 0 ? currentWidth : 'Largura';
        heightInput.placeholder = currentHeight > 0 ? currentHeight : 'Altura';
        widthInput.value = ''; // Limpa valor após definir placeholder
        heightInput.value = '';
    }


    /** Atualiza o slider de opacidade da camada com base na seleção atual. */
    function updateOverlayOpacityUI() {
        const selectedShape = selectedShapeIndex !== -1 ? imageState.shapes[selectedShapeIndex] : null;

        if (selectedShape) { // Se uma forma está selecionada
            overlayOpacitySlider.disabled = false;
            overlayOpacityLabel.classList.remove('disabled'); // Ativa o estilo do label
            const currentOpacity = selectedShape.opacity !== undefined ? selectedShape.opacity : 1; // Pega opacidade atual ou 1 se indefinida
            overlayOpacitySlider.value = currentOpacity * 100;
            overlayOpacityValueSpan.textContent = Math.round(currentOpacity * 100);
        } else { // Nenhuma forma selecionada
            overlayOpacitySlider.disabled = true;
            overlayOpacityLabel.classList.add('disabled'); // Desativa o estilo do label
            overlayOpacitySlider.value = 100; // Reseta slider visualmente
            overlayOpacityValueSpan.textContent = 100;
        }
    }

    /** Atualiza os controles de cor, espessura e preenchimento com base na forma selecionada. */
    function updateShapeControlsFromSelection() {
        const selectedShape = selectedShapeIndex !== -1 ? imageState.shapes[selectedShapeIndex] : null;
        const isShapeOrText = selectedShape && ['text', 'emoji', 'line', 'rect', 'circle', 'arrow', 'pen'].includes(selectedShape.type);

        if (isShapeOrText) {
             // Cor: Habilitada e definida para a cor da forma/texto selecionado
             shapeColorPicker.value = selectedShape.color || imageState.currentShapeDefaults.color;
             shapeColorPicker.disabled = false;

             // Espessura: Habilitada apenas para formas que usam espessura
             const hasLineWidth = ['line', 'rect', 'circle', 'arrow', 'pen'].includes(selectedShape.type);
             lineWidthSlider.disabled = !hasLineWidth;
             lineWidthLabel.classList.toggle('disabled', !hasLineWidth);
             if (hasLineWidth) {
                  lineWidthSlider.value = selectedShape.thickness || imageState.currentShapeDefaults.lineWidth;
                  lineWidthValueSpan.textContent = lineWidthSlider.value;
             } else { // Reseta visualmente se não aplicável
                  lineWidthSlider.value = imageState.currentShapeDefaults.lineWidth;
                  lineWidthValueSpan.textContent = imageState.currentShapeDefaults.lineWidth;
             }

             // Preencher: Visível e habilitado apenas para Retângulo/Círculo
             const canFill = ['rect', 'circle'].includes(selectedShape.type);
             fillShapeCheckboxContainer.style.display = canFill ? 'inline-flex' : 'none';
             fillShapeCheckbox.disabled = !canFill;
             if (canFill) {
                  fillShapeCheckbox.checked = selectedShape.fill || false; // Define baseado na forma
             } else {
                  fillShapeCheckbox.checked = false; // Reseta se não aplicável
             }

        } else { // Nenhuma forma selecionada OU é uma imagem sobreposta
             // Reseta e desabilita todos os controles de forma
             shapeColorPicker.value = imageState.currentShapeDefaults.color;
             shapeColorPicker.disabled = true;
             lineWidthSlider.value = imageState.currentShapeDefaults.lineWidth;
             lineWidthValueSpan.textContent = imageState.currentShapeDefaults.lineWidth;
             lineWidthSlider.disabled = true;
             lineWidthLabel.classList.add('disabled');
             fillShapeCheckbox.checked = false;
             fillShapeCheckbox.disabled = true;
             fillShapeCheckboxContainer.style.display = 'none';
        }
        // Garante que a opacidade da camada seja atualizada corretamente
        updateOverlayOpacityUI();
    }


    // --- Carregamento e Desenho da Imagem Principal e Camadas ---

    /** Listener para carregar nova imagem principal via input file. */
    imageLoader.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file || !file.type.startsWith('image/')) {
            alert('Por favor, selecione um arquivo de imagem (JPG, PNG, WEBP).');
            imageLoader.value = ''; // Limpa o input
            return;
        };

        // Verifica se já existe conteúdo e pede confirmação
        const hasContent = originalImage || imageState.shapes.length > 0 || historyIndex > 0;
        if (hasContent) {
            if (!confirm("Isso descartará qualquer imagem ou edição não salva. Deseja carregar a nova imagem?")) {
                imageLoader.value = ''; // Limpa o input se o usuário cancelar
                return;
            }
        }

        // Limpa estado antes de carregar nova imagem
        originalImage = null;
        resetAllStates(false); // Reseta estado, mas mantém histórico/UI inicial

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                // Verifica se a imagem carregou corretamente
                if (img.naturalWidth === 0 || img.naturalHeight === 0) {
                    alert("A imagem parece estar vazia ou corrompida. Não foi possível carregar.");
                    resetAllStates(true); // Reseta tudo se a imagem for inválida
                    return;
                }
                originalImage = img; // Define a imagem carregada como original
                history = []; // Limpa histórico para a nova imagem
                historyIndex = -1;
                updateUndoRedoButtons();
                updateUIPlaceholders(); // Define placeholders de tamanho
                redrawCanvas(); // Desenha a imagem no canvas
                saveState(); // Salva o estado inicial com a imagem carregada

                // Mostra a pré-visualização
                try {
                    imagePreview.src = event.target.result; // Usa DataURL para preview
                    imagePreview.style.display = 'block';
                } catch (previewError) {
                    console.error("Erro ao definir src da pré-visualização:", previewError);
                    imagePreview.style.display = 'none';
                }
                editingControls.style.display = 'block'; // Mostra os controles de edição
                centerCanvasView(); // Centraliza o canvas na área visível
            };
            img.onerror = () => {
                alert("Erro ao carregar dados da imagem. O arquivo pode estar corrompido ou em formato não suportado internamente.");
                resetAllStates(true); // Reseta tudo se houver erro
            };
            img.src = event.target.result; // Define o source da imagem (DataURL)
        };
        reader.onerror = () => {
            alert("Erro ao ler o arquivo selecionado.");
            resetAllStates(true); // Reseta tudo se houver erro de leitura
        };
        reader.readAsDataURL(file); // Lê o arquivo como DataURL
        imageLoader.value = ''; // Limpa o input file após iniciar leitura
    });

    /**
     * Desenha a imagem principal no canvas, aplicando filtros e transformações do `imageState`.
     */
    function drawImageWithFiltersAndTransforms() {
        if (!originalImage || !ctx) return; // Só desenha se houver imagem e contexto

        const imgW = originalImage.naturalWidth || originalImage.width;
        const imgH = originalImage.naturalHeight || originalImage.height;
        if (imgW <= 0 || imgH <= 0) return; // Não desenha se dimensões inválidas

        // Calcula o tamanho do canvas necessário para acomodar a imagem rotacionada
        const rad = imageState.rotation * Math.PI / 180;
        const cos = Math.abs(Math.cos(rad));
        const sin = Math.abs(Math.sin(rad));
        const canvasWidth = Math.round(imgW * cos + imgH * sin);
        const canvasHeight = Math.round(imgW * sin + imgH * cos);

        // Redimensiona os canvas (principal e temporário) se necessário
        if (imageCanvas.width !== canvasWidth) imageCanvas.width = canvasWidth;
        if (imageCanvas.height !== canvasHeight) imageCanvas.height = canvasHeight;
        if (tempCanvas.width !== canvasWidth) tempCanvas.width = canvasWidth;
        if (tempCanvas.height !== canvasHeight) tempCanvas.height = canvasHeight;

        ctx.clearRect(0, 0, canvasWidth, canvasHeight); // Limpa antes de desenhar
        ctx.save(); // Salva estado atual (transformações, filtros, etc.)

        applyCanvasFilters(); // Aplica brilho, contraste e filtros CSS
        applyCanvasTransformations(imgW, imgH); // Aplica translação, rotação e escala

        // Aplica opacidade principal
        const originalAlpha = ctx.globalAlpha;
        ctx.globalAlpha = imageState.mainOpacity;

        try {
            // Desenha a imagem centralizada no canvas transformado
            ctx.drawImage(originalImage, -imgW / 2, -imgH / 2, imgW, imgH);
        } catch (e) {
            console.error("Erro ao desenhar imagem principal:", e);
            alert("Ocorreu um erro ao tentar desenhar a imagem principal. Tente recarregar.");
            // Considerar resetar ou tratar o erro de forma mais robusta
        }

        ctx.globalAlpha = originalAlpha; // Restaura opacidade original
        ctx.restore(); // Restaura estado do contexto salvo

        syncTempCanvasPosition(); // Garante que o canvas temp fique sobreposto corretamente
    }

    /**
     * Posiciona o canvas temporário exatamente sobre o canvas principal.
     * Necessário após scroll ou redimensionamento.
     */
    function syncTempCanvasPosition() {
        if (!imageCanvas || !tempCanvas || !canvasArea) return;

        tempCanvas.style.position = 'absolute';
        tempCanvas.style.left = `${imageCanvas.offsetLeft}px`;
        tempCanvas.style.top = `${imageCanvas.offsetTop}px`;

        // Garante que o tamanho do tempCanvas corresponda ao principal
        if (tempCanvas.width !== imageCanvas.width) tempCanvas.width = imageCanvas.width;
        if (tempCanvas.height !== imageCanvas.height) tempCanvas.height = imageCanvas.height;
    }


    /**
     * Desenha todas as formas (camadas) e os controles de seleção (se aplicável).
     */
    function drawShapesAndControls() {
        imageState.shapes.forEach((shape, index) => {
            if (!shape) return; // Pula se a forma for inválida

            ctx.save(); // Salva estado para esta forma específica

            // Aplica transformações da forma (posição, rotação, escala, opacidade)
            ctx.translate(shape.x, shape.y);
            ctx.rotate(shape.rotation); // Rotação em radianos
            const shapeOpacity = shape.opacity !== undefined ? shape.opacity : 1;
            const currentGlobalAlpha = ctx.globalAlpha; // Salva alpha global atual
            ctx.globalAlpha *= shapeOpacity; // Aplica opacidade da forma
            ctx.scale(shape.scale, shape.scale); // Aplica escala (assumindo uniforme por enquanto)

            // Desenha a forma específica baseada no tipo
            switch (shape.type) {
                case 'text':
                case 'emoji':
                    const fontSize = shape.baseSize || 30; // Tamanho base ou default
                    ctx.font = `${fontSize}px sans-serif`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = shape.color || '#e0e0ff'; // Cor ou padrão
                    ctx.fillText(shape.content, 0, 0); // Desenha no centro local (0,0)
                    break;
                case 'image':
                    const loadedImg = imageOverlayCache[shape.imgSrc];
                    if (loadedImg && loadedImg.complete && loadedImg.naturalWidth > 0) {
                        // Desenha a imagem sobreposta centralizada
                        const drawWidth = shape.originalWidth;
                        const drawHeight = shape.originalHeight;
                        ctx.drawImage(loadedImg, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
                    } else if (!loadedImg && shape.imgSrc) {
                         // Se a imagem ainda não carregou, tenta carregar e mostra placeholder
                         loadImageOverlayForDrawing(shape.imgSrc);
                         const phSize = Math.max(20, (shape.originalWidth || 50) * 0.5); // Placeholder size
                         // Desenha um placeholder simples (ex: caixa com '⏳')
                         ctx.fillStyle = `rgba(70, 70, 90, 0.7)`; // Placeholder background
                         ctx.strokeStyle = `rgba(150, 150, 180, 0.9)`; // Placeholder border
                         ctx.lineWidth = 1 / shape.scale; // Ajusta linha do placeholder à escala
                         ctx.strokeRect(-phSize / 2, -phSize / 2, phSize, phSize);
                         ctx.font = `${(phSize * 0.6).toFixed(1)}px sans-serif`;
                         ctx.fillStyle = `rgba(200, 200, 220, 1)`; // Placeholder text color
                         ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                         ctx.fillText('⏳', 0, 0);
                    }
                    break;
                case 'line':
                case 'arrow':
                    ctx.beginPath();
                    // Desenha linha relativa ao centro (x, y) da forma
                    ctx.moveTo(shape.startX, shape.startY);
                    ctx.lineTo(shape.endX, shape.endY);
                    ctx.lineWidth = shape.thickness;
                    ctx.strokeStyle = shape.color;
                    ctx.lineCap = 'round'; // Extremidades arredondadas
                    ctx.stroke();
                    // Desenha ponta da seta se for do tipo 'arrow'
                    if (shape.type === 'arrow') {
                         drawArrowHead(ctx, shape.startX, shape.startY, shape.endX, shape.endY, shape.thickness);
                    }
                    break;
                case 'rect':
                    const w = shape.width;
                    const h = shape.height;
                    ctx.lineWidth = shape.thickness;
                    ctx.strokeStyle = shape.color;
                    ctx.fillStyle = shape.color;
                    // Desenha retângulo centralizado localmente
                    if (shape.fill) {
                         ctx.fillRect(-w / 2, -h / 2, w, h);
                    } else {
                         ctx.strokeRect(-w / 2, -h / 2, w, h);
                    }
                    break;
                case 'circle':
                    ctx.beginPath();
                    // Desenha círculo centrado localmente
                    ctx.arc(0, 0, shape.radius, 0, Math.PI * 2);
                    ctx.lineWidth = shape.thickness;
                    ctx.strokeStyle = shape.color;
                    ctx.fillStyle = shape.color;
                    if (shape.fill) {
                         ctx.fill();
                    } else {
                         ctx.stroke();
                    }
                    break;
                case 'pen':
                    if (shape.points && shape.points.length > 1) {
                         ctx.beginPath();
                         // Desenha traço de caneta relativo ao centro (x,y)
                         ctx.moveTo(shape.points[0].x, shape.points[0].y);
                         for (let i = 1; i < shape.points.length; i++) {
                              ctx.lineTo(shape.points[i].x, shape.points[i].y);
                         }
                         ctx.lineWidth = shape.thickness;
                         ctx.strokeStyle = shape.color;
                         ctx.lineCap = 'round'; // Junta e fim de linha suaves
                         ctx.lineJoin = 'round';
                         ctx.stroke();
                    }
                    break;
            }

            ctx.globalAlpha = currentGlobalAlpha; // Restaura alpha global
            ctx.restore(); // Restaura estado salvo para esta forma

            // Desenha os controles de seleção SE esta forma estiver selecionada E o modo for 'select'
            if (index === selectedShapeIndex && !isDrawingNewShape && !isDrawingPenStroke && currentDrawingMode === 'select') {
                 drawSelectionControls(shape);
            }
        });

        // Atualiza o cursor do mouse baseado na posição atual, APENAS se não estivermos arrastando/desenhando
        if (!isMouseDrawing) {
            updateCursorStyle(lastX, lastY);
        }
    }

    /**
     * Desenha a ponta de uma seta no canvas.
     * @param {CanvasRenderingContext2D} context - O contexto onde desenhar.
     * @param {number} fromX - Coordenada X inicial da linha.
     * @param {number} fromY - Coordenada Y inicial da linha.
     * @param {number} toX - Coordenada X final da linha (ponta da seta).
     * @param {number} toY - Coordenada Y final da linha (ponta da seta).
     * @param {number} thickness - Espessura da linha (influencia tamanho da ponta).
     */
    function drawArrowHead(context, fromX, fromY, toX, toY, thickness) {
        const angle = Math.atan2(toY - fromY, toX - fromX);
        // Calcula comprimento da cabeça da seta, ajustado pela espessura e limitado a metade do comprimento da linha
        const headLen = Math.min(ARROW_HEAD_LENGTH + thickness * 1.5, Math.hypot(toX - fromX, toY - fromY) * 0.5);
        // Calcula largura da base da cabeça da seta
        const arrowWidth = headLen * Math.tan(ARROW_HEAD_ANGLE);

        context.save(); // Salva estado antes de transformar para desenhar a cabeça
        context.beginPath();
        context.translate(toX, toY); // Move para a ponta da seta
        context.rotate(angle); // Rotaciona para alinhar com a linha
        // Desenha o triângulo da cabeça (apontando para -X localmente)
        context.moveTo(0, 0);
        context.lineTo(-headLen, arrowWidth / 2);
        context.lineTo(-headLen, -arrowWidth / 2);
        context.closePath(); // Fecha o triângulo
        context.fillStyle = context.strokeStyle; // Usa a mesma cor da linha
        context.fill(); // Preenche a cabeça da seta
        context.restore(); // Restaura o estado do contexto
    }


    /**
     * Carrega uma imagem de sobreposição (para `type: 'image'`) e a armazena no cache.
     * Redesenha o canvas quando a imagem carregar ou se ocorrer erro.
     * @param {string} imgSrc - A URL (DataURL ou externa) da imagem.
     */
    function loadImageOverlayForDrawing(imgSrc) {
        // Não carrega se já estiver no cache ou se não houver URL
        if (!imgSrc || imageOverlayCache[imgSrc]) return;

        const img = new Image();
        imageOverlayCache[imgSrc] = img; // Adiciona ao cache (mesmo antes de carregar)

        img.onload = () => {
            console.log("Cache: Imagem sobreposta carregada:", imgSrc.substring(0, 50) + "...");
            redrawCanvas(); // Redesenha para mostrar a imagem carregada
        };
        img.onerror = () => {
            console.error("Cache: Falha ao carregar imagem sobreposta:", imgSrc.substring(0, 50) + "...");
            delete imageOverlayCache[imgSrc]; // Remove do cache em caso de erro
            redrawCanvas(); // Redesenha (mostrará placeholder ou nada)
        };
        img.src = imgSrc; // Inicia o carregamento
    }


    /** Função principal para redesenhar todo o canvas (base + formas). */
    function redrawCanvas() {
        if (!ctx) return; // Sai se não houver contexto

        const cw = imageCanvas.width;
        const ch = imageCanvas.height;
        ctx.clearRect(0, 0, cw, ch); // Limpa o canvas principal

        // Desenha a imagem de fundo (se existir)
        if (originalImage) {
            drawImageWithFiltersAndTransforms();
        } else {
            // Se não houver imagem base, garante que o canvas tenha um tamanho mínimo
            // e que o canvas temporário esteja sincronizado (tamanho)
            if (imageCanvas.width === 0 || imageCanvas.height === 0) {
                imageCanvas.width = 300; // Tamanho padrão mínimo
                imageCanvas.height = 150;
            }
            if (tempCanvas.width !== imageCanvas.width || tempCanvas.height !== imageCanvas.height) {
                tempCanvas.width = imageCanvas.width;
                tempCanvas.height = imageCanvas.height;
                syncTempCanvasPosition(); // Ajusta posição do temp canvas
            }
            // Nota: Poderia desenhar um fundo padrão aqui se desejado para telas em branco
        }

        // Desenha todas as formas/camadas sobre a imagem base (ou fundo vazio)
        drawShapesAndControls();

        // Limpa o canvas temporário se não estivermos ativamente desenhando nele
        if (!isDrawingNewShape && !isDrawingPenStroke && !isErasing) {
             if(tempCtx) tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
             tempCanvas.style.display = 'none'; // Esconde o canvas temporário
        }
    }

    /** Aplica os filtros CSS (brilho, contraste, preset) ao contexto do canvas. */
    function applyCanvasFilters() {
        if (!ctx) return;
        // Combina filtros base com o preset selecionado
        const baseFilters = `brightness(${imageState.brightness}%) contrast(${imageState.contrast}%)`;
        const presetFilter = filterPresets[imageState.filter] || ''; // Pega do objeto ou string vazia
        ctx.filter = `${baseFilters} ${presetFilter}`.trim(); // Define a propriedade filter do canvas
    }

    /** Aplica as transformações (translação, rotação, escala) ao contexto do canvas. */
    function applyCanvasTransformations(imgW, imgH) {
        if(!ctx) return;
        // 1. Move a origem para o centro do canvas
        ctx.translate(imageCanvas.width / 2, imageCanvas.height / 2);
        // 2. Rotaciona em torno da nova origem
        ctx.rotate(imageState.rotation * Math.PI / 180);
        // 3. Escala em torno da nova origem (incluindo espelhamento e zoom visual)
        ctx.scale(imageState.scaleX * imageState.mainScale, imageState.scaleY * imageState.mainScale);
        // Agora, ao desenhar a imagem em (-imgW/2, -imgH/2), ela ficará centralizada e transformada
    }

    /**
     * Desenha a caixa de seleção e os controles (redimensionar, rotacionar) para uma forma.
     * @param {object} shape - O objeto da forma selecionada.
     */
    function drawSelectionControls(shape) {
        if (!shape || !ctx) return; // Sai se não houver forma ou contexto

        // Calcula os limites locais da forma para saber onde desenhar a caixa
        let bounds = getShapeLocalBounds(shape);
        if (!bounds) return; // Sai se não conseguir calcular os limites

        ctx.save(); // Salva estado antes de desenhar controles

        // Aplica as mesmas transformações da forma para desenhar controles no lugar certo
        ctx.translate(shape.x, shape.y);
        ctx.rotate(shape.rotation);

        // Calcula a escala inversa para desenhar os controles com tamanho consistente
        const currentScaleX = Math.abs(shape.scale || 1);
        const currentScaleY = Math.abs(shape.scale || 1);
        const minScale = Math.min(currentScaleX, currentScaleY);
        // Evita divisão por zero e limita a escala inversa máxima
        const invScale = minScale > 0.01 ? 1 / minScale : 100;
        const handleDrawSize = HANDLE_SIZE * invScale; // Tamanho visual do controle
        const handleStrokeWidth = Math.max(0.5, 1.5 * invScale); // Largura da borda do controle
        const boxLineWidth = Math.max(0.5, 1 * invScale); // Largura da linha da caixa
        const boxPadding = 5 * invScale; // Espaçamento entre a forma e a caixa
        const rotationHandleVisualOffset = ROTATION_HANDLE_OFFSET * invScale; // Distância do controle de rotação
        const dashPattern = [Math.max(1, 4 * invScale), Math.max(1, 3 * invScale)]; // Padrão tracejado adaptável

        // Calcula coordenadas da caixa de seleção no espaço local da forma (já escalado pela forma)
        const scaledBoundsX = bounds.x * shape.scale;
        const scaledBoundsY = bounds.y * shape.scale;
        const scaledBoundsWidth = bounds.width * shape.scale;
        const scaledBoundsHeight = bounds.height * shape.scale;

        // Define a posição e tamanho da caixa com padding
        const boxX = scaledBoundsX - boxPadding;
        const boxY = scaledBoundsY - boxPadding;
        const boxWidth = scaledBoundsWidth + 2 * boxPadding;
        const boxHeight = scaledBoundsHeight + 2 * boxPadding;

        // 1. Desenha a Caixa Tracejada
        ctx.strokeStyle = 'rgba(80, 250, 123, 0.9)'; // Verde neon semi-transparente
        ctx.lineWidth = boxLineWidth;
        ctx.setLineDash(dashPattern); // Aplica tracejado
        ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);
        ctx.setLineDash([]); // Remove tracejado para outros desenhos

        // 2. Calcula Posições dos Controles (Handles) no espaço local transformado
        const resizeHandleX = boxX + boxWidth;
        const resizeHandleY = boxY + boxHeight;
        const rotationHandleX = boxX + boxWidth / 2;
        const rotationHandleY = boxY - rotationHandleVisualOffset; // Acima da caixa

        // 3. Desenha os Controles (Círculos)
        ctx.fillStyle = '#50fa7b'; // Verde Neon
        ctx.strokeStyle = '#282a36'; // Cor de fundo escura para contraste
        ctx.lineWidth = handleStrokeWidth;
        // Círculo de Redimensionamento (canto inferior direito)
        ctx.beginPath();
        ctx.arc(resizeHandleX, resizeHandleY, handleDrawSize / 2, 0, Math.PI * 2);
        ctx.fill(); ctx.stroke();
        // Círculo de Rotação (acima do centro)
        ctx.beginPath();
        ctx.arc(rotationHandleX, rotationHandleY, handleDrawSize / 2, 0, Math.PI * 2);
        ctx.fill(); ctx.stroke();

        // 4. Desenha a Linha do Controle de Rotação
        ctx.beginPath();
        ctx.moveTo(boxX + boxWidth / 2, boxY); // Topo central da caixa
        ctx.lineTo(rotationHandleX, rotationHandleY); // Até o controle de rotação
        ctx.strokeStyle = 'rgba(80, 250, 123, 0.9)'; // Verde neon
        ctx.lineWidth = boxLineWidth; // Mesma espessura da caixa
        ctx.stroke();

        ctx.restore(); // Restaura estado do contexto
    }

    /** Centraliza a área visível do canvas. */
    function centerCanvasView() {
        if (!imageCanvas.parentElement || !canvasArea) return; // Verifica se elementos existem

        const areaWidth = canvasArea.clientWidth;   // Largura da área de visualização
        const areaHeight = canvasArea.clientHeight; // Altura da área de visualização
        const canvasWidth = imageCanvas.width;     // Largura total do canvas
        const canvasHeight = imageCanvas.height;   // Altura total do canvas

        // Calcula a posição de scroll para centralizar
        // Garante que o scroll não seja negativo
        canvasArea.scrollLeft = Math.max(0, (canvasWidth - areaWidth) / 2);
        canvasArea.scrollTop = Math.max(0, (canvasHeight - areaHeight) / 2);

        // Sincroniza o canvas temporário após o scroll
        syncTempCanvasPosition();
    }

    // --- Listeners para Eventos (Controles de Edição e Canvas) ---

    // Event listener para scroll na área do canvas (atualiza tempCanvas e cropOverlay)
    canvasArea.addEventListener('scroll', () => {
        syncTempCanvasPosition();
        if (isCropping) { // Atualiza overlay de corte se estiver ativo
            updateCropOverlayVisuals();
        }
    });
    // Event listener para redimensionamento da janela (centraliza e atualiza overlay)
    window.addEventListener('resize', debounce(() => {
        centerCanvasView();
        if (isCropping) {
            updateCropOverlayVisuals();
        }
    }, 100)); // Debounce para performance

    // --- Listeners Controles de Edição (Sliders, Selects) ---
    brightnessSlider.addEventListener('input', (e) => { imageState.brightness = e.target.value; brightnessValueSpan.textContent = e.target.value; redrawCanvas(); });
    brightnessSlider.addEventListener('change', saveState); // Salva estado ao soltar o slider
    contrastSlider.addEventListener('input', (e) => { imageState.contrast = e.target.value; contrastValueSpan.textContent = e.target.value; redrawCanvas(); });
    contrastSlider.addEventListener('change', saveState);
    mainOpacitySlider.addEventListener('input', (e) => { const opacityValue = parseInt(e.target.value, 10) / 100; imageState.mainOpacity = opacityValue; mainOpacityValueSpan.textContent = Math.round(opacityValue * 100); redrawCanvas(); });
    mainOpacitySlider.addEventListener('change', saveState);
    mainScaleSlider.addEventListener('input', (e) => { const scaleValue = parseInt(e.target.value, 10) / 100; imageState.mainScale = scaleValue; mainScaleValueSpan.textContent = Math.round(scaleValue * 100); redrawCanvas(); });
    mainScaleSlider.addEventListener('change', saveState);
    filterSelect.addEventListener('change', (e) => { imageState.filter = e.target.value; redrawCanvas(); saveState(); }); // Aplica filtro e salva

    // Listeners Botões de Transformação
    rotateLeftBtn.addEventListener('click', () => { imageState.rotation = (imageState.rotation - 90 + 360) % 360; redrawCanvas(); saveState(); });
    rotateRightBtn.addEventListener('click', () => { imageState.rotation = (imageState.rotation + 90) % 360; redrawCanvas(); saveState(); });
    flipHorizontalBtn.addEventListener('click', () => { imageState.scaleX *= -1; redrawCanvas(); saveState(); });
    flipVerticalBtn.addEventListener('click', () => { imageState.scaleY *= -1; redrawCanvas(); saveState(); });

    // Listeners Controles de Forma Selecionada
    overlayOpacitySlider.addEventListener('input', (e) => {
        if (selectedShapeIndex !== -1 && imageState.shapes[selectedShapeIndex]) {
             const opacityValue = parseInt(e.target.value, 10) / 100;
             imageState.shapes[selectedShapeIndex].opacity = opacityValue;
             overlayOpacityValueSpan.textContent = Math.round(opacityValue * 100);
             redrawCanvas(); // Atualiza visualização em tempo real
        }
    });
    overlayOpacitySlider.addEventListener('change', saveState); // Salva estado ao soltar
    shapeColorPicker.addEventListener('input', (e) => {
        const newColor = e.target.value;
        imageState.currentShapeDefaults.color = newColor; // Atualiza cor padrão
        if (selectedShapeIndex !== -1) {
             const shape = imageState.shapes[selectedShapeIndex];
             // Aplica a nova cor à forma selecionada, se aplicável
             if (['text', 'emoji', 'line', 'rect', 'circle', 'arrow', 'pen'].includes(shape.type)) {
                  shape.color = newColor;
                  redrawCanvas();
             }
        }
    });
    shapeColorPicker.addEventListener('change', saveState); // Salva ao confirmar a cor
    lineWidthSlider.addEventListener('input', (e) => {
        const newWidth = parseInt(e.target.value, 10);
        lineWidthValueSpan.textContent = newWidth;
        imageState.currentShapeDefaults.lineWidth = newWidth; // Atualiza espessura padrão
        if (selectedShapeIndex !== -1) {
             const shape = imageState.shapes[selectedShapeIndex];
             // Aplica à forma selecionada, se aplicável
             if (['line', 'rect', 'circle', 'arrow', 'pen'].includes(shape.type)) {
                  shape.thickness = newWidth;
                  redrawCanvas();
             }
        }
    });
    lineWidthSlider.addEventListener('change', saveState);
    fillShapeCheckbox.addEventListener('change', (e) => {
        const isFilled = e.target.checked;
        imageState.currentShapeDefaults.fill = isFilled; // Atualiza padrão de preenchimento
        if (selectedShapeIndex !== -1) {
             const shape = imageState.shapes[selectedShapeIndex];
             // Aplica à forma selecionada, se for Retângulo ou Círculo
             if (['rect', 'circle'].includes(shape.type)) {
                  shape.fill = isFilled;
                  redrawCanvas();
                  saveState(); // Salva estado imediatamente ao marcar/desmarcar
             }
        }
    });

    // Listener para o slider de qualidade (atualiza valor e salva ao soltar)
    qualitySlider.addEventListener('change', saveState);


    // --- Lógica de Corte (Crop) ---

    /** Inicia o modo de corte. */
    cropBtn.addEventListener('click', () => {
        setCurrentDrawingMode('crop');
        selectedShapeIndex = -1; // Desseleciona qualquer forma
        updateShapeControlsFromSelection(); // Atualiza UI de controles de forma
        redrawCanvas(); // Garante que não há caixa de seleção visível
        cropOverlay.style.display = 'none'; // Esconde overlay inicialmente
    });

    /** Cancela a operação de corte. */
    cancelCropBtn.addEventListener('click', () => {
        setCurrentDrawingMode('select'); // Volta para o modo de seleção
        isMouseDrawing = false; // Garante que não estamos mais 'desenhando' a seleção
        isCropping = false; // Desativa flag de corte
        cropOverlay.style.display = 'none'; // Esconde o overlay de corte
    });

    /** Confirma e aplica o corte. */
    confirmCropBtn.addEventListener('click', () => {
        // Valida se o modo está correto e a área é mínima
        if (currentDrawingMode !== 'crop' || Math.abs(cropEndX - cropStartX) < 5 || Math.abs(cropEndY - cropStartY) < 5) {
             console.warn("Corte cancelado: área inválida ou modo incorreto.");
             cancelCropBtn.click(); // Cancela se inválido
             return;
        }

        // Calcula coordenadas e dimensões finais do corte
        const cropX = Math.min(cropStartX, cropEndX);
        const cropY = Math.min(cropStartY, cropEndY);
        const cropW = Math.abs(cropEndX - cropStartX);
        const cropH = Math.abs(cropEndY - cropStartY);

        selectedShapeIndex = -1; // Garante nada selecionado
        redrawCanvas(); // Redesenha sem a caixa de seleção antes de cortar

        // 1. Cria um canvas temporário para copiar a imagem atual
        const tempSourceCanvas = document.createElement('canvas');
        const tempSourceCtx = tempSourceCanvas.getContext('2d', { alpha: true });
        tempSourceCanvas.width = imageCanvas.width;
        tempSourceCanvas.height = imageCanvas.height;
        tempSourceCtx.drawImage(imageCanvas, 0, 0); // Copia o canvas principal

        // 2. Extrai os dados da área de corte
        let cropData;
        try {
             cropData = tempSourceCtx.getImageData(cropX, cropY, cropW, cropH);
        } catch(e) {
             console.error("Erro ao obter ImageData para corte (provavelmente CORS):", e);
             alert("Erro ao processar o corte. Se a imagem for de outra origem (URL externa), pode ser uma restrição de segurança (CORS).\n\nTente baixar a imagem original e carregá-la do seu dispositivo.");
             cancelCropBtn.click(); // Cancela em caso de erro
             return;
        }

        // 3. Cria um novo canvas final com as dimensões do corte
        const finalCropCanvas = document.createElement('canvas');
        const finalCropCtx = finalCropCanvas.getContext('2d');
        finalCropCanvas.width = cropW;
        finalCropCanvas.height = cropH;
        finalCropCtx.putImageData(cropData, 0, 0); // Cola os dados cortados

        // 4. Cria uma nova Imagem a partir do canvas cortado
        const croppedImage = new Image();
        croppedImage.onload = () => {
            // 5. Substitui a imagem original pela cortada e reseta estados relacionados
            originalImage = croppedImage; // Define a imagem cortada como a nova base
            // Reseta transformações, camadas, etc.
            imageState.rotation = 0; imageState.scaleX = 1; imageState.scaleY = 1; imageState.mainScale = 1; imageState.shapes = []; imageState.mainOpacity = 1; selectedShapeIndex = -1;
            // Reseta ajustes também (brilho/contraste são aplicados permanentemente no corte)
            imageState.brightness = 100; imageState.contrast = 100; imageState.filter = 'none';

            updateUIPlaceholders(); // Atualiza placeholders de tamanho
            updateUIFromState(); // Atualiza toda a UI
            updateShapeControlsFromSelection();
            redrawCanvas(); // Redesenha com a nova imagem base
            centerCanvasView(); // Centraliza
            saveState(); // Salva o estado após o corte
            console.log("Imagem cortada com sucesso.");
        };
        croppedImage.onerror = () => {
            alert("Erro ao criar a imagem final a partir dos dados cortados.");
        };

        // Gera a URL de dados para a nova imagem
        try {
            croppedImage.src = finalCropCanvas.toDataURL('image/png'); // Usa PNG para preservar transparência potencial
        } catch (e) {
            console.error("Erro ao gerar Data URL da imagem cortada:", e);
            alert("Erro ao gerar a imagem final cortada.");
        }

        cancelCropBtn.click(); // Sai do modo de corte
    });

    /** Atualiza a posição e tamanho do overlay visual de corte. */
    function updateCropOverlayVisuals() {
        if (!isCropping || !cropOverlay || !imageCanvas) return;

        // Calcula posição e tamanho visuais
        const visualX = Math.min(cropStartX, cropEndX);
        const visualY = Math.min(cropStartY, cropEndY);
        const visualW = Math.abs(cropEndX - cropStartX);
        const visualH = Math.abs(cropEndY - cropStartY);

        // Posiciona o DIV do overlay em relação ao canvas
        const overlayLeft = imageCanvas.offsetLeft + visualX;
        const overlayTop = imageCanvas.offsetTop + visualY;
        cropOverlay.style.position = 'absolute'; // Garante posicionamento absoluto
        cropOverlay.style.left = `${overlayLeft}px`;
        cropOverlay.style.top = `${overlayTop}px`;
        cropOverlay.style.width = `${visualW}px`;
        cropOverlay.style.height = `${visualH}px`;
        cropOverlay.style.display = 'block'; // Torna visível
    }


     // --- Lógica do Conta-Gotas ---

     /** Listener para ativar o conta-gotas. */
     eyedropperBtn.addEventListener('click', () => {
         eyedropperResultContainer.style.display = 'none'; // Esconde resultado anterior
         eyedropperColorCode.value = '';
         // Reseta preview para o estilo xadrez
         eyedropperPreview.style.backgroundColor = 'transparent';
         eyedropperPreview.style.backgroundImage = getComputedStyle(document.getElementById('eyedropperPreview')).getPropertyValue('background-image'); // Reaplica gradiente xadrez do CSS
         // O modo 'eyedropper' é definido no listener do botão em setCurrentDrawingMode
     });

     /** Listener para copiar a cor capturada. */
     copyColorBtn.addEventListener('click', () => {
         const color = eyedropperColorCode.value;
         // Só copia se houver cor válida e o clipboard estiver disponível
         if (color && color !== 'Erro' && color !== 'Transparente' && color !== 'Erro CORS' && navigator.clipboard) {
             navigator.clipboard.writeText(color)
                 .then(() => {
                     // Feedback visual de sucesso
                     const originalText = copyColorBtn.innerHTML;
                     copyColorBtn.innerHTML = '<i class="fas fa-check"></i> Copiado!';
                     setTimeout(() => { copyColorBtn.innerHTML = originalText; }, 1500); // Volta ao normal
                 })
                 .catch(err => {
                     console.error('Erro ao copiar cor:', err);
                     alert('Não foi possível copiar automaticamente. Tente usar Ctrl+C.');
                     try { eyedropperColorCode.select(); } catch(e){} // Tenta selecionar para cópia manual
                 });
         } else if (color && color !== 'Erro' && color !== 'Transparente' && color !== 'Erro CORS') {
              // Fallback para seleção manual se clipboard API falhar ou não existir
              try {
                  eyedropperColorCode.select(); // Seleciona o texto no input
                  alert("Use Ctrl+C (ou Cmd+C no Mac) para copiar o código da cor.");
              } catch (selectErr) {
                  alert("Não foi possível selecionar o código da cor para cópia manual.");
              }
         }
     });

    /**
     * Captura a cor do pixel nas coordenadas (x, y) do canvas.
     * @param {number} x - Coordenada X no canvas.
     * @param {number} y - Coordenada Y no canvas.
     */
    function pickColor(x, y) {
        // Verifica se há conteúdo no canvas para pegar cor
        const hasBaseContent = originalImage || (imageCanvas && imageCanvas.width > 0 && imageCanvas.height > 0);
        if (!ctx || !hasBaseContent) {
            // Se não há conteúdo, mostra erro
             eyedropperColorCode.value = "Erro";
             eyedropperPreview.style.backgroundColor = 'transparent';
             eyedropperPreview.style.backgroundImage = getComputedStyle(document.getElementById('eyedropperPreview')).getPropertyValue('background-image');
             eyedropperResultContainer.style.display = 'flex';
             return;
        }

        // Garante que as coordenadas estão dentro dos limites do canvas
        const canvasWidth = imageCanvas.width;
        const canvasHeight = imageCanvas.height;
        const clampedX = Math.max(0, Math.min(Math.floor(x), canvasWidth - 1));
        const clampedY = Math.max(0, Math.min(Math.floor(y), canvasHeight - 1));

        try {
            // Obtém os dados do pixel (RGBA)
            const pixelData = ctx.getImageData(clampedX, clampedY, 1, 1).data;
            const r = pixelData[0], g = pixelData[1], b = pixelData[2], a = pixelData[3];

            // Converte para Hex e atualiza a UI
            const hexColor = rgbaToHex(r, g, b, a);
            eyedropperColorCode.value = hexColor;

            if (a === 0) { // Se for transparente
                eyedropperPreview.style.backgroundColor = 'transparent';
                // Reaplica fundo xadrez
                 eyedropperPreview.style.backgroundImage = getComputedStyle(document.getElementById('eyedropperPreview')).getPropertyValue('background-image');
            } else { // Se for cor sólida
                eyedropperPreview.style.backgroundColor = `rgba(${r}, ${g}, ${b}, ${a / 255})`;
                eyedropperPreview.style.backgroundImage = 'none'; // Remove fundo xadrez
            }
            eyedropperResultContainer.style.display = 'flex'; // Mostra o resultado

        } catch (e) {
            // Captura erro (geralmente CORS se imagem for externa)
            console.error("Erro ao usar getImageData no conta-gotas (provavelmente CORS):", e);
            eyedropperColorCode.value = "Erro CORS";
            eyedropperPreview.style.backgroundColor = 'transparent';
            eyedropperPreview.style.backgroundImage = getComputedStyle(document.getElementById('eyedropperPreview')).getPropertyValue('background-image');
            eyedropperResultContainer.style.display = 'flex';
            alert("Não foi possível capturar a cor do pixel. Se a imagem foi carregada de uma URL externa, isso pode ser devido a restrições de segurança (CORS). Tente carregar a imagem do seu dispositivo.");
        }
    }


    // --- Interação com o Canvas (Mouse Events) ---

    /** Listener para Pressionar o Botão do Mouse no Canvas */
    imageCanvas.addEventListener('mousedown', (e) => {
        if (!ctx) return; // Sai se não houver contexto
        lastX = e.offsetX; lastY = e.offsetY; // Guarda posição inicial do clique
        isMouseDrawing = true; // Marca que o mouse está pressionado

        // Reseta flags de interação com formas/canvas
        draggingShape = false; resizingShape = false; rotatingShape = false; isDraggingCanvas = false;

        // Ação baseada no modo atual
        switch (currentDrawingMode) {
            case 'crop':
                isCropping = true; // Ativa flag de corte
                cropStartX = lastX; cropStartY = lastY; // Define início da área de corte
                cropEndX = lastX; cropEndY = lastY;
                updateCropOverlayVisuals(); // Mostra/atualiza overlay
                break;
            case 'eyedropper':
                pickColor(lastX, lastY); // Pega a cor no ponto clicado
                isMouseDrawing = false; // Conta-gotas é ação única, não "desenha"
                setCurrentDrawingMode('select'); // Volta para seleção após pegar cor
                break;
            case 'pen':
                isDrawingPenStroke = true; // Ativa flag de desenho à mão livre
                drawingStartX = lastX; drawingStartY = lastY; // Ponto inicial
                currentPenStroke = [{ x: drawingStartX, y: drawingStartY }]; // Inicia array de pontos
                // Prepara canvas temporário para desenhar preview do traço
                syncTempCanvasPosition(); tempCanvas.style.display = 'block';
                tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
                tempCtx.lineWidth = imageState.currentShapeDefaults.lineWidth;
                tempCtx.strokeStyle = imageState.currentShapeDefaults.color;
                tempCtx.lineCap = 'round'; tempCtx.lineJoin = 'round'; tempCtx.globalAlpha = 1;
                tempCtx.beginPath(); tempCtx.moveTo(drawingStartX, drawingStartY);
                break;
            case 'line': case 'rect': case 'circle': case 'arrow':
                isDrawingNewShape = true; // Ativa flag de desenho de forma geométrica
                drawingStartX = lastX; drawingStartY = lastY; // Ponto inicial
                // Prepara canvas temporário para preview
                syncTempCanvasPosition(); tempCanvas.style.display = 'block';
                tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
                tempCtx.lineWidth = imageState.currentShapeDefaults.lineWidth;
                tempCtx.strokeStyle = imageState.currentShapeDefaults.color;
                tempCtx.fillStyle = imageState.currentShapeDefaults.color; // Para preenchimento
                tempCtx.globalAlpha = 1; tempCtx.lineCap = ['line','arrow'].includes(currentDrawingMode) ? 'round' : 'butt'; // Ajusta fim de linha
                break;
            case 'eraser':
                isErasing = true; // Ativa flag de apagar
                handleEraserInteraction(lastX, lastY); // Tenta apagar no ponto inicial
                break;
            case 'select': // Modo de seleção/interação
            default:
                 // Verifica qual interação ocorreu (clique na forma, controle, fundo)
                 const interaction = getShapeInteraction(lastX, lastY);
                 const previousSelectedShapeIndex = selectedShapeIndex;
                 let selectionChanged = false;

                 if (selectedShapeIndex !== -1 && interaction.index === selectedShapeIndex && (interaction.type === 'resize_handle' || interaction.type === 'rotate_handle')) {
                      // Clicou em um controle da forma já selecionada
                      if (interaction.type === 'resize_handle') { resizingShape = true; console.log("MouseDown: Iniciando Redimensionamento"); }
                      else { rotatingShape = true; console.log("MouseDown: Iniciando Rotação"); }
                 }
                 else if (selectedShapeIndex !== -1 && interaction.index === selectedShapeIndex && interaction.type === 'shape_body') {
                      // Clicou no corpo da forma já selecionada -> Iniciar Arraste
                      draggingShape = true;
                      const shape = imageState.shapes[selectedShapeIndex];
                      dragOffsetX = lastX - shape.x; // Calcula offset para arrastar suavemente
                      dragOffsetY = lastY - shape.y;
                      console.log("MouseDown: Iniciando Arraste da Selecionada");
                 }
                 else if (interaction.type === 'shape_body') {
                      // Clicou em uma forma diferente -> Selecionar e Iniciar Arraste
                      selectedShapeIndex = interaction.index;
                      selectionChanged = (selectedShapeIndex !== previousSelectedShapeIndex); // Houve mudança na seleção?
                      draggingShape = true;
                      const shape = imageState.shapes[selectedShapeIndex];
                      dragOffsetX = lastX - shape.x;
                      dragOffsetY = lastY - shape.y;
                      console.log(`MouseDown: Selecionando e Arrastando Nova Forma ${selectedShapeIndex}`);
                 }
                 else { // Clicou no fundo (nenhuma forma ou controle)
                      // Deseleciona forma atual se houver
                      if (selectedShapeIndex !== -1) {
                           selectedShapeIndex = -1;
                           selectionChanged = true;
                           console.log("MouseDown: Deselecionando Forma");
                      }
                      // Inicia arraste do canvas (pan)
                      isDraggingCanvas = true;
                      console.log("MouseDown: Iniciando Arraste do Canvas (Pan)");
                 }

                 // Se a seleção mudou, atualiza a UI relacionada
                 if (selectionChanged) {
                      updateOverlayOpacityUI();
                      updateShapeControlsFromSelection();
                      redrawCanvas(); // Redesenha para remover/mostrar controles
                 }
                 deleteLayerBtn.disabled = selectedShapeIndex === -1; // Atualiza botão deletar
                 break;
         }
         updateCursorStyle(lastX, lastY); // Define o cursor apropriado
    });

    /** Listener para Mover o Mouse sobre o Canvas */
    imageCanvas.addEventListener('mousemove', (e) => {
        const currentX = e.offsetX; const currentY = e.offsetY;

        // Se o mouse não estiver pressionado, apenas atualiza o cursor e sai
        if (!isMouseDrawing) {
            updateCursorStyle(currentX, currentY);
            lastX = currentX; lastY = currentY; // Guarda a posição para o próximo evento
            return;
        }

        const dx = currentX - lastX; // Movimento X desde o último evento
        const dy = currentY - lastY; // Movimento Y desde o último evento

        // Ação baseada no que está acontecendo (flags ativadas no mousedown)
        if (isCropping) {
            cropEndX = currentX; cropEndY = currentY; // Atualiza ponto final do corte
            updateCropOverlayVisuals(); // Redesenha o overlay
        }
        else if (isDrawingPenStroke) {
            currentPenStroke.push({ x: currentX, y: currentY }); // Adiciona ponto ao traço
            // Desenha segmento no canvas temporário para preview
            tempCtx.lineTo(currentX, currentY);
            tempCtx.stroke();
            tempCtx.beginPath(); // Começa novo path para o próximo segmento
            tempCtx.moveTo(currentX, currentY);
        }
        else if (isDrawingNewShape) {
            // Limpa e redesenha preview da forma geométrica no canvas temporário
            tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
            tempCtx.beginPath();
            switch(currentDrawingMode){
                 case 'line':
                    tempCtx.moveTo(drawingStartX, drawingStartY); tempCtx.lineTo(currentX, currentY);
                    tempCtx.stroke();
                    break;
                 case 'arrow':
                    tempCtx.moveTo(drawingStartX, drawingStartY); tempCtx.lineTo(currentX, currentY);
                    tempCtx.stroke();
                    drawArrowHead(tempCtx, drawingStartX, drawingStartY, currentX, currentY, tempCtx.lineWidth); // Desenha ponta
                    break;
                 case 'rect':
                     const width = currentX - drawingStartX; const height = currentY - drawingStartY;
                     if (imageState.currentShapeDefaults.fill) { tempCtx.fillRect(drawingStartX, drawingStartY, width, height); }
                     else { tempCtx.strokeRect(drawingStartX, drawingStartY, width, height); }
                     break;
                 case 'circle':
                     const radius = Math.hypot(currentX - drawingStartX, currentY - drawingStartY); // Raio baseado na distância
                     tempCtx.arc(drawingStartX, drawingStartY, radius, 0, Math.PI * 2); // Desenha círculo a partir do centro inicial
                     if (imageState.currentShapeDefaults.fill) { tempCtx.fill(); } else { tempCtx.stroke(); }
                     break;
            }
        }
        else if (isErasing) {
            handleEraserInteraction(currentX, currentY); // Apaga formas sob o cursor
        }
        else if (draggingShape && selectedShapeIndex !== -1) {
            // Move a forma selecionada
            const shape = imageState.shapes[selectedShapeIndex];
            shape.x = currentX - dragOffsetX; // Usa offset para manter posição relativa ao clique
            shape.y = currentY - dragOffsetY;
            redrawCanvas(); // Redesenha tudo para mostrar movimento
        }
        else if (resizingShape && selectedShapeIndex !== -1) {
             // Redimensiona a forma selecionada
             const shape = imageState.shapes[selectedShapeIndex];
             const bounds = getShapeLocalBounds(shape); // Obtém limites locais
             if (bounds) {
                // Calcula vetor do centro da forma até o mouse (coordenadas globais)
                const vecXGlobal = currentX - shape.x;
                const vecYGlobal = currentY - shape.y;
                // Calcula posição local do controle de redimensionamento (canto inferior direito + padding)
                const invScale = shape.scale !== 0 ? 1 / shape.scale : 1; // Inverso da escala atual
                const localPadding = 5 * invScale;
                const handleLocalX = (bounds.x + bounds.width + localPadding); // Coordenada X local do controle
                const handleLocalY = (bounds.y + bounds.height + localPadding); // Coordenada Y local do controle
                const distHandleLocal = Math.hypot(handleLocalX, handleLocalY); // Distância do centro ao controle localmente
                const originalHandleAngleLocal = Math.atan2(handleLocalY, handleLocalX); // Ângulo original do controle

                // Calcula ângulo e distância do mouse em relação ao centro da forma (globalmente)
                const mouseAngleGlobal = Math.atan2(vecYGlobal, vecXGlobal);
                const distMouseGlobal = Math.hypot(vecXGlobal, vecYGlobal);
                // Converte ângulo do mouse para o sistema local da forma (desconta rotação)
                const mouseAngleLocal = mouseAngleGlobal - shape.rotation;

                // Projeta a distância do mouse na direção original do controle
                const projectedDist = distMouseGlobal * Math.cos(mouseAngleLocal - originalHandleAngleLocal);

                 // Calcula nova escala baseada na projeção
                 if (distHandleLocal > 1) { // Evita divisão por zero ou valores muito pequenos
                      let newScale = projectedDist / distHandleLocal;
                      shape.scale = Math.max(0.05, newScale); // Limita escala mínima
                      redrawCanvas(); // Redesenha com a nova escala
                 }
             }
        }
        else if (rotatingShape && selectedShapeIndex !== -1) {
             // Rotaciona a forma selecionada
             const shape = imageState.shapes[selectedShapeIndex];
             // Calcula ângulo entre o centro da forma e a posição atual do mouse
             const angleRad = Math.atan2(currentY - shape.y, currentX - shape.x);
             // Define a rotação da forma (+ PI/2 porque o controle está no topo)
             shape.rotation = angleRad + Math.PI / 2;
             redrawCanvas(); // Redesenha com a nova rotação
        }
        else if (isDraggingCanvas) {
            // Move a área de visualização do canvas (scroll)
            canvasArea.scrollLeft -= dx;
            canvasArea.scrollTop -= dy;
        }

        lastX = currentX; // Atualiza última posição
        lastY = currentY;
        // Atualiza cursor APENAS se não estiver fazendo panning (senão fica 'grabbing')
        if (!isDraggingCanvas) { updateCursorStyle(currentX, currentY); }
    });

    /** Listener para Soltar o Botão do Mouse sobre o Canvas */
    imageCanvas.addEventListener('mouseup', (e) => {
        if (!isMouseDrawing) return; // Sai se o mouse não estava pressionado
        const finalX = e.offsetX; const finalY = e.offsetY;

        // Finaliza a ação que estava em progresso
        if (isCropping) {
             isCropping = false;
             // Não salva estado aqui, confirmação ou cancelamento fazem isso
        }
        else if (isDrawingPenStroke) {
             isDrawingPenStroke = false;
             tempCanvas.style.display = 'none'; // Esconde preview
             if (currentPenStroke.length > 1) { // Só adiciona se tiver mais de 1 ponto
                  addPenStrokeShape(currentPenStroke); // Adiciona forma ao estado principal
             }
             currentPenStroke = []; // Limpa array de pontos
             setCurrentDrawingMode('select'); // Volta para seleção
        }
        else if (isDrawingNewShape) {
             isDrawingNewShape = false;
             tempCanvas.style.display = 'none';
             // Só adiciona se houver movimento mínimo
             if (Math.hypot(finalX - drawingStartX, finalY - drawingStartY) > 3) {
                  addGeometricShape(currentDrawingMode, drawingStartX, drawingStartY, finalX, finalY);
             }
             setCurrentDrawingMode('select');
        }
        else if (isErasing) {
             isErasing = false;
             saveState(); // Salva estado após terminar de apagar
        }
        else if (draggingShape || resizingShape || rotatingShape) {
             console.log("MouseUp: Finalizando Drag/Resize/Rotate e salvando estado.");
             saveState(); // Salva estado ao finalizar interação com a forma
        }
         // else if (isDraggingCanvas) { /* Não precisa fazer nada, o scroll já aconteceu */ }

        // Reseta todas as flags de interação
        isMouseDrawing = false; draggingShape = false; resizingShape = false; rotatingShape = false;
        isDraggingCanvas = false; isCropping = false; isErasing = false; isDrawingNewShape = false; isDrawingPenStroke = false;

        updateCursorStyle(finalX, finalY); // Atualiza cursor para estado normal
    });

    /** Listener para Mouse Saindo da Área do Canvas */
    imageCanvas.addEventListener('mouseleave', () => {
        // Se o mouse estava pressionado (arrastando/desenhando) ao sair
        if (isMouseDrawing) {
            console.log("Mouse saiu do canvas durante interação, cancelando/finalizando...");
            // Cancela/finaliza a ação em progresso de forma segura
            if (isCropping) { isCropping = false; cropOverlay.style.display = 'none'; }
            else if (isDrawingPenStroke || isDrawingNewShape) {
                 // Se estava desenhando, finaliza como se tivesse soltado o mouse
                 isDrawingPenStroke = false; isDrawingNewShape = false; tempCanvas.style.display = 'none';
                 if(tempCtx) tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height); // Limpa preview
                 currentPenStroke = []; // Limpa pontos
                 setCurrentDrawingMode('select'); // Volta para seleção
            }
            else if (isErasing) { isErasing = false; saveState(); } // Salva o que apagou
            else if (draggingShape || resizingShape || rotatingShape) {
                 console.log("MouseLeave: Finalizando Drag/Resize/Rotate e salvando estado.");
                 saveState(); // Salva a posição/tamanho/rotação final
            }
            // Reseta flags
             isMouseDrawing = false; draggingShape = false; resizingShape = false; rotatingShape = false; isDraggingCanvas = false; isErasing = false;
             updateCursorStyle(); // Atualiza cursor (sem posição, volta ao default do modo)
        }
        // Reseta cursor para default se o mouse simplesmente saiu
        imageCanvas.style.cursor = 'default';
        imageCanvas.className = 'default-cursor'; // Remove classes de cursor
        tempCanvas.style.cursor = 'default';
        tempCanvas.className = 'default-cursor';
    });


    // --- Lógica de Interação com Formas (Hit Detection) ---

    /**
     * Determina qual interação ocorre (se houver) nas coordenadas (x, y).
     * Verifica colisões com controles e corpos das formas, da mais recente para a mais antiga.
     * @param {number} x - Coordenada X do clique/mouse no canvas.
     * @param {number} y - Coordenada Y do clique/mouse no canvas.
     * @returns {object} Objeto { type: 'none' | 'shape_body' | 'resize_handle' | 'rotate_handle', index: number }
     */
    function getShapeInteraction(x, y) {
        let interaction = { type: 'none', index: -1 }; // Resultado padrão

        // Itera pelas formas de trás para frente (mais recentes primeiro)
        for (let i = imageState.shapes.length - 1; i >= 0; i--) {
            const shape = imageState.shapes[i];
            if(!shape) continue; // Pula formas inválidas

            // --- Converte coordenadas do mouse para o sistema local da forma ---
            // 1. Calcula vetor do centro da forma para o mouse (global)
            const dx_world = x - shape.x;
            const dy_world = y - shape.y;
            // 2. Rotaciona o vetor no sentido contrário da forma
            const angle = -shape.rotation;
            const cos = Math.cos(angle); const sin = Math.sin(angle);
            const localXUnscaled = dx_world * cos - dy_world * sin;
            const localYUnscaled = dx_world * sin + dy_world * cos;
            // 3. Desfaz a escala da forma para obter coordenadas locais verdadeiras
            const currentScale = shape.scale || 1;
            const localX = currentScale !== 0 ? localXUnscaled / currentScale : localXUnscaled;
            const localY = currentScale !== 0 ? localYUnscaled / currentScale : localYUnscaled;
            // Agora (localX, localY) é a posição do clique/mouse no sistema de
            // coordenadas da forma ANTES da escala ser aplicada.

            let hitBody = false;
            let hitHandleType = 'none'; // Nenhum controle atingido por padrão

            // --- Verifica Hit nos Controles (APENAS se a forma estiver selecionada) ---
            if (i === selectedShapeIndex && currentDrawingMode === 'select') {
                 const bounds = getShapeLocalBounds(shape); // Limites locais para calcular posições dos handles
                 if (bounds) {
                     // Calcula raio de acerto do handle (maior para facilitar clique)
                     const minScale = Math.min(Math.abs(shape.scale || 1), Math.abs(shape.scale || 1));
                     const invScale = minScale > 0.01 ? 1 / minScale : 100;
                     const handleHitRadius = (HANDLE_SIZE * 1.5) * invScale; // Raio maior
                     const localPadding = 5 * invScale;
                     const localRotationHandleOffset = ROTATION_HANDLE_OFFSET * invScale;
                     // Posições locais dos handles (ANTES da escala)
                     const boxLocalX = bounds.x - localPadding;
                     const boxLocalY = bounds.y - localPadding;
                     const boxLocalWidth = bounds.width + 2 * localPadding;
                     const boxLocalHeight = bounds.height + 2 * localPadding;
                     const resizeHandleLocalX = boxLocalX + boxLocalWidth;
                     const resizeHandleLocalY = boxLocalY + boxLocalHeight;
                     const rotationHandleLocalX = boxLocalX + boxLocalWidth / 2;
                     const rotationHandleLocalY = boxLocalY - localRotationHandleOffset;

                     // Verifica colisão com handle de rotação (distância ao quadrado)
                     const distSqRotation = (localX - rotationHandleLocalX)**2 + (localY - rotationHandleLocalY)**2;
                     if (distSqRotation <= handleHitRadius**2) {
                          hitHandleType = 'rotate_handle';
                     } else {
                          // Verifica colisão com handle de redimensionamento
                          const distSqResize = (localX - resizeHandleLocalX)**2 + (localY - resizeHandleLocalY)**2;
                          if (distSqResize <= handleHitRadius**2) {
                               hitHandleType = 'resize_handle';
                          }
                     }
                 }
            }

            // Se um handle foi atingido, define a interação e sai do loop
            if (hitHandleType !== 'none') {
                 interaction = { type: hitHandleType, index: i };
                 break;
            }

            // --- Verifica Hit no Corpo da Forma ---
            const localBounds = getShapeLocalBounds(shape); // Pega limites locais novamente
            if (!localBounds) continue; // Pula se não tiver limites

            // Define uma área de 'folga' para o clique (padding)
            const baseHitPadding = 5;
            const thicknessPadding = (shape.thickness || 1) * 1.5; // Padding extra para linhas grossas
            const hitPadding = Math.max(baseHitPadding, thicknessPadding);

            // Lógica de hit test específica para cada tipo de forma
            switch (shape.type) {
                case 'text':
                case 'emoji':
                case 'image':
                case 'rect': // Para retângulos, inclui o caso preenchido
                case 'pen': // Para caneta, verifica bounding box com padding
                     hitBody = localX >= localBounds.x - hitPadding && localX <= localBounds.x + localBounds.width + hitPadding &&
                               localY >= localBounds.y - hitPadding && localY <= localBounds.y + localBounds.height + hitPadding;
                     if (shape.type === 'rect' && !shape.fill) { // Lógica especial para contorno do retângulo
                         const w = localBounds.width; const h = localBounds.height; const x0 = localBounds.x; const y0 = localBounds.y;
                         const p = {x: localX, y: localY};
                         // Verifica distância do ponto a cada um dos 4 segmentos de linha
                         hitBody = pointToLineSegmentDistance(p, {x:x0, y:y0}, {x:x0+w, y:y0}) <= hitPadding ||
                                   pointToLineSegmentDistance(p, {x:x0+w, y:y0}, {x:x0+w, y:y0+h}) <= hitPadding ||
                                   pointToLineSegmentDistance(p, {x:x0+w, y:y0+h}, {x:x0, y:y0+h}) <= hitPadding ||
                                   pointToLineSegmentDistance(p, {x:x0, y:y0+h}, {x:x0, y:y0}) <= hitPadding;
                     }
                    break;
                case 'circle':
                    const distSq = localX**2 + localY**2; // Distância ao quadrado do centro local
                    const outerRadius = localBounds.radius + hitPadding;
                    if (shape.fill) { // Se preenchido, basta estar dentro do raio externo
                         hitBody = distSq <= outerRadius**2;
                    } else { // Se contorno, precisa estar entre raio interno e externo
                         const innerRadius = Math.max(0, localBounds.radius - hitPadding);
                         hitBody = distSq >= innerRadius**2 && distSq <= outerRadius**2;
                    }
                    break;
                case 'line':
                case 'arrow':
                    // Calcula distância do ponto local ao segmento de linha local
                    const p = { x: localX, y: localY }; // Ponto do clique local
                    const start = { x: shape.startX, y: shape.startY }; // Início da linha local
                    const end = { x: shape.endX, y: shape.endY }; // Fim da linha local
                    const dist = pointToLineSegmentDistance(p, start, end);
                    hitBody = dist <= hitPadding; // Verifica se a distância está dentro do padding
                    break;
            }

            // Se o corpo da forma foi atingido, define a interação e sai
            if (hitBody) {
                 interaction = { type: 'shape_body', index: i };
                 break;
            }
        }

        return interaction; // Retorna o tipo de interação e o índice da forma
    }

    /**
     * Calcula os limites (bounding box) de uma forma em seu próprio sistema de coordenadas local (ANTES da escala e rotação globais).
     * @param {object} shape - O objeto da forma.
     * @returns {object | null} Objeto {x, y, width, height, radius?} ou null se inválido.
     */
    function getShapeLocalBounds(shape) {
        if (!shape) return null;
        let bounds = null;

        try { // Bloco try/catch para lidar com possíveis erros (ex: measureText)
            switch (shape.type) {
                case 'text':
                case 'emoji':
                     const fontSize = shape.baseSize || 30;
                     // Mede o texto no contexto principal (requer salvar/restaurar ou usar contexto offscreen)
                     ctx.save(); ctx.font = `${fontSize}px sans-serif`; const metrics = ctx.measureText(shape.content || ' '); ctx.restore();
                     const width = metrics.width;
                     // Usa font bounding box se disponível, senão estima baseado no fontSize
                     const ascent = metrics.fontBoundingBoxAscent || metrics.actualBoundingBoxAscent || fontSize * 0.75;
                     const descent = metrics.fontBoundingBoxDescent || metrics.actualBoundingBoxDescent || fontSize * 0.25;
                     const height = ascent + descent;
                     // Define limites centrados na origem local (0,0)
                     bounds = { x: -width / 2, y: -ascent + height/2, width: width, height: height, radius: Math.max(width, height) / 2 };
                    break;
                case 'image':
                     // Limites baseados nas dimensões originais da imagem, centrados
                     const w = shape.originalWidth || 1; // Usa 1 como fallback mínimo
                     const h = shape.originalHeight || 1;
                     bounds = { x: -w / 2, y: -h / 2, width: w, height: h };
                    break;
                case 'line':
                case 'arrow':
                    // Bounding box que envolve os pontos de início e fim
                     const minX = Math.min(shape.startX, shape.endX);
                     const minY = Math.min(shape.startY, shape.endY);
                     const maxX = Math.max(shape.startX, shape.endX);
                     const maxY = Math.max(shape.startY, shape.endY);
                     bounds = { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
                    break;
                case 'rect':
                     // Limites baseados na largura/altura, centrados
                     const rw = shape.width; const rh = shape.height;
                     bounds = { x: -rw/2, y: -rh/2, width: rw, height: rh };
                    break;
                case 'circle':
                    // Limites baseados no raio, centrado
                     const r = shape.radius;
                     bounds = { x: -r, y: -r, width: 2 * r, height: 2 * r, radius: r }; // Inclui raio para conveniência
                    break;
                 case 'pen':
                      // Calcula bounding box dos pontos do traço
                      if (!shape.points || shape.points.length === 0) return null;
                      let pMinX = shape.points[0].x, pMinY = shape.points[0].y;
                      let pMaxX = shape.points[0].x, pMaxY = shape.points[0].y;
                      shape.points.forEach(p => {
                           pMinX = Math.min(pMinX, p.x); pMinY = Math.min(pMinY, p.y);
                           pMaxX = Math.max(pMaxX, p.x); pMaxY = Math.max(pMaxY, p.y);
                      });
                      bounds = { x: pMinX, y: pMinY, width: pMaxX - pMinX, height: pMaxY - pMinY };
                     break;
            }
        } catch (error) {
             console.error("Erro ao calcular limites locais para:", shape, error);
             return null; // Retorna null em caso de erro
        }

        // Garante que width/height não sejam negativos
        if (bounds) {
            bounds.width = Math.max(0, bounds.width);
            bounds.height = Math.max(0, bounds.height);
        }
        return bounds;
    }

    /**
     * Calcula a menor distância entre um ponto (p) e um segmento de linha (a, b).
     * Usado para hit detection em linhas e contornos.
     * @param {{x: number, y: number}} p - O ponto.
     * @param {{x: number, y: number}} a - Ponto inicial do segmento.
     * @param {{x: number, y: number}} b - Ponto final do segmento.
     * @returns {number} A distância mínima.
     */
    function pointToLineSegmentDistance(p, a, b) {
        const l2 = (b.x - a.x)**2 + (b.y - a.y)**2; // Comprimento do segmento ao quadrado
        if (l2 === 0) return Math.hypot(p.x - a.x, p.y - a.y); // Distância a 'a' se o segmento for um ponto

        // Calcula parâmetro 't' da projeção do ponto 'p' no segmento 'ab'
        // t = dot(p-a, b-a) / |b-a|^2
        let t = ((p.x - a.x) * (b.x - a.x) + (p.y - a.y) * (b.y - a.y)) / l2;
        // Limita 't' ao intervalo [0, 1] para garantir que a projeção esteja no segmento
        t = Math.max(0, Math.min(1, t));

        // Calcula as coordenadas do ponto projetado no segmento
        const projectionX = a.x + t * (b.x - a.x);
        const projectionY = a.y + t * (b.y - a.y);

        // Retorna a distância entre o ponto original 'p' e sua projeção no segmento
        return Math.hypot(p.x - projectionX, p.y - projectionY);
    }


    // --- Atualização do Cursor ---

    /** Atualiza o estilo do cursor do mouse baseado no modo atual e na posição. */
    function updateCursorStyle(x = -1, y = -1) {
        let cursor = 'default'; // Cursor padrão
        let cursorClass = 'default-cursor'; // Classe CSS correspondente

        if (!ctx) { /* Mantém default se não houver contexto */ }
        else if (currentDrawingMode === 'crop') { cursor = 'crosshair'; cursorClass = 'crosshair-cursor'; }
        else if (currentDrawingMode === 'eyedropper') { cursor = 'copy'; cursorClass = 'eyedropper-cursor'; }
        else if (currentDrawingMode === 'pen') { cursor = 'crosshair'; cursorClass = 'pen-cursor'; } // Usa cursor customizado (caneta)
        else if (['line', 'rect', 'circle', 'arrow'].includes(currentDrawingMode)) { cursor = 'crosshair'; cursorClass = 'crosshair-cursor'; }
        else if (currentDrawingMode === 'eraser') { cursor = 'crosshair'; cursorClass = 'eraser-cursor'; }
        else { // Modo 'select' ou padrão
             cursor = 'grab'; cursorClass = 'grab-cursor'; // Padrão é 'grab' para pan
             if (isDraggingCanvas) { cursor = 'grabbing'; cursorClass = 'grabbing'; } // Durante pan
             else if (resizingShape) { cursor = 'nwse-resize'; cursorClass = 'nwse-resize-cursor'; } // Durante redimensionamento
             else if (rotatingShape) { cursor = 'grabbing'; cursorClass = 'grabbing'; } // Durante rotação (grab parece adequado)
             else if (draggingShape) { cursor = 'grabbing'; cursorClass = 'grabbing'; } // Durante arraste da forma
             else if (x !== -1 && y !== -1) { // Se o mouse está sobre o canvas e não interagindo ativamente
                 const interaction = getShapeInteraction(x, y); // Verifica interação sob o cursor
                 if (interaction.type === 'resize_handle') { cursor = 'nwse-resize'; cursorClass = 'nwse-resize-cursor'; }
                 else if (interaction.type === 'rotate_handle') { cursor = 'grab'; cursorClass = 'grab-cursor'; }
                 else if (interaction.type === 'shape_body') {
                     // 'move' se for a forma selecionada, 'pointer' para indicar selecionável
                      cursor = (interaction.index === selectedShapeIndex) ? 'move' : 'pointer';
                      cursorClass = (interaction.index === selectedShapeIndex) ? 'move-cursor' : 'pointer-cursor';
                 }
                 // Se interaction.type for 'none', mantém 'grab'
             }
         }
        // Aplica o cursor ao canvas principal e ao temporário
         imageCanvas.style.cursor = cursor;
         imageCanvas.className = cursorClass; // Usa classe para cursores customizados
         tempCanvas.style.cursor = cursor;
         tempCanvas.className = cursorClass;
    }


    // --- Adicionar Camadas (Formas, Texto, Imagens) ---

    /**
     * Adiciona uma nova camada (Texto, Emoji, Imagem Sobreposta) ao centro da área visível do canvas.
     * @param {object} itemData - Dados do item (content, color, imgSrc, width, height).
     * @param {'text' | 'emoji' | 'image'} itemType - O tipo de camada a adicionar.
     */
    function addShape(itemData, itemType) {
        if (!ctx || !canvasArea) {
            alert("Erro: Não é possível adicionar camada. Contexto do canvas ou área de visualização não encontrado.");
            return;
        }

        // Encontra o centro da área visível atual do canvas
        const canvasWidth = imageCanvas.width; const canvasHeight = imageCanvas.height;
        const areaWidth = canvasArea.clientWidth; const areaHeight = canvasArea.clientHeight;
        // Centro X relativo ao início do canvas = scrollLeft + metade da largura visível
        const viewportCenterX = canvasArea.scrollLeft + areaWidth / 2;
        // Centro Y relativo ao início do canvas = scrollTop + metade da altura visível
        const viewportCenterY = canvasArea.scrollTop + areaHeight / 2;
        // Garante que o centro esteja dentro dos limites do canvas
        const finalX = Math.max(0, Math.min(viewportCenterX, canvasWidth));
        const finalY = Math.max(0, Math.min(viewportCenterY, canvasHeight));

        console.log(`[addShape] Inserindo ${itemType} em: X=${finalX.toFixed(1)}, Y=${finalY.toFixed(1)} (Canvas: ${canvasWidth}x${canvasHeight}, Viewport Center: ${viewportCenterX.toFixed(1)}x${viewportCenterY.toFixed(1)})`);

        // Cria o objeto base da nova forma/camada
        let newShape = {
            x: finalX, y: finalY,    // Posição central
            scale: 1,               // Escala inicial
            rotation: 0,            // Rotação inicial (em radianos)
            opacity: 1,             // Opacidade inicial
            color: itemData.color || imageState.currentShapeDefaults.color // Cor (padrão se não especificada)
        };

        // Adiciona propriedades específicas do tipo
        if (itemType === 'text' || itemType === 'emoji') {
             // Define tamanho base responsivo (proporcional ao canvas, com mínimo)
             const canvasMinDim = Math.min(canvasWidth || 300, canvasHeight || 150);
             const baseSize = Math.max(30, canvasMinDim * 0.08); // ~8% do menor lado, min 30px
             newShape = {
                  ...newShape, type: itemType, content: itemData.content, baseSize: baseSize
             };
             // Emoji usa cor preta por padrão (ignora cor selecionada)
             if (itemType === 'emoji') newShape.color = '#000000'; // Ou talvez null/undefined para renderizar nativamente? Testar. '#000000' é seguro.

        } else if (itemType === 'image') {
             // Calcula escala inicial para caber razoavelmente na tela
             const imgOriginalWidth = itemData.width; const imgOriginalHeight = itemData.height;
             if (!imgOriginalWidth || !imgOriginalHeight) { console.error("Dimensões inválidas para imagem sobreposta."); return; }
             const canvasMinDim = Math.min(canvasWidth || 300, canvasHeight || 150);
             const imgMaxDim = Math.max(imgOriginalWidth, imgOriginalHeight);
             const targetSize = canvasMinDim * 0.30; // Tenta ocupar ~30% do menor lado
             const initialScale = (imgMaxDim > 0) ? Math.min(1, targetSize / imgMaxDim) : 1; // Escala inicial, máximo 1
             newShape = {
                  ...newShape, type: 'image', imgSrc: itemData.imgSrc,
                  originalWidth: imgOriginalWidth, originalHeight: imgOriginalHeight,
                  scale: initialScale, color: undefined // Imagens não usam a propriedade 'color'
             };
             loadImageOverlayForDrawing(itemData.imgSrc); // Garante que a imagem seja carregada/cacheada
        } else {
             console.error("Tipo de forma desconhecido para adicionar:", itemType);
             return;
        }

        // Adiciona a nova forma ao estado
        imageState.shapes.push(newShape);
        const previousSelectedShapeIndex = selectedShapeIndex;
        selectedShapeIndex = imageState.shapes.length - 1; // Seleciona a nova forma

        // Atualiza UI se a seleção mudou
        if(selectedShapeIndex !== previousSelectedShapeIndex) {
             updateOverlayOpacityUI();
             updateShapeControlsFromSelection();
             deleteLayerBtn.disabled = false; // Habilita botão de deletar
        }
        redrawCanvas(); // Desenha tudo com a nova forma
        saveState(); // Salva o estado
        setCurrentDrawingMode('select'); // Garante que está no modo de seleção
    }


    /**
     * Adiciona uma forma geométrica (Linha, Retângulo, Círculo, Seta) criada pelo usuário.
     * @param {'line'|'rect'|'circle'|'arrow'} type - O tipo de forma.
     * @param {number} startX - Coordenada X inicial do desenho.
     * @param {number} startY - Coordenada Y inicial do desenho.
     * @param {number} endX - Coordenada X final do desenho.
     * @param {number} endY - Coordenada Y final do desenho.
     */
    function addGeometricShape(type, startX, startY, endX, endY) {
        if (!ctx) return;

        // Calcula o centro da forma (exceto círculo que usa startX, startY)
        const centerX = (startX + endX) / 2;
        const centerY = (startY + endY) / 2;
        // Calcula dimensões
        const width = Math.abs(endX - startX);
        const height = Math.abs(endY - startY);
        const radius = Math.hypot(endX - startX, endY - startY); // Raio para círculo (distância total)

        // Calcula coordenadas relativas ao centro para linha/seta/retângulo
        const relStartX = startX - centerX; const relStartY = startY - centerY;
        const relEndX = endX - centerX; const relEndY = endY - centerY;

        // Objeto base da forma
        let newShape = {
            type: type, x: centerX, y: centerY, // Posição é o centro
            scale: 1, rotation: 0, opacity: 1,
            color: imageState.currentShapeDefaults.color,
            thickness: imageState.currentShapeDefaults.lineWidth
        };

        // Adiciona/Ajusta propriedades específicas do tipo
        switch (type) {
            case 'line':
            case 'arrow':
                 newShape = { ...newShape, startX: relStartX, startY: relStartY, endX: relEndX, endY: relEndY };
                break;
            case 'rect':
                 newShape = { ...newShape, width: width, height: height, fill: imageState.currentShapeDefaults.fill };
                 // Ajusta y para contorno não ficar pela metade em linhas ímpares (opcional)
                 // if (!newShape.fill) newShape.y += (newShape.thickness % 2 !== 0 ? 0.5 : 0);
                 break;
            case 'circle':
                 // Centro do círculo é o ponto inicial do desenho
                 newShape.x = startX; newShape.y = startY;
                 const actualRadius = Math.hypot(endX - startX, endY - startY); // Raio real
                 newShape = { ...newShape, radius: actualRadius, fill: imageState.currentShapeDefaults.fill };
                 // Ajusta y para contorno (opcional)
                 // if (!newShape.fill) newShape.y += (newShape.thickness % 2 !== 0 ? 0.5 : 0);
                 break;
            default: return; // Tipo desconhecido
        }

        // Adiciona, seleciona, atualiza UI e salva
        imageState.shapes.push(newShape);
        selectedShapeIndex = imageState.shapes.length - 1;
        updateOverlayOpacityUI(); updateShapeControlsFromSelection();
        deleteLayerBtn.disabled = false;
        redrawCanvas();
        saveState();
    }

    /**
     * Adiciona um traço de caneta como uma única forma.
     * @param {Array<{x: number, y: number}>} points - Array de pontos do traço.
     */
    function addPenStrokeShape(points) {
        if (!ctx || points.length < 2) return; // Precisa de pelo menos 2 pontos

        // Calcula o bounding box do traço
        let minX = points[0].x, minY = points[0].y;
        let maxX = points[0].x, maxY = points[0].y;
        points.forEach(p => {
             minX = Math.min(minX, p.x); minY = Math.min(minY, p.y);
             maxX = Math.max(maxX, p.x); maxY = Math.max(maxY, p.y);
        });

        // Calcula o centro do traço
        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;

        // Converte pontos para coordenadas relativas ao centro
        const relativePoints = points.map(p => ({ x: p.x - centerX, y: p.y - centerY }));

        // Cria o objeto da forma 'pen'
        const newShape = {
            type: 'pen', x: centerX, y: centerY, // Posição é o centro
            points: relativePoints, // Pontos relativos
            scale: 1, rotation: 0, opacity: 1,
            color: imageState.currentShapeDefaults.color,
            thickness: imageState.currentShapeDefaults.lineWidth
        };

        // Adiciona, seleciona, atualiza UI e salva
        imageState.shapes.push(newShape);
        selectedShapeIndex = imageState.shapes.length - 1;
        updateOverlayOpacityUI(); updateShapeControlsFromSelection();
        deleteLayerBtn.disabled = false;
        redrawCanvas();
        saveState();
    }

    // Listeners para adicionar camadas
    addTextBtn.addEventListener('click', () => {
        const text = prompt("Digite o texto:", "");
        if (text && text.trim() !== "") { // Só adiciona se não for vazio
            addShape({ content: text.trim(), color: shapeColorPicker.value }, 'text');
        }
    });
    emojiGrid.addEventListener('click', (e) => { // Delegação de evento no grid
        if (e.target.tagName === 'BUTTON' && e.target.dataset.item) {
             addShape({ content: e.target.dataset.item }, 'emoji');
             closeEmojiModal(); // Fecha modal após selecionar
        }
    });
    imageOverlayLoader.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file || !file.type.startsWith('image/')) {
             alert('Por favor, selecione um arquivo de imagem (JPG, PNG, WEBP, GIF).');
             imageOverlayLoader.value = ''; return;
        };
        if (!ctx) { alert('Erro: Contexto do canvas não encontrado.'); imageOverlayLoader.value = ''; return; }

        const reader = new FileReader();
        reader.onload = (event) => {
             const dataUrl = event.target.result;
             const tempImg = new Image(); // Cria imagem temporária para obter dimensões
             tempImg.onload = () => {
                 if (tempImg.naturalWidth > 0 && tempImg.naturalHeight > 0) {
                      // Adiciona forma 'image' com dimensões e DataURL
                      addShape({ imgSrc: dataUrl, width: tempImg.naturalWidth, height: tempImg.naturalHeight }, 'image');
                 } else { alert("Não foi possível obter as dimensões da imagem sobreposta."); }
                 imageOverlayLoader.value = ''; // Limpa input
             };
             tempImg.onerror = () => { alert("Erro ao ler as dimensões da imagem sobreposta."); imageOverlayLoader.value = ''; };
             tempImg.src = dataUrl; // Carrega DataURL na imagem temporária
        };
        reader.onerror = () => { alert("Erro ao ler o arquivo da imagem sobreposta."); imageOverlayLoader.value = ''; };
        reader.readAsDataURL(file); // Lê arquivo como DataURL
    });

    // --- Modal Emojis ---
    function openEmojiModal() {
        populateEmojiGrid(); // Garante que a grid esteja preenchida
        emojiModalBackdrop.style.display = 'block'; // Mostra fundo
        emojiModal.style.display = 'flex'; // Mostra modal
        // Força reflow para garantir que a animação funcione ao reabrir
        void emojiModal.offsetWidth;
        emojiModal.classList.add('modal-visible'); // Adiciona classe para animação/visibilidade
        emojiModal.focus(); // Foca no modal para acessibilidade (Esc)
    }
    function closeEmojiModal() {
        emojiModalBackdrop.style.display = 'none';
        emojiModal.style.display = 'none';
         emojiModal.classList.remove('modal-visible');
    }

    let gridPopulated = false; // Flag para popular a grid apenas uma vez
    function populateEmojiGrid() {
        if (gridPopulated) return;
        emojiGrid.innerHTML = ''; // Limpa grid (precaução)
        // Remove duplicatas e cria botões
        const uniqueEmojiList = [...new Set(EMOJI_LIST)];
        const fragment = document.createDocumentFragment(); // Usa fragmento para performance
        uniqueEmojiList.forEach(item => {
             const button = document.createElement('button');
             button.textContent = item;
             button.setAttribute('aria-label', `Adicionar ${item}`);
             button.dataset.item = item; // Guarda o item no dataset
             fragment.appendChild(button);
        });
        emojiGrid.appendChild(fragment); // Adiciona todos de uma vez
        gridPopulated = true;
    }

    // Listeners do Modal
    addEmojiBtn.addEventListener('click', openEmojiModal);
    modalCloseBtn.addEventListener('click', closeEmojiModal);
    emojiModalBackdrop.addEventListener('click', closeEmojiModal); // Fecha ao clicar fora
    emojiModal.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeEmojiModal(); }); // Fecha com Esc

    // --- Gerenciamento dos Modos de Desenho/Interação ---
    const toolButtons = [
        selectToolBtn, penToolBtn, lineToolBtn, arrowToolBtn,
        rectToolBtn, circleToolBtn, eyedropperBtn, cropBtn, eraserToolBtn
    ];

    /**
     * Define o modo de desenho/interação atual.
     * @param {string} mode - O nome do modo ('select', 'pen', etc.).
     */
    function setCurrentDrawingMode(mode) {
        const previousMode = currentDrawingMode;
        if (previousMode === mode) return; // Não faz nada se já estiver no modo

        console.log(`Mudando modo de '${previousMode}' para '${mode}'`);
        currentDrawingMode = mode;

        // Reseta estados de desenho/interação ativa ao mudar de modo
        isDrawingNewShape = false; isDrawingPenStroke = false; currentPenStroke = []; isErasing = false;
        // Limpa e esconde canvas temporário
        tempCanvas.style.display = 'none';
        if(tempCtx) tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);

        // Limpa estados específicos do modo anterior
        if (previousMode === 'crop') { // Se estava cortando
             confirmCropBtn.style.display = 'none'; // Esconde botões de confirmação/cancelamento
             cancelCropBtn.style.display = 'none';
             cropOverlay.style.display = 'none'; // Esconde overlay de corte
             isCropping = false; // Desativa flag
             cropBtn.style.display = 'inline-flex'; // Mostra o botão de cortar novamente
        }
        if (previousMode === 'eyedropper') { // Se estava no conta-gotas
             eyedropperResultContainer.style.display = 'none'; // Esconde resultado
        }

        // Define se o conta-gotas está ativo
        isEyedropperActive = (currentDrawingMode === 'eyedropper');

        // Desseleciona forma se sair do modo 'select'
        if (currentDrawingMode !== 'select' && selectedShapeIndex !== -1) {
             selectedShapeIndex = -1;
             updateOverlayOpacityUI();
             updateShapeControlsFromSelection();
             deleteLayerBtn.disabled = true;
             redrawCanvas(); // Redesenha sem a seleção
        }

        // Ativa estados/UI específicos do novo modo
        if (currentDrawingMode === 'crop') {
             confirmCropBtn.style.display = 'inline-flex'; // Mostra botões
             cancelCropBtn.style.display = 'inline-flex';
             cropBtn.style.display = 'none'; // Esconde botão de ativar corte
             // Não seta isCropping aqui, apenas no mousedown
        } else {
             // Garante que isCropping esteja desativado se não estiver no modo crop
             if (isCropping) isCropping = false;
        }

        updateActiveToolButton(); // Atualiza destaque visual do botão da ferramenta
        updateCursorStyle(); // Atualiza o cursor do mouse
    }

    /** Adiciona/Remove a classe 'active-tool' do botão correspondente ao modo atual. */
    function updateActiveToolButton() {
        toolButtons.forEach(btn => {
            if (btn && btn.dataset.tool) { // Verifica se o botão e o dataset existem
                 btn.classList.toggle('active-tool', currentDrawingMode === btn.dataset.tool);
            }
        });
    }

    /** Função auxiliar para desativar modos ativos e voltar para 'select'. */
    function deactivateAllModes() {
        if (currentDrawingMode === 'crop') { cancelCropBtn.click(); } // Cancela corte se ativo
        // Poderia adicionar cancelamentos para outros modos se necessário
        setCurrentDrawingMode('select'); // Define modo para 'select'
    }

    // Adiciona listeners para os botões de ferramenta para mudar o modo
    toolButtons.forEach(btn => {
        if (btn && btn.dataset.tool) {
             btn.addEventListener('click', () => setCurrentDrawingMode(btn.dataset.tool));
        }
    });

    // --- Redimensionar Imagem Principal ---
    resizeBtn.addEventListener('click', () => {
         // Verifica se há conteúdo para redimensionar
         const hasBaseContent = originalImage || (imageCanvas && imageCanvas.width > 0 && imageCanvas.height > 0);
         if (!hasBaseContent) {
             alert("Carregue uma imagem ou crie uma tela em branco primeiro.");
             return;
         }

         // Obtém dimensões originais e desejadas
         const originalImgWidth = originalImage ? (originalImage.naturalWidth || originalImage.width) : imageCanvas.width;
         const originalImgHeight = originalImage ? (originalImage.naturalHeight || originalImage.height) : imageCanvas.height;
         let targetWidth = parseInt(widthInput.value);
         let targetHeight = parseInt(heightInput.value);
         const maintainAspectRatio = aspectRatioCheckbox.checked;

         // Se nenhuma dimensão foi inserida, usa as originais (não faz nada)
         if (!targetWidth && !targetHeight) {
              alert("Digite a nova largura ou altura desejada.");
              return;
         }
         // Se uma dimensão não foi inserida, calcula baseado na outra e na proporção
         if (!targetWidth && targetHeight) { targetWidth = maintainAspectRatio ? Math.round(targetHeight * (originalImgWidth / originalImgHeight)) : originalImgWidth;}
         if (!targetHeight && targetWidth) { targetHeight = maintainAspectRatio ? Math.round(targetWidth / (originalImgWidth / originalImgHeight)) : originalImgHeight;}

         // Validação de dimensões
         if (targetWidth <= 0 || targetHeight <= 0) { alert("As dimensões devem ser maiores que zero."); return; }

         // Ajusta a dimensão não modificada se 'Manter Proporção' estiver ativo
         if (maintainAspectRatio) {
             const ratio = originalImgWidth / originalImgHeight;
             // Verifica qual dimensão foi realmente alterada pelo usuário
             const widthChanged = widthInput.value && parseInt(widthInput.value) !== originalImgWidth;
             const heightChanged = heightInput.value && parseInt(heightInput.value) !== originalImgHeight;

             // Recalcula a dimensão oposta baseada na alterada, priorizando largura se ambas mudaram
             if (widthChanged && (!heightChanged || widthInput.value)) { targetHeight = Math.round(targetWidth / ratio); }
             else if (heightChanged) { targetWidth = Math.round(targetHeight * ratio); }

             // Atualiza os inputs para refletir o cálculo da proporção
             widthInput.value = targetWidth; heightInput.value = targetHeight;
         }
         targetWidth = Math.max(1, targetWidth); targetHeight = Math.max(1, targetHeight);


         // Confirmação se houver camadas (serão perdidas)
         if (imageState.shapes.length > 0) {
             if (!confirm("Atenção: Redimensionar aplicará filtros e ajustes atuais à imagem base e removerá TODAS as camadas adicionadas (texto, formas, imagens, etc.).\n\nDeseja continuar?")) {
                 return;
             }
         }

         selectedShapeIndex = -1; // Desseleciona antes de redesenhar
         redrawCanvas(); // Aplica filtros/ajustes atuais visualmente

         // Cria canvas temporário para redimensionar
         const tempCanvasResize = document.createElement('canvas');
         const tempCtxResize = tempCanvasResize.getContext('2d');
         tempCanvasResize.width = targetWidth;
         tempCanvasResize.height = targetHeight;
         tempCtxResize.imageSmoothingQuality = "high"; // Melhora qualidade do redimensionamento

         try {
             // Desenha o canvas atual (com filtros/ajustes aplicados) no canvas temporário redimensionado
             tempCtxResize.drawImage(imageCanvas, 0, 0, imageCanvas.width, imageCanvas.height, 0, 0, targetWidth, targetHeight);
         } catch (e) {
             console.error("Erro ao desenhar imagem para redimensionamento (talvez CORS?):", e);
             alert("Erro ao preparar a imagem redimensionada. Pode ser uma restrição de segurança (CORS).");
             redrawCanvas(); // Restaura visualização anterior
             return;
         }

         // Cria nova imagem a partir do canvas redimensionado
         const resizedImage = new Image();
         resizedImage.onload = () => {
             // Substitui imagem original e reseta estados relevantes
             originalImage = resizedImage;
             imageState.rotation = 0; imageState.scaleX = 1; imageState.scaleY = 1; imageState.mainScale = 1;
             imageState.shapes = []; // Remove todas as camadas
             imageState.mainOpacity = 1; selectedShapeIndex = -1;
             // Reseta ajustes que foram "baked in"
             imageState.brightness = 100; imageState.contrast = 100; imageState.filter = 'none';

             // Atualiza UI e salva novo estado
             widthInput.value = ''; heightInput.value = ''; updateUIPlaceholders();
             updateUIFromState(); updateShapeControlsFromSelection();
             redrawCanvas(); centerCanvasView(); saveState();
             alert(`Imagem redimensionada para ${targetWidth}x${targetHeight}px. Camadas e ajustes anteriores foram incorporados ou removidos.`);
         };
         resizedImage.onerror = () => { alert("Erro ao carregar a imagem redimensionada final."); }

         // Gera Data URL da imagem redimensionada
         try {
             resizedImage.src = tempCanvasResize.toDataURL('image/png'); // PNG para preservar qualidade
         } catch (e) {
             console.error("Erro ao gerar Data URL da imagem redimensionada:", e);
             alert("Erro ao gerar a imagem final redimensionada. O canvas pode ser muito grande.");
         }
    });


    // --- Estimativa Tamanho e Download ---

    // Debounced function para atualizar a estimativa de tamanho (evita cálculos excessivos)
    const updateFileSizeEstimateDebounced = debounce(updateFileSizeEstimate, 350);

    /** Atualiza a estimativa de tamanho do arquivo de download (para JPEG/WEBP). */
    function updateFileSizeEstimate() {
        // Verifica se a estimativa é necessária para o formato atual
        const requiresEstimate = ['jpeg', 'webp'].includes(imageState.downloadFormat);
        // Mostra/esconde controles de qualidade baseado no formato
        qualitySlider.style.display = requiresEstimate ? 'block' : 'none';
        qualityLabel.style.display = requiresEstimate ? 'block' : 'none';
        fileSizeEstimateSpan.style.display = 'none'; // Esconde span inicialmente

        // Sai se não precisar de estimativa, se não houver canvas ou for muito pequeno
        if (!ctx || imageCanvas.width === 0 || imageCanvas.height === 0 || !requiresEstimate) {
            fileSizeEstimateSpan.textContent = 'N/A';
            if(requiresEstimate) fileSizeEstimateSpan.style.display = 'inline'; // Mostra N/A se precisar
            return;
        }

        // Mostra "Calculando..."
        fileSizeEstimateSpan.textContent = 'Calculando...';
        fileSizeEstimateSpan.style.display = 'inline';

        const format = imageState.downloadFormat;
        const mimeType = `image/${format}`;
        const qualityArgument = imageState.quality;

        // Usa setTimeout para permitir que a UI atualize antes do cálculo pesado
        clearTimeout(fileSizeCalculationTimeout); // Limpa timeout anterior se houver
        fileSizeCalculationTimeout = setTimeout(() => {
             // Verifica se o formato ainda é o mesmo (evita race condition se mudar rápido)
             if(imageState.downloadFormat !== format) return;

             try {
                  // Cria um canvas temporário para gerar o blob
                  const estimateCanvas = document.createElement('canvas');
                  const estimateCtx = estimateCanvas.getContext('2d', { alpha: (format !== 'jpeg') }); // Alpha=false para JPEG
                  estimateCanvas.width = imageCanvas.width; estimateCanvas.height = imageCanvas.height;

                  // Preenche fundo de branco se for JPEG
                  if (format === 'jpeg') {
                       estimateCtx.fillStyle = '#FFFFFF'; // Fundo branco para JPEG
                       estimateCtx.fillRect(0, 0, estimateCanvas.width, estimateCanvas.height);
                  }

                  // Desenha o canvas principal no canvas de estimativa
                  // Desseleciona temporariamente para não desenhar controles
                  const currentSelection = selectedShapeIndex; selectedShapeIndex = -1; redrawCanvas();
                  estimateCtx.drawImage(imageCanvas, 0, 0);
                  selectedShapeIndex = currentSelection; // Restaura seleção
                  if (selectedShapeIndex !== -1) redrawCanvas(); // Redesenha se algo estava selecionado

                  // Gera o Blob para obter o tamanho
                  estimateCanvas.toBlob( (blob) => {
                       if (imageState.downloadFormat !== format) return; // Aborta se formato mudou
                       if (blob) {
                            fileSizeEstimateSpan.textContent = formatBytes(blob.size); // Formata e mostra tamanho
                       } else {
                            fileSizeEstimateSpan.textContent = 'Erro'; // Mostra erro se blob for nulo
                       }
                       fileSizeEstimateSpan.style.display = 'inline'; // Garante que o span final seja visível
                   }, mimeType, qualityArgument ); // Passa tipo e qualidade

             } catch (err) {
                  // Em caso de erro (ex: canvas muito grande, CORS se aplicável aqui?)
                  if (imageState.downloadFormat === format) {
                      fileSizeEstimateSpan.textContent = 'Erro';
                      fileSizeEstimateSpan.style.display = 'inline';
                  }
                  console.error("Erro ao estimar tamanho do arquivo:", err);
             }
        }, 50); // Pequeno delay para UI update
    }

    // Listeners para mudanças de formato e qualidade
    downloadFormatSelect.addEventListener('change', (e) => {
        imageState.downloadFormat = e.target.value;
        updateUIFromState(); // Atualiza visibilidade dos controles de qualidade
        updateFileSizeEstimate(); // Recalcula estimativa
    });
    qualitySlider.addEventListener('input', (e) => { // Atualiza em tempo real
        if (!qualitySlider.disabled) {
             const qualityValue = parseInt(e.target.value, 10);
             imageState.quality = qualityValue / 100;
             qualityValueSpan.textContent = qualityValue; // Atualiza span do valor
             updateFileSizeEstimateDebounced(); // Atualiza estimativa com debounce
        }
    });


    /** Inicia o processo de download da imagem final. */
    downloadBtn.addEventListener('click', () => {
        // Verifica se há algo para baixar
        const hasBaseContent = originalImage || (imageCanvas && imageCanvas.width > 0 && imageCanvas.height > 0);
        if (!ctx || (!hasBaseContent && imageState.shapes.length === 0)) {
            alert("Nada para baixar. Carregue uma imagem ou adicione elementos.");
            return;
        }

        // Desseleciona qualquer forma para não incluir controles no download
        const currentSelectionIndex = selectedShapeIndex;
        selectedShapeIndex = -1;
        redrawCanvas(); // Redesenha sem seleção

        const format = imageState.downloadFormat;
        const mimeType = `image/${format}`;
        // Qualidade só é relevante para jpeg e webp
        const qualityArgument = (format === 'jpeg' || format === 'webp') ? imageState.quality : undefined;
        let dataUrl;

        try {
            let downloadCanvas = imageCanvas;
            // Se for JPEG, precisa desenhar em um novo canvas com fundo branco
            // pois toDataURL('image/jpeg') não lida bem com transparência
            if (format === 'jpeg') {
                downloadCanvas = document.createElement('canvas');
                const downloadCtx = downloadCanvas.getContext('2d');
                downloadCanvas.width = imageCanvas.width;
                downloadCanvas.height = imageCanvas.height;
                // Desenha fundo branco
                downloadCtx.fillStyle = '#FFFFFF';
                downloadCtx.fillRect(0, 0, downloadCanvas.width, downloadCanvas.height);
                // Desenha o canvas original sobre o fundo branco
                downloadCtx.drawImage(imageCanvas, 0, 0);
            }
             // Gera a Data URL a partir do canvas apropriado
             dataUrl = downloadCanvas.toDataURL(mimeType, qualityArgument);

        } catch (err) {
            // Captura erros comuns (ex: canvas muito grande, tainted canvas por CORS)
            console.error(`Erro ao gerar Data URL ${format.toUpperCase()}:`, err);
            alert(`Erro ao gerar imagem ${format.toUpperCase()}.\nO canvas pode ser muito grande ou conter elementos externos (CORS). Tente um formato diferente ou redimensione.`);
            // Restaura seleção se houve erro
            selectedShapeIndex = currentSelectionIndex;
            if (selectedShapeIndex !== -1) redrawCanvas();
            return;
        }

        // Cria link temporário para download
        const link = document.createElement('a');
        link.href = dataUrl;
        // Gera nome do arquivo com timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        link.download = `photoshop-facil-${timestamp}.${format}`;

        // Simula clique no link para iniciar download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); // Remove link temporário

        // Restaura a seleção se algo estava selecionado
        selectedShapeIndex = currentSelectionIndex;
        if (selectedShapeIndex !== -1) {
            redrawCanvas();
        }
    });


    // --- Resetar Tudo ---
    resetAllBtn.addEventListener('click', () => {
        const hasContent = originalImage || imageState.shapes.length > 0 || history.length > 0; // Considera histórico também
        if (hasContent) {
             const message = (originalImage || (imageCanvas && imageCanvas.width > 0))
                 ? "Isso descartará todas as alterações, camadas e a imagem/tela atual.\nDeseja limpar tudo e voltar ao início?"
                 : "Isso removerá todas as camadas e redefinirá os ajustes. Deseja continuar?"; // Mensagem diferente se só tiver camadas

            if (confirm(message)) {
                // Se tinha imagem e histórico, tenta voltar ao primeiro estado (imagem limpa)
                if ((originalImage || (imageCanvas && imageCanvas.width > 0)) && history.length > 0 && historyIndex >= 0) {
                    historyIndex = 0; // Vai para o início do histórico
                    loadState(history[historyIndex]); // Carrega o estado inicial salvo
                    history = history.slice(0, 1); // Mantém apenas o estado inicial no histórico
                    updateUndoRedoButtons(); // Atualiza botões undo/redo
                } else {
                    // Se não tinha imagem original ou histórico, reseta tudo completamente
                     resetAllStates(true);
                }
            }
        } else {
            alert("O editor já está limpo.");
        }
    });

    /**
     * Reseta completamente o estado do editor e a interface.
     * @param {boolean} [clearImageAndHistory=true] - Se true, remove também a imagem original e o histórico.
     */
    function resetAllStates(clearImageAndHistory = true) {
        console.log(`Resetando estados... Clear Image & History: ${clearImageAndHistory}`);

        // Reseta o objeto de estado principal para os padrões
        imageState = {
            brightness: 100, contrast: 100, mainOpacity: 1, mainScale: 1,
            rotation: 0, scaleX: 1, scaleY: 1, shapes: [],
            downloadFormat: 'jpeg', quality: 0.9, filter: 'none',
            currentShapeDefaults: { color: '#ff79c6', lineWidth: 5, fill: false } // Cor padrão neon
        };

        selectedShapeIndex = -1; // Nenhuma forma selecionada
        deactivateAllModes(); // Volta ao modo 'select'
        imageOverlayCache = {}; // Limpa cache de imagens sobrepostas

        if (clearImageAndHistory) {
            originalImage = null; // Remove imagem base
            history = []; // Limpa histórico
            historyIndex = -1;
            updateUndoRedoButtons(); // Atualiza botões undo/redo

            // Limpa preview e esconde controles de edição
            imagePreview.src = '#'; imagePreview.style.display = 'none';
            editingControls.style.display = 'none';

            // Redefine o canvas para um tamanho mínimo e limpa
            const defaultW = 10, defaultH = 10; // Tamanho placeholder mínimo
            if (ctx) { imageCanvas.width = defaultW; imageCanvas.height = defaultH; ctx.clearRect(0, 0, defaultW, defaultH); }
            if (tempCtx) { tempCanvas.width = defaultW; tempCanvas.height = defaultH; tempCtx.clearRect(0, 0, defaultW, defaultH); syncTempCanvasPosition(); tempCanvas.style.display = 'none'; }
        }

        // Atualiza toda a UI para refletir o estado resetado
        updateUIFromState();
        updateShapeControlsFromSelection(); // Garante que controles de forma estejam resetados/desabilitados
        updateUIPlaceholders(); // Define placeholders padrão
        updateCursorStyle(); // Reseta cursor
        deleteLayerBtn.disabled = true; // Desabilita botão deletar
        eyedropperResultContainer.style.display = 'none'; // Esconde resultado do conta-gotas

        // Redesenha e centraliza se não limpamos a imagem (ex: reset suave)
        if (!clearImageAndHistory && ctx) {
             redrawCanvas(); centerCanvasView();
        }
    }


    // --- Deletar Camada Selecionada ---
    deleteLayerBtn.addEventListener('click', () => {
        if (selectedShapeIndex !== -1) { // Só funciona se algo estiver selecionado
            if (confirm("Tem certeza que deseja remover a camada selecionada?\n(Esta ação pode ser desfeita)")) {
                 // Remove a forma do array `shapes`
                 imageState.shapes.splice(selectedShapeIndex, 1);
                 selectedShapeIndex = -1; // Desseleciona
                 // Atualiza UI
                 updateOverlayOpacityUI(); updateShapeControlsFromSelection();
                 deleteLayerBtn.disabled = true; // Desabilita botão deletar
                 redrawCanvas(); // Redesenha sem a forma removida
                 saveState(); // Salva o estado após a exclusão
            }
        }
    });

    // --- Lógica da Borracha ---
    /**
     * Verifica e apaga formas desenhadas sob as coordenadas (x, y).
     * Afeta apenas tipos 'pen', 'line', 'rect', 'circle', 'arrow'.
     * @param {number} x - Coordenada X no canvas.
     * @param {number} y - Coordenada Y no canvas.
     */
    function handleEraserInteraction(x, y) {
        let shapesDeleted = false; // Flag para saber se algo foi apagado
        // Tipos de formas que a borracha pode apagar
        const drawableTypes = ['pen', 'line', 'rect', 'circle', 'arrow'];

        // Itera de trás para frente para priorizar formas mais recentes
        for (let i = imageState.shapes.length - 1; i >= 0; i--) {
            const shape = imageState.shapes[i];
            // Pula se não for um tipo apagável
            if (!shape || !drawableTypes.includes(shape.type)) { continue; }

            // --- Converte coordenadas do mouse para o sistema local da forma (similar a getShapeInteraction) ---
            const angle = -shape.rotation;
            const cos = Math.cos(angle); const sin = Math.sin(angle);
            const dx_world = x - shape.x; const dy_world = y - shape.y;
            const currentScale = shape.scale || 1;
            const localXUnscaled = dx_world * cos - dy_world * sin;
            const localYUnscaled = dx_world * sin + dy_world * cos;
            const localX = currentScale !== 0 ? localXUnscaled / currentScale : localXUnscaled;
            const localY = currentScale !== 0 ? localYUnscaled / currentScale : localYUnscaled;

            const localBounds = getShapeLocalBounds(shape);
            if (!localBounds) continue; // Pula se não tiver limites

            // Define o raio/padding da borracha (um pouco generoso)
            const eraserBasePadding = 8 / (currentScale > 0 ? currentScale : 1); // Raio base ajustado pela escala
            const eraserThicknessPadding = (shape.thickness || 1) * 1.2 / (currentScale > 0 ? currentScale : 1) ; // Padding extra baseado na espessura, ajustado pela escala
            const eraserHitPadding = Math.max(eraserBasePadding, eraserThicknessPadding);
            let hitBody = false;

            // Lógica de hit test específica para borracha
            switch (shape.type) {
                 case 'pen': // Bounding box para caneta
                 case 'rect': // Bounding box ou distância aos segmentos para retângulo
                      hitBody = localX >= localBounds.x - eraserHitPadding && localX <= localBounds.x + localBounds.width + eraserHitPadding &&
                                localY >= localBounds.y - eraserHitPadding && localY <= localBounds.y + localBounds.height + eraserHitPadding;
                       if (shape.type === 'rect' && !shape.fill) { // Se for contorno, verifica distância aos segmentos
                             const w = localBounds.width; const h = localBounds.height; const x0 = localBounds.x; const y0 = localBounds.y;
                             const p = {x: localX, y: localY};
                             hitBody = pointToLineSegmentDistance(p, {x:x0, y:y0}, {x:x0+w, y:y0}) <= eraserHitPadding ||
                                       pointToLineSegmentDistance(p, {x:x0+w, y:y0}, {x:x0+w, y:y0+h}) <= eraserHitPadding ||
                                       pointToLineSegmentDistance(p, {x:x0+w, y:y0+h}, {x:x0, y:y0+h}) <= eraserHitPadding ||
                                       pointToLineSegmentDistance(p, {x:x0, y:y0+h}, {x:x0, y:y0}) <= eraserHitPadding;
                       }
                     break;
                 case 'circle':
                     const distSq = localX**2 + localY**2;
                     const outerRadius = localBounds.radius + eraserHitPadding;
                     if (shape.fill) { hitBody = distSq <= outerRadius**2; }
                     else { const innerRadius = Math.max(0, localBounds.radius - eraserHitPadding); hitBody = distSq >= innerRadius**2 && distSq <= outerRadius**2; }
                     break;
                 case 'line':
                 case 'arrow':
                     const p = { x: localX, y: localY };
                     const start = { x: shape.startX, y: shape.startY };
                     const end = { x: shape.endX, y: shape.endY };
                     const dist = pointToLineSegmentDistance(p, start, end);
                     hitBody = dist <= eraserHitPadding;
                     break;
            }


            // Se a borracha atingiu a forma
            if (hitBody) {
                 console.log(`Borracha atingiu ${shape.type} índice ${i}`);
                 imageState.shapes.splice(i, 1); // Remove a forma do array
                 shapesDeleted = true; // Marca que algo foi apagado

                 // Ajusta o índice selecionado se a forma apagada era a selecionada ou anterior
                 if (i === selectedShapeIndex) { selectedShapeIndex = -1; }
                 else if (i < selectedShapeIndex) { selectedShapeIndex--; } // Decrementa índice selecionado

                 // Importante: Não sai do loop, continua verificando se outras formas foram atingidas
            }
        }

        // Se alguma forma foi apagada, atualiza a UI e o canvas
        if (shapesDeleted) {
             if (selectedShapeIndex === -1) { // Se a forma selecionada foi apagada
                  updateOverlayOpacityUI(); updateShapeControlsFromSelection();
                  deleteLayerBtn.disabled = true; // Desabilita botão deletar
             }
             redrawCanvas(); // Redesenha sem as formas apagadas
             // Não salva estado aqui, espera o mouseup ou mouseleave
        }
    }

    // --- Função: Criar Tela em Branco ---
    /**
     * Cria uma nova tela em branco com dimensões específicas, resetando o estado atual.
     * @param {number} [initialWidth=800] - Largura inicial.
     * @param {number} [initialHeight=400] - Altura inicial.
     */
    function createBlankCanvas(initialWidth = 800, initialHeight = 400) {
        console.log(`Criando tela em branco ${initialWidth}x${initialHeight}`);
        resetAllStates(true); // Reseta tudo, incluindo imagem e histórico

        // Define as dimensões dos canvas
        imageCanvas.width = initialWidth; imageCanvas.height = initialHeight;
        tempCanvas.width = initialWidth; tempCanvas.height = initialHeight;
        if(ctx) ctx.clearRect(0,0,initialWidth, initialHeight); // Limpa explicitamente
        if(tempCtx) tempCtx.clearRect(0,0,initialWidth, initialHeight); // Limpa explicitamente

        // Garante que a imagem original seja nula e o estado esteja limpo
        originalImage = null;
        imageState.rotation = 0; imageState.scaleX = 1; imageState.scaleY = 1; imageState.mainScale = 1; imageState.shapes = []; selectedShapeIndex = -1;

        // Atualiza UI para refletir a tela em branco
        updateUIPlaceholders(); // Define placeholders corretos
        widthInput.placeholder = initialWidth; heightInput.placeholder = initialHeight; // Define placeholders
        widthInput.value = ''; heightInput.value = ''; // Limpa inputs

        updateUIFromState(); updateShapeControlsFromSelection();
        redrawCanvas(); centerCanvasView();

        // Mostra controles de edição e esconde preview de imagem
        editingControls.style.display = 'block';
        imagePreview.src = '#'; imagePreview.style.display = 'none';

        // Reseta histórico (já feito em resetAllStates, mas reforça)
        history = []; historyIndex = -1; updateUndoRedoButtons();

        // Salva o estado inicial da tela em branco APÓS um pequeno delay
        // para garantir que tudo foi processado
        setTimeout(saveState, 50);

        console.log("Tela em branco pronta.");
    }

    // --- Listener Botão "Tela em Branco" ---
    createBlankCanvasBtn.addEventListener('click', () => {
        // Pede confirmação se houver conteúdo
        const hasContent = originalImage || imageState.shapes.length > 0 || history.length > 0;
        if (hasContent) {
            if (!confirm("Isso descartará qualquer trabalho não salvo.\nCriar nova tela em branco?")) {
                 return; // Cancela se o usuário não confirmar
            }
        }
        // Define dimensões padrão (poderia pegar de inputs se quisesse)
        let w = 800, h = 400;
        createBlankCanvas(w, h);
    });

    // --- Atualizar Ano do Rodapé ---
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }


    // --- Inicialização Final ---
    editingControls.style.display = 'none'; // Controles ocultos inicialmente
    resetAllStates(true); // Garante estado limpo no carregamento inicial
    updateActiveToolButton(); // Define o botão 'select' como ativo

    console.log("--- DOMContentLoaded FINALIZOU (v4.4.9 - Tema Escuro Aplicado) ---");

}); // Fim do DOMContentLoaded
// --- FIM DO SCRIPT.JS ---