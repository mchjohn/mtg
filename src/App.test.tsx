import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import App from './App';

const mockCards = [
  {
    id: '1',
    name: 'Black Lotus',
    imageUrl: 'https://example.com/lotus.jpg',
    manaCost: '{0}',
    type: 'Artifact',
    setName: 'Alpha',
    rarity: 'Rare',
  },
  {
    id: '2',
    name: 'Lightning Bolt',
    imageUrl: 'https://example.com/bolt.jpg',
    manaCost: '{R}',
    type: 'Instant',
    setName: 'Alpha',
    rarity: 'Common',
  },
];

describe('App Component', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('deve renderizar o título e o campo de busca', () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ cards: [] }),
    });

    render(<App />);

    expect(screen.getByText('Buscador de Cartas')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ex.: Black Lotus, Lightning Bolt, Serra Angel')).toBeInTheDocument();
  });

  it('deve carregar e exibir cartas na inicialização', async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ cards: mockCards }),
    });

    render(<App />);

    expect(screen.getByText('Carregando cartas...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Black Lotus')).toBeInTheDocument();
      expect(screen.getByText('Lightning Bolt')).toBeInTheDocument();
    });

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);
    expect(images[0]).toHaveAttribute('src', mockCards[0].imageUrl);
  });

  it('deve filtrar cartas que não possuem imagem', async () => {
    const cardsWithOneMissingImage = [
      ...mockCards,
      { id: '3', name: 'Invisible Stalker', imageUrl: undefined }
    ];

    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ cards: cardsWithOneMissingImage }),
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Black Lotus')).toBeInTheDocument();
    });

    expect(screen.queryByText('Invisible Stalker')).not.toBeInTheDocument();
    expect(screen.getByText(/mostrando 2 com imagem/)).toBeInTheDocument();
  });

  it('deve realizar uma busca quando o formulário é enviado', async () => {
    (fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ cards: [] }),
    });

    render(<App />);

    // Espera o carregamento inicial
    await waitFor(() => {
      expect(screen.queryByText('Carregando cartas...')).not.toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText('Ex.: Black Lotus, Lightning Bolt, Serra Angel');
    const button = screen.getByRole('button', { name: /buscar/i });

    fireEvent.change(input, { target: { value: 'Counterspell' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('name=Counterspell'));
    });
  });

  it('deve exibir mensagem de erro quando a API falha', async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Erro: Falha na API: 500/)).toBeInTheDocument();
    });
  });

  it('deve exibir mensagem quando nenhuma carta é encontrada', async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ cards: [] }),
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Nenhuma carta com imagem encontrada. Tente outro termo de busca.')).toBeInTheDocument();
    });
  });
});
