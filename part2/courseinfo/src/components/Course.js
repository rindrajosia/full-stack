import Header from './Header';
import Content from './Content';
import Total from './Total';

const Course = ({course}) => {
  return (
    <>
      {
        course.map(cours => {
          return(
            <div key={cours.id}>
              <Header name={cours.name} />
              <Content parts={cours.parts} />
              <Total parts={cours.parts} />
            </div>
          )
        })
      }
    </>
  )
}

export default Course;
