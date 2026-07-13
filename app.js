let ajMessageResolve = null;

function tipoMensagemAdega(texto, tipoInformado){
 const t = String(texto || "").toLowerCase();
 if(tipoInformado) return tipoInformado;
 if(t.includes("não foi possível") || t.includes("erro") || t.includes("inválido") || t.includes("falha")) return "erro";
 if(t.includes("informe") || t.includes("selecione") || t.includes("fotografe") || t.includes("analise") || t.includes("atenção")) return "aviso";
 return "sucesso";
}

function tituloMensagemAdega(texto, tipo){
 const t = String(texto || "").toLowerCase();
 if(t.includes("wishlist") || t.includes("desejado")) return tipo === "erro" ? "Não foi possível salvar" : "Adicionado à Wishlist";
 if(t.includes("supabase ativo") || t.includes("salva automaticamente")) return "Supabase ativo";
 if(t.includes("carregados do supabase")) return "Dados atualizados";
 if(t.includes("vinho excluído")) return "Vinho excluído";
 if(t.includes("backup importado")) return "Backup importado";
 if(t.includes("rótulo") || t.includes("rotulo")) return tipo === "erro" ? "Problema no rótulo" : "Rótulo";
 if(t.includes("foto")) return tipo === "erro" ? "Problema na foto" : "Foto";
 if(t.includes("consumo externo")) return tipo === "erro" ? "Erro no consumo" : "Consumo registrado";
 if(t.includes("nome do vinho") || t.includes("tipo do vinho")) return "Cadastro incompleto";
 if(tipo === "erro") return "Algo não saiu como esperado";
 if(tipo === "aviso") return "Atenção";
 return "Tudo certo";
}

function iconeMensagemAdega(tipo, texto){
 const t = String(texto || "").toLowerCase();
 if(tipo === "erro") return "❌";
 if(tipo === "aviso") return "⚠️";
 if(t.includes("wishlist") || t.includes("desejado")) return "♡";
 if(t.includes("supabase") || t.includes("nuvem")) return "☁️";
 if(t.includes("backup")) return "💾";
 if(t.includes("excluído")) return "🗑️";
 if(t.includes("rótulo") || t.includes("rotulo")) return "📷";
 if(t.includes("consumo")) return "🍽️";
 return "🍷";
}

function mostrarMensagem(mensagem, opcoes={}){
 const texto = String(mensagem ?? "");
 const tipo = tipoMensagemAdega(texto, opcoes.tipo);
 const titulo = opcoes.titulo || tituloMensagemAdega(texto, tipo);
 const icone = opcoes.icone || iconeMensagemAdega(tipo, texto);
 const botao = opcoes.botao || "OK";

 const bg = document.getElementById("ajMessageBg");
 const modal = document.getElementById("ajMessageModal");
 const iconEl = document.getElementById("ajMessageIcon");
 const titleEl = document.getElementById("ajMessageTitle");
 const textEl = document.getElementById("ajMessageText");
 const actions = document.getElementById("ajMessageActions");

 if(!bg || !modal || !iconEl || !titleEl || !textEl || !actions){
   return;
 }

 modal.className = "aj-message-modal " + tipo;
 iconEl.innerText = icone;
 titleEl.innerText = titulo;
 textEl.innerText = texto;
 actions.innerHTML = `<button class="aj-btn-ok" type="button" onclick="fecharMensagemAdega()">${botao}</button>`;
 bg.classList.add("show");
}

function fecharMensagemAdega(){
 const bg = document.getElementById("ajMessageBg");
 if(bg) bg.classList.remove("show");
 if(ajMessageResolve){
   const resolver = ajMessageResolve;
   ajMessageResolve = null;
   resolver(false);
 }
}

function confirmarAdega(mensagem, opcoes={}){
 return new Promise(resolve=>{
   const texto = String(mensagem ?? "");
   const bg = document.getElementById("ajMessageBg");
   const modal = document.getElementById("ajMessageModal");
   const iconEl = document.getElementById("ajMessageIcon");
   const titleEl = document.getElementById("ajMessageTitle");
   const textEl = document.getElementById("ajMessageText");
   const actions = document.getElementById("ajMessageActions");

   if(!bg || !modal || !iconEl || !titleEl || !textEl || !actions){
     resolve(window.confirm(texto));
     return;
   }

   ajMessageResolve = resolve;
   modal.className = "aj-message-modal aviso";
   iconEl.innerText = opcoes.icone || "⚠️";
   titleEl.innerText = opcoes.titulo || "Confirmar ação";
   textEl.innerText = texto;
   actions.innerHTML = `
     <button class="aj-btn-cancel" type="button" onclick="responderMensagemAdega(false)">${opcoes.cancelar || "Cancelar"}</button>
     <button class="${opcoes.perigo ? "aj-btn-danger" : "aj-btn-ok"}" type="button" onclick="responderMensagemAdega(true)">${opcoes.confirmar || "Confirmar"}</button>
   `;
   bg.classList.add("show");
 });
}

function responderMensagemAdega(valor){
 const bg = document.getElementById("ajMessageBg");
 if(bg) bg.classList.remove("show");
 if(ajMessageResolve){
   const resolver = ajMessageResolve;
   ajMessageResolve = null;
   resolver(!!valor);
 }
}

window.alert = function(mensagem){
 mostrarMensagem(mensagem);
};

const vinhosBase = [
 {nome:"Petit Chablis Allain Geoffroy", safra:"2022", tipo:"Branco", quantidade:1},
 {nome:"Chablis Gérard Tremblay", safra:"2023", tipo:"Branco", quantidade:1},
 {nome:"Garzón Estate Pinot Grigio", safra:"2024", tipo:"Branco", quantidade:2},
 {nome:"Gustav Gewürztraminer", safra:"2025", tipo:"Branco", quantidade:2},
 {nome:"Covela Rosé Dry", safra:"2019", tipo:"Rosé", quantidade:1},
 {nome:"EPU", safra:"2017", tipo:"Tinto", quantidade:2},
 {nome:"Angélica Zapata Alta Cabernet Franc", safra:"2016", tipo:"Tinto", quantidade:1},
 {nome:"Marchese Antinori Chianti Classico Riserva", safra:"2020", tipo:"Tinto", quantidade:1},
 {nome:"EQ Granite Pinot Noir", safra:"2022", tipo:"Tinto", quantidade:1},
 {nome:"Sideral", safra:"2023", tipo:"Tinto", quantidade:3},
 {nome:"Côtes du Rhône E. Guigal", safra:"2020", tipo:"Tinto", quantidade:1},
 {nome:"Arboleda Syrah", safra:"2021", tipo:"Tinto", quantidade:1},
 {nome:"Arboleda Brisa", safra:"2021", tipo:"Tinto", quantidade:2},
 {nome:"Arboleda Pinot Noir", safra:"2024", tipo:"Tinto", quantidade:1},
 {nome:"Cadus Malbec", safra:"2022", tipo:"Tinto", quantidade:1},
 {nome:"Seleccion de Parcelas Chardonnay", safra:"2025", tipo:"Branco", quantidade:4},
 {nome:"Gustav Riesling Trocken", safra:"2025", tipo:"Branco", quantidade:2},
 {nome:"1865 Gran Reserva Cabernet Sauvignon", safra:"2022", tipo:"Tinto", quantidade:2},
 {nome:"Bruce Jack Daily Brew Pinotage", safra:"2023", tipo:"Tinto", quantidade:1}
];

let vinhos = [];
let filtroAtual = "";
let vinhoSelecionado = null;
let detalheEmEdicao = false;
let consumosExternos = [];
let vinhosDesejadosTabela = [];
let adegas = [];
let adega3DSelecionadaId = localStorage.getItem("aj_adega3d_selecionada_id") || "";
let posicaoVazia3DSelecionada = null;
let garrafa3DSelecionadaMover = null;
let arrastoAdega3D = null;
let suprimirCliqueAdega3D = false;
let salvandoNaNuvem = false;
let carregandoDaNuvem = false;
let intervaloSincronizacao = null;
let rotuloIAAtual = null;
let rotuloFotoUrlAtual = "";
let fotoUrlPreCadastro = "";

let mostrarValoresFinanceiros = localStorage.getItem("aj_mostrar_valores_financeiros") !== "false";
function elementosEdicaoDetalhe(){
  return Array.from(document.querySelectorAll("#modalDetalhes .detalhe-edit-field, #modalDetalhes textarea"));
}

function aplicarModoEdicaoDetalhe(ativo){
  detalheEmEdicao = !!ativo;
  const modal = document.getElementById("modalDetalhes");
  if(modal) modal.classList.toggle("modo-edicao", detalheEmEdicao);

  elementosEdicaoDetalhe().forEach(el=>{
    el.disabled = !detalheEmEdicao;
  });

  document.querySelectorAll("#modalDetalhes .detalhe-edit-only").forEach(el=>{
    el.style.display = detalheEmEdicao ? "" : "none";
  });

  const btnEditar = document.getElementById("btnDetalheEditar");
  const btnCancelarEdicao = document.getElementById("btnDetalheCancelarEdicao");
  const btnSalvar = document.getElementById("btnDetalheSalvar");
  const btnExcluir = document.getElementById("btnDetalheExcluir");

  if(btnEditar) btnEditar.style.display = detalheEmEdicao ? "none" : "";
  if(btnCancelarEdicao) btnCancelarEdicao.style.display = detalheEmEdicao ? "" : "none";
  if(btnSalvar) btnSalvar.style.display = detalheEmEdicao ? "" : "none";
  if(btnExcluir) btnExcluir.style.display = detalheEmEdicao ? "" : "none";
}

function habilitarEdicaoDetalhes(){
  aplicarModoEdicaoDetalhe(true);
  const primeiroCampo = document.querySelector("#modalDetalhes .detalhe-edit-field");
  if(primeiroCampo) primeiroCampo.focus();
}

function cancelarEdicaoDetalhes(){
  if(vinhoSelecionado === null){
    aplicarModoEdicaoDetalhe(false);
    return;
  }
  abrirDetalhes(vinhoSelecionado);
}

function valorFinanceiro(valor){
 return mostrarValoresFinanceiros ? moeda(valor) : "••••••";
}

function iconePrivacidadeValoresSvg(visivel){
 if(visivel){
   return `
     <svg class="icon-eye" viewBox="0 0 24 24" aria-hidden="true">
       <path d="M2.1 12s3.4-6.5 9.9-6.5S21.9 12 21.9 12s-3.4 6.5-9.9 6.5S2.1 12 2.1 12Z"></path>
       <circle cx="12" cy="12" r="3.2"></circle>
     </svg>`;
 }
 return `
   <svg class="icon-eye" viewBox="0 0 24 24" aria-hidden="true">
     <path d="M2.1 12s3.4-6.5 9.9-6.5S21.9 12 21.9 12s-3.4 6.5-9.9 6.5S2.1 12 2.1 12Z"></path>
     <circle cx="12" cy="12" r="3.2"></circle>
     <path class="slash" d="M4 4l16 16"></path>
   </svg>`;
}

function atualizarBotaoPrivacidadeValores(){
 const btn = document.getElementById("btnToggleValores");
 if(!btn) return;
 btn.innerHTML = iconePrivacidadeValoresSvg(mostrarValoresFinanceiros);
 btn.setAttribute("aria-label", mostrarValoresFinanceiros ? "Ocultar valores" : "Mostrar valores");
 btn.title = mostrarValoresFinanceiros ? "Ocultar valores" : "Mostrar valores";
}

function aplicarFadeValores(){
 ["kpiValorInvestido","kpiValorEstoque","kpiTicketMedio"].forEach(id=>{
   const el = document.getElementById(id);
   if(!el) return;
   el.classList.add("trocando");
   setTimeout(()=>el.classList.remove("trocando"), 180);
 });
}

function toggleValoresFinanceiros(event){
 if(event){
   event.preventDefault();
   event.stopPropagation();
 }
 mostrarValoresFinanceiros = !mostrarValoresFinanceiros;
 localStorage.setItem("aj_mostrar_valores_financeiros", String(mostrarValoresFinanceiros));
 aplicarFadeValores();
 atualizarBotaoPrivacidadeValores();
 renderizarEstatisticas();
}


const SUPABASE_URL = "https://ujspshfoydnwvxgzwcbq.supabase.co";
const SUPABASE_KEY = "sb_publishable_pkPfNfzEcP-xUZXGkrn3OQ_dHea_KEm";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);


const MODO_TESTE_KEY = "aj_modo_teste_ativo";
function modoTesteAtivo(){ return localStorage.getItem(MODO_TESTE_KEY) === "true"; }
function aplicarEstadoModoTeste(){
 const ativo = modoTesteAtivo();
 document.body.classList.toggle("modo-teste-ativo", ativo);
 const btn = document.getElementById("btnModoTeste");
 if(btn){ btn.classList.toggle("ativo", ativo); btn.innerText = ativo ? "Ativado" : "Desativado"; btn.setAttribute("aria-pressed", ativo ? "true" : "false"); }
}
function toggleModoTeste(){
 const novoValor = !modoTesteAtivo();
 localStorage.setItem(MODO_TESTE_KEY, novoValor ? "true" : "false");
 aplicarEstadoModoTeste();
 mostrarMensagem(novoValor ? "Modo teste ativado. Agora você pode testar sem gravar no Supabase." : "Modo teste desativado. As próximas alterações voltarão a ser gravadas normalmente.", {tipo:novoValor ? "aviso" : "sucesso", titulo:novoValor ? "Modo teste ativo" : "Modo teste desativado", icone:"🧪"});
}
async function simularModoTeste(mensagem="Ação simulada. Nenhum dado foi gravado no Supabase.", opcoes={}){
 mostrarMensagem(mensagem, {tipo:"aviso", titulo:opcoes.titulo || "Simulação concluída", icone:"🧪", botao:"OK"});
 return true;
}


function normalizarNumero(valor){
 const n = Number(valor || 0);
 return Number.isFinite(n) ? n : 0;
}

function limparNomeArquivo(valor){
 return String(valor || "vinho")
   .normalize("NFD")
   .replace(/[\u0300-\u036f]/g,"")
   .replace(/[^a-zA-Z0-9]+/g,"-")
   .replace(/^-+|-+$/g,"")
   .toLowerCase() || "vinho";
}

function extensaoArquivo(file){
 const nome = file?.name || "";
 const ext = nome.includes(".") ? nome.split(".").pop().toLowerCase() : "";
 if(["jpg","jpeg","png","webp","gif"].includes(ext)) return ext;
 if(file?.type === "image/png") return "png";
 if(file?.type === "image/webp") return "webp";
 return "jpg";
}

async function uploadFotoVinho(file, nome, safra){
 if(!file) return "";
 const ext = extensaoArquivo(file);
 const caminho = `${limparNomeArquivo(nome)}-${limparNomeArquivo(safra || "sem-safra")}-${Date.now()}.${ext}`;

 const {error:uploadError} = await supabaseClient
   .storage
   .from("fotos")
   .upload(caminho, file, {
     cacheControl:"3600",
     upsert:false,
     contentType:file.type || "image/jpeg"
   });

 if(uploadError) throw uploadError;

 const {data} = supabaseClient
   .storage
   .from("fotos")
   .getPublicUrl(caminho);

 return data?.publicUrl || "";
}

function previewFotoCadastro(event){
 const file = event.target.files && event.target.files[0];
 const img = document.getElementById("fotoPreviewCadastro");
 if(!img) return;
 if(!file){
   img.style.display = "none";
   img.src = "";
   return;
 }
 img.src = URL.createObjectURL(file);
 img.style.display = "block";
}

function setStatusIA(mensagem, tipo=""){
 const el = document.getElementById("aiRotuloStatus");
 if(!el) return;
 el.innerText = mensagem || "";
 el.className = "ai-status" + (tipo ? " " + tipo : "");
 el.style.display = mensagem ? "block" : "none";
}

function preencherCampoSeVazio(id, valor){
 const el = document.getElementById(id);
 if(!el || valor === undefined || valor === null) return;
 const texto = String(valor).trim();
 if(!texto) return;
 if(!String(el.value || "").trim()) el.value = texto;
}

function normalizarTipoIA(tipo){
 const t = String(tipo || "").toLowerCase();
 if(t.includes("branco")) return "Branco";
 if(t.includes("ros")) return "Rosé";
 if(t.includes("espum") || t.includes("champ")) return "Espumante";
 if(t.includes("tinto") || t.includes("red")) return "Tinto";
 return "";
}


function setStatusRotulo(mensagem, tipo=""){
 const el = document.getElementById("rotuloStatus");
 if(!el) return;
 el.innerText = mensagem || "";
 el.className = "rotulo-status" + (tipo ? " " + tipo : "");
 el.style.display = mensagem ? "block" : "none";
}

function limparLeitorRotulo(){
 rotuloIAAtual = null;
 rotuloFotoUrlAtual = "";
 const input = document.getElementById("rotuloFoto");
 if(input) input.value = "";
 const preview = document.getElementById("rotuloPreview");
 if(preview){ preview.src = ""; preview.style.display = "none"; }
 const statusArquivo = document.getElementById("rotuloArquivoStatus");
 if(statusArquivo) statusArquivo.innerText = "Nenhuma foto capturada";
 const captura = document.querySelector(".rotulo-captura");
 if(captura) captura.classList.remove("foto-capturada");
 const resultado = document.getElementById("rotuloResultado");
 if(resultado){ resultado.innerHTML = ""; resultado.style.display = "none"; }
 const destino = document.getElementById("rotuloDestinoActions");
 if(destino) destino.style.display = "none";
 setStatusRotulo("");
}

function abrirLeitorRotulo(){
 setBottomNavAtivo("rotulo");
 limparLeitorRotulo();
 document.getElementById("modalLeitorRotulo").style.display = "flex";
}

function fecharLeitorRotulo(){
 document.getElementById("modalLeitorRotulo").style.display = "none";
}

function previewFotoRotulo(event){
 const file = event.target.files && event.target.files[0];
 const img = document.getElementById("rotuloPreview");
 const statusArquivo = document.getElementById("rotuloArquivoStatus");
 const captura = document.querySelector(".rotulo-captura");
 const resultado = document.getElementById("rotuloResultado");
 const destino = document.getElementById("rotuloDestinoActions");
 if(!img) return;
 if(!file){
   img.src = "";
   img.style.display = "none";
   if(statusArquivo) statusArquivo.innerText = "Nenhuma foto capturada";
   if(captura) captura.classList.remove("foto-capturada");
   if(resultado){ resultado.innerHTML = ""; resultado.style.display = "none"; }
   if(destino) destino.style.display = "none";
   setStatusRotulo("");
   return;
 }
 img.src = URL.createObjectURL(file);
 img.style.display = "block";
 if(statusArquivo) statusArquivo.innerText = "✅ Foto capturada";
 if(captura) captura.classList.add("foto-capturada");
 if(resultado){ resultado.innerHTML = ""; resultado.style.display = "none"; }
 if(destino) destino.style.display = "none";
 setStatusRotulo("🍷 Identificando vinho...\nLendo nome, safra, produtor e país.");
 setTimeout(()=>analisarRotuloComIA(), 250);
}

function valorRotulo(valor, fallback="-"){
 const texto = String(valor ?? "").trim();
 return texto || fallback;
}

function renderizarResultadoRotulo(vinhoIA){
 const el = document.getElementById("rotuloResultado");
 if(!el) return;
 const confianca = Number(vinhoIA.confianca || 0);
 const vivino = vinhoIA.vivino_estimado || vinhoIA.nota_vivino || "";
 const preco = vinhoIA.preco_estimado || vinhoIA.faixa_preco_estimada || "";
 const titulo = valorRotulo(vinhoIA.nome, "Vinho identificado");
 const safra = valorRotulo(vinhoIA.safra, "Safra não informada");
 const pais = valorRotulo(vinhoIA.pais, "País não informado");
 const regiao = valorRotulo(vinhoIA.regiao, "Região não informada");
 const tipo = valorRotulo(vinhoIA.tipo, "Tipo não informado");

 el.innerHTML = `
   <div class="rotulo-resultado-card">
     <div class="rotulo-result-hero">
       <h3>${titulo}</h3>
       <div class="rotulo-result-meta">
         <span class="rotulo-chip">${safra}</span>
         <span class="rotulo-chip">${tipo}</span>
         <span class="rotulo-chip">${pais}</span>
         ${vivino ? `<span class="rotulo-chip">⭐ ${vivino}</span>` : ""}
         ${confianca ? `<span class="rotulo-chip">${(confianca * 100).toFixed(0)}% confiança</span>` : ""}
       </div>
     </div>
     <div class="rotulo-result-content">
       <div class="rotulo-grid">
         <div class="rotulo-info"><small>Produtor</small><strong>${valorRotulo(vinhoIA.produtor)}</strong></div>
         <div class="rotulo-info"><small>Uva / corte</small><strong>${valorRotulo(vinhoIA.uva)}</strong></div>
         <div class="rotulo-info"><small>Região</small><strong>${regiao}</strong></div>
         <div class="rotulo-info"><small>Potencial</small><strong>${valorRotulo(vinhoIA.potencial_guarda_sugerido)}</strong></div>
         <div class="rotulo-info"><small>Preço estimado</small><strong>${valorRotulo(preco)}</strong></div>
         <div class="rotulo-info"><small>Teor / volume</small><strong>${valorRotulo(vinhoIA.teor_alcoolico)} • ${valorRotulo(vinhoIA.volume_ml)}</strong></div>
       </div>
      ${renderDadosSommelier(vinhoIA)}
     </div>
   </div>`;
 el.style.display = "block";
 const destino = document.getElementById("rotuloDestinoActions");
 if(destino) destino.style.display = "grid";
 setTimeout(()=>{
   const modal = document.getElementById("modalLeitorRotulo");
   if(modal) modal.scrollTo({ top: modal.scrollHeight, behavior: "smooth" });
 }, 120);
}

function renderDadosSommelier(vinho) {

  const possuiDados =
    vinho.temperatura_servico ||
    vinho.tempo_decanter ||
    vinho.perfil_sensorial ||
    vinho.estilo_do_vinho ||
    (vinho.harmonizacao && vinho.harmonizacao.length) ||
    (vinho.ocasioes_recomendadas && vinho.ocasioes_recomendadas.length) ||
    vinho.descricao_sommelier ||
    vinho.curiosidades;

  if (!possuiDados) return "";

  return `
  <div class="sommelier-card">

    <button
      type="button"
      class="sommelier-header"
      onclick="toggleDadosSommelier()">

      <span>🍷 Dados do Sommelier</span>

      <span id="sommelierArrow">▼</span>

    </button>

    <div
      id="sommelierBody"
      class="sommelier-body"
      style="display:none;">

      ${(vinho.temperatura_servico || vinho.tempo_decanter) ? `
      <div class="sommelier-grid">

        ${vinho.temperatura_servico ? `
        <div class="sommelier-mini-card">
          <div class="titulo">🌡️ Temperatura</div>
          <div>${vinho.temperatura_servico}</div>
        </div>
        ` : ""}

        ${vinho.tempo_decanter ? `
        <div class="sommelier-mini-card">
          <div class="titulo">🫗 Decanter</div>
          <div>${vinho.tempo_decanter}</div>
        </div>
        ` : ""}

      </div>
      ` : ""}

      ${vinho.estilo_do_vinho ? `
      <h4>🍷 Estilo</h4>
      <p>${vinho.estilo_do_vinho}</p>
      ` : ""}

      ${vinho.perfil_sensorial ? `
      <h4>👃 Perfil Sensorial</h4>
      <p>${vinho.perfil_sensorial}</p>
      ` : ""}

      ${vinho.harmonizacao?.length ? `
      <h4>🍽️ Harmonização</h4>

      <div class="sommelier-tags">

        ${vinho.harmonizacao.map(item => `
          <span class="sommelier-tag">${item}</span>
        `).join("")}

      </div>
      ` : ""}

      ${vinho.ocasioes_recomendadas?.length ? `
      <h4>🎯 Ideal para</h4>

      <div class="sommelier-tags">

        ${vinho.ocasioes_recomendadas.map(item => `
          <span class="sommelier-tag">${item}</span>
        `).join("")}

      </div>
      ` : ""}

      ${vinho.descricao_sommelier ? `
      <h4>⭐ Comentário do Sommelier</h4>
      <p>${vinho.descricao_sommelier}</p>
      ` : ""}

      ${vinho.curiosidades ? `
      <h4>📖 Curiosidade</h4>
      <p>${vinho.curiosidades}</p>
      ` : ""}

    </div>

  </div>`;
}
async function analisarRotuloComIA(){
 const input = document.getElementById("rotuloFoto");
 const file = input?.files && input.files[0];
 if(!file){ alert("Fotografe um rótulo antes de identificar o vinho."); return; }

 const btn = document.getElementById("btnAnalisarRotulo");
 const textoOriginal = btn ? btn.innerText : "";
 if(btn){ btn.disabled = true; btn.innerText = "🔍 Identificando..."; }

 try{
   setStatusRotulo("🍷 Identificando vinho...\nEnviando a foto e analisando o rótulo.");
   const imageUrl = await uploadFotoVinho(file, "rotulo", "consulta");
   rotuloFotoUrlAtual = imageUrl;

   setStatusRotulo("🍷 Identificando vinho...\nLendo nome, safra, produtor e país.");
   const resultado = await chamarFunctionLerRotulo(imageUrl);

   if(!resultado || resultado.ok === false){
     console.error("Resposta IA:", resultado);
     setStatusRotulo("❌ Não foi possível identificar o rótulo.", "erro");
     return;
   }

   rotuloIAAtual = resultado.vinho || resultado;
   renderizarResultadoRotulo(rotuloIAAtual);
   setStatusRotulo("✅ Vinho identificado. Escolha o que deseja fazer agora.", "ok");
 }catch(e){
   console.error(e);
   const detalhe = e?.message ? e.message : String(e);
   setStatusRotulo("❌ Não foi possível identificar o rótulo.", "erro");
 }finally{
   if(btn){ btn.disabled = false; btn.innerText = textoOriginal || "🔍 Identificar vinho"; }
 }
}

function preencherCampo(id, valor){
 const el = document.getElementById(id);
 if(!el || valor === undefined || valor === null) return;
 el.value = String(valor).trim();
}

