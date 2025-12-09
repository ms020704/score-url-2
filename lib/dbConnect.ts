import mongoose from 'mongoose'

// MongoDB 연결 유틸리티
const dbConnect = async () => {
  if (mongoose.connection.readyState >= 1) {
    return
  }
  return mongoose.connect(process.env.MONGODB_URL!)
}

export default dbConnect
