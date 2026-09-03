import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Home, Car, Bike, Dog, Cat, Plane, Laptop, GraduationCap, Heart, Store,
  Search, Menu, X, ArrowRight, ArrowLeft, Share2, Lightbulb,
  BarChart3, Wallet, Loader2, ChevronRight, Check, AlertCircle, Sparkles,
  CheckCircle2, AlertTriangle, AlertOctagon, Minus, Plus, PiggyBank, Target,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  DESIGN TOKENS — identidade "dinheiro com vida", nada de azul/branco */
/* ------------------------------------------------------------------ */
const c = {
  bg: "#F5F1E6",            // ivoire quente, nada de branco puro
  bgAlt: "#EFE9D8",         // seções alternadas
  surface: "#FFFFFF",
  brand: "#0E6E4B",         // verde floresta — cor principal
  brandDark: "#0A2E22",     // blocos escuros / hero
  brandLight: "#DCEEE0",    // fundo de ícones
  brandHover: "#0B5A3D",
  gold: "#D9A02C",          // destaque quente
  goldBg: "#FBF1DC",
  coral: "#C4462A",         // alertas
  coralBg: "#FBE9E3",
  text: "#20281F",
  textSecondary: "#5F6B5A",
  border: "#E1D9C4",
};

/* ------------------------------------------------------------------ */
/*  UTILS                                                              */
/* ------------------------------------------------------------------ */
const normalize = (s = "") =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