function cadastrarAPartirDoRotulo(){
 if(!rotuloIAAtual){ alert("Analise um rótulo antes de iniciar o cadastro."); return; }

 const vinhoIA = rotuloIAAtual;
 const fotoUrl = rotuloFotoUrlAtual;

 fecharLeitorRotulo();
 abrirCadastro();

 preencherCampo("nome", vinhoIA.nome);
 preencherCampo("safra", vinhoIA.safra);
 preencherCampo("produtor", vinhoIA.produtor);
 preencherCampo("uva", vinhoIA.uva);
 preencherCampo("pais", vinhoIA.pais);
 preencherCampo("regiao", vinhoIA.regiao);
 preencherCampo("potencialGuarda", vinhoIA.potencial_guarda_sugerido);
 preencherCampo("notaVivino", vinhoIA.vivino_estimado || vinhoIA.nota_vivino);

 const tipoIA = normalizarTipoIA(vinhoIA.tipo);
 if(tipoIA) document.getElementById("tipo").value = tipoIA;

 fotoUrlPreCadastro = fotoUrl || "";

 const ocasiao = document.getElementById("ocasiao");
 if(ocasiao && vinhoIA.observacoes){
   ocasiao.value = `Pré-cadastro por IA: ${vinhoIA.observacoes}`;
 }
}

function consumoExternoAPartirDoRotulo(){
 if(!rotuloIAAtual){ alert("Analise um rótulo antes de registrar o consumo externo."); return; }

 const vinhoIA = rotuloIAAtual;

 fecharLeitorRotulo();
 abrirCadastroConsumoExterno();

 preencherCampo("extNome", vinhoIA.nome);
 preencherCampo("extSafra", vinhoIA.safra);
 preencherCampo("extProdutor", vinhoIA.produtor);
 preencherCampo("extUva", vinhoIA.uva);
 preencherCampo("extPais", vinhoIA.pais);
 preencherCampo("extRegiao", vinhoIA.regiao);
 preencherCampo("extNotaVivino", vinhoIA.vivino_estimado || vinhoIA.nota_vivino);
 preencherCampo("extValorPago", vinhoIA.preco_estimado || "");

 const tipoIA = normalizarTipoIA(vinhoIA.tipo);
 if(tipoIA) document.getElementById("extTipo").value = tipoIA;

 const observacao = document.getElementById("extObservacao");
 if(observacao && vinhoIA.observacoes){
   observacao.value = `Identificado por IA: ${vinhoIA.observacoes}`;
 }
}

async function adicionarWishlistAPartirDoRotulo(){
 if(!rotuloIAAtual){ alert("Analise um rótulo antes de adicionar aos vinhos desejados."); return; }

 const vinhoIA = rotuloIAAtual;
 const vivino = vinhoIA.vivino_estimado || vinhoIA.nota_vivino || null;
 const preco = vinhoIA.preco_estimado || vinhoIA.faixa_preco_estimada || "";

 const btn = document.getElementById("btnWishlistRotulo");
 const textoOriginal = btn ? btn.innerText : "";
 if(btn){ btn.disabled = true; btn.innerText = "♡ Salvando..."; }

 if(modoTesteAtivo()){
   if(btn){ btn.disabled = false; btn.innerText = textoOriginal; }
   await simularModoTeste("Wishlist simulada. O vinho não foi adicionado à lista real.", {titulo:"Wishlist simulada"});
   return;
 }

 try{
   const tipoIA = normalizarTipoIA(vinhoIA.tipo) || vinhoIA.tipo || null;

   const {error} = await supabaseClient.from("vinhos_desejados").insert({
     nome: vinhoIA.nome || "Vinho identificado",
     safra: vinhoIA.safra || null,
     tipo: tipoIA,
     produtor: vinhoIA.produtor || null,
     uva: vinhoIA.uva || null,
     pais: vinhoIA.pais || null,
     regiao: vinhoIA.regiao || null,
     nota_vivino: vivino ? Number(vivino) : null,
     preco_estimado: preco || null,
     foto_url: rotuloFotoUrlAtual || null,
     observacoes: vinhoIA.observacoes || null,
     origem: "foto_rotulo",
     status: "desejado"
   });
   if(error) throw error;

   await carregarWishlistSupabase();
   renderizarVinhosDesejados();
   setStatusRotulo("✅ Vinho adicionado aos desejados.", "ok");
   mostrarMensagem("O vinho foi salvo com sucesso na sua lista de desejos.", {tipo:"sucesso", titulo:"Adicionado à Wishlist", icone:"♡", botao:"Perfeito"});
 }catch(e){
   console.error(e);
   setStatusRotulo("❌ Não foi possível adicionar aos vinhos desejados.", "erro");
   mostrarMensagem("Não foi possível adicionar aos vinhos desejados. Verifique a tabela/policies no Supabase.", {tipo:"erro", titulo:"Erro ao salvar na Wishlist", icone:"❌"});
 }finally{
   if(btn){ btn.disabled = false; btn.innerText = textoOriginal || "♡ Vinho desejado"; }
 }
}

async function chamarFunctionLerRotulo(imageUrl){
 const response = await fetch(`${SUPABASE_URL}/functions/v1/ler-rotulo`, {
   method: "POST",
   headers: {
     "Content-Type": "application/json",
     "apikey": SUPABASE_KEY,
     "Authorization": `Bearer ${SUPABASE_KEY}`
   },
   body: JSON.stringify({ imageUrl })
 });

 const texto = await response.text();
 let data;
 try{
   data = JSON.parse(texto);
 }catch{
   data = { ok:false, erro:texto };
 }

 if(!response.ok){
   throw new Error(`HTTP ${response.status}: ${JSON.stringify(data)}`);
 }

 return data;
}

async function lerRotuloComIA(){
 const fotoInput = document.getElementById("fotoVinho");
 const file = fotoInput?.files && fotoInput.files[0];

 if(!file){
   alert("Tire ou selecione uma foto do rótulo antes de usar a IA.");
   return;
 }

 const btn = document.querySelector(".btn-ai");
 const textoOriginal = btn ? btn.innerText : "";
 if(btn){
   btn.disabled = true;
   btn.innerText = "🤖 Lendo rótulo...";
 }

 setStatusIA("Enviando foto e analisando rótulo com IA...");

 try{
   const nomeAtual = document.getElementById("nome").value.trim() || "rotulo";
   const safraAtual = document.getElementById("safra").value.trim() || "sem-safra";

   const imageUrl = await uploadFotoVinho(file, nomeAtual, safraAtual);
   const resultado = await chamarFunctionLerRotulo(imageUrl);

   if(!resultado || resultado.ok === false){
     console.error("Resposta IA:", resultado);
     setStatusIA("Não foi possível ler o rótulo. Veja o console para detalhes.", "erro");
     alert("A IA não conseguiu ler o rótulo. Tente uma foto mais nítida e frontal.");
     return;
   }

   const vinhoIA = resultado.vinho || resultado;

   preencherCampoSeVazio("nome", vinhoIA.nome);
   preencherCampoSeVazio("safra", vinhoIA.safra);
   preencherCampoSeVazio("produtor", vinhoIA.produtor);
   preencherCampoSeVazio("uva", vinhoIA.uva);
   preencherCampoSeVazio("pais", vinhoIA.pais);
   preencherCampoSeVazio("regiao", vinhoIA.regiao);

   const tipoIA = normalizarTipoIA(vinhoIA.tipo);
   if(tipoIA) document.getElementById("tipo").value = tipoIA;

   const confianca = Number(vinhoIA.confianca || 0);
   const obs = vinhoIA.observacoes ? ` Observação: ${vinhoIA.observacoes}` : "";
   setStatusIA(`Rótulo lido com IA${confianca ? ` • confiança ${(confianca*100).toFixed(0)}%` : ""}.${obs}`, "ok");

 }catch(e){
   console.error(e);
   const detalhe = e?.message ? e.message : String(e);
   setStatusIA("Erro ao chamar a IA:\n" + detalhe, "erro");
   alert("Erro ao ler o rótulo com IA. Veja o detalhe exibido na tela.");
 }finally{
   if(btn){
     btn.disabled = false;
     btn.innerText = textoOriginal || "🤖 Ler rótulo com IA";
   }
 }
}


function previewFotoDetalhe(event){
 const file = event.target.files && event.target.files[0];
 const wrap = document.getElementById("fotoPreviewDetalheWrap");
 if(!wrap) return;
 if(!file){
   wrap.style.display = "none";
   wrap.innerHTML = "";
   return;
 }
 wrap.innerHTML = `<img class="detalhe-foto" src="${URL.createObjectURL(file)}" alt="Prévia da nova foto">`;
 wrap.style.display = "block";
}

function htmlMiniaturaVinho(v){
 if(v.fotoUrl){
   return `<img class="wine-thumb" src="${v.fotoUrl}" alt="Foto de ${v.nome}" loading="lazy">`;
 }
 return `<div class="wine-thumb-placeholder ${classeTipo(v.tipo)}"></div>`;
}

function htmlFotoDetalhe(v){
 if(v.fotoUrl){
   return `<img class="detalhe-foto" src="${v.fotoUrl}" alt="Foto de ${v.nome}">`;
 }
 return `<div class="detalhe-sem-foto">📷 Nenhuma foto cadastrada para este vinho.</div>`;
}

async function atualizarFotoDetalhe(){
 if(vinhoSelecionado === null) return;
 const v = garantirEstrutura(vinhos[vinhoSelecionado]);
 const input = document.getElementById("fotoDetalhe");
 const file = input?.files && input.files[0];

 if(!file){
   alert("Selecione uma foto para atualizar.");
   return;
 }

 try{
   const url = await uploadFotoVinho(file, v.nome, v.safra);
   v.fotoUrl = url;
   await atualizarVinhoSupabase(v);
   if(input) input.value = "";
   const preview = document.getElementById("fotoPreviewDetalheWrap");
   if(preview){
     preview.style.display = "none";
     preview.innerHTML = "";
   }
   await carregarDoSupabase(true);
   abrirDetalhes(vinhoSelecionado);
   renderizar();
 }catch(e){
   console.error(e);
   alert("Não foi possível enviar a foto para o Supabase Storage. Verifique as policies do bucket fotos.");
 }
}

function mapearGarrafa(row){
 return {
   id: row.id,
   data: row.data_compra || "",
   loja: row.loja || "-",
   quantidade: 1,
   valorUnitario: normalizarNumero(row.valor_pago),
   compradoPor: row.comprado_por || "-",
   presenteadoPor: row.presenteado_por || "",
   localizacao: row.localizacao || "",
   adegaId: row.adega_id || "",
   posicaoAdega: row.posicao_adega || "",
   consumida: !!row.consumida,
   dataConsumo: row.data_consumo || "",
   eventoConsumo: row.evento_consumo || "",
   observacaoConsumo: row.observacao_consumo || "",
   comQuem: row.com_quem || "",
   notaExperiencia: normalizarNumero(row.nota_experiencia),
   fotoMomentoUrl: row.foto_momento_url || "",
   harmonizacao: row.harmonizacao || "",
   humor: row.humor || "",
   tags: row.tags || "",
   momentoEspecial: !!row.momento_especial,
   favoritoVida: !!row.favorito_da_vida,
   ocasiao: row.ocasiao || ""
 };
}

function mapearVinho(row){
 const aquisicoes = (row.garrafas || []).map(mapearGarrafa);
 return {
   id: row.id,
   nome: row.nome || "",
   safra: row.safra ? String(row.safra) : "",
   tipo: row.tipo || "Tinto",
   quantidade: aquisicoes.filter(a=>!a.consumida).reduce((s,a)=>s+Number(a.quantidade||1),0),
   fotoUrl: row.foto_url || "",
   detalhes:{
     produtor: row.produtor || "-",
     uva: row.uva || "-",
     pais: row.pais || "-",
     regiao: row.regiao || "-",
     notaVivino: normalizarNumero(row.nota_vivino),
     guarda: row.potencial_guarda || "",
     notas: row.notas || ""
   },
   controle:{},
   aquisicoes
 };
}

function mapearVinhoDesejadoSupabase(row){
 return {
   id: row.id,
   nome: row.nome || "",
   safra: row.safra || "",
   tipo: row.tipo || "",
   produtor: row.produtor || "-",
   uva: row.uva || "-",
   pais: row.pais || "-",
   regiao: row.regiao || "-",
   notaVivino: normalizarNumero(row.nota_vivino),
   precoEstimado: row.preco_estimado || "",
   fotoUrl: row.foto_url || "",
   observacao: row.observacoes || "",
   origem: row.origem || "manual",
   status: row.status || "desejado",
   createdAt: row.created_at || ""
 };
}


function mapearAdegaSupabase(row){
 return {
   id: row.id,
   nome: row.nome || "",
   capacidade: Number(row.capacidade || 0),
   prateleiras: Number(row.prateleiras || 1),
   garrafasPorPrateleira: Number(row.garrafas_por_prateleira || 1),
   observacoes: row.observacoes || "",
   ativa: row.ativa !== false,
   createdAt: row.created_at || ""
 };
}

async function carregarAdegasSupabase(){
 const {data, error} = await supabaseClient
   .from("adegas")
   .select("*")
   .order("created_at", {ascending:true});
 if(error) throw error;
 adegas = (data || []).map(mapearAdegaSupabase);
 renderizarListaAdegas();
 renderizarSelectAdegas3D();
 return adegas;
}

function renderizarSelectAdegas3D(){
 const select = document.getElementById("selectAdega3D");
 if(!select) return;
 const ativas = adegas.filter(a=>a.ativa !== false);
 if(!ativas.length){
   select.innerHTML = `<option value="">Adega padrão visual</option>`;
   select.value = "";
   return;
 }
 if(!adega3DSelecionadaId || !ativas.some(a=>String(a.id) === String(adega3DSelecionadaId))){
   adega3DSelecionadaId = String(ativas[0].id);
   localStorage.setItem("aj_adega3d_selecionada_id", adega3DSelecionadaId);
 }
 select.innerHTML = ativas.map(a=>`<option value="${a.id}">${a.nome || "Adega"} • ${capacidadeVisualAdega(a)} lugares</option>`).join("");
 select.value = adega3DSelecionadaId;
}

function obterAdega3DSelecionada(){
 const select = document.getElementById("selectAdega3D");
 if(select){
   adega3DSelecionadaId = select.value || adega3DSelecionadaId || "";
   if(adega3DSelecionadaId) localStorage.setItem("aj_adega3d_selecionada_id", adega3DSelecionadaId);
 }
 return adegas.find(a=>String(a.id) === String(adega3DSelecionadaId)) || adegas.find(a=>a.ativa !== false) || null;
}

function abrirCadastroAdegas(){
 fecharConfiguracoes();
 limparFormularioAdega(false);
 renderizarListaAdegas();
 carregarAdegasSupabase().catch(e=>{
   console.error(e);
   mostrarMensagem("Não foi possível carregar as adegas. Verifique se a tabela adegas foi criada no Supabase e se as policies foram liberadas.", {tipo:"erro", titulo:"Erro ao carregar adegas"});
 });
 const modal = document.getElementById("modalAdegas");
 if(modal) modal.style.display = "flex";
}

function fecharCadastroAdegas(){
 const modal = document.getElementById("modalAdegas");
 if(modal) modal.style.display = "none";
}

function limparFormularioAdega(focar=true){
 const campos = ["adegaIdEditando","adegaNome","adegaCapacidade","adegaPrateleiras","adegaGarrafasPrateleira","adegaObservacoes"];
 campos.forEach(id=>{ const el = document.getElementById(id); if(el) el.value = ""; });
 const prat = document.getElementById("adegaPrateleiras");
 const gpp = document.getElementById("adegaGarrafasPrateleira");
 if(prat) prat.value = "6";
 if(gpp) gpp.value = "5";
 if(focar){ const nome = document.getElementById("adegaNome"); if(nome) nome.focus(); }
}

function renderizarListaAdegas(){
 const lista = document.getElementById("listaAdegas");
 if(!lista) return;
 if(!adegas.length){
   lista.innerHTML = `<div class="empty">Nenhuma adega cadastrada ainda.</div>`;
   return;
 }
 lista.innerHTML = adegas.map(a=>{
   const capacidade = Number(a.capacidade || 0);
   const prateleiras = Number(a.prateleiras || 0);
   const gpp = Number(a.garrafasPorPrateleira || 0);
   const obs = a.observacoes ? `<br>${a.observacoes}` : "";
   return `<div class="adega-card">
     <div>
       <h3>${a.nome || "Adega sem nome"}</h3>
       <p>${prateleiras} prateleira${prateleiras === 1 ? "" : "s"} • ${gpp} garrafa${gpp === 1 ? "" : "s"} por prateleira${obs}</p>
       <span class="adega-capacidade-badge">Capacidade: ${capacidade} garrafa${capacidade === 1 ? "" : "s"}</span>
     </div>
     <div class="adega-card-actions">
       <button class="adega-icon-btn" title="Editar adega" onclick="editarAdega('${a.id}')">✎</button>
       <button class="adega-icon-btn danger" title="Excluir adega" onclick="excluirAdega('${a.id}')">🗑</button>
     </div>
   </div>`;
 }).join("");
}

function editarAdega(id){
 const a = adegas.find(x=>String(x.id) === String(id));
 if(!a) return;
 const set = (idCampo, valor)=>{ const el = document.getElementById(idCampo); if(el) el.value = valor ?? ""; };
 set("adegaIdEditando", a.id);
 set("adegaNome", a.nome);
 set("adegaCapacidade", a.capacidade);
 set("adegaPrateleiras", a.prateleiras);
 set("adegaGarrafasPrateleira", a.garrafasPorPrateleira);
 set("adegaObservacoes", a.observacoes);
 const nome = document.getElementById("adegaNome");
 if(nome) nome.focus();
}

async function salvarAdega(){
 const id = document.getElementById("adegaIdEditando")?.value || "";
 const nome = (document.getElementById("adegaNome")?.value || "").trim();
 const capacidade = Number(document.getElementById("adegaCapacidade")?.value || 0);
 const prateleiras = Number(document.getElementById("adegaPrateleiras")?.value || 0);
 const garrafasPorPrateleira = Number(document.getElementById("adegaGarrafasPrateleira")?.value || 0);
 const observacoes = (document.getElementById("adegaObservacoes")?.value || "").trim();

 if(!nome){ alert("Informe o nome da adega."); return; }
 if(!capacidade || capacidade < 1){ alert("Informe uma capacidade válida para a adega."); return; }
 if(!prateleiras || prateleiras < 1){ alert("Informe a quantidade de prateleiras."); return; }
 if(!garrafasPorPrateleira || garrafasPorPrateleira < 1){ alert("Informe quantas garrafas cabem por prateleira."); return; }

 const payload = {
   nome,
   capacidade,
   prateleiras,
   garrafas_por_prateleira: garrafasPorPrateleira,
   observacoes: observacoes || null,
   ativa: true
 };

 if(modoTesteAtivo()){
   await simularModoTeste(`Cadastro de adega simulado: ${nome}. Nenhuma alteração foi feita no Supabase.`, {titulo:"Adega simulada"});
   return;
 }

 try{
   if(id){
     const {error} = await supabaseClient.from("adegas").update(payload).eq("id", id);
     if(error) throw error;
   }else{
     const {error} = await supabaseClient.from("adegas").insert(payload);
     if(error) throw error;
   }
   await carregarAdegasSupabase();
   limparFormularioAdega(false);
   mostrarMensagem("Adega salva com sucesso.", {tipo:"sucesso", titulo:"Adega salva", icone:"🍷"});
 }catch(e){
   console.error(e);
   mostrarMensagem("Não foi possível salvar a adega. Verifique a tabela adegas e as permissões no Supabase.", {tipo:"erro", titulo:"Erro ao salvar adega"});
 }
}

async function excluirAdega(id){
 const a = adegas.find(x=>String(x.id) === String(id));
 const ok = await confirmarAdega(`Deseja excluir a adega "${a?.nome || "selecionada"}"?\n\nNesta fase, isso remove apenas o cadastro da adega, não remove vinhos ou garrafas.`, {
   titulo:"Excluir adega",
   confirmar:"Excluir",
   cancelar:"Cancelar",
   perigo:true,
   icone:"🗑️"
 });
 if(!ok) return;
 if(modoTesteAtivo()){
   await simularModoTeste("Exclusão de adega simulada. Nenhuma adega foi removida.", {titulo:"Exclusão simulada"});
   return;
 }
 try{
   const {error} = await supabaseClient.from("adegas").delete().eq("id", id);
   if(error) throw error;
   await carregarAdegasSupabase();
   limparFormularioAdega(false);
   mostrarMensagem("Adega excluída com sucesso.", {tipo:"sucesso", titulo:"Adega excluída", icone:"🗑️"});
 }catch(e){
   console.error(e);
   mostrarMensagem("Não foi possível excluir a adega.", {tipo:"erro", titulo:"Erro ao excluir adega"});
 }
}

async function carregarWishlistSupabase(){
 const {data, error} = await supabaseClient
   .from("vinhos_desejados")
   .select("*")
   .eq("status", "desejado")
   .order("created_at", {ascending:false});
 if(error) throw error;
 vinhosDesejadosTabela = (data || []).map(mapearVinhoDesejadoSupabase);
 return vinhosDesejadosTabela;
}

async function carregarDoSupabase(silencioso=true){
 try{
   const {data:vinhosData, error:erroVinhos} = await supabaseClient
     .from("vinhos")
     .select("*, garrafas(*)")
     .order("nome", {ascending:true});
   if(erroVinhos) throw erroVinhos;

   const {data:consumosData, error:erroConsumos} = await supabaseClient
     .from("consumos_externos")
     .select("*")
     .order("data_consumo", {ascending:false});
   if(erroConsumos) throw erroConsumos;

   const {data:wishlistData, error:erroWishlist} = await supabaseClient
     .from("vinhos_desejados")
     .select("*")
     .eq("status", "desejado")
     .order("created_at", {ascending:false});
   if(erroWishlist) throw erroWishlist;

   try{
     await carregarAdegasSupabase();
   }catch(erroAdegas){
     console.warn("Não foi possível carregar adegas", erroAdegas);
   }

   vinhos = (vinhosData || []).map(mapearVinho);
   consumosExternos = (consumosData || []).map(c=>({
     id:c.id,
     nome:c.nome || "",
     safra:c.safra || "",
     tipo:c.tipo || "Tinto",
     produtor:c.produtor || "-",
     uva:c.uva || "-",
     pais:c.pais || "-",
     regiao:c.regiao || "-",
     notaVivino:normalizarNumero(c.nota_vivino),
     valorPago:normalizarNumero(c.valor_pago),
     dataConsumo:c.data_consumo || "",
     local:c.local || "-",
     evento:c.evento || "",
     comQuem:c.com_quem || "",
     compraria:c.compraria || "",
     quantidade:Number(c.quantidade || 1),
     observacao:c.observacao || "",
     notaExperiencia:normalizarNumero(c.nota_experiencia),
     fotoMomentoUrl:c.foto_momento_url || "",
     harmonizacao:c.harmonizacao || "",
     humor:c.humor || "",
     tags:c.tags || "",
     momentoEspecial:!!c.momento_especial,
     favoritoVida:!!c.favorito_da_vida
   }));

   vinhosDesejadosTabela = (wishlistData || []).map(mapearVinhoDesejadoSupabase);

   renderizar();
   if(!silencioso) alert("Dados carregados do Supabase.");
   return true;
 }catch(e){
   console.error("Erro Supabase", e);
   if(!silencioso) alert("Não foi possível carregar os dados do Supabase. Verifique as policies e a conexão.");
   return false;
 }
}

async function inserirGarrafas(vinhoId, aquisicoes){
 if(!aquisicoes.length) return;
 if(modoTesteAtivo()){
   await simularModoTeste("Inclusão de garrafas simulada. Nenhuma garrafa foi gravada.", {titulo:"Garrafas simuladas"});
   return;
 }
 const linhas = aquisicoes.map(a=>({
   vinho_id: vinhoId,
   data_compra: a.data || null,
   loja: a.loja || null,
   valor_pago: normalizarNumero(a.valorUnitario),
   comprado_por: a.compradoPor || null,
   presenteado_por: a.presenteadoPor || null,
   localizacao: a.localizacao || null,
   adega_id: a.adegaId || null,
   posicao_adega: a.posicaoAdega || null,
   ocasiao: a.ocasiao || null,
   consumida: !!a.consumida,
   data_consumo: a.dataConsumo || null,
   evento_consumo: a.eventoConsumo || null,
   observacao_consumo: a.observacaoConsumo || null
 }));
 const {error} = await supabaseClient.from("garrafas").insert(linhas);
 if(error) throw error;
}

async function atualizarVinhoSupabase(v){
 if(modoTesteAtivo()){
   await simularModoTeste("Atualização de vinho simulada. Nenhum dado foi gravado.", {titulo:"Vinho simulado"});
   return;
 }
 const {error} = await supabaseClient.from("vinhos").update({
   nome: v.nome,
   safra: v.safra ? Number(v.safra) : null,
   tipo: v.tipo,
   produtor: v.detalhes?.produtor || null,
   uva: v.detalhes?.uva || null,
   pais: v.detalhes?.pais || null,
   regiao: v.detalhes?.regiao || null,
   nota_vivino: normalizarNumero(v.detalhes?.notaVivino),
   potencial_guarda: (v.detalhes?.guarda || "").trim() || null,
   notas: v.detalhes?.notas || null,
   foto_url: v.fotoUrl || null
 }).eq("id", v.id);
 if(error) throw error;
}


