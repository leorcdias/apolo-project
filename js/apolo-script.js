/* VARIABLES */
const replaceAttr = ["88", "102"]; // Códigos de atributos para corrigir vírgula
const unidMeter = ["fechos-de-contato", "ziperes"]; // Categorias que deve-se arrumar unidades de medida
const jQueryModal = {
	"name": "jQuery Modal",
	"script": "https://cdn.jsdelivr.net/gh/leorcdias/apolo-project@latest/jmodal/jquery.modal.min.js",
	"css": "https://cdn.jsdelivr.net/gh/leorcdias/apolo-project@latest/jmodal/jquery.modal.min.css"
}
const vTimeline = {
	"name": "Vertical Timeline",
	"script": "",
	"css": "https://cdn.jsdelivr.net/gh/leorcdias/apolo-project@latest/vtimeline/assets/css/style.min.css"
}

// Take hash on URL
var target = window.location.hash.replace('#', '');
window.location.hash = "";

$(window).on('load', function () {
	if (target) {
		$('html, body').animate({
			scrollTop: $("#" + target).offset().top
		}, 700, 'swing');
	}
	if (checkURL("/carrinho")) {
		setTimeout(function () {
			carrinhoVazio();
		}, 300);
	}

	welcomeMsgModal();
});

$(document).ready(function () {

	$.cachedScript(jQueryModal.script).done(function () {
		loadCSS(jQueryModal.css);
	});

	let welcomePopup = window.sessionStorage.getItem('welcomePopup');
	if (welcomePopup === null) {
		window.sessionStorage.setItem('welcomePopup', "1");
	}

	Tawk_API.onLoad = function () {
		chatStatus('verificar');
	}
	Tawk_API.onStatusChange = function () {
		chatStatus('verificar');
	}

	$("#banner-main > li:nth-of-type(3) > a, #banner-main > li:nth-of-type(4) > a, .chat-open").on("click", function (e) {
		ChatOpenClick(e);
	});

	vTimelineAnimation();

	registerForm();

	welcomeMsg();

	SiteManutencao();

	carrinhoVazio();

	CorrecaoFiltros();

	CorrecaoListaProduto404();

	CorrecaoAtributosProduto();

	CorrecaoUnidadeMedida();
});


// Anchor ID Scroll Animations
/*$('#header-main .element-search .welcome-message a[href*="#"], #vitrine a[href*="#"]').on('click', function (e) {
		e.preventDefault();
		$('html, body').animate({
			scrollTop: $(this.hash).offset().top - 100
		}, 1000);
	});*/

/* CHAT STATUS */
function chatStatus(tipo) {
	Tawk_API = Tawk_API || {};
	statusChat = Tawk_API.getStatus();
	if (tipo === 'verificar') {
		if (!Tawk_API.isVisitorEngaged()) {
			if (statusChat === 'offline' && !Tawk_API.isChatHidden()) {
				Tawk_API.hideWidget();
			}
			else if ((statusChat === 'online' || statusChat === 'away') && Tawk_API.isChatHidden()) {
				Tawk_API.showWidget();
			}
		}
	}
	else if (tipo === 'clique') {
		if (statusChat !== 'offline' && !Tawk_API.isChatHidden()) {
			Tawk_API.maximize();
		}
		else {
			modalChatOffline();
		}
	}
	else if (tipo === 'manutencao') {
		Tawk_API.hideWidget();
	}
}

/* WELCOME MESSAGE MODAL */
const welcomeModal = `
<div class='jmodal welcomeModal' id='welcomeModal'>
<div class='modal-header text-align-center'>
<p>SE LIGA NESSE SUPER LANÇAMENTO! <i class="em em-star-struck">&nbsp;</i></p>
</div>
<div class='modal-content has-modal-footer'>
<img src='https://cdn.simplo7.net/static/26968/galeria/155068258550365.jpg' style='margin:0 auto;margin-bottom:10px;'alt='Super Lançamento - Tecido Cristal Camaleão' title='Super Lançamento - Tecido Cristal Camaleão' />
<p>Na última semana de moda a <strong><i>Louis Vuitton</i></strong> desfilou as tendências para o Verão da Moda Masculina <i>(Spring-Summer 2019)</i> com seu novo diretor criativo Vigil Abloh.</p>
<p>Nesse desfile eles apostaram no efeito furta-cor, que é igual ao produto <strong>CRISTAL CAMALEÃO</strong>, sucesso de vendas para a linha feminina, de etiquetas, bolsas e brindes.</p>
<p style="text-transform:uppercase"><strong>Não fique de fora dessa super tendência. Corra e adquira agora mesmo!</strong> <i class="em em-fire">&nbsp;</i></p>
<div class='modal-footer' style="text-align:center;"><button class='btn' type='button' onclick='window.location.href="https://www.apoloartes.com.br/contato"'><span class='btn-text'>EU QUERO!</span></button></div>
</div>
</div>
`
function welcomeMsgModal() {
	if (welcomePopup === "1") {
		if (!$("#welcomeModal").length) {
			$("body").append(welcomeModal);
		}
		setTimeout(function () {
			$("#welcomeModal").modal();
		}, 3000);
	}
	$('#welcomeModal').on($.modalj.CLOSE, function (event, modal) {
		window.sessionStorage.setItem('welcomePopup', "0");
	});
}

