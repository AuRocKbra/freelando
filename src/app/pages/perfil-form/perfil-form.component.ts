
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ButtonComponent } from '../../shared/components/button/button.component';
import { Habilidade } from '../../shared/models/habilidade.interface';
import { ChipComponent } from '../../shared/components/chip/chip.component';
import { CadastroService } from '../../shared/services/cadastro.service';


@Component({
  selector: 'app-perfil-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    ChipComponent
  ],
  templateUrl: './perfil-form.component.html',
  styleUrls: ['./perfil-form.component.scss']
})
export class PerfilFormComponent implements OnInit{
  perfilForm!: FormGroup;
  fotoPreview: string | ArrayBuffer | undefined;

  habilidades: Habilidade[] = [
    { nome: 'Fullstack', selecionada: false },
    { nome: 'Front-end', selecionada: false },
    { nome: 'React', selecionada: false },
    { nome: 'Angular', selecionada: false }
  ];

  niveisIdioma: string[] = [
    'Básico',
    'Intermediário',
    'Avançado',
    'Fluente',
    'Nativo'
  ];

  idiomas: string[] = [
    'Português',
    'Inglês',
    'Espanhol'
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private cadastroService: CadastroService
  ){}
  
  ngOnInit(): void {
      this.inicializarFormulario();
  }

  onAnterior(): void {
    this.salvarDadosAtuais();
    this.router.navigate(['/cadastro/dados-pessoais']);
  }

  onProximo(): void {
    this.salvarDadosAtuais();
    this.router.navigate(['/cadastro/confirmacao']);
  }

  private inicializarFormulario():void{
    this.perfilForm = this.fb.group({
      foto:[''],
      resumo:[''],
      habilitadesSelecionadas:[[]],
      idiomas:this.fb.array([]),
      portfolio:[''],
      linkedin:['']
    });
  }

  private salvarDadosAtuais():void{
    const formValue = this.perfilForm.value;
    this.cadastroService.updateCadastroData({
      foto: this.fotoPreview,
      resumo: formValue.resumo,
      habilidadesSelecionadas: formValue.habilidadesSelecionadas,
      idiomas:[],
      portfolio: formValue.portfolio,
      linkedin: formValue.linkedin
    });
  }
}
