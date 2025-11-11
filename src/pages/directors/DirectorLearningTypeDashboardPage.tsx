import { useEffect, useState } from "react";
import { Table } from "reactstrap";
import Select from 'react-select';
import { get } from "../../utils/network";
import PageWrapper from "../../components/PageWrapper";
import TableSkeleton from "../../components/TableSkeleton";

interface ICourse {
  id: string;
  courseName: string;
}

interface IStudent {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  learningProfile: string;
  courseId?: string;
}

interface ITeacher {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

const learningTypes = [
  { value: '', label: 'Todos' },
  { value: 'ACOMODADOR', label: 'Acomodador' },
  { value: 'DIVERGENTE', label: 'Divergente' },
  { value: 'CONVERGENTE', label: 'Convergente' },
  { value: 'ASIMILADOR', label: 'Asimilador' },
];

export const DirectorLearningTypeDashboardPage = () => {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [courseId, setCourseId] = useState<string>('');
  const [selectedLearningType, setSelectedLearningType] = useState<string>('');
  const [selectedStudent, setSelectedStudent] = useState<IStudent | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<ITeacher | null>(null);
  const [students, setStudents] = useState<IStudent[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<IStudent[]>([]);
  const [teachers, setTeachers] = useState<ITeacher[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    get('/directors/courses/')
      .then(res => res.json())
      .then(res => res.data)
      .then((data: ICourse[]) => {
        const allCoursesOption = { id: '', courseName: 'Todos los cursos' };
        setCourses([allCoursesOption, ...(data || [])]);
      })
      .catch(() => {
        setCourses([{ id: '', courseName: 'Todos los cursos' }]);
      });

    fetchStudents();
    fetchTeachers();
  }, []);

  const fetchStudents = async () => {
    await get('/students/learning-profile')
      .then(res => res.json())
      .then(res => res.data)
      .then((data: IStudent[]) => {
        setStudents(data || []);
      })
      .catch(() => {
        setStudents([]);
      });
  };

  const fetchTeachers = async () => {
    await get('/teachers')
      .then(res => res.json())
      .then(res => res.data)
      .then((data: any[]) => {
        if (!data || !Array.isArray(data)) {
          setTeachers([]);
          return;
        }
        setTeachers(data.map(teacherObject => ({
          id: teacherObject.user._id,
          firstName: teacherObject.user.firstName,
          lastName: teacherObject.user.lastName,
          email: teacherObject.user.email,
        })));
      })
      .catch(() => {
        setTeachers([]);
      });
  };

  useEffect(() => {
    fetchFilteredStudents();
  }, [courseId, selectedLearningType, selectedStudent, selectedTeacher]);

  const fetchFilteredStudents = async () => {
    setLoading(true);
    let endpoint = '/students/learning-profile';
    const queryParams: string[] = [];

    if (courseId) queryParams.push(`courseId=${courseId}`);
    if (selectedLearningType) queryParams.push(`learningProfile=${selectedLearningType}`);
    if (selectedStudent) queryParams.push(`studentUserId=${selectedStudent.id}`);
    if (selectedTeacher) queryParams.push(`teacherUserId=${selectedTeacher.id}`);

    if (queryParams.length > 0) endpoint += `?${queryParams.join('&')}`;

    await get(endpoint)
      .then(res => res.json())
      .then(res => {
        const data = res.data;
        setFilteredStudents(data || []);
      })
      .catch(() => setFilteredStudents([]))
      .finally(() => setLoading(false));
  };

  return (
    <PageWrapper title="Tipos de Aprendizaje de Estudiantes">
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        height: '100%',
      }}>
        <div className="d-flex flex-row align-items-center w-100 gap-2 mb-3">
          <div className="d-flex flex-column w-50">
            <label>Curso</label>
            <Select
              options={courses.map(course => ({ value: course.id, label: course.courseName }))}
              placeholder="Seleccione un curso"
              isClearable
              onChange={(selectedOption) => setCourseId(selectedOption ? selectedOption.value : '')}
            />
          </div>
          <div className="d-flex flex-column w-50">
            <label>Tipo de Aprendizaje</label>
            <Select
              options={learningTypes}
              placeholder="Seleccione un tipo de aprendizaje"
              isClearable
              onChange={(selectedOption) => setSelectedLearningType(selectedOption ? selectedOption.value : '')}
            />
          </div>
        </div>

        <div className="d-flex flex-row align-items-center w-100 gap-2 mb-3">
          <div className="d-flex flex-column w-50 gap-2 mb-3">
            <label>Estudiante</label>
            <Select
              className="w-100"
              placeholder="Seleccione un estudiante"
              isClearable
              options={students.map(student => ({
                value: student.id, label: `${student.firstName} ${student.lastName} - ${student.email}`
              }))}
              onChange={(value) => setSelectedStudent(value ? { id: value.value } as IStudent : null)}
            />
          </div>

          <div className="d-flex flex-column w-50 gap-2 mb-3">
            <label>Docente</label>
            <Select
              className="w-100"
              placeholder="Seleccione un docente"
              isClearable
              options={teachers.map(teacher => ({
                value: teacher.id, label: `${teacher.firstName} ${teacher.lastName} - ${teacher.email}`
              }))}
              onChange={(value) => setSelectedTeacher(value ? { id: value.value } as ITeacher : null)}
            />
          </div>
        </div>

        {loading ? (
          <TableSkeleton columnsCount={5} />
        ) : (
          <Table striped responsive>
            <thead>
              <tr>
                <th className="text-center">Alumno</th>
                <th className="text-center">Email</th>
                <th className="text-center">Tipo de Aprendizaje</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center">
                    <strong>No hay resultados para esa búsqueda</strong>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td className="text-center">{`${student.firstName} ${student.lastName}`}</td>
                    <td className="text-center">{student.email}</td>
                    <td className="text-center">{student.learningProfile === "SIN_PERFIL" ? "SIN PERFIL" : student.learningProfile}</td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        )}
      </div>
    </PageWrapper>
  );
};