/* CHAT MODAL */
const chatOfflineModal = `
<div class='jmodal chat-offline' id='chat-offline'>
    <div class='modal-header'>
        <p>Ops... Nosso chat está offline <i class='em em-disappointed'>&nbsp;</i></p>
    </div>
    <div class='modal-content has-modal-footer'>
        <img alt='Chat Offline' src='https://cdn.simplo7.net/static/26968/galeria/154835550888006.png' style='height:100px;margin:0 auto;margin-bottom:10px;'
            title='Estamos offline :(' />
        <p>Nosso horário de atendimento é das <strong>8:00h às 17:30h</strong> de <strong>segunda à sexta-feira</strong>,
            exceto feriados.</p>
        <p>Mas calma, não se desespere <i class='em em-grinning'>&nbsp;</i>. Entre em contato com a gente pela
            nossa <strong>Central de Atendimento</strong> clicando no botão abaixo. Responderemos você o mais
            rápido possível!</p>
        <div class='modal-footer'><button class='btn' type='button' onclick='window.location.href="https://www.apoloartes.com.br/contato"'><span class='btn-text'>Central de Atendimento</span></button></div>
    </div>
</div>
`

function modalChatOffline() {
	if (!$("#chat-offline").length) {
		$("body").append(chatOfflineModal);
	}
	$("#chat-offline").modal();
}

/* LOAD CSS'S */
loadCSS = function (href) {
	const cssLink = $("<link>");
	$("head").append(cssLink); //IE hack: append before setting href
	cssLink.attr({
		rel: "stylesheet",
		type: "text/css",
		href: href
	});
};

/* LOAD SCRIPTS */
$.cachedScript = function (url, options) {
	options = $.extend(options || {}, {
		dataType: "script",
		cache: true,
		url: url
	});
	return $.ajax(options);
};

/* CHAT CLICK TO OPEN NO REDIRECT */
function ChatOpenClick(e) {
	if (e) { e.preventDefault(); }
	chatStatus('clique');
	return false;
}

/* CHECK PAGE URL */
function checkURL(url) {
	if (window.location.href.indexOf(url) > -1) return true;
	else return false;
}

/* VERTICAL TIMELINE */
function vTimelineAnimation() {
	if (checkURL("quem-somos")) {
		loadCSS(vTimeline.css);
		const vTimelineItems = $("#vTimeline .vTimeline-item .vTimeline-icon");
		$(window).on("load scroll", function () {
			$("#vTimeline .vTimeline-item").each(function () {
				let el = $(this);
				let eleHeight = el.outerHeight();
				let eleTopo = el.offset().top;
				let scrlTopo = $(window).scrollTop();
				let distance = eleTopo - scrlTopo;
				let altJanela = window.innerHeight;
				if (distance <= (altJanela * 0.7) - (eleHeight / 2)) {
					vTimelineItems.removeClass("active");
					el.find(".vTimeline-icon").addClass("active");
				}
				else {
					el.find(".vTimeline-icon").removeClass("active");
				}
			});
		});
	}
}

function CompraIndisponivel() {
	$(".wrapper-product-home > p").append(" Em breve disponível para compra online!");
}

/* SITE EM MANUTENÇÃO */
function SiteManutencao() {
	if (checkURL("manutencao")) {
		Tawk_API.onLoad = function () {
			chatStatus('manutencao');
		};
		document.title = "Apolo Artes – Loja Online de Artigos para Calçados e Moda";
		$(".page-content > p:last-of-type").remove();
		$(".wa-chat-header").remove();
		$(".title-manutencao").text("Nova Loja Virtual em Construção!");
		$(".title-manutencao ~ p:first-of-type").text("Nossa loja encontra-se em construção. Em breve uma nova loja para você, repleta de novidades!");
	}
}

