import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import api from '../../services/api';

import Container from '../../components/Container';

import { Loading, Owner, IssueList } from './styles';

export default class Repository extends Component{

  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        repository: PropTypes.string,
      }),
    }).isRequired,
  };

  state = {
    repository: {},
    issues: [],
    loading: true,
  };

  async componentDidMount() {
    const { match } = this.props;

    const repoName = decodeURIComponent(match.params.repository);



    const [repository, issues] = await Promise.all([   //array para pegar as informaçoes do repositorio e dos issues
      api.get(`/repos/${repoName}`),
      api.get(`/repos/${repoName}/issues`,
      {
        params: {
          state: 'open',  //puxa apenas as essues que nao foram resolvidas, que estao em aberto(open)
          per_page: 5,   //puxa apenas 5 essues
        },
      }),
    ]);

    this.setState({
      repository: repository.data,
      issues: issues.data,
      loading: false,
    });


  }

  render(){
    const { repository, issues, loading } = this.state;

    if(loading){
      return <Loading>Carregando</Loading>
    }

    return (
    <Container>
      <Owner>
        <Link to="/">Voltar aos repositorios</Link>
        <img src={repository.owner.avatar_url} alt={repository.owner.login}/>
        <h1>{repository.name}</h1>
        <p>{repository.description}</p>
      </Owner>

      <IssueList>
        {issues.map(issue => (
          <li key={String(issue.id)}>
            <img src={issue.user.avatar_url} alt={issue.user.login}/>
            <div>
              <strong>
                <a href={issue.html_url}>{issue.title}</a>
                {issue.labels.map(label =>(
                  <span key={String(label.id)}>{label.name}</span>
                ))}

              </strong>
            </div>
          </li>
        ))}
      </IssueList>
    </Container>
    );

  }

}
