// ==UserScript==
// @name         Playwire-2-HTML5
// @namespace    http://your.homepage/
// @version      0.9.5
// @description  Transforma os players do Playwire em tags <video>
// @author       Rafael Sirotheau
// @match        http://jesusmanero.blog.br/*
// @grant        none
// ==/UserScript==

var t;
var intervalMS = 1000;
var runScript = true;
var version = 'v0.9.5';

jQuery(function($) {
    
    console.log('[Playwire Remover '+version+'] Buscando vídeo(s) Playwire...');
    
    // Busca a DIV com o video
    var $DIV = $("div[id^='zeus']");
    var $SCRIPT = $('script[src="//cdn.playwire.com/bolt/js/embed.min.js"]');
    
    if(!$DIV.length && !$SCRIPT.length) {
        console.log('[Playwire Remover '+version+'] Nenhum Playwire encontrado. Finalizando o script.');
        return false;
    }
    
    var counter = $DIV.length + $SCRIPT.length;
    
    console.log('[Playwire Remover '+version+'] Encontrado '+counter+' video(s) playwire.');
    
    t = setInterval(function() {
        
        // Se não foi encontrado nenhum. Finaliza script.
        if(!runScript) {
            clearInterval(t);
            return false;
        }
        var endIt = true;
        
        var video_count = 0;
        
        $DIV.each(function(index) {
            console.log($(this)[0].innerHTML);
            // Recupera o valor do SRC
            var videoSRC = $(this).data('default-src');
            
            // Checa se está pronto.
            if(typeof videoSRC === 'undefined') {
                console.log('[Playwire Remover '+version+'] Vídeo '+(index+1)+' ainda não possue data. Indo para o próximo (se houver).');
                endIt = false;
                return true;
            }
            if($(this).data('removed')) {
                return true;
            }
            console.log('[Playwire Remover '+version+'] Pronto! Checando se o '+(index+1)+'º vídeo é .mp4 ...');
        
            //Checa se o vídeo é .mp4
            var check = videoSRC.split('/');
                check = check[check.length-1].split('?');
                check = check[0].split('.');

            console.log('[Playwire Remover '+version+'] Video SRC: '+videoSRC);
            
            // Se for .mp4, troca o player
            if(check[1] == 'mp4') {
                console.log('[Playwire Remover '+version+'] Legal! O '+(index+1)+'º vídeo é .mp4! Trocando para a tag <video> ...');
                $(this).html('<video width="640" height="360" controls><source src="'+videoSRC+'" type="video/mp4">Your browser does not support the video tag.</video>');

                $(this).data('removed',true)
            }
            
            console.log('[Playwire Remover '+version+'] Playwire removido do '+(index+1)+'º vídeo!');
            
            video_count++;
        
        });
        
        $SCRIPT.each(function(index) {
            // Recupera o valor do SRC
            var jsonSRC = $(this).data('config'),
                $currentContainer = $(this).parent();

            // Checa se está pronto.
            if(typeof jsonSRC === 'undefined') {
                console.log('[Playwire Remover '+version+'] Vídeo '+(video_count+index+1)+' ainda não possue data. Indo para o próximo (se houver).');
                endIt = false;
                return true;
            }
            if($(this).data('removed')) {
                return true;
            }
            console.log('[Playwire Remover '+version+'] Pronto! Checando se o '+(video_count+index+1)+'º vídeo é .mp4 ...');
            
            $(this).data('removed',true);

            $.getJSON( jsonSRC, function( data ) {
                console.log('[Playwire Remover '+version+'] JSON Loaded. data.src = ',data.src);
                var currentVideoIndex = video_count+index+1;
                
                jQuery.ajax({
                    type: "GET",
                    url: "http://config.playwire.com/15710/videos/v2/3083646/manifest.f4m",
                    dataType: "xml",
                    success: function (xml) {

                        // Parse the xml file and get data
                        var $xml = jQuery(xml.getElementsByTagName('manifest'));

                        var videoSRC = $xml.children('baseUrl').text() + "/" + $xml.children('media').attr('url');
                        
                        //Checa se o vídeo é .mp4
                        var check = videoSRC.split('/');
                            check = check[check.length-1].split('?');
                            check = check[0].split('.');

                         console.log('[Playwire Remover '+version+'] Video SRC: '+videoSRC);
            
                        // Se for .mp4, troca o player
                        if(check[1] == 'mp4') {
                            console.log('[Playwire Remover '+version+'] Legal! O '+currentVideoIndex+'º vídeo é .mp4! Trocando para a tag <video> ...');
                            $currentContainer.html('<video style="background-color: black" width="640" height="360" controls><source src="'+videoSRC+'" type="video/mp4">Your browser does not support the video tag.</video>');

                        }
                        
                        console.log('[Playwire Remover '+version+'] Playwire removido do '+currentVideoIndex+'º vídeo!');

                    }
                });
            });
        
        });

        if(endIt) {
            console.log('[Playwire Remover '+version+'] Todos os Playwires removidos. Finalizando script.')
            clearInterval(t);
        } else {
            console.log('[Playwire Remover '+version+'] Ainda existem Playwires a remover. Tentando novamente em '+intervalMS+'ms')
        }
       
    },intervalMS);
});