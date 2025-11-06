import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, forkJoin, switchMap, of } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FilmeService {
  private readonly apiKey = environment.tmdbApiKey;
  private readonly baseUrl = 'https://api.themoviedb.org/3';
  private readonly imgBase = 'https://image.tmdb.org/t/p/w500';
  private readonly backdropBase = 'https://image.tmdb.org/t/p/w780';

  private genreMap: Record<number, string> = {};

  constructor(private http: HttpClient) {}

  /** 🔹 Carrega o mapa de gêneros (id → nome) */
  private carregarGeneros(): Observable<Record<number, string>> {
    // se já estiver carregado, evita nova requisição
    if (Object.keys(this.genreMap).length > 0) {
      return of(this.genreMap);
    }

    return this.http
      .get<any>(`${this.baseUrl}/genre/movie/list?api_key=${this.apiKey}&language=pt-BR`)
      .pipe(
        map((res) => {
          this.genreMap = {};
          res.genres.forEach((g: any) => (this.genreMap[g.id] = g.name));
          return this.genreMap;
        })
      );
  }

  /** 🔹 Filmes em lançamento */
  getFilmes(): Observable<any[]> {
    return forkJoin({
      generos: this.carregarGeneros(),
      filmes: this.http.get<any>(
        `${this.baseUrl}/movie/upcoming?api_key=${this.apiKey}&language=pt-BR`
      ),
    }).pipe(
      map(({ generos, filmes }) =>
        filmes.results.map((filme: any) => ({
          title: filme.title,
          release_date: filme.release_date,
          poster: filme.poster_path
            ? this.imgBase + filme.poster_path
            : 'assets/noimg.jpg',
          backdrop: filme.backdrop_path
            ? this.backdropBase + filme.backdrop_path
            : 'assets/noimg.jpg',
          genre_names: filme.genre_ids.map((id: number) => generos[id]).filter(Boolean),
        }))
      )
    );
  }

  /** 🔹 Filmes populares */
  getFilmesPopulares(): Observable<any[]> {
    return forkJoin({
      generos: this.carregarGeneros(),
      filmes: this.http.get<any>(
        `${this.baseUrl}/movie/popular?api_key=${this.apiKey}&language=pt-BR`
      ),
    }).pipe(
      map(({ generos, filmes }) =>
        filmes.results.map((filme: any) => ({
          title: filme.title,
          release_date: filme.release_date,
          poster: filme.poster_path
            ? this.imgBase + filme.poster_path
            : 'assets/noimg.jpg',
          backdrop: filme.backdrop_path
            ? this.backdropBase + filme.backdrop_path
            : 'assets/noimg.jpg',
          genre_names: filme.genre_ids.map((id: number) => generos[id]).filter(Boolean),
        }))
      )
    );
  }

  /** 🔹 Busca real na API (filmes por texto digitado) */
  getFilmesPorBusca(query: string): Observable<any[]> {
    if (!query.trim()) return this.getFilmes(); // se busca vazia, volta aos lançamentos

    return forkJoin({
      generos: this.carregarGeneros(),
      filmes: this.http.get<any>(
        `${this.baseUrl}/search/movie?api_key=${this.apiKey}&language=pt-BR&query=${encodeURIComponent(query)}`
      ),
    }).pipe(
      map(({ generos, filmes }) =>
        filmes.results.map((filme: any) => ({
          title: filme.title,
          release_date: filme.release_date,
          poster: filme.poster_path
            ? this.imgBase + filme.poster_path
            : 'assets/noimg.jpg',
          backdrop: filme.backdrop_path
            ? this.backdropBase + filme.backdrop_path
            : 'assets/noimg.jpg',
          genre_names: filme.genre_ids.map((id: number) => generos[id]).filter(Boolean),
        }))
      )
    );
  }

  /** 🔹 Filmes por gênero (categoria) */
  getFilmesPorCategoria(genreName: string): Observable<any[]> {
    return this.carregarGeneros().pipe(
      switchMap((generos) => {
        // encontra o ID do gênero pelo nome
        const genreId = Object.entries(generos).find(
          ([, name]) => name.toLowerCase() === genreName.toLowerCase()
        )?.[0];

        if (!genreId) return of([]); // se não achou, retorna vazio

        return this.http
          .get<any>(
            `${this.baseUrl}/discover/movie?api_key=${this.apiKey}&language=pt-BR&with_genres=${genreId}`
          )
          .pipe(
            map((res) =>
              res.results.map((filme: any) => ({
                title: filme.title,
                release_date: filme.release_date,
                poster: filme.poster_path
                  ? this.imgBase + filme.poster_path
                  : 'assets/noimg.jpg',
                backdrop: filme.backdrop_path
                  ? this.backdropBase + filme.backdrop_path
                  : 'assets/noimg.jpg',
                genre_names: filme.genre_ids.map((id: number) => this.genreMap[id]).filter(Boolean),
              }))
            )
          );
      })
    );
  }
}
