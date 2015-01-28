// ==UserScript==
// @name         Playwire-2-HTML5
// @namespace    http://your.homepage/
// @version      0.9.0
// @description  Transforma os players do Playwire em tags <video>
// @author       Rafael Sirotheau
// @match        http://jesusmanero.blog.br/*
// @grant        none
// ==/UserScript==

var t;
var intervalMS = 1000;
var runScript = true;
jQuery(function($) {
    
    console.log('[Playwire Remover v1.0] Buscando vídeo(s) Playwire...');
    
    // Busca a DIV com o video
    var $DIV = $("div[id^='zeus']");
    if(!$DIV.length) {
        console.log('[Playwire Remover v1.0] Nenhum Playwire encontrado. Finalizando o script.');
    }
    
    console.log('[Playwire Remover v1.0] Encontrado '+$DIV.length+' video(s) playwire.');
    
    t = setInterval(function() {
        
        // Se não foi encontrado nenhum. Finaliza script.
        if(!runScript) {
            clearInterval(t);
            return false;
        }
        var endIt = true;
        
        $DIV.each(function(index) {
            console.log($(this)[0].innerHTML);
            // Recupera o valor do SRC
            var videoSRC = $(this).data('default-src');
            
            // Checa se está pronto.
            if(typeof videoSRC === 'undefined') {
                console.log('[Playwire Remover v1.0] Vídeo '+(index+1)+' ainda não possue data. Indo para o próximo (se houver).');
                endIt = false;
                return true;
            }
            if($(this).data('removed')) {
                return true;
            }
            console.log('[Playwire Remover v1.0] Pronto! Checando se o '+(index+1)+'º vídeo é .mp4 ...');
        
            //Checa se o vídeo é .mp4
            var check = videoSRC.split('/');
                check = check[check.length-1].split('?');
                check = check[0].split('.');

            console.log('[Playwire Remover v1.0] Video SRC: '+videoSRC);
            
            // Se for .mp4, troca o player
            if(check[1] == 'mp4') {
                console.log('[Playwire Remover v1.0] Legal! O '+(index+1)+'º vídeo é .mp4! Trocando para a tag <video> ...');
                $(this).html('<video width="640" height="360" controls><source src="'+videoSRC+'" type="video/mp4">Your browser does not support the video tag.</video>');

                $(this).data('removed',true)
            }
            
            console.log('[Playwire Remover v1.0] Playwire removido do '+(index+1)+'º vídeo!');
            
        
        
        });

        if(endIt) {
            console.log('[Playwire Remover v1.0] Todos os Playwires removidos. Finalizando script.')
            clearInterval(t);
        } else {
            console.log('[Playwire Remover v1.0] Ainda existem Playwires a remover. Tentando novamente em '+intervalMS+'ms')
        }
       
    },intervalMS);
});