const money = (n) =>
  (Number.isFinite(n) ? n : 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

function matchDataset(query, dataset) {
  const q = normalize(query);
  if (!q) return null;
  let found = null;
  Object.keys(dataset).forEach((key) => {
    if (key === "default") return;
    const nk = normalize(key);
    if (!found && (q.includes(nk) || nk.includes(q))) found = key;
  });
  return found;
}

/* ------------------------------------------------------------------ */
/*  DATA — categorias                                                  */
/* ------------------------------------------------------------------ */
const CATEGORIES = [
  { id: "moradia", title: "Morar sozinho", desc: "Aluguel, contas e o dia a dia por conta própria.", icon: Home, period: "mensal" },
  { id: "carro", title: "Ter um carro", desc: "Parcela, combustível, seguro e manutenção.", icon: Car, period: "mensal" },
  { id: "moto", title: "Ter uma moto", desc: "Do financiamento ao seguro obrigatório.", icon: Bike, period: "mensal" },
  { id: "cachorro", title: "Ter um cachorro", desc: "Ração, banho, tosa e veterinário.", icon: Dog, period: "mensal" },
  { id: "gato", title: "Ter um gato", desc: "Areia, ração e cuidados de rotina.", icon: Cat, period: "mensal" },
  { id: "viagem", title: "Viajar", desc: "Passagem, hospedagem e passeios.", icon: Plane, period: "total" },
  { id: "pc", title: "Montar um PC", desc: "Peça por peça, do processador ao gabinete.", icon: Laptop, period: "total" },
  { id: "faculdade", title: "Fazer faculdade", desc: "Mensalidade, material e transporte.", icon: GraduationCap, period: "mensal" },
  { id: "casamento", title: "Casar", desc: "Festa, buffet, decoração e fotografia.", icon: Heart, period: "total" },
  { id: "negocio", title: "Abrir um negócio", desc: "Investimento inicial para tirar do papel.", icon: Store, period: "total" },
];

const FIELDS = {
  moradia: [
    { key: "cidade", label: "Onde você pretende morar?", type: "text", placeholder: "Digite sua cidade", money: false },
    { key: "aluguel", label: "Aluguel estimado", type: "number", default: 1200, money: true },
    { key: "alimentacao", label: "Alimentação por mês", type: "number", default: 700, money: true },
    { key: "internet", label: "Internet", type: "number", default: 100, money: true },
    { key: "energia", label: "Energia elétrica", type: "number", default: 150, money: true },
    { key: "agua", label: "Água", type: "number", default: 70, money: true },
    { key: "transporte", label: "Transporte", type: "number", default: 250, money: true },
    { key: "outros", label: "Outros gastos", type: "number", default: 200, money: true },
  ],
  carro: [
    { key: "modelo", label: "Qual o modelo do carro?", type: "text", placeholder: "Ex: Chevrolet Onix", money: false },
    { key: "parcela", label: "Parcela do financiamento", type: "number", default: 900, money: true },
    { key: "combustivel", label: "Combustível por mês", type: "number", default: 350, money: true },
    { key: "seguro", label: "Seguro (média mensal)", type: "number", default: 220, money: true },
    { key: "manutencao", label: "Manutenção e revisões", type: "number", default: 150, money: true },
    { key: "ipva", label: "IPVA e licenciamento (média mensal)", type: "number", default: 120, money: true },
    { key: "estacionamento", label: "Estacionamento", type: "number", default: 100, money: true },
  ],
  moto: [
    { key: "modelo", label: "Qual o modelo da moto?", type: "text", placeholder: "Ex: Honda CG 160", money: false },
    { key: "parcela", label: "Parcela do financiamento", type: "number", default: 450, money: true },
    { key: "combustivel", label: "Combustível por mês", type: "number", default: 180, money: true },
    { key: "seguro", label: "Seguro (média mensal)", type: "number", default: 90, money: true },
    { key: "manutencao", label: "Manutenção", type: "number", default: 80, money: true },
    { key: "ipva", label: "IPVA e licenciamento (média mensal)", type: "number", default: 40, money: true },
  ],
  cachorro: [
    { key: "alimentacao", label: "Ração por mês", type: "number", default: 180, money: true },
    { key: "higiene", label: "Banho e tosa", type: "number", default: 100, money: true },
    { key: "saude", label: "Veterinário e plano de saúde", type: "number", default: 150, money: true },
    { key: "acessorios", label: "Brinquedos e acessórios", type: "number", default: 60, money: true },
    { key: "adestramento", label: "Adestramento (média mensal)", type: "number", default: 50, money: true },
  ],
  gato: [
    { key: "alimentacao", label: "Ração por mês", type: "number", default: 140, money: true },
    { key: "areia", label: "Areia higiênica", type: "number", default: 60, money: true },
    { key: "saude", label: "Veterinário e vacinas (média mensal)", type: "number", default: 100, money: true },
    { key: "acessorios", label: "Brinquedos e acessórios", type: "number", default: 40, money: true },
  ],
  viagem: [
    { key: "destino", label: "Para onde você vai?", type: "text", placeholder: "Digite o destino", money: false },
    { key: "passagem", label: "Passagem (ida e volta)", type: "number", default: 1400, money: true },
    { key: "hospedagem", label: "Hospedagem (estadia inteira)", type: "number", default: 1800, money: true },
    { key: "alimentacao", label: "Alimentação (estadia inteira)", type: "number", default: 900, money: true },
    { key: "passeios", label: "Passeios e ingressos", type: "number", default: 600, money: true },
    { key: "transporteLocal", label: "Transporte local", type: "number", default: 350, money: true },
  ],
  pc: [
    { key: "processador", label: "Processador", type: "number", default: 1500, money: true },
    { key: "placaVideo", label: "Placa de vídeo", type: "number", default: 2200, money: true },
    { key: "memoria", label: "Memória RAM", type: "number", default: 450, money: true },
    { key: "armazenamento", label: "Armazenamento (SSD)", type: "number", default: 400, money: true },
    { key: "placaMae", label: "Placa-mãe", type: "number", default: 800, money: true },
    { key: "fonteGabinete", label: "Fonte e gabinete", type: "number", default: 600, money: true },
    { key: "monitor", label: "Monitor", type: "number", default: 1200, money: true },
  ],
  faculdade: [
    { key: "mensalidade", label: "Mensalidade", type: "number", default: 900, money: true },
    { key: "material", label: "Material e livros por mês", type: "number", default: 120, money: true },
    { key: "transporte", label: "Transporte", type: "number", default: 200, money: true },
    { key: "alimentacao", label: "Alimentação no campus", type: "number", default: 250, money: true },
  ],
  casamento: [
    { key: "buffet", label: "Buffet e bebidas", type: "number", default: 12000, money: true },
    { key: "decoracao", label: "Decoração e cerimonial", type: "number", default: 4000, money: true },
    { key: "trajes", label: "Vestido e traje", type: "number", default: 3500, money: true },
    { key: "fotografia", label: "Fotografia e vídeo", type: "number", default: 3000, money: true },
    { key: "festa", label: "Música e festa", type: "number", default: 2500, money: true },
    { key: "convites", label: "Convites e lembrancinhas", type: "number", default: 800, money: true },
  ],
  negocio: [
    { key: "aluguel", label: "Aluguel do espaço (primeiro mês)", type: "number", default: 1800, money: true },
    { key: "estoque", label: "Estoque inicial", type: "number", default: 5000, money: true },
    { key: "equipamentos", label: "Equipamentos e móveis", type: "number", default: 6000, money: true },
    { key: "marketing", label: "Marketing de lançamento", type: "number", default: 1200, money: true },
    { key: "legalizacao", label: "Abertura e legalização", type: "number", default: 900, money: true },
  ],
};

/* ------------------------------------------------------------------ */
/*  DATA — "pesquisa" mockada de médias por cidade / modelo             */
/* ------------------------------------------------------------------ */
const roundTo = (n, step) => Math.round(n / step) * step;

// Cada cidade/modelo tem um "índice de custo" — a partir dele geramos os valores
// de cada campo. Isso deixa fácil adicionar dezenas de opções sem digitar tudo à mão.
const CITY_DEFS = {
  "sao paulo": { label: "São Paulo", idx: 1.55 },
  "rio de janeiro": { label: "Rio de Janeiro", idx: 1.45 },
  "brasilia": { label: "Brasília", idx: 1.15 },
  "florianopolis": { label: "Florianópolis", idx: 1.2 },
  "porto alegre": { label: "Porto Alegre", idx: 1.05 },
  "campinas": { label: "Campinas", idx: 1.1 },
  "santos": { label: "Santos", idx: 1.1 },
  "niteroi": { label: "Niterói", idx: 1.2 },
  "curitiba": { label: "Curitiba", idx: 0.95 },
  "vitoria": { label: "Vitória", idx: 1.0 },
  "belo horizonte": { label: "Belo Horizonte", idx: 0.9 },
  "goiania": { label: "Goiânia", idx: 0.8 },
  "cuiaba": { label: "Cuiabá", idx: 0.85 },
  "campo grande": { label: "Campo Grande", idx: 0.82 },
  "manaus": { label: "Manaus", idx: 0.8 },
  "belem": { label: "Belém", idx: 0.75 },
  "salvador": { label: "Salvador", idx: 0.85 },
  "recife": { label: "Recife", idx: 0.8 },
  "fortaleza": { label: "Fortaleza", idx: 0.75 },
  "natal": { label: "Natal", idx: 0.78 },
  "joao pessoa": { label: "João Pessoa", idx: 0.72 },
  "maceio": { label: "Maceió", idx: 0.75 },
  "aracaju": { label: "Aracaju", idx: 0.75 },
  "sao luis": { label: "São Luís", idx: 0.72 },
  "teresina": { label: "Teresina", idx: 0.68 },
  "caxias do sul": { label: "Caxias do Sul", idx: 0.78 },
  "pelotas": { label: "Pelotas", idx: 0.65 },
  "londrina": { label: "Londrina", idx: 0.78 },
  "maringa": { label: "Maringá", idx: 0.8 },
  "joinville": { label: "Joinville", idx: 0.85 },
  "blumenau": { label: "Blumenau", idx: 0.88 },
  "ribeirao preto": { label: "Ribeirão Preto", idx: 0.95 },
  "sorocaba": { label: "Sorocaba", idx: 0.85 },
  "uberlandia": { label: "Uberlândia", idx: 0.75 },
  "juiz de fora": { label: "Juiz de Fora", idx: 0.7 },
};

function buildCityCost(idx) {
  return {
    aluguel: roundTo(1000 * idx, 50),
    alimentacao: roundTo(650 * idx, 10),
    internet: roundTo(90 * (0.5 + idx / 2), 5),
    energia: roundTo(140 * (0.5 + idx / 2), 5),
    agua: roundTo(65 * (0.5 + idx / 2), 5),
    transporte: roundTo(220 * idx, 10),
    outros: roundTo(180 * idx, 10),
  };
}

const CITY_COST = Object.fromEntries(Object.entries(CITY_DEFS).map(([k, d]) => [k, buildCityCost(d.idx)]));
CITY_COST.default = { aluguel: 1200, alimentacao: 700, internet: 100, energia: 150, agua: 70, transporte: 250, outros: 200 };
const CITY_LABELS = Object.fromEntries(Object.entries(CITY_DEFS).map(([k, d]) => [k, d.label]));

const DOMESTIC_TRAVEL_EXTRA = {
  "gramado": { label: "Gramado", idx: 1.3 },
  "bonito": { label: "Bonito", idx: 1.15 },
  "fernando de noronha": { label: "Fernando de Noronha", idx: 2.2 },
  "jericoacoara": { label: "Jericoacoara", idx: 1.2 },
  "paraty": { label: "Paraty", idx: 1.15 },
  "ilhabela": { label: "Ilhabela", idx: 1.2 },
  "porto seguro": { label: "Porto Seguro", idx: 1.1 },
  "foz do iguacu": { label: "Foz do Iguaçu", idx: 1.05 },
};

const INTL_TRAVEL_DEFS = {
  "buenos aires": { label: "Buenos Aires", idx: 0.9 },
  "santiago": { label: "Santiago", idx: 1.0 },
  "montevideo": { label: "Montevidéu", idx: 0.85 },
  "lisboa": { label: "Lisboa", idx: 1.4 },
  "paris": { label: "Paris", idx: 1.9 },
  "londres": { label: "Londres", idx: 2.0 },
  "roma": { label: "Roma", idx: 1.8 },
  "nova york": { label: "Nova York", idx: 2.1 },
  "orlando": { label: "Orlando", idx: 1.7 },
  "cancun": { label: "Cancún", idx: 1.3 },
  "punta cana": { label: "Punta Cana", idx: 1.5 },
  "toquio": { label: "Tóquio", idx: 2.0 },
};

function buildTravelCost(idx, intl) {
  const passagemBase = intl ? 3200 : 550;
  return {
    passagem: roundTo(passagemBase * idx, 50),
    hospedagem: roundTo(1200 * idx, 50),
    alimentacao: roundTo(700 * idx, 10),
    passeios: roundTo(400 * idx, 10),
    transporteLocal: roundTo(220 * idx, 10),
  };
}

const TRAVEL_COST = {};
const TRAVEL_LABELS = {};
Object.entries(CITY_DEFS).forEach(([k, d]) => { TRAVEL_COST[k] = buildTravelCost(d.idx, false); TRAVEL_LABELS[k] = d.label; });
Object.entries(DOMESTIC_TRAVEL_EXTRA).forEach(([k, d]) => { TRAVEL_COST[k] = buildTravelCost(d.idx, false); TRAVEL_LABELS[k] = d.label; });
Object.entries(INTL_TRAVEL_DEFS).forEach(([k, d]) => { TRAVEL_COST[k] = buildTravelCost(d.idx, true); TRAVEL_LABELS[k] = d.label; });
TRAVEL_COST.default = { passagem: 1400, hospedagem: 1800, alimentacao: 900, passeios: 600, transporteLocal: 350 };

const CAR_DEFS = {
  kwid: { label: "Renault Kwid", idx: 0.75 },
  mobi: { label: "Fiat Mobi", idx: 0.75 },
  up: { label: "Volkswagen Up!", idx: 0.8 },
  gol: { label: "Volkswagen Gol", idx: 0.85 },
  onix: { label: "Chevrolet Onix", idx: 0.95 },
  hb20: { label: "Hyundai HB20", idx: 1.0 },
  argo: { label: "Fiat Argo", idx: 0.95 },
  sandero: { label: "Renault Sandero", idx: 0.9 },
  fox: { label: "Volkswagen Fox", idx: 0.85 },
  voyage: { label: "Volkswagen Voyage", idx: 0.95 },
  prisma: { label: "Chevrolet Prisma", idx: 0.95 },
  virtus: { label: "Volkswagen Virtus", idx: 1.15 },
  versa: { label: "Nissan Versa", idx: 1.1 },
  city: { label: "Honda City", idx: 1.15 },
  corolla: { label: "Toyota Corolla", idx: 1.9 },
  civic: { label: "Honda Civic", idx: 1.95 },
  jetta: { label: "Volkswagen Jetta", idx: 1.85 },
  cruze: { label: "Chevrolet Cruze", idx: 1.75 },
  sentra: { label: "Nissan Sentra", idx: 1.7 },
  creta: { label: "Hyundai Creta", idx: 1.5 },
  tracker: { label: "Chevrolet Tracker", idx: 1.6 },
  "t cross": { label: "Volkswagen T-Cross", idx: 1.55 },
  kicks: { label: "Nissan Kicks", idx: 1.5 },
  renegade: { label: "Jeep Renegade", idx: 1.45 },
  compass: { label: "Jeep Compass", idx: 2.1 },
  "hr v": { label: "Honda HR-V", idx: 1.6 },
  nivus: { label: "Volkswagen Nivus", idx: 1.4 },
  "corolla cross": { label: "Toyota Corolla Cross", idx: 2.0 },
  hilux: { label: "Toyota Hilux", idx: 2.6 },
  s10: { label: "Chevrolet S10", idx: 2.5 },
  ranger: { label: "Ford Ranger", idx: 2.5 },
  amarok: { label: "Volkswagen Amarok", idx: 2.55 },
};

function buildCarCost(idx) {
  return {
    parcela: roundTo(700 * idx, 50),
    combustivel: roundTo(260 * idx, 10),
    seguro: roundTo(140 * Math.sqrt(idx), 10),
    manutencao: roundTo(110 * idx, 10),
    ipva: roundTo(85 * idx, 10),
    estacionamento: roundTo(80 * Math.sqrt(idx), 10),
  };
}

const CAR_COST = Object.fromEntries(Object.entries(CAR_DEFS).map(([k, d]) => [k, buildCarCost(d.idx)]));
CAR_COST.default = { parcela: 900, combustivel: 350, seguro: 220, manutencao: 150, ipva: 120, estacionamento: 100 };
const CAR_LABELS = Object.fromEntries(Object.entries(CAR_DEFS).map(([k, d]) => [k, d.label]));

const MOTO_DEFS = {
  pop: { label: "Yamaha Pop 110i", idx: 0.65 },
  biz: { label: "Honda Biz", idx: 0.7 },
  "cg 160": { label: "Honda CG 160", idx: 0.9 },
  "fan 160": { label: "Honda Fan 160", idx: 0.85 },
  factor: { label: "Yamaha Factor 150", idx: 0.95 },
  ybr: { label: "Yamaha YBR 150", idx: 0.9 },
  "cb twister": { label: "Honda CB Twister", idx: 1.0 },
  bros: { label: "Honda Bros 160", idx: 1.15 },
  fazer: { label: "Yamaha Fazer 250", idx: 1.3 },
  "xre 300": { label: "Honda XRE 300", idx: 1.4 },
  "cb 300": { label: "Honda CB 300F Twister", idx: 1.5 },
  pcx: { label: "Honda PCX", idx: 1.6 },
  nmax: { label: "Yamaha NMAX", idx: 1.7 },
  "mt 03": { label: "Yamaha MT-03", idx: 2.1 },
  ninja: { label: "Kawasaki Ninja 400", idx: 2.3 },
  "cb 500": { label: "Honda CB 500F", idx: 2.5 },
  burgman: { label: "Suzuki Burgman", idx: 2.0 },
  "xtz crosser": { label: "Yamaha XTZ Crosser", idx: 1.35 },
};

function buildMotoCost(idx) {
  return {
    parcela: roundTo(400 * idx, 50),
    combustivel: roundTo(150 * idx, 10),
    seguro: roundTo(70 * Math.sqrt(idx), 5),
    manutencao: roundTo(65 * idx, 5),
    ipva: roundTo(35 * idx, 5),
  };
}

const MOTO_COST = Object.fromEntries(Object.entries(MOTO_DEFS).map(([k, d]) => [k, buildMotoCost(d.idx)]));
MOTO_COST.default = { parcela: 450, combustivel: 180, seguro: 90, manutencao: 80, ipva: 40 };
const MOTO_LABELS = Object.fromEntries(Object.entries(MOTO_DEFS).map(([k, d]) => [k, d.label]));

const LOOKUP_CONFIG = {
  moradia: { triggerKey: "cidade", dataset: CITY_COST, labels: CITY_LABELS, noun: "cidade" },
  viagem: { triggerKey: "destino", dataset: TRAVEL_COST, labels: TRAVEL_LABELS, noun: "destino" },
  carro: { triggerKey: "modelo", dataset: CAR_COST, labels: CAR_LABELS, noun: "modelo" },
  moto: { triggerKey: "modelo", dataset: MOTO_COST, labels: MOTO_LABELS, noun: "modelo" },
};

function lookupOptions(config) {
  return Object.keys(config.dataset)
    .filter((k) => k !== "default")
    .map((k) => ({ key: k, label: config.labels[k] || k }))
    .sort((a, b) => a.label.localeCompare(b.label, "pt-BR"));
}

const INTERESTS = [
  { id: "emergencia", label: "Guardar para emergência", bucket: "Reserva de emergência", pct: 10 },
  { id: "investir", label: "Investir", bucket: "Investimentos", pct: 10 },
  { id: "viajar", label: "Viajar mais", bucket: "Fundo de viagem", pct: 7 },
  { id: "dividas", label: "Quitar dívidas", bucket: "Quitar dívidas", pct: 15 },
  { id: "comprar", label: "Comprar algo grande", bucket: "Meta: comprar algo grande", pct: 8 },
];

const INTEREST_TIPS = {
  emergencia: "Uma boa reserva de emergência dá pra cobrir uns 3 a 6 meses dos seus gastos, se algo der errado.",
  investir: "Guardar um pouquinho todo mês já é investir. O importante é criar o hábito.",
  viajar: "Separe um valor fixo todo mês só pra viagem, numa conta à parte. Assim o resto do dinheiro fica intacto.",
  dividas: "Pague primeiro as dívidas com juros mais altos — elas crescem mais rápido se você deixar pra depois.",
  comprar: "Decida quanto custa e em quanto tempo você quer comprar. Divida o valor pelos meses e pronto: sua meta mensal.",
};

/* ------------------------------------------------------------------ */
/*  UI BASE                                                             */
/* ------------------------------------------------------------------ */

function Button({ children, onClick, variant = "primary", full, disabled, type = "button", style }) {
  const [hover, setHover] = useState(false);
  const [active, setActive] = useState(false);
  const base = {
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
    fontWeight: 600, fontSize: 15, borderRadius: 12, padding: "14px 24px",
    border: "none", cursor: disabled ? "not-allowed" : "pointer",
    transition: "transform .15s ease, box-shadow .15s ease, opacity .15s ease",
    width: full ? "100%" : "auto", opacity: disabled ? 0.5 : 1,
    transform: active && !disabled ? "scale(0.98)" : hover && !disabled ? "translateY(-1px)" : "none",
  };
  const variants = {
    primary: { background: c.brand, color: "#fff", boxShadow: hover && !disabled ? "0 10px 22px rgba(14,110,75,0.28)" : "0 2px 6px rgba(14,110,75,0.18)" },
    secondary: { background: c.surface, color: c.brand, border: `1.5px solid ${c.brand}` },
    ghost: { background: "transparent", color: c.textSecondary, border: `1.5px solid ${c.border}` },
    dark: { background: c.brandDark, color: "#fff" },
    gold: { background: c.gold, color: c.brandDark, boxShadow: hover && !disabled ? "0 10px 22px rgba(217,160,44,0.3)" : "0 2px 6px rgba(217,160,44,0.2)" },
  };
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setActive(false); }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      style={{ ...base, ...variants[variant], ...style }}
    >
      {children}
    </button>
  );
}