/* LOGIN & REGISTER PAGE */
function registerForm() {
	const registerRedirect = `
	<div class="wrapper-form-login" id="wrapper-form-register">
		<div class="header-box-content">
			<h2>Ainda não possui conta?</h2>
		</div>
		<form action="/clientes/add" method="post" accept-charset="utf-8">
			<div class="row">
				<button class="btn" type="submit">
					<span class="btn-icon"></span>
					<span class="btn-text">Criar Conta</span>
				</button>
			</div>
		</form>
	</div>
	`
	if (checkURL("/clientes/login")) {
		if (!$(".wrapper-register").length) {
			$(".wrapper-form-login").after(registerRedirect);
		}
	}

}

/* WELCOME MESSAGE */
function welcomeMsg() {
	const welcomeMsg = $("#header-main .element-search .welcome-message");
	let welcomeMsgTxt = `Visitante! Faça seu <a href="/clientes/login#vitrine" title="Fazer login">login</a> ou <a href="/clientes/add#vitrine" title="Cadastrar uma nova conta">cadastre-se</a>`
	if (welcomeMsg.length) {
		if (welcomeMsg.find("a").text() !== "Faça login") {
			welcomeMsgTxt = `<a href="/clientes/dashboard" title="Acessar minha conta">` + welcomeMsg.text().slice(19, -6) + `</a> (<a style="font-weight:normal" href="/clientes/logout" title="Sair da conta">sair</a>)`;
		}
		let welcomeMsgHTML = `<p>Seja bem-vindo(a), ` + welcomeMsgTxt + `</p>`;
		welcomeMsg.html(welcomeMsgHTML);
	}
}

/* CORREÇÕES DE LAYOUT */
function CorrecaoMobile() {
	if ($("body").hasClass("layout-mobile")) {
		$(".element-menu-top .menu-top-list > .has-sub .viem-all, #nav-main > .element-menu-category").remove();
	}
}

function CorrecaoListaProduto404() {
	$("#product-list > .list-product-empty").each(function () {
		if ($(this).text() == "Não foi encontrado nenhum produto.Estamos atualizando nosso estoque!") {
			$(this).closest(".element-latest").remove();
		}
	});
}

function CorrecaoFiltros() {
	if ($('#sidebar-left .element-filter').length && $('#sidebar-left .element-filter .header-sidebar').length == 0) {
		$('#sidebar-left .element-filter').prepend('<div class="header-sidebar"><span class="header-sidebar-title">Filtros</span></div>');
	}
	$('.filter-list').each(function () {
		if ($(this).children().length < 2) {
			$(this).parent().parent().remove();
		}
	});
}

function CorrecaoUnidadeMedida() {
	$.each(unidMeter, function (_i, url) {
		let urlLink = "/" + url + "/"
		if (checkURL(urlLink)) {
			$(".product-amount .label-unit").text("Unidade: metro");
			$(".product-amount .label-amount").text(" metro(s) ");
		}
	});
}

function CorrecaoAtributosProduto() {
	if ($(".product-view").length) {
		if ($("body").hasClass("layout-mobile")) { // mobile
			let el = $(".product-view");
			$.each(replaceAttr, function (_i, attr) {
				$.each(el, function (j) {
					if ((j > 0) && (j < (el.length - 1))) {
						if ($(this).find(".icon-product-" + attr)) {
							let elReplace = $(this).find(".product-view-content");
							newAttr = elReplace.text().replace(",", ", ").replace("  ", " ")
							elReplace.text(newAttr);
						}
					}
				});
			});
		} else { // desktop
			$.each(replaceAttr, function (_i, attr) {
				let element = $("#atributo-" + attr + " .attr-desc");
				let newAttr = element.text().replace(",", ", ");
				element.text(newAttr);
			});
		}
	}
}

function carrinhoVazio() {
	let carrinho = $("#cart-products .shopping-cart-empty");
	if (carrinho.length) {
		let btnBuy = `
			<div class="shopping-cart-empty-btn text-align-center">
				<span class="shopping-cart-label-empty">
					<a href="/" class="btn btn-cart-submit">
						<span class="btn-text">Ir às Compras</span>
					</a>
				</span>
			</div>
		`
		carrinho.after(btnBuy);
	}
}