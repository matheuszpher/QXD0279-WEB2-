interface PokeApiSprites {
  front_default: string | null;
}

interface PokeApiResponse {
  id: number;
  name: string;
  sprites: PokeApiSprites;
}

const POKEDEX_ELEMENT_ID = "pokedex";
const MAX_POKEMON_ID = 1025;
const POKEAPI_BASE_URL = "https://pokeapi.co/api/v2/pokemon";

let nextPokemonId = 1;

function createPokemonCard(index: number): HTMLDivElement {
  const card = document.createElement("div");
  card.className = "pokemon-card";
  card.classList.add(index % 2 === 0 ? "pokemon-card--even" : "pokemon-card--odd");

  const img = document.createElement("img");
  img.alt = `Pokémon #${index}`;

  const name = document.createElement("p");
  name.className = "pokemon-card__name";
  name.textContent = "Carregando...";

  const indexLabel = document.createElement("p");
  indexLabel.className = "pokemon-card__index";
  indexLabel.textContent = `#${index}`;

  card.appendChild(img);
  card.appendChild(name);
  card.appendChild(indexLabel);

  return card;
}

function fillPokemonCard(card: HTMLDivElement, data: PokeApiResponse): void {
  const img = card.querySelector<HTMLImageElement>("img");
  const name = card.querySelector<HTMLParagraphElement>(".pokemon-card__name");

  if (img && data.sprites.front_default) {
    img.src = data.sprites.front_default;
  }

  if (name) {
    name.textContent = data.name;
  }
}

async function fetchPokemon(id: number): Promise<PokeApiResponse> {
  const response = await fetch(`${POKEAPI_BASE_URL}/${id}`);

  if (!response.ok) {
    throw new Error(`Falha ao buscar o pokémon #${id}: ${response.status}`);
  }

  return response.json() as Promise<PokeApiResponse>;
}

async function addNextPokemon(): Promise<void> {
  const pokedex = document.getElementById(POKEDEX_ELEMENT_ID);
  if (!pokedex) {
    return;
  }

  const id = nextPokemonId;
  nextPokemonId = nextPokemonId >= MAX_POKEMON_ID ? 1 : nextPokemonId + 1;

  const card = createPokemonCard(id);
  pokedex.appendChild(card);

  try {
    const data = await fetchPokemon(id);
    fillPokemonCard(card, data);
  } catch (error) {
    const name = card.querySelector<HTMLParagraphElement>(".pokemon-card__name");
    if (name) {
      name.textContent = "Erro ao carregar";
    }
    console.error(error);
  }
}

document.addEventListener("click", () => {
  void addNextPokemon();
});