function SectionTitle({ eyebrow, title, subtitle, center, light }) {
  return (
    <div style={{ textAlign: center ? "center" : "left", maxWidth: 640, margin: center ? "0 auto" : 0 }}>
      {eyebrow && <div style={{ color: light ? c.gold : c.brand, fontWeight: 600, fontSize: 14, marginBottom: 8 }}>{eyebrow}</div>}
      <h2 style={{ fontSize: "clamp(26px,4vw,34px)", fontWeight: 700, color: light ? "#fff" : c.text, margin: 0, letterSpacing: "-0.02em" }}>{title}</h2>
      {subtitle && <p style={{ color: light ? "rgba(255,255,255,0.75)" : c.textSecondary, fontSize: 16, marginTop: 12, lineHeight: 1.6 }}>{subtitle}</p>}
    </div>
  );
}

function Header({ page, onNav, mobileOpen, setMobileOpen }) {
  const links = [
    { label: "Início", id: null },
    { label: "Calculadoras", id: "secao-calculadoras" },
    { label: "Como funciona", id: "secao-como-funciona" },
    { label: "Sobre", id: "secao-sobre" },
  ];
  return (
    <header style={{ position: "sticky", top: 0, zIndex: 40, background: "rgba(245,241,230,0.92)", backdropFilter: "blur(8px)", borderBottom: `1px solid ${c.border}` }}>
      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={() => onNav(null)} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer" }}>
          <span style={{ width: 34, height: 34, borderRadius: 9, background: c.brand, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Wallet size={18} color="#fff" />
          </span>
          <span style={{ fontWeight: 800, fontSize: 18, color: c.brandDark }}>Quanto Custa?</span>
        </button>

        <nav className="hidden md:flex" style={{ gap: 32 }}>
          {links.map((l) => (
            <a key={l.label} href="#" onClick={(e) => { e.preventDefault(); onNav(l.id); }} style={{ color: c.textSecondary, fontSize: 15, textDecoration: "none", fontWeight: 500 }}>{l.label}</a>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button onClick={() => onNav("secao-calculadoras")}>Começar agora</Button>
        </div>

        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)} style={{ background: "none", border: "none", cursor: "pointer" }}>
          {mobileOpen ? <X size={26} color={c.text} /> : <Menu size={26} color={c.text} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden" style={{ borderTop: `1px solid ${c.border}`, background: c.surface, padding: "16px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
          {links.map((l) => (
            <a key={l.label} href="#" onClick={(e) => { e.preventDefault(); onNav(l.id); }} style={{ color: c.text, fontSize: 16, textDecoration: "none", fontWeight: 500 }}>{l.label}</a>
          ))}
          <Button full onClick={() => onNav("secao-calculadoras")}>Começar agora</Button>
        </div>
      )}
    </header>
  );
}

function SearchBar({ onSearch }) {
  const [value, setValue] = useState("");
  const [notFound, setNotFound] = useState(false);
  const examples = ["Quanto custa morar sozinho?", "Quanto custa ter um carro?", "Quanto custa viajar?"];

  const submit = (text) => {
    const q = text.toLowerCase();
    const match = CATEGORIES.find((cat) => q.includes(cat.title.toLowerCase()) || cat.title.toLowerCase().includes(q));
    if (match) { setNotFound(false); onSearch(match.id); }
    else setNotFound(true);
  };

  return (
    <div style={{ maxWidth: 620, margin: "0 auto" }}>
      <form
        onSubmit={(e) => { e.preventDefault(); if (value.trim()) submit(value); }}
        style={{ display: "flex", gap: 10, background: c.surface, border: `1.5px solid ${c.border}`, borderRadius: 16, padding: 8, boxShadow: "0 10px 26px rgba(10,46,34,0.08)" }}
      >
        <div style={{ display: "flex", alignItems: "center", flex: 1, gap: 10, padding: "8px 12px" }}>
          <Search size={20} color={c.textSecondary} />
          <input
            value={value}
            onChange={(e) => { setValue(e.target.value); setNotFound(false); }}
            placeholder="O que você quer descobrir?"
            style={{ border: "none", outline: "none", fontSize: 16, width: "100%", background: "transparent", color: c.text }}
          />
        </div>
        <Button type="submit">🔍 Descobrir</Button>
      </form>

      {notFound && (
        <p style={{ color: c.coral, fontSize: 14, marginTop: 10, textAlign: "center" }}>
          Ainda não temos essa calculadora — mas em breve teremos mais opções!
        </p>
      )}

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginTop: 16 }}>
        {examples.map((ex) => (
          <button
            key={ex}
            onClick={() => { setValue(ex); submit(ex); }}
            style={{ fontSize: 13, color: c.brand, background: c.brandLight, border: "none", borderRadius: 999, padding: "7px 14px", cursor: "pointer", fontWeight: 500 }}
          >
            {ex}
          </button>
        ))}
      </div>
    </div>
  );
}

