import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { Nav, NavItem } from "reactstrap";

import { logout } from "../redux/slices/auth";
import { ICourse } from "../redux/slices/courses";
import { reset } from "../redux/slices/user";
import { RootState } from "../redux/store";

import { del } from "../utils/network";

import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import logo from '../assets/images/horizontal_black.png';
import default_profile_pic from '../assets/images/default_profile_pic.jpg';

const coursesManagmentSection = [
  { to: '/courses/create', label: 'Nuevo curso' },
  { to: '/courses/dashboard', label: 'Ver Cursos' },
];


export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user);
  const courses = useSelector((state: RootState) => state.courses.courses);

  const signout = () => {
    del('/auth').then(() => {
      dispatch(logout());
      dispatch(reset());
      navigate('/login');
    });
  };

  return (
    <Nav vertical className='sidebar' style={{
      flexWrap: 'nowrap',
    }}>
      <img src={logo} alt="Proyecto Arima" className='sidebar-header' />
      <div className='sidebar-container' style={{
        overflowY: 'auto',
      }}>
        <div className="w-100 d-flex flex-column gap-3">

          {user?.role === 'TEACHER' && (
            <div className="w-100">
              <span className='sidebar-section-title'>Gestión de Cursos</span>
              {coursesManagmentSection.map((link) => (
                <NavLink end to={link.to} key={link.to} className={({ isActive }) => isActive ? 'sidebar-navlink-active' : 'sidebar-navlink-inactive'}>
                  <NavItem className='sidebar-navlink-item'>
                    <FontAwesomeIcon icon={faCircle} className="sidebar-dot" />
                    <span>{link.label}</span>
                  </NavItem>
                </NavLink>
              ))}

              <span className='sidebar-section-title'>Reportes</span>
              <NavLink to={'/students/survey'} end className={({ isActive }) => isActive ? 'sidebar-navlink-active' : 'sidebar-navlink-inactive'}>
                <NavItem className='sidebar-navlink-item'>
                  <FontAwesomeIcon icon={faCircle} className="sidebar-dot" />
                  <span>Encuestas de satisfacción</span>
                </NavItem>
              </NavLink>

              <NavLink to={'/students/profile'} end className={({ isActive }) => isActive ? 'sidebar-navlink-active' : 'sidebar-navlink-inactive'}>
                <NavItem className='sidebar-navlink-item'>
                  <FontAwesomeIcon icon={faCircle} className="sidebar-dot" />
                  <span>Tipos de Aprendizaje</span>
                </NavItem>
              </NavLink>

            </div>
          )}

          {user?.role === 'STUDENT' && (
            <div className="w-100">
              <span className='sidebar-section-title'>Explorar Cursos</span>
              <NavLink to="/courses/search" end className={({ isActive }) => isActive ? 'sidebar-navlink-active' : 'sidebar-navlink-inactive'}>
                <NavItem className='sidebar-navlink-item'>
                  <FontAwesomeIcon icon={faCircle} className="sidebar-dot" />
                  <span>Buscar curso</span>
                </NavItem>
              </NavLink>
              <NavLink to="/courses/dashboard" end className={({ isActive }) => isActive ? 'sidebar-navlink-active' : 'sidebar-navlink-inactive'}>
                <NavItem className='sidebar-navlink-item'>
                  <FontAwesomeIcon icon={faCircle} className="sidebar-dot" />
                  <span>Ver mis cursos</span>
                </NavItem>
              </NavLink>
            </div>
          )}

          {user?.role && ['STUDENT', 'TEACHER'].includes(user.role) && (
            <div className="w-100">
              <span className='sidebar-section-title'>Mis Cursos</span>
              {courses?.map((course: ICourse) => (
                <NavLink
                  end
                  to={`/courses/${course.id}`}
                  key={course.id}
                  className={({ isActive }) => isActive ? 'sidebar-navlink-active' : 'sidebar-navlink-inactive'}>
                  <NavItem className='sidebar-navlink-item'>
                    <FontAwesomeIcon icon={faCircle} className="sidebar-dot" />
                    <span>{course.title}</span>
                  </NavItem>
                </NavLink>
              ))}
            </div>
          )}

          {(user?.role === 'ADMIN') && (
            <div className="w-100">
              <span className='sidebar-section-title'>Instituciones</span>
              <NavLink to={'/institutes'} end className={({ isActive }) => isActive ? 'sidebar-navlink-active' : 'sidebar-navlink-inactive'}>
                <NavItem className='sidebar-navlink-item'>
                  <FontAwesomeIcon icon={faCircle} className="sidebar-dot" />
                  <span>Instituciones</span>
                </NavItem>
              </NavLink>
              <NavLink to={'/institutes/new'} end className={({ isActive }) => isActive ? 'sidebar-navlink-active' : 'sidebar-navlink-inactive'}>
                <NavItem className='sidebar-navlink-item'>
                  <FontAwesomeIcon icon={faCircle} className="sidebar-dot" />
                  <span>Nueva Institución</span>
                </NavItem>
              </NavLink>
              <span className='sidebar-section-title'>Directivos</span>
              <NavLink to={'/directors'} end className={({ isActive }) => isActive ? 'sidebar-navlink-active' : 'sidebar-navlink-inactive'}>
                <NavItem className='sidebar-navlink-item'>
                  <FontAwesomeIcon icon={faCircle} className="sidebar-dot" />
                  <span>Directivos registrados</span>
                </NavItem>
              </NavLink>
              <NavLink to={'/directors/new'} end className={({ isActive }) => isActive ? 'sidebar-navlink-active' : 'sidebar-navlink-inactive'}>
                <NavItem className='sidebar-navlink-item'>
                  <FontAwesomeIcon icon={faCircle} className="sidebar-dot" />
                  <span>Nuevo Directivo</span>
                </NavItem>
              </NavLink>
            </div>
          )}

          {(user?.role === 'DIRECTOR') && (
            <div className="w-100">
              <span className='sidebar-section-title'>Gestionar usuarios</span>
              <NavLink to={'/students/'} end className={({ isActive }) => isActive ? 'sidebar-navlink-active' : 'sidebar-navlink-inactive'}>
                <NavItem className='sidebar-navlink-item'>
                  <FontAwesomeIcon icon={faCircle} className="sidebar-dot" />
                  <span>Estudiantes</span>
                </NavItem>
              </NavLink>

              <NavLink to={'/teachers/'} end className={({ isActive }) => isActive ? 'sidebar-navlink-active' : 'sidebar-navlink-inactive'}>
                <NavItem className='sidebar-navlink-item'>
                  <FontAwesomeIcon icon={faCircle} className="sidebar-dot" />
                  <span>Docentes</span>
                </NavItem>
              </NavLink>

              <NavLink to={'/users/bulk'} end className={({ isActive }) => isActive ? 'sidebar-navlink-active' : 'sidebar-navlink-inactive'}>
                <NavItem className='sidebar-navlink-item'>
                  <FontAwesomeIcon icon={faCircle} className="sidebar-dot" />
                  <span>Creación masiva de usuarios</span>
                </NavItem>
              </NavLink>

              <span className='sidebar-section-title'>Reportes</span>
              <NavLink to={'/students-survey'} end className={({ isActive }) => isActive ? 'sidebar-navlink-active' : 'sidebar-navlink-inactive'}>
                <NavItem className='sidebar-navlink-item'>
                  <FontAwesomeIcon icon={faCircle} className="sidebar-dot" />
                  <span>Encuestas de satisfacción - Estudiantes</span>
                </NavItem>
              </NavLink>
              <NavLink to={'/teachers-survey'} end className={({ isActive }) => isActive ? 'sidebar-navlink-active' : 'sidebar-navlink-inactive'}>
                <NavItem className='sidebar-navlink-item'>
                  <FontAwesomeIcon icon={faCircle} className="sidebar-dot" />
                  <span>Encuestas de satisfacción - Docentes</span>
                </NavItem>
              </NavLink>

              <NavLink to={'/students/profile'} end className={({ isActive }) => isActive ? 'sidebar-navlink-active' : 'sidebar-navlink-inactive'}>
                <NavItem className='sidebar-navlink-item'>
                  <FontAwesomeIcon icon={faCircle} className="sidebar-dot" />
                  <span>Tipos de Aprendizaje</span>
                </NavItem>
              </NavLink>

              <span className='sidebar-section-title'>Integraciones</span>
              <NavLink to={'/integrations/dislu'} end className={({ isActive }) => isActive ? 'sidebar-navlink-active' : 'sidebar-navlink-inactive'}>
                <NavItem className='sidebar-navlink-item'>
                  <FontAwesomeIcon icon={faCircle} className="sidebar-dot" />
                  <span>Dislu</span>
                </NavItem>
              </NavLink>

            </div>
          )}
        </div>

        <div className="w-100">
          {user?.role && ['STUDENT', 'TEACHER', 'DIRECTOR'].includes(user.role) && (
            user.profilePicture ? (
              <img src={user.profilePicture} alt="profile" className='sidebar-profile-picture' />
            ) : (
              <img src={default_profile_pic} alt="profile" className='sidebar-profile-picture' />
            )
          )}
          {user?.firstName && user?.lastName && (
            <span className='sidebar-section-title'>{`${user.firstName} ${user.lastName}`}</span>
          )}

          <NavLink to={'/me/profile'} end className={({ isActive }) => isActive ? 'sidebar-navlink-active' : 'sidebar-navlink-inactive'}>
            <NavItem className='sidebar-navlink-item'>
              <FontAwesomeIcon icon={faCircle} className="sidebar-dot" />
              <span>Datos personales</span>
            </NavItem>
          </NavLink>
          {user?.role === 'STUDENT' && (
            <div className="w-100">

              <NavLink end
                to={(user.learningProfile !== 'SIN_PERFIL' && user.learningProfile !== undefined) ? '/me/learning-type/result' : '/me/learning-type'}
                className={({ isActive }) => isActive ? 'sidebar-navlink-active' : 'sidebar-navlink-inactive'}
                state={{ profile: user.learningProfile }}
              >
                <NavItem className='sidebar-navlink-item'>
                  <FontAwesomeIcon icon={faCircle} className="sidebar-dot" />
                  <span>Test de Aprendizaje</span>
                </NavItem>
              </NavLink>
            </div>
          )}

          <NavLink to={'/login'} end className={({ isActive }) => isActive ? 'sidebar-navlink-active' : 'sidebar-navlink-inactive'} onClick={signout}>
            <NavItem className='sidebar-navlink-item'>
              <FontAwesomeIcon icon={faCircle} className="sidebar-dot" />
              <span>Cerrar sesión</span>
            </NavItem>
          </NavLink>
        </div>

      </div>
    </Nav>
  )
}
