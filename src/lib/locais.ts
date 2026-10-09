export const locais = [
  {
    id: "areias",
    nome: "Carrinho das Areias",
    tipo: "Carrinho",
    bairro: "Areias do Campeche",
    endereco: "Travessa Caraguatá, 111, Areias do Campeche",
    responsavel: "Eliasar",
    telefone: "48996418726",
  },
  {
    id: "ribeirao",
    nome: "Carrinho do Ribeirão da Ilha",
    tipo: "Carrinho",
    bairro: "Ribeirão da Ilha",
    endereco: "Rodovia Baldicero Filomeno, 4500, Ribeirão da Ilha",
    responsavel: "Yuri Serrão",
    telefone: "48988425163",
  },
  {
    id: "display",
    nome: "Display do Trevo do Erasmo",
    tipo: "Display",
    bairro: "Trevo do Erasmo",
    endereco: "Rodovia Francisco Thomaz dos Santos, 10, Trevo do Erasmo",
    responsavel: "Sarinely",
    telefone: "48992334710",
  },
] as const;

export function enderecoMapa(endereco: string) {
  return `${endereco}, Florianópolis, Santa Catarina, Brasil`;
}

export function formatarTelefone(telefone: string) {
  return `(${telefone.slice(0, 2)}) ${telefone.slice(2, 7)}-${telefone.slice(7)}`;
}