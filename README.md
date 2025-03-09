# 🍽️ Restaurant Week Aleatório

Um seletor aleatório de restaurantes para a Restaurant Week que ajuda a escolher onde comer quando você não consegue decidir!

## 📋 Sobre o Projeto

Este projeto é uma ferramenta de linha de comando que seleciona aleatoriamente restaurantes participantes da Restaurant Week, permitindo filtrar por tipo de refeição (almoço ou jantar) e categoria de menu.

O script conecta-se à API oficial da Restaurant Week ou usa dados armazenados localmente para gerar sugestões aleatórias personalizadas de acordo com suas preferências.

## ✨ Funcionalidades

- Seleção aleatória de restaurantes
- Filtragem por tipo de refeição (almoço, jantar ou ambos)
- Filtragem por tipo de menu (categorias 1-4)
- Escolha do número de sugestões
- Opção de usar dados da API online ou arquivo local
- Interface de linha de comando intuitiva

## 🛠️ Pré-requisitos

Antes de começar, você precisará ter instalado em sua máquina:

- [Node.js](https://nodejs.org/) (versão 16 ou superior)
- [pnpm](https://pnpm.io/) (recomendado) ou npm/yarn

## 📦 Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/carloslimaborges/restaurant-week-aleatorio.git
   cd restaurant-week-aleatorio
   ```

2. Instale as dependências usando pnpm:
   ```bash
   pnpm install
   ```
   
   Ou usando npm:
   ```bash
   npm install
   ```

## 🚀 Como Usar

Execute o script com o comando:

```bash
pnpm start
```

### Opções Disponíveis

- `-m, --meal <tipo>`: Tipo de refeição (almoço, jantar ou ambos) [padrão: "ambos"]
- `-t, --menu-types <tipos>`: Tipos de menu separados por vírgula (1-4) [padrão: "1,2,3,4"]
- `-c, --count <número>`: Número de restaurantes sugeridos [padrão: 5]
- `-l, --local`: Usar arquivo JSON local em vez da API
- `-h, --help`: Exibir ajuda
- `-V, --version`: Exibir versão

### Exemplos

Obter 3 restaurantes aleatórios para jantar com menu tipo 3 e 4:
```bash
pnpm start --meal jantar --menu-types 3,4 --count 3
```

Obter 5 restaurantes para almoço com menu tipo 1 e 2:
```bash
pnpm start -m almoço -t 1,2 -c 5
```

Usar arquivo local de dados e sugerir 10 restaurantes:
```bash
pnpm start --local -m ambos -c 10
```

## 📄 Dados

Por padrão, o script busca dados da API oficial da Restaurant Week. Se você quiser usar dados locais:

1. Salve um arquivo JSON com os dados no formato esperado
2. Configure o caminho no código ou use o argumento `--local`

## 🔧 Personalização

Você pode modificar o caminho do arquivo local e a URL da API no código-fonte conforme necessário.

## 🤝 Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests.

## 📝 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para detalhes.

## 👨‍💻 Autor

Carlos Borges - [@carloslimaborges](https://github.com/carloslimaborges)

---

Feito com ❤️ para amantes de comida que não conseguem decidir onde jantar!
