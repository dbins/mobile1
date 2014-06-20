		//Funcoes especificas do Phonegap
		
		var celular_modelo = "";	
		var celular_plataforma = "";
		var celular_uuid = "";
		var celular_versao = "";
		var isPhoneGapReady = false;
		var isConnected = false;
		var isHighSpeed = false;
		
		
		// Wait for device API libraries to load
		// device APIs are available
		//
		
		document.addEventListener("deviceready", onDeviceReady, false);
		 
		function onDeviceReady() {
			isPhoneGapReady = true;
			// detect for network access
			networkDetection();
			// attach events for online and offline detection
			document.addEventListener("online", onOnline, false);
			document.addEventListener("offline", onOffline, false);
			
			var conteudo = "";
			conteudo = conteudo + 'Modelo: '    + device.model    + '<br />';
			conteudo = conteudo + 'Plataforma: ' + device.platform + '<br />';
			conteudo = conteudo + 'UUID: '     + device.uuid     + '<br />';
			conteudo = conteudo + 'Versão: '  + device.version  + '<br />';
			
			celular_modelo = device.model;
			celular_plataforma = device.platform;
			celular_uuid = device.uuid;
			celular_versao = device.version;
			
			$("#content_news").append(conteudo);					
		}
		
		function networkDetection() {
			if (isPhoneGapReady) {
				// as long as the connection type is not none,
				// the device should have Internet access
				if (navigator.network.connection.type != Connection.NONE) {
					isConnected = true;
				}
				// determine whether this connection is high-speed
				switch (navigator.network.connection.type) {
					case Connection.UNKNOWN:
					case Connection.CELL_2G:
					isHighSpeed = false;
					break;
					default:
					isHighSpeed = true;
					break;
				}
			}
		}
		
		function onOnline() {
			isConnected = true;
		}
		function onOffline() {
			isConnected = false;
		}
			
		$(document).on('pageinit', '#noticias', function(){  
			if (isConnected) {
				//Nao faz nada
			} else {
				alert('Não existe conexão com a Internet');
				$.mobile.changePage("#pageone");
			}
		});
		
		$(document).on('pageinit', '#cotacao', function(){  
			if (isConnected) {
				//Nao faz nada
			} else {
				alert('Não existe conexão com a Internet');
				$.mobile.changePage("#pageone");
			}
		});
		
		$(document).on('pageinit', '#conversor', function(){  
			if (isConnected) {
				//Nao faz nada
			} else {
				alert('Não existe conexão com a Internet');
				$.mobile.changePage("#pageone");
			}
		});
		
		$(document).on('pageinit', '#faleconosco', function(){  
			if (isConnected) {
				//Nao faz nada
			} else {
				alert('Não existe conexão com a Internet');
				$.mobile.changePage("#pageone");
			}
		});


		//Funcoes da aplicacao	
		
		var dolar = 0;
		var euro = 0;
		
		function echeck(str) {

			var at="@"
			var dot="."
			var lat=str.indexOf(at)
			var lstr=str.length
			var ldot=str.indexOf(dot)
			if (str.indexOf(at)==-1){
			   //alert("Invalid E-mail ID")
			   return false
			}

			if (str.indexOf(at)==-1 || str.indexOf(at)==0 || str.indexOf(at)==lstr){
			   //alert("Invalid E-mail ID")
			   return false
			}

			if (str.indexOf(dot)==-1 || str.indexOf(dot)==0 || str.indexOf(dot)==lstr){
				//alert("Invalid E-mail ID")
				return false
			}

			 if (str.indexOf(at,(lat+1))!=-1){
				//alert("Invalid E-mail ID")
				return false
			 }

			 if (str.substring(lat-1,lat)==dot || str.substring(lat+1,lat+2)==dot){
				//alert("Invalid E-mail ID")
				return false
			 }

			 if (str.indexOf(dot,(lat+2))==-1){
				//alert("Invalid E-mail ID")
				return false
			 }
			
			 if (str.indexOf(" ")!=-1){
				//alert("Invalid E-mail ID")
				return false
			 }

			 return true					
		}

		
		$(document).ready(function() {
			
			//Noticias
			$.ajax({
				type: "GET",
				url: "https://ajax.googleapis.com/ajax/services/feed/load?v=2.0&q=http://feeds.folha.uol.com.br/mercado/rss091.xml&num=20",
				dataType: "jsonp",
				success: function(data) {
					var conteudo = "";
					$.each(data.responseData.feed.entries, function(key1, val1) {
						//alert(val1.content);
						//val1.title;
						//val1.content;
						//val1.link;
						//publishedDate;
						
						conteudo = conteudo + '<div data-role="collapsible">';
						conteudo = conteudo + '<h3>' + val1.title + '</h3>';
						conteudo = conteudo + '<p>' + val1.content + '</p>';
						conteudo = conteudo + '</div>';
						
					});
					//alert(conteudo);
					$("#content_news").append(conteudo);
					$("#content_news" ).collapsibleset( "refresh" );

				}
			});
			
			//Cotacao
			// Dolar $ e Euro €
			$.getJSON( "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.xchange%20where%20pair%3D%22EURBRL%2CUSDBRL%22&format=json&diagnostics=false&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys", function( data ) {
				var conteudo = "";
				
				euro = data.query.results.rate[0].Rate;
				dolar = data.query.results.rate[1].Rate;
				
				conteudo = conteudo + '<li><strong>EURO</strong> R$ '+money(data.query.results.rate[0].Rate)+'</li>';
				conteudo = conteudo + '<li><strong>DOLAR</strong> R$ '+money(data.query.results.rate[1].Rate)+'</li>';
				$("#content_list_cotacao").append(conteudo);
				$('#content_list_cotacao').listview('refresh');

			});
			
			money = function(n){
				var 
					c = 2, 
					d = ',', 
					t = '.', 
					s = n < 0 ? "-" : "", 
					i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", 
					j = (j = i.length) > 3 ? j % 3 : 0;
				return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
			 };
		
		});	
		
		$(document).on('pageinit', '#faleconosco', function(){  
        $(document).on('click', '#enviar_contato', function() { // catch the form's submit event
		
			var field_tag_css = {
				"background-color": "#FFFF99"
			  }
			var continuar = true;
			var mensagem ="Ocorreram os seguintes erros:\n"
			
			if ($('#nome_contato').val() == "") {
				mensagem = mensagem + 'Prencha o seu nome\n';
				$('#nome_contato').css(field_tag_css);
				continuar = false;
			}

			if ($('#email_contato').val() == "") {
				mensagem = mensagem +  'Digite o endereco de e-mail\n';
				$('#email_contato').css(field_tag_css);
				continuar = false;
			} else {
				if (echeck($('#email_contato').val())==false){
				mensagem = mensagem + 'Preencha corretamente o endereco de e-mail\n';
				continuar = false;
				}
			}


			if ($('#mensagem_contato').val() == "") {
				mensagem = mensagem + 'Prencha a mensagem que deseja enviar\n';
				$('#mensagem_contato').css(field_tag_css);
				continuar = false;
			}
			
		
			if (continuar){
				// Send data to server through the ajax call
				// action is functionality we want to call and outputJSON is our data
				//formData : $('#check-contato').serialize()
					$.ajax({url: 'http://www.gotasdecidadania.com.br/novo/programado/ajax_contato.php',
						data: {action : 'enviar', nome: $('#nome_contato').val(), email: $('#email_contato').val(), ddd_telefone: '00', numero_telefone: '00000000', mensagem: $('#mensagem_contato').val()},
						type: 'post',                   
						async: 'true',
                        dataType: 'text',
						beforeSend: function() {
							// This callback function will trigger before data is sent
							$.mobile.loading('show', {
								theme: "a",
								text: "Aguarde...",
								textonly: true,
								textVisible: true
							});
													},
						complete: function() {
							// This callback function will trigger on data sent/received complete
							$.mobile.loading('hide'); // This will hide ajax spinner
						},
						success: function (result) {
							alert(result);
							if(result =="OK") {
								alert('Obrigado por enviar sua mensagem!'); 
								$.mobile.changePage("#pageone");							
							} else {
							    alert('Erro ao gravar suas informacoes!'); 
							}
						},
						error: function (request,error) {
							// This callback function will trigger on unsuccessful action                
							alert('Houve um erro ao enviar suas informações!');
						}
					});                   
			} else {
				alert(mensagem);
				//return false;
			}           
            return false; // cancel original event to prevent form submitting
        });    
		});
		
		
		$(document).on('pageinit', '#conversor', function(){  
        $(document).on('click', '#calcular_conversao', function() { // catch the form's submit event
			
			var field_tag_css = {
				"background-color": "#FFFF99"
			  }
			var continuar = true;
			var mensagem ="Ocorreram os seguintes erros:\n"
			
			if ($('#valor_conversao').val() == "") {
				mensagem = mensagem + 'Prencha o valor a ser convertido\n';
				$('#valor_conversao').css(field_tag_css);
				continuar = false;
			} else {
				valor = $('#valor_conversao').val();			
			}

			if (continuar){
				var tipo = $('#tipo_conversao').val();
				var resultado = 0;
				var mensagem_resultado = "";
				alert(dolar);
				alert(tipo);
				switch (Math.abs(tipo)) {
				 case 1:
					 resultado = Math.abs(valor) / Math.abs(dolar);
					 break;
				 case 2:
					 resultado = Math.abs(valor) / Math.abs(euro);
					 break;
				 case 3:
					 resultado =  Math.abs(valor) * Math.abs(dolar);
					 break;
				 case 4:
					 resultado = Math.abs(valor) * Math.abs(euro);
					 break;
				}
				var mensagem_resultado = "O resultado da conversão é de " + money(resultado);
				alert(mensagem_resultado)
			} else {
				alert(mensagem);
				//return false;
			}           
            return false; // cancel original event to prevent form submitting
        });    
		});
			 