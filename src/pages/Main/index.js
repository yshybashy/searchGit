import React,  { Component } from 'react';

import {FaGithubAlt, FaPlus, FaSpinner} from 'react-icons/fa';
import { Link } from 'react-router-dom';

import api from '../../services/api';

import Container from '../../components/Container';
import { Form, SubmitButton, List } from './styles';

export default class Main extends Component{
  state = {
    newRepo: '',
    repositories: [], //array pra armazenar todos os repositorios do usuario
    loading: false, //gatilho para ofuscar o botao de adicionar repositorio
  };

  //Carregar os dados do localStorage
  componentDidMount(){
    const repositories = localStorage.getItem('repositories');

    if (repositories) {
      this.setState({ repositories: JSON.parse(repositories) }); //pega o conteudo do localStorage e seta dentro do estado convertendo de json pra array
    }
  }
  // Salvar os dados do localStorage
  componentDidUpdate(_, prevState) {
    const { repositories } = this.state; // desistruturaçao

    if(prevState.repositories !== repositories) {
      localStorage.setItem('repositories', JSON.stringify(repositories)); //salva no localStorage e converte array pra json
    }
  }

  handleInputChange = e => { // responsavel por pegar oque o usuario digitou
    this.setState({ newRepo: e.target.value})
  }

  handleSubmit = async e => {   //onde sera jogado oque o usuario digitou
    e.preventDefault();

    this.setState({ loading: true}); //seta o loading como true

    const { newRepo, repositories } = this.state; //desistruturaçao do estado, faz referencia ao estado newRepo

    const response = await api.get(`/repos/${newRepo}`);

    const data = { //objeto data
      name: response.data.full_name, //atributo do git que sera armazenado
    };

    this.setState({
      repositories: [...repositories, data], //faz adicao de um novo repositorio no array, mantendo oque ja estavam ali
      newRepo: '', //limpa o estado newRepo, para que nao seja adicionado duas vezes.
      loading: false,
    });
  }

  render(){
    const { newRepo, loading, repositories } = this.state; //desestruturaçao que faz referencia aos estados

    return (
      <Container>
        <h1>
          <FaGithubAlt/>
          Repositórios
        </h1>

        <Form onSubmit={this.handleSubmit}>
          <input
          type="text"
          placeholder="Adicionar repositorios"
          value={newRepo}
          onChange={this.handleInputChange}
          />

          <SubmitButton loading={loading}>
            {loading ? ( //condiçao que verifica se o loading é true ou false
              <FaSpinner color = "#FFF" size ={14}/>
            ) : (
              <FaPlus color="#FFF" size={14} />
            )}
          </SubmitButton>

        </Form>

        <List>
          {repositories.map(repository => (
            <li key ={repository.name}>
              <span>{repository.name}</span>
              <Link to={`/repository/${ encodeURIComponent(repository.name)}`}>Detalhes</Link>
            </li>
          ))}
        </List>
      </Container>
     )
  }

};
