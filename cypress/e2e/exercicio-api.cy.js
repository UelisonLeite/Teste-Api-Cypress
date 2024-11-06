/// <reference types="cypress" />
import contrato from '../contracts/usuarios.contract'

describe('Testes da Funcionalidade Usuários', () => {


  it('Deve validar contrato de usuários', () => {
    cy.request('usuarios').then(response =>{
      return contrato.validateAsync(response.body)
    })
  });

  it('Deve listar usuários cadastrados', () => {
    cy.request({
      method: 'GET',
      url: '/usuarios'
    }).then((response) =>{
      expect(response.status).equal(200)
      expect(response.body).to.have.property('usuarios')
    })
  });

  it('Deve cadastrar um usuário com sucesso', () => {

    let email = 'Cicrano' + Math.floor(Math.random() * 1000000) + '@qa.com.br'

    cy.cadastrarUsuario('cicrano', email, 'teste', 'true')
    .should((response) =>{
      expect(response.status).equal(201)
      expect(response.body.message).equal('Cadastro realizado com sucesso')
    })
  });

  it('Deve validar um usuário com email inválido', () => {
    cy.request ({
      method: 'POST',
      url: '/usuarios',
      failOnStatusCode: false,
      body: {
        "nome": "Léo Pelé",
        "email": "golcerto@qa.com.br",
        "password": "teste",
        "administrador": "true"
      }
    }).should((response) =>{
      expect(response.status).equal(400)
      expect(response.body.message).equal('Este email já está sendo usado')
      
    })
  });

  it('Deve editar um usuário previamente cadastrado', () => {

    let email = 'Cicrano' + Math.floor(Math.random() * 1000000) + '@qa.com.br'

       cy.cadastrarUsuario('Fulano', email, 'senha', 'true')
      .then(response => {
        let id = response.body._id
        cy.request({
          method: 'PUT',
          url: `/usuarios/${id}`,
          body: {
            "nome": "Léo Pelé",
            "email": email,
            "password": "teste",
            "administrador": "true"
          }
        }).should(response =>{
          expect(response.body.message).to.equal('Registro alterado com sucesso')
        })
      })
    
  });

  it('Deve deletar um usuário previamente cadastrado', () => {
    cy.cadastrarUsuario('usuario a ser deletado', 'usuariodeletado@qa.com.br', 'teste', 'true')
      .then(response => {
        let id = response.body._id
        cy.request({
          method:'DELETE',
          url:`/usuarios/${id}`
        })
      })
   });
});