const detalhesPadrao = {
 "Petit Chablis Allain Geoffroy": {produtor:"Allain Geoffroy", uva:"Chardonnay", pais:"França", regiao:"Borgonha / Chablis", notas:"Branco seco, mineral, boa acidez. Combina bem com frutos do mar."},
 "Chablis Gérard Tremblay": {produtor:"Gérard Tremblay", uva:"Chardonnay", pais:"França", regiao:"Borgonha / Chablis", notas:"Chablis clássico, fresco e mineral."},
 "Garzón Estate Pinot Grigio": {produtor:"Bodega Garzón", uva:"Pinot Grigio", pais:"Uruguai", regiao:"Maldonado / Garzón", notas:"Branco leve, fresco e aromático."},
 "Gustav Gewürztraminer": {produtor:"Gustav", uva:"Gewürztraminer", pais:"Alemanha", regiao:"-", notas:"Branco aromático, floral e levemente exótico."},
 "Covela Rosé Dry": {produtor:"Quinta da Covela", uva:"-", pais:"Portugal", regiao:"Minho", notas:"Rosé seco, fresco e versátil."},
 "EPU": {produtor:"Viña Almaviva", uva:"Blend bordalês", pais:"Chile", regiao:"Puente Alto", notas:"Tinto chileno elegante, segundo vinho do Almaviva."},
 "Angélica Zapata Alta Cabernet Franc": {produtor:"Catena Zapata", uva:"Cabernet Franc", pais:"Argentina", regiao:"Mendoza", notas:"Tinto estruturado, com boa complexidade."},
 "Marchese Antinori Chianti Classico Riserva": {produtor:"Marchesi Antinori", uva:"Sangiovese", pais:"Itália", regiao:"Toscana / Chianti Classico", notas:"Tinto italiano clássico, boa acidez e gastronomia."},
 "EQ Granite Pinot Noir": {produtor:"Matetic Vineyards", uva:"Pinot Noir", pais:"Chile", regiao:"Valle de Casablanca", notas:"Pinot Noir elegante, fresco e mineral."},
 "Sideral": {produtor:"Viña San Pedro", uva:"Blend", pais:"Chile", regiao:"Valle del Cachapoal", notas:"Tinto chileno de bom corpo e boa presença."},
 "Côtes du Rhône E. Guigal": {produtor:"E. Guigal", uva:"Blend Rhône", pais:"França", regiao:"Côtes du Rhône", notas:"Tinto francês versátil, com frutas vermelhas e especiarias."},
 "Arboleda Syrah": {produtor:"Arboleda", uva:"Syrah", pais:"Chile", regiao:"Valle de Aconcagua", notas:"Tinto intenso, com notas de especiarias."},
 "Arboleda Brisa": {produtor:"Arboleda", uva:"Blend", pais:"Chile", regiao:"Valle de Aconcagua", notas:"Vinho chileno fresco e fácil de beber."},
 "Arboleda Pinot Noir": {produtor:"Arboleda", uva:"Pinot Noir", pais:"Chile", regiao:"Aconcagua Costa", notas:"Pinot Noir leve, fresco e elegante."},
 "Cadus Malbec": {produtor:"Cadus", uva:"Malbec", pais:"Argentina", regiao:"Valle de Uco / Tupungato", notas:"Malbec argentino, bom corpo e fruta madura."},
 "Seleccion de Parcelas Chardonnay": {produtor:"-", uva:"Chardonnay", pais:"Chile", regiao:"Vale Central", notas:"Branco Chardonnay. Completar produtor depois."},
 "Gustav Riesling Trocken": {produtor:"Gustav", uva:"Riesling", pais:"Alemanha", regiao:"Rheinhessen", notas:"Riesling seco, fresco e gastronômico."},
 "1865 Gran Reserva Cabernet Sauvignon": {produtor:"Viña San Pedro", uva:"Cabernet Sauvignon", pais:"Chile", regiao:"Valle del Maipo / Las Piedras", notas:"Tinto encorpado, clássico Cabernet chileno."},
 "Bruce Jack Daily Brew Pinotage": {produtor:"Bruce Jack", uva:"Pinotage", pais:"África do Sul", regiao:"Western Cape", notas:"Tinto sul-africano frutado e descontraído."}
};

function salvar(){
 // Supabase é a única fonte de dados. Não gravamos vinhos no localStorage.
}

async function sincronizarSePossivel(){
 return true;
}

async function iniciarSincronizacaoAutomatica(){
 return true;
}

function salvarConsumosExternos(){
 // Mantido por compatibilidade. Supabase é a fonte de dados.
}

function carregarConsumosExternos(){
 consumosExternos = [];
}




function formatarDataHistorico(data){
 if(!data) return "Data não informada";
 const partes = String(data).split("-");
 if(partes.length === 3) return `${partes[2]}/${partes[1]}/${partes[0]}`;
 return data;
}

function htmlThumbHistorico(c){
 if(c.fotoUrl){
   return `<img class="hist-thumb" src="${c.fotoUrl}" alt="Foto de ${c.vinho}" loading="lazy">`;
 }
 return `<div class="hist-thumb-placeholder">${iconeTipo(c.tipo)}</div>`;
}

function classeComprariaHistorico(valor){
 const v = String(valor || "").toLowerCase();
 if(v === "sim") return "sim";
 if(v === "não" || v === "nao") return "nao";
 if(v === "talvez") return "talvez";
 return "";
}

function htmlComprariaHistorico(valor){
 if(!valor) return "";
 const classe = classeComprariaHistorico(valor);
 const icone = classe === "sim" ? "🟢" : classe === "nao" ? "🔴" : "🟡";
 const texto = classe === "sim" ? "Compraria para a adega" : classe === "nao" ? "Não compraria" : "Talvez compraria";
 return `<div class="hist-buy-decision ${classe}">${icone} ${texto}</div>`;
}


let historicoConsumosCache = [];

function textoBuscaHistorico(c){
 return [
   c.vinho, c.safra, c.tipo, c.produtor, c.uva, c.pais, c.regiao,
   c.eventoConsumo, c.localConsumo, c.comQuem, c.observacaoConsumo,
   c.harmonizacao, c.tags, c.humor,
   c.origem, c.loja, c.compraria
 ].join(" ").toLowerCase();
}

function parseDataHistoricoLocal(data){
 if(!data) return null;
 const partes = String(data).split("-");
 if(partes.length === 3){
   const y = Number(partes[0]), m = Number(partes[1]), d = Number(partes[2]);
   if(y && m && d) return new Date(y, m - 1, d);
 }
 const dt = new Date(data);
 return isNaN(dt.getTime()) ? null : dt;
}

function chaveMesHistorico(data){
 const d = parseDataHistoricoLocal(data);
 if(!d) return "Sem data";
 const meses = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
 return `${meses[d.getMonth()]}/${d.getFullYear()}`;
}

function diaMesHistorico(data){
 const d = parseDataHistoricoLocal(data);
 if(!d) return {dia:"--", mes:"---"};
 const meses = ["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"];
 return {dia:String(d.getDate()).padStart(2,"0"), mes:meses[d.getMonth()]};
}

function abrirFotoMomentoHistorico(urlCodificada, tituloCodificado){
 const url = decodeURIComponent(urlCodificada || "");
 const titulo = decodeURIComponent(tituloCodificado || "Foto do momento");
 if(!url){
   mostrarMensagem("Este consumo não possui foto do momento registrada.", {tipo:"aviso", titulo:"Sem foto", icone:"📷"});
   return;
 }
 const modal = document.getElementById("modalFotoMomentoHistorico");
 const img = document.getElementById("modalFotoMomentoHistoricoImg");
 const tituloEl = document.getElementById("modalFotoMomentoHistoricoTitulo");
 if(!modal || !img){
   window.open(url, "_blank");
   return;
 }
 if(tituloEl) tituloEl.innerText = titulo;
 img.src = url;
 img.alt = `Foto do momento - ${titulo}`;
 modal.style.display = "flex";
}

function fecharFotoMomentoHistorico(){
 const modal = document.getElementById("modalFotoMomentoHistorico");
 const img = document.getElementById("modalFotoMomentoHistoricoImg");
 if(modal) modal.style.display = "none";
 if(img) img.src = "";
}

function htmlHistoricoCard(c, idx){
 const flag = bandeiraPais(c.pais);
 const dataBadge = diaMesHistorico(c.dataConsumo);
 const titulo = `${c.vinho || "-"} ${c.safra && c.safra !== "-" ? "• " + c.safra : ""}`;
 const origemClasse = c.origem === "Externo" ? "externo" : "adega";
 const origemTexto = c.origem === "Externo" ? "Externo" : "Adega";
 const local = c.localConsumo || c.loja || "-";
 const evento = c.eventoConsumo || "-";
 const comQuem = c.comQuem || "-";
 const observacao = c.observacaoConsumo || "";
 const nota = c.notaVivino ? `⭐ ${Number(c.notaVivino).toFixed(1)}` : "-";
 const valor = c.valorUnitario ? moeda(c.valorUnitario) : "-";
 const compraria = c.compraria ? c.compraria : "-";
 const notaExperiencia = Number(c.notaExperiencia || 0);
 const estrelasExperiencia = notaExperiencia ? "★".repeat(Math.max(0, Math.min(5, notaExperiencia))) + "☆".repeat(Math.max(0, 5 - notaExperiencia)) : "";
 const harmonizacao = c.harmonizacao || "-";
 const tags = c.tags || "";
 const resumo = [evento, comQuem !== "-" ? comQuem : "", local].filter(Boolean).join(" • ");

 return `
   <details class="hist-mini-card" data-hist-idx="${idx}">
     <summary>
       <div class="hist-date-badge"><div><b>${dataBadge.dia}</b><span>${dataBadge.mes}</span></div></div>
       <div class="hist-mini-main">
         <div class="hist-mini-title">
           ${flag ? `<span title="${c.pais}">${flag}</span>` : ""}
           <span class="nome">${titulo}</span>
         </div>
         <div class="hist-mini-sub">${resumo || `${c.tipo || "-"} • ${c.pais || "-"}`}</div>
       </div>
       <div class="hist-mini-side">
         ${notaExperiencia ? `<span class="hist-experience-badge gold">${estrelasExperiencia}</span>` : ""}
         <span class="hist-mini-origin ${origemClasse}">${origemTexto}</span>
         <span class="hist-mini-chevron">▶</span>
       </div>
     </summary>

     <div class="hist-mini-detail">
       <div class="hist-experience-badges">
         ${notaExperiencia ? `<span class="hist-experience-badge gold">Experiência ${notaExperiencia}/5</span>` : ""}
         ${c.momentoEspecial ? `<span class="hist-experience-badge wine">Momento especial</span>` : ""}
         ${c.favoritoVida ? `<span class="hist-experience-badge wine">Favorito da vida</span>` : ""}
         ${tags ? `<span class="hist-experience-badge">${tags}</span>` : ""}
       </div>

       ${c.fotoMomentoUrl ? `
  <div class="hist-mini-photo-actions">
    <button
      class="btn-secondary"
      type="button"
      onclick="event.stopPropagation(); abrirFotoMomentoHistorico(
        '${encodeURIComponent(c.fotoMomentoUrl)}',
        '${encodeURIComponent(c.vinho || "Vinho consumido")}'
      )"
    >
      📷 Ver foto do momento
    </button>
  </div>
` : ""}

       <div class="hist-mini-grid">
         <div class="hist-mini-box"><small>Data</small><strong>${formatarDataHistorico(c.dataConsumo)}</strong></div>
         <div class="hist-mini-box"><small>Ocasião</small><strong>${evento}</strong></div>
         <div class="hist-mini-box"><small>Com quem</small><strong>${comQuem}</strong></div>
         <div class="hist-mini-box"><small>Local</small><strong>${local}</strong></div>
         <div class="hist-mini-box"><small>Harmonização</small><strong>${harmonizacao}</strong></div>
         <div class="hist-mini-box"><small>Nota experiência</small><strong>${notaExperiencia ? `${notaExperiencia}/5` : "-"}</strong></div>
         <div class="hist-mini-box"><small>Vinho</small><strong>${c.tipo || "-"} • ${c.pais || "-"} • ${c.regiao || "-"}</strong></div>
         <div class="hist-mini-box"><small>Produtor</small><strong>${c.produtor || "-"}</strong></div>
         <div class="hist-mini-box"><small>Uva / corte</small><strong>${c.uva || "-"}</strong></div>
         <div class="hist-mini-box"><small>Vivino</small><strong>${nota}</strong></div>
         <div class="hist-mini-box"><small>Quantidade</small><strong>${c.quantidade} garrafa${c.quantidade == 1 ? "" : "s"}</strong></div>
         <div class="hist-mini-box"><small>Valor unitário</small><strong>${valor}</strong></div>
         <div class="hist-mini-box"><small>Origem</small><strong>${c.origem}${c.compradoPor && c.origem==="Adega" ? " • " + c.compradoPor : ""}</strong></div>
         <div class="hist-mini-box"><small>Compraria?</small><strong>${compraria}</strong></div>
       </div>

       ${observacao ? `<div class="hist-mini-note"><b>Opiniões / lembranças:</b><br>${observacao}</div>` : ""}

     </div>
   </details>`;
}

function montarConsumosHistorico(){
 const consumos = [];

 vinhos.forEach(v=>{
   garantirEstrutura(v);

   v.aquisicoes.forEach(a=>{
     if(a.consumida){
       consumos.push({
         origem:"Adega",
         vinhoId: v.id,
         vinho: v.nome,
         safra: v.safra || "-",
         tipo: v.tipo || "-",
         produtor: v.detalhes?.produtor || "-",
         uva: v.detalhes?.uva || "-",
         pais: v.detalhes?.pais || "-",
         regiao: v.detalhes?.regiao || "-",
         notaVivino: Number(v.detalhes?.notaVivino || 0),
         fotoUrl: v.fotoUrl || "",
         dataCompra: a.data || "",
         loja: a.loja || "-",
         quantidade: Number(a.quantidade || 0),
         valorUnitario: Number(a.valorUnitario || 0),
         compradoPor: a.compradoPor || "-",
         presenteadoPor: a.presenteadoPor || "",
         dataConsumo: a.dataConsumo || "",
         eventoConsumo: a.eventoConsumo || "",
         observacaoConsumo: a.observacaoConsumo || "",
         localConsumo:"Casa / Adega Juliana",
         comQuem: a.comQuem || "",
         notaExperiencia: Number(a.notaExperiencia || 0),
         fotoMomentoUrl: a.fotoMomentoUrl || "",
         harmonizacao: a.harmonizacao || "",
         humor: a.humor || "",
         tags: a.tags || "",
         momentoEspecial: !!a.momentoEspecial,
         favoritoVida: !!a.favoritoVida
       });
     }
   });
 });

 consumosExternos.forEach(c=>{
   consumos.push({
     origem:"Externo",
     vinhoId:"",
     vinho:c.nome || "-",
     safra:c.safra || "-",
     tipo:c.tipo || "-",
     produtor:c.produtor || "-",
     uva:c.uva || "-",
     pais:c.pais || "-",
     regiao:c.regiao || "-",
     notaVivino:Number(c.notaVivino || 0),
     fotoUrl:c.fotoUrl || "",
     dataCompra:"",
     loja:c.local || "-",
     quantidade:Number(c.quantidade || 1),
     valorUnitario:Number(c.valorPago || 0),
     compradoPor:"Consumo externo",
     presenteadoPor:"",
     dataConsumo:c.dataConsumo || "",
     eventoConsumo:c.evento || "",
     observacaoConsumo:c.observacao || "",
     localConsumo:c.local || "-",
     comQuem:c.comQuem || "",
     compraria:c.compraria || "",
     notaExperiencia:Number(c.notaExperiencia || 0),
     fotoMomentoUrl:c.fotoMomentoUrl || "",
     harmonizacao:c.harmonizacao || "",
     humor:c.humor || "",
     tags:c.tags || "",
     momentoEspecial:!!c.momentoEspecial,
     favoritoVida:!!c.favoritoVida
   });
 });

 consumos.sort((a,b)=>String(b.dataConsumo || "").localeCompare(String(a.dataConsumo || "")));
 return consumos;
}

function formatarDataInputHistorico(date){
 const y = date.getFullYear();
 const m = String(date.getMonth() + 1).padStart(2,"0");
 const d = String(date.getDate()).padStart(2,"0");
 return `${y}-${m}-${d}`;
}

function marcarAtalhoHistorico(periodo){
 document.querySelectorAll("#histAtalhosPeriodo button").forEach(btn=>{
   btn.classList.toggle("active", btn.dataset.periodo === periodo);
 });
}

function aplicarPeriodoHistorico(periodo){
 const inicio = document.getElementById("histDataInicio");
 const fim = document.getElementById("histDataFim");
 if(!inicio || !fim) return;

 const hoje = new Date();
 let dtInicio = null;
 let dtFim = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());

 if(periodo === "hoje"){
   dtInicio = new Date(dtFim);
 }else if(periodo === "mes"){
   dtInicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
 }else if(periodo === "3m"){
   dtInicio = new Date(dtFim);
   dtInicio.setDate(dtInicio.getDate() - 89);
 }else if(periodo === "ano"){
   dtInicio = new Date(hoje.getFullYear(), 0, 1);
 }else{
   dtInicio = null;
   dtFim = null;
 }

 inicio.value = dtInicio ? formatarDataInputHistorico(dtInicio) : "";
 fim.value = dtFim ? formatarDataInputHistorico(dtFim) : "";
 marcarAtalhoHistorico(periodo);
 renderizarHistoricoMinimalista();
}

function obterFiltrosHistorico(){
 const termo = (document.getElementById("buscaHistorico")?.value || "").trim().toLowerCase();
 const inicioValor = document.getElementById("histDataInicio")?.value || "";
 const fimValor = document.getElementById("histDataFim")?.value || "";
 const inicio = inicioValor ? parseDataHistoricoLocal(inicioValor) : null;
 const fim = fimValor ? parseDataHistoricoLocal(fimValor) : null;
 if(fim) fim.setHours(23,59,59,999);
 return {termo, inicio, fim, inicioValor, fimValor};
}

function consumoDentroDoPeriodoHistorico(c, filtros){
 const data = parseDataHistoricoLocal(c.dataConsumo);
 if((filtros.inicio || filtros.fim) && !data) return false;
 if(filtros.inicio && data < filtros.inicio) return false;
 if(filtros.fim && data > filtros.fim) return false;
 return true;
}

function textoPeriodoHistorico(filtros){
 if(filtros.inicioValor && filtros.fimValor) return `${formatarDataHistorico(filtros.inicioValor)} a ${formatarDataHistorico(filtros.fimValor)}`;
 if(filtros.inicioValor) return `a partir de ${formatarDataHistorico(filtros.inicioValor)}`;
 if(filtros.fimValor) return `até ${formatarDataHistorico(filtros.fimValor)}`;
 return "todos os períodos";
}

function atualizarStatusFiltroHistorico(total, filtrados, filtros){
 const el = document.getElementById("histFiltroStatus");
 if(!el) return;
 const partes = [];
 partes.push(`<b>${filtrados}</b> de ${total} consumo${total === 1 ? "" : "s"}`);
 partes.push(`período: <b>${textoPeriodoHistorico(filtros)}</b>`);
 if(filtros.termo) partes.push(`busca: <b>${filtros.termo}</b>`);
 el.innerHTML = partes.join(" • ");
}

function renderizarHistoricoMinimalista(){
 const lista = document.getElementById("historicoLista");
 if(!lista) return;

 const filtros = obterFiltrosHistorico();
 const filtrados = historicoConsumosCache.filter(c=>{
   const matchTexto = !filtros.termo || textoBuscaHistorico(c).includes(filtros.termo);
   return matchTexto && consumoDentroDoPeriodoHistorico(c, filtros);
 });

 atualizarStatusFiltroHistorico(historicoConsumosCache.length, filtrados.length, filtros);

 if(!filtrados.length){
   lista.innerHTML = `<div class="empty">Nenhum consumo encontrado para os filtros selecionados.</div>`;
   return;
 }

 const grupos = {};
 filtrados.forEach((c,idx)=>{
   const chave = chaveMesHistorico(c.dataConsumo);
   if(!grupos[chave]) grupos[chave] = [];
   grupos[chave].push({c, idx});
 });

 lista.innerHTML = Object.entries(grupos).map(([mes, itens])=>`
   <section class="hist-month-group">
     <h3 class="hist-month-title">${mes}</h3>
     ${itens.map(({c, idx})=>htmlHistoricoCard(c, idx)).join("")}
   </section>
 `).join("");
}

function abrirHistoricoConsumo(){
 setBottomNavAtivo("historico");

 historicoConsumosCache = montarConsumosHistorico();

 const totalGarrafas = historicoConsumosCache.reduce((s,c)=>s + Number(c.quantidade || 0),0);
 const totalAdega = historicoConsumosCache.filter(c=>c.origem==="Adega").reduce((s,c)=>s + Number(c.quantidade || 0),0);
 const totalExterno = historicoConsumosCache.filter(c=>c.origem==="Externo").reduce((s,c)=>s + Number(c.quantidade || 0),0);
 const ultimo = historicoConsumosCache[0]?.dataConsumo ? formatarDataHistorico(historicoConsumosCache[0].dataConsumo) : "-";

 document.getElementById("historicoResumo").innerHTML = `
   <div class="hist-minimal-summary">
     <span class="hist-minimal-pill"><b>${totalGarrafas}</b> consumos</span>
     <span class="hist-minimal-pill"><b>${totalAdega}</b> da adega</span>
     <span class="hist-minimal-pill"><b>${totalExterno}</b> externos</span>
     <span class="hist-minimal-pill">Último: <b>${ultimo}</b></span>
   </div>
 `;

 const busca = document.getElementById("buscaHistorico");
 if(busca) busca.value = "";
 const histDataInicio = document.getElementById("histDataInicio");
 const histDataFim = document.getElementById("histDataFim");
 if(histDataInicio) histDataInicio.value = "";
 if(histDataFim) histDataFim.value = "";
 marcarAtalhoHistorico("todos");

 renderizarHistoricoMinimalista();
 document.getElementById("modalHistorico").style.display = "flex";
 setTimeout(()=>document.getElementById("buscaHistorico")?.focus(),120);
}

function abrirVinhoDoHistorico(vinhoId){
 const idx = vinhos.findIndex(v=>String(v.id) === String(vinhoId));
 if(idx < 0) return;
 fecharHistoricoConsumo();
 abrirDetalhes(idx);
}

function fecharHistoricoConsumo(){
 document.getElementById("modalHistorico").style.display = "none";
}


function abrirCadastroConsumoExterno(){
 limparConsumoExterno();
 document.getElementById("modalConsumoExterno").style.display = "flex";
 setTimeout(()=>document.getElementById("extNome").focus(),150);
}

function fecharCadastroConsumoExterno(){
 document.getElementById("modalConsumoExterno").style.display = "none";
}

function limparConsumoExterno(){
 ["extNome","extNotaVivino","extSafra","extProdutor","extUva","extPais","extRegiao","extValorPago","extLocal","extEvento","extComQuem","extObservacao"].forEach(id=>{
   const el = document.getElementById(id);
   if(el) el.value = "";
 });
 document.getElementById("extTipo").value = "";
 document.getElementById("extCompraria").value = "";
 document.getElementById("extQuantidade").value = "1";
 document.getElementById("extDataConsumo").value = new Date().toISOString().split("T")[0];
}

async function adicionarConsumoExterno(){
 const nome = document.getElementById("extNome").value.trim();
 if(!nome){ alert("Informe o nome do vinho consumido."); return; }
 const tipoExt = document.getElementById("extTipo").value;
 if(!tipoExt){ alert("Selecione o tipo do vinho."); return; }

 const consumo = {
   nome: nome,
   safra: document.getElementById("extSafra").value.trim(),
   tipo: tipoExt,
   produtor: document.getElementById("extProdutor").value.trim() || "-",
   uva: document.getElementById("extUva").value.trim() || "-",
   pais: document.getElementById("extPais").value.trim() || "-",
   regiao: document.getElementById("extRegiao").value.trim() || "-",
   nota_vivino: Number(document.getElementById("extNotaVivino").value || 0),
   valor_pago: Number(document.getElementById("extValorPago").value || 0),
   data_consumo: document.getElementById("extDataConsumo").value || null,
   local: document.getElementById("extLocal").value.trim() || "-",
   evento: document.getElementById("extEvento").value.trim(),
   com_quem: document.getElementById("extComQuem").value.trim(),
   compraria: document.getElementById("extCompraria").value,
   quantidade: parseInt(document.getElementById("extQuantidade").value) || 1,
   observacao: document.getElementById("extObservacao").value.trim()
 };

 if(modoTesteAtivo()){
   fecharCadastroConsumoExterno();
   await simularModoTeste("Consumo externo simulado. Nada foi gravado no histórico real.", {titulo:"Consumo simulado"});
   return;
 }

 try{
   const {error} = await supabaseClient.from("consumos_externos").insert(consumo);
   if(error) throw error;
   fecharCadastroConsumoExterno();
   await carregarDoSupabase(true);
   abrirHistoricoConsumo();
 }catch(e){
   console.error(e);
   alert("Não foi possível registrar o consumo externo no Supabase.");
 }
}


function configurarGithub(){
 alert("A sincronização agora é feita pelo Supabase. Token GitHub não é mais necessário.");
}

async function carregarDaNuvem(silencioso=false){
 return await carregarDoSupabase(silencioso);
}

async function salvarNaNuvem(silencioso=false){
 if(!silencioso) alert("A Adega Juliana agora salva automaticamente no Supabase.");
 return true;
}

function carregar(){
 vinhos = [];
 consumosExternos = [];
}

function garantirEstrutura(v){
 if(!v.detalhes){
   v.detalhes = detalhesPadrao[v.nome] || {produtor:"-", uva:"-", pais:"-", regiao:"-", notas:""};
 }
 if(!v.aquisicoes){
   v.aquisicoes = [];
 }
 if(!v.controle){
   v.controle = {localizacao:"", status:"Na adega"};
 }
 return v;
}

function recalcularQuantidadeAtual(v){
 if(!v.aquisicoes || !v.aquisicoes.length) return;
 v.quantidade = v.aquisicoes
   .filter(a=>!a.consumida)
   .reduce((s,a)=>s+Number(a.quantidade||0),0);
}

function enriquecerDetalhes(){
 vinhos.forEach(v=>{
   garantirEstrutura(v);
   v.aquisicoes.forEach(a=>{
     if(a.localizacao === undefined) a.localizacao = "";
     if(a.consumida === undefined) a.consumida = false;
   });
 });
 salvar();
}

function soma(tipo){
 return vinhos
  .filter(v=>!tipo || v.tipo===tipo)
  .reduce((s,v)=>s+Number(v.quantidade||0),0);
}

function atualizarResumo(){
 const setTxt = (id, valor) => { const el = document.getElementById(id); if(el) el.innerText = valor; };
 setTxt("totalGarrafas", soma(""));
 setTxt("totalTintos", soma("Tinto"));
 setTxt("totalBrancos", soma("Branco"));
 setTxt("totalRoses", soma("Rosé"));
 setTxt("totalEspumantesTop", soma("Espumante"));
 const totalRotulos = document.getElementById("totalRotulos");
 if(totalRotulos) totalRotulos.innerText = vinhos.length + " rótulos diferentes";

 setTxt("qtdTodos", soma(""));
 setTxt("qtdTintosMenu", soma("Tinto"));
 setTxt("qtdBrancosMenu", soma("Branco"));
 setTxt("qtdRosesMenu", soma("Rosé"));
 setTxt("qtdEspumantesMenu", soma("Espumante"));
}

function extrairAnosGuarda(valor){
 const texto = String(valor || "").toLowerCase().trim();
 if(!texto || texto === "-" || texto === "não informado") return null;
 if(texto.includes("beber agora")) return 0;
 const numeros = texto.match(/\d+/g);
 if(!numeros || !numeros.length) return null;
 // Para faixas como "5 a 10 anos", usamos o maior número como limite de guarda.
 return Math.max(...numeros.map(n=>Number(n)));
}

