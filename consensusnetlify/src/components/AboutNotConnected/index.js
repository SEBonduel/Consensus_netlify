import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import "./aboutNotConnected.css";
import DropdownAboutNotConnected from '../DropdownAboutNotConnected';

const AboutNotConnected = (props) => {

    const [userSession] = useState(null);

    const [email] = useState("");
    const [password] = useState("");
    const [btn, setBtn] = useState(false);

    useEffect(() => {
        if (password.length > 5 && email !== ""){
            setBtn(true);
        } else if (btn) {
            setBtn(false);
        }
    }, [password, email, btn])

    return userSession !== null ? 
        (<div className="loading"><div className="d-flex align-items-center">
        <strong>Loading ...</strong>
        <div className="spinner-border ms-auto" role="status" aria-hidden="true"></div>
      </div></div>)
    : 
    (<div className="about-connected-content">          
    <header className="header">
        
        <nav className="navbar-global">
            <div className="app-title">
                <h1 className='consensus-title'>ConsensUs</h1><style>@import url('https://fonts.googleapis.com/css2?family=Palanquin+Dark:wght@400;500;700&display=swap');</style>
                <div className="navbar-subtitle">
                <NavLink className="home-link-nav" to="/">Accueil</NavLink>
                <NavLink className="about-link-nav" to="aboutNotConnected">A propos</NavLink>
                <NavLink className="help-link-nav" to="helpNotConnected">Aide</NavLink>
                <NavLink className="login-link-nav" to="login">Connexion</NavLink>
                </div>
            </div>
        </nav>
    </header>
    <div className="subtitle-and-choose-lang">
      <h1 className='slogan'>À propos</h1>
      <DropdownAboutNotConnected/>         
      </div>

  <div className="about-project">
    <span className='about-project-title'><strong>Le Projet</strong></span>
    <div className='about-project-content'>cnhqjzekbfjqklnjk</div>
  </div>

  <div className="about-ERPI">
    <span className='about-ERPI-title'><strong>Le laboratoire ERPI</strong></span>
    <div className='about-ERPI-content'>Le laboratoire ERPI (Équipe de Recherche sur les Processus Innovatifs) est un laboratoire de recherche situé à l'ENSGSI (École Nationale Supérieure en Génie des Systèmes et de l'Innovation) à Nancy, en France. Le laboratoire ERPI se concentre sur les processus innovants, l'ingénierie de l'innovation et la gestion de l'innovation. Les recherches menées dans ce laboratoire sont axées sur l'analyse des processus d'innovation dans divers secteurs industriels, tels que la santé, l'énergie, l'aérospatiale et l'automobile, ainsi que sur le développement de méthodologies et d'outils pour améliorer l'efficacité et l'efficience des processus d'innovation. Les chercheurs du laboratoire ERPI travaillent en étroite collaboration avec des entreprises, des universités et des institutions publiques pour mener des projets de recherche appliquée et transférer les résultats de recherche vers l'industrie. Le laboratoire ERPI est reconnu pour son expertise dans le domaine de l'ingénierie de l'innovation et est considéré comme un leader.</div>
  </div>

  <div className="about-ENSGSI">
    <span className='about-ENSGSI-title'><strong>L'ENSGSI</strong></span>
    <div className='about-ENSGSI-content'>L'École Nationale Supérieure en Génie des Systèmes et de l'Innovation (ENSGSI) est une grande école d'ingénieurs située à Nancy, en France. L'ENSGSI propose une formation pluridisciplinaire axée sur l'innovation et la créativité, avec des spécialisations dans les domaines de la conception et du management de projets, des systèmes industriels, des systèmes d'information, de la logistique et de la supply chain, et des énergies renouvelables.L'école a pour objectif de former des ingénieurs capables d'appréhender les enjeux technologiques, économiques et sociétaux actuels, et de proposer des solutions innovantes pour répondre aux défis de demain. L'ENSGSI met l'accent sur la pratique et l'expérience professionnelle, avec des stages et des projets en entreprise dès la première année de formation.L'ENSGSI fait partie de l'Université de Lorraine et est accréditée par la Commission des Titres d'Ingénieur (CTI). Elle compte environ 800 étudiants et 80 enseignants-chercheurs, et est reconnue pour son excellence académique et sa forte orientation professionnelle.</div>
  </div>

  <div className="about-univ">
    <span className='about-univ-title'><strong>L'université de lorraine</strong></span>
    <div className='about-univ-content'>L'Université de Lorraine est une université française pluridisciplinaire située dans la région Grand Est. Elle a été créée en 2012 par la fusion de quatre établissements universitaires. L'université compte aujourd'hui plus de 58 000 étudiants et propose des formations dans tous les domaines, allant de la médecine aux sciences humaines, en passant par les sciences de l'ingénieur et les sciences exactes. L'Université de Lorraine est reconnue pour son excellence académique, sa forte orientation professionnelle et ses partenariats avec l'industrie. Elle est également engagée dans la recherche, avec plus de 80 laboratoires et centres de recherche, et participe à des projets internationaux pour favoriser la mobilité étudiante et la coopération scientifique.</div>
  </div>

  <div className="about-team">
    <span className='about-team-title'><strong>L'équipe</strong></span>
    <div className='about-team-content'>frhuukijsrfoliuhrqlhi</div>
  </div>
  
</div>
)
}

export default AboutNotConnected;