function CategoryCard({ cat, onClick }) {
  const [hover, setHover] = useState(false);
  const Icon = cat.icon;
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        textAlign: "left", background: c.surface, borderRadius: 16, padding: 22,
        border: `1.5px solid ${hover ? c.brand : c.border}`,
        boxShadow: hover ? "0 12px 26px rgba(10,46,34,0.1)" : "0 1px 3px rgba(10,46,34,0.05)",
        cursor: "pointer", transition: "all .18s ease",
        transform: hover ? "translateY(-3px)" : "none",
        display: "flex", flexDirection: "column", gap: 14, width: "100%",
      }}
    >
      <span style={{ width: 46, height: 46, borderRadius: 12, background: c.brandLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon size={22} color={c.brand} />
      </span>
      <div>
        <h3 style={{ fontSize: 17, fontWeight: 600, color: c.text, margin: 0 }}>{cat.title}</h3>
        <p style={{ fontSize: 14, color: c.textSecondary, marginTop: 6, lineHeight: 1.5 }}>{cat.desc}</p>
      </div>
      <span style={{ display: "flex", alignItems: "center", gap: 6, color: c.brand, fontSize: 14, fontWeight: 600, marginTop: "auto" }}>
        Calcular <ArrowRight size={15} style={{ transform: hover ? "translateX(4px)" : "none", transition: "transform .18s ease" }} />
      </span>
    </button>
  );
}

function InputField({ field, value, error, onChange }) {
  const [focus, setFocus] = useState(false);
  return (
    <div>
      <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: c.text, marginBottom: 8 }}>{field.label}</label>
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        border: `1.5px solid ${error ? c.coral : focus ? c.brand : c.border}`,
        borderRadius: 12, padding: "12px 14px", background: c.surface,
        transition: "border-color .15s ease",
      }}>
        {field.money && <span style={{ color: c.textSecondary, fontWeight: 600, fontSize: 15 }}>R$</span>}
        <input
          type={field.type === "number" ? "text" : "text"}
          inputMode={field.type === "number" ? "numeric" : "text"}
          pattern={field.type === "number" ? "[0-9]*" : undefined}
          value={value}
          placeholder={field.placeholder || (field.money ? "0" : "")}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          onChange={(e) => onChange(field.key, field.type === "number" ? e.target.value.replace(/[^0-9]/g, "") : e.target.value)}
          style={{ border: "none", outline: "none", width: "100%", fontSize: 16, color: c.text, background: "transparent" }}
        />
      </div>
      {error && (
        <span style={{ display: "flex", alignItems: "center", gap: 6, color: c.coral, fontSize: 13, marginTop: 6 }}>
          <AlertCircle size={14} /> {error}
        </span>
      )}
    </div>
  );
}

function OptionRow({ option, onSelect }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onMouseDown={(e) => { e.preventDefault(); onSelect(option); }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "block", width: "100%", textAlign: "left", padding: "10px 14px",
        background: hover ? c.brandLight : "transparent", border: "none", cursor: "pointer",
        fontSize: 14.5, color: c.text, transition: "background .1s ease",
      }}
    >
      {option.label}
    </button>
  );
}

