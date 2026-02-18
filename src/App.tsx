import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import "./App.css";

type MTGCard = {
  id: string;
  name: string;
  imageUrl?: string;
  manaCost?: string;
  type?: string;
  setName?: string;
  rarity?: string;
  colors?: string[];
  text?: string;
};

type ApiResponse = {
  cards: MTGCard[];
};

const API_URL = "https://api.magicthegathering.io/v1/cards";

function App() {
  const [query, setQuery] = useState("lightning");
  const [inputValue, setInputValue] = useState("lightning");
  const [cards, setCards] = useState<MTGCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const visibleCards = useMemo(() => cards.filter((card) => card.imageUrl), [cards]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const term = inputValue.trim();
    if (!term) {
      return;
    }

    setQuery(term);
  }

  useEffect(() => {
    async function searchCards(searchTerm: string) {
      setLoading(true);
      setError(null);

      try {
        const url = `${API_URL}?name=${encodeURIComponent(searchTerm)}&pageSize=20`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Falha na API: ${response.status}`);
        }

        const data: ApiResponse = await response.json();
        setCards(data.cards ?? []);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Erro inesperado.";
        setError(message);
        setCards([]);
      } finally {
        setLoading(false);
      }
    }

    searchCards(query);
  }, [query]);

  return (
    <main className="app">
      <header className="hero">
        <p className="eyebrow">Magic: The Gathering</p>
        <h1>Buscador de Cartas</h1>
        <p className="subtitle">
          Pesquise cartas em tempo real usando a API pública do MTG.
        </p>
      </header>

      <form className="search" onSubmit={handleSubmit}>
        <label htmlFor="card-search">Nome da carta</label>
        <div className="search-row">
          <input
            id="card-search"
            type="text"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            placeholder="Ex.: Black Lotus, Lightning Bolt, Serra Angel"
          />
          <button type="submit" disabled={loading}>
            {loading ? "Buscando..." : "Buscar"}
          </button>
        </div>
      </form>

      {error && <p className="status error">Erro: {error}</p>}
      {loading && <p className="status">Carregando cartas...</p>}
      {!loading && !error && (
        <p className="status">
          Resultado para <strong>{query}</strong>: {cards.length} carta(s), mostrando{" "}
          {visibleCards.length} com imagem.
        </p>
      )}

      <section className="grid">
        {visibleCards.map((card) => (
          <article key={card.id} className="card">
            <img src={card.imageUrl} alt={card.name} loading="lazy" />
            <div className="card-info">
              <h2>{card.name}</h2>
              <p>{card.type ?? "Tipo não informado"}</p>
              <p>Mana: {card.manaCost ?? "-"}</p>
              <p>Set: {card.setName ?? "-"}</p>
              <p>Raridade: {card.rarity ?? "-"}</p>
            </div>
          </article>
        ))}
      </section>

      {!loading && !error && visibleCards.length === 0 && (
        <p className="status">
          Nenhuma carta com imagem encontrada. Tente outro termo de busca.
        </p>
      )}

      <footer className="footer">
        Dados de cartas por{" "}
        <a href="https://api.magicthegathering.io" target="_blank" rel="noreferrer">
          magicthegathering.io
        </a>
      </footer>
    </main>
  );
}

export default App;
