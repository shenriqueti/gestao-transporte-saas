const views = {
  chamada: document.getElementById("viewChamada"),
  alunos: document.getElementById("viewAlunos"),
  financeiro: document.getElementById("viewFinanceiro"),
};
const stats = {
  chamada: document.getElementById("statsChamada"),
  alunos: document.getElementById("statsAlunos"),
  financeiro: document.getElementById("statsFinanceiro"),
};
const contadores = {
  presentes: document.getElementById("contadorPresentes"),
  faltam: document.getElementById("contadorFaltam"),
  total: document.getElementById("totalAlunos"),
  recebido: document.getElementById("totalRecebido"),
  pendente: document.getElementById("totalPendente"),
};

const tituloPagina = document.getElementById("tituloPagina");
const dataDisplay = document.getElementById("dataDisplay");
const modal = document.getElementById("modalCadastro");
const form = document.getElementById("formAluno");
const tituloModal = document.getElementById("tituloModal");

let idEdicao = null;
let dataFinanceira = new Date();

document.addEventListener("DOMContentLoaded", () => {
  carregarDados();
  dataDisplay.innerText = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });

  document.getElementById("btnNovo").onclick = abrirModalNovo;
  document.getElementById("btnFecharModal").onclick = fecharModal;
  document.getElementById("btnLimpar").onclick = limparChamada;
});

window.mudarAba = function (aba) {
  // Esconde tudo
  Object.values(views).forEach((v) => v.classList.add("hidden"));
  Object.values(stats).forEach((s) => s.classList.add("hidden"));
  document
    .querySelectorAll(".nav-item")
    .forEach((el) => el.classList.remove("active"));

  if (aba === "chamada") {
    views.chamada.classList.remove("hidden");
    stats.chamada.classList.remove("hidden");
    tituloPagina.innerText = "Chamada";
    document.querySelectorAll(".nav-item")[0].classList.add("active");
    renderizarChamada();
  } else if (aba === "alunos") {
    views.alunos.classList.remove("hidden");
    stats.alunos.classList.remove("hidden");
    tituloPagina.innerText = "Alunos";
    document.querySelectorAll(".nav-item")[1].classList.add("active");
    renderizarGestao();
  } else if (aba === "financeiro") {
    views.financeiro.classList.remove("hidden");
    stats.financeiro.classList.remove("hidden");
    tituloPagina.innerText = "Financeiro";
    document.querySelectorAll(".nav-item")[2].classList.add("active");
    renderizarFinanceiro();
  }
};

function getAlunos() {
  return JSON.parse(localStorage.getItem("alunos")) || [];
}

function getChaveMes() {
  const ano = dataFinanceira.getFullYear();
  const mes = String(dataFinanceira.getMonth() + 1).padStart(2, "0");
  return `pagamentos_${ano}-${mes}`;
}

function renderizarChamada() {
  const lista = document.getElementById("listaChamada");
  lista.innerHTML = "";
  const alunos = getAlunos();
  const chamadaHoje = JSON.parse(localStorage.getItem("chamada_hoje")) || {};
  let countPresentes = 0;

  if (alunos.length === 0)
    return (lista.innerHTML =
      '<p class="msg-vazio">Sem alunos cadastrados.</p>');

  alunos.forEach((aluno) => {
    if (chamadaHoje[aluno.id]) countPresentes++;
    const escolaTxt = aluno.turma
      ? `${aluno.escola} (${aluno.turma})`
      : aluno.escola;

    const div = document.createElement("div");
    div.className = "card-aluno";
    div.innerHTML = `
            <label class="check-container">
                <input type="checkbox" onchange="marcarPresenca(${aluno.id}, this.checked)" ${chamadaHoje[aluno.id] ? "checked" : ""}>
                <span class="checkmark"><i class="ph-bold ph-check"></i></span>
            </label>
            <div class="info">
                <strong>${aluno.nome}</strong>
                <span class="escola">${escolaTxt}</span>
            </div>
            <div class="actions">
                <button class="btn-zap" onclick="abrirZap('${aluno.tel1}')"><i class="ph-fill ph-whatsapp-logo"></i></button>
            </div>
        `;
    lista.appendChild(div);
  });
  contadores.presentes.innerText = countPresentes;
  contadores.faltam.innerText = alunos.length - countPresentes;
}

function renderizarGestao() {
  const lista = document.getElementById("listaGestao");
  lista.innerHTML = "";
  const alunos = getAlunos();
  contadores.total.innerText = alunos.length;

  alunos.forEach((aluno) => {
    const div = document.createElement("div");
    div.className = "card-gestao";
    div.innerHTML = `
            <div class="gestao-header">
                <div>
                    <strong>${aluno.nome}</strong>
                    <div style="font-size:0.8rem; color:#666">${aluno.escola}</div>
                </div>
                <div class="gestao-actions">
                    <button onclick="editarAluno(${aluno.id})" class="btn-icon-edit"><i class="ph ph-pencil-simple"></i></button>
                    <button onclick="excluirAluno(${aluno.id})" class="btn-icon-trash"><i class="ph ph-trash"></i></button>
                </div>
            </div>
            <div class="gestao-contato">
                <span><strong>Resp:</strong> ${aluno.responsavel}</span>
                <span><strong>Valor:</strong> R$ ${aluno.valor || "0"}</span>
            </div>
        `;
    lista.appendChild(div);
  });
}

