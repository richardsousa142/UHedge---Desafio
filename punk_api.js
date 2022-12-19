let data = null // vai ser usado para guardar os dados retornados pela API dentro de fetch
let currentPage = 1 // vai ser usado para guardar o valor atual da pagina 
// O bloco de variaveis a seguir serve simplesmente para pegar alguns itens do corpo do HTML
let div = document.querySelector(".interface_bebidas")
let input = document.querySelector(".search")
let div_bebida_search = document.querySelector(".interface_bebidas_search")
let prev_page = document.querySelector(".prev_page")
let next_page = document.querySelector(".next_page")
let last_page = document.querySelector(".last_page")
let first_page = document.querySelector(".first_page")
let current_page = document.querySelector(".current_page")

/**
 * Esta funcao é usada no atributo onclick da tag <a> no corpo da pagina,
 * é usada para pegar a ANTERIOR pagina da API e então mostrar os itens 
 * retornados na tela 
 * 
 * Aqui tomamos o cuidado de não tentar fazer uma requisição de uma 
 * pagina menor que 1 na API, dessa forma evitando mostrar uma interface
 * sem nada
 */
function getPreviousPage(){
	let pageRequest = parseInt(prev_page.getAttribute('data-page'))
	currentPage == 1? currentPage = 1 : currentPage += pageRequest
	getItensFromApiAndShow(currentPage)
}

/**
 * Esta funcao é usada no atributo onclick da tag <a> no corpo da pagina,
 * é usada para pegar a PROXIMA pagina da API e então mostrar os itens 
 * retornados na tela 
 * 
 * Como estamos mostrando 15 itens por pagina, então o total de pagina
 * que a API tera com resultados validos passa a ser 22, por isso o cuidado
 * para não acessar pagina alem de 22, pois, não seria exibido nada 
 */
function getNextPage(){
	let pageRequest = parseInt(next_page.getAttribute('data-page'))
	currentPage >= 22? currentPage = 22 : currentPage += pageRequest
	getItensFromApiAndShow(currentPage)
}

/**
 * Esta funcao é usada no atributo onclick da tag <a> no corpo da pagina,
 * é usada para pegar a PRIMEIRA pagina da API e então mostrar os itens 
 * retornados na tela 
 */
function getFirstPage(){
	let pageRequest = parseInt(first_page.getAttribute('data-page'))
	currentPage = pageRequest
	getItensFromApiAndShow(currentPage)
}

/**
 * Esta funcao é usada no atributo onclick da tag <a> no corpo da pagina,
 * é usada para pegar a ULTIMA pagina da API e então mostrar os itens 
 * retornados na tela 
 */
function getLastPage(){
	let pageRequest = parseInt(last_page.getAttribute('data-page'))
	currentPage = pageRequest
	getItensFromApiAndShow(currentPage)
}

/**
 * Esta função funciona como uma casca para a funcao fetch, dessa maneira
 * evita-se de chamar o trecho de codigo fetchApiData (dentro da funcao) 
 * diversar vezes e em lugares diferentes.
 * 
 * Funciona passando a pagina que sera alvo da requisição, pega os valores 
 * retornados e monta o HTML no map.
 * 
 * Apos montar o HTML atualiza o valor da pagina atual na chamada de função
 * showCurrentPage()
 * 
 * Usa-se esta função em getPreviousPage, getNextPage, getFirstPage, getLastPage
 * 
 * @param {*} page - numero da pagina que deseja-se montar a interface
 */
function getItensFromApiAndShow(page){
	let url = `https://api.punkapi.com/v2/beers?page=`+page+`&per_page=15`
	fetchApiData(url,{})
	.then( (bebidas) => {
		div.textContent = ""
		data = bebidas
		data.map((items) => {
			div.innerHTML += createCard(items)
		})
	})	
	showCurrentPage(page)
}

/**
 * fetchApiData faz o consumo da Pank Api, e retorna um json
 * que sera usado na funcao getItensFromApiAndShow para criar 
 * a pagina com os itens retornados da requisao
 * 
 * @param {*} url - url da api que sera usada para a requisição
 * @param {*} data 
 * @returns - retorna o json dos itens da api
 */
async function fetchApiData(url = '', data = {}) {
	const response = await fetch(url, {
	  method: 'GET', 
	  mode: 'cors', 
	  cache: 'no-cache', 
	  credentials: 'same-origin', 
	  headers: {
		  'Content-Type': 'application/json'
		},
		redirect: 'follow', 
		referrerPolicy: 'no-referrer', 
	});
	return response.json();
}

/**
 * Este bloco de codigo 'escuta' todas as interações com o input 
 * presente na interface da pagina. O objetivo aqui é pegar o que 
 * o usuário escrever no input e então usar para fazer uma busca 
 * 
 * Ao encontrar o item buscado montamos o card usando a funcao createCard
 * 
 */
input.addEventListener('input', (event) => {
	let searchBeer = data.filter( (beer) => {
		let beerName = beer.name.toLowerCase()
		let inputSearch = input.value.toLowerCase()
		return beerName.includes(inputSearch)
	})
	div.textContent = ""
	searchBeer.map( (items) => {
		div.innerHTML += createCard(items)
	} )
});

/**
 * Esta função cria os cards da interface, os cards mostram a imagem,
 * nome e descrição das bebidas.
 * 
 * É usada dentro da função getItensFromApiAndShow, addEventListener
 * 
 * @param {*} beer - json com os itens das bebidas para montar os cards da interface
 * @returns card, bloco de html que sera inserido no corpo da pagina
 */
function createCard(beer){
	let card = `
		<div class="div_bebida">
			<div class="card_bebidas">
				<img src="`+beer.image_url+`"/>
				<div class="div_info_bebida">
					<h2>`+beer.name+`</h2>
					<p>`+beer.description+`</p>
				</div>
			</div>
		</div>
	`
	return card
}

/**
 * Esta função tem um funcinamento simples e serve exclusivamente para 
 * atualizar da pagina atual mostrado na interface
 * 
 * É usado dentro de getItensFromApiAndShow
 * 
 * @param {*} page - inteiro contendo a pagina atual
 */
function showCurrentPage(page){
	current_page.textContent = page	
}

/**
 * Este bloco de codigo tem o objetivo simples de mostrar sempre o resultado 
 * da primeira pagina requisitada na API
 */
currentPage == 1? getItensFromApiAndShow(1) : getItensFromApiAndShow(currentPage)