import { promises as fs, constants } from "fs";
import fetch from "node-fetch";
import { Command } from "commander";

const FILE_PATH = "./restaurant_week_brasilia_2025.json";
const API_URL = "https://api.maitredigital.com.br/v2/events/256/registrations?page=1&perPage=200&order=created_desc&agg=true";

// Tipos para opções de filtro
type MealOption = "almoço" | "jantar" | "ambos";
type MenuTypeOption = number[]; // Tipos de menu disponíveis (1 a 4)

// Interface para opções de filtro
interface FilterOptions {
  mealType: MealOption;
  menuTypes: MenuTypeOption;
  count: number;
  forceApiFetch: boolean;
}

// Mapeamento de tipos de refeição para IDs de período
const MEAL_TYPE_TO_PERIOD_ID: Record<MealOption, number | number[]> = {
  almoço: 1,
  jantar: 2,
  ambos: [1, 2],
};

// Função para verificar se arquivo existe
async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

// Função para ler JSON de um arquivo local
async function readLocalJSON(): Promise<unknown> {
  try {
    const data = await fs.readFile(FILE_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Erro ao ler o arquivo local:", error);
    return { result: [] };
  }
}

// Função para buscar JSON de uma URL
async function fetchJSONFromURL(): Promise<unknown> {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`Erro ao buscar dados: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar dados da URL:", error);
    return { result: [] };
  }
}

// Função para usar cache ou buscar da API
async function fetchAndSaveCache(): Promise<unknown> {
  const response = await fetchJSONFromURL();
  await fs.writeFile(FILE_PATH, JSON.stringify(response), "utf-8");
  return response;
}

// Função para escolher restaurantes aleatórios com base nas opções de filtro
function getRandomRestaurants(response: any, options: FilterOptions): string[] {
  const { mealType, menuTypes, count } = options;
  const restaurants: any[] = response.result || [];

  if (restaurants.length === 0) return [];

  // Filtrar por tipo de refeição (almoço/jantar)
  const periodIds = Array.isArray(MEAL_TYPE_TO_PERIOD_ID[mealType])
    ? (MEAL_TYPE_TO_PERIOD_ID[mealType] as number[])
    : [MEAL_TYPE_TO_PERIOD_ID[mealType] as number];

  const filtered = restaurants
    .filter((item: any) => Array.isArray(item.periods) && item.periods.some((period: any) => periodIds.includes(period.id)))
    // Filtrar por tipos de menu
    .filter((item: any) => menuTypes.includes(item.menuType.id))
    // Randomizar
    .sort(() => 0.5 - Math.random())
    .map(
      (item: any) =>
        `${item.restaurant.name} - ${item.menuType.label} [https://maitredigital.com.br/brasiliarestaurantweek/restaurante/${item.id}]`,
    );

  return filtered.slice(0, count);
}

// Configuração da interface de linha de comando
const program = new Command();

program
  .name("restaurant-selector")
  .description("Seletor aleatório de restaurantes para a Restaurant Week")
  .version("1.0.0")
  .option("-m, --meal <tipo>", "Tipo de refeição: almoço, jantar ou ambos", "ambos")
  .option(
    "-t, --menu-types <tipos>",
    "Tipos de menu (1-4, separados por vírgula) 1: Menu RW, 2: Menu +Plus, 3: Menu Premium, 4: Menu Diamond",
    "1,2,3,4",
  )
  .option("-c, --count <número>", "Número de restaurantes a serem sugeridos", "5")
  .option("-f, --force-api", "Forçar requisição a API e ignorar arquivo de cache", false)
  .addHelpText(
    "after",
    `
Exemplos:
  $ node restaurant-selector.js --meal jantar --menu-types 3,4 --count 3
  $ node restaurant-selector.js -m almoço -t 1,2 -c 5
  $ node restaurant-selector.js --force-api -m ambos -c 10
  `,
  );

// Exemplo de uso
(async () => {
  program.parse(process.argv);
  const opts = program.opts();

  // Processar opções da linha de comando
  const mealType = (opts.meal as string) || "ambos";
  const menuTypesString = (opts.menuTypes as string) || "1,2,3,4";

  const options: FilterOptions = {
    mealType: mealType as MealOption,
    menuTypes: menuTypesString
      .split(",")
      .map((n: string) => parseInt(n, 10))
      .filter((n: number) => n >= 1 && n <= 4),
    count: parseInt(opts.count as string, 10) || 5,
    forceApiFetch: !!opts.forceApi,
  };

  // Verificar se as opções são válidas
  if (!["almoço", "jantar", "ambos"].includes(options.mealType)) {
    console.error("Erro: Tipo de refeição deve ser 'almoço', 'jantar' ou 'ambos'");
    process.exit(1);
  }

  if (options.menuTypes.length === 0) {
    console.error("Erro: Pelo menos um tipo de menu válido (1-4) deve ser especificado");
    process.exit(1);
  }

  if (isNaN(options.count) || options.count < 1) {
    console.error("Erro: O número de restaurantes deve ser um número positivo");
    process.exit(1);
  }

  // Buscar dados da fonte apropriada
  const cacheFileExists = await fileExists(FILE_PATH);
  const shouldFetch = !cacheFileExists || options.forceApiFetch;
  const restaurants = shouldFetch ? await fetchAndSaveCache() : await readLocalJSON();
  const randomRestaurants = getRandomRestaurants(restaurants, options);

  // Exibir resultados
  console.log(`\nSugestões do Universo:`);
  console.log(`Refeição: ${options.mealType}`);
  console.log(`Tipos de menu: ${options.menuTypes.join(", ")}`);
  console.log(`Fonte de dados: ${shouldFetch ? "API online" : "Arquivo local"}`);
  console.log("\nRestaurantes sugeridos:");

  if (randomRestaurants.length === 0) {
    console.log("Nenhum restaurante encontrado com os critérios especificados.");
  } else {
    randomRestaurants.forEach((restaurant, index) => {
      console.log(`${index + 1}. ${restaurant}`);
    });
  }
})();