function renderizarFinanceiro() {
  const lista = document.getElementById("listaFinanceiro");
  lista.innerHTML = "";

  const options = { year: "numeric", month: "long" };
  document.getElementById("mesAtualTexto").innerText =
    dataFinanceira.toLocaleDateString("pt-BR", options);

  const alunos = getAlunos();
  const chaveMes = getChaveMes();
  const pagamentos = JSON.parse(localStorage.getItem(chaveMes)) || {};

  let totalRecebido = 0;
  let totalPendente = 0;

  if (alunos.length === 0) {
    lista.innerHTML = '<p class="msg-vazio">Sem alunos cadastrados.</p>';
    return;
  }

  alunos.forEach((aluno) => {
    const pago = pagamentos[aluno.id] === true;
    const valor = parseFloat(aluno.valor) || 0;

    const diaVenc = aluno.vencimento || "10";

    if (pago) totalRecebido += valor;
    else totalPendente += valor;

    const div = document.createElement("div");
    div.className = "card-financeiro";

    div.innerHTML = `
            <div class="financeiro-info">
                <strong>${aluno.nome}</strong>
                <span>Vence dia ${diaVenc}</span> 
            </div>
            <div class="financeiro-acao">
                <div style="font-size:0.8rem; margin-bottom:4px; text-align:right">R$ ${valor}</div>
                <button class="btn-pagamento ${pago ? "status-pago" : "status-pendente"}" 
                        onclick="togglePagamento(${aluno.id})">
                    ${pago ? "PAGO" : "PENDENTE"}
                </button>
            </div>
        `;
    lista.appendChild(div);
  });

  contadores.recebido.innerText = `R$ ${totalRecebido}`;
  contadores.pendente.innerText = `R$ ${totalPendente}`;
}

window.mudarMes = function (direcao) {
  dataFinanceira.setMonth(dataFinanceira.getMonth() + direcao);
  renderizarFinanceiro();
};

window.togglePagamento = function (id) {
  const chaveMes = getChaveMes();
  let pagamentos = JSON.parse(localStorage.getItem(chaveMes)) || {};

  if (pagamentos[id]) {
    delete pagamentos[id];
  } else {
    pagamentos[id] = true;
  }

  localStorage.setItem(chaveMes, JSON.stringify(pagamentos));
  renderizarFinanceiro();
};

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const dadosForm = {
    nome: document.getElementById("inputNome").value,
    escola: document.getElementById("inputEscola").value,
    valor: document.getElementById("inputValor").value,
    vencimento: document.getElementById("inputVencimento").value,
    turma: document.getElementById("inputTurma").value,
    professora: document.getElementById("inputProf").value,
    responsavel: document.getElementById("inputResp").value,
    tel1: document.getElementById("inputTel1").value,
    tel2: document.getElementById("inputTel2").value,
  };

  let alunos = getAlunos();

  if (idEdicao) {
    const index = alunos.findIndex((a) => a.id === idEdicao);
    if (index !== -1) {
      alunos[index] = { ...alunos[index], ...dadosForm };
    }
  } else {
    const novoAluno = { id: Date.now(), ...dadosForm };
    alunos.push(novoAluno);
  }

  localStorage.setItem("alunos", JSON.stringify(alunos));

  fecharModal();

  renderizarGestao();
  if (!views.financeiro.classList.contains("hidden")) renderizarFinanceiro();
  if (!views.chamada.classList.contains("hidden")) renderizarChamada();
});

function abrirModalNovo() {
  idEdicao = null;
  form.reset();
  tituloModal.innerText = "Novo Passageiro";
  modal.classList.remove("hidden");
}

function fecharModal() {
  modal.classList.add("hidden");
  form.reset();
}

window.editarAluno = function (id) {
  const alunos = getAlunos();
  const aluno = alunos.find((a) => a.id === id);

  if (aluno) {
    document.getElementById("inputNome").value = aluno.nome;
    document.getElementById("inputEscola").value = aluno.escola;

    document.getElementById("inputValor").value = aluno.valor || "";
    document.getElementById("inputVencimento").value = aluno.vencimento || "10";

    document.getElementById("inputTurma").value = aluno.turma || "";
    document.getElementById("inputProf").value = aluno.professora || "";
    document.getElementById("inputResp").value = aluno.responsavel;
    document.getElementById("inputTel1").value = aluno.tel1;
    document.getElementById("inputTel2").value = aluno.tel2 || "";

    idEdicao = id;
    tituloModal.innerText = "Editar Passageiro";
    modal.classList.remove("hidden");
  }
};

window.excluirAluno = function (id) {
  if (confirm("Excluir aluno?")) {
    let alunos = getAlunos();
    alunos = alunos.filter((a) => a.id !== id);
    localStorage.setItem("alunos", JSON.stringify(alunos));
    renderizarGestao();
  }
};
window.limparChamada = function () {
  if (confirm("Limpar chamada?")) {
    localStorage.removeItem("chamada_hoje");
    renderizarChamada();
  }
};
window.marcarPresenca = function (id, status) {
  let chamada = JSON.parse(localStorage.getItem("chamada_hoje")) || {};
  if (status) chamada[id] = true;
  else delete chamada[id];
  localStorage.setItem("chamada_hoje", JSON.stringify(chamada));
  renderizarChamada();
};
window.abrirZap = function (n) {
  if (!n) return alert("Sem número");
  window.open(`https://wa.me/55${n.replace(/\D/g, "")}`, "_blank");
};
function carregarDados() {
  renderizarChamada();
}
