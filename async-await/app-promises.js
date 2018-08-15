const users = [
  { id: 1, name: 'Andrew', schoolId: 101 },
  { id: 2, name: 'Jessica', schoolId: 999 },
]

const grades = [
  { id: 1, schoolId: 101, grade: 86 },
  { id: 2, schoolId: 999, grade: 100 },
  { id: 3, schoolId: 101, grade: 80 },
]

!(async () => {
  try {
    console.log(await getUser(2))
    console.log(await getGrades(101))
    console.log(await getStatus(1))
  } catch (err) {
    console.error(err)
  }
})()

//

async function getUser(id) {
  const user = users.find(user => user.id === id)
  if (!user) throw new Error(`No user with id '${id}'`)
  return user
}

async function getGrades(schoolId) {
  return grades.filter(grade => grade.schoolId === schoolId)
}

async function getStatus(userId) {
  const user = await getUser(userId)
  const grades = await getGrades(user.schoolId)
  const average = Math.round(mean(grades.map(_ => _.grade)))
  return `${user.name} has an average of ${average}`
}

function mean(numbers) {
  const sum = numbers.reduce((total, n) => total + n, 0)
  return sum === 0 ? 0 : sum / numbers.length
}