function calcularInfoGuarda(v){
 const safra = Number(v?.safra || 0);
 const guardaTexto = v?.detalhes?.guarda || v?.potencialGuarda || "";
 const anosGuarda = extrairAnosGuarda(guardaTexto);
 const anoAtual = new Date().getFullYear();

 if(!safra || anosGuarda === null){
   return {
     classe:"guarda-indefinido",
     icone:"⚪",
     status:"Guarda não informada",
     resumo:"Sem janela",
     detalhe:"Informe a safra e o potencial de guarda para calcular a janela de consumo.",
     limite:null
   };
 }

 const limite = safra + anosGuarda;
 const idade = Math.max(anoAtual - safra, 0);
 const percentual = anosGuarda > 0 ? idade / anosGuarda : 1;

 if(anoAtual > limite){
   return {classe:"guarda-passou", icone:"⚫", status:"Passou do potencial", resumo:`até ${limite}`, detalhe:`Safra ${safra} + ${anosGuarda} ano${anosGuarda === 1 ? "" : "s"} de guarda. Potencial estimado até ${limite}.`, limite};
 }
 if(percentual >= .9){
   return {classe:"guarda-limite", icone:"🔴", status:"Próximo do limite", resumo:`até ${limite}`, detalhe:`Safra ${safra} + ${anosGuarda} ano${anosGuarda === 1 ? "" : "s"} de guarda. Está próximo do limite estimado (${limite}).`, limite};
 }
 if(percentual >= .5){
   return {classe:"guarda-pronto", icone:"🟡", status:"Pronto para consumo", resumo:`até ${limite}`, detalhe:`Safra ${safra} + ${anosGuarda} ano${anosGuarda === 1 ? "" : "s"} de guarda. Já está em boa janela de consumo, com limite estimado em ${limite}.`, limite};
 }
 return {classe:"guarda-jovem", icone:"🟢", status:"Jovem", resumo:`até ${limite}`, detalhe:`Safra ${safra} + ${anosGuarda} ano${anosGuarda === 1 ? "" : "s"} de guarda. Ainda está jovem, com limite estimado em ${limite}.`, limite};
}

function htmlBadgeGuarda(v){
 const g = calcularInfoGuarda(v);
 const resumo = g.limite ? ` • ${g.resumo}` : "";
 return `<span class="guarda-badge ${g.classe}" title="${g.detalhe}">${g.icone} ${g.status}${resumo}</span>`;
}

function prioridadeConsumo(v){
 const g = calcularInfoGuarda(v);
 const prioridadePorClasse = {
   "guarda-passou": 1,
   "guarda-limite": 2,
   "guarda-pronto": 3,
   "guarda-jovem": 4,
   "guarda-indefinido": 5
 };
 return {
   prioridade: prioridadePorClasse[g.classe] || 5,
   limite: g.limite || 9999
 };
}


function normalizarTextoPais(valor){
 return String(valor || "")
   .normalize("NFD")
   .replace(/[\u0300-\u036f]/g,"")
   .toLowerCase()
   .trim();
}

function bandeiraPais(pais){
 const p = normalizarTextoPais(pais);
 const mapa = {
   "franca":"🇫🇷",
   "italia":"🇮🇹",
   "espanha":"🇪🇸",
   "portugal":"🇵🇹",
   "alemanha":"🇩🇪",
   "chile":"🇨🇱",
   "argentina":"🇦🇷",
   "uruguai":"🇺🇾",
   "brasil":"🇧🇷",
   "estados unidos":"🇺🇸",
   "eua":"🇺🇸",
   "usa":"🇺🇸",
   "africa do sul":"🇿🇦",
   "australia":"🇦🇺",
   "nova zelandia":"🇳🇿"
 };
 return mapa[p] || "";
}

function htmlBandeiraPais(v){
 const pais = v?.detalhes?.pais || v?.pais || "";
 const flag = bandeiraPais(pais);
 return flag ? `<span class="flag-card" title="${pais}">${flag}</span>` : "";
}


function classeTipo(tipo){
 if(tipo==="Branco") return "branco";
 if(tipo==="Rosé") return "rose";
 if(tipo==="Espumante") return "espumante";
 return "tinto";
}

function iconeTipo(tipo){
 if(tipo==="Branco") return "🥂";
 if(tipo==="Espumante") return "🍾";
 return "🍷";
}

function setMenuAtivo(){
 ["Todos","Tinto","Branco","Rosé","Espumante"].forEach(t=>{
   const id = "tipo" + t;
   const el = document.getElementById(id);
   if(el) el.classList.remove("active");
 });
 const ativo = filtroAtual ? document.getElementById("tipo"+filtroAtual) : document.getElementById("tipoTodos");
 if(ativo) ativo.classList.add("active");
}


function vinhosEmEstoqueOrdenadosPorConsumo(){
 return vinhos
   .map((v,index)=>({...v,index}))
   .filter(v=>Number(v.quantidade || 0) > 0)
   .map(v=>({ ...v, infoGuarda: calcularInfoGuarda(v), prioridadeInfo: prioridadeConsumo(v) }))
   .filter(v=>v.infoGuarda.classe !== "guarda-indefinido")
   .sort((a,b)=>{
     if(a.prioridadeInfo.prioridade !== b.prioridadeInfo.prioridade) return a.prioridadeInfo.prioridade - b.prioridadeInfo.prioridade;
     if(a.prioridadeInfo.limite !== b.prioridadeInfo.limite) return a.prioridadeInfo.limite - b.prioridadeInfo.limite;
     return Number(a.safra || 9999) - Number(b.safra || 9999);
   });
}

function htmlItemRecomendacao(v){
 const g = v.infoGuarda || calcularInfoGuarda(v);
 return `
   <div class="rec-item" onclick="abrirDetalhes(${v.index})">
     <div>
       <strong>${v.nome} ${v.safra ? "• " + v.safra : ""}</strong>
       <span>${v.tipo || "-"} • ${v.detalhes?.pais || "-"} • ${g.detalhe}</span>
     </div>
     <span class="guarda-badge ${g.classe}">${g.icone} ${g.status}</span>
   </div>`;
}

function toggleRecomendacoesCard(event){
 const card = document.getElementById("cardRecomendacoesConsumo");
 if(!card) return;
 if(event && event.target && event.target.closest && event.target.closest(".rec-item")) return;
 const expandido = card.classList.toggle("rec-expanded");
 card.classList.toggle("rec-collapsed", !expandido);
 const chevron = document.getElementById("recChevron");
 if(chevron) chevron.innerText = expandido ? "▼" : "▶";
}

function recolherRecomendacoesCard(){
 const card = document.getElementById("cardRecomendacoesConsumo");
 if(!card) return;
 card.classList.remove("rec-expanded");
 card.classList.add("rec-collapsed");
 const chevron = document.getElementById("recChevron");
 if(chevron) chevron.innerText = "▶";
}


function vinhosDesejados(){
 const daTabela = (vinhosDesejadosTabela || []).map(c=>({
   ...c,
   origemWishlist: c.origem || "wishlist",
   dataReferencia: c.createdAt || ""
 }));

 const dosConsumos = (consumosExternos || [])
   .filter(c=>String(c.compraria || "").toLowerCase() === "sim")
   .map(c=>({
     ...c,
     origemWishlist: "consumo_externo",
     dataReferencia: c.dataConsumo || ""
   }));

 return [...daTabela, ...dosConsumos].sort((a,b)=>{
   const dataB = String(b.dataReferencia || b.createdAt || b.dataConsumo || "");
   const dataA = String(a.dataReferencia || a.createdAt || a.dataConsumo || "");
   if(dataB !== dataA) return dataB.localeCompare(dataA);
   return Number(b.notaVivino || 0) - Number(a.notaVivino || 0);
 });
}

