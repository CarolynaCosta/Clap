import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FilmeService } from '../services/filme.service';
import { register } from 'swiper/element/bundle';
import { debounceTime, Subject } from 'rxjs';

register();

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, DatePipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomePage {
  movies: any[] = [];
  categorias: string[] = [
    'Comédia',
    'Ação',
    'Romance',
    'Ficção Científica',
    'Drama',
    'Fantasia',
    'Terror',
    'Desenho',
    'Suspense',
  ];
  mostrarFiltro = false;
  busca = '';
  selectedCategoria: string | null = null;

  private buscaSubject = new Subject<string>();

  slideOpts = {
    slidesPerView: 1,
    pagination: true,
    autoplay: { delay: 3000 },
    loop: true,
  };

  constructor(private filmeService: FilmeService) {}

  ngOnInit() {
    this.carregarFilmes();

    // Escuta a digitação e chama a API com debounce (500ms)
    this.buscaSubject.pipe(debounceTime(500)).subscribe((texto) => {
      this.buscarFilmesAPI(texto);
    });
  }

  /** 🔹 Busca filmes padrão (lançamentos) */
  carregarFilmes() {
    this.filmeService.getFilmes().subscribe({
      next: (filmes) => (this.movies = filmes),
      error: (err) => console.error('Erro ao carregar filmes:', err),
    });
  }

  /** 🔹 Controle do modal de filtro */
  abrirFiltro() {
    this.mostrarFiltro = true;
  }

  fecharFiltro() {
    this.mostrarFiltro = false;
  }

  /** 🔹 Seleciona categoria e busca na API */
  selecionarCategoria(categoria: string) {
    this.selectedCategoria = categoria;
    this.fecharFiltro();

    this.filmeService.getFilmesPorCategoria(categoria).subscribe({
      next: (filmes) => (this.movies = filmes),
      error: (err) => console.error('Erro ao carregar categoria:', err),
    });
  }

  /** 🔹 Monitora a digitação e envia pra API */
  onBuscarFilmes() {
    this.buscaSubject.next(this.busca);
  }

  /** 🔹 Faz a busca real na API */
  buscarFilmesAPI(texto: string) {
    if (!texto.trim()) {
      this.carregarFilmes(); // volta aos lançamentos
      return;
    }

    this.filmeService.getFilmesPorBusca(texto).subscribe({
      next: (filmes) => (this.movies = filmes),
      error: (err) => console.error('Erro na busca:', err),
    });
  }

  /** 🔹 Getter de filmes (mantido, mas agora lista já vem filtrada da API) */
  get filmesFiltrados() {
    return this.movies;
  }
}