function AutocompleteField({ field, value, error, onChange, options, onSelect }) {
  const [focus, setFocus] = useState(false);
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = normalize(value);
    const list = !q ? options : options.filter((o) => normalize(o.label).startsWith(q) || normalize(o.key).startsWith(q));
    return list.slice(0, 6);
  }, [value, options]);

  return (
    <div style={{ position: "relative" }}>
      <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: c.text, marginBottom: 8 }}>{field.label}</label>
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        border: `1.5px solid ${error ? c.coral : focus ? c.brand : c.border}`,
        borderRadius: 12, padding: "12px 14px", background: c.surface,
        transition: "border-color .15s ease",
      }}>
        <input
          type="text"
          value={value}
          placeholder={field.placeholder}
          onFocus={() => { setFocus(true); setOpen(true); }}
          onBlur={() => { setFocus(false); setTimeout(() => setOpen(false), 120); }}
          onChange={(e) => { onChange(field.key, e.target.value); setOpen(true); }}
          style={{ border: "none", outline: "none", width: "100%", fontSize: 16, color: c.text, background: "transparent" }}
        />
        <Search size={16} color={c.textSecondary} />
      </div>
      {error && (
        <span style={{ display: "flex", alignItems: "center", gap: 6, color: c.coral, fontSize: 13, marginTop: 6 }}>
          <AlertCircle size={14} /> {error}
        </span>
      )}
      {open && filtered.length > 0 && (
        <div style={{
          position: "absolute", top: "100%", left: 0, right: 0, marginTop: 6, zIndex: 30,
          background: c.surface, border: `1px solid ${c.border}`, borderRadius: 12,
          boxShadow: "0 14px 28px rgba(10,46,34,0.14)", overflow: "hidden",
        }}>
          {filtered.map((o) => (
            <OptionRow key={o.key} option={o} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  );
}

function EstimateBox({ noun, triggerValue, searching, note, onClick }) {
  return (
    <div style={{ background: c.brandLight, border: `1px dashed ${c.brand}`, borderRadius: 12, padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <p style={{ margin: 0, fontSize: 13.5, color: c.brandDark, fontWeight: 500 }}>
          Escolha uma sugestão acima ou clique para estimar com o que você digitou.
        </p>
        <Button variant="secondary" onClick={onClick} disabled={!triggerValue?.trim() || searching} style={{ padding: "9px 16px", fontSize: 13.5 }}>
          {searching ? (
            <><Loader2 size={15} style={{ animation: "qc-spin 0.8s linear infinite" }} /> Pesquisando...</>
          ) : (
            <><Search size={15} /> Estimar valores</>
          )}
        </Button>
      </div>
      {note && (
        <p style={{ margin: 0, fontSize: 13, color: note.ok ? c.brand : c.gold, fontWeight: 500 }}>
          {note.ok ? "✅ " : "ℹ️ "}{note.text}
        </p>
      )}
    </div>
  );
}

function CountUp({ target }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let raf, start;
    const duration = 700;
    const step = (t) => {
      if (!start) start = t;
      const p = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return <>{money(val)}</>;
}

function BarFill({ pct, delay, color }) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setW(pct), 100 + delay);
    return () => clearTimeout(t);
  }, [pct, delay]);
  return <div style={{ height: "100%", width: `${Math.min(w, 100)}%`, background: color || c.brand, borderRadius: 999, transition: "width .7s cubic-bezier(0.22,1,0.36,1)" }} />;
}

function ExpenseBreakdown({ items, total, color }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {items.map((item, i) => {
        const pct = total ? (item.value / total) * 100 : 0;
        return (
          <div key={item.label}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 6 }}>
              <span style={{ color: c.text, fontWeight: 500 }}>{item.label}</span>
              <span style={{ color: c.textSecondary }}>{money(item.value)}</span>
            </div>
            <div style={{ height: 8, borderRadius: 999, background: c.brandLight, overflow: "hidden" }}>
              <BarFill pct={pct} delay={i * 70} color={color} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function InsightCard({ icon: Icon, title, children, tone = "gold" }) {
  const map = {
    gold: { bg: c.goldBg, fg: c.gold },
    brand: { bg: c.brandLight, fg: c.brand },
    coral: { bg: c.coralBg, fg: c.coral },
  };
  const { bg, fg } = map[tone];
  return (
    <div style={{ background: bg, borderRadius: 14, padding: 20, display: "flex", gap: 14, alignItems: "flex-start" }}>
      <span style={{ width: 36, height: 36, borderRadius: 10, background: c.surface, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon size={18} color={fg} />
      </span>
      <div>
        <p style={{ fontWeight: 600, color: c.text, margin: 0, fontSize: 15 }}>{title}</p>
        <p style={{ color: c.textSecondary, margin: "4px 0 0", fontSize: 14, lineHeight: 1.5 }}>{children}</p>
      </div>
    </div>
  );
}

function Footer({ onNav }) {
  const links = [
    { label: "Início", id: null },
    { label: "Calculadoras", id: "secao-calculadoras" },
    { label: "Como funciona", id: "secao-como-funciona" },
    { label: "Sobre", id: "secao-sobre" },
    { label: "Termos de uso", id: null },
    { label: "Privacidade", id: null },
  ];
  return (
    <footer style={{ borderTop: `1px solid ${c.border}`, background: c.surface, marginTop: 80 }}>
      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "48px 24px 32px", display: "flex", flexDirection: "column", gap: 32 }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 32 }}>
          <div style={{ maxWidth: 320 }}>
            <button onClick={() => onNav(null)} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
              <span style={{ width: 30, height: 30, borderRadius: 8, background: c.brand, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Wallet size={16} color="#fff" />
              </span>
              <span style={{ fontWeight: 800, fontSize: 17, color: c.brandDark }}>Quanto Custa?</span>
            </button>
            <p style={{ color: c.textSecondary, fontSize: 14, marginTop: 12, lineHeight: 1.6 }}>
              Uma forma simples de entender melhor os custos das suas decisões — e o que sobra no fim do mês.
            </p>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px 32px" }}>
            {links.map((l) => (
              <a key={l.label} href="#" onClick={(e) => { e.preventDefault(); onNav(l.id); }} style={{ color: c.textSecondary, fontSize: 14, textDecoration: "none" }}>{l.label}</a>
            ))}
          </div>
        </div>
        <div style={{ borderTop: `1px solid ${c.border}`, paddingTop: 20, display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 8 }}>
          <p style={{ color: c.textSecondary, fontSize: 13, margin: 0 }}>© 2026 Quanto Custa? Todos os direitos reservados.</p>
          <p style={{ color: c.textSecondary, fontSize: 13, margin: 0 }}>Desenvolvido por Thomás</p>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/*  BUDGET PLANNER — renda + interesses => plano personalizado         */
/* ------------------------------------------------------------------ */

function Stepper({ value, onChange, min = 1, max = 36 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        style={{ width: 38, height: 38, borderRadius: 10, border: `1.5px solid ${c.border}`, background: c.surface, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Minus size={16} color={c.text} />
      </button>
      <span style={{ fontSize: 18, fontWeight: 700, color: c.text, minWidth: 70, textAlign: "center" }}>{value} {value === 1 ? "mês" : "meses"}</span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        style={{ width: 38, height: 38, borderRadius: 10, border: `1.5px solid ${c.border}`, background: c.surface, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Plus size={16} color={c.text} />
      </button>
    </div>
  );
}

function SegmentFill({ pct, color, delay }) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setW(pct), 100 + delay);
    return () => clearTimeout(t);
  }, [pct, delay]);
  return <div style={{ height: "100%", width: `${Math.min(Math.max(w, 0), 100)}%`, background: color, transition: "width .7s cubic-bezier(0.22,1,0.36,1)" }} />;
}

function StackedBar({ segments }) {
  return (
    <div>
      <div style={{ display: "flex", height: 18, borderRadius: 999, overflow: "hidden", background: c.bgAlt, border: `1px solid ${c.border}` }}>
        {segments.map((s, i) => (
          <div key={s.label} style={{ width: `${s.pct}%`, height: "100%" }}>
            <SegmentFill pct={100} color={s.color} delay={i * 90} />
          </div>
        ))}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 20px", marginTop: 14 }}>
        {segments.map((s) => (
          <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ width: 9, height: 9, borderRadius: 999, background: s.color, flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: c.textSecondary }}>{s.label}: <strong style={{ color: c.text }}>{money(s.value)}</strong></span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BudgetPlanner({ total, isMensal }) {
  const [open, setOpen] = useState(false);
  const [salary, setSalary] = useState("");
  const [months, setMonths] = useState(6);
  const [interests, setInterests] = useState([]);

  const salaryNum = Number(salary) || 0;

  const plan = useMemo(() => {
    if (salaryNum <= 0) return null;
    const monthlyCommitment = isMensal ? total : (months > 0 ? total / months : 0);

    // cada interesse marcado vira uma fatia própria do orçamento — por isso o plano
    // muda de verdade conforme você seleciona (sem interesses, usamos a poupança padrão de 20%)
    const buckets = interests.length > 0
      ? INTERESTS.filter((it) => interests.includes(it.id)).map((it) => ({
          label: it.bucket,
          value: (salaryNum * it.pct) / 100,
        }))
      : [{ label: "Poupança recomendada", value: salaryNum * 0.2 }];

    const bucketsTotal = buckets.reduce((s, b) => s + b.value, 0);
    const committedTotal = monthlyCommitment + bucketsTotal;
    const free = Math.max(salaryNum - committedTotal, 0);
    const overCommitted = committedTotal > salaryNum;
    const pct = Math.min((committedTotal / salaryNum) * 100, 999);

    let status = "saudavel";
    if (pct > 90) status = "alerta";
    else if (pct > 70) status = "atencao";

    return { monthlyCommitment, buckets, bucketsTotal, free, status, pct, overCommitted, committedTotal };
  }, [salaryNum, total, isMensal, months, interests]);

  const toggleInterest = (id) => {
    setInterests((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
  };

  const STATUS_COPY = {
    saudavel: { icon: CheckCircle2, tone: "brand", title: "Tá tranquilo 👍", text: "Esse valor cabe direitinho no que você ganha." },
    atencao: { icon: AlertTriangle, tone: "gold", title: "Fica de olho 👀", text: "Esse valor toma um pedaço grande do que você ganha." },
    alerta: { icon: AlertOctagon, tone: "coral", title: "Pesa bastante ⚠️", text: "Esse valor é quase tudo (ou mais) do que você ganha por mês." },
  };

  return (
    <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 18, padding: 28, marginTop: 24 }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: 0 }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ width: 40, height: 40, borderRadius: 11, background: c.brandLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <PiggyBank size={20} color={c.brand} />
          </span>
          <div style={{ textAlign: "left" }}>
            <h3 style={{ fontSize: 17, fontWeight: 600, color: c.text, margin: 0 }}>Isso é muito pra você?</h3>
            <p style={{ fontSize: 13.5, color: c.textSecondary, margin: "2px 0 0" }}>Diz quanto você ganha e a gente te mostra.</p>
          </div>
        </div>
        <ChevronRight size={20} color={c.textSecondary} style={{ transform: open ? "rotate(90deg)" : "none", transition: "transform .2s ease" }} />
      </button>

      {open && (
        <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 22 }}>
          <div>
            <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: c.text, marginBottom: 8 }}>1. Quanto você ganha por mês?</label>
            <div style={{ display: "flex", alignItems: "center", gap: 8, border: `1.5px solid ${c.border}`, borderRadius: 12, padding: "12px 14px" }}>
              <span style={{ color: c.textSecondary, fontWeight: 600, fontSize: 15 }}>R$</span>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={salary}
                placeholder="Ex: 1500"
                onChange={(e) => setSalary(e.target.value.replace(/[^0-9]/g, ""))}
                style={{ border: "none", outline: "none", width: "100%", fontSize: 16, color: c.text, background: "transparent" }}
              />
            </div>
          </div>

          {!isMensal && (
            <div>
              <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: c.text, marginBottom: 8 }}>Em quantos meses você quer juntar esse dinheiro?</label>
              <Stepper value={months} onChange={setMonths} />
            </div>
          )}

          <div>
            <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: c.text, marginBottom: 4 }}>2. (Opcional) No que você quer usar o que sobra?</label>
            <p style={{ fontSize: 13, color: c.textSecondary, margin: "0 0 10px" }}>Toque nas opções que fazem sentido pra você — dá pra escolher mais de uma.</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {INTERESTS.map((it) => {
                const active = interests.includes(it.id);
                return (
                  <button
                    key={it.id}
                    onClick={() => toggleInterest(it.id)}
                    style={{
                      fontSize: 13.5, fontWeight: 500, borderRadius: 999, padding: "8px 14px", cursor: "pointer",
                      border: `1.5px solid ${active ? c.brand : c.border}`,
                      background: active ? c.brand : c.surface, color: active ? "#fff" : c.textSecondary,
                      transition: "all .15s ease",
                    }}
                  >
                    {active ? "✓ " : ""}{it.label}
                  </button>
                );
              })}
            </div>
          </div>

          {salaryNum > 0 && plan && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20, paddingTop: 6, borderTop: `1px dashed ${c.border}` }}>
              <InsightCard icon={STATUS_COPY[plan.status].icon} title={STATUS_COPY[plan.status].title} tone={STATUS_COPY[plan.status].tone}>
                {STATUS_COPY[plan.status].text} No total, isso usa <strong>{plan.pct.toFixed(0)} de cada 100 reais</strong> que você ganha.
              </InsightCard>

              <div>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
                  <h4 style={{ fontSize: 15, fontWeight: 600, color: c.text, margin: 0 }}>Veja numa barrinha</h4>
                  <span style={{ fontSize: 14, fontWeight: 700, color: plan.overCommitted ? c.coral : c.brand }}>
                    {plan.overCommitted
                      ? `Falta ${money(plan.committedTotal - salaryNum)}`
                      : `Sobra ${money(plan.free)}`}
                  </span>
                </div>

                {plan.overCommitted ? (
                  <StackedBar
                    segments={[
                      { label: isMensal ? "Esse gasto" : "Guardar pra meta", value: plan.monthlyCommitment, pct: (plan.monthlyCommitment / plan.committedTotal) * 100, color: c.brand },
                      { label: interests.length > 0 ? "Seus planos" : "Poupança", value: plan.bucketsTotal, pct: (plan.bucketsTotal / plan.committedTotal) * 100, color: c.gold },
                    ]}
                  />
                ) : (
                  <StackedBar
                    segments={[
                      { label: isMensal ? "Esse gasto" : "Guardar pra meta", value: plan.monthlyCommitment, pct: (plan.monthlyCommitment / salaryNum) * 100, color: c.brand },
                      { label: interests.length > 0 ? "Seus planos" : "Poupança", value: plan.bucketsTotal, pct: (plan.bucketsTotal / salaryNum) * 100, color: c.gold },
                      { label: "Livre", value: plan.free, pct: (plan.free / salaryNum) * 100, color: "#B9CBAE" },
                    ]}
                  />
                )}

                <p style={{ fontSize: 13.5, color: c.textSecondary, marginTop: 14, lineHeight: 1.6 }}>
                  {plan.overCommitted
                    ? "Isso tudo junto passa do que você ganha. Tente desmarcar algum plano ali em cima."
                    : interests.length > 0
                      ? "Dica: marque ou desmarque os planos ali em cima e veja a barra mudar na hora."
                      : "Como você não marcou nenhum plano, guardamos 20% pra poupança. Marque um ali em cima pra ver a diferença."}
                </p>
              </div>

              {interests.length > 0 && (
                <div>
                  <h4 style={{ fontSize: 15, fontWeight: 600, color: c.text, margin: "0 0 12px", display: "flex", alignItems: "center", gap: 8 }}>
                    <Sparkles size={16} color={c.gold} /> Dicas rápidas
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {interests.map((id) => (
                      <div key={id} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                        <span style={{ width: 6, height: 6, borderRadius: 999, background: c.gold, marginTop: 8, flexShrink: 0 }} />
                        <p style={{ margin: 0, fontSize: 14, color: c.textSecondary, lineHeight: 1.5 }}>{INTEREST_TIPS[id]}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGES                                                               */
/* ------------------------------------------------------------------ */

function HomePage({ goCalculator, goSobra }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setVisible(true); }, []);

  return (
    <>
      <section style={{ padding: "72px 24px 56px", textAlign: "center" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(10px)", transition: "opacity .5s ease, transform .5s ease" }}>
          <h1 style={{ fontSize: "clamp(34px,6vw,52px)", fontWeight: 800, color: c.brandDark, letterSpacing: "-0.02em", lineHeight: 1.1, margin: 0 }}>
            Quanto custa, de verdade?
          </h1>
          <p style={{ fontSize: 18, color: c.textSecondary, marginTop: 18, lineHeight: 1.6 }}>
            Descubra quanto você pode gastar por mês e por ano — e o que ainda sobra pra poupar.
          </p>
        </div>
        <div style={{ marginTop: 36 }}>
          <SearchBar onSearch={goCalculator} />
        </div>
      </section>

      <section style={{ maxWidth: 1140, margin: "0 auto", padding: "0 24px 44px" }}>
        <button
          onClick={goSobra}
          style={{
            width: "100%", textAlign: "left", cursor: "pointer", border: "none",
            background: c.brandDark, borderRadius: 20, padding: "26px 28px",
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ width: 48, height: 48, borderRadius: 13, background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <PiggyBank size={24} color={c.gold} />
            </span>
            <div>
              <p style={{ color: c.gold, fontWeight: 700, fontSize: 12.5, margin: 0, letterSpacing: "0.03em" }}>NOVO</p>
              <h3 style={{ fontSize: 19, fontWeight: 700, margin: "3px 0 3px", color: "#fff" }}>Quanto sobra no seu mês?</h3>
              <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 14, margin: 0 }}>Diz quanto você ganha e gasta — a gente mostra o que sobra, na hora.</p>
            </div>
          </div>
          <ArrowRight size={22} color="#fff" style={{ flexShrink: 0 }} />
        </button>
      </section>

      <section id="secao-calculadoras" style={{ maxWidth: 1140, margin: "0 auto", padding: "0 24px 40px", scrollMarginTop: 90 }}>
        <SectionTitle center title="O que você quer calcular?" subtitle="Escolha uma categoria e responda algumas perguntas simples." />
        <div className="grid" style={{ display: "grid", gridTemplateColumns: "repeat(1,1fr)", gap: 18, marginTop: 36 }}>
          {CATEGORIES.map((cat) => (
            <CategoryCard key={cat.id} cat={cat} onClick={() => goCalculator(cat.id)} />
          ))}
        </div>
      </section>

      <section id="secao-como-funciona" style={{ background: c.brandDark, padding: "72px 24px", marginTop: 64, scrollMarginTop: 70 }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <SectionTitle center light title="Como funciona" subtitle="Três passos simples para uma estimativa clara." />
          <div className="steps-grid" style={{ display: "grid", gridTemplateColumns: "repeat(1,1fr)", gap: 28, marginTop: 44 }}>
            {[
              { n: "01", t: "Escolha", d: "Escolha o que você quer calcular." },
              { n: "02", t: "Responda", d: "Informe alguns dados — ou deixe a gente estimar por você." },
              { n: "03", t: "Descubra", d: "Veja uma estimativa mensal e anual, e como ela cabe na sua renda." },
            ].map((s) => (
              <div key={s.n} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 40, fontWeight: 800, color: "rgba(255,255,255,0.18)", marginBottom: 8 }}>{s.n}</div>
                <h3 style={{ fontSize: 19, fontWeight: 600, color: "#fff", margin: 0 }}>{s.t}</h3>
                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 15, marginTop: 8, lineHeight: 1.6 }}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="secao-sobre" style={{ maxWidth: 900, margin: "0 auto", padding: "72px 24px", textAlign: "center", scrollMarginTop: 90 }}>
        <SectionTitle center eyebrow="Sobre" title="Um jeito rápido de saber o que as coisas custam" subtitle="" />
        <p style={{ color: c.textSecondary, fontSize: 16, lineHeight: 1.7, marginTop: 18 }}>
          Criei o Quanto Custa? depois de me pegar fazendo conta de cabeça toda vez que pensava em morar sozinho,
          trocar de carro ou viajar. Em vez de abrir uma planilha, prefiro responder umas perguntas rápidas e já
          ter uma ideia do valor. É basicamente isso: menos achismo, mais clareza — pra você decidir com calma
          antes de gastar.
        </p>
      </section>
    </>
  );
}

function CalculatorPage({ categoryId, goResult, goHome }) {
  const cat = CATEGORIES.find((x) => x.id === categoryId);
  const fields = FIELDS[categoryId];
  const lookup = LOOKUP_CONFIG[categoryId];
  const [data, setData] = useState(() => {
    const init = {};
    fields.forEach((f) => { init[f.key] = f.default !== undefined ? String(f.default) : ""; });
    return init;
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [estimateNote, setEstimateNote] = useState(null);

  const handleChange = (key, value) => {
    setData((d) => ({ ...d, [key]: value }));
    setErrors((er) => ({ ...er, [key]: undefined }));
    if (lookup && key === lookup.triggerKey) setEstimateNote(null);
  };

  const applyEstimate = (values) => {
    setData((d) => {
      const next = { ...d };
      Object.keys(values).forEach((k) => { next[k] = String(values[k]); });
      return next;
    });
    setErrors({});
  };

  const runEstimate = (text, exactKey) => {
    if (!lookup || !text || !text.trim()) return;
    setSearching(true);
    setEstimateNote(null);
    setTimeout(() => {
      const matchKey = exactKey || matchDataset(text, lookup.dataset);
      const values = lookup.dataset[matchKey || "default"];
      applyEstimate(values);
      setEstimateNote(
        matchKey
          ? { ok: true, text: `Estimativas baseadas em médias para "${lookup.labels[matchKey] || text.trim()}". Ajuste os valores abaixo se quiser.` }
          : { ok: false, text: `Não temos dados específicos para "${text.trim()}" — aplicamos uma média geral. Ajuste como preferir.` }
      );
      setSearching(false);
    }, exactKey ? 450 : 700);
  };

  const handleSelectSuggestion = (option) => {
    handleChange(lookup.triggerKey, option.label);
    runEstimate(option.label, option.key);
  };

  const validate = () => {
    const newErrors = {};
    fields.forEach((f) => {
      if (!f.money) return;
      const v = data[f.key];
      if (v === "" || v === null) newErrors[f.key] = "Preencha este campo.";
      else if (isNaN(Number(v)) || Number(v) < 0) newErrors[f.key] = "Digite um valor válido.";
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      goResult(categoryId, data);
    }, 900);
  };

  const Icon = cat.icon;

  return (
    <section style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px 80px" }}>
      <button onClick={goHome} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: c.textSecondary, fontSize: 14, cursor: "pointer", padding: 0, marginBottom: 24 }}>
        <ArrowLeft size={16} /> Voltar
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
        <span style={{ width: 48, height: 48, borderRadius: 13, background: c.brandLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={24} color={c.brand} />
        </span>
        <h1 style={{ fontSize: "clamp(24px,4vw,32px)", fontWeight: 700, color: c.text, margin: 0 }}>Quanto custa {cat.title.toLowerCase()}?</h1>
      </div>
      <p style={{ color: c.textSecondary, fontSize: 16, marginTop: 8, marginBottom: 32 }}>
        Responda algumas perguntas para descobrir uma estimativa {cat.period === "mensal" ? "dos seus gastos mensais" : "do custo total"}.
      </p>

      <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 18, padding: 28, display: "flex", flexDirection: "column", gap: 20 }}>
        {fields.map((f) => {
          const isTrigger = lookup && lookup.triggerKey === f.key;
          return (
            <React.Fragment key={f.key}>
              {isTrigger ? (
                <AutocompleteField
                  field={f}
                  value={data[f.key]}
                  error={errors[f.key]}
                  onChange={handleChange}
                  options={lookupOptions(lookup)}
                  onSelect={handleSelectSuggestion}
                />
              ) : (
                <InputField field={f} value={data[f.key]} error={errors[f.key]} onChange={handleChange} />
              )}
              {isTrigger && (
                <EstimateBox
                  noun={lookup.noun}
                  triggerValue={data[f.key]}
                  searching={searching}
                  note={estimateNote}
                  onClick={() => runEstimate(data[f.key])}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      <div style={{ marginTop: 28 }}>
        <Button full onClick={handleSubmit} disabled={loading}>
          {loading ? (
            <><Loader2 size={18} style={{ animation: "qc-spin 0.8s linear infinite" }} /> Calculando...</>
          ) : (
            <>Calcular meu custo <ArrowRight size={18} /></>
          )}
        </Button>
      </div>
    </section>
  );
}

const CUT_PRESETS = [
  { id: "none", label: "Não cortar", pct: 0 },
  { id: "pouco", label: "Um pouco", pct: 15 },
  { id: "bastante", label: "Bastante", pct: 35 },
];

function CutSimulator({ items, total, isMensal }) {
  const topItems = items.slice(0, 4).filter((i) => i.value > 0);
  const [cuts, setCuts] = useState(() => Object.fromEntries(topItems.map((i) => [i.label, 0])));

  const setCut = (label, pct) => setCuts((cur) => ({ ...cur, [label]: pct }));

  const totalSaved = topItems.reduce((s, i) => s + (i.value * (cuts[i.label] || 0)) / 100, 0);
  const newTotal = Math.max(total - totalSaved, 0);
  const hasCuts = totalSaved > 0;

  if (topItems.length === 0) return null;

  return (
    <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 18, padding: 28, marginTop: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
        <span style={{ width: 40, height: 40, borderRadius: 11, background: c.goldBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Target size={20} color={c.gold} />
        </span>
        <div>
          <h3 style={{ fontSize: 17, fontWeight: 600, color: c.text, margin: 0 }}>Dá pra economizar aqui?</h3>
          <p style={{ fontSize: 13.5, color: c.textSecondary, margin: "2px 0 0" }}>Escolha um botão em cada gasto e veja quanto sobra.</p>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: 22 }}>
        {topItems.map((item) => {
          const pct = cuts[item.label] || 0;
          const savedHere = (item.value * pct) / 100;
          return (
            <div key={item.label}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 8, gap: 8, flexWrap: "wrap" }}>
                <span style={{ color: c.text, fontWeight: 500 }}>{item.label} <span style={{ color: c.textSecondary, fontWeight: 400 }}>({money(item.value)})</span></span>
                {pct > 0 && (
                  <span style={{ color: c.brand, fontWeight: 600 }}>economiza {money(savedHere)}</span>
                )}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {CUT_PRESETS.map((preset) => {
                  const active = pct === preset.pct;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => setCut(item.label, preset.pct)}
                      style={{
                        flex: 1, fontSize: 13.5, fontWeight: 500, borderRadius: 10, padding: "10px 8px", cursor: "pointer",
                        border: `1.5px solid ${active ? c.brand : c.border}`,
                        background: active ? c.brand : c.surface, color: active ? "#fff" : c.textSecondary,
                        transition: "all .15s ease",
                      }}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{
        marginTop: 24, padding: 18, borderRadius: 14, background: hasCuts ? c.brandLight : c.bgAlt,
        display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10,
      }}>
        <div>
          <p style={{ margin: 0, fontSize: 13.5, color: c.textSecondary }}>Ficaria assim</p>
          <p style={{ margin: "2px 0 0", fontSize: 22, fontWeight: 700, color: c.text }}>{money(newTotal)}{isMensal ? "/mês" : ""}</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ margin: 0, fontSize: 13.5, color: c.textSecondary }}>Você guardaria</p>
          <p style={{ margin: "2px 0 0", fontSize: 22, fontWeight: 700, color: hasCuts ? c.brand : c.textSecondary }}>
            {money(totalSaved)}{isMensal ? "/mês" : ""}
          </p>
        </div>
      </div>
    </div>
  );
}

const SOBRA_EXPENSE_FIELDS = [
  { key: "moradia", label: "Moradia (aluguel ou o que você ajuda em casa)", default: 500 },
  { key: "alimentacao", label: "Comida", default: 400 },
  { key: "transporte", label: "Transporte", default: 200 },
  { key: "outros", label: "Outras coisas (lazer, roupa, streaming...)", default: 150 },
];

const RATIO_PRESETS = [
  { id: "pouco", label: "Um pouco", ratio: 0.25 },
  { id: "metade", label: "Metade", ratio: 0.5 },
  { id: "tudo", label: "Tudo", ratio: 1 },
];

function SobraPage({ goHome }) {
  const [values, setValues] = useState(() => {
    const init = { renda: "1500" };
    SOBRA_EXPENSE_FIELDS.forEach((f) => { init[f.key] = String(f.default); });
    return init;
  });
  const [goalName, setGoalName] = useState("");
  const [goalPrice, setGoalPrice] = useState("");
  const [goalRatio, setGoalRatio] = useState(0.5);

  const setField = (k, v) => setValues((cur) => ({ ...cur, [k]: v }));

  const renda = Number(values.renda) || 0;
  const gastos = SOBRA_EXPENSE_FIELDS.reduce((s, f) => s + (Number(values[f.key]) || 0), 0);
  const sobra = renda - gastos;
  const hasRenda = renda > 0;
  const sobraPct = hasRenda ? (sobra / renda) * 100 : 0;

  let mood = null;
  if (hasRenda) {
    if (sobra <= 0) mood = { emoji: "😟", label: "Não sobra nada", tone: "coral" };
    else if (sobraPct < 15) mood = { emoji: "😐", label: "Sobra pouco", tone: "gold" };
    else mood = { emoji: "🎉", label: "Sobra bastante", tone: "brand" };
  }

  const goalPriceNum = Number(goalPrice) || 0;
  const allocatedToGoal = sobra > 0 ? sobra * goalRatio : 0;
  const reserve = sobra > 0 ? sobra - allocatedToGoal : 0;
  const monthsToGoal = allocatedToGoal > 0 && goalPriceNum > 0 ? Math.ceil(goalPriceNum / allocatedToGoal) : null;

  return (
    <section style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px 80px" }}>
      <button onClick={goHome} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: c.textSecondary, fontSize: 14, cursor: "pointer", padding: 0, marginBottom: 24 }}>
        <ArrowLeft size={16} /> Voltar
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
        <span style={{ width: 48, height: 48, borderRadius: 13, background: c.brandLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <PiggyBank size={24} color={c.brand} />
        </span>
        <h1 style={{ fontSize: "clamp(24px,4vw,32px)", fontWeight: 700, color: c.text, margin: 0 }}>Quanto sobra no seu mês?</h1>
      </div>
      <p style={{ color: c.textSecondary, fontSize: 16, marginTop: 8, marginBottom: 32 }}>
        Conta quanto você ganha e quanto gasta — a gente mostra na hora o que sobra pra você guardar ou usar do seu jeito.
      </p>

      <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 18, padding: 28, display: "flex", flexDirection: "column", gap: 20 }}>
        <InputField
          field={{ key: "renda", label: "Quanto você ganha por mês?", type: "number", placeholder: "Ex: 1500", money: true }}
          value={values.renda}
          onChange={setField}
        />
        {SOBRA_EXPENSE_FIELDS.map((f) => (
          <InputField
            key={f.key}
            field={{ key: f.key, label: f.label, type: "number", money: true }}
            value={values[f.key]}
            onChange={setField}
          />
        ))}
      </div>

      {hasRenda && mood && (
        <>
          <div style={{ background: c.brandDark, borderRadius: 20, padding: "32px 28px", textAlign: "center", color: "#fff", marginTop: 24 }}>
            <div style={{ fontSize: 34, marginBottom: 6 }}>{mood.emoji}</div>
            <p style={{ margin: 0, fontSize: 15, opacity: 0.8 }}>{mood.label}</p>
            <div style={{ fontSize: "clamp(32px,6vw,44px)", fontWeight: 800, marginTop: 6 }}>
              {sobra >= 0 ? <CountUp target={sobra} /> : `- ${money(Math.abs(sobra))}`}
            </div>
            <p style={{ margin: "4px 0 0", fontSize: 14, opacity: 0.75 }}>{sobra >= 0 ? "livres por mês" : "a mais do que você ganha"}</p>
          </div>

          <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 18, padding: 28, marginTop: 20 }}>
            <h4 style={{ fontSize: 15, fontWeight: 600, color: c.text, margin: "0 0 12px" }}>Pra onde vai o que você ganha</h4>
            {sobra >= 0 ? (
              <StackedBar
                segments={[
                  { label: "Gastos", value: gastos, pct: (gastos / renda) * 100, color: c.brand },
                  { label: "Sobra", value: sobra, pct: (sobra / renda) * 100, color: "#B9CBAE" },
                ]}
              />
            ) : (
              <StackedBar segments={[{ label: "Gastos (mais do que você ganha)", value: gastos, pct: 100, color: c.coral }]} />
            )}
          </div>

          <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 18, padding: 28, marginTop: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
              <span style={{ width: 40, height: 40, borderRadius: 11, background: c.goldBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Target size={20} color={c.gold} />
              </span>
              <div>
                <h4 style={{ fontSize: 15, fontWeight: 600, color: c.text, margin: 0 }}>Quer guardar pra alguma coisa?</h4>
                <p style={{ fontSize: 13, color: c.textSecondary, margin: "2px 0 0" }}>A gente calcula em quantos meses você consegue.</p>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <InputField
                field={{ key: "goalName", label: "O que você quer comprar?", type: "text", placeholder: "Ex: tênis novo, celular, bicicleta...", money: false }}
                value={goalName}
                onChange={(_, v) => setGoalName(v)}
              />
              <InputField
                field={{ key: "goalPrice", label: "Quanto custa?", type: "number", placeholder: "Ex: 600", money: true }}
                value={goalPrice}
                onChange={(_, v) => setGoalPrice(v)}
              />
            </div>

            {sobra > 0 && goalPriceNum > 0 && (
              <div style={{ marginTop: 18 }}>
                <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: c.text, marginBottom: 4 }}>
                  Quanto dessa sobra vai pra essa meta?
                </label>
                <p style={{ fontSize: 13, color: c.textSecondary, margin: "0 0 10px" }}>
                  O resto fica guardado numa reserva, pra imprevistos.
                </p>
                <div style={{ display: "flex", gap: 8 }}>
                  {RATIO_PRESETS.map((preset) => {
                    const active = goalRatio === preset.ratio;
                    return (
                      <button
                        key={preset.id}
                        onClick={() => setGoalRatio(preset.ratio)}
                        style={{
                          flex: 1, fontSize: 13.5, fontWeight: 500, borderRadius: 10, padding: "10px 8px", cursor: "pointer",
                          border: `1.5px solid ${active ? c.brand : c.border}`,
                          background: active ? c.brand : c.surface, color: active ? "#fff" : c.textSecondary,
                          transition: "all .15s ease",
                        }}
                      >
                        {preset.label}<br />
                        <span style={{ fontSize: 11.5, opacity: 0.85 }}>{money(sobra * preset.ratio)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {monthsToGoal && (
              <div style={{ marginTop: 18, padding: 16, borderRadius: 12, background: c.brandLight }}>
                <p style={{ margin: 0, fontSize: 14.5, color: c.brandDark, lineHeight: 1.6 }}>
                  Separando <strong>{money(allocatedToGoal)}</strong> por mês pra essa meta, você compra {goalName ? <strong>{goalName}</strong> : "isso"} em mais ou menos{" "}
                  <strong>{monthsToGoal} {monthsToGoal === 1 ? "mês" : "meses"}</strong>! 🎯
                  {reserve > 0 && <> E ainda guarda <strong>{money(reserve)}</strong> por mês numa reserva, pra emergências. 🐷</>}
                </p>
              </div>
            )}
            {sobra <= 0 && goalPriceNum > 0 && (
              <div style={{ marginTop: 18, padding: 16, borderRadius: 12, background: c.coralBg }}>
                <p style={{ margin: 0, fontSize: 14.5, color: c.coral, lineHeight: 1.6 }}>
                  Enquanto não sobrar nada, fica difícil guardar. Tente diminuir algum gasto ali em cima e veja o plano mudar.
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}

function ResultPage({ categoryId, data, goCalculator, goHome }) {
  const cat = CATEGORIES.find((x) => x.id === categoryId);
  const fields = FIELDS[categoryId];
  const [shared, setShared] = useState(false);

  const items = fields
    .filter((f) => f.money)
    .map((f) => ({ label: f.label.replace(/\s*\(.*?\)/, ""), value: Number(data[f.key]) || 0 }))
    .sort((a, b) => b.value - a.value);

  const total = items.reduce((s, i) => s + i.value, 0);
  const annual = total * 12;
  const isMensal = cat.period === "mensal";
  const top = items[0];
  const topPct = total ? Math.round((top.value / total) * 100) : 0;

  const handleShare = () => {
    const summary = `${cat.title}: ${money(total)}${isMensal ? " por mês" : ""} — via Quanto Custa?`;
    if (navigator.clipboard) navigator.clipboard.writeText(summary).catch(() => {});
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  return (
    <section style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px 80px" }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <p style={{ color: c.brand, fontWeight: 600, fontSize: 14, margin: 0 }}>{cat.title}</p>
        <h1 style={{ fontSize: "clamp(26px,4vw,34px)", fontWeight: 700, color: c.text, margin: "4px 0 0" }}>Sua estimativa</h1>
      </div>

      <div style={{ background: c.brandDark, borderRadius: 20, padding: "40px 28px", textAlign: "center", color: "#fff" }}>
        <div style={{ fontSize: "clamp(38px,7vw,56px)", fontWeight: 800, letterSpacing: "-0.02em" }}>
          <CountUp target={total} />
        </div>
        <p style={{ opacity: 0.75, fontSize: 15, marginTop: 6 }}>{isMensal ? "por mês" : "custo total estimado"}</p>
        {isMensal && (
          <div style={{ marginTop: 18, paddingTop: 18, borderTop: "1px solid rgba(255,255,255,0.15)" }}>
            <p style={{ fontSize: 22, fontWeight: 700, color: "#F2D98A", margin: 0 }}>
              <CountUp target={annual} />
            </p>
            <p style={{ opacity: 0.75, fontSize: 14, marginTop: 4 }}>por ano</p>
          </div>
        )}
      </div>

      <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 18, padding: 28, marginTop: 24 }}>
        <h3 style={{ fontSize: 17, fontWeight: 600, color: c.text, margin: "0 0 18px" }}>Distribuição dos gastos</h3>
        <ExpenseBreakdown items={items} total={total} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 24 }}>
        <InsightCard icon={Lightbulb} title="Seu maior gasto" tone="gold">
          {top.label} representa aproximadamente {topPct}% do {isMensal ? "seu total mensal" : "custo total"}.
        </InsightCard>
        <InsightCard icon={BarChart3} title={isMensal ? "Custo anual" : "Resumo"} tone="brand">
          {isMensal
            ? <>Você gastaria aproximadamente <strong>{money(annual)}</strong> por ano.</>
            : <>O valor considera {items.length} itens informados no formulário.</>}
        </InsightCard>
      </div>

      <BudgetPlanner total={total} isMensal={isMensal} />

      <CutSimulator items={items} total={total} isMensal={isMensal} />

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 32 }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Button variant="secondary" onClick={() => goCalculator(categoryId)} style={{ flex: 1 }}>
            <ArrowLeft size={16} /> Refazer cálculo
          </Button>
          <Button variant="ghost" onClick={handleShare} style={{ flex: 1 }}>
            {shared ? <><Check size={16} /> Copiado!</> : <><Share2 size={16} /> Compartilhar</>}
          </Button>
        </div>
        <Button full variant="dark" onClick={goHome}>Nova calculadora</Button>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  APP ROOT                                                            */
/* ------------------------------------------------------------------ */

export default function App() {
  const [page, setPage] = useState("home"); // home | calculator | result | sobra
  const [activeCategory, setActiveCategory] = useState(null);
  const [resultData, setResultData] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pendingScroll = useRef(null);

  const goHome = () => { setPage("home"); setMobileOpen(false); };
  const goCalculator = (id) => { setActiveCategory(id); setPage("calculator"); setMobileOpen(false); };
  const goResult = (id, data) => { setActiveCategory(id); setResultData(data); setPage("result"); };
  const goSobra = () => { setPage("sobra"); setMobileOpen(false); };

  const scrollToSection = (id) => {
    if (!id) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const onNav = (id) => {
    setMobileOpen(false);
    if (page === "home") {
      requestAnimationFrame(() => scrollToSection(id));
    } else {
      pendingScroll.current = id;
      setPage("home");
    }
  };

  useEffect(() => {
    const t = setTimeout(() => {
      if (page === "home" && pendingScroll.current !== null) {
        const id = pendingScroll.current;
        pendingScroll.current = null;
        scrollToSection(id);
        return;
      }
      if (pendingScroll.current === null) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      pendingScroll.current = null;
    }, 60);
    return () => clearTimeout(t);
  }, [page, activeCategory]);

  return (
    <div
      style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif", background: c.bg, minHeight: "100vh", color: c.text }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        input::placeholder { color: ${c.textSecondary}; opacity: 0.7; }
        input, textarea { scroll-margin-top: 96px; }
        @keyframes qc-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (min-width: 640px) {
          .grid { grid-template-columns: repeat(2,1fr) !important; }
          .steps-grid { grid-template-columns: repeat(3,1fr) !important; }
        }
        @media (min-width: 1024px) {
          .grid { grid-template-columns: repeat(3,1fr) !important; }
          .hidden.md\\:flex { display: flex !important; }
          .hidden.md\\:block { display: block !important; }
          .md\\:hidden { display: none !important; }
        }
        @media (min-width: 1280px) {
          .grid { grid-template-columns: repeat(4,1fr) !important; }
        }
        .hidden { display: none; }
      `}</style>

      <Header page={page} onNav={onNav} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {page === "home" && <HomePage goCalculator={goCalculator} goSobra={goSobra} />}
      {page === "calculator" && <CalculatorPage categoryId={activeCategory} goResult={goResult} goHome={goHome} />}
      {page === "result" && <ResultPage categoryId={activeCategory} data={resultData} goCalculator={goCalculator} goHome={goHome} />}
      {page === "sobra" && <SobraPage goHome={goHome} />}

      <Footer onNav={onNav} />
    </div>
  );
}