function htmlItemVinhoDesejado(c){
 const nome = `${c.nome || "Vinho"} ${c.safra ? "• " + c.safra : ""}`;
 const detalhes = [
   c.tipo || "-",
   c.produtor && c.produtor !== "-" ? c.produtor : "",
   c.pais && c.pais !== "-" ? c.pais : "",
   c.regiao && c.regiao !== "-" ? c.regiao : ""
 ].filter(Boolean).join(" • ");

 const origem = c.origemWishlist === "foto_rotulo" ? "Foto do rótulo" :
                c.origemWishlist === "consumo_externo" ? (c.local && c.local !== "-" ? c.local : "Consumo externo") :
                (c.origem || "Wishlist");
 const data = c.dataConsumo ? `Consumido em ${c.dataConsumo}` :
              c.createdAt ? `Adicionado em ${String(c.createdAt).slice(0,10)}` :
              "Data não informada";
 const nota = Number(c.notaVivino || 0);
 const podeRemover = !!c.id;
 const origemRemocao = c.origemWishlist === "consumo_externo" ? "consumo_externo" : "wishlist";

 return `
   <div class="rec-item wishlist-item">
     <div>
       <strong>${nome}</strong>
       <span>${detalhes || "Vinho desejado"}<br>${data} • ${origem}</span>
     </div>
     <span class="wishlist-badge">♡ ${nota ? nota.toFixed(1) : "Desejado"}</span>
     ${podeRemover ? `<button class="wishlist-remove-btn" title="Remover dos desejados" onclick="removerVinhoDesejado(event,'${c.id}','${origemRemocao}','${String(c.nome || "Vinho").replace(/'/g,"\\'") }')">🗑️</button>` : ""}
   </div>`;
}


async function removerVinhoDesejado(event, id, origem="wishlist", nome="Vinho"){
 if(event){
   event.preventDefault();
   event.stopPropagation();
 }
 if(!id){
   mostrarMensagem("Não foi possível identificar este vinho desejado para remoção.", {tipo:"erro", titulo:"Erro ao remover", icone:"❌"});
   return;
 }

 const confirmado = await confirmarAdega(`Remover ${nome || "este vinho"} da lista de desejos?`, {
   titulo:"Remover da Wishlist?",
   icone:"🗑️",
   confirmar:"Remover",
   cancelar:"Cancelar",
   perigo:true
 });
 if(!confirmado) return;

 const btn = event?.target?.closest ? event.target.closest("button") : null;
 if(btn) btn.disabled = true;

 if(modoTesteAtivo()){
   if(btn) btn.disabled = false;
   await simularModoTeste("Remoção da wishlist simulada. Nada foi alterado.", {titulo:"Wishlist simulada"});
   return;
 }

 try{
   if(origem === "consumo_externo"){
     const {error} = await supabaseClient
       .from("consumos_externos")
       .update({compraria:null})
       .eq("id", id);
     if(error) throw error;
   }else{
     const {error} = await supabaseClient
       .from("vinhos_desejados")
       .delete()
       .eq("id", id);
     if(error) throw error;
   }

   await carregarDoSupabase(true);
   renderizarVinhosDesejados();
   const modalAberto = document.getElementById("modalVinhosDesejados")?.style.display === "flex";
   if(modalAberto) abrirVinhosDesejados();
   mostrarMensagem("O vinho foi removido com sucesso da sua lista de desejos.", {tipo:"sucesso", titulo:"Removido da Wishlist", icone:"🗑️", botao:"OK"});
 }catch(e){
   console.error(e);
   mostrarMensagem("Não foi possível remover o vinho da lista de desejos. Verifique a conexão e as permissões no Supabase.", {tipo:"erro", titulo:"Erro ao remover", icone:"❌"});
 }finally{
   if(btn) btn.disabled = false;
 }
}

function toggleVinhosDesejadosCard(event){
 const card = document.getElementById("cardVinhosDesejados");
 if(!card) return;
 if(event && event.target && event.target.closest && event.target.closest(".rec-item")) return;
 const expandido = card.classList.toggle("rec-expanded");
 card.classList.toggle("rec-collapsed", !expandido);
 const chevron = document.getElementById("wishlistChevron");
 if(chevron) chevron.innerText = expandido ? "▼" : "▶";
}

function renderizarVinhosDesejados(){
 const card = document.getElementById("cardVinhosDesejados");
 const lista = document.getElementById("listaVinhosDesejados");
 const resumo = document.getElementById("textoResumoVinhosDesejados");
 if(!card || !lista) return;

 const desejados = vinhosDesejados();
 card.style.display = "block";
 if(!card.classList.contains("rec-expanded")){
   card.classList.add("rec-collapsed");
 }

 if(!desejados.length){
   if(resumo) resumo.innerText = "Nenhum vinho desejado ainda";
   lista.innerHTML = `<div class="rec-empty">Nenhum vinho desejado ainda.</div>`;
   return;
 }

 const top = desejados.slice(0,3);
 const ultimo = desejados[0];
 if(resumo){
   resumo.innerText = `${desejados.length} vinho${desejados.length === 1 ? "" : "s"} desejado${desejados.length === 1 ? "" : "s"}${ultimo?.nome ? " • Último: " + ultimo.nome : ""}`;
 }
 lista.innerHTML = top.map(htmlItemVinhoDesejado).join("");
}

function abrirVinhosDesejados(){
 const el = document.getElementById("modalListaVinhosDesejados");
 if(!el) return;

 const desejados = vinhosDesejados();
 if(!desejados.length){
   el.innerHTML = `<div class="rec-empty">Nenhum vinho desejado ainda. Use a foto do rótulo ou marque “Compraria para a adega? Sim” em um consumo externo.</div>`;
 }else{
   el.innerHTML = desejados.map(htmlItemVinhoDesejado).join("");
 }
 document.getElementById("modalVinhosDesejados").style.display = "flex";
}

function fecharVinhosDesejados(){
 document.getElementById("modalVinhosDesejados").style.display = "none";
}

function renderizarRecomendacoesConsumo(){
 const card = document.getElementById("cardRecomendacoesConsumo");
 const lista = document.getElementById("listaRecomendacoesConsumo");
 const resumo = document.getElementById("textoResumoRecomendacoes");
 if(!card || !lista) return;

 const recomendados = vinhosEmEstoqueOrdenadosPorConsumo();
 if(!recomendados.length){
   card.style.display = "none";
   return;
 }

 const prioritarios = recomendados.filter(v=>["guarda-passou","guarda-limite","guarda-pronto"].includes(v.infoGuarda.classe));
 const base = prioritarios.length ? prioritarios : recomendados;
 const top = base.slice(0,3);

 card.style.display = "block";
 if(!card.classList.contains("rec-expanded")){
   card.classList.add("rec-collapsed");
 }
 const urgentes = base.filter(v=>["guarda-passou","guarda-limite"].includes(v.infoGuarda.classe)).length;
 if(resumo){
   resumo.innerText = urgentes
     ? `${base.length} vinho${base.length === 1 ? "" : "s"} recomendados • ${urgentes} urgente${urgentes === 1 ? "" : "s"}`
     : `${base.length} vinho${base.length === 1 ? "" : "s"} na janela de consumo`;
 }
 lista.innerHTML = top.map(htmlItemRecomendacao).join("");
}

function abrirRecomendacoesConsumo(){
 const el = document.getElementById("modalListaRecomendacoes");
 if(!el) return;
 const recomendados = vinhosEmEstoqueOrdenadosPorConsumo();
 if(!recomendados.length){
   el.innerHTML = `<div class="rec-empty">Nenhum vinho com safra e potencial de guarda suficientes para recomendação.</div>`;
 }else{
   const grupos = [
     {titulo:"🔴 Mais urgentes", classes:["guarda-passou","guarda-limite"]},
     {titulo:"🟡 Prontos para beber", classes:["guarda-pronto"]},
     {titulo:"🟢 Ainda jovens", classes:["guarda-jovem"]}
   ];
   el.innerHTML = grupos.map(g=>{
     const itens = recomendados.filter(v=>g.classes.includes(v.infoGuarda.classe));
     if(!itens.length) return "";
     return `<div class="rec-secao-titulo">${g.titulo}</div>` + itens.map(htmlItemRecomendacao).join("");
   }).join("") || `<div class="rec-empty">Nenhum vinho recomendado no momento.</div>`;
 }
 document.getElementById("modalRecomendacoesConsumo").style.display = "flex";
}

function fecharRecomendacoesConsumo(){
 document.getElementById("modalRecomendacoesConsumo").style.display = "none";
}

function selecionarOrdenacaoConsumo(){
 const ordenacao = document.getElementById("ordenacao");
 if(ordenacao) ordenacao.value = "consumo-recomendado";
 fecharRecomendacoesConsumo();
 mostrarAba("adega");
 renderizar();
}

function ordenarListaVinhos(lista, ordenacao){
 lista.sort((a,b)=>{
   if(ordenacao==="potencial-consumo" || ordenacao==="consumo-recomendado"){
     const pa = prioridadeConsumo(a);
     const pb = prioridadeConsumo(b);
     if(pa.prioridade !== pb.prioridade) return pa.prioridade - pb.prioridade;
     if(pa.limite !== pb.limite) return pa.limite - pb.limite;
     return Number(a.safra||9999) - Number(b.safra||9999);
   }
   if(ordenacao==="safra-antiga") return Number(a.safra||0) - Number(b.safra||0);
   if(ordenacao==="safra-nova") return Number(b.safra||0) - Number(a.safra||0);
   if(ordenacao==="quantidade") return Number(b.quantidade||0) - Number(a.quantidade||0);
   if(ordenacao==="vivino") return Number(b.detalhes?.notaVivino || 0) - Number(a.detalhes?.notaVivino || 0);
   return a.nome.localeCompare(b.nome);
 });
 return lista;
}

function htmlCardVinhoLista(v, semEstoque=false){
 return `
   <div class="vinho ${semEstoque ? "sem-estoque" : ""}" onclick="abrirDetalhes(${v.index})">
     ${htmlBandeiraPais(v)}
     <div>
      <div class="titulo-vinho">
        <strong>${v.nome}</strong>
        ${v.detalhes?.notaVivino ? `<span class="vivino-badge">⭐ ${v.detalhes.notaVivino.toFixed(1)}</span>` : ""}
        ${semEstoque ? `<span class="sem-estoque-badge">Sem estoque</span>` : ""}
      </div>
       <div class="meta">Safra ${v.safra || "-"} &nbsp;•&nbsp; ${v.tipo} &nbsp;•&nbsp; ${v.quantidade || 0} garrafa${Number(v.quantidade)==1 ? "" : "s"} &nbsp;•&nbsp; ${htmlBadgeGuarda(v)}</div>
     </div>

     <div class="wine-visual">
       ${htmlMiniaturaVinho(v)}
     </div>

     <div class="actions">
       <button class="btn-card btn-plus" onclick="event.stopPropagation(); alterar(${v.index},1)">+</button>
       <button class="btn-card btn-minus" onclick="event.stopPropagation(); alterar(${v.index},-1)">−</button>
     </div>

     <div class="arrow">›</div>
   </div>`;
}

function toggleVinhosSemEstoque(){
 const secao = document.getElementById("secaoVinhosSemEstoque");
 const chevron = document.getElementById("semEstoqueChevron");
 if(!secao) return;
 const expandido = secao.classList.toggle("expanded");
 secao.classList.toggle("collapsed", !expandido);
 if(chevron) chevron.innerText = expandido ? "▼" : "▶";
}

function renderizar(){
 const busca = document.getElementById("buscaTopo").value.toLowerCase().trim();
 const ordenacao = document.getElementById("ordenacao").value;
 const lista = document.getElementById("listaVinhos");
 const listaSemEstoque = document.getElementById("listaVinhosSemEstoque");
 const secaoSemEstoque = document.getElementById("secaoVinhosSemEstoque");
 const tituloSemEstoque = document.getElementById("tituloVinhosSemEstoque");
 const abaAdegaAtual = document.getElementById("abaAdega");
 const adegaVisivel = !abaAdegaAtual || abaAdegaAtual.style.display !== "none";

 let resultado = vinhos
  .map((v,index)=>({...v,index}))
  .filter(v=>{
    const texto = `${v.nome} ${v.safra} ${v.tipo} ${v.detalhes?.produtor || ""} ${v.detalhes?.uva || ""}`.toLowerCase();
    return (!filtroAtual || v.tipo===filtroAtual) && texto.includes(busca);
  });

 const emEstoque = ordenarListaVinhos(resultado.filter(v=>Number(v.quantidade || 0) > 0), ordenacao);
 const semEstoque = ordenarListaVinhos(resultado.filter(v=>Number(v.quantidade || 0) <= 0), ordenacao);

 lista.innerHTML = "";
 if(emEstoque.length===0){
   lista.innerHTML = `<div class="empty">Nenhum vinho em estoque encontrado.</div>`;
 }else{
   lista.innerHTML = emEstoque.map(v=>htmlCardVinhoLista(v,false)).join("");
 }

 if(secaoSemEstoque && listaSemEstoque){
   if(semEstoque.length){
     secaoSemEstoque.style.display = adegaVisivel ? "block" : "none";
     if(tituloSemEstoque){
       tituloSemEstoque.innerText = `📦 Vinhos sem estoque (${semEstoque.length})`;
     }
     listaSemEstoque.innerHTML = semEstoque.map(v=>htmlCardVinhoLista(v,true)).join("");
   }else{
     secaoSemEstoque.style.display = "none";
     listaSemEstoque.innerHTML = "";
   }
 }

 atualizarResumo();
 setMenuAtivo();
 renderizarRecomendacoesConsumo();
 renderizarVinhosDesejados();
 const abaEstatisticas = document.getElementById("abaEstatisticas");
 if(abaEstatisticas && abaEstatisticas.style.display === "block") renderizarEstatisticas();
 const abaAdega3DAtual = document.getElementById("abaAdega3D");
 if(abaAdega3DAtual && abaAdega3DAtual.style.display === "block") renderizarAdega3D();
}
function filtrarTodos(){
 filtroAtual = "";
 document.getElementById("buscaTopo").value = "";
 renderizar();
}

function filtrarPorTipo(tipo){
 filtroAtual = tipo;
 document.getElementById("buscaTopo").value = "";
 renderizar();
}

function definirQuantidade(i,valor){
 const q = parseInt(valor);
 vinhos[i].quantidade = isNaN(q) || q < 0 ? 0 : q;
 salvar();
 renderizar();
}

function alterar(i,valor){
 vinhos[i].quantidade = Number(vinhos[i].quantidade || 0) + valor;
 if(vinhos[i].quantidade < 0) vinhos[i].quantidade = 0;
 salvar();
 renderizar();
}

function abrirCadastro(){

 limparFormulario();
 
 document.getElementById("modalCadastro").style.display = "flex";
 setTimeout(()=>document.getElementById("nome").focus(),150);
}

function fecharCadastro(){
 document.getElementById("modalCadastro").style.display = "none";
}

function togglePresenteadoPor(){
 const origem = document.getElementById("compradoPor").value;
 const campo = document.getElementById("presenteadoPor");
 campo.style.display = origem === "Presente" ? "block" : "none";
 if(origem !== "Presente") campo.value = "";
}

function moeda(valor){
 const n = Number(valor || 0);
 return n ? n.toLocaleString("pt-BR",{style:"currency",currency:"BRL"}) : "-";
}

function criarAquisicaoAtual(){
 return {
   data: document.getElementById("dataCompra").value || "",
   loja: document.getElementById("loja").value.trim() || "-",
   quantidade: 1,
   valorUnitario: Number(document.getElementById("valorPago").value || 0),
   compradoPor: document.getElementById("compradoPor").value,
   presenteadoPor: document.getElementById("presenteadoPor").value.trim(),
   localizacao: document.getElementById("localizacao").value.trim(),
   consumida: false,
   dataConsumo: "",
   eventoConsumo: "",
   observacaoConsumo: "",
   ocasiao: document.getElementById("ocasiao").value.trim()
 };
}

function limparFormulario(){
 ["nome","safra","produtor","uva","pais","regiao","potencialGuarda","loja","valorPago","presenteadoPor","ocasiao","localizacao","notaVivino"].forEach(id=>{
   const el = document.getElementById(id);
   if(el) el.value = "";
 });
 document.getElementById("quantidade").value = "";
 document.getElementById("tipo").value = "";
 document.getElementById("compradoPor").value = "";
 document.getElementById("dataCompra").value =
   new Date().toISOString().split("T")[0];

 const foto = document.getElementById("fotoVinho");
 if(foto) foto.value = "";
 const preview = document.getElementById("fotoPreviewCadastro");
 if(preview){
   preview.src = "";
   preview.style.display = "none";
 }
 setStatusIA("");
 fotoUrlPreCadastro = "";

 togglePresenteadoPor();
}

async function adicionarVinho(){
 const nome = document.getElementById("nome").value.trim();
 const safra = document.getElementById("safra").value.trim();
 const tipo = document.getElementById("tipo").value;
 const quantidade = parseInt(document.getElementById("quantidade").value) || 1;
 if(!nome){ alert("Informe o nome do vinho"); return; }
 if(!tipo){ alert("Selecione o tipo do vinho."); return; }

 const aquisicoesNovas = [];
 for(let n = 1; n <= quantidade; n++){
   const aquisicao = criarAquisicaoAtual();
   aquisicao.quantidade = 1;
   aquisicao.identificador = `Garrafa ${n}`;
   aquisicoesNovas.push(aquisicao);
 }

 const detalhes = {
   produtor: document.getElementById("produtor").value.trim() || "-",
   uva: document.getElementById("uva").value.trim() || "-",
   pais: document.getElementById("pais").value.trim() || "-",
   regiao: document.getElementById("regiao").value.trim() || "-",
   guarda: document.getElementById("potencialGuarda").value.trim(),
   notaVivino: Number(document.getElementById("notaVivino").value || 0),
   notas: ""
 };

 if(modoTesteAtivo()){
   limparFormulario();
   fecharCadastro();
   await simularModoTeste(`Cadastro simulado: ${nome}${safra ? " • " + safra : ""}. Nenhum vinho ou garrafa foi gravado.`, {titulo:"Vinho simulado"});
   return;
 }

 try{
   const fotoInput = document.getElementById("fotoVinho");
   const fotoFile = fotoInput?.files && fotoInput.files[0];
   const fotoUrl = fotoFile ? await uploadFotoVinho(fotoFile, nome, safra) : (fotoUrlPreCadastro || "");

   const existente = vinhos.find(v => v.nome.toLowerCase()===nome.toLowerCase() && String(v.safra)===String(safra));
   if(existente && existente.id){
     garantirEstrutura(existente);
     existente.tipo = tipo;
     existente.detalhes = {...existente.detalhes, ...detalhes};
     if(fotoUrl) existente.fotoUrl = fotoUrl;
     await atualizarVinhoSupabase(existente);
     await inserirGarrafas(existente.id, aquisicoesNovas);
   }else{
     const {data, error} = await supabaseClient.from("vinhos").insert({
       nome,
       safra: safra ? Number(safra) : null,
       tipo,
       produtor: detalhes.produtor,
       uva: detalhes.uva,
       pais: detalhes.pais,
       regiao: detalhes.regiao,
       nota_vivino: detalhes.notaVivino,
       potencial_guarda: detalhes.guarda || null,
       notas: "",
       foto_url: fotoUrl || null
     }).select("id").single();
     if(error) throw error;
     await inserirGarrafas(data.id, aquisicoesNovas);
   }
   fotoUrlPreCadastro = "";
   limparFormulario();
   fecharCadastro();
   await carregarDoSupabase(true);
 }catch(e){
   console.error(e);
   alert("Não foi possível salvar o vinho no Supabase.");
 }
}


function letraPrateleira(idx){
 const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
 const n = Number(idx || 0);
 if(n < letras.length) return letras[n];
 return `P${n+1}`;
}

function capacidadeVisualAdega(adega){
 if(!adega) return 0;
 const capacidade = Math.max(0, Number(adega.capacidade || 0));
 const prateleiras = Math.max(1, Number(adega.prateleiras || 1));
 const porPrateleira = Math.max(1, Number(adega.garrafasPorPrateleira || Math.ceil((capacidade || 1) / prateleiras)));
 const capacidadePorLayout = prateleiras * porPrateleira;

 // Quando a adega é editada aumentando prateleiras/colunas, a visualização
 // precisa criar também os novos nichos clicáveis. Antes o app continuava
 // limitado ao campo capacidade, então as novas prateleiras apareciam, mas
 // não geravam espaços para incluir/mover garrafas.
 return Math.max(capacidade, capacidadePorLayout);
}

function gerarPosicoesAdega(adega){
 if(!adega) return [];
 const capacidade = capacidadeVisualAdega(adega);
 const prateleiras = Math.max(1, Number(adega.prateleiras || 1));
 const porPrateleira = Math.max(1, Number(adega.garrafasPorPrateleira || Math.ceil((capacidade || 1) / prateleiras)));
 const posicoes = [];
 let contador = 0;
 for(let p=0; p<prateleiras; p++){
   const letra = letraPrateleira(p);
   for(let s=1; s<=porPrateleira; s++){
     contador++;
     if(capacidade && contador > capacidade) break;
     posicoes.push(`${letra}${s}`);
   }
 }
 return posicoes;
}

function htmlOptionsAdegasSelecionada(valorAtual=""){
 const ativas = adegas.filter(a=>a.ativa !== false);
 const options = [`<option value="">Sem adega definida</option>`];
 ativas.forEach(a=>{
   const selected = String(a.id) === String(valorAtual || "") ? " selected" : "";
   options.push(`<option value="${a.id}"${selected}>${a.nome || "Adega"}</option>`);
 });
 return options.join("");
}

function htmlOptionsPosicoesAdega(adegaId, valorAtual=""){
 const adega = adegas.find(a=>String(a.id) === String(adegaId || ""));
 const options = [`<option value="">Sem posição</option>`];
 gerarPosicoesAdega(adega).forEach(pos=>{
   const selected = String(pos) === String(valorAtual || "") ? " selected" : "";
   options.push(`<option value="${pos}"${selected}>${pos}</option>`);
 });
 return options.join("");
}

function nomeAdegaPorId(id){
 const a = adegas.find(x=>String(x.id) === String(id || ""));
 return a?.nome || "Sem adega definida";
}

function atualizarOpcoesPosicaoGarrafa(idx){
 const adegaSelect = document.getElementById(`garrafaAdega_${idx}`);
 const posSelect = document.getElementById(`garrafaPosicao_${idx}`);
 if(!adegaSelect || !posSelect) return;
 const posicaoAtual = posSelect.value || "";
 posSelect.innerHTML = htmlOptionsPosicoesAdega(adegaSelect.value, posicaoAtual);
}

function posicaoOcupadaEmOutraGarrafa(adegaId, posicao, garrafaIdIgnorada){
 if(!adegaId || !posicao) return null;
 for(const v of vinhos){
   garantirEstrutura(v);
   for(const a of (v.aquisicoes || [])){
     if(a.consumida) continue;
     if(garrafaIdIgnorada && String(a.id || "") === String(garrafaIdIgnorada)) continue;
     if(String(a.adegaId || "") === String(adegaId) && String(a.posicaoAdega || "") === String(posicao)){
       return {vinho:v, garrafa:a};
     }
   }
 }
 return null;
}

async function salvarPosicaoGarrafa(vinhoIndex, aquisicaoIndex){
 const v = garantirEstrutura(vinhos[vinhoIndex]);
 const a = v?.aquisicoes?.[aquisicaoIndex];
 if(!v || !a || !a.id){
   mostrarMensagem("Não foi possível identificar esta garrafa para salvar a posição.", {tipo:"erro", titulo:"Erro ao salvar posição", icone:"❌"});
   return;
 }
 const adegaId = document.getElementById(`garrafaAdega_${aquisicaoIndex}`)?.value || "";
 const posicao = document.getElementById(`garrafaPosicao_${aquisicaoIndex}`)?.value || "";
 if(posicao && !adegaId){
   mostrarMensagem("Escolha a adega antes de informar a posição da garrafa.", {tipo:"aviso", titulo:"Adega não informada", icone:"⚠️"});
   return;
 }
 const ocupada = posicaoOcupadaEmOutraGarrafa(adegaId, posicao, a.id);
 if(ocupada){
   mostrarMensagem(`A posição ${posicao} já está ocupada por ${ocupada.vinho.nome}${ocupada.vinho.safra ? " • " + ocupada.vinho.safra : ""}.`, {tipo:"aviso", titulo:"Posição ocupada", icone:"⚠️"});
   return;
 }
 if(modoTesteAtivo()){
   await simularModoTeste("Alteração de posição simulada. A garrafa não foi movida no Supabase.", {titulo:"Posição simulada"});
   await carregarDoSupabase(true);
   abrirDetalhes(vinhoIndex);
   return;
 }
 try{
   const {error} = await supabaseClient
     .from("garrafas")
     .update({adega_id: adegaId || null, posicao_adega: posicao || null})
     .eq("id", a.id);
   if(error) throw error;
   await carregarDoSupabase(true);
   const novoIndex = vinhos.findIndex(item=>String(item.id) === String(v.id));
   if(novoIndex >= 0) abrirDetalhes(novoIndex);
   renderizarAdega3D();
   mostrarMensagem("A posição da garrafa foi salva com sucesso.", {tipo:"sucesso", titulo:"Posição salva", icone:"🍷", botao:"OK"});
 }catch(e){
   console.error(e);
   mostrarMensagem("Não foi possível salvar a posição da garrafa no Supabase.", {tipo:"erro", titulo:"Erro ao salvar posição", icone:"❌"});
 }
}

async function salvarPosicoesGarrafasDetalhe(v){
 const atualizacoes = [];
 (v.aquisicoes || []).forEach((a,idx)=>{
   if(!a.id) return;
   const adegaId = document.getElementById(`garrafaAdega_${idx}`)?.value || "";
   const posicao = document.getElementById(`garrafaPosicao_${idx}`)?.value || "";
   if(String(a.adegaId || "") === String(adegaId) && String(a.posicaoAdega || "") === String(posicao)) return;
   atualizacoes.push({id:a.id, adegaId, posicao});
 });
 if(modoTesteAtivo() && atualizacoes.length){
   await simularModoTeste("Posições das garrafas simuladas. Nenhuma posição foi gravada.", {titulo:"Posições simuladas"});
   return;
 }
 for(const item of atualizacoes){
   const {error} = await supabaseClient
     .from("garrafas")
     .update({adega_id:item.adegaId || null, posicao_adega:item.posicao || null})
     .eq("id", item.id);
   if(error) throw error;
 }
}

function toggleEditorPosicaoGarrafa(idx){
 const card = document.getElementById(`garrafaPosicaoCard_${idx}`);
 if(!card) return;
 card.classList.toggle("expanded");
}

function htmlEditorPosicaoGarrafa(a, idx){
 const adegaNome = a.adegaId ? nomeAdegaPorId(a.adegaId) : "Sem adega definida";
 const posicao = a.posicaoAdega || "Sem posição";
 const resumo = a.adegaId || a.posicaoAdega
   ? `${adegaNome}${a.posicaoAdega ? " • " + posicao : ""}`
   : "Definir posição";
 return `
   <div id="garrafaPosicaoCard_${idx}" class="garrafa-posicao-card">
     <button type="button" class="garrafa-posicao-toggle" onclick="event.stopPropagation(); toggleEditorPosicaoGarrafa(${idx})" title="Editar posição da garrafa">
       <span class="garrafa-posicao-toggle-main">
         <span class="garrafa-posicao-pin">📍</span>
         <span class="garrafa-posicao-texto">${resumo}</span>
       </span>
       <span class="garrafa-posicao-chevron">▶</span>
     </button>
     <div class="garrafa-posicao-panel">
       <small>Posição real da garrafa</small>
       <div class="garrafa-posicao-grid">
         <select id="garrafaAdega_${idx}" onchange="atualizarOpcoesPosicaoGarrafa(${idx})">
           ${htmlOptionsAdegasSelecionada(a.adegaId)}
         </select>
         <select id="garrafaPosicao_${idx}">
           ${htmlOptionsPosicoesAdega(a.adegaId, a.posicaoAdega)}
         </select>
         <button type="button" class="btn-secondary btn-salvar-posicao" onclick="event.stopPropagation(); salvarPosicaoGarrafa(${vinhoSelecionado}, ${idx})">Salvar posição</button>
       </div>
       <div class="garrafa-posicao-resumo">Atual: <b>${adegaNome}</b>${a.posicaoAdega ? ` • posição <b>${posicao}</b>` : ""}</div>
     </div>
   </div>`;
}

function abrirDetalhes(i){
 vinhoSelecionado = i;
 const v = garantirEstrutura(vinhos[i]);

 document.getElementById("modalNome").innerText = v.nome;
 document.getElementById("modalResumo").innerText = `Safra ${v.safra || "-"} • ${v.tipo}`;
 const setValorDetalhe = (id, valor)=>{ const el = document.getElementById(id); if(el) el.value = (valor && valor !== "-") ? valor : ""; };
 setValorDetalhe("modalEditProdutor", v.detalhes.produtor);
 setValorDetalhe("modalEditUva", v.detalhes.uva);
 setValorDetalhe("modalEditPais", v.detalhes.pais);
 setValorDetalhe("modalEditRegiao", v.detalhes.regiao);
 setValorDetalhe("modalEditTipo", v.tipo);
 document.getElementById("modalQuantidade").innerText = `${v.quantidade} garrafa${v.quantidade == 1 ? "" : "s"}`;
 const infoGuarda = calcularInfoGuarda(v);
 setValorDetalhe("modalEditPotencialGuarda", v.detalhes.guarda);
 document.getElementById("modalStatusGuarda").innerHTML = `<span class="guarda-badge ${infoGuarda.classe}">${infoGuarda.icone} ${infoGuarda.status}</span>`;
 document.getElementById("modalTextoGuarda").innerText = infoGuarda.detalhe;
 document.getElementById("modalNotas").value = v.detalhes.notas || "";
 const modalFotoWrap = document.getElementById("modalFotoWrap");
 if(modalFotoWrap) modalFotoWrap.innerHTML = htmlFotoDetalhe(v);
 const fotoDetalhe = document.getElementById("fotoDetalhe");
 if(fotoDetalhe) fotoDetalhe.value = "";
 const previewDetalhe = document.getElementById("fotoPreviewDetalheWrap");
 if(previewDetalhe){
   previewDetalhe.style.display = "none";
   previewDetalhe.innerHTML = "";
 }

 const aquisicoes = v.aquisicoes || [];
 const totalPago = aquisicoes.reduce((s,a)=>s + Number(a.valorUnitario || 0) * Number(a.quantidade || 0),0);
 const totalQtdComprada = aquisicoes.reduce((s,a)=>s + Number(a.quantidade || 0),0);
 const totalConsumidas = aquisicoes.filter(a=>a.consumida).reduce((s,a)=>s + Number(a.quantidade || 0),0);
 const totalNaAdega = aquisicoes.length ? totalQtdComprada - totalConsumidas : Number(v.quantidade || 0);

document.getElementById("modalAquisicoes").innerHTML = aquisicoes.length
   ? aquisicoes.map((a,idx)=>`
     <div class="purchase-card garrafa-card">
       <div class="garrafa-card-head">
         <strong>
           ${a.data || "Data não informada"} • ${a.loja || "-"}
           ${a.consumida ? '<span class="consumida-badge">Consumida</span>' : ""}
         </strong>
         <button type="button" class="garrafa-remove-btn" title="Excluir esta garrafa" aria-label="Excluir esta garrafa" onclick="event.stopPropagation(); excluirGarrafa(${i}, ${idx})">🗑</button>
       </div>

       <div class="purchase-meta">
         Quantidade: ${a.quantidade || 0} garrafa${Number(a.quantidade)==1 ? "" : "s"}<br>
         Localização: ${a.localizacao || "-"}<br>
         Valor unitário: ${moeda(a.valorUnitario)}<br>
         Origem: ${a.compradoPor || "-"}${a.compradoPor==="Presente" && a.presenteadoPor ? " • Presente de " + a.presenteadoPor : ""}
         ${a.ocasiao ? "<br>Ocasião da compra: " + a.ocasiao : ""}
         ${!a.consumida ? htmlEditorPosicaoGarrafa(a, idx) : (a.adegaId || a.posicaoAdega ? `<div class="garrafa-posicao-resumo" style="margin-top:10px">Posição antes do consumo: <b>${nomeAdegaPorId(a.adegaId)}</b>${a.posicaoAdega ? " • " + a.posicaoAdega : ""}</div>` : "")}
         ${a.consumida ? `
           <div class="consumo-status-card">
             <strong>✅ Consumida${a.dataConsumo ? " em " + a.dataConsumo : ""}</strong>
             ${a.eventoConsumo ? `<span>Ocasião: ${a.eventoConsumo}</span>` : ""}
             ${a.observacaoConsumo ? `<span>${a.observacaoConsumo}</span>` : ""}
           </div>
         ` : `
           <div class="consumo-action-card">
             <button type="button" class="btn-consumir-garrafa" onclick="event.stopPropagation(); abrirModalConsumirGarrafa(${i}, ${idx})">🍷 Consumir garrafa</button>
           </div>
         `}
       </div>
     </div>
   `).join("")
   : `<div class="empty">Nenhuma aquisição detalhada registrada para este vinho.</div>`;

 document.getElementById("modalResumoCompras").innerHTML = `
   <strong>Resumo financeiro e estoque</strong><br>
   Quantidade registrada em aquisições: ${totalQtdComprada || 0}<br>
   Na adega: ${totalNaAdega || 0}<br>
   Consumidas: ${totalConsumidas || 0}<br>
   Valor total pago conhecido: ${moeda(totalPago)}
 `;

 const modalDetalhesEl = document.getElementById("modalDetalhes");
 modalDetalhesEl.style.display = "flex";
 modalDetalhesEl.scrollTop = 0;
 aplicarModoEdicaoDetalhe(false);
}


let consumoGarrafaPendente = null;
let adicionarGarrafasVinhoId = null;

function limparFormularioAdicionarGarrafas(){
 const hoje = new Date().toISOString().slice(0,10);
 const campos = {
   addGarrafaQuantidade:"1",
   addGarrafaDataCompra:hoje,
   addGarrafaLoja:"",
   addGarrafaValorPago:"",
   addGarrafaCompradoPor:"",
   addGarrafaPresenteadoPor:"",
   addGarrafaLocalizacao:"",
   addGarrafaOcasiao:""
 };
 Object.entries(campos).forEach(([id,valor])=>{
   const el = document.getElementById(id);
   if(el) el.value = valor;
 });
 toggleAddGarrafaPresenteadoPor();
}

function toggleAddGarrafaPresenteadoPor(){
 const origem = document.getElementById("addGarrafaCompradoPor")?.value || "";
 const campo = document.getElementById("addGarrafaPresenteadoPor");
 if(!campo) return;
 campo.style.display = origem === "Presente" ? "block" : "none";
 if(origem !== "Presente") campo.value = "";
}

function abrirModalAdicionarGarrafas(){
 if(vinhoSelecionado === null) return;
 const v = garantirEstrutura(vinhos[vinhoSelecionado]);
 if(!v || !v.id){
   mostrarMensagem("Não foi possível identificar o vinho para adicionar garrafas.", {tipo:"erro", titulo:"Erro ao adicionar", icone:"❌"});
   return;
 }
 adicionarGarrafasVinhoId = v.id;
 limparFormularioAdicionarGarrafas();
 const resumo = document.getElementById("adicionarGarrafasResumo");
 if(resumo) resumo.innerText = `${v.nome} • Safra ${v.safra || "-"}`;
 document.getElementById("modalAdicionarGarrafas").style.display = "flex";
}

function fecharModalAdicionarGarrafas(){
 const modal = document.getElementById("modalAdicionarGarrafas");
 if(modal) modal.style.display = "none";
 adicionarGarrafasVinhoId = null;
}

function criarAquisicoesAdicionarGarrafas(){
 const quantidade = parseInt(document.getElementById("addGarrafaQuantidade")?.value || "1", 10) || 1;
 const qtdFinal = Math.max(1, quantidade);
 const base = {
   data: document.getElementById("addGarrafaDataCompra")?.value || "",
   loja: document.getElementById("addGarrafaLoja")?.value || "-",
   quantidade: 1,
   valorUnitario: Number(document.getElementById("addGarrafaValorPago")?.value || 0),
   compradoPor: document.getElementById("addGarrafaCompradoPor")?.value || "",
   presenteadoPor: document.getElementById("addGarrafaPresenteadoPor")?.value.trim() || "",
   localizacao: document.getElementById("addGarrafaLocalizacao")?.value.trim() || "",
   consumida: false,
   dataConsumo: "",
   eventoConsumo: "",
   observacaoConsumo: "",
   ocasiao: document.getElementById("addGarrafaOcasiao")?.value.trim() || ""
 };
 return Array.from({length:qtdFinal}, (_,idx)=>({...base, identificador:`Nova garrafa ${idx+1}`}));
}

async function confirmarAdicionarGarrafas(){
 if(!adicionarGarrafasVinhoId){
   mostrarMensagem("Não foi possível identificar o vinho para adicionar garrafas.", {tipo:"erro", titulo:"Erro ao adicionar", icone:"❌"});
   return;
 }
 const quantidade = parseInt(document.getElementById("addGarrafaQuantidade")?.value || "1", 10) || 1;
 if(quantidade < 1){
   mostrarMensagem("Informe uma quantidade válida de garrafas.", {tipo:"aviso", titulo:"Quantidade inválida", icone:"⚠️"});
   return;
 }
 const aquisicoes = criarAquisicoesAdicionarGarrafas();
 const vinhoId = adicionarGarrafasVinhoId;
 try{
   await inserirGarrafas(vinhoId, aquisicoes);
   fecharModalAdicionarGarrafas();
   await carregarDoSupabase(true);
   const novoIndex = vinhos.findIndex(v=>v.id === vinhoId);
   if(novoIndex >= 0) abrirDetalhes(novoIndex);
   renderizar();
   mostrarMensagem(`${aquisicoes.length} garrafa${aquisicoes.length === 1 ? "" : "s"} adicionada${aquisicoes.length === 1 ? "" : "s"} à adega.`, {tipo:"sucesso", titulo:"Garrafas adicionadas", icone:"🍷", botao:"Perfeito"});
 }catch(e){
   console.error(e);
   mostrarMensagem("Não foi possível adicionar as garrafas no Supabase.", {tipo:"erro", titulo:"Erro ao adicionar", icone:"❌"});
 }
}

function selecionarNotaExperiencia(nota){
 const valor = Number(nota || 0);
 const input = document.getElementById("consumoNotaExperiencia");
 if(input) input.value = valor ? String(valor) : "";
 document.querySelectorAll("#consumoNotaExperienciaStars button").forEach((btn,idx)=>{
   btn.classList.toggle("active", idx < valor);
 });
}

function previewFotoMomentoConsumo(event){
 const file = event?.target?.files?.[0];
 const preview = document.getElementById("consumoFotoMomentoPreview");
 if(!file || !preview) return;
 const reader = new FileReader();
 reader.onload = e=>{
   preview.src = e.target.result;
   preview.style.display = "block";
   preview.dataset.fotoMomento = e.target.result;
 };
 reader.readAsDataURL(file);
}

function limparFotoMomentoConsumo(){
 const input = document.getElementById("consumoFotoMomento");
 const preview = document.getElementById("consumoFotoMomentoPreview");
 if(input) input.value = "";
 if(preview){
   preview.removeAttribute("src");
   preview.dataset.fotoMomento = "";
   preview.style.display = "none";
 }
}

function abrirModalConsumirGarrafa(vinhoIndex, aquisicaoIndex){
 const v = garantirEstrutura(vinhos[vinhoIndex]);
 if(!v || !v.aquisicoes || !v.aquisicoes[aquisicaoIndex]) return;
 const a = v.aquisicoes[aquisicaoIndex];
 if(a.consumida){
   mostrarMensagem("Esta garrafa já foi marcada como consumida.", {tipo:"aviso", titulo:"Garrafa já consumida", icone:"🍷"});
   return;
 }
 consumoGarrafaPendente = {vinhoIndex, aquisicaoIndex};
 const hoje = new Date().toISOString().slice(0,10);
 document.getElementById("consumoData").value = hoje;
 document.getElementById("consumoEvento").value = "";
 document.getElementById("consumoComQuem").value = "";
 document.getElementById("consumoHarmonizacao").value = "";
 document.getElementById("consumoTags").value = "";
 document.getElementById("consumoObservacao").value = "";
 document.getElementById("consumoMomentoEspecial").checked = false;
 document.getElementById("consumoFavoritoVida").checked = false;
 selecionarNotaExperiencia(0);
 limparFotoMomentoConsumo();
 const resumo = document.getElementById("consumoGarrafaResumo");
 if(resumo) resumo.innerText = `${v.nome} • Safra ${v.safra || "-"} • ${a.loja || "-"}`;
 document.getElementById("modalConsumirGarrafa").style.display = "flex";
}

function fecharModalConsumirGarrafa(){
 document.getElementById("modalConsumirGarrafa").style.display = "none";
 consumoGarrafaPendente = null;
}

function fecharAnimacaoMomento(){
 const bg = document.getElementById("momentoAnimationBg");
 if(bg) bg.classList.remove("show");
}

function mostrarAnimacaoMomento(nomeVinho){
 const bg = document.getElementById("momentoAnimationBg");
 const texto = document.getElementById("momentoAnimationTexto");
 if(texto) texto.innerText = `${nomeVinho || "Essa garrafa"} agora faz parte da história da Adega Juliana.`;
 if(bg){
   bg.classList.add("show");
   setTimeout(()=>bg.classList.remove("show"), 2200);
 }
}

async function confirmarConsumoGarrafa(){
 if(!consumoGarrafaPendente) return;
 const {vinhoIndex, aquisicaoIndex} = consumoGarrafaPendente;
 const v = garantirEstrutura(vinhos[vinhoIndex]);
 const data = document.getElementById("consumoData").value || new Date().toISOString().slice(0,10);
 const evento = document.getElementById("consumoEvento").value.trim();
 const comQuem = document.getElementById("consumoComQuem").value.trim();
 const harmonizacao = document.getElementById("consumoHarmonizacao").value.trim();
 const tags = document.getElementById("consumoTags").value.trim();
 const obs = document.getElementById("consumoObservacao").value.trim();
 const notaExperiencia = Number(document.getElementById("consumoNotaExperiencia").value || 0);
 const fotoMomentoUrl = document.getElementById("consumoFotoMomentoPreview")?.dataset?.fotoMomento || "";
 const momentoEspecial = !!document.getElementById("consumoMomentoEspecial").checked;
 const favoritoVida = !!document.getElementById("consumoFavoritoVida").checked;

 await atualizarConsumo(vinhoIndex, aquisicaoIndex, true, {
   dataConsumo:data,
   eventoConsumo:evento,
   observacaoConsumo:obs,
   comQuem,
   harmonizacao,
   tags,
   notaExperiencia,
   fotoMomentoUrl,
   momentoEspecial,
   favoritoVida
 });
 fecharModalConsumirGarrafa();
 mostrarAnimacaoMomento(v?.nome || "Essa garrafa");
}

async function atualizarConsumo(vinhoIndex, aquisicaoIndex, consumida, dadosConsumo={}){
 const v = garantirEstrutura(vinhos[vinhoIndex]);
 if(!v.aquisicoes || !v.aquisicoes[aquisicaoIndex]) return;

 const a = v.aquisicoes[aquisicaoIndex];
 a.consumida = consumida;
 if(consumida){
   a.dataConsumo = dadosConsumo.dataConsumo || a.dataConsumo || new Date().toISOString().slice(0,10);
   a.eventoConsumo = dadosConsumo.eventoConsumo ?? a.eventoConsumo ?? "";
   a.observacaoConsumo = dadosConsumo.observacaoConsumo ?? a.observacaoConsumo ?? "";
   a.comQuem = dadosConsumo.comQuem ?? a.comQuem ?? "";
   a.notaExperiencia = Number(dadosConsumo.notaExperiencia || a.notaExperiencia || 0);
   a.fotoMomentoUrl = dadosConsumo.fotoMomentoUrl ?? a.fotoMomentoUrl ?? "";
   a.harmonizacao = dadosConsumo.harmonizacao ?? a.harmonizacao ?? "";
   a.humor = dadosConsumo.humor ?? a.humor ?? "";
   a.tags = dadosConsumo.tags ?? a.tags ?? "";
   a.momentoEspecial = !!(dadosConsumo.momentoEspecial ?? a.momentoEspecial);
   a.favoritoVida = !!(dadosConsumo.favoritoVida ?? a.favoritoVida);
 }
 if(!consumida){
   a.dataConsumo = ""; a.eventoConsumo = ""; a.observacaoConsumo = ""; a.comQuem = "";
   a.notaExperiencia = 0; a.fotoMomentoUrl = ""; a.harmonizacao = ""; a.humor = ""; a.tags = "";
   a.momentoEspecial = false; a.favoritoVida = false;
 }

 if(modoTesteAtivo()){
   await carregarDoSupabase(true);
   abrirDetalhes(vinhoIndex);
   await simularModoTeste(consumida ? "Consumo e experiência simulados. A garrafa não foi marcada como consumida e nada entrou no histórico real." : "Alteração de consumo simulada. Nenhum dado foi gravado.", {titulo:"Consumo simulado"});
   return;
 }

 try{
   if(a.id){
     const updateCompleto = {
       consumida: !!a.consumida,
       data_consumo: a.dataConsumo || null,
       evento_consumo: a.eventoConsumo || null,
       observacao_consumo: a.observacaoConsumo || null,
       com_quem: a.comQuem || null,
       nota_experiencia: a.notaExperiencia || null,
       foto_momento_url: a.fotoMomentoUrl || null,
       harmonizacao: a.harmonizacao || null,
       humor: a.humor || null,
       tags: a.tags || null,
       momento_especial: !!a.momentoEspecial,
       favorito_da_vida: !!a.favoritoVida
     };
     let {error} = await supabaseClient.from("garrafas").update(updateCompleto).eq("id", a.id);

     // Compatibilidade: se o Supabase ainda não tiver as novas colunas,
     // salva o consumo básico para não bloquear a operação.
     if(error){
       console.warn("Atualização completa do histórico falhou. Tentando compatibilidade básica.", error);
       const updateBasico = {
         consumida: !!a.consumida,
         data_consumo: a.dataConsumo || null,
         evento_consumo: a.eventoConsumo || null,
         observacao_consumo: [
           a.comQuem ? `Com quem: ${a.comQuem}` : "",
           a.harmonizacao ? `Harmonização: ${a.harmonizacao}` : "",
           a.notaExperiencia ? `Nota da experiência: ${a.notaExperiencia}/5` : "",
           a.tags ? `Tags: ${a.tags}` : "",
           a.momentoEspecial ? "Momento especial" : "",
           a.favoritoVida ? "Favorito da vida" : "",
           a.observacaoConsumo || ""
         ].filter(Boolean).join("\n") || null
       };
       const fallback = await supabaseClient.from("garrafas").update(updateBasico).eq("id", a.id);
       if(fallback.error) throw fallback.error;
     }
   }
   await carregarDoSupabase(true);
   abrirDetalhes(vinhoIndex);
 }catch(e){
   console.error(e);
   alert("Não foi possível atualizar o consumo.");
 }
}

async function atualizarDadosConsumo(vinhoIndex, aquisicaoIndex, campo, valor){
 const v = garantirEstrutura(vinhos[vinhoIndex]);
 if(!v.aquisicoes || !v.aquisicoes[aquisicaoIndex]) return;

 const a = v.aquisicoes[aquisicaoIndex];
 a[campo] = valor;
 if(modoTesteAtivo()){
   await simularModoTeste("Alteração dos dados de consumo simulada. Nenhum dado foi gravado.", {titulo:"Consumo simulado"});
   await carregarDoSupabase(true);
   abrirDetalhes(vinhoIndex);
   return;
 }
 const mapa = {
   dataConsumo:"data_consumo",
   eventoConsumo:"evento_consumo",
   observacaoConsumo:"observacao_consumo",
   comQuem:"com_quem",
   notaExperiencia:"nota_experiencia",
   fotoMomentoUrl:"foto_momento_url",
   harmonizacao:"harmonizacao",
   humor:"humor",
   tags:"tags",
   momentoEspecial:"momento_especial",
   favoritoVida:"favorito_da_vida"
 };

 try{
   if(a.id && mapa[campo]){
     const {error} = await supabaseClient.from("garrafas").update({[mapa[campo]]: valor || null}).eq("id", a.id);
     if(error) throw error;
   }
 }catch(e){
   console.error(e);
   alert("Não foi possível salvar os dados do consumo.");
 }
}


async function excluirGarrafa(vinhoIndex, aquisicaoIndex){
 const v = garantirEstrutura(vinhos[vinhoIndex]);
 if(!v || !v.aquisicoes || !v.aquisicoes[aquisicaoIndex]) return;

 const a = v.aquisicoes[aquisicaoIndex];
 const descricao = [
   a.data ? `Compra em ${a.data}` : "Data não informada",
   a.loja || "",
   a.localizacao ? `Localização: ${a.localizacao}` : ""
 ].filter(Boolean).join(" • ");

 const confirma = await confirmarAdega(`Deseja excluir apenas esta garrafa?

