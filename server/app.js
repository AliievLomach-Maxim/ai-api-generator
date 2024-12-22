const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const swaggerUi = require('swagger-ui-express')
const swaggerJsdoc = require('swagger-jsdoc')
const routes = require('./routes')

const corsOptions = {
  origin: '*', // 'http://localhost:4200'
  methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
  credentials: false,
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Auth-Guard',
    'Apollo-Require-Preflight',
    'access-control-allow-origin',
    'access-control-allow-headers',
    'access-control-allow-methods',
  ],
}

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors(corsOptions))
app.options('*', cors())
app.use(morgan('dev'))
app.use(express.json())
app.use('/api', routes)

// Swagger setup
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: { title: 'API Generator', version: '1.0.0' },
  },
  apis: ['./routes/*.js'],
})
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send({ error: 'Something went wrong!' })
})

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
