import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, AbstractControlOptions, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { Router } from '@angular/router';
import { CadastroService } from '../../shared/services/cadastro.service';
import { BehaviorSubject, Observable, startWith,switchMap,tap,of } from 'rxjs';
import { Cidade, Estado, IbgeService } from '../../shared/services/ibge.service';

export const senhaIguaisValidator: ValidatorFn = (control:AbstractControl): ValidationErrors | null =>{
  const senha = control.get('senha');
  const confirmaSenha = control.get('confirmaSenha');
  console.log(confirmaSenha);
  return senha && confirmaSenha && senha.value === confirmaSenha.value ? null : { senhasDiferentes: true};
};

@Component({
  selector: 'app-dados-pessoais-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent
  ],
  templateUrl: './dados-pessoais-form.component.html',
  styleUrls: ['./dados-pessoais-form.component.scss']
})
export class DadosPessoaisFormComponent implements OnInit{
  dadosPessoaisForm!: FormGroup;
  estado$!:Observable<Estado[]>;
  cidade$!:Observable<Cidade[]>;
  carregandoCidades$ = new BehaviorSubject<boolean>(false);
  constructor(private readonly fb: FormBuilder, 
    private readonly router: Router, 
    private readonly cadastroService:CadastroService,
    private readonly ibgeService:IbgeService){}

  ngOnInit(): void {
    const formOptions: AbstractControlOptions = {
      validators:senhaIguaisValidator
    };
    this.dadosPessoaisForm = this.fb.group({
      nomeCompleto: ['',Validators.required],
      estado:['',Validators.required],
      cidade:['',Validators.required],
      email:['',[Validators.required,Validators.email]],
      senha:['',[Validators.required,Validators.minLength(6)]],
      confirmaSenha:['',Validators.required]
    },formOptions);

    this.carregarEstados();
    this.configurarListenerEstado();
  }

  onAnterior(): void {
    this.salvarDadosAtuais();
    this.router.navigate(['/cadastro/area-atuacao']);
  }

  onProximo(): void {
    if(this.dadosPessoaisForm.valid){
      this.salvarDadosAtuais();
      this.router.navigate(['cadastro/confirmacao']);
    }else{
      this.dadosPessoaisForm.markAllAsTouched();
    }
  }

  private salvarDadosAtuais(){
    const formValue = this.dadosPessoaisForm.value;
    this.cadastroService.updateCadastroData({
      nomeCompleto:formValue.nomeCompleto,
      estado:formValue.estado,
      cidade:formValue.cidade,
      email:formValue.email,
      senha:formValue.senha
    });
  }

  private carregarEstados():void{
    this.estado$ = this.ibgeService.obterEstados();
  }

  private configurarListenerEstado():void{
    const estadoControl = this.dadosPessoaisForm.get('estado');
    if(estadoControl){
      this.cidade$ = estadoControl.valueChanges.pipe(
        startWith(''),
        tap(() =>{
          this.resetarCidade();
          this.carregandoCidades$.next(true);
        }),
        switchMap(uf =>{
          if(uf){
            return this.ibgeService.obterCidadesPorEstado(uf).pipe(
              tap(() => this.carregandoCidades$.next(false))
            );
          }
          this.carregandoCidades$.next(false);
          return of([]);
        })
      );
    }
  }

  private resetarCidade():void{
    this.dadosPessoaisForm.get('cidade')?.setValue('');
  }
}