${v.nome}${v.safra ? " • Safra " + v.safra : ""}
${descricao}

O vinho continuará cadastrado na Adega Juliana.`, {
   titulo:"Excluir garrafa?",
   icone:"🗑️",
   confirmar:"Excluir garrafa",
   cancelar:"Cancelar",
   perigo:true
 });
 if(!confirma) return;

 if(modoTesteAtivo()){
   await simularModoTeste("Exclusão de garrafa simulada. Nenhuma garrafa foi removida da sua adega.", {titulo:"Exclusão simulada"});
   return;
 }

 try{
   if(a.id){
     const {error} = await supabaseClient.from("garrafas").delete().eq("id", a.id);
     if(error) throw error;
   }else{
     v.aquisicoes.splice(aquisicaoIndex, 1);
   }

   await carregarDoSupabase(true);
   const novoIndex = v.id ? vinhos.findIndex(item=>item.id === v.id) : vinhoIndex;

   if(novoIndex >= 0){
     abrirDetalhes(novoIndex);
   }else{
     fecharDetalhes();
   }

   renderizar();
   renderizarAdega3D();
   mostrarMensagem("A garrafa foi excluída. O vinho continua cadastrado na adega.", {tipo:"sucesso", titulo:"Garrafa excluída", icone:"🗑️", botao:"Perfeito"});
 }catch(e){
   console.error(e);
   mostrarMensagem("Não foi possível excluir esta garrafa no Supabase.", {tipo:"erro", titulo:"Erro ao excluir garrafa", icone:"❌"});
 }
}


async function excluirVinho(){
 if(vinhoSelecionado === null) return;
 const v = vinhos[vinhoSelecionado];
 if(!v) return;

 const confirma = await confirmarAdega(`Tem certeza que deseja excluir o vinho "${v.nome}"?

