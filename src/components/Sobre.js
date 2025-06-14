import React from 'react';
import Carousel from '../components/Carousel';
import Menu from '../components/Menu'; // Importar o Menu
import '../css/sobre.css';

const Sobre = () => {
  return (
    <div className="pagina-container">
      {/* Usar o Menu component correto */}
      <Menu />
      
      {/* Conteúdo da página */}
      <div className="conteudo">
        <div className="home-container">
          <h1>Bem-vindo ao site do consultório odontológico Sorriso Pleno</h1>
          
          <Carousel />
          
          <div className="welcome-text">
            <p>
              <strong>Bem-vindo à inovação no cuidado com seu sorriso! Nossa clínica odontológica é a mais nova no mercado, trazendo a praticidade do autoatendimento para agendamentos e tratamentos de alto padrão, garantindo conforto e excelência para você.</strong>
            </p>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Sobre;