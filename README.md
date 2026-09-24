# Portfólio | Douglas Araújo

Portfólio pessoal de Douglas Araújo, desenvolvedor full-stack. O site reúne projetos, trajetória profissional, formação, habilidades e formas de contato em uma página responsiva.

**[Acessar o portfólio](https://douglas-araujo-portfolio-2026.d-moura250304.chatgpt.site)** · **[GitHub](https://github.com/douglas-ma)** · **[LinkedIn](https://linkedin.com/in/douglas-ma/)**

> A versão hospedada atualmente exige login com ChatGPT. Para visualizar sem autenticação, execute o projeto localmente.

## O que você encontra

| Seção | Conteúdo |
| --- | --- |
| Projetos | Três aplicações acadêmicas e institucionais, com tecnologias e links para os repositórios disponíveis. |
| Sobre Mim | Apresentação profissional e formação na UFAC. |
| Habilidades | Linguagens, frameworks, ferramentas e práticas com ícones e cores no hover. |
| Experiências | Atuação no Web Academy, PROPEG/UFAC, TATE/SEFAZ-AC e CGU/AC. |
| Contatos | E-mail, GitHub, LinkedIn e telefone. |

O cabeçalho alterna entre o nome e a função com efeito de digitação. Pontos caem suavemente no fundo da página. As animações respeitam a preferência do sistema por movimento reduzido.

## Tecnologias

- **HTML5** para a estrutura semântica.
- **CSS3** para o layout responsivo, a paleta e as transições.
- **JavaScript** para a navegação mobile, o texto animado e as partículas em canvas.
- **SVG** para os ícones das habilidades, armazenados no próprio projeto.

O site é estático e não precisa de instalação de dependências para funcionar.

## Executar localmente

```bash
git clone https://github.com/douglas-ma/portifolio.git
cd portifolio
python -m http.server 8765
```

Abra [http://127.0.0.1:8765/](http://127.0.0.1:8765/) no navegador. Também é possível abrir `index.html` diretamente, mas o servidor local reproduz melhor a hospedagem.

## Estrutura do projeto

```text
.
├── assets/icons/       # SVGs das habilidades e licença do Devicon
├── dist/               # Arquivos publicados pelo Sites
├── .openai/hosting.json
├── index.html           # Conteúdo e seções
├── styles.css           # Visual e responsividade
└── script.js            # Interações e animações
```

Edite os arquivos na raiz do projeto. Antes de publicar, sincronize a pasta `dist/`:

```powershell
Copy-Item index.html, styles.css, script.js -Destination dist -Force
New-Item -ItemType Directory -Path dist/assets/icons -Force | Out-Null
Copy-Item assets/icons/* -Destination dist/assets/icons -Force
```

O Sites publica `dist/`, conforme `.openai/hosting.json`.

## Conteúdo e créditos

As informações profissionais foram adaptadas do currículo de Douglas Araújo. O PDF original não faz parte deste repositório.

Os logotipos de tecnologias vêm do [Devicon](https://github.com/devicons/devicon) (MIT); a licença está em [`assets/icons/DEVICON-LICENSE.txt`](assets/icons/DEVICON-LICENSE.txt). Os ícones de SQL, Scrum, Kanban, testes, design responsivo e integração contínua foram criados para este site. As marcas pertencem aos respectivos titulares.

## Contato

- **E-mail:** [d.moura250304@gmail.com](mailto:d.moura250304@gmail.com)
- **GitHub:** [@douglas-ma](https://github.com/douglas-ma)
- **LinkedIn:** [douglas-ma](https://linkedin.com/in/douglas-ma/)