Essa ação remove o vinho e todas as aquisições/consumos associados a ele.`, {
   titulo:"Excluir vinho?",
   icone:"🗑️",
   confirmar:"Excluir",
   cancelar:"Cancelar",
   perigo:true
 });
 if(!confirma) return;

 if(modoTesteAtivo()){
   await simularModoTeste("Exclusão de vinho simulada. Nenhum vinho foi removido da sua adega.", {titulo:"Exclusão simulada"});
   return;
 }

 try{
   if(v.id){
     const {error} = await supabaseClient.from("vinhos").delete().eq("id", v.id);
     if(error) throw error;
   }
   vinhoSelecionado = null;
   fecharDetalhes();
   await carregarDoSupabase(true);
   alert("Vinho excluído do Supabase.");
 }catch(e){
   console.error(e);
   alert("Não foi possível excluir o vinho no Supabase.");
 }
}

function fecharDetalhes(){
  aplicarModoEdicaoDetalhe(false);
  document.getElementById("modalDetalhes").style.display = "none";
  vinhoSelecionado = null;
}


async function salvarDetalhes(){
 if(vinhoSelecionado === null) return;

 if(!detalheEmEdicao){
  habilitarEdicaoDetalhes();
  return;
}

 const v = garantirEstrutura(vinhos[vinhoSelecionado]);
 const valorCampoDetalhe = (id)=> (document.getElementById(id)?.value || "").trim();
 v.detalhes.produtor = valorCampoDetalhe("modalEditProdutor") || "-";
 v.detalhes.uva = valorCampoDetalhe("modalEditUva") || "-";
 v.detalhes.pais = valorCampoDetalhe("modalEditPais") || "-";
 v.detalhes.regiao = valorCampoDetalhe("modalEditRegiao") || "-";
 v.tipo = valorCampoDetalhe("modalEditTipo") || v.tipo || "Tinto";
 v.detalhes.guarda = valorCampoDetalhe("modalEditPotencialGuarda");
 v.detalhes.notas = document.getElementById("modalNotas").value.trim();

 if(modoTesteAtivo()){
   fecharDetalhes();
   await carregarDoSupabase(true);
   await simularModoTeste("Alteração dos detalhes simulada. Nenhuma informação do vinho foi gravada.", {titulo:"Detalhes simulados"});
   return;
 }

 try{
   if(v.id){
     await atualizarVinhoSupabase(v);
     await salvarPosicoesGarrafasDetalhe(v);
   }
   fecharDetalhes();
   await carregarDoSupabase(true);
 }catch(e){
   console.error(e);
   alert("Não foi possível salvar os detalhes no Supabase.");
 }
}

function exportarBackup(){
 const backup = {
   versao:"1.0",
   dataBackup:new Date().toISOString(),
   vinhos:vinhos,
   consumosExternos:consumosExternos,
   vinhosDesejados:vinhosDesejadosTabela,
   adegas:adegas
 };
 const blob = new Blob([JSON.stringify(backup,null,2)], {type:"application/json"});
 const url = URL.createObjectURL(blob);
 const a = document.createElement("a");
 a.href = url;
 a.download = "backup-adega-juliana.json";
 a.click();
 URL.revokeObjectURL(url);
}

function importarBackup(event){
 const arquivo = event.target.files[0];
 if(!arquivo) return;
 const reader = new FileReader();
 reader.onload = function(e){
   try{
     const dados = JSON.parse(e.target.result);

     if(Array.isArray(dados)){
       vinhos = dados;
       consumosExternos = [];
     }else{
       vinhos = dados.vinhos || [];
       consumosExternos = dados.consumosExternos || [];
     }

     enriquecerDetalhes();
     salvar();
     salvarConsumosExternos();
     renderizar();
     alert("Backup importado com sucesso!");
   }catch{
     alert("Arquivo inválido.");
   }
 };
 reader.readAsText(arquivo);
}



function numeroMesLabel(chave){
 const partes = String(chave || "").split("-");
 if(partes.length !== 2) return "Sem data";
 const nomes = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
 const mes = Number(partes[1]) - 1;
 return (nomes[mes] || partes[1]) + "/" + partes[0].slice(2);
}

function chaveMes(data){
 if(!data || !/^\d{4}-\d{2}/.test(String(data))) return "";
 return String(data).slice(0,7);
}

function ultimosMeses(qtd=12){
 const meses = [];
 const hoje = new Date();
 const base = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
 for(let i=qtd-1;i>=0;i--){
   const d = new Date(base.getFullYear(), base.getMonth()-i, 1);
   meses.push(d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,"0"));
 }
 return meses;
}

function incrementarMapa(mapa, chave, valor){
 if(!chave) return;
 mapa[chave] = Number(mapa[chave] || 0) + Number(valor || 0);
}

function coletarMetricas(){
 const comprasMes = {};
 const consumosMes = {};
 const valorComprasMes = {};
 const consumoPais = {};
 const estoqueTipo = {};
 const guardaStatus = {};
 const topConsumidos = {};
 let valorInvestido = 0;
 let valorConsumido = 0;
 let garrafasCompradas = 0;
 let garrafasConsumidas = 0;

 vinhos.forEach(v=>{
   garantirEstrutura(v);
   const qtdEstoque = Number(v.quantidade || 0);
   incrementarMapa(estoqueTipo, v.tipo || "Não informado", qtdEstoque);

   if(qtdEstoque > 0){
     const infoGuarda = calcularInfoGuarda(v);
     incrementarMapa(guardaStatus, `${infoGuarda.icone} ${infoGuarda.status}`, qtdEstoque);
   }

   (v.aquisicoes || []).forEach(a=>{
     const qtd = Number(a.quantidade || 0);
     const valorUnitario = Number(a.valorUnitario || 0);
     const valorTotal = qtd * valorUnitario;
     const mesCompra = chaveMes(a.data);
     garrafasCompradas += qtd;
     valorInvestido += valorTotal;
     incrementarMapa(comprasMes, mesCompra, qtd);
     incrementarMapa(valorComprasMes, mesCompra, valorTotal);

     if(a.consumida){
       const mesConsumo = chaveMes(a.dataConsumo);
       garrafasConsumidas += qtd;
       valorConsumido += valorTotal;
       incrementarMapa(consumosMes, mesConsumo, qtd);
       incrementarMapa(consumoPais, v.detalhes?.pais || "Não informado", qtd);
       incrementarMapa(topConsumidos, `${v.nome} ${v.safra || ""}`.trim(), qtd);
     }
   });
 });

 consumosExternos.forEach(c=>{
   const qtd = Number(c.quantidade || 1);
   const valorTotal = qtd * Number(c.valorPago || 0);
   garrafasConsumidas += qtd;
   valorConsumido += valorTotal;
   incrementarMapa(consumosMes, chaveMes(c.dataConsumo), qtd);
   incrementarMapa(consumoPais, c.pais || "Não informado", qtd);
   incrementarMapa(topConsumidos, `${c.nome || "Vinho externo"} ${c.safra || ""}`.trim(), qtd);
 });

 return {
   comprasMes, consumosMes, valorComprasMes, consumoPais, estoqueTipo, guardaStatus, topConsumidos,
   valorInvestido, valorConsumido,
   valorEstoque: Math.max(valorInvestido - valorConsumido, 0),
   garrafasCompradas, garrafasConsumidas
 };
}

function renderBarChart(id, dados, opcoes={}){
 const el = document.getElementById(id);
 if(!el) return;
 const entradas = Object.entries(dados).filter(([_,v])=>Number(v)>0);
 if(!entradas.length){
   el.innerHTML = `<div class="stats-empty">Ainda não há dados suficientes para este gráfico.</div>`;
   return;
 }
 const ordenadas = opcoes.manterOrdem ? entradas : entradas.sort((a,b)=>Number(b[1])-Number(a[1])).slice(0, opcoes.limite || 8);
 const max = Math.max(...ordenadas.map(([_,v])=>Number(v)),1);

 if(id === "graficoValorCompras"){
   const mesesComValor = ordenadas.filter(([_,valor])=>Number(valor)>0).slice(-6);
   const totalPeriodo = mesesComValor.reduce((s,[_,valor])=>s+Number(valor||0),0);
   el.innerHTML = `
     <div class="month-spend-list">
       ${mesesComValor.map(([label,valor])=>{
         const largura = Math.max((Number(valor)/max)*100, 5);
         return `
           <div class="month-spend-row">
             <div class="month-spend-top">
               <span>${numeroMesLabel(label)}</span>
               <strong>${valorFinanceiro(valor)}</strong>
             </div>
             <div class="month-spend-track"><span class="month-spend-fill" style="width:${largura}%"></span></div>
           </div>`;
       }).join("")}
       <div class="month-spend-total"><span>Total no período exibido</span><strong>${valorFinanceiro(totalPeriodo)}</strong></div>
     </div>`;
   return;
 }

 el.innerHTML = ordenadas.map(([label,valor],idx)=>{
   const largura = Math.max((Number(valor)/max)*100, 4);
   const classe = idx % 3 === 1 ? "secondary" : idx % 3 === 2 ? "rosefill" : "";
   const valorLabel = opcoes.moeda ? valorFinanceiro(valor) : Number(valor).toLocaleString("pt-BR");
   const labelFinal = opcoes.mes ? numeroMesLabel(label) : label;
   return `
     <div class="chart-row">
       <span>${labelFinal}</span>
       <div class="chart-track"><div class="chart-fill ${classe}" style="width:${largura}%"></div></div>
       <strong>${valorLabel}</strong>
     </div>`;
 }).join("");
}

function renderDualChart(id, compras, consumos){
 const el = document.getElementById(id);
 if(!el) return;
 const meses = ultimosMeses(12);
 const movimentos = meses
   .map(m=>({mes:m, compras:Number(compras[m] || 0), consumos:Number(consumos[m] || 0)}))
   .filter(x=>x.compras > 0 || x.consumos > 0);

 if(!movimentos.length){
   el.innerHTML = `<div class="stats-empty">Nenhuma compra ou consumo registrado nos últimos 12 meses.</div>`;
   return;
 }

 const max = Math.max(...movimentos.flatMap(x=>[x.compras, x.consumos]),1);
 const totalCompras = movimentos.reduce((s,x)=>s+x.compras,0);
 const totalConsumos = movimentos.reduce((s,x)=>s+x.consumos,0);
 const ultimos = movimentos.slice(-6);

 el.innerHTML = `
   <div class="month-movement-list">
     ${ultimos.map(x=>{
       const larguraCompra = Math.max((x.compras/max)*100, x.compras ? 5 : 0);
       const larguraConsumo = Math.max((x.consumos/max)*100, x.consumos ? 5 : 0);
       const texto = x.consumos
         ? `${x.compras} compra${x.compras === 1 ? "" : "s"} • ${x.consumos} consumo${x.consumos === 1 ? "" : "s"}`
         : `${x.compras} compra${x.compras === 1 ? "" : "s"} • nenhum consumo`;
       return `
         <div class="month-movement-row">
           <div class="month-movement-top">
             <div class="month-movement-month">
               <strong>${numeroMesLabel(x.mes)}</strong>
               <span>${texto}</span>
             </div>
             <div class="month-movement-kpis">
               <span class="month-chip buy">● ${x.compras}</span>
               <span class="month-chip consume">● ${x.consumos}</span>
             </div>
           </div>
           <div class="month-movement-bars">
             <div class="month-movement-bar"><span style="width:${larguraCompra}%"></span></div>
             ${x.consumos ? `<div class="month-movement-bar consumo"><span style="width:${larguraConsumo}%"></span></div>` : ""}
           </div>
         </div>`;
     }).join("")}
     <div class="month-movement-summary">
       <div><small>Compras no período</small><strong>${totalCompras}</strong></div>
       <div><small>Consumos no período</small><strong>${totalConsumos}</strong></div>
     </div>
   </div>`;
}
function renderTopConsumidos(id, dados){
  const el = document.getElementById(id);

  if(!el) return;

  const ranking = Object.entries(dados)
    .sort((a, b) => Number(b[1]) - Number(a[1]));

  if(!ranking.length){
    el.innerHTML = `
      <div class="stats-empty">
        Nenhum consumo registrado ainda.
      </div>
    `;
    return;
  }

  el.innerHTML = `
    <div
      class="stats-table-scroll"
      role="region"
      aria-label="Ranking completo de vinhos consumidos"
      tabindex="0"
    >
      <table class="stats-table">
        <thead>
          <tr>
            <th>Vinho</th>
            <th>Garrafas</th>
          </tr>
        </thead>

        <tbody>
          ${ranking.map(([nome, qtd]) => `
            <tr>
              <td>${nome}</td>
              <td>${qtd}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function classeInsightTipo(label){
 const l = String(label || "").toLowerCase();
 if(l.includes("branco")) return "gold";
 if(l.includes("ros")) return "rose";
 if(l.includes("espum")) return "gold";
 return "";
}

function classeInsightJanela(label){
 const l = String(label || "").toLowerCase();
 if(l.includes("passou") || l.includes("limite")) return "red";
 if(l.includes("pronto")) return "gold";
 if(l.includes("jovem")) return "green";
 return "";
}

function renderInsightList(id, dados, classeFn){
 const el = document.getElementById(id);
 if(!el) return;
 const entradas = Object.entries(dados || {}).filter(([_,v])=>Number(v)>0).sort((a,b)=>Number(b[1])-Number(a[1]));
 if(!entradas.length){
   el.innerHTML = `<div class="stats-empty" style="padding:12px;font-size:12px">Sem dados suficientes.</div>`;
   return;
 }
 const total = entradas.reduce((s,[_,v])=>s+Number(v||0),0) || 1;
 const max = Math.max(...entradas.map(([_,v])=>Number(v)),1);
 el.innerHTML = entradas.slice(0,5).map(([label,valor])=>{
   const largura = Math.max((Number(valor)/max)*100, 5);
   const pct = Math.round((Number(valor)/total)*100);
   const cls = classeFn ? classeFn(label) : "";
   return `
     <div class="insight-row">
       <label>${label}</label>
       <strong>${valor} • ${pct}%</strong>
       <div class="insight-track"><span class="insight-fill ${cls}" style="width:${largura}%"></span></div>
     </div>`;
 }).join("");
}



/* ===============================
   MAPA-MÚNDI DETERMINÍSTICO
   =============================== */
const mapaMundiPaisesCoords = {"chile":{"nome":"Chile","flag":"🇨🇱","x":309.3,"y":356.7},"argentina":{"nome":"Argentina","flag":"🇦🇷","x":334.6,"y":382.5},"portugal":{"nome":"Portugal","flag":"🇵🇹","x":479.0,"y":132.7},"espanha":{"nome":"Espanha","flag":"🇪🇸","x":490.5,"y":130.5},"franca":{"nome":"França","flag":"🇫🇷","x":505.4,"y":111.4},"italia":{"nome":"Itália","flag":"🇮🇹","x":531.6,"y":123.1},"brasil":{"nome":"Brasil","flag":"🇧🇷","x":356.2,"y":292.2},"uruguai":{"nome":"Uruguai","flag":"🇺🇾","x":352.2,"y":366.4},"alemanha":{"nome":"Alemanha","flag":"🇩🇪","x":524.9,"y":95.7},"estados unidos":{"nome":"Estados Unidos","flag":"🇺🇸","x":247.9,"y":134.3},"usa":{"nome":"Estados Unidos","flag":"🇺🇸","x":247.9,"y":134.3},"eua":{"nome":"Estados Unidos","flag":"🇺🇸","x":247.9,"y":134.3},"australia":{"nome":"Austrália","flag":"🇦🇺","x":862.2,"y":340.6},"nova zelandia":{"nome":"Nova Zelândia","flag":"🇳🇿","x":938.0,"y":392.1},"africa do sul":{"nome":"África do Sul","flag":"🇿🇦","x":564.2,"y":353.5},"grecia":{"nome":"Grécia","flag":"🇬🇷","x":556.6,"y":134.3},"canada":{"nome":"Canadá","flag":"🇨🇦","x":258.3,"y":77.9},"mexico":{"nome":"México","flag":"🇲🇽","x":223.2,"y":185.8},"peru":{"nome":"Peru","flag":"🇵🇪","x":292.5,"y":289.0},"bolivia":{"nome":"Bolívia","flag":"🇧🇴","x":324.5,"y":314.8},"hungria":{"nome":"Hungria","flag":"🇭🇺","x":546.7,"y":108.8},"austria":{"nome":"Áustria","flag":"🇦🇹","x":534.3,"y":107.3},"suica":{"nome":"Suíça","flag":"🇨🇭","x":519.7,"y":108.8},"suíça":{"nome":"Suíça","flag":"🇨🇭","x":519.7,"y":108.8}};

function normalizarPaisMapa(valor){
  const key = String(valor || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
  const alias = {
    "france":"franca",
    "franca":"franca",
    "italia":"italia",
    "italy":"italia",
    "spain":"espanha",
    "espanha":"espanha",
    "chile":"chile",
    "argentina":"argentina",
    "portugal":"portugal",
    "brasil":"brasil",
    "brazil":"brasil",
    "uruguai":"uruguai",
    "uruguay":"uruguai",
    "alemanha":"alemanha",
    "germany":"alemanha",
    "estados unidos":"estados unidos",
    "eua":"estados unidos",
    "usa":"estados unidos",
    "united states":"estados unidos",
    "australia":"australia",
    "nova zelandia":"nova zelandia",
    "new zealand":"nova zelandia",
    "africa do sul":"africa do sul",
    "south africa":"africa do sul",
    "grecia":"grecia",
    "greece":"grecia",
    "canada":"canada",
    "mexico":"mexico",
    "peru":"peru",
    "bolivia":"bolivia",
    "hungria":"hungria",
    "hungary":"hungria",
    "austria":"austria",
    "suica":"suica",
    "switzerland":"suica"
  };
  return alias[key] || key;
}

function coletarPaisesMapaVinhos(consumoPais){
  const mapa = new Map();
  Object.entries(consumoPais || {}).forEach(([pais, qtd])=>{
    const key = normalizarPaisMapa(pais);
    if(!key || key === "nao informado" || key === "-") return;
    const ref = mapaMundiPaisesCoords[key];
    if(!ref) return;
    mapa.set(key, {...ref, quantidade:(mapa.get(key)?.quantidade || 0) + Number(qtd || 0)});
  });
  return [...mapa.values()]
    .filter(p=>p.quantidade > 0)
    .sort((a,b)=>b.quantidade - a.quantidade || a.nome.localeCompare(b.nome));
}

function renderizarMapaMundiVinhos(consumoPais){
  const svg = document.getElementById("mapaMundiSvg");
  const markers = document.getElementById("mapaMundiMarkers");
  const ranking = document.getElementById("mapaMundiRanking");
  const totalPaisesEl = document.getElementById("mapaMundiTotalPaises");
  const totalGarrafasEl = document.getElementById("mapaMundiTotalGarrafas");
  if(!svg || !ranking) return;

  const paises = coletarPaisesMapaVinhos(consumoPais);
  const totalGarrafas = paises.reduce((s,p)=>s + Number(p.quantidade || 0),0);

  if(totalPaisesEl) totalPaisesEl.innerText = paises.length;
  if(totalGarrafasEl) totalGarrafasEl.innerText = totalGarrafas;
  if(markers) markers.innerHTML = "";

  svg.querySelectorAll(".wm-country.consumido").forEach(el=>{
    el.classList.remove("consumido");
    el.removeAttribute("aria-label");
    el.removeAttribute("data-qtd");
  });

  if(!paises.length){
    ranking.innerHTML = `<div class="worldmap-empty">Ainda não há países degustados para exibir no mapa.</div>`;
    return;
  }

  paises.forEach((p)=>{
    const key = normalizarPaisMapa(p.nome);
    const el = svg.querySelector(`.wm-country[data-key="${CSS.escape(key)}"]`);
    if(!el) return;
    const texto = `${p.nome} — ${p.quantidade} garrafa${p.quantidade === 1 ? "" : "s"}`;
    el.classList.add("consumido");
    el.setAttribute("data-qtd", String(p.quantidade));
    el.setAttribute("aria-label", texto);
    let title = el.querySelector("title");
    if(!title){
      title = document.createElementNS("http://www.w3.org/2000/svg", "title");
      el.prepend(title);
    }
    title.textContent = texto;
  });

  ranking.innerHTML = paises.map(p=>`
    <div class="worldmap-country-row">
      <span>${p.flag}</span>
      <span>${p.nome}</span>
      <b>${p.quantidade} garrafa${p.quantidade === 1 ? "" : "s"}</b>
    </div>`).join("");
}

function renderizarEstatisticas(){
 atualizarBotaoPrivacidadeValores();
 const m = coletarMetricas();
 const setTxt = (id, valor) => { const el = document.getElementById(id); if(el) el.innerText = valor; };
 const ticketMedio = m.garrafasCompradas ? m.valorInvestido / m.garrafasCompradas : 0;
 const totalEstoque = soma("");
 const urgentes = vinhosEmEstoqueOrdenadosPorConsumo().filter(v=>["guarda-passou","guarda-limite"].includes(v.infoGuarda.classe)).length;
 const prontos = vinhosEmEstoqueOrdenadosPorConsumo().filter(v=>v.infoGuarda.classe === "guarda-pronto").length;

 setTxt("kpiValorInvestido", valorFinanceiro(m.valorInvestido));
 setTxt("kpiValorEstoque", valorFinanceiro(m.valorEstoque));
 setTxt("kpiGarrafasCompradas", m.garrafasCompradas);
 setTxt("kpiGarrafasConsumidas", m.garrafasConsumidas);
 setTxt("kpiTicketMedio", valorFinanceiro(ticketMedio));
 setTxt("statsHeroResumo", `${totalEstoque} garrafa${totalEstoque === 1 ? "" : "s"} em estoque • ${urgentes} urgente${urgentes === 1 ? "" : "s"} • ${prontos} pronta${prontos === 1 ? "" : "s"}`);
 setTxt("insightTotalEstoque", `${totalEstoque} garrafas`);
 setTxt("insightJanelaStatus", urgentes ? `${urgentes} urgentes` : "Em dia");

 renderInsightList("statsPerfilTipos", m.estoqueTipo, classeInsightTipo);
 renderInsightList("statsJanelaConsumo", m.guardaStatus, classeInsightJanela);

 renderDualChart("graficoComprasConsumos", m.comprasMes, m.consumosMes);
 const mesesValor = {};
 ultimosMeses(12).forEach(mes=>mesesValor[mes] = Number(m.valorComprasMes[mes] || 0));
 renderBarChart("graficoValorCompras", mesesValor, {moeda:true, mes:true, manterOrdem:true});
 renderBarChart("graficoConsumoPais", m.consumoPais, {limite:8});
 renderBarChart("graficoEstoqueTipo", m.estoqueTipo, {limite:8});
 renderBarChart("graficoPotencialGuarda", m.guardaStatus, {limite:8});
 renderTopConsumidos("tabelaTopConsumidos", m.topConsumidos);
 renderizarMapaMundiVinhos(m.consumoPais);
}



const pratosHarmonizacao = [
  {id:"cordeiro", nome:"Cordeiro", subtitulo:"Tintos estruturados", img:"url('https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=700&q=80')", uvas:["cabernet","syrah","malbec","blend bordal","merlot","tempranillo"], tipos:["Tinto"], motivo:"cordeiro combina melhor com tintos estruturados, taninos presentes e boa intensidade."},
  {id:"churrasco", nome:"Churrasco", subtitulo:"Malbec, Cabernet, Syrah", img:"url('https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=700&q=80')", uvas:["malbec","cabernet","syrah","tannat","pinotage"], tipos:["Tinto"], motivo:"carnes grelhadas pedem vinhos de corpo, fruta e taninos para acompanhar gordura e defumado."},
  {id:"massa-molho-vermelho", nome:"Massa ao molho vermelho", subtitulo:"Tintos com acidez", img:"url('https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=700&q=80')", uvas:["sangiovese","chianti","cabernet franc","merlot","pinot noir"], tipos:["Tinto"], motivo:"molho vermelho combina com tintos gastronômicos, boa acidez e taninos moderados."},
  {id:"risoto-cogumelos", nome:"Risoto de cogumelos", subtitulo:"Pinot Noir e brancos ricos", img:"url('https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=700&q=80')", uvas:["pinot noir","chardonnay","nebbiolo"], tipos:["Tinto","Branco"], motivo:"cogumelos pedem vinhos elegantes, terrosos ou brancos com textura."},
  {id:"peixe", nome:"Peixe grelhado", subtitulo:"Brancos frescos", img:"url('https://images.unsplash.com/photo-1485921325833-c519f76c4927?auto=format&fit=crop&w=700&q=80')", uvas:["sauvignon","riesling","chardonnay","pinot grigio"], tipos:["Branco","Espumante"], motivo:"peixes leves combinam com brancos frescos, minerais e de boa acidez."},
  {id:"salmao", nome:"Salmão", subtitulo:"Pinot Noir ou Chardonnay", img:"url('https://images.unsplash.com/photo-1485704686097-ed47f7263ca4?auto=format&fit=crop&w=700&q=80')", uvas:["pinot noir","chardonnay","riesling"], tipos:["Branco","Tinto","Rosé"], motivo:"salmão aceita brancos com corpo, rosés e tintos leves como Pinot Noir."},
  {id:"japonesa", nome:"Comida japonesa", subtitulo:"Riesling, Sauvignon, Espumante", img:"url('https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?auto=format&fit=crop&w=700&q=80')", uvas:["riesling","sauvignon","pinot grigio","chardonnay"], tipos:["Branco","Espumante"], motivo:"sushi e sashimi combinam com vinhos frescos, aromáticos e com boa acidez."},
  {id:"queijo-suave", nome:"Queijo suave e macio", subtitulo:"Brancos e espumantes", img:"url('https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=700&q=80')", uvas:["chardonnay","sauvignon","riesling","pinot grigio"], tipos:["Branco","Espumante","Rosé"], motivo:"queijos suaves pedem vinhos frescos, cremosos ou espumantes."},
  {id:"queijo-azul", nome:"Queijo azul", subtitulo:"Tintos intensos", img:"url('https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=700&q=80')", uvas:["syrah","cabernet","malbec","gewurztraminer"], tipos:["Tinto","Branco"], motivo:"queijo azul precisa de vinho intenso, aromático ou com boa estrutura."},
  {id:"comida-apimentada", nome:"Comida apimentada", subtitulo:"Aromáticos e frescos", img:"url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=700&q=80')", uvas:["riesling","gewurztraminer","pinot grigio","sauvignon"], tipos:["Branco","Rosé","Espumante"], motivo:"pratos apimentados ficam melhores com vinhos aromáticos, frescos e de menor tanino."},
  {id:"frango", nome:"Frango assado", subtitulo:"Brancos ou tintos leves", img:"url('https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=700&q=80')", uvas:["chardonnay","pinot noir","merlot","sauvignon"], tipos:["Branco","Tinto","Rosé"], motivo:"frango é versátil e combina com brancos de corpo médio ou tintos leves."},
  {id:"sobremesa", nome:"Sobremesa", subtitulo:"Aromáticos e espumantes", img:"url('https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=700&q=80')", uvas:["riesling","gewurztraminer"], tipos:["Branco","Espumante"], motivo:"sobremesas pedem vinhos aromáticos, delicados ou espumantes leves."}
];

function renderizarPratosHarmonizacao(){
 const lista = document.getElementById("listaPratosHarmonizacao");
 if(!lista) return;
 const termo = String(document.getElementById("buscaPrato")?.value || "").toLowerCase().trim();
 const pratos = pratosHarmonizacao.filter(p=>{
   const texto = `${p.nome} ${p.subtitulo} ${p.uvas.join(" ")} ${p.tipos.join(" ")}`.toLowerCase();
   return !termo || texto.includes(termo);
 });
 lista.innerHTML = pratos.length ? pratos.map(p=>`
   <button class="prato-card" style="--img:${p.img}" onclick="selecionarPratoHarmonizacao('${p.id}')">
     <span class="prato-info">
       <strong>${p.nome}</strong>
       <span>${p.subtitulo}</span>
     </span>
   </button>
 `).join("") : `<div class="harmonizacao-empty" style="grid-column:1/-1">Nenhum prato encontrado. Tente buscar por carne, peixe, queijo, massa ou sushi.</div>`;
}

function limparBuscaPrato(){
 const el = document.getElementById("buscaPrato");
 if(el) el.value = "";
 renderizarPratosHarmonizacao();
}

function textoNormalizado(valor){
 return String(valor || "")
   .normalize("NFD")
   .replace(/[\u0300-\u036f]/g,"")
   .toLowerCase();
}

function pontuarVinhoParaPrato(v, prato){
 garantirEstrutura(v);
 let pontos = 0;
 const uva = textoNormalizado(v.detalhes?.uva);
 const nome = textoNormalizado(v.nome);
 const tipo = v.tipo || "";
 const notas = textoNormalizado(v.detalhes?.notas);
 const produtor = textoNormalizado(v.detalhes?.produtor);
 const texto = `${uva} ${nome} ${notas} ${produtor}`;

 if(prato.tipos.includes(tipo)) pontos += 28;

 prato.uvas.forEach(u=>{
   if(texto.includes(textoNormalizado(u))) pontos += 24;
 });

 const nota = Number(v.detalhes?.notaVivino || 0);
 if(nota >= 4.4) pontos += 16;
 else if(nota >= 4.1) pontos += 11;
 else if(nota >= 3.8) pontos += 6;

 const info = calcularInfoGuarda(v);
 if(info.classe === "guarda-pronto") pontos += 12;
 if(info.classe === "guarda-limite") pontos += 10;
 if(info.classe === "guarda-passou") pontos += 4;
 if(info.classe === "guarda-jovem") pontos += 3;

 if(Number(v.quantidade || 0) <= 0) pontos -= 100;

 return pontos;
}

function motivoHarmonizacao(v, prato, pontos){
 garantirEstrutura(v);
 const uva = v.detalhes?.uva && v.detalhes.uva !== "-" ? v.detalhes.uva : v.tipo;
 const nota = Number(v.detalhes?.notaVivino || 0);
 const info = calcularInfoGuarda(v);
 const partes = [];
 partes.push(`${uva} combina com ${prato.nome.toLowerCase()}`);
 if(nota) partes.push(`nota Vivino ${nota.toFixed(1)}`);
 if(info.classe !== "guarda-indefinido") partes.push(info.status.toLowerCase());
 return partes.join(" • ") + ".";
}

function selecionarPratoHarmonizacao(id){
 const prato = pratosHarmonizacao.find(p=>p.id === id);
 const box = document.getElementById("resultadoHarmonizacao");
 if(!prato || !box) return;

 const candidatos = vinhos
   .map((v,index)=>({...v,index, pontos:pontuarVinhoParaPrato(v, prato)}))
   .filter(v=>v.pontos > 0 && Number(v.quantidade || 0) > 0)
   .sort((a,b)=>{
     if(b.pontos !== a.pontos) return b.pontos - a.pontos;
     return Number(b.detalhes?.notaVivino || 0) - Number(a.detalhes?.notaVivino || 0);
   })
   .slice(0,5);

 const subtitulo = candidatos.length
   ? `${candidatos.length} sugestão${candidatos.length === 1 ? "" : "ões"} encontrada${candidatos.length === 1 ? "" : "s"} na sua adega.`
   : "Não encontrei uma combinação forte na sua adega para este prato.";

 box.innerHTML = `
   <div class="harmonizacao-hero">
     <h3>${prato.nome}</h3>
     <p>${prato.motivo}<br>${subtitulo}</p>
   </div>
   <div class="harmonizacao-lista">
     ${candidatos.length ? candidatos.map((v,idx)=>{
       const score = Math.min(99, Math.round(v.pontos));
       const nota = Number(v.detalhes?.notaVivino || 0);
       const info = calcularInfoGuarda(v);
       const flag = bandeiraPais(v.detalhes?.pais || "");
       const rank = idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : "";
       const thumb = v.fotoUrl
         ? `<img class="harmonizacao-thumb" src="${v.fotoUrl}" alt="Foto de ${v.nome}" loading="lazy">`
         : `<div class="harmonizacao-thumb-placeholder">${iconeTipo(v.tipo)}</div>`;
       return `
       <div class="harmonizacao-item" onclick="abrirDetalhes(${v.index})">
         ${thumb}
         <div class="harmonizacao-main">
           <div class="harmonizacao-title">
             ${rank ? `<span class="harmonizacao-rank">${rank}</span>` : ""}
             <strong>${v.nome} ${v.safra ? "• " + v.safra : ""}</strong>
             ${flag ? `<span class="harmonizacao-flag" title="${v.detalhes?.pais || ""}">${flag}</span>` : ""}
             ${nota ? `<span class="harmonizacao-vivino">⭐ ${nota.toFixed(1)}</span>` : ""}
           </div>
           <span class="harmonizacao-motivo">${motivoHarmonizacao(v, prato, v.pontos)}</span>
           <div class="harmonizacao-tags">
             <span class="harmonizacao-tag">${v.tipo || "-"}</span>
             <span class="harmonizacao-tag">${v.detalhes?.uva || "Uva não informada"}</span>
             ${info.classe !== "guarda-indefinido" ? `<span class="harmonizacao-tag">${info.icone} ${info.status}</span>` : ""}
           </div>
         </div>
         <div class="harmonizacao-score-wrap">
           <span class="harmonizacao-score-label">${score}%</span>
           <div class="harmonizacao-score-bar"><span style="width:${score}%"></span></div>
         </div>
       </div>`;
     }).join("") : `<div class="harmonizacao-empty">Tente cadastrar uva/corte e nota Vivino nos vinhos para melhorar as sugestões.</div>`}
   </div>`;
 box.style.display = "block";
 box.scrollIntoView({behavior:"smooth", block:"start"});
}


function indicePosicaoAdega(posicao, adega){
 const texto = String(posicao || "").trim().toUpperCase();
 if(!texto || !adega) return -1;
 const match = texto.match(/^([A-Z]+)(\d+)$/);
 if(!match) return -1;
 const letras = match[1];
 const numero = Number(match[2]);
 const porPrateleira = Math.max(1, Number(adega.garrafasPorPrateleira || 5));
 let prateleira = 0;
 if(letras.length === 1){
   prateleira = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(letras);
 }else if(letras.startsWith("P")){
   prateleira = Number(letras.slice(1)) - 1;
 }
 if(prateleira < 0 || !numero) return -1;
 return prateleira * porPrateleira + (numero - 1);
}

function garrafasAdega3D(adega, capacidadeVisual){
 const filtro = document.getElementById("filtroAdega3D")?.value || "";
 const slots = Array.from({length:capacidadeVisual}, ()=>null);
 const semPosicao = [];
 if(!adega){
   return {slots, total:0, semPosicao};
 }
 vinhos.forEach((v,index)=>{
   garantirEstrutura(v);
   if(filtro && v.tipo !== filtro) return;
   (v.aquisicoes || []).forEach((a,aquisicaoIndex)=>{
     if(a.consumida) return;
     if(String(a.adegaId || "") !== String(adega.id || "")) return;
     const item = {vinho:v, index, aquisicaoIndex, garrafa:a};
     const slotIndex = indicePosicaoAdega(a.posicaoAdega, adega);
     if(slotIndex >= 0 && slotIndex < capacidadeVisual && !slots[slotIndex]){
       slots[slotIndex] = item;
     }else{
       semPosicao.push(item);
     }
   });
 });
 return {slots, total:slots.filter(Boolean).length + semPosicao.length, semPosicao};
}

function classeTipoAdega3D(tipo){
 if(tipo === "Branco") return "tipo-branco";
 if(tipo === "Rosé") return "tipo-rose";
 if(tipo === "Espumante") return "tipo-espumante";
 return "tipo-tinto";
}

function renderizarAdega3D(){
 const rack = document.getElementById("adega3dRack");
 if(!rack) return;

 // Importante: quando o usuário troca a adega no combo, o valor selecionado
 // precisa ser salvo antes de reconstruirmos as opções do select.
 // Sem isso, renderizarSelectAdegas3D() voltava para a adega anterior.
 const selectAtual = document.getElementById("selectAdega3D");
 if(selectAtual && selectAtual.value){
   adega3DSelecionadaId = String(selectAtual.value);
   localStorage.setItem("aj_adega3d_selecionada_id", adega3DSelecionadaId);
 }

 renderizarSelectAdegas3D();
 const adega = obterAdega3DSelecionada();
 const porPrateleira = Math.max(1, Number(adega?.garrafasPorPrateleira || 5));
 const capacidadeInformada = Math.max(0, Number(adega?.capacidade || 0));
 const totalPrateleiras = Math.max(1, Number(adega?.prateleiras || Math.ceil((capacidadeInformada || 1) / porPrateleira)));
 const capacidadeVisual = adega ? capacidadeVisualAdega(adega) : (capacidadeInformada || (totalPrateleiras * porPrateleira));
 const mapaGarrafas3D = garrafasAdega3D(adega, capacidadeVisual);
 const slotsAdega3D = mapaGarrafas3D.slots;
 const garrafasExcedentes = mapaGarrafas3D.semPosicao.length;
 const pill = document.getElementById("adega3dResumoPill");
 if(pill){
   const nomeAdega = adega?.nome || "Adega padrão";
   const ocupacao = `${slotsAdega3D.filter(Boolean).length}/${capacidadeVisual}`;
   pill.innerText = `${nomeAdega} • ${ocupacao} lugares${garrafasExcedentes ? ` • +${garrafasExcedentes} fora` : ""}`;
 }

 if(!adega){
   rack.innerHTML = `<div class="harmonizacao-empty">Cadastre uma adega em Configurações para usar a visualização 3D.</div>`;
   const detalhe = document.getElementById("adega3dDetalhe");
   if(detalhe) detalhe.innerHTML = `<div class="adega3d-detail-empty">Nenhuma adega selecionada.</div>`;
   return;
 }

 let html = "";

 for(let p=0; p<totalPrateleiras; p++){
   const inicio = p * porPrateleira;
   const itens = slotsAdega3D.slice(inicio, inicio + porPrateleira);
   html += `<div class="adega3d-shelf">
     <div class="shelf-number">${p+1}</div>
     <div class="shelf-label">Prateleira ${p+1}</div>
     <div class="bottle-row" style="grid-template-columns:repeat(${porPrateleira},minmax(0,1fr))">`;
   for(let pos=0; pos<porPrateleira; pos++){
     const slotAbsoluto = inicio + pos;
     const item = slotAbsoluto < capacidadeVisual ? itens[pos] : null;
     if(item){
       const v = item.vinho;
       const titulo = `${v.nome} ${v.safra ? "• " + v.safra : ""}`;
       html += `<button class="bottle-slot" id="bottle3d-${slotAbsoluto}" title="${titulo}" data-slot-index="${slotAbsoluto}" onpointerdown="iniciarArrastoGarrafa3D(event, ${item.index}, ${item.aquisicaoIndex}, ${slotAbsoluto}, 'bottle3d-${slotAbsoluto}')" onclick="selecionarGarrafa3D(${item.index}, ${item.aquisicaoIndex}, ${p+1}, ${pos+1}, 'bottle3d-${slotAbsoluto}')">
         <span class="bottle-css ${classeTipoAdega3D(v.tipo)}"></span>
       </button>`;
     }else if(slotAbsoluto < capacidadeVisual){
       html += `<button class="bottle-slot empty-slot" id="empty3d-${slotAbsoluto}" title="Posição vazia" data-empty-slot="true" data-slot-index="${slotAbsoluto}" data-prateleira="${p+1}" data-posicao="${pos+1}" onclick="abrirModalPosicionarGarrafa3D(${slotAbsoluto}, ${p+1}, ${pos+1}, 'empty3d-${slotAbsoluto}')">
         <span class="bottle-empty"></span>
       </button>`;
     }
   }
   html += `</div></div>`;
 }
 rack.innerHTML = html;

 const selecionadaAtual = document.querySelector(".bottle-slot.selected");
 const primeiroIndex = slotsAdega3D.findIndex(Boolean);
 if(!selecionadaAtual && primeiroIndex >= 0){
   const primeiro = slotsAdega3D[primeiroIndex];
   const prateleiraInicial = Math.floor(primeiroIndex / porPrateleira) + 1;
   const posicaoInicial = (primeiroIndex % porPrateleira) + 1;
   selecionarGarrafa3D(primeiro.index, primeiro.aquisicaoIndex, prateleiraInicial, posicaoInicial, `bottle3d-${primeiroIndex}`, false);
 }
}


function textoSeguroHtml(valor){
 return String(valor ?? "")
   .replace(/&/g,"&amp;")
   .replace(/</g,"&lt;")
   .replace(/>/g,"&gt;")
   .replace(/"/g,"&quot;")
   .replace(/'/g,"&#039;");
}

function posicaoPorIndiceAdega3D(slotIndex, adega){
 const porPrateleira = Math.max(1, Number(adega?.garrafasPorPrateleira || 5));
 const prateleira = Math.floor(Number(slotIndex || 0) / porPrateleira);
 const posicao = (Number(slotIndex || 0) % porPrateleira) + 1;
 return `${letraPrateleira(prateleira)}${posicao}`;
}

function garrafasDisponiveisParaPosicionar3D(){
 const busca = String(document.getElementById("buscaGarrafaPosicionar")?.value || "").trim().toLowerCase();
 const lista = [];
 vinhos.forEach((v,index)=>{
   garantirEstrutura(v);
   (v.aquisicoes || []).forEach((a,aquisicaoIndex)=>{
     if(a.consumida || !a.id) return;
     if(a.adegaId && a.posicaoAdega) return;
     const texto = `${v.nome || ""} ${v.safra || ""} ${v.tipo || ""} ${v.detalhes?.uva || ""} ${v.detalhes?.pais || ""}`.toLowerCase();
     if(busca && !texto.includes(busca)) return;
     lista.push({vinho:v, index, garrafa:a, aquisicaoIndex});
   });
 });
 return lista.sort((a,b)=>String(a.vinho.nome || "").localeCompare(String(b.vinho.nome || ""), "pt-BR"));
}

function abrirModalPosicionarGarrafa3D(slotIndex, prateleira, posicao, elementId){
 if(suprimirCliqueAdega3D) return;
 const adega = obterAdega3DSelecionada();
 if(!adega){
   mostrarMensagem("Cadastre uma adega antes de posicionar garrafas.", {tipo:"aviso", titulo:"Nenhuma adega cadastrada", icone:"⚠️"});
   return;
 }
 const posicaoCodigo = posicaoPorIndiceAdega3D(slotIndex, adega);
 document.querySelectorAll(".bottle-slot.selected, .bottle-slot.selected-empty").forEach(el=>el.classList.remove("selected","selected-empty"));
 const el = document.getElementById(elementId);
 if(el) el.classList.add("selected-empty");
 posicaoVazia3DSelecionada = {
   adegaId: adega.id,
   adegaNome: adega.nome || "Adega",
   slotIndex,
   prateleira,
   posicao,
   posicaoCodigo,
   elementId
 };
 const resumo = document.getElementById("posicionarGarrafaResumo");
 if(resumo) resumo.innerText = "Qual garrafa deseja colocar aqui?";
 const info = document.getElementById("posicionarGarrafaInfo");
 if(info) info.innerHTML = `Você selecionou <b>${textoSeguroHtml(adega.nome || "Adega")}</b> • posição <b>${textoSeguroHtml(posicaoCodigo)}</b>.`;
 const busca = document.getElementById("buscaGarrafaPosicionar");
 if(busca) busca.value = "";
 renderizarListaGarrafasParaPosicionar();
 const modal = document.getElementById("modalPosicionarGarrafa3D");
 if(modal) modal.style.display = "flex";
 setTimeout(()=>document.getElementById("buscaGarrafaPosicionar")?.focus(), 120);
}

function fecharModalPosicionarGarrafa3D(){
 const modal = document.getElementById("modalPosicionarGarrafa3D");
 if(modal) modal.style.display = "none";
 document.querySelectorAll(".bottle-slot.selected-empty").forEach(el=>el.classList.remove("selected-empty"));
 posicaoVazia3DSelecionada = null;
}

function renderizarListaGarrafasParaPosicionar(){
 const box = document.getElementById("listaGarrafasParaPosicionar");
 if(!box) return;
 const lista = garrafasDisponiveisParaPosicionar3D();
 if(!lista.length){
   box.innerHTML = `<div class="posicionar-empty">Nenhuma garrafa sem posição foi encontrada. Para mover uma garrafa que já está posicionada, remova ou altere a posição no detalhe do vinho.</div>`;
   return;
 }
 box.innerHTML = lista.map(item=>{
   const v = item.vinho;
   const nota = Number(v.detalhes?.notaVivino || 0);
   const flag = bandeiraPais(v.detalhes?.pais || "");
   const thumb = v.fotoUrl
     ? `<img class="posicionar-thumb" src="${textoSeguroHtml(v.fotoUrl)}" alt="Foto de ${textoSeguroHtml(v.nome)}" loading="lazy">`
     : `<div class="posicionar-thumb-placeholder">${iconeTipo(v.tipo)}</div>`;
   const meta = `${flag ? flag + " " : ""}${v.tipo || "-"}${v.safra ? " • " + v.safra : ""}${v.detalhes?.uva ? " • " + v.detalhes.uva : ""}`;
   return `<button type="button" class="posicionar-item" onclick="posicionarGarrafaNoSlot3D(${item.index}, ${item.aquisicaoIndex})">
     ${thumb}
     <span class="posicionar-main">
       <strong>${textoSeguroHtml(v.nome || "Vinho sem nome")}</strong>
       <span>${textoSeguroHtml(meta)}</span>
     </span>
     <span class="posicionar-badge">${nota ? "⭐ " + nota.toFixed(1) : "Sem posição"}</span>
   </button>`;
 }).join("");
}

async function posicionarGarrafaNoSlot3D(vinhoIndex, aquisicaoIndex){
 const destino = posicaoVazia3DSelecionada;
 if(!destino){
   mostrarMensagem("Não foi possível identificar a posição selecionada.", {tipo:"erro", titulo:"Posição não encontrada", icone:"❌"});
   return;
 }
 const v = garantirEstrutura(vinhos[vinhoIndex]);
 const a = v?.aquisicoes?.[aquisicaoIndex];
 if(!v || !a || !a.id){
   mostrarMensagem("Não foi possível identificar esta garrafa.", {tipo:"erro", titulo:"Garrafa não encontrada", icone:"❌"});
   return;
 }
 const ocupada = posicaoOcupadaEmOutraGarrafa(destino.adegaId, destino.posicaoCodigo, a.id);
 if(ocupada){
   mostrarMensagem(`A posição ${destino.posicaoCodigo} acabou de ser ocupada por ${ocupada.vinho.nome}.`, {tipo:"aviso", titulo:"Posição ocupada", icone:"⚠️"});
   renderizarAdega3D();
   fecharModalPosicionarGarrafa3D();
   return;
 }

 const nomeVinho = `${v.nome || "Vinho sem nome"}${v.safra ? " • " + v.safra : ""}`;
 const confirmacao = await confirmarAdega(
   `Inserir ${nomeVinho} na posição ${destino.posicaoCodigo}?

Adega: ${destino.adegaNome || "Adega"}
Posição: ${destino.posicaoCodigo}`,
   {
     titulo:"Inserir garrafa",
     icone:"📍",
     confirmar:"Inserir",
     cancelar:"Cancelar"
   }
 );
 if(!confirmacao) return;

 const ocupadaAposConfirmacao = posicaoOcupadaEmOutraGarrafa(destino.adegaId, destino.posicaoCodigo, a.id);
 if(ocupadaAposConfirmacao){
   mostrarMensagem(`A posição ${destino.posicaoCodigo} acabou de ser ocupada por ${ocupadaAposConfirmacao.vinho.nome}.`, {tipo:"aviso", titulo:"Posição ocupada", icone:"⚠️"});
   renderizarAdega3D();
   fecharModalPosicionarGarrafa3D();
   return;
 }

 if(modoTesteAtivo()){
   fecharModalPosicionarGarrafa3D();
   await simularModoTeste(`Posicionamento simulado. A garrafa não foi colocada na posição ${destino.posicaoCodigo}.`, {titulo:"Posição simulada"});
   renderizarAdega3D();
   return;
 }

 try{
   const {error} = await supabaseClient
     .from("garrafas")
     .update({adega_id: destino.adegaId || null, posicao_adega: destino.posicaoCodigo || null})
     .eq("id", a.id);
   if(error) throw error;
   fecharModalPosicionarGarrafa3D();
   await carregarDoSupabase(true);
   renderizarAdega3D();
   mostrarMensagem(`${nomeVinho} foi colocada na posição ${destino.posicaoCodigo}.`, {tipo:"sucesso", titulo:"Garrafa posicionada", icone:"🍷"});
 }catch(e){
   console.error(e);
   mostrarMensagem("Não foi possível posicionar a garrafa no Supabase.", {tipo:"erro", titulo:"Erro ao posicionar", icone:"❌"});
 }
}


function limparEstadoArrastoAdega3D(){
 const estado = arrastoAdega3D;
 if(estado?.timer) clearTimeout(estado.timer);
 document.removeEventListener("pointermove", moverArrastoGarrafa3D, true);
 document.removeEventListener("pointerup", finalizarArrastoGarrafa3D, true);
 document.removeEventListener("pointercancel", cancelarArrastoGarrafa3D, true);
 document.querySelectorAll(".drop-target").forEach(el=>el.classList.remove("drop-target"));
 document.querySelectorAll(".drag-source").forEach(el=>el.classList.remove("drag-source"));
 document.getElementById("adega3dRack")?.classList.remove("dragging-3d");
 document.getElementById("adega3dDragGhost")?.remove();
 document.getElementById("adega3dDragHint")?.remove();
 arrastoAdega3D = null;
}

function criarGhostArrastoAdega3D(vinho){
 const ghost = document.createElement("div");
 ghost.id = "adega3dDragGhost";
 ghost.className = "adega3d-drag-ghost";
 ghost.innerHTML = `<span class="bottle-css ${classeTipoAdega3D(vinho?.tipo)}"></span>`;
 document.body.appendChild(ghost);
 const hint = document.createElement("div");
 hint.id = "adega3dDragHint";
 hint.className = "adega3d-drag-hint";
 hint.innerText = "Solte em uma posição vazia";
 document.body.appendChild(hint);
 return ghost;
}

function iniciarArrastoGarrafa3D(event, index, aquisicaoIndex, slotIndex, elementId){
 if(event.button !== undefined && event.button !== 0) return;
 const origemEl = document.getElementById(elementId);
 const v = garantirEstrutura(vinhos[index]);
 const a = v?.aquisicoes?.[aquisicaoIndex];
 if(!origemEl || !v || !a || !a.id) return;
 if(arrastoAdega3D) limparEstadoArrastoAdega3D();
 arrastoAdega3D = {
   index,
   aquisicaoIndex,
   garrafaId:a.id,
   slotOrigem:slotIndex,
   elementId,
   pointerId:event.pointerId,
   startX:event.clientX,
   startY:event.clientY,
   lastX:event.clientX,
   lastY:event.clientY,
   ativo:false,
   ghost:null,
   target:null,
   timer:null
 };
 try{ origemEl.setPointerCapture?.(event.pointerId); }catch(e){}
 arrastoAdega3D.timer = setTimeout(()=>{
   if(!arrastoAdega3D || arrastoAdega3D.pointerId !== event.pointerId) return;
   arrastoAdega3D.ativo = true;
   origemEl.classList.add("drag-source");
   document.getElementById("adega3dRack")?.classList.add("dragging-3d");
   arrastoAdega3D.ghost = criarGhostArrastoAdega3D(v);
   posicionarGhostArrastoAdega3D(arrastoAdega3D.lastX || event.clientX, arrastoAdega3D.lastY || event.clientY);
   if(navigator.vibrate) navigator.vibrate(35);
 }, 360);
 document.addEventListener("pointermove", moverArrastoGarrafa3D, true);
 document.addEventListener("pointerup", finalizarArrastoGarrafa3D, true);
 document.addEventListener("pointercancel", cancelarArrastoGarrafa3D, true);
}

function posicionarGhostArrastoAdega3D(x, y){
 const ghost = arrastoAdega3D?.ghost;
 if(!ghost) return;
 ghost.style.transform = `translate(${x - 37}px, ${y - 18}px)`;
}

function alvoVazioArrastoAdega3D(x, y){
 const ghost = arrastoAdega3D?.ghost;
 if(ghost) ghost.style.display = "none";
 const el = document.elementFromPoint(x, y);
 if(ghost) ghost.style.display = "flex";
 return el?.closest?.(".bottle-slot.empty-slot") || null;
}

function moverArrastoGarrafa3D(event){
 const estado = arrastoAdega3D;
 if(!estado || event.pointerId !== estado.pointerId) return;
 estado.lastX = event.clientX;
 estado.lastY = event.clientY;
 const dx = Math.abs(event.clientX - estado.startX);
 const dy = Math.abs(event.clientY - estado.startY);

 // Antes do toque longo ativar, não cancelamos mais o arrasto por movimento.
 // No celular, qualquer pequeno deslocamento ao segurar a garrafa podia cancelar o pointer
 // e fazia parecer que o recurso "parava" quando o usuário começava a arrastar.
 if(!estado.ativo){
   if(dx > 4 || dy > 4) event.preventDefault();
   return;
 }

 event.preventDefault();
 posicionarGhostArrastoAdega3D(event.clientX, event.clientY);
 const alvo = alvoVazioArrastoAdega3D(event.clientX, event.clientY);
 if(estado.target && estado.target !== alvo) estado.target.classList.remove("drop-target");
 estado.target = alvo;
 if(alvo) alvo.classList.add("drop-target");
}

function cancelarArrastoGarrafa3D(event){
 const estado = arrastoAdega3D;
 if(!estado || event.pointerId !== estado.pointerId) return;
 limparEstadoArrastoAdega3D();
}

async function finalizarArrastoGarrafa3D(event){
 const estado = arrastoAdega3D;
 if(!estado || event.pointerId !== estado.pointerId) return;
 if(estado.timer) clearTimeout(estado.timer);
 if(!estado.ativo){
   limparEstadoArrastoAdega3D();
   return;
 }
 event.preventDefault();
 event.stopPropagation();
 const alvo = estado.target || alvoVazioArrastoAdega3D(event.clientX, event.clientY);
 const destino = alvo ? {
   slotIndex:Number(alvo.dataset.slotIndex || -1),
   prateleira:Number(alvo.dataset.prateleira || 0),
   posicao:Number(alvo.dataset.posicao || 0),
   elementId:alvo.id
 } : null;
 suprimirCliqueAdega3D = true;
 setTimeout(()=>{ suprimirCliqueAdega3D = false; }, 450);
 limparEstadoArrastoAdega3D();
 if(!destino || destino.slotIndex < 0) return;
 await confirmarMoverGarrafaPorArrasto3D(estado, destino);
}

async function confirmarMoverGarrafaPorArrasto3D(origem, destino){
 const adega = obterAdega3DSelecionada();
 const v = garantirEstrutura(vinhos[origem.index]);
 const a = v?.aquisicoes?.[origem.aquisicaoIndex];
 if(!adega || !v || !a || !a.id){
   mostrarMensagem("Não foi possível identificar a garrafa ou a adega selecionada.", {tipo:"erro", titulo:"Movimento não realizado", icone:"❌"});
   return;
 }
 const novaPosicao = posicaoPorIndiceAdega3D(destino.slotIndex, adega);
 const posicaoAtual = a.posicaoAdega || posicaoPorIndiceAdega3D(origem.slotOrigem, adega);
 if(String(novaPosicao || "") === String(posicaoAtual || "") && String(a.adegaId || "") === String(adega.id || "")) return;
 const ocupada = posicaoOcupadaEmOutraGarrafa(adega.id, novaPosicao, a.id);
 if(ocupada){
   mostrarMensagem(`A posição ${novaPosicao} já está ocupada por ${ocupada.vinho.nome}${ocupada.vinho.safra ? " • " + ocupada.vinho.safra : ""}.`, {tipo:"aviso", titulo:"Posição ocupada", icone:"⚠️"});
   renderizarAdega3D();
   return;
 }
 const nomeVinho = `${v.nome || "Vinho sem nome"}${v.safra ? " • " + v.safra : ""}`;
 const confirmado = await confirmarAdega(
   `Mover ${nomeVinho}?

De: ${nomeAdegaPorId(a.adegaId || adega.id)} • posição ${posicaoAtual || "-"}
Para: ${adega.nome || "Adega"} • posição ${novaPosicao}`,
   {titulo:"Confirmar mudança", icone:"🔄", confirmar:"Mover", cancelar:"Cancelar"}
 );
 if(!confirmado){
   renderizarAdega3D();
   return;
 }
 const ocupadaAposConfirmacao = posicaoOcupadaEmOutraGarrafa(adega.id, novaPosicao, a.id);
 if(ocupadaAposConfirmacao){
   mostrarMensagem(`A posição ${novaPosicao} acabou de ser ocupada por ${ocupadaAposConfirmacao.vinho.nome}.`, {tipo:"aviso", titulo:"Posição ocupada", icone:"⚠️"});
   renderizarAdega3D();
   return;
 }
 if(modoTesteAtivo()){
   await simularModoTeste(`Movimento simulado. A garrafa não foi movida para a posição ${novaPosicao}.`, {titulo:"Movimento simulado"});
   renderizarAdega3D();
   return;
 }
 try{
   const {error} = await supabaseClient
     .from("garrafas")
     .update({adega_id: adega.id || null, posicao_adega: novaPosicao || null})
     .eq("id", a.id);
   if(error) throw error;
   await carregarDoSupabase(true);
   renderizarAdega3D();
   mostrarMensagem(`${nomeVinho} foi movida para ${adega.nome || "Adega"} • posição ${novaPosicao}.`, {tipo:"sucesso", titulo:"Garrafa movida", icone:"🍷"});
 }catch(e){
   console.error(e);
   mostrarMensagem("Não foi possível mover a garrafa no Supabase.", {tipo:"erro", titulo:"Erro ao mover", icone:"❌"});
 }
}


function abrirModalMoverGarrafa3D(index, aquisicaoIndex){
 const v = garantirEstrutura(vinhos[index]);
 const a = v?.aquisicoes?.[aquisicaoIndex];
 if(!v || !a || !a.id){
   mostrarMensagem("Não foi possível identificar esta garrafa para mover.", {tipo:"erro", titulo:"Garrafa não encontrada", icone:"❌"});
   return;
 }
 garrafa3DSelecionadaMover = {index, aquisicaoIndex, garrafaId:a.id};
 const nomeVinho = `${v.nome || "Vinho sem nome"}${v.safra ? " • " + v.safra : ""}`;
 const adegaAtual = nomeAdegaPorId(a.adegaId);
 const posicaoAtual = a.posicaoAdega || "Sem posição";
 const resumo = document.getElementById("moverGarrafa3DResumo");
 if(resumo){
   resumo.innerHTML = `
     <b>${textoSeguroHtml(nomeVinho)}</b><br>
     Origem atual: <b>${textoSeguroHtml(adegaAtual)}</b> • posição <b>${textoSeguroHtml(posicaoAtual)}</b><br>
     Escolha a nova adega e a nova posição.`;
 }
 const selectAdega = document.getElementById("moverGarrafa3DAdega");
 if(selectAdega){
   selectAdega.innerHTML = htmlOptionsAdegasSelecionada(a.adegaId || obterAdega3DSelecionada()?.id || "");
   if(!selectAdega.value && obterAdega3DSelecionada()?.id) selectAdega.value = obterAdega3DSelecionada().id;
 }
 atualizarPosicoesMoverGarrafa3D(a.posicaoAdega || "");
 const modal = document.getElementById("modalMoverGarrafa3D");
 if(modal) modal.style.display = "flex";
}

function atualizarPosicoesMoverGarrafa3D(posicaoPreferida=""){
 const selectAdega = document.getElementById("moverGarrafa3DAdega");
 const selectPosicao = document.getElementById("moverGarrafa3DPosicao");
 if(!selectAdega || !selectPosicao) return;
 const valorAtual = posicaoPreferida || selectPosicao.value || "";
 selectPosicao.innerHTML = htmlOptionsPosicoesAdega(selectAdega.value, valorAtual);
}

function fecharModalMoverGarrafa3D(){
 const modal = document.getElementById("modalMoverGarrafa3D");
 if(modal) modal.style.display = "none";
 garrafa3DSelecionadaMover = null;
}

async function confirmarMoverGarrafa3D(){
 const ref = garrafa3DSelecionadaMover;
 if(!ref){
   mostrarMensagem("Não foi possível identificar a garrafa selecionada.", {tipo:"erro", titulo:"Garrafa não encontrada", icone:"❌"});
   return;
 }
 const v = garantirEstrutura(vinhos[ref.index]);
 const a = v?.aquisicoes?.[ref.aquisicaoIndex];
 if(!v || !a || !a.id){
   mostrarMensagem("Não foi possível identificar esta garrafa.", {tipo:"erro", titulo:"Garrafa não encontrada", icone:"❌"});
   return;
 }
 const adegaId = document.getElementById("moverGarrafa3DAdega")?.value || "";
 const posicao = document.getElementById("moverGarrafa3DPosicao")?.value || "";
 if(posicao && !adegaId){
   mostrarMensagem("Escolha a adega antes de informar a posição da garrafa.", {tipo:"aviso", titulo:"Adega não informada", icone:"⚠️"});
   return;
 }
 if(!adegaId || !posicao){
   mostrarMensagem("Escolha a adega e a posição para mover a garrafa.", {tipo:"aviso", titulo:"Destino incompleto", icone:"⚠️"});
   return;
 }
 const ocupada = posicaoOcupadaEmOutraGarrafa(adegaId, posicao, a.id);
 if(ocupada){
   mostrarMensagem(`A posição ${posicao} já está ocupada por ${ocupada.vinho.nome}${ocupada.vinho.safra ? " • " + ocupada.vinho.safra : ""}.`, {tipo:"aviso", titulo:"Posição ocupada", icone:"⚠️"});
   return;
 }
 const nomeVinho = `${v.nome || "Vinho sem nome"}${v.safra ? " • " + v.safra : ""}`;
 const nomeAdegaDestino = nomeAdegaPorId(adegaId);
 const confirmado = await confirmarAdega(
   `Mover ${nomeVinho} para ${nomeAdegaDestino} • posição ${posicao}?`,
   {titulo:"Mover garrafa", icone:"🔄", confirmar:"Mover", cancelar:"Cancelar"}
 );
 if(!confirmado) return;
 const ocupadaAposConfirmacao = posicaoOcupadaEmOutraGarrafa(adegaId, posicao, a.id);
 if(ocupadaAposConfirmacao){
   mostrarMensagem(`A posição ${posicao} acabou de ser ocupada por ${ocupadaAposConfirmacao.vinho.nome}.`, {tipo:"aviso", titulo:"Posição ocupada", icone:"⚠️"});
   return;
 }
 if(modoTesteAtivo()){
   fecharModalMoverGarrafa3D();
   await simularModoTeste(`Movimento simulado. A garrafa não foi movida para ${nomeAdegaDestino} • posição ${posicao}.`, {titulo:"Movimento simulado"});
   renderizarAdega3D();
   return;
 }
 try{
   const {error} = await supabaseClient
     .from("garrafas")
     .update({adega_id: adegaId || null, posicao_adega: posicao || null})
     .eq("id", a.id);
   if(error) throw error;
   fecharModalMoverGarrafa3D();
   await carregarDoSupabase(true);
   if(adega3DSelecionadaId !== String(adegaId)){
     adega3DSelecionadaId = String(adegaId);
     localStorage.setItem("aj_adega3d_selecionada_id", adega3DSelecionadaId);
   }
   renderizarAdega3D();
   mostrarMensagem(`${nomeVinho} foi movida para ${nomeAdegaDestino} • posição ${posicao}.`, {tipo:"sucesso", titulo:"Garrafa movida", icone:"🍷"});
 }catch(e){
   console.error(e);
   mostrarMensagem("Não foi possível mover a garrafa no Supabase.", {tipo:"erro", titulo:"Erro ao mover", icone:"❌"});
 }
}

async function removerPosicaoGarrafa3D(index, aquisicaoIndex){
 const v = garantirEstrutura(vinhos[index]);
 const a = v?.aquisicoes?.[aquisicaoIndex];
 if(!v || !a || !a.id){
   mostrarMensagem("Não foi possível identificar esta garrafa.", {tipo:"erro", titulo:"Garrafa não encontrada", icone:"❌"});
   return;
 }
 const nomeVinho = `${v.nome || "Vinho sem nome"}${v.safra ? " • " + v.safra : ""}`;
 const confirmado = await confirmarAdega(
   `Remover a posição de ${nomeVinho}?\n\nA garrafa continuará no estoque, apenas ficará sem posição definida.`,
   {titulo:"Remover posição", icone:"📍", confirmar:"Remover", cancelar:"Cancelar"}
 );
 if(!confirmado) return;
 if(modoTesteAtivo()){
   await simularModoTeste("Remoção de posição simulada. A garrafa continua na posição real.", {titulo:"Posição simulada"});
   renderizarAdega3D();
   return;
 }
 try{
   const {error} = await supabaseClient
     .from("garrafas")
     .update({adega_id:null, posicao_adega:null})
     .eq("id", a.id);
   if(error) throw error;
   await carregarDoSupabase(true);
   renderizarAdega3D();
   mostrarMensagem(`${nomeVinho} ficou sem posição definida.`, {tipo:"sucesso", titulo:"Posição removida", icone:"📍"});
 }catch(e){
   console.error(e);
   mostrarMensagem("Não foi possível remover a posição da garrafa no Supabase.", {tipo:"erro", titulo:"Erro ao remover posição", icone:"❌"});
 }
}

function selecionarGarrafa3D(index, aquisicaoIndex, prateleira, posicao, elementId, scroll=true){
 if(suprimirCliqueAdega3D) return;
 document.querySelectorAll(".bottle-slot.selected").forEach(el=>el.classList.remove("selected"));
 const el = document.getElementById(elementId);
 if(el) el.classList.add("selected");
 const v = garantirEstrutura(vinhos[index]);
 const garrafa3D = v.aquisicoes?.[aquisicaoIndex] || null;
 const detalhe = document.getElementById("adega3dDetalhe");
 if(!detalhe) return;
 const flag = bandeiraPais(v.detalhes?.pais || "");
 const nota = Number(v.detalhes?.notaVivino || 0);
 const info = calcularInfoGuarda(v);
 const thumb = v.fotoUrl
   ? `<img class="wine-thumb" src="${v.fotoUrl}" alt="Foto de ${v.nome}" loading="lazy">`
   : `<div class="hist-thumb-placeholder">${iconeTipo(v.tipo)}</div>`;
 detalhe.innerHTML = `
   <div class="adega3d-detail-head">
     ${thumb}
     <div>
       <h3>${v.nome} ${v.safra ? "• " + v.safra : ""}</h3>
       <div class="adega3d-detail-meta">${flag ? flag + " " : ""}${v.detalhes?.pais || "-"} • ${v.tipo || "-"}<br>${obterAdega3DSelecionada()?.nome || "Adega"} • posição ${garrafa3D?.posicaoAdega || (letraPrateleira(prateleira-1) + posicao)}</div>
     </div>
   </div>
   <div class="adega3d-detail-badges">
     ${nota ? `<span class="hist-badge star">⭐ ${nota.toFixed(1)}</span>` : ""}
     <span class="hist-badge adega">${garrafa3D?.posicaoAdega || "Sem posição"}</span>
     <span class="guarda-badge ${info.classe}">${info.icone} ${info.status}</span>
   </div>
   <div class="adega3d-detail-grid">
     <div class="adega3d-detail-box"><small>Produtor</small><strong>${v.detalhes?.produtor || "-"}</strong></div>
     <div class="adega3d-detail-box"><small>Uva / corte</small><strong>${v.detalhes?.uva || "-"}</strong></div>
     <div class="adega3d-detail-box"><small>Região</small><strong>${v.detalhes?.regiao || "-"}</strong></div>
     <div class="adega3d-detail-box"><small>Safra</small><strong>${v.safra || "-"}</strong></div>
     <div class="adega3d-detail-box"><small>Potencial</small><strong>${v.detalhes?.guarda || "-"}</strong></div>
     <div class="adega3d-detail-box"><small>Janela</small><strong>${info.resumo || "-"}</strong></div>
   </div>
   <div class="adega3d-actions adega3d-actions-premium">
     <div class="adega3d-actions-title">Ações da garrafa</div>
     <button class="adega3d-action-primary" onclick="abrirModalMoverGarrafa3D(${index}, ${aquisicaoIndex})" type="button">
       <span class="adega3d-action-icon" aria-hidden="true">
         <svg viewBox="0 0 24 24"><path d="M7 7h10l-2.5-2.5"/><path d="M17 7l-2.5 2.5"/><path d="M17 17H7l2.5 2.5"/><path d="M7 17l2.5-2.5"/><path d="M12 5v14"/></svg>
       </span>
       <span>
         <strong>Mover garrafa</strong>
         <small>Trocar de posição ou adega</small>
       </span>
     </button>
     <div class="adega3d-action-secondary-grid">
       <button class="adega3d-action-secondary" onclick="abrirModalConsumirGarrafa(${index}, ${aquisicaoIndex})" type="button">
         <span class="adega3d-action-icon" aria-hidden="true">
           <svg viewBox="0 0 24 24"><path d="M8 3h8l-1 7a4 4 0 0 1-3 3.85V20"/><path d="M9 20h6"/><path d="M8.4 8h7.2"/></svg>
         </span>
         <strong>Consumir</strong>
       </button>
       <button class="adega3d-action-secondary" onclick="abrirDetalhes(${index})" type="button">
         <span class="adega3d-action-icon" aria-hidden="true">
           <svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4 11.5-11.5Z"/></svg>
         </span>
         <strong>Editar</strong>
       </button>
       <button class="adega3d-action-secondary danger" onclick="removerPosicaoGarrafa3D(${index}, ${aquisicaoIndex})" type="button">
         <span class="adega3d-action-icon" aria-hidden="true">
           <svg viewBox="0 0 24 24"><path d="M4 7h16"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M6 7l1 14h10l1-14"/><path d="M9 7V4h6v3"/></svg>
         </span>
         <strong>Remover</strong>
       </button>
     </div>
   </div>`;
 if(scroll && window.innerWidth <= 900) detalhe.scrollIntoView({behavior:"smooth", block:"start"});
}

function setBottomNavAtivo(aba){
 const mapa = {
   adega:"bottomAdega",
   estatisticas:"bottomStats",
   historico:"bottomHistorico",
   rotulo:"bottomRotulo",
   adega3d:"bottomAdega3D",
   jantar:"bottomJantar",
   mais:"bottomJantar"
 };
 Object.values(mapa).forEach(id=>{
   const el = document.getElementById(id);
   if(el) el.classList.remove("active");
 });
 const ativo = document.getElementById(mapa[aba] || mapa.adega);
 if(ativo) ativo.classList.add("active");
}

function mostrarAba(aba){
 document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
 setBottomNavAtivo(aba);
 const abaAdega = document.getElementById("abaAdega");
 const secaoLista = document.getElementById("secaoListaVinhos");
 const abaEstatisticas = document.getElementById("abaEstatisticas");
 const abaJantar = document.getElementById("abaJantar");
 const abaAdega3D = document.getElementById("abaAdega3D");

 if(abaAdega) abaAdega.style.display = aba === "adega" ? "block" : "none";
 if(secaoLista) secaoLista.style.display = aba === "adega" ? "block" : "none";
 const cardRecomendacoes = document.getElementById("cardRecomendacoesConsumo");
 if(cardRecomendacoes) cardRecomendacoes.style.display = aba === "adega" && vinhosEmEstoqueOrdenadosPorConsumo().length ? "block" : "none";
 const cardDesejados = document.getElementById("cardVinhosDesejados");
 if(cardDesejados) cardDesejados.style.display = aba === "adega" ? "block" : "none";
 const secaoSemEstoque = document.getElementById("secaoVinhosSemEstoque");
 if(secaoSemEstoque) secaoSemEstoque.style.display = aba === "adega" && secaoSemEstoque.querySelector(".vinho") ? "block" : "none";
 if(abaEstatisticas) abaEstatisticas.style.display = aba === "estatisticas" ? "block" : "none";
 if(abaJantar) abaJantar.style.display = aba === "jantar" ? "block" : "none";
 if(abaAdega3D) abaAdega3D.style.display = aba === "adega3d" ? "block" : "none";
 const fab = document.querySelector(".fab");
 if(fab) fab.style.display = aba === "adega" ? "" : "none";

 const tabs = document.querySelectorAll('.tab');
 if(aba === 'estatisticas'){
   if(tabs[1]) tabs[1].classList.add('active');
   renderizarEstatisticas();
 }else if(aba === 'adega3d'){
   if(tabs[2]) tabs[2].classList.add('active');
   renderizarAdega3D();
 }else if(aba === 'jantar'){
   if(tabs[6]) tabs[6].classList.add('active');
   renderizarPratosHarmonizacao();
 }else{
   if(tabs[0]) tabs[0].classList.add('active');
 }
}

function toggleDadosSommelier(){

  const body = document.getElementById("sommelierBody");

  const arrow = document.getElementById("sommelierArrow");

  if(!body) return;

  const aberto = body.style.display !== "none";

  body.style.display = aberto ? "none" : "block";

  if(arrow){
      arrow.textContent = aberto ? "▼" : "▲";
  }

}

function abrirConfiguracoes(){
 // Configurações não ocupa mais item no rodapé; mantém a aba atual.
 aplicarEstadoModoTeste();
 document.getElementById("modalConfiguracoes").style.display = "flex";
}

function fecharConfiguracoes(){
 document.getElementById("modalConfiguracoes").style.display = "none";
}

async function inicializarApp(){
 aplicarEstadoModoTeste();
 carregar();
 carregarConsumosExternos();
 togglePresenteadoPor();
 renderizar();

 const ok = await carregarDoSupabase(true);
 if(!ok){
   const lista = document.getElementById("listaVinhos");
   if(lista){
     lista.innerHTML = `<div class="empty">Não foi possível carregar o Supabase. Verifique as policies, a chave pública e a conexão.</div>`;
   }
 }

 setInterval(()=>{
   if(document.visibilityState === "visible"){
     carregarDoSupabase(true);
   }
 }, 120000);
}

inicializarApp();
