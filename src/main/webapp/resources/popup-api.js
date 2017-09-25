var frameSrc = "http://localhost:8080/assijus/popup.html";
frameSrc = "https://ittrufusion.appspot.com";
frameSrc = "https://assijus.trf2.jus.br/assijus";
frameSrc = "http://localhost:8080/assijus/index1.html";
frameSrc = "http://localhost:8080/assijus/index.html";
frameSrc = "http://localhost:8080/assijus/popup.html";

function receiveMessageAssinaturaDigital(event) {
	if (event.origin !== "http://localhost:8080")
		return;

	// console.log('Sistema recebeu mensagem: ', event)

	var iframe = document.getElementById('iframeAssinaturaDigital');
	var iframeWindow = iframe.contentWindow;

	if (event.data.command === '<READY>') {
		iframeWindow.postMessage({
			command : '<BEGIN>',
			docs : window._AssinaturaDigitalParametros.docs
		}, '*');
	}

	if (event.data.command === '<HASH-REQUEST>') {
		window._AssinaturaDigitalParametros.hashCallback(event.data.id,
				function(params) {
					iframeWindow.postMessage({
						command : '<HASH-RESPONSE>',
						params : params
					}, '*');
				})
	}

	if (event.data.command === '<SAVE-REQUEST>') {
		window._AssinaturaDigitalParametros.saveCallback(event.data.id,
				event.data.sign, function(params) {
					iframeWindow.postMessage({
						command : '<SAVE-RESPONSE>',
						params : params
					}, '*');
				})
	}

	if (event.data.command === '<END-REQUEST>') {
		window._AssinaturaDigitalParametros.dismissCallback(function(params) {
			iframeWindow.postMessage({
				command : '<END-RESPONSE>'
			}, '*');
		})
	}

	if (event.data.command === '<END-REQUEST>') {
		window._AssinaturaDigitalParametros.dismissCallback(function(params) {
			iframeWindow.postMessage({
				command : '<END-RESPONSE>'
			}, '*');
		})
	}

	if (event.data.command === '<SET-HEIGHT>') {
		iframe.style.height = event.data.height;
	}
}

var produzirAssinaturaDigital = function(params) {
	window._AssinaturaDigitalParametros = params;

	window.addEventListener("message", receiveMessageAssinaturaDigital, false);

	var popupTemplate = '<div class="modal fade">'
			+ '  <div class="modal-dialog">'
			+ '    <div class="modal-content">'
			+ '      <div class="modal-header">'
			+ '        <button type="button" class="close" data-dismiss="modal">&times;</button>'
			+ '        <h4 class="modal-title">Assinatura Digital</h4>'
			+ '      </div>' + '      <div class="modal-body">'
			+ '        <iframe id="iframeAssinaturaDigital" src="' + frameSrc
			+ '" width="99.6%" frameborder="0"></iframe>' + '      </div>';

	var dlg = $(popupTemplate);
	dlg.modal({
		show : true
	});

	params.dismissCallback = function() {
		dlg.modal('hide');
		setTimeout(function() {
			dlg.remove();
		}, 1000);
	}

}