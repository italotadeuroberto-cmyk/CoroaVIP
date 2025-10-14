<?php
function otimizarImagem($caminhoOriginal) {
    if (!extension_loaded('imagick')) {
        die("Imagick não está instalado.");
    }

    $imagem = new Imagick($caminhoOriginal);
    $formatoOriginal = $imagem->getImageFormat();

    // Otimização
    if (in_array($formatoOriginal, ['JPEG', 'JPG', 'PNG'])) {
        $imagem->setImageCompressionQuality(70);
        $imagem->stripImage(); // remove metadata
        $novoCaminho = preg_replace('/\.(jpe?g|png)$/i', '-otimizado.$1', $caminhoOriginal);
        $imagem->writeImage($novoCaminho);
        echo "Imagem otimizada: $novoCaminho<br>";
    }

    // Conversão para WebP
    $imagem->setImageFormat('webp');
    $caminhoWebP = preg_replace('/\.(jpe?g|png)$/i', '.webp', $caminhoOriginal);
    $imagem->writeImage($caminhoWebP);
    echo "Convertida para WebP: $caminhoWebP<br><br>";

    $imagem->clear();
    $imagem->destroy();
}

function buscarImagensRecursivamente($diretorio) {
    $arquivos = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($diretorio, FilesystemIterator::SKIP_DOTS)
    );

    foreach ($arquivos as $arquivo) {
        if ($arquivo->isFile()) {
            $extensao = strtolower(pathinfo($arquivo, PATHINFO_EXTENSION));
            if (in_array($extensao, ['jpg', 'jpeg', 'png'])) {
                otimizarImagem($arquivo->getPathname());
            }
        }
    }
}

// Executar a partir da raiz do site
$raiz = __DIR__; // ou coloque outro caminho base se quiser
buscarImagensRecursivamente($raiz);
?>
