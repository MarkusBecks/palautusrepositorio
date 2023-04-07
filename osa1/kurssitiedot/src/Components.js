const CurriculumHeader = () => {
    return (
        <h1>Web development curriculum</h1>
    )
}

const Course = ({ course }) => {
    return (
        <div>
            <CourseHeader course={course} />
            <Content course={course} />
            <Total course={course} />
        </div>

    )
}

const CourseHeader = ({ course }) => {
    return (
        <h2>{course.name}</h2>
    )
}

const Content = ({ course }) => {
    return (
        <div>
            {course.parts.map(part =>
                <p key={part.id}>
                    {part.name} {part.exercises}
                </p>
            )}
        </div>
    )
}

const Total = ({ course }) => {
    const total = course.parts.reduce((sum, part) => {
        return sum + part.exercises;
    }, 0)
    return (
        <p><strong>total of {total} exercises</strong></p>
    )
}

export { CurriculumHeader, Course };