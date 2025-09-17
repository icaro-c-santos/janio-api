export function slugify(text: string): string {
  return text
    .normalize('NFD') // separa acentos das letras
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .toLowerCase() // deixa tudo minúsculo
    .replace(/[^a-z0-9]+/g, '_') // troca tudo que não for letra/número por "_"
    .replace(/^_+|_+$/g, ''); // remove "_" do início e do fim
}
