# Galeria de imagens — GitHub Pages

Site estático para publicar uma galeria pública de imagens, organizadas por ano e semestre, com visualização e downloads individuais.

## Estrutura

- `index.html`: página principal.
- `style.css`: layout responsivo e estilos.
- `script.js`: carrega o JSON, monta os semestres e cria a galeria.
- `data/semestres.json`: cadastro de semestres, títulos, descrições e caminhos dos arquivos.
- `imagens/2026/1/`: imagens do primeiro semestre de 2026.
- `imagens/2026/2/`: imagens do segundo semestre de 2026.

## Publicar no GitHub Pages

1. Crie um repositório público no GitHub.
2. Envie todos os arquivos e pastas deste projeto para a raiz do repositório.
3. Abra **Settings → Pages**.
4. Em **Build and deployment**, escolha **Deploy from a branch**.
5. Selecione a branch `main` e a pasta `/(root)`, e salve.
6. Aguarde a publicação. O endereço normalmente será `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`.

## Adicionar imagens

1. Envie a imagem para a pasta correspondente, por exemplo `imagens/2026/1/foto-evento.jpg`.
2. Abra `data/semestres.json` e adicione um objeto dentro de `images` do semestre desejado:

```json
{
  "title": "Foto do evento",
  "description": "Registro do evento de abertura.",
  "file": "imagens/2026/1/foto-evento.jpg",
  "thumbnail": "imagens/2026/1/foto-evento.jpg",
  "downloadName": "foto-evento.jpg"
}
```

3. Salve o JSON e aguarde o GitHub Pages atualizar.

**Importante:** o JSON precisa ser válido. Separe os objetos por vírgula, mas não coloque vírgula depois do último objeto do array.

### Miniaturas separadas (opcional)

Para carregar uma miniatura menor, envie também um arquivo como `imagens/2026/1/mini-foto-evento.jpg` e defina `thumbnail` com esse caminho. O campo `file` continua apontando para a imagem original que será baixada.

## Adicionar outro semestre

Acrescente um objeto em `semesters`, por exemplo:

```json
{
  "id": "2027-1",
  "year": 2027,
  "number": 1,
  "title": "2027/1 — Primeiro semestre",
  "images": []
}
```

Crie também a pasta de imagens correspondente. O novo semestre aparecerá automaticamente na navegação.

## Acesso e downloads

Este projeto é público: qualquer pessoa com o endereço pode ver e baixar as imagens. O atributo `download` é solicitado pelo navegador, mas o comportamento pode variar conforme o navegador e a hospedagem.
