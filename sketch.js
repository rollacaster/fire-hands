let video
let poseNet
let poses = []
let particles = []

const setupParticle = location => ({
  location,
  velocity: [0, 0],
  lifespan: 255
})

function setup() {
  fullscreen()
  noStroke()
  createCanvas(640, 480).parent('sketch')
  video = createCapture(VIDEO)
  video.size(width, height)
  poseNet = ml5.poseNet(video, () => {
    select('#spinner').hide()
    select('canvas').addClass('')
  })
  poseNet.on('pose', results => {
    poses = results
  })
  blendMode(ADD)

  video.hide()
}

const vectorAdd = ([x1, y1], [x2, y2]) => [x1 + x2, y1 + y2]

const drawParticle = ({ location: [x, y], lifespan }) => {
  fill(255, 25, 10, lifespan)
  ellipse(x, y, 100, 100)
}

function draw() {
  clear()
  image(video, 0, 0, width, height)
  drawFire()
}

const updateParticle = ({ velocity, location, lifespan }) => {
  const wind = [random(-0.1, 0.1), 0]
  const gravity = [0.0, -0.02]
  const acceleration = vectorAdd(wind, gravity)
  const newVelocity = vectorAdd(acceleration, velocity)
  const newLocation = vectorAdd(newVelocity, location)
  return {
    lifespan: lifespan - 1,
    velocity: newVelocity,
    location: newLocation
  }
}

const drawFire = () => {
  for (let i = 0; i < poses.length; i++) {
    let skeleton = poses[i].skeleton
    for (let parts of skeleton) {
      for (let subPart of parts) {
        if (subPart.part === 'leftWrist') {
          particles.push(
            setupParticle([subPart.position.x, subPart.position.y - 40])
          )
        }
        if (subPart.part === 'rightWrist') {
          particles.push(
            setupParticle([subPart.position.x, subPart.position.y - 40])
          )
        }
      }
    }
  }
  let i = 0
  for (let particle of particles) {
    drawParticle(particle)
    particles[i] = updateParticle(particle)
    i++
  }
}
