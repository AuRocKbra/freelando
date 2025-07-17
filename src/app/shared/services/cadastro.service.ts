import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface CadastroData{
  areaAtuacao?:string;
  nivelExperiencia?:string;
  nomeCompleto?:string;
  estado?:string;
  cidade?:string;
  email?:string;
  senha?:string;
}

@Injectable({
  providedIn: 'root'
})
export class CadastroService {
  private cadastroDataSubject = new BehaviorSubject<CadastroData>({});
  cadastroData$ = this.cadastroDataSubject.asObservable();
  constructor() { 
    const savedData = localStorage.getItem('cadastroData');
    if(savedData){
      this.cadastroDataSubject.next(JSON.parse(savedData));
    }
  }
}
