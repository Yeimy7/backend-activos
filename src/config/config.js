import dotenv from 'dotenv'
dotenv.config()

export const PORT = process.env.PORT ?? '3000'
export const DB_HOST = process.env.DB_HOST ?? 'localhost'
export const DB_USER = process.env.DB_USER ?? 'root'
export const DB_PASS = process.env.DB_PASS ?? ''
export const DB_DATABASE = process.env.DB_DATABASE ?? 'activos'
export const WORD_SECRET = process.env.WORD_SECRET ?? 'jupiter